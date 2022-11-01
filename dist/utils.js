"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGlobalSource = exports.parseErr = exports.err = void 0;
let file = "";
function err(msg) {
    console.error(`[ERROR] ${msg}`);
    process.exit(1);
}
exports.err = err;
function parseErr(msg, row, column) {
    console.error(`[PARSER] [ERROR] At row ${row}, column ${column}: ${msg}\n${file.split("\n")[row - 1]}\n${"^".padStart(column - 1, " ")}`);
    process.exit(1);
}
exports.parseErr = parseErr;
function setupGlobalSource(_file) {
    file = _file;
}
exports.setupGlobalSource = setupGlobalSource;
