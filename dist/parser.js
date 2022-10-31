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
    constructor(instructions = [], name, type, description = "") {
        super();
        this.instructions = [];
        this.desc = "";
        this.instructions = instructions;
        this.desc = description;
        this.name = name;
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
            let type = this.popNext();
            let params = [];
            let startparen = this.popNext();
            if (startparen.type !== lexer_1.TokenType.LeftParen) {
                (0, utils_1.parseErr)(`Expected a left parenthesis on event definition, but found token of type ${lexer_1.TokenType[startparen.type]}`, startparen.row, startparen.col);
            }
            while (this.viewNext() !== undefined && this.viewNext().type !== lexer_1.TokenType.RightParen) {
                params.push(this.parseLevel());
            }
            return new BodyNode([], type.value, "event", "Event keyword");
        }
        else {
            return new UnaryNode("", "Unknown", "Error during parsing or keyword not implemented.");
        }
    }
    viewNext() {
        return this.tokens[0];
    }
    popNext() {
        let o = this.tokens[0];
        this.tokens.splice(0, 1);
        return o;
    }
}
exports.Parser = Parser;
