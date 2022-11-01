"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_1 = require("./lexer");
const utils_1 = require("./utils");
class Node {
}
class RootNode extends Node {
    constructor(children = [], description = "") {
        super();
        this.children = [];
        this.desc = "Unary Node";
        this.children = children;
        this.desc = description;
    }
}
class UnaryNode extends Node {
    constructor(value, type, description = "") {
        super();
        this.desc = "Unary Node";
        this.value = value;
        this.type = type;
        this.desc = description;
    }
}
class BodyNode extends Node {
    constructor(instructions = [], name, type, params, description = "") {
        super();
        this.instructions = [];
        this.desc = "";
        this.instructions = instructions;
        this.desc = description;
        this.name = name;
        this.type = type;
        this.params = params;
    }
}
class FunctionCallNode extends Node {
    constructor(ids, params, type, desc) {
        super();
        this.ids = ids;
        this.desc = desc;
        this.params = params;
        this.type = type;
    }
}
class Parser {
    constructor(tokens) {
        this.tokens = [];
        this.tokens = tokens;
    }
    parse() {
        let out = new RootNode();
        while (this.viewNext() !== undefined) {
            out.children.push(this.parseLevel());
        }
        return out;
    }
    parseLevel() {
        let p = this.popNext();
        if (p.type === lexer_1.TokenType.ImportKeyword) {
            let library = this.popNext();
            return new UnaryNode(library.value, "import", `Importing "${library.value}" library.`);
        }
        else if (p.type === lexer_1.TokenType.EventKeyword) {
            // ! EVENT DEFINITION ! doing the important thing for eaiser sight //
            let type = this.popNext();
            let params = [];
            let startparen = this.popNext();
            if (startparen.type !== lexer_1.TokenType.LeftParen) {
                (0, utils_1.parseErr)(`Expected a left parenthesis on event definition, but found token of type ${lexer_1.TokenType[startparen.type]}`, startparen.row, startparen.col);
            }
            console.log(lexer_1.TokenType[this.viewNext().type]);
            while (this.viewNext() !== undefined && this.viewNext().type !== lexer_1.TokenType.RightParen) {
                console.log(lexer_1.TokenType[this.viewNext().type]);
                params.push(this.parseLevel());
            }
            console.log(params);
            if (this.viewNext() === undefined) {
                (0, utils_1.parseErr)(`Ending parenthesis not found?`, startparen.row, startparen.col);
            }
            console.log(this.popNext().type);
            let startblock = this.popNext();
            if (startblock.type !== lexer_1.TokenType.LeftCurly) {
                (0, utils_1.parseErr)(`Starting curly bracket not found? `, startblock.row, startblock.col);
            }
            let ins = [];
            while (this.viewNext() !== undefined && this.viewNext().type !== lexer_1.TokenType.RightCurly) {
                ins.push(this.parseLevel());
            }
            this.popNext();
            return new BodyNode(ins, type.value, "event", params, "Event keyword");
        }
        else if (p.type === lexer_1.TokenType.MacroKeyword) {
            let type = this.popNext();
            let params = [];
            let startparen = this.popNext();
            if (startparen.type !== lexer_1.TokenType.LeftParen) {
                (0, utils_1.parseErr)(`Expected a left parenthesis on macro definition, but found token of type ${lexer_1.TokenType[startparen.type]}`, startparen.row, startparen.col);
            }
            console.log(lexer_1.TokenType[this.viewNext().type]);
            while (this.viewNext() !== undefined && this.viewNext().type !== lexer_1.TokenType.RightParen) {
                console.log(lexer_1.TokenType[this.viewNext().type]);
                params.push(this.parseLevel());
            }
            console.log(params);
            if (this.viewNext() === undefined) {
                (0, utils_1.parseErr)(`Ending parenthesis not found?`, startparen.row, startparen.col);
            }
            console.log(this.popNext().type);
            let startblock = this.popNext();
            if (startblock.type !== lexer_1.TokenType.LeftCurly) {
                (0, utils_1.parseErr)(`Starting curly bracket not found? `, startblock.row, startblock.col);
            }
            let ins = [];
            while (this.viewNext() !== undefined && this.viewNext().type !== lexer_1.TokenType.RightCurly) {
                ins.push(this.parseLevel());
            }
            this.popNext();
            return new BodyNode(ins, type.value, "macro", params, "Macro keyword");
        }
        else if ((p === null || p === void 0 ? void 0 : p.type) === lexer_1.TokenType.StringLiteral) {
            return new UnaryNode(p.value, "string_literal", "String literal");
        }
        else {
            let l = this.viewNext();
            if ((l === null || l === void 0 ? void 0 : l.type) === lexer_1.TokenType.LeftParen) {
                l = this.popNext();
                let params = [];
                while (this.viewNext() !== undefined && this.viewNext().type !== lexer_1.TokenType.RightParen) {
                    console.log(lexer_1.TokenType[this.viewNext().type]);
                    params.push(this.parseLevel());
                }
                this.popNext();
                return new FunctionCallNode(p.value.split("."), params, "func_call", "Calling function");
            }
            else {
                return new UnaryNode(p.value, "Object", "Either object or not implemented" + `{type: '${lexer_1.TokenType[p.type]}', value: '${p.value}'}`);
            }
        }
    }
    viewNext() {
        //console.log(this.tokens)
        return this.tokens[0];
    }
    popNext() {
        let o = this.tokens[0];
        this.tokens.splice(0, 1);
        return o;
    }
}
exports.Parser = Parser;
