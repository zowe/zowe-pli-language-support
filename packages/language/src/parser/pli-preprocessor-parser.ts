import { PPStatement, PPDeclaration, ProcedureScope, ScanMode, VariableType, PPExpression, PPAssign, PPDeclare } from "./pli-preprocessor-ast";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorParserState, PreprocessorParserState } from "./pli-preprocessor-parser-state";
import { ILexingError, IToken } from "chevrotain";

export class PreprocessorError extends Error implements ILexingError {
    private readonly token: IToken;
    constructor(message: string, token: IToken) {
        super(message);
        this.token = token;
    }
    readonly type = 'error';
    get offset(): number { return this.token.startOffset; }
    get line(): number | undefined { return this.token.startLine; }
    get column(): number | undefined { return this.token.startColumn; }
    get length(): number { return this.token.image.length; }
}

export class PliPreprocessorParser {
    initializeState(tokens: IToken[]): PreprocessorParserState {
        return new PliPreprocessorParserState(tokens);
    }

    start(state: PreprocessorParserState): PPStatement|PreprocessorError {
        try {
            switch (state.current?.tokenType) {
                case PreprocessorTokens.Declare: return this.declareStatement(state);
                //case PreprocessorTokens.Directive: return this.directive(state);
                case PreprocessorTokens.Skip: return this.skipStatement(state);
                //case PreprocessorTokens.Include: return this.includeStatement(state);
                case PreprocessorTokens.Id: return this.assignmentStatement(state);
            }
        } catch(error) {
            if(error instanceof PreprocessorError) {
                return error;
            }
        }
        return new PreprocessorError('Unexpected state!', state.current!);
    }

    // includeStatement(state: PreprocessorParserState): PPStatement {
    //     state.consume(PreprocessorTokens.Include);
    //     const identifier = state.consume(PreprocessorTokens.Id).image;
    //     state.consume(PreprocessorTokens.Semicolon);
    //     return {
    //         type: "includeStatement",
    //         identifier
    //     };
    // }

    skipStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Skip);
        let lineCount: number = 1;
        if (state.tryConsume(PreprocessorTokens.Number)) {
            lineCount = parseInt(state.last!.image, 10);
        }
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'skip',
            //TODO numeric base of 10 ok?
            lineCount
        };
    }

    // directive(state: PreprocessorParserState): PPStatement {
    //     const which = state.consume(PreprocessorTokens.Directive).image.toLowerCase() as PPDirective['which'];
    //     state.consume(PreprocessorTokens.Semicolon);
    //     return {
    //         type: 'directive',
    //         which
    //     }
    // }

    assignmentStatement(state: PreprocessorParserState): PPAssign {
        const left = state.consume(PreprocessorTokens.Id).image;
        state.consume(PreprocessorTokens.Eq);
        const right = this.expression(state);
        return {
            type: 'assign',
            name: left,
            value: right
        };
    }

    declareStatement(state: PreprocessorParserState): PPDeclare {
        const declarations: PPDeclaration[] = [];
        state.consume(PreprocessorTokens.Declare);
        const first = this.identifierDescription(state);
        declarations.push(...first);
        while (state.canConsume(PreprocessorTokens.Comma)) {
            state.consume(PreprocessorTokens.Comma);
            const next = this.identifierDescription(state);
            declarations.push(...next);
        }
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: "declare",
            declarations
        }
    }

    identifierDescription(state: PreprocessorParserState): PPDeclaration[] {
        if (state.canConsume(PreprocessorTokens.Id)) {
            const id = state.consume(PreprocessorTokens.Id).image;
            if (state.canConsume(PreprocessorTokens.LParen)) {
                state.consume(PreprocessorTokens.LParen);
                //TODO dimension
                state.consume(PreprocessorTokens.RParen);
            } else if (state.tryConsume(PreprocessorTokens.Builtin)) {
                return [{
                    name: id,
                    type: "builtin"
                }];
            } else if (state.tryConsume(PreprocessorTokens.Entry)) {
                return [{
                    name: id,
                    type: "entry"
                }];
            }
            const { type, scope, scanMode } = this.attributes(state);
            return [{
                type,
                name: id,
                scanMode,
                scope
            }];
        } else if (state.canConsume(PreprocessorTokens.LParen)) {
            //TODO
        }
        return [];
    }

    attributes(state: PreprocessorParserState) {
        let scope: ProcedureScope = 'external';
        //TODO rescan seems to be the corrrect default, looking at example 1 from preprocessor documentation
        let scanMode: ScanMode = 'rescan';
        let type: VariableType = 'character';
        let lastIndex = 0;
        do {
            lastIndex = state.index;
            switch (state.current?.tokenType) {
                case PreprocessorTokens.Internal: scope = 'internal'; state.index++; break;
                case PreprocessorTokens.External: scope = 'external'; state.index++; break;
                case PreprocessorTokens.Character: type = 'character'; state.index++; break;
                case PreprocessorTokens.Fixed: type = 'fixed'; state.index++; break;
                case PreprocessorTokens.Scan: scanMode = 'scan'; state.index++; break;
                case PreprocessorTokens.Rescan: scanMode = 'rescan'; state.index++; break;
                case PreprocessorTokens.Noscan: scanMode = 'scan'; state.index++; break;
            }
        } while (lastIndex != state.index);
        return {
            scanMode,
            scope,
            type
        };
    }

    dimension(state: PreprocessorParserState) {
        //TODO
    }

    expression(state: PreprocessorParserState): PPExpression {
        if (state.canConsume(PreprocessorTokens.Number)) {
            const number = state.consume(PreprocessorTokens.Number);
            return {
                type: "number",
                value: parseInt(number.image, 10), //TODO when to parse binary?
            };
        } else 
        if (state.canConsume(PreprocessorTokens.String)) {
            const character = state.consume(PreprocessorTokens.String);
            return {
                type: "string",
                value: this.unpackCharacterValue(character.image)
            };
        }
        throw new PreprocessorError("Cannot handle this type of preprocessor expression yet!", state.current!);
    }

    private unpackCharacterValue(literal: string): string {
        return literal.substring(1, literal.length - 1);
    }
}