export type ExcludeMethods<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
>
export type TestSiteTarget = 'programmers' | 'baekjoon'

export interface CLIArgs {
  url: string
  path: string
  target: TestSiteTarget
}

type CLI_KEYS = 'number' | 'path'
export type executionArgs = {
  [key in CLI_KEYS]?: string
} & { help: boolean; target: TestSiteTarget }
