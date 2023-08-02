import packageJson from '../package.json'
import { CLI } from './CLI'
import { executionArgs } from './types'

import { writeFileSync } from 'fs'
import * as chalk from 'chalk'
import * as cliProgress from 'cli-progress'

import puppeteer from 'puppeteer'
import figlet from 'figlet'
import * as pt from 'path'
import turndown from 'turndown'
import * as turndownPluginGfm from 'turndown-plugin-gfm'

class Chatter {
  private readonly mdService = new turndown()
  private readonly progressService = new cliProgress.SingleBar({
    format: '{message} | ' + '{bar}' + ' | {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    fps: 30,
  })

  private readonly PROGRAMMERS_PREFIX = 'https://school.programmers.co.kr/learn/courses/30/lessons/'
  private readonly BAEKJOON_PREFIX = 'https://www.acmicpc.net/problem/'
  private readonly urls = {
    programmers: this.PROGRAMMERS_PREFIX,
    baekjoon: this.BAEKJOON_PREFIX,
  }
  private readonly progressDuration = 200

  constructor() {
    this.mdService.use([turndownPluginGfm.tables])
  }

  executeCurrentCrawler(args: executionArgs) {
    const { target, number, path } = args
    const url = this.urls[target] + number
    switch (target) {
      case 'baekjoon':
        return this._baekjoon({ url, path })
      case 'programmers':
        return this._programmers({ url, path })
    }
  }

  async progress(message: string = '저장중..') {
    const interval = (this.progressDuration / 10000) * 1000
    this.progressService.start(100, 0, {
      message,
    })
    let step = 0
    return new Promise<void>((resolve) => {
      const id = setInterval(() => {
        if (step >= 100) {
          clearInterval(id)
          this.progressService.update(200)
          console.log('\n')
          resolve()
        } else {
          this.progressService.increment(1)
          step++
        }
      }, interval)
    })
  }

  private async _programmers({ url, path }: { url: string; path: string }) {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    await page.goto(url)
    const title = (await page.$eval('.algorithm-title', (el) => el.textContent)).trim()
    await this.progress(title)
    const testDescriptions = await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll(
          'div.main-section > .guide-section > div.guide-section-description > div.markdown > *',
        ),
      ]
      return elements.map((el) => el.outerHTML)
    })
    if (!testDescriptions.length) {
      throw new Error('문제를 찾지 못했어요. 문제번호를 확인해주세요.')
    }
    const urlList = url.split('/')
    const location = pt.join(path, `${title ?? urlList[urlList.length - 1]}.md`)
    console.log(`경로 : ${location}`)
    const descriptionResult = this.mdService.turndown(
      `<h1>${title}</h1>\n` + '<h5>문제설명</h5>\n' + testDescriptions.join('\n'),
    )
    writeFileSync(location, descriptionResult)
    await browser.close()
    console.log('\n\nDONE!')
  }

  private async _baekjoon({ url, path }: { url: string; path: string }) {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    await page.goto(url)

    const title = (await page.$eval('#problem_title', (el) => el.textContent)).trim()
    await this.progress(title)

    const testDescriptions = await page.evaluate(() => {
      const elements = [...document.querySelectorAll('#problem-body > *')]
      return elements.map((el) => el.outerHTML)
    })
    if (!testDescriptions.length) {
      throw new Error('문제를 찾지 못했어요. 문제번호를 확인해주세요.')
    }
    const urlList = url.split('/')
    const location = pt.join(path, `${title ?? urlList[urlList.length - 1]}.md`)
    console.log(`경로 : ${location}`)
    const descriptionResult = this.mdService.turndown(
      `<h1>${title}</h1>\n` + '<h5>문제설명</h5>\n' + testDescriptions.join('\n'),
    )
    writeFileSync(location, descriptionResult)
    await browser.close()
    console.log('\n\nDONE!')
  }
}

const program = new CLI()
const chatter = new Chatter()

program
  .description("코딩테스트 문제설명 크롤러 'Chatter'")
  .version(packageJson.version, '-v | --version', '현재 버전 표시')
  .option('-n | --number <value> required', '문제번호 (필수)')
  .option('-p | --path  <value>', '설명글을 저장할 위치', './')
  .option('-t | --target <value>', '크롤링 위치 programmers | baekjoon', 'programmers')
  .option('-h | --help', '명령어 도움말 출력')
  .parse(process.argv)
console.log('\n\n', figlet.textSync('Chatter', 'Banner3-D'))
program.execution((args) =>
  chatter.executeCurrentCrawler(args).then(() => {
    process.exit(1)
  }),
)
