"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHasRequireValueAndParse = void 0;
const checkHasRequireValueAndParse = (arg, checkList = []) => {
    const { help, ...shouldCheckArg } = arg;
    const missingKey = checkList.find((key) => {
        return !shouldCheckArg[key];
    });
    if (!['programmers', 'baekjoon'].includes(shouldCheckArg.target)) {
        throw new Error('올바른 타겟을 선택해주세요.');
    }
    if (missingKey)
        throw new Error(`${missingKey}는 필수입니다.`);
    return arg;
};
exports.checkHasRequireValueAndParse = checkHasRequireValueAndParse;
