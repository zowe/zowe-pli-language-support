import { TokenType, Lexer as ChevrotainLexer, IToken, TokenTypeDictionary, ILexingError, createTokenInstance } from "chevrotain";
import { PliPreprocessorParser, PreprocessorError as PPError } from "./pli-preprocessor-parser";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorLexerState, PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { Pl1Services } from "../pli-module";
import { TokenPicker } from "./pli-token-picker-optimizer";
import { PPInstruction } from "./pli-preprocessor-instructions";
import { PPAssign, PPDeclaration, PPExpression, PPNumber, PPStatement, PPString } from "./pli-preprocessor-ast";

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

export class PliPreprocessorLexer {
    private readonly hiddenTokenTypes: TokenType[];
    private readonly normalTokenTypePicker: TokenPicker;
    private readonly vocabulary: TokenType[];
    private readonly preprocessorParser: PliPreprocessorParser;
    public readonly tokenTypeDictionary: TokenTypeDictionary;
    public readonly numberTokenType: TokenType;
    public readonly idTokenType: TokenType;

    constructor(services: Pl1Services) {
        const tokenPickerOptimizer = services.parser.TokenPickerOptimizer;
        this.preprocessorParser = services.parser.PreprocessorParser;
        this.vocabulary = services.parser.TokenBuilder.buildTokens(services.Grammar, { caseInsensitive: true }) as TokenType[];
        this.tokenTypeDictionary = {};
        for (const token of this.vocabulary) {
            this.tokenTypeDictionary[token.name] = token;
        }
        this.hiddenTokenTypes = this.vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);

