import { Parser } from "./parser-types";
import * as ast from "../syntax-tree/ast";
import { IRecognitionException, TokenType } from "chevrotain";
import { finalParserState, ParserState } from "./parser-state";
import * as tokens from "./tokens";
import { CstNodeKind } from "../syntax-tree/cst";

export class HandwrittenParser implements Parser<ast.Program, tokens.Token> {
    private _input: tokens.Token[] = [];
    set input(value: tokens.Token[]) {
        this._input = value;
    }
    get errors(): IRecognitionException[] {
        return [];
    }

    parse(): ast.Program {
        const state = finalParserState(this._input);
        return this.rulePliProgram(state);
    }



    rulePliProgram(state: ParserState): ast.Program {
        const program: ast.Program = {
            kind: ast.SyntaxKind.Program,
            container: null,
            statements: [],
        };
        // Parse one or more packages (or top-level statements)
        while (!state.eof && state.canConsumeFirst(this.firstStatement)) {
            const statement = this.ruleStatement(state);
            program.statements.push(statement);
        }
        return program;
    }

    firstPackage = [tokens.PACKAGE];
    rulePackage(state: ParserState): ast.Package {
        const element: ast.Package = {
            kind: ast.SyntaxKind.Package,
            container: null,
            statements: [],
            end: null,
            exports: null,
            options: null,
            reserves: null,
        };
        state.consume(element, CstNodeKind.Package_PACKAGE, tokens.PACKAGE);
        if (state.canConsumeFirst(this.firstExports)) {
            element.exports = this.ruleExports(state);
        }
        if (state.canConsumeFirst(this.firstReserves)) {
            element.reserves = this.ruleReserves(state);
        }
        if (state.canConsumeFirst(this.firstOptions)) {
            element.options = this.ruleOptions(state);
        }
        state.consume(element, CstNodeKind.Package_Semicolon0, tokens.Semicolon);
        while (!state.eof && state.canConsumeFirst(this.firstStatement)) {
            const statement = this.ruleStatement(state);
            element.statements.push(statement);
        }
        element.end = this.ruleEndStatement(state);
        state.consume(element, CstNodeKind.Package_Semicolon1, tokens.Semicolon);
        return element;
    }

    firstConditionPrefix = [tokens.OpenParen];
    ruleConditionPrefix(state: ParserState): ast.ConditionPrefix {
        const element: ast.ConditionPrefix = {
            kind: ast.SyntaxKind.ConditionPrefix,
            container: null,
            items: [],
        };

        do {
            state.consume(element, CstNodeKind.ConditionPrefix_OpenParen, tokens.OpenParen);
            element.items.push(this.ruleConditionPrefixItem(state));
            state.consume(element, CstNodeKind.ConditionPrefix_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.ConditionPrefix_Colon, tokens.Colon);
        } while (state.canConsume(tokens.OpenParen));

        return element;
    }

    firstConditionPrefixItem = [tokens.ID];
    ruleConditionPrefixItem(state: ParserState): ast.ConditionPrefixItem {
        const element: ast.ConditionPrefixItem = {
            kind: ast.SyntaxKind.ConditionPrefixItem,
            container: null,
            conditions: [],
        };

        element.conditions.push(this.ruleCondition(state));
        while (state.canConsume(tokens.Comma)) {
            state.consume(element, CstNodeKind.ConditionPrefixItem_Comma, tokens.Comma);
            element.conditions.push(this.ruleCondition(state));
        }

        return element;
    }

    firstExportsItem = [tokens.ID];
    ruleExportsItem(state: ParserState): ast.ExportsItem {
        const element: ast.ExportsItem = {
            kind: ast.SyntaxKind.ExportsItem,
            container: null,
            reference: null,
        };
        const token = state.consume(element, CstNodeKind.Exports_Procedure, tokens.ID)!;
        element.reference = ast.createReference(
            element,
            token,
            ast.ReferenceType.Variable,
        );
        return element;
    }

