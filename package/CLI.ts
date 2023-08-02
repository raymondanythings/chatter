import { Command } from 'commander'
import { checkHasRequireValueAndParse } from './helper/cli.helper'
import { executionArgs } from './types'

export class CLI extends Command {
  async execution(executionFn: (args: executionArgs) => Promise<void>): Promise<this> {
    try {
      const parsedArgs = checkHasRequireValueAndParse(this.opts(), ['number', 'path', 'target'])
      if (parsedArgs.help) {
        return this.help()
      }
      await executionFn(parsedArgs)
    } catch (err) {
      console.log(`\nERROR : ${err.message}\n`)
      this.help()
    }
    return this
  }
}
