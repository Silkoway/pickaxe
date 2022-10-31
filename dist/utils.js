"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErr = exports.err = void 0;
function err(msg) {
    console.error(`[ERROR] ${msg}`);
    process.exit(1);
}
exports.err = err;
function parseErr(msg, row, column) {
    console.error(`[PARSER] [ERROR] At row ${row}, column ${column}: ${msg}`);
    process.exit(1);
}
exports.parseErr = parseErr;