        const normalTokenTypes = [PreprocessorTokens.Percentage].concat(this.vocabulary.filter(v => !this.hiddenTokenTypes.includes(v)));
        this.numberTokenType = normalTokenTypes.find(tk => tk.name === "NUMBER")!;
        this.idTokenType = normalTokenTypes.find(tk => tk.name === "ID")!;
        this.normalTokenTypePicker = tokenPickerOptimizer.optimize(normalTokenTypes);
    }

    tokenize(text: string) {
        const program: Array<PPInstruction> = [];
        const errors: ILexingError[] = [];
        let state: PreprocessorLexerState = new PliPreprocessorLexerState(text);
        while (!state.eof()) {
            this.skipHiddenTokens(state);
            const statement = this.readPPStatement(state);
            if (statement) {
                if (statement.type === 'skip') {
                    //+1 also skip the current line!
                    state.advanceLines(statement.lineCount + 1)
                } else if (statement.type === 'error') {
                    errors.push(statement);
                } else if (statement.type === 'declare') {
                    for (const decl of statement.declarations) {
                        this.handleDeclaration(decl, program);
                    }
                } else if (statement.type === 'assign') {
                    this.handleAssignment(state, statement, program);
                } else {
                    //TODO other preprocessor statements
                }
            } else {
                this.handlePliTokens(state, program);
            }
        }
        program.push({ type: 'halt' });
        //this.printProgram(program);
        return {
            program,
            errors
        };
    }

    private printProgram(program: PPInstruction[]) {
        console.log(JSON.stringify(program, (key, value) => {
            if (["", "type", "name", "value", "image"].includes(key)) {
                return value;
            }
            if (key === "tokenType") {
                const tokenType = value as TokenType;
                return tokenType.name;
            }
            if (!isNaN(parseInt(key))) {
                return value;
            }
            return undefined;
        }, 2));
    }

    private handlePliTokens(state: PreprocessorLexerState, program: PPInstruction[]) {
        let token: IToken | undefined = undefined;
        let list: IToken[] = [];
        let hadConcat = false;
        do {
            token = this.scanInput(state);
            if (token) {
                if (token.image === '%' || token.image === ';') {
                    if (token.image === ';') {
                        list.push(token);
                    }
                    program.push({
                        type: "push",
                        value: list
                    });
                    program.push({
                        type: "scan",
                    });
                    if (hadConcat) {
                        program.push({
                            type: "concat",
                        });
                        //TODO really needed here?
                        program.push({
                            type: "scan",
                        });
                        hadConcat = false;
                    }
                    if (token.image === '%') {
                        hadConcat = true;
                    } else { // token.image === ';'
                        program.push({
                            type: "print",
                        });
                    }
                    list = [];
                } else {
                    list.push(token);
                }
            }
        } while (token && token.image !== ';');
    }

    private handleAssignment(state: PreprocessorLexerState, statement: PPAssign, program: PPInstruction[]) {
        this.handleExpression(state, statement.value, program);
        program.push({
            type: 'set',
            name: statement.name,
        });
    }

    private handleExpression(state: PreprocessorLexerState, expression: PPExpression, program: PPInstruction[]) {
        switch (expression.type) {
            case "string": {
                this.handleStringLiteral(state, expression, program);
                break;
            }
            case "number": {
                this.handleNumberLiteral(expression, program);
                break;
            }
        }

    }

    private handleNumberLiteral(expression: PPNumber, program: PPInstruction[]) {
        program.push({
            type: 'push',
            value: [createTokenInstance(this.numberTokenType, expression.value.toString(), 0, 0, 0, 0, 0, 0)]
        });
    }

    private handleStringLiteral(state: PreprocessorLexerState, expression: PPString, program: PPInstruction[]) {
        if (state.pushText(expression.value)) {
            const tokens: IToken[] = [];
            const topFrame = state.top()!;
            while (state.top() === topFrame) {
                for (const tokenType of this.hiddenTokenTypes.concat(this.normalTokenTypePicker.pickTokenTypes(topFrame.text.charCodeAt(topFrame.offset)))) {
                    const token = state.tryConsume(tokenType);
                    if (!token) {
                        continue;
                    }
                    tokens.push(token);
                }
            }
            program.push({
                type: 'push',
                value: tokens
            });
        } else {
            program.push({
                type: 'push',
                value: []
            });
        }
    }

    private handleDeclaration(decl: PPDeclaration, program: PPInstruction[]) {
        switch (decl.type) {
            case 'builtin':
                //TODO builtin declarations
                break;
            case 'entry':
                //TODO entry declarations
                break;
            case "character":
                program.push({
                    type: 'push',
                    value: [],
                });
                program.push({
                    type: 'set',
                    name: decl.name,
                });
                program.push({
                    type: 'activate',
                    name: decl.name,
                    scanMode: decl.scanMode,
                });
                break;
            case "fixed":
                program.push({
                    type: 'push',
                    value: [createTokenInstance(this.numberTokenType, "0", 0, 0, 0, 0, 0, 0)],
                });
                program.push({
                    type: 'set',
                    name: decl.name,
                });
                program.push({
                    type: 'activate',
                    name: decl.name,
                    scanMode: decl.scanMode,
                });
                break;
        }
    }

    protected scanInput(state: PreprocessorLexerState): IToken | undefined {
        if (state.eof()) {
            return undefined;
        }
        const topFrame = state.top()!;
        for (const tokenType of this.hiddenTokenTypes.concat(this.normalTokenTypePicker.pickTokenTypes(topFrame.text.charCodeAt(topFrame.offset)))) {
            const token = state.tryConsume(tokenType);
            if (!token) {
                continue;
            }
            return token;
        }
        return undefined;
    };

    protected skipHiddenTokens(state: PreprocessorLexerState) {
        while (this.hiddenTokenTypes.some(h => state.tryConsume(h) !== undefined));
    };

    protected readPPStatement(state: PreprocessorLexerState): PPStatement | PPError | undefined {
        if (state.eof() || !state.tryConsume(PreprocessorTokens.Percentage)) {
            return undefined;
        }
        const tokens = this.tokenizeUntilSemicolon(state, AllPreprocessorTokens);
        const parserState = this.preprocessorParser.initializeState(tokens);
        return this.preprocessorParser.start(parserState);
    }

    protected isIdentifier(token: IToken) {
        return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    }

    protected tokenizeUntilSemicolon(state: PreprocessorLexerState, allowedTokenTypes: TokenType[]) {
        const result: IToken[] = [];
        let foundAny: boolean;
        do {
            foundAny = false;
            this.skipHiddenTokens(state);
            for (const tokenType of allowedTokenTypes) {
                const token = state.tryConsume(tokenType);
                if (token) {
                    result.push(token);
                    foundAny = true;
                    if (token.image === ';') {
                        return result;
                    }
                    break;
                }
            }
        } while (foundAny);
        return result;
    }
}