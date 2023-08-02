import { OptionValues } from 'commander'
import { CLIArgs, executionArgs } from '../types'

export const checkHasRequireValueAndParse = (
  arg: OptionValues,
  checkList: (keyof executionArgs)[] = [],
) => {
  const { help, ...shouldCheckArg } = arg
  const missingKey = checkList.find((key) => {
    return !shouldCheckArg[key]
  })

  if (!['programmers', 'baekjoon'].includes(shouldCheckArg.target)) {
    throw new Error('올바른 타겟을 선택해주세요.')
  }

  if (missingKey) throw new Error(`${missingKey}는 필수입니다.`)
  return arg as executionArgs
}
