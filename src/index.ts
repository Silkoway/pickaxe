#!/usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { err, setupGlobalSource } from './utils'
import fs from 'fs'
import { Lexer, TokenType } from './lexer'
import { Parser } from './parser'
const argv: any = yargs(hideBin(process.argv)).argv

let filename = argv._[0]

if (filename === undefined) {
    err("File path not specified. Use it like this: `pickc {filepath}`")
}
if (fs.existsSync(filename)) {
    let file = fs.readFileSync(filename, 'utf8')
    setupGlobalSource(file)
    let lexer = new Lexer(file)
    console.log(lexer.lex().map(d => ({type: TokenType[d.type], value: d.value})))
    let parser = new Parser(lexer.lex())
    fs.writeFileSync("tests/out.json", JSON.stringify(parser.parse(), null, 4))
    console.log("Parsed, written data into 'tests/out.json'")
    
} else {
    err("File path specified does not lead to an existing file. Are you sure you typed the right path?")
}
