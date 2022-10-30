"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = void 0;
function err(msg) {
    console.error(`[ERROR] ${msg}`);
    process.exit(1);
}
exports.err = err;
