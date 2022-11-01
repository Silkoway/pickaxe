import { Token, TokenType } from "./lexer";
import { err, parseErr } from "./utils";

class Node {
    
}

class RootNode extends Node {
    children: AnyNode[] = [];
    desc: string = "Unary Node"
    constructor(children: AnyNode[] = [], description: string = "") {
        super();
        this.children = children;
        this.desc = description;
    }
}

class UnaryNode extends Node {
    value: string | AnyNode;
    desc: string = "Unary Node"
    type: string
    constructor(value: string | AnyNode, type: string, description: string = "") {
        super()
        this.value = value;
        this.type = type
        this.desc = description;
    }
}

class BodyNode extends Node {
    instructions: AnyNode[] = [];
    desc: string = ""
    name: string
    type: string
    params: AnyNode[]
    constructor(instructions: AnyNode[] = [], name: string, type: string, params: AnyNode[], description: string = "") {
        super();
        this.instructions= instructions
        this.desc=description;
        this.name=name;
        this.type=type;
        this.params = params
    }
}

class FunctionCallNode extends Node {
    ids: string[];
    desc: string;
    params: AnyNode[];
    type: string;
    constructor(ids: string[], params: AnyNode[], type: string, desc: string) {
        super();
        this.ids = ids;
        this.desc = desc;
        this.params = params;
        this.type = type;
    }
}

type AnyNode = RootNode | UnaryNode | BodyNode | FunctionCallNode;

export class Parser {
    tokens: Token[] = [];
    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse() {
        let out: RootNode = new RootNode();
        while (this.viewNext() !== undefined) {
            out.children.push(this.parseLevel())
        }
        return out
    }

    parseLevel() {
        let p = this.popNext();
        if (p.type === TokenType.ImportKeyword) {
            let library = this.popNext();
            return new UnaryNode(library.value, "import", `Importing "${library.value}" library.`)
        } else if (p.type === TokenType.EventKeyword) {
            // ! EVENT DEFINITION ! doing the important thing for eaiser sight //
            let type = this.popNext();
            let params: AnyNode[] = [];
            let startparen = this.popNext();
            if (startparen.type !== TokenType.LeftParen) {
                parseErr(`Expected a left parenthesis on event definition, but found token of type ${TokenType[startparen.type]}`, startparen.row, startparen.col)
            }
            console.log(TokenType[this.viewNext().type])
            while (this.viewNext() !== undefined && this.viewNext().type !== TokenType.RightParen) {
                console.log(TokenType[this.viewNext().type])
                params.push(this.parseLevel())
                
            }
            console.log(params)
            if (this.viewNext() === undefined) {
                parseErr(`Ending parenthesis not found?`, startparen.row, startparen.col)
            }
            console.log(this.popNext().type)
            let startblock = this.popNext();
            if (startblock.type !== TokenType.LeftCurly) {
                parseErr(`Starting curly bracket not found? `, startblock.row, startblock.col)
            }
            let ins: AnyNode[] = []
            while (this.viewNext() !== undefined && this.viewNext().type !== TokenType.RightCurly) {
                ins.push(this.parseLevel())
            }

            this.popNext()


            return new BodyNode(ins, type.value, "event", params, "Event keyword")

        } else if (p.type === TokenType.MacroKeyword) {

            let type = this.popNext();
            let params: AnyNode[] = [];
            let startparen = this.popNext();
            if (startparen.type !== TokenType.LeftParen) {
                parseErr(`Expected a left parenthesis on macro definition, but found token of type ${TokenType[startparen.type]}`, startparen.row, startparen.col)
            }
            console.log(TokenType[this.viewNext().type])
            while (this.viewNext() !== undefined && this.viewNext().type !== TokenType.RightParen) {
                console.log(TokenType[this.viewNext().type])
                params.push(this.parseLevel())
                
            }
            console.log(params)
            if (this.viewNext() === undefined) {
                parseErr(`Ending parenthesis not found?`, startparen.row, startparen.col)
            }
            console.log(this.popNext().type)
            let startblock = this.popNext();
            if (startblock.type !== TokenType.LeftCurly) {
                parseErr(`Starting curly bracket not found? `, startblock.row, startblock.col)
            }
            let ins: AnyNode[] = []
            while (this.viewNext() !== undefined && this.viewNext().type !== TokenType.RightCurly) {
                ins.push(this.parseLevel())
            }

            this.popNext()


            return new BodyNode(ins, type.value, "macro", params, "Macro keyword")

        } else if (p?.type === TokenType.StringLiteral) {
            return new UnaryNode(p.value, "string_literal", "String literal")
        } else {
            let l  = this.viewNext();
            if (l?.type === TokenType.LeftParen) {
                l = this.popNext();
                let params: AnyNode[] = [];
                while (this.viewNext() !== undefined && this.viewNext().type !== TokenType.RightParen) {
                    console.log(TokenType[this.viewNext().type])
                    params.push(this.parseLevel())
                }

                this.popNext();

                return new FunctionCallNode(p.value.split("."), params, "func_call", "Calling function")

            } else {
                return new UnaryNode(p.value, "Object", "Either object or not implemented" + `{type: '${TokenType[p.type]}', value: '${p.value}'}`)
            }
        }
    }

    viewNext() {
        //console.log(this.tokens)
        return this.tokens[0];
    }

    popNext() {
        let o = this.tokens[0]
        this.tokens.splice(0, 1)
        return o
    }
}