import { Token, TokenType } from "./lexer";
import { parseErr } from "./utils";

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
    constructor(instructions: AnyNode[] = [], name: string, type: string, description: string = "") {
        super();
        this.instructions= instructions
        this.desc=description;
        this.name=name;
        this.type=type;
    }
}

type AnyNode = RootNode | UnaryNode | BodyNode;

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
            let type = this.popNext();
            let params: AnyNode[] = [];
            let startparen = this.popNext();
            if (startparen.type !== TokenType.LeftParen) {
                parseErr(`Expected a left parenthesis on event definition, but found token of type ${TokenType[startparen.type]}`, startparen.row, startparen.col)
            }
            while (this.viewNext() !== undefined && this.viewNext().type !== TokenType.RightParen) {
                params.push(this.parseLevel())
            }

            return new BodyNode([], type.value, "event", "Event keyword")

        } else {
            return new UnaryNode("", "Unknown", "Error during parsing or keyword not implemented.")
        }
    }

    viewNext() {
        return this.tokens[0];
    }

    popNext() {
        let o = this.tokens[0]
        this.tokens.splice(0, 1)
        return o
    }
}