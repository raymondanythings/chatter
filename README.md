<p align="center">
  <img src="/misc/readme/logo.png#gh-dark-mode-only" />
</p>
# chatter

공부도 하고 기록도 해야되지만,너무너무 귀찮아서 만든 nodejs 기반 코딩테스트 문제설명 크롤링-cli 라이브러리 입니다.

## Installation


```sh
npm i -g chatter-cli
```
```sh
yarn i -g chatter-cli
```

## Example

![output](https://github.com/raymondanythings/chatter/assets/73725736/f5b0179d-93bd-476e-af71-cd043e2e1de0)

## Usage

```sh
ct --help
```

```sh
Usage: ct [options]

코딩테스트 문제설명 크롤러 'Chatter'

Options:
  -v | --version                  현재 버전 표시
  -n | --number <value> required  문제번호 (필수)
  -p | --path  <value>            설명글을 저장할 위치 (default: "./")
  -t | --target <value>           크롤링 위치 programmers | baekjoon (default: "programmers")
  -h | --help                     명령어 도움말 출력
```

### 문제번호 확인 방법
- 프로그래머스
![programmers](/misc/readme/programmers_example.png)

- 백준
![programmers](/misc/readme/baekjoon_example.png)
