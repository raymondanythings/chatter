"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const commander_1 = require("commander");
const cli_helper_1 = require("./helper/cli.helper");
class CLI extends commander_1.Command {
    async execution(executionFn) {
        try {
            const parsedArgs = (0, cli_helper_1.checkHasRequireValueAndParse)(this.opts(), ['number', 'path', 'target']);
            if (parsedArgs.help) {
                return this.help();
            }
            await executionFn(parsedArgs);
        }
        catch (err) {
            console.log(`\nERROR : ${err.message}\n`);
            this.help();
        }
        return this;
    }
}
exports.CLI = CLI;
