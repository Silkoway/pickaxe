#!/usr/bin/env node
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { err } from './utils'
import fs from 'fs'
const argv: any = yargs(hideBin(process.argv)).argv

let filename = argv._[0]

if (filename === undefined) {
    err("File path not specified. Use it like this: `sslc {filepath}`")
}
if (fs.existsSync(filename)) {
    let lexer = new Lexer()
} else {
    err("File path specified does not lead to an existing file. Are you sure you typed the right path?")
}
