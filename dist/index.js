#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv;
let filename = argv._[0];
if (filename === undefined) {
    (0, utils_1.err)("File path not specified. Use it like this: `pickc {filepath}`");
}
if (fs_1.default.existsSync(filename)) {
    let lexer = new lexer_1.Lexer(fs_1.default.readFileSync(filename, 'utf8'));
    let parser = new parser_1.Parser(lexer.lex());
    fs_1.default.writeFileSync("tests/out.json", JSON.stringify(parser.parse(), null, 4));
    console.log("Parsed, written data into 'tests/out.json'");
}
else {
    (0, utils_1.err)("File path specified does not lead to an existing file. Are you sure you typed the right path?");
}
