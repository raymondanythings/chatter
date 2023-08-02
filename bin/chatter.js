"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const package_json_1 = tslib_1.__importDefault(require("../package.json"));
const CLI_1 = require("./CLI");
const fs_1 = require("fs");
const cliProgress = tslib_1.__importStar(require("cli-progress"));
const puppeteer_1 = tslib_1.__importDefault(require("puppeteer"));
const figlet_1 = tslib_1.__importDefault(require("figlet"));
const pt = tslib_1.__importStar(require("path"));
const turndown_1 = tslib_1.__importDefault(require("turndown"));
const turndownPluginGfm = tslib_1.__importStar(require("turndown-plugin-gfm"));
class Chatter {
    mdService = new turndown_1.default();
    progressService = new cliProgress.SingleBar({
        format: '{message} | ' + '{bar}' + ' | {percentage}%',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        fps: 30,
    });
    PROGRAMMERS_PREFIX = 'https://school.programmers.co.kr/learn/courses/30/lessons/';
    BAEKJOON_PREFIX = 'https://www.acmicpc.net/problem/';
    urls = {
        programmers: this.PROGRAMMERS_PREFIX,
        baekjoon: this.BAEKJOON_PREFIX,
    };
    progressDuration = 200;
    constructor() {
        this.mdService.use([turndownPluginGfm.tables]);
    }
    executeCurrentCrawler(args) {
        const { target, number, path } = args;
        const url = this.urls[target] + number;
        switch (target) {
            case 'baekjoon':
                return this._baekjoon({ url, path });
            case 'programmers':
                return this._programmers({ url, path });
        }
    }
    async progress(message = '저장중..') {
        const interval = (this.progressDuration / 10000) * 1000;
        this.progressService.start(100, 0, {
            message,
        });
        let step = 0;
        return new Promise((resolve) => {
            const id = setInterval(() => {
                if (step >= 100) {
                    clearInterval(id);
                    this.progressService.update(200);
                    console.log('\n');
                    resolve();
                }
                else {
                    this.progressService.increment(1);
                    step++;
                }
            }, interval);
        });
    }
    async _programmers({ url, path }) {
        const browser = await puppeteer_1.default.launch({
            headless: 'new',
        });
        const page = await browser.newPage();
        await page.goto(url);
        const title = (await page.$eval('.algorithm-title', (el) => el.textContent)).trim();
        await this.progress(title);
        const testDescriptions = await page.evaluate(() => {
            const elements = [
                ...document.querySelectorAll('div.main-section > .guide-section > div.guide-section-description > div.markdown > *'),
            ];
            return elements.map((el) => el.outerHTML);
        });
        if (!testDescriptions.length) {
            throw new Error('문제를 찾지 못했어요. 문제번호를 확인해주세요.');
        }
        const urlList = url.split('/');
        const location = pt.join(path, `${title ?? urlList[urlList.length - 1]}.md`);
        console.log(`경로 : ${location}`);
        const descriptionResult = this.mdService.turndown(`<h1>${title}</h1>\n` + '<h5>문제설명</h5>\n' + testDescriptions.join('\n'));
        (0, fs_1.writeFileSync)(location, descriptionResult);
        await browser.close();
        console.log('\n\nDONE!');
    }
    async _baekjoon({ url, path }) {
        const browser = await puppeteer_1.default.launch({
            headless: 'new',
        });
        const page = await browser.newPage();
        await page.goto(url);
        const title = (await page.$eval('#problem_title', (el) => el.textContent)).trim();
        await this.progress(title);
        const testDescriptions = await page.evaluate(() => {
            const elements = [...document.querySelectorAll('#problem-body > *')];
            return elements.map((el) => el.outerHTML);
        });
        if (!testDescriptions.length) {
            throw new Error('문제를 찾지 못했어요. 문제번호를 확인해주세요.');
        }
        const urlList = url.split('/');
        const location = pt.join(path, `${title ?? urlList[urlList.length - 1]}.md`);
        console.log(`경로 : ${location}`);
        const descriptionResult = this.mdService.turndown(`<h1>${title}</h1>\n` + '<h5>문제설명</h5>\n' + testDescriptions.join('\n'));
        (0, fs_1.writeFileSync)(location, descriptionResult);
        await browser.close();
        console.log('\n\nDONE!');
    }
}
const program = new CLI_1.CLI();
const chatter = new Chatter();
program
    .description("코딩테스트 문제설명 크롤러 'Chatter'")
    .version(package_json_1.default.version, '-v | --version', '현재 버전 표시')
    .option('-n | --number <value> required', '문제번호 (필수)')
    .option('-p | --path  <value>', '설명글을 저장할 위치', './')
    .option('-t | --target <value>', '크롤링 위치 programmers | baekjoon', 'programmers')
    .option('-h | --help', '명령어 도움말 출력')
    .parse(process.argv);
console.log('\n\n', figlet_1.default.textSync('Chatter', 'Banner3-D'));
program.execution((args) => chatter.executeCurrentCrawler(args).then(() => {
    process.exit(1);
}));
