import { PPStatement, ProcedureScope, ScanMode, VariableType, PPExpression, PPAssign, PPDirective, PPActivate, PPDeactivate, PPBinaryExpression, AnyDoGroup, AnyDeclare, DimensionBounds, NameAndBounds, Dimensions, PPDeclaration } from "./pli-preprocessor-ast";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorParserState, PreprocessorParserState } from "./pli-preprocessor-parser-state";
import { PreprocessorError } from "./pli-preprocessor-error";
import { IToken, TokenType } from "chevrotain";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { readFileSync } from "fs";
import { URI } from "../utils/uri";

export type PreprocessorParserResult = {
    statements: PPStatement[];
    errors: PreprocessorError[];
}

export class PliPreprocessorParser {
    private readonly lexer: PliPreprocessorLexer;

    constructor(lexer: PliPreprocessorLexer) {
        this.lexer = lexer;
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
        if(state.isOnlyInStatement()) {
            if(state.tryConsume(PreprocessorTokens.Percentage)) {
                state.push('in-statement');
                try {
                    return this.commonStatement(state);
                } finally {
                    state.pop();
                }
            } else {
                return {
                    type: 'pli',
                    tokens: state.consumeUntil(tk => tk.image === ';'),
                };
            }
        } else { //state.isInProcedure()
            return this.commonStatement(state);
        }
    }

