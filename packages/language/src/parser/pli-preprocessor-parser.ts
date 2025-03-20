import { PPStatement, PPDeclaration, ProcedureScope, ScanMode, VariableType, PPExpression, PPAssign, PPDeclare, PPDirective, PPActivate, PPDeactivate, PPDoGroup, PPDoWhileUntil, PPDoUntilWhile, PPBinaryExpression, PPDoForever } from "./pli-preprocessor-ast";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorParserState, PreprocessorParserState } from "./pli-preprocessor-parser-state";
import { PreprocessorError } from "./pli-preprocessor-error";
import { IToken, TokenType } from "chevrotain";
import { Pl1Services } from "../pli-module";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { DocumentCache, URI } from "langium";
import { readFileSync } from "fs";

export type PreprocessorParserResult = {
    statements: PPStatement[];
    errors: PreprocessorError[];
}

export class PliPreprocessorParser {
    private readonly lexer: PliPreprocessorLexer;
    private readonly includeCache: DocumentCache<string, PreprocessorParserResult>;

    constructor(services: Pl1Services) {
        this.lexer = services.parser.PreprocessorLexer;
        this.includeCache = new DocumentCache<string, PreprocessorParserResult>(services.shared);
    }

    initializeState(text: string, uri: URI): PreprocessorParserState {
        return new PliPreprocessorParserState(this.lexer, text, uri);
    }

    start(state: PreprocessorParserState): PreprocessorParserResult {
        const statements: PPStatement[] = [];
        const errors: PreprocessorError[] = [];
        while(!state.eof) {
            try {
                if(state.isInProcedure() || state.canConsume(PreprocessorTokens.Percentage)) {
                    const statement = this.statement(state);
                    if(statement.type === 'include')  {
                        errors.push(...statement.subProgram.errors);
                    }
                    statements.push(statement);
                } else {
                    statements.push({
                        type: 'pli',
                        tokens: state.consumeUntil(tk => tk.image === ';'),
                    });
                }
            } catch (error) {
                if(error instanceof PreprocessorError) {
                    errors.push(error);
                } else {
                    throw error;
                }
            }
        }
        return {
            statements,
            errors,
        };
    }

    statement(state: PreprocessorParserState): PPStatement {
        if(state.tryConsume(PreprocessorTokens.Percentage)) {
            state.push('in-statement');
            try {
                const labels: string[] = [];
                while(state.canConsume(PreprocessorTokens.Id, PreprocessorTokens.Colon)) {
                    const labelName = state.consume(PreprocessorTokens.Id).image;
                    state.consume(PreprocessorTokens.Colon);
                    labels.push(labelName);
                }
                let statement: PPStatement;
                switch (state.current?.tokenType) {
                    case PreprocessorTokens.Activate: statement = this.activateStatement(state); break;
                    case PreprocessorTokens.Deactivate: statement = this.deactivateStatement(state); break;
                    case PreprocessorTokens.Declare: statement = this.declareStatement(state); break;
                    case PreprocessorTokens.Directive: statement = this.directive(state); break;
                    case PreprocessorTokens.Skip: statement = this.skipStatement(state); break;
                    case PreprocessorTokens.Include: statement = this.includeStatement(state); break;
                    case PreprocessorTokens.Id: statement = this.assignmentStatement(state); break;
                    case PreprocessorTokens.If: statement = this.ifStatement(state); break;
                    case PreprocessorTokens.Do: statement = this.doStatement(state); break;
                    case PreprocessorTokens.Go: statement = this.goToStatement(state); break;
                    case PreprocessorTokens.Leave: statement = this.leaveStatement(state); break;
                    case PreprocessorTokens.Iterate: statement = this.iterateStatement(state); break;
                    default: throw new PreprocessorError("Unexpected token '"+state.current?.image+"'.", state.current!, state.uri.toString());
                }
                for (const labelName of labels.reverse()) {
                    statement = {
                        type: 'labeled',
                        label: labelName,
                        statement
                    };
                }
                return statement;
            } finally {
                state.pop();
            }
        } else {
            return {
                type: 'pli',
                tokens: state.consumeUntil(tk => tk.image === ';'),
            };
        }
    }

    iterateStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Iterate);
        if(state.canConsume(PreprocessorTokens.Id)) {
            const label = state.consume(PreprocessorTokens.Id).image;
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'iterate',
                label
            };
        }
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'iterate',
            label: undefined
        };
    }

    leaveStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Leave);
        if(state.canConsume(PreprocessorTokens.Id)) {
            const label = state.consume(PreprocessorTokens.Id).image;
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'leave',
                label
            };
        }
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'leave',
            label: undefined
        };
    }

    goToStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Go);
        state.consume(PreprocessorTokens.Percentage);
        state.consume(PreprocessorTokens.To);
        const label = state.consume(PreprocessorTokens.Id).image;
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: 'goto',
            label
        };
    }

    includeStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.Include);
        const file = state.consume(PreprocessorTokens.String).image;
        const fileName = file.substring(1, file.length-1);
        state.consume(PreprocessorTokens.Semicolon);
        const subProgram = this.includeCache.get(state.uri, fileName, () => {
            const uri = URI.file(fileName);
            const content = readFileSync(fileName, 'utf-8');
            const subState = this.initializeState(content, uri);
            return this.start(subState);
        });
        return {
            type: 'include',
            subProgram
        };
    }

    doStatement(state: PreprocessorParserState): PPDoGroup|PPDoWhileUntil|PPDoUntilWhile|PPDoForever {
        state.consume(PreprocessorTokens.Do);
        if(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.While)) {
            //type-2-do-while-first
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.While);
            state.consume(PreprocessorTokens.LParen);
            const conditionWhile = this.expression(state);
            state.consume(PreprocessorTokens.RParen);
            let conditionUntil: PPExpression|undefined = undefined;
            if(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.Until)) {
                state.consume(PreprocessorTokens.Percentage);
                state.consume(PreprocessorTokens.Until);
                state.consume(PreprocessorTokens.LParen);
                conditionUntil = this.expression(state);
                state.consume(PreprocessorTokens.RParen);
            }
            state.consume(PreprocessorTokens.Semicolon);

            const body = this.statements(state);
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do-while-until',
                conditionWhile,
                conditionUntil,
                body
            };
        } else if(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.Until)) {
            //type-2-do-until-first
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.Until);
            state.consume(PreprocessorTokens.LParen);
            const conditionUntil = this.expression(state);
            state.consume(PreprocessorTokens.RParen);
            let conditionWhile: PPExpression|undefined = undefined;
            if(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.While)) {
                state.consume(PreprocessorTokens.Percentage);
                state.consume(PreprocessorTokens.While);
                state.consume(PreprocessorTokens.LParen);
                conditionWhile = this.expression(state);
                state.consume(PreprocessorTokens.RParen);
            }
            state.consume(PreprocessorTokens.Semicolon);
            const body = this.statements(state);
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do-until-while',
                conditionWhile,
                conditionUntil,
                body
            };
        } else if (state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.Loop)) {
            //type-4 loops
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.Loop);
            state.consume(PreprocessorTokens.Semicolon);
            const body = this.statements(state);
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do-forever',
                body
            };
        } else { //type-1-do
            const statements = this.statements(state);
            state.consume(PreprocessorTokens.Percentage);
            state.consume(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do',
                statements
            };
        }
    }

    private statements(state: PreprocessorParserState) {
        const statements: PPStatement[] = [];
        while (!(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.End))) {
            const statement = this.statement(state);
            statements.push(statement);
        }
        return statements;
    }

    ifStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.If);
        const condition = this.expression(state);
        state.consume(PreprocessorTokens.Percentage);
        state.consume(PreprocessorTokens.Then);
        const thenUnit = this.statement(state);
        let elseUnit: PPStatement|undefined = undefined;
        if(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.Else)) {
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
        return this.exponentiation(state);
    }

    exponentiation(state: PreprocessorParserState): PPExpression {
        return this.rightAssociativeOperators<'**'>(state, {
            '**': PreprocessorTokens.Power
        }, this.multiplication, this.exponentiation);
    }

    multiplication(state: PreprocessorParserState): PPExpression {
        return this.leftAssociativeOperators<'*'|'/'>(state, {
            "*": PreprocessorTokens.Multiply,
            "/": PreprocessorTokens.Divide,
        }, this.addition);
    }

    addition(state: PreprocessorParserState): PPExpression {
        return this.leftAssociativeOperators<'+'|'-'>(state, {
            "+": PreprocessorTokens.Plus,
            "-": PreprocessorTokens.Minus,
        }, this.concatenation);
    }

    concatenation(state: PreprocessorParserState): PPExpression {
        return this.leftAssociativeOperators<'||'>(state, {
            "||": PreprocessorTokens.Concat,
        }, this.relational);
    }

    relational(state: PreprocessorParserState): PPExpression {
        return this.leftAssociativeOperators< '<' | '<=' | '>' | '>=' | '=' | '<>'>(state, {
            "<": PreprocessorTokens.LT,
            "<=": PreprocessorTokens.LE,
            ">": PreprocessorTokens.GT,
            ">=": PreprocessorTokens.GE,
            "=": PreprocessorTokens.Eq,
            "<>": PreprocessorTokens.Neq
        }, this.and);
    }

    and(state: PreprocessorParserState): PPExpression {
        return this.leftAssociativeOperators<'&'>(state, {
            "&": PreprocessorTokens.And
        }, this.or);
    }

    or(state: PreprocessorParserState): PPExpression {
        return this.leftAssociativeOperators<'|'>(state, {
            "|": PreprocessorTokens.Or
        }, this.primary);
    }

    private leftAssociativeOperators<Ops extends PPBinaryExpression['operator']>(state: PreprocessorParserState, operators: Record<Ops, TokenType>, next: (state: PreprocessorParserState) => PPExpression) {
        let lhs = next.call(this, state);
        while(true) {
            let operator: Ops|undefined = undefined;
            for (const [op, tokenType] of Object.entries<TokenType>(operators)) {
                if(state.tryConsume(tokenType)) {
                    operator = op as Ops;
                    break;
                }
            }
            if(operator) {
                const rhs = next.call(this, state);
                lhs = {
                    type: 'binary',
                    lhs,
                    rhs,
                    operator
                };
            } else {
                break;
            }
        }
        return lhs;
    }

    private rightAssociativeOperators<Ops extends PPBinaryExpression['operator']>(state: PreprocessorParserState, operators: Record<Ops, TokenType>, next: (state: PreprocessorParserState) => PPExpression, self: (state: PreprocessorParserState) => PPExpression) {
        let lhs = next.call(this, state);
        let operator: Ops|undefined = undefined;
        for (const [op, tokenType] of Object.entries<TokenType>(operators)) {
            if(state.tryConsume(tokenType)) {
                operator = op as Ops;
                break;
            }
        }
        if(operator) {
            const rhs = self.call(this, state);
            lhs = {
                type: 'binary',
                lhs,
                rhs,
                operator
            };
        }
        return lhs;
    }

    primary(state: PreprocessorParserState): PPExpression {
        if (state.canConsume(PreprocessorTokens.Number)) {
            const number = state.consume(PreprocessorTokens.Number);
            return {
                type: "number",
                value: parseInt(number.image, 10), //TODO when to parse binary?
            };
        } else if (state.canConsume(PreprocessorTokens.String)) {
            const character = state.consume(PreprocessorTokens.String);
            const content = this.unpackCharacterValue(character.image);
            const tokens = this.tokenizePurePliCode(content);
            return {
                type: "string",
                value: tokens
            };
        } else if(state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.Id)) {
            state.consume(PreprocessorTokens.Percentage);
            const variableName = state.consume(PreprocessorTokens.Id).image;
            return {
                type: 'variable-usage',
                variableName
            };
        }
        throw new PreprocessorError("Cannot handle this type of preprocessor expression yet!", state.current!, state.uri.toString());
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