    firstExports = [tokens.EXPORTS];
    ruleExports(state: ParserState): ast.Exports {
        const element: ast.Exports = {
            kind: ast.SyntaxKind.Exports,
            container: null,
            procedures: [],
            all: false,
        };

        state.consume(element, CstNodeKind.Exports_EXPORTS, tokens.EXPORTS);
        state.consume(element, CstNodeKind.Exports_OpenParen, tokens.OpenParen);

        if (state.tryConsume(element, CstNodeKind.Exports_AllStar, tokens.Star)) {
            element.all = true;
        } else {
            element.procedures.push(this.ruleExportsItem(state));
            while (state.tryConsume(element, CstNodeKind.Exports_Comma, tokens.Comma)) {
                element.procedures.push(this.ruleExportsItem(state));
            }
        }

        state.consume(element, CstNodeKind.Exports_CloseParen, tokens.CloseParen);
        return element;
    }

    firstReserves = [tokens.RESERVES];
    ruleReserves(state: ParserState): ast.Reserves {
        const element: ast.Reserves = {
            kind: ast.SyntaxKind.Reserves,
            container: null,
            all: false,
            variables: [],
        };

        state.consume(element, CstNodeKind.Reserves_RESERVES, tokens.RESERVES);
        state.consume(element, CstNodeKind.Reserves_OpenParen, tokens.OpenParen);

        if (state.tryConsume(element, CstNodeKind.Reserves_AllStar, tokens.Star)) {
            element.all = true;
        } else {
            const varToken = state.consume(element, CstNodeKind.Reserves_Variables0, tokens.ID)!;
            element.variables.push(varToken.image);
            while (state.tryConsume(element, CstNodeKind.Reserves_Comma, tokens.Comma)) {
                const nextVarToken = state.consume(element, CstNodeKind.Reserves_Variables1, tokens.ID)!;
                element.variables.push(nextVarToken.image);
            }
        }

        state.consume(element, CstNodeKind.Reserves_CloseParen, tokens.CloseParen);
        return element;
    }

    firstOptions = [tokens.OPTIONS];
    ruleOptions(state: ParserState): ast.Options {
        const element: ast.Options = {
            kind: ast.SyntaxKind.Options,
            container: null,
            items: [],
        };

        state.consume(element, CstNodeKind.Options_OPTIONS, tokens.OPTIONS);
        state.consume(element, CstNodeKind.Options_OpenParen, tokens.OpenParen);
        element.items.push(this.ruleOptionsItem(state));
        while (state.tryConsume(element, CstNodeKind.Options_Comma, tokens.Comma)) {
            element.items.push(this.ruleOptionsItem(state));
        }
        state.consume(element, CstNodeKind.Options_CloseParen, tokens.CloseParen);

        return element;
    }

    alternativesOptionsItem: [TokenType[], (state: ParserState) => ast.OptionsItem][] = [
        [[tokens.SimpleOptions], this.ruleSimpleOptionsItem],
        [[tokens.CMPAT], this.ruleCMPATOptionsItem],
        [[tokens.NoMapOption], this.ruleNoMapOptionsItem],
        [[tokens.LINKAGE], this.ruleLinkageOptionsItem],
    ];
    ruleOptionsItem(state: ParserState): ast.OptionsItem {
        return state.consumeAlternatives<ast.OptionsItem>(this.alternativesOptionsItem);
    }

    ruleSimpleOptionsItem(state: ParserState): ast.SimpleOptionsItem {
        const element: ast.SimpleOptionsItem = {
            kind: ast.SyntaxKind.SimpleOptionsItem,
            container: null,
            value: null,
        };
        const token = state.consume(element, CstNodeKind.SimpleOptionsItem_Value, tokens.SimpleOptions);
        if (token) {
            element.value = tokens.SimpleOptions.mapToEnumLiteral(token.tokenTypeIdx);
        }
        return element;
    }

    ruleLinkageOptionsItem(state: ParserState): ast.LinkageOptionsItem {
        const element: ast.LinkageOptionsItem = {
            kind: ast.SyntaxKind.LinkageOptionsItem,
            container: null,
            value: null,
        };
        state.consume(element, CstNodeKind.LinkageOptionsItem_Linkage, tokens.LINKAGE);
        state.consume(element, CstNodeKind.LinkageOptionsItem_OpenParen, tokens.OpenParen);
        const valueToken = state.consume(element, CstNodeKind.LinkageOptionsItem_Value, tokens.LinkageOption);
        if (valueToken) {
            element.value = tokens.LinkageOption.mapToEnumLiteral(valueToken.tokenTypeIdx);
        }
        state.consume(element, CstNodeKind.LinkageOptionsItem_CloseParen, tokens.CloseParen);
        return element;
    }

