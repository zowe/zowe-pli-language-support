import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { InitialPreprocessorState, PreprocessorAction, PreprocessorState, Selectors, translatePreprocessorState } from "./pli-preprocessor-state";

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

export class PliPreprocessorLexer {
    private readonly hiddenTokenTypes: TokenType[];
    public readonly normalTokenTypes: TokenType[];
    private readonly idTokenType: TokenType;
    private state: PreprocessorState;

    constructor(vocabulary: TokenType[], text: string) {
        this.hiddenTokenTypes = vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokenTypes = [PreprocessorTokens.Percentage].concat(vocabulary.filter(v => !this.hiddenTokenTypes.includes(v)));
        this.idTokenType = this.normalTokenTypes.find(t => t.name === "ID")!;
        this.state = InitialPreprocessorState(text);
    }

    start() {
        const result: IToken[] = [];
        while(!Selectors.eof(this.state)) {
            this.skip();
            if(this.tryToReadPreprocessorStatement()) {
                continue;
            } else {
                let token: IToken|undefined;
                do {
                    token = this.scanInput();
                    if(token) {
                        result.push(token);
                    }
                } while(token && token.image !== ';');
            }
        }
        return {
            tokens: result
        }
    }

    private scanInput(): IToken|undefined {
        this.skip();
        for (const tokenType of this.normalTokenTypes) {
            const token = this.tryConsume(tokenType);
            if(!token) {
                continue;
            }
            if(this.isIdentifier(token) && Selectors.hasVariable(this.state, token.image)) {
                const variable = Selectors.getVariable(this.state, token.image);
                if(variable.active) {
                    this.applyAction({
                        type: 'replaceVariable',
                        text: variable.value?.toString() ?? ""
                    });
                    let left = this.scanInput();
                    while(left && left.tokenType === PreprocessorTokens.Percentage) {
                        left = this.scanInput();
                    }
                    if(left && this.canConsume(PreprocessorTokens.Percentage)) {
                        while(this.canConsume(PreprocessorTokens.Percentage)) {
                            this.consume("%", PreprocessorTokens.Percentage);
                            const keepInMind = this.state;
                            const right = this.scanInput();
                            if(right && this.isIdentifier(right)) {
                                left = createTokenInstance(this.idTokenType, left.image+right.image, 0, 0, 0, 0, 0, 0);
                            } else {
                                this.state = keepInMind;
                                return left;
                            }
                        }
                        return left;
                    } else {
                        return left;
                    }    
                }
            }
            return token;
        }
        return undefined;
    }

    private tryToReadPreprocessorStatement(): boolean {
        if(Selectors.eof(this.state) || !this.tryConsume(PreprocessorTokens.Percentage)) {
            return false;
        }
        const tokens = this.tokenizeUntilSemicolon(AllPreprocessorTokens);
        const statement = new PliPreprocessorParser(tokens).start();
        switch(statement.type) {
            case 'declareStatement': {
                for (const declaration of statement.declarations) {
                    switch(declaration.type) {
                        case "builtin":
                        case "entry":
                            //TODO
                            break;
                        case "fixed":
                        case "character":
                            this.applyAction({
                                type: 'declare',
                                name: declaration.name,
                                dataType: declaration.type,
                                scanMode: declaration.scanMode,
                                value: undefined
                            });
                            break;
                    }
                }
                break;
            }
            case 'assignmentStatement': {
                this.applyAction({
                    type: 'assign',
                    name: statement.left,
                    value: statement.right.value
                })
                break;
            }
            case 'skipStatement': {
                this.applyAction({
                    type: "advanceLines",
                    //+1 also skip the current line!
                    lineCount: statement.lineCount + 1
                });
                break;
            }
            case 'pageDirective':
            case 'includeStatement': //TODO
            default: {
                //nothing to do
                break;
            }
        }
        return true;
    }

    private isIdentifier(token: IToken) {
        return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    }

    private tokenizeUntilSemicolon(allowedTokenTypes: TokenType[]) {
        const result: IToken[] = [];
        let foundAny: boolean;
        do {
            foundAny = false;
            this.skip();
            for (const tokenType of allowedTokenTypes) {
                const token = this.tryConsume(tokenType);
                if(token) {
                    result.push(token);
                    foundAny = true;
                    if(token.image === ';') {
                        return result;
                    }
                    break;
                }
            }
        } while(foundAny);
        return result;
    }

    private tryConsume(tokenType: TokenType): IToken|undefined {
        const image = this.canConsume(tokenType);
        if(!image) {
            return undefined;
        }
        return this.consume(image, tokenType);
    }

    private consume(image: string, tokenType: TokenType) {
        const [startOffset, startLine, startColumn] = Selectors.position(this.state);
        this.applyAction({
            type: "advanceScan",
            scanned: image
        });
        const [endOffset, endLine, endColumn] = Selectors.position(this.state);
        //ATTENTION: mind the -1 for end offset and end column, we do not want to consume the next tokens range!
        return createTokenInstance(tokenType, image, startOffset, endOffset-1, startLine, endLine, startColumn, endColumn-1);
    }

    private canConsume(tokenType: TokenType): string|undefined {
        if(Selectors.eof(this.state)) {
            return undefined;
        }
        const { index, text } = Selectors.top(this.state);
        const pattern = tokenType.PATTERN;
        if (pattern) {
            if (pattern instanceof RegExp) {
                pattern.lastIndex = index;
                const match = pattern.exec(text);
                if (match) {
                    if(tokenType.LONGER_ALT) {
                        //if a "longer" alternative can be detected, deny
                        const alternatives = Array.isArray(tokenType.LONGER_ALT) ? tokenType.LONGER_ALT : [tokenType.LONGER_ALT];
                        if(alternatives.some(a => {
                            const alternative = this.canConsume(a);
                            if(alternative && alternative.length > match[0].length) {
                                return alternative;
                            }
                            return undefined;
                        })) {
                            return undefined;
                        }
                    }
                    return match[0];
                }
            } else if (typeof pattern === "string") {
                const image = text.substring(index, index + pattern.length);
                if (image.toLowerCase() === pattern.toLowerCase()) {
                    return image;
                }
            }
        }
        return undefined;
    }

    private skip() {
        while (this.hiddenTokenTypes.some(h => this.tryConsume(h) !== undefined));
    }

    private applyAction(action: PreprocessorAction) {
        this.state = translatePreprocessorState(this.state, action);
    }
}