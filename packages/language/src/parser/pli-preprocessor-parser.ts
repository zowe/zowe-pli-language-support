import { IToken, TokenType } from "chevrotain";
import { PreprocessorTokens } from "./pli-preprocessor";
import { PPStatement, PPDeclareStatement, PPDeclaration, ProcedureScope, ScanMode, VariableType, PPAssignmentStatement } from "./pli-preprocessor-ast";

export class PliPreprocessorParser {
    private readonly tokens: IToken[];
    private index: number;

    constructor(tokens: IToken[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    get current() {
        return this.tokens[this.index];
    }

    get eos() { //end of statement
        return this.index >= this.tokens.length;
    }

    start(): PPStatement {
        switch(this.current.tokenType) {
            case PreprocessorTokens.Declare: return this.declareStatement();
            case PreprocessorTokens.Id: return this.assignmentStatement();
        }
        throw new Error("Unable to parse preprocessor statement.");
    }

    assignmentStatement(): PPAssignmentStatement {
        const left = this.consume(PreprocessorTokens.Id).image;
        this.consume(PreprocessorTokens.Eq);
        const right = this.consume(PreprocessorTokens.String).image;
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
        let scanMode: ScanMode = 'rescan'; //TODO corrrect default?
        let type: VariableType = 'character';
        let lastIndex = 0;
        do {
            lastIndex = this.index;
            switch(this.current.tokenType) {
                case PreprocessorTokens.Internal: scope = 'internal'; this.index++; break;
                case PreprocessorTokens.External: scope = 'external'; this.index++; break;
                case PreprocessorTokens.Character: type = 'character'; this.index++; break;
                case PreprocessorTokens.Fixed: type = 'fixed'; this.index++; break;
                case PreprocessorTokens.Scan: scanMode = 'scan'; this.index++; break;
                case PreprocessorTokens.Rescan: scanMode = 'rescan'; this.index++; break;
                case PreprocessorTokens.Noscan: scanMode = 'noscan'; this.index++; break;
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

    canConsume(tokenType: TokenType) {
        return this.current.tokenType === tokenType;
    }

    tryConsume(tokenType: TokenType): boolean {
        if(this.current.tokenType !== tokenType) {
            return false;
        }
        this.index++;
        return true;
    }

    consume(tokenType: TokenType) {
        if(this.current.tokenType !== tokenType) {
            throw new Error(`Expected token type '${tokenType.name}'.`);
        }
        const token = this.current;
        this.index++;
        return token;
    }
}