"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["EventKeyword"] = 0] = "EventKeyword";
    TokenType[TokenType["Unknown"] = 1] = "Unknown";
    TokenType[TokenType["LeftParen"] = 2] = "LeftParen";
    TokenType[TokenType["RightParen"] = 3] = "RightParen";
    TokenType[TokenType["LeftSquare"] = 4] = "LeftSquare";
    TokenType[TokenType["RightSquare"] = 5] = "RightSquare";
    TokenType[TokenType["LeftCurly"] = 6] = "LeftCurly";
    TokenType[TokenType["RightCurly"] = 7] = "RightCurly";
    TokenType[TokenType["FunctionKeyword"] = 8] = "FunctionKeyword";
    TokenType[TokenType["ExportKeyword"] = 9] = "ExportKeyword";
    TokenType[TokenType["ReturnKeyword"] = 10] = "ReturnKeyword";
    TokenType[TokenType["MacroKeyword"] = 11] = "MacroKeyword";
    TokenType[TokenType["StringLiteral"] = 12] = "StringLiteral";
    TokenType[TokenType["LetKeyword"] = 13] = "LetKeyword";
    TokenType[TokenType["EqualityOperator"] = 14] = "EqualityOperator";
    TokenType[TokenType["AssignmentOperator"] = 15] = "AssignmentOperator";
    TokenType[TokenType["AdditionOperator"] = 16] = "AdditionOperator";
    TokenType[TokenType["SubtractionOperator"] = 17] = "SubtractionOperator";
    TokenType[TokenType["MultiplicationOperator"] = 18] = "MultiplicationOperator";
    TokenType[TokenType["DivisionOperator"] = 19] = "DivisionOperator";
    TokenType[TokenType["GTEOperator"] = 20] = "GTEOperator";
    TokenType[TokenType["LTEOperator"] = 21] = "LTEOperator";
    TokenType[TokenType["GTOperator"] = 22] = "GTOperator";
    TokenType[TokenType["LTOperator"] = 23] = "LTOperator";
    TokenType[TokenType["IfKeyword"] = 24] = "IfKeyword";
    TokenType[TokenType["ForKeyword"] = 25] = "ForKeyword";
    TokenType[TokenType["WhileKeyword"] = 26] = "WhileKeyword";
    TokenType[TokenType["ImportKeyword"] = 27] = "ImportKeyword";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class Lexer {
    constructor(input) {
        this.input = "";
        this.input = input.replace(/ +/g, " ").replace(/\r/g, "");
    }
    lex() {
        let col = 1;
        let row = 1;
        let buffer = "";
        let tokens = [];
        let instring = false;
        let escaped = false;
        const pushes = [
            { keyword: "event", _enum: TokenType.EventKeyword },
            { keyword: "fn", _enum: TokenType.FunctionKeyword },
            { keyword: "exp", _enum: TokenType.ExportKeyword },
            { keyword: "return", _enum: TokenType.ReturnKeyword },
            { keyword: "macro", _enum: TokenType.MacroKeyword },
            { keyword: "let", _enum: TokenType.LetKeyword },
            { keyword: "if", _enum: TokenType.IfKeyword },
            { keyword: "else", _enum: TokenType.LetKeyword },
            { keyword: "for", _enum: TokenType.ForKeyword },
            { keyword: "while", _enum: TokenType.WhileKeyword },
            { keyword: "import", _enum: TokenType.ImportKeyword },
        ];
        const ops = [
            { keyword: "(", _enum: TokenType.LeftParen },
            { keyword: ")", _enum: TokenType.RightParen },
            { keyword: '[', _enum: TokenType.LeftSquare },
            { keyword: "]", _enum: TokenType.RightSquare },
            { keyword: "{", _enum: TokenType.LeftCurly },
            { keyword: "}", _enum: TokenType.RightCurly },
            { keyword: "==", _enum: TokenType.EqualityOperator },
            { keyword: "=", _enum: TokenType.AssignmentOperator },
            { keyword: "+", _enum: TokenType.AdditionOperator },
            { keyword: "-", _enum: TokenType.SubtractionOperator },
            { keyword: "*", _enum: TokenType.MultiplicationOperator },
            { keyword: "/", _enum: TokenType.DivisionOperator },
            { keyword: ">=", _enum: TokenType.GTEOperator },
            { keyword: "<=", _enum: TokenType.LTEOperator },
            { keyword: ">", _enum: TokenType.GTOperator },
            { keyword: "<", _enum: TokenType.LTOperator },
        ];
        for (let i = 0; i < this.input.length; i++) {
            col++;
            if (this.input[i] === "\n") {
                row++;
                col = 1;
            }
            let parse = () => {
                let parsed = false;
                pushes.forEach(({ keyword, _enum }) => {
                    if (!parsed && buffer === keyword) {
                        buffer = "";
                        tokens.push({ type: _enum, value: "", col: col, row: row });
                        parsed = true;
                    }
                });
                if (!parsed)
                    tokens.push({ type: TokenType.Unknown, value: buffer, col: col, row: row });
                buffer = "";
            };
            if (this.input[i] === "\"" && !instring && !escaped) {
                instring = true;
            }
            else if (instring && this.input[i] === "\"" && !escaped) {
                instring = false;
                tokens.push({ type: TokenType.StringLiteral, value: buffer, col: col, row: row });
                buffer = "";
            }
            else if (this.input[i] === "\\") {
                escaped = true;
            }
            else if (!instring) {
                let parsed = false;
                ops.forEach(({ keyword, _enum }) => {
                    if (!parsed && this.input[i] === keyword) {
                        parse();
                        tokens.push({ type: _enum, value: "", col: col, row: row });
                        parsed = true;
                    }
                });
                if ((this.input[i] === " " || this.input[i] === ";" || this.input[i] === "\n") && !parsed) {
                    parse();
                }
                else {
                    if (!parsed) {
                        buffer += this.input[i];
                    }
                }
            }
            else if (instring) {
                if (escaped) {
                    escaped = false;
                    buffer += eval(`(function () {return "\\${this.input[i]}"})()`);
                }
                else
                    buffer += this.input[i];
            }
        }
        return tokens.filter(d => !(d.type === TokenType.Unknown && (d.value === "" || d.value === "\n")));
    }
}
exports.Lexer = Lexer;