    commonStatement(state: PreprocessorParserState) {
        const labels: string[] = [];
        while (state.canConsume(PreprocessorTokens.Id, PreprocessorTokens.Colon)) {
            const labelName = state.consume(PreprocessorTokens.Id).image;
            state.consume(PreprocessorTokens.Colon);
            labels.push(labelName);
        }
        let statement: PPStatement|undefined = undefined;
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
            default: 
                if(state.isOnlyInStatement()) {
                    if(state.current?.tokenType === PreprocessorTokens.Procedure) {
                        statement = this.procedureStatement(state);
                    }
                } else { //state.isInProcedure()
                    if(state.tryConsume(PreprocessorTokens.Return)) {
                        state.consume(PreprocessorTokens.LParen);
                        statement = {
                            type: 'return',
                            value: this.expression(state),
                        };
                        state.consume(PreprocessorTokens.RParen);
                        state.consume(PreprocessorTokens.Semicolon);
                    }
                }
                if(statement === undefined) {
                    throw new PreprocessorError("Unexpected token '" + state.current?.image + "'.", state.current!, state.uri.toString());
                }
        }
        if(labels.length === 0 && statement.type === 'procedure') {
            throw new PreprocessorError("Procedure must have a label.", state.current!, state.uri.toString());
        }
        for (const labelName of labels.reverse()) {
            statement = {
                type: 'labeled',
                label: labelName,
                statement
            };
        }
        return statement;
    }

    procedureStatement(state: PreprocessorParserState): PPStatement {
        state.push('in-procedure');
        state.consume(PreprocessorTokens.Procedure);
        const parameters: string[] = [];
        if(state.tryConsume(PreprocessorTokens.LParen)) {
            do {
                const parameter = state.consume(PreprocessorTokens.Id).image;
                parameters.push(parameter);
            } while (state.tryConsume(PreprocessorTokens.Comma));
            state.consume(PreprocessorTokens.RParen);
        }
        const isStatement = state.tryConsume(PreprocessorTokens.Statement);
        let returnType: VariableType|undefined = undefined;
        if(state.tryConsume(PreprocessorTokens.Returns)) {
            state.consume(PreprocessorTokens.LParen);
            if(state.tryConsume(PreprocessorTokens.Character)) {
                returnType = 'character';
            } else if(state.tryConsume(PreprocessorTokens.Fixed)) {
                returnType = 'fixed';
            }
            state.consume(PreprocessorTokens.RParen);
        }
        state.consume(PreprocessorTokens.Semicolon);
        const body = this.statements(state);
        state.consume(PreprocessorTokens.End);
        state.consume(PreprocessorTokens.Semicolon);
        state.pop();
        return {
            type: 'procedure',
            isStatement,
            returnType,
            parameters,
            body,
        };
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
        state.consumeKeyword(PreprocessorTokens.To);
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
        // To do cache included files
        const uri = URI.file(fileName);
        const content = readFileSync(fileName, 'utf-8');
        const subState = this.initializeState(content, uri);
        const subProgram = this.start(subState);
        return {
            type: 'include',
            subProgram
        };
    }

    doStatement(state: PreprocessorParserState): AnyDoGroup {
        state.consume(PreprocessorTokens.Do);
        if(state.tryConsumeKeyword(PreprocessorTokens.While)) {
            //type-2-do-while-first
            state.consume(PreprocessorTokens.LParen);
            const conditionWhile = this.expression(state);
            state.consume(PreprocessorTokens.RParen);
            let conditionUntil: PPExpression|undefined = undefined;
            if(state.canConsumeKeyword(PreprocessorTokens.Until)) {
                state.consumeKeyword(PreprocessorTokens.Until);
                state.consume(PreprocessorTokens.LParen);
                conditionUntil = this.expression(state);
                state.consume(PreprocessorTokens.RParen);
            }
            state.consume(PreprocessorTokens.Semicolon);

            const body = this.statements(state);
            state.consumeKeyword(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do-while-until',
                conditionWhile,
                conditionUntil,
                body
            };
        } else if(state.tryConsumeKeyword(PreprocessorTokens.Until)) {
            //type-2-do-until-first
            state.consume(PreprocessorTokens.LParen);
            const conditionUntil = this.expression(state);
            state.consume(PreprocessorTokens.RParen);
            let conditionWhile: PPExpression|undefined = undefined;
            if(state.canConsumeKeyword(PreprocessorTokens.While)) {
                state.consumeKeyword(PreprocessorTokens.While);
                state.consume(PreprocessorTokens.LParen);
                conditionWhile = this.expression(state);
                state.consume(PreprocessorTokens.RParen);
            }
            state.consume(PreprocessorTokens.Semicolon);
            const body = this.statements(state);
            state.consumeKeyword(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do-until-while',
                conditionWhile,
                conditionUntil,
                body
            };
        } else if (state.tryConsumeKeyword(PreprocessorTokens.Loop)) {
            //type-4 loops
            state.consume(PreprocessorTokens.Semicolon);
            const body = this.statements(state);
            state.consumeKeyword(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do-forever',
                body
            };
        } else if(state.tryConsume(PreprocessorTokens.Semicolon)) {
            //type-1-do
            const statements = this.statements(state);
            state.consumeKeyword(PreprocessorTokens.End);
            state.consume(PreprocessorTokens.Semicolon);
            return {
                type: 'do',
                statements
            };
        }
        //TODO type-3-do
        throw new PreprocessorError("Unexpected token '"+state.current?.image+"'.", state.current!, state.uri.toString());
    }

    private statements(state: PreprocessorParserState) {
        const statements: PPStatement[] = [];
        while (!(state.canConsumeKeyword(PreprocessorTokens.End))) {
            const statement = this.statement(state);
            statements.push(statement);
        }
        return statements;
    }

    ifStatement(state: PreprocessorParserState): PPStatement {
        state.consume(PreprocessorTokens.If);
        const condition = this.expression(state);
        state.consumeKeyword(PreprocessorTokens.Then);
        const thenUnit = this.statement(state);
        let elseUnit: PPStatement|undefined = undefined;
        if(state.canConsumeKeyword(PreprocessorTokens.Else)) {
            state.consumeKeyword(PreprocessorTokens.Else);
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

    declareStatement(state: PreprocessorParserState): AnyDeclare {
        const declarations: PPDeclaration[] = [];
        state.consume(PreprocessorTokens.Declare);
        do {
            const names: NameAndBounds[] = [];
            if(state.tryConsume(PreprocessorTokens.LParen)) {
                do {
                    const name = state.consume(PreprocessorTokens.Id).image;
                    if (state.tryConsume(PreprocessorTokens.LParen)) {
                        const dimensions = this.dimensions(state);
                        state.consume(PreprocessorTokens.RParen);
                        names.push({
                            name,
                            dimensions
                        });
                    } else {
                        names.push({
                            name,
                        });
                    }
                } while (state.tryConsume(PreprocessorTokens.Comma));
                state.consume(PreprocessorTokens.RParen);
            } else {
                const name = state.consume(PreprocessorTokens.Id).image;
                names.push({ name });
            }
            const attributes = this.attributes(state);
            declarations.push({
                names,
                attributes
            });
        } while(state.tryConsume(PreprocessorTokens.Comma));
        state.consume(PreprocessorTokens.Semicolon);
        return {
            type: "declare",
            declarations
        };
    }

    dimensions(state: PreprocessorParserState): Dimensions {
        if(state.tryConsume(PreprocessorTokens.Multiply)) {
            let count = 1;
            while(state.tryConsume(PreprocessorTokens.Comma)) {
                state.consume(PreprocessorTokens.Multiply);
                count++;
            }
            return {
                type: 'unbounded-dimensions',
                count,
            };
        } else {
            const dimensions: DimensionBounds[] = [];
            do {
                const left = this.expression(state);
                if(state.tryConsume(PreprocessorTokens.Colon)) {
                    const right = this.expression(state);
                    dimensions.push({
                        lowerBound: left,
                        upperBound: right,
                    });
                } else {
                    dimensions.push({
                        lowerBound: undefined,
                        upperBound: left,
                    });
                }
            } while (state.tryConsume(PreprocessorTokens.Comma));
            return {
                type: 'bounded-dimensions',
                dimensions,
            };
        }
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
                case PreprocessorTokens.Builtin: type = 'builtin'; state.index++; break;
                case PreprocessorTokens.Entry: type = 'entry'; state.index++; break;
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
        } else if(state.canConsumeKeyword(PreprocessorTokens.Id)) {
            if(state.isOnlyInStatement()) {
                state.consume(PreprocessorTokens.Percentage);
            } 
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