    ruleCMPATOptionsItem(state: ParserState): ast.CMPATOptionsItem {
        const element: ast.CMPATOptionsItem = {
            kind: ast.SyntaxKind.CMPATOptionsItem,
            container: null,
            value: null,
        };
        state.consume(element, CstNodeKind.CMPATOptionsItem_CMPAT, tokens.CMPAT);
        state.consume(element, CstNodeKind.CMPATOptionsItem_OpenParen, tokens.OpenParen);
        const vxToken = state.consume(element, CstNodeKind.CMPATOptionsItem_Value, tokens.VX);
        if (vxToken) {
            element.value = tokens.VX.mapToEnumLiteral(vxToken.tokenTypeIdx);
        }
        state.consume(element, CstNodeKind.CMPATOptionsItem_CloseParen, tokens.CloseParen);
        return element;
    }

    ruleNoMapOptionsItem(state: ParserState): ast.NoMapOptionsItem {
        const element: ast.NoMapOptionsItem = {
            kind: ast.SyntaxKind.NoMapOptionsItem,
            container: null,
            parameters: [],
            type: null,
        };
        const typeToken = state.consume(element, CstNodeKind.NoMapOptionsItem_Type, tokens.NoMapOption);
        if (typeToken) {
            element.type = tokens.NoMapOption.mapToEnumLiteral(typeToken.tokenTypeIdx);
        }

        if (state.tryConsume(element, CstNodeKind.NoMapOptionsItem_OpenParen, tokens.OpenParen)) {
            const idToken = state.consume(element, CstNodeKind.NoMapOptionsItem_Parameters0, tokens.ID);
            if (idToken) {
                element.parameters.push(idToken.image);
            }
            while (state.tryConsume(element, CstNodeKind.NoMapOptionsItem_Comma, tokens.Comma)) {
                const nextIdToken = state.consume(element, CstNodeKind.NoMapOptionsItem_Parameters1, tokens.ID);
                if (nextIdToken) {
                    element.parameters.push(nextIdToken.image);
                }
            }
            state.consume(element, CstNodeKind.NoMapOptionsItem_CloseParen, tokens.CloseParen);
        }

        return element;
    }

    firstProcedureStatement = [tokens.PROCEDURE];
    ruleProcedureStatement(state: ParserState): ast.ProcedureStatement {
        const element: ast.ProcedureStatement = {
            kind: ast.SyntaxKind.ProcedureStatement,
            container: null,
            procToken: null,
            end: null,
            options: [],
            parameters: [],
            statements: [],
            statement: false,
            xProc: false,
        };
        const procToken = state.consume(element, CstNodeKind.ProcedureStatement_PROCEDURE, tokens.PROCEDURE);
        element.procToken = procToken;
        element.xProc = procToken?.image[0].toUpperCase() === "X";

        if (state.tryConsume(element, CstNodeKind.ProcedureStatement_OpenParenParams, tokens.OpenParen)) {
            element.parameters.push(this.ruleProcedureParameter(state));
            while (state.tryConsume(element, CstNodeKind.ProcedureStatement_Comma, tokens.Comma)) {
                element.parameters.push(this.ruleProcedureParameter(state));
            }
            state.consume(element, CstNodeKind.ProcedureStatement_CloseParenParams, tokens.CloseParen);
        }

        while (!state.eof && !state.canConsume(tokens.Semicolon)) {
            if (state.canConsume(tokens.RETURNS)) {
                element.options.push(this.ruleReturnsOption(state));
            } else if (state.canConsumeFirst(this.firstOptions)) {
                element.options.push(this.ruleOptions(state));
            } else if (state.tryConsume(element, CstNodeKind.ProcedureStatement_Recursive, tokens.RECURSIVE)) {
                element.options.push({
                    kind: ast.SyntaxKind.ProcedureRecursiveOption,
                    container: null,
                })
            } else if (state.canConsume(tokens.ProcedureOrder)) {
                const token = state.consume(element, CstNodeKind.ProcedureStatement_Order, tokens.ProcedureOrder);
                if (token) {
                    const order = ast.createProcedureOrderOption();
                    order.order = tokens.ProcedureOrder.mapToEnumLiteral(
                        token.tokenTypeIdx,
                    );
                    element.options.push(order);
                }
            } else if (state.tryConsume(element, CstNodeKind.ProcedureStatement_EXTERNAL, tokens.EXTERNAL)) {
                state.consume(element, CstNodeKind.ProcedureStatement_OpenParenEnv, tokens.OpenParen);
                const option: ast.EnvironmentOption = {
                    kind: ast.SyntaxKind.EnvironmentOption,
                    container: null,
                    environment: null,
                }
                option.environment = this.ruleExpression(state);
                element.options.push(option);
                state.consume(element, CstNodeKind.ProcedureStatement_CloseParenEnv, tokens.CloseParen);
            } else if (state.canConsume(tokens.ScopeAttribute)) {
                const scopeToken = state.consume(element, CstNodeKind.ScopeAttribute_Scope, tokens.ScopeAttribute);
                if (scopeToken) {
                    const scope = ast.createProcedureScopeOption();
                    scope.scope = tokens.ScopeAttribute.mapToEnumLiteral(
                        scopeToken.tokenTypeIdx,
                    );
                    element.options.push(scope);
                }
            } else {
                //TODO better error message
                throw new Error("Unexpected token in procedure statement options");
            }
        }
        state.consume(element, CstNodeKind.ProcedureStatement_Semicolon0, tokens.Semicolon);

        while (!state.eof && state.canConsumeFirst(this.firstStatement)) {
            const statement = this.ruleStatement(state);
            element.statements.push(statement);
        }
        state.tryConsume(element, CstNodeKind.ProcedureStatement_PROCEDURE_END, tokens.PROCEDURE);
        element.end = this.ruleEndStatement(state);
        state.consume(element, CstNodeKind.ProcedureStatement_Semicolon1, tokens.Semicolon);
        return element;
    }


    //TODO
    ruleProcedureParameter(state: ParserState): ast.ProcedureParameter {
        return undefined!;
    }

    ruleExpression(state: ParserState): ast.Expression {
        return undefined!;
    }

    ruleReturnsOption(state: ParserState): ast.ReturnsOption {
        //TODO
        return undefined!;
    }

    ruleCondition(state: ParserState): ast.Condition {
        //TODO
        return undefined!;
    }





    firstStatement = [tokens.ID, tokens.OpenParen];
    ruleStatement(state: ParserState): ast.Statement {
        const element: ast.Statement = {
            kind: ast.SyntaxKind.Statement,
            container: null,
            condition: null,
            labels: [],
            value: null,
        };

        if (state.canConsume(tokens.OpenParen)) {
            element.condition = this.ruleConditionPrefix(state);
        }

        while (state.canConsume(tokens.ID)) {
            element.labels.push(this.ruleLabelPrefix(state));
        }

        element.value = this.ruleUnit(state);

        return element;
    }

    ruleUnit(state: ParserState): ast.Unit {
        // TODO: Implement the actual parsing logic for Unit (OR_RULE)
        // This should dispatch to the correct statement type based on the next token
        return undefined!;
    }

    ruleLabelPrefix(state: ParserState): ast.LabelPrefix {
        const element: ast.LabelPrefix = {
            kind: ast.SyntaxKind.LabelPrefix,
            container: null,
            nameToken: null,
            name: null,
        };

        const idToken = state.consume(element, CstNodeKind.LabelPrefix_Name, tokens.ID)!;
        element.name = idToken.image;
        element.nameToken = idToken;

        state.consume(element, CstNodeKind.LabelPrefix_Colon, tokens.Colon);

        return element;
    }

    ruleEndStatement(state: ParserState): ast.EndStatement {
        const element: ast.EndStatement = {
            kind: ast.SyntaxKind.EndStatement,
            container: null,
            labels: [],
            label: null,
        };

        //TODO

        return element;
    }
}

export const HandwrittenParserInstance = new HandwrittenParser();
