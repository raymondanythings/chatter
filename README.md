
# chatter

공부도 하고 기록도 해야되지만 너무너무 귀찮아서 만든 nodejs 기반 코딩테스트 문제설명 크롤링-cli 라이브러리 입니다.

## Install


```bash
npm i -g gitmoji-cli
yarn i -g gitmoji-cli
```


## Usage

```bash
ct --help
```

```
Usage: ct [options]

코딩테스트 문제설명 크롤러 'Chatter'

Options:
  -v | --version                  현재 버전 표시
  -n | --number <value> required  문제번호 (필수)
  -p | --path  <value>            설명글을 저장할 위치 (default: "./")
  -t | --target <value>           크롤링 위치 programmers | baekjoon (default: "programmers")
  -h | --help                     명령어 도움말 출력
```