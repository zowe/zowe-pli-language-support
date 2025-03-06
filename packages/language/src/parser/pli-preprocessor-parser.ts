import { PPStatement, PPDeclaration, ProcedureScope, ScanMode, VariableType, PPExpression, PPAssign, PPDeclare, PPDirective, PPActivate, PPDeactivate, PPIfStatement } from "./pli-preprocessor-ast";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorParserState, PreprocessorParserState } from "./pli-preprocessor-parser-state";
import { ILexingError, IToken } from "chevrotain";
import { Pl1Services } from "../pli-module";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorLexerState } from "./pli-preprocessor-lexer-state";

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
    private readonly lexer: PliPreprocessorLexer;

    constructor(services: Pl1Services) {
        this.lexer = services.parser.PreprocessorLexer;
    }

    initializeState(text: string): PreprocessorParserState {
        return new PliPreprocessorParserState(this.lexer, text);
    }

    start(state: PreprocessorParserState): PPStatement[] {
        const result: PPStatement[] = [];
        while(!state.eof) {
            if(state.isInProcedure() || state.canConsume(PreprocessorTokens.Percentage)) {
                const statement = this.statement(state);
                result.push(statement);
            } else {
                result.push({
                    type: 'pli',
                    tokens: state.consumeUntil(tk => tk.image === ';'),
                });
            }
        }
        return result;
    }

    statement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Percentage);
        state.push('in-statement');
        try {
            switch (state.current?.tokenType) {
                case PreprocessorTokens.Activate: return this.activateStatement(state);
                case PreprocessorTokens.Deactivate: return this.deactivateStatement(state);
                case PreprocessorTokens.Declare: return this.declareStatement(state);
                case PreprocessorTokens.Directive: return this.directive(state);
                case PreprocessorTokens.Skip: return this.skipStatement(state);
                case PreprocessorTokens.Id: return this.assignmentStatement(state);
                case PreprocessorTokens.If: return this.ifStatement(state);
            }
            throw new PreprocessorError("Unexpected token '"+state.current?.image+"'.", state.current!);
        } finally {
            state.pop();
        }
    }

    ifStatement(state: PreprocessorParserState): PPIfStatement {
        state.consume(PreprocessorTokens.If);
        const condition = this.expression(state);
        state.consume(PreprocessorTokens.Percentage);
        state.consume(PreprocessorTokens.Then);
        const thenUnit = this.statement(state);
        let elseUnit: PPStatement|undefined = undefined;
        if(state.canConsume(PreprocessorTokens.Percentage) && state.canConsume(PreprocessorTokens.Else, 2)) {
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.Else);
            elseUnit = this.statement(state);
        }
        return {
            type: 'if',
            condition,
            thenUnit,
            elseUnit,
        };
    }

    deactivateStatement(state: PreprocessorParserState): PPDeactivate {
        state.consume(PreprocessorTokens.Deactivate);
        const variables: string[] = [];
        let variable = state.consume(PreprocessorTokens.Id).image;
        variables.push(variable);
        while(state.tryConsume(PreprocessorTokens.Comma)) {
            variable = state.consume(PreprocessorTokens.Id).image;
            variables.push(variable);
        }
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: "deactivate",
            variables
        };
    }
    activateStatement(state: PreprocessorParserState): PPActivate {
        state.consume(PreprocessorTokens.Activate);
        const variables: Record<string, ScanMode|undefined> = {};

        let variableName = state.consume(PreprocessorTokens.Id).image;
        let scanMode = this.tryScanMode(state);
        variables[variableName] = scanMode;

        while(state.tryConsume(PreprocessorTokens.Comma)) {
            variableName = state.consume(PreprocessorTokens.Id).image;
            scanMode = this.tryScanMode(state);
            variables[variableName] = scanMode;
        }

        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: "activate",
            variables
        }
    }

    tryScanMode(state: PreprocessorParserState) {
        let scanMode: ScanMode|undefined = undefined;
        switch(state.current!.tokenType) {
            case PreprocessorTokens.Scan: scanMode = 'scan'; state.index++; break;
            case PreprocessorTokens.Rescan: scanMode = 'rescan'; state.index++; break;
            case PreprocessorTokens.Noscan: scanMode = 'scan'; state.index++; break;
        }
        return scanMode;
    }

    skipStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Skip);
        let lineCount: number = 1;
        if (state.tryConsume(PreprocessorTokens.Number)) {
            lineCount = parseInt(state.last!.image, 10);
        }
        state.consume(PreprocessorTokens.Semicolon);
        state.advanceLines(lineCount+1);
        return {
            type: 'skip',
            //TODO numeric base of 10 ok?
            lineCount
        };
    }

    directive(state: PreprocessorParserState): PPStatement {
        const which = state.consume(PreprocessorTokens.Directive).image.toLowerCase() as PPDirective['which'];
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'directive',
            which
        };
    }

    assignmentStatement(state: PreprocessorParserState): PPAssign {
        const left = state.consume(PreprocessorTokens.Id).image;
        state.consume(PreprocessorTokens.Eq);
        const right = this.expression(state);
        state.consume(PreprocessorTokens.Semicolon);
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
            const content = this.unpackCharacterValue(character.image);
            const tokens = this.tokenizePurePliCode(content);
            return {
                type: "string",
                value: tokens
            };
        }
        throw new PreprocessorError("Cannot handle this type of preprocessor expression yet!", state.current!);
    }

    private tokenizePurePliCode(content: string) {
        const result: IToken[] = [];
        const lexerState = new PliPreprocessorLexerState(content);
        while(!lexerState.eof()) {
            const tokens = this.lexer.tokenizePliTokensUntilSemicolon(lexerState);
            result.push(...tokens);
        }
        return result;
    }

    private unpackCharacterValue(literal: string): string {
        return literal.substring(1, literal.length - 1);
    }
}