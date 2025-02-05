import { IToken, TokenType } from "chevrotain";
import { PPStatement, PPDeclareStatement, PPDeclaration, ProcedureScope, ScanMode, VariableType, PPAssignmentStatement, PPExpression } from "./pli-preprocessor-ast";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";

export class PliPreprocessorParser {
    private readonly tokens: IToken[];
    private index: number;

    constructor(tokens: IToken[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    get current() {
        return this.eos ? undefined : this.tokens[this.index];
    }

    get last() {
        return this.eos ? this.tokens[this.tokens.length] : this.tokens[this.index-1];
    }

    get eos() { //end of statement
        return this.index >= this.tokens.length;
    }

    start(): PPStatement {
        switch(this.current?.tokenType) {
            case PreprocessorTokens.Declare: return this.declareStatement();
            case PreprocessorTokens.Page: return this.pageDirective();
            case PreprocessorTokens.Skip: return this.skipStatement();
            case PreprocessorTokens.Include: return this.includeStatement();
            case PreprocessorTokens.Id: return this.assignmentStatement();
        }
        throw new Error("Unable to parse preprocessor statement.");
    }
    includeStatement(): PPStatement {
        this.consume(PreprocessorTokens.Include);
        const identifier = this.consume(PreprocessorTokens.Id).image;
        this.consume(PreprocessorTokens.Semicolon);
        return {
            type: "includeStatement",
            identifier
        };
    }

    skipStatement(): PPStatement {
        this.consume(PreprocessorTokens.Skip);
        let lineCount: number = 1;
        if(this.tryConsume(PreprocessorTokens.Number)) {
            lineCount = parseInt(this.last.image, 10);
        }
        this.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'skipStatement',
            //TODO numeric base of 10 ok?
            lineCount
        };
    }

    pageDirective(): PPStatement {
        this.consume(PreprocessorTokens.Page);
        this.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'pageDirective'
        }
    }

    assignmentStatement(): PPAssignmentStatement {
        const left = this.consume(PreprocessorTokens.Id).image;
        this.consume(PreprocessorTokens.Eq);
        const right = this.expression();
        return {
            type: 'assignmentStatement',
            left,
            right
        };
    }

    declareStatement(): PPDeclareStatement {
        const declarations: PPDeclaration[] = [];
        this.consume(PreprocessorTokens.Declare);
        const first = this.identifierDescription();
        declarations.push(...first);
        while(this.canConsume(PreprocessorTokens.Comma)) {
            this.consume(PreprocessorTokens.Comma);
            const next = this.identifierDescription();
            declarations.push(...next);
        }
        this.consume(PreprocessorTokens.Semicolon);
        return {
            type: "declareStatement",
            declarations
        }
    }

    identifierDescription(): PPDeclaration[] {
        if(this.canConsume(PreprocessorTokens.Id)) {
            const id = this.consume(PreprocessorTokens.Id).image;
            if(this.canConsume(PreprocessorTokens.LParen)) {
                this.consume(PreprocessorTokens.LParen);
                //TODO dimension
                this.consume(PreprocessorTokens.RParen);
            } else if(this.tryConsume(PreprocessorTokens.Builtin)) {
                return [{
                    name: id,
                    type: "builtin"
                }];
            } else if(this.tryConsume(PreprocessorTokens.Entry)) {
                return [{
                    name: id,
                    type: "entry"
                }];
            }
            const { type, scope, scanMode } = this.attributes();
            return [{
                type,
                name: id,
                scanMode,
                scope
            }];
        } else if(this.canConsume(PreprocessorTokens.LParen)) {
            //TODO
        }
        return [];
    }

    attributes() {
        let scope: ProcedureScope = 'external';
        //TODO rescan seems to be the corrrect default, looking at example 1 from preprocessor documentation
        let scanMode: ScanMode = 'rescan';
        let type: VariableType = 'character';
        let lastIndex = 0;
        do {
            lastIndex = this.index;
            switch(this.current?.tokenType) {
                case PreprocessorTokens.Internal: scope = 'internal'; this.index++; break;
                case PreprocessorTokens.External: scope = 'external'; this.index++; break;
                case PreprocessorTokens.Character: type = 'character'; this.index++; break;
                case PreprocessorTokens.Fixed: type = 'fixed'; this.index++; break;
                case PreprocessorTokens.Scan: scanMode = 'scan'; this.index++; break;
                case PreprocessorTokens.Rescan: scanMode = 'rescan'; this.index++; break;
                case PreprocessorTokens.Noscan: scanMode = 'scan'; this.index++; break;
            }
        } while(lastIndex != this.index);
        return {
            scanMode,
            scope,
            type
        };
     }

    dimension() {
        //TODO
    }

    expression(): PPExpression {
        if(this.canConsume(PreprocessorTokens.Number)) {
            const number = this.consume(PreprocessorTokens.Number);
            return {
                type: "fixedLiteral",
                value: parseInt(number.image, 10), //TODO when to parse binary?
            };
        } else if(this.canConsume(PreprocessorTokens.String)) {
            const character = this.consume(PreprocessorTokens.String);
            return {
                type: "characterLiteral",
                value: this.unpackCharacterValue(character.image)
            };
        }
        throw new Error("Cannot handle this type of preprocessor expression yet!");
    }



    private canConsume(tokenType: TokenType) {
        return this.current?.tokenType === tokenType;
    }

    private tryConsume(tokenType: TokenType): boolean {
        if(this.current?.tokenType !== tokenType) {
            return false;
        }
        this.index++;
        return true;
    }

    private consume(tokenType: TokenType) {
        if(this.current?.tokenType !== tokenType) {
            //TODO remove Last part...
            throw new Error(`Expected token type '${tokenType.name}', got '${this.current?.tokenType.name??'???'}' instead. Last was '${this.last.image}'.`);
        }
        const token = this.current;
        this.index++;
        return token;
    }

    private unpackCharacterValue(literal: string): string {
        return literal.substring(1, literal.length-1);
    }

}