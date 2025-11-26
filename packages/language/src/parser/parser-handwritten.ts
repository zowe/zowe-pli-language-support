import { choice, Parser, orRule, rule, sequence } from "./parser-types";
import * as ast from "../syntax-tree/ast";
import { IRecognitionException } from "chevrotain";
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
        return this.pliProgram.rule(state);
    }

    pliProgram = rule(
        () => this.statement.first,
        (state: ParserState): ast.Program => {
            const program: ast.Program = {
                kind: ast.SyntaxKind.Program,
                container: null,
                statements: [],
            };
            // Parse one or more packages (or top-level statements)
            while (!state.eof && state.canConsumeFirst(this.statement.first)) {
                const statement = this.statement.rule(state);
                program.statements.push(statement);
            }
            return program;
        }
    );

    package = rule(
        sequence(tokens.PACKAGE),
        (state: ParserState): ast.Package => {
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
            if (state.canConsumeFirst(this.exports.first)) {
                element.exports = this.exports.rule(state);
            }
            if (state.canConsumeFirst(this.reserves.first)) {
                element.reserves = this.reserves.rule(state);
            }
            if (state.canConsumeFirst(this.options.first)) {
                element.options = this.options.rule(state);
            }
            state.consume(element, CstNodeKind.Package_Semicolon0, tokens.Semicolon);
            while (!state.eof && state.canConsumeFirst(this.statement.first)) {
                const statement = this.statement.rule(state);
                element.statements.push(statement);
            }
            element.end = this.endStatement.rule(state);
            state.consume(element, CstNodeKind.Package_Semicolon1, tokens.Semicolon);
            return element;
        }
    );

    conditionPrefix = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.ConditionPrefix => {
            const element: ast.ConditionPrefix = {
                kind: ast.SyntaxKind.ConditionPrefix,
                container: null,
                items: [],
            };

            do {
                state.consume(element, CstNodeKind.ConditionPrefix_OpenParen, tokens.OpenParen);
                element.items.push(this.conditionPrefixItem.rule(state));
                state.consume(element, CstNodeKind.ConditionPrefix_CloseParen, tokens.CloseParen);
                state.consume(element, CstNodeKind.ConditionPrefix_Colon, tokens.Colon);
            } while (state.canConsume(tokens.OpenParen));

            return element;
        }
    );

    conditionPrefixItem = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.ConditionPrefixItem => {
            const element: ast.ConditionPrefixItem = {
                kind: ast.SyntaxKind.ConditionPrefixItem,
                container: null,
                conditions: [],
            };

            element.conditions.push(this.condition.rule(state));
            while (state.canConsume(tokens.Comma)) {
                state.consume(element, CstNodeKind.ConditionPrefixItem_Comma, tokens.Comma);
                element.conditions.push(this.condition.rule(state));
            }

            return element;
        }
    );

    exportsItem = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.ExportsItem => {
            const element: ast.ExportsItem = {
                kind: ast.SyntaxKind.ExportsItem,
                container: null,
                reference: null,
            };
            const token = state.consume(element, CstNodeKind.Exports_Procedure, tokens.ID);
            if (token) {
                element.reference = ast.createReference(
                    element,
                    token,
                    ast.ReferenceType.Variable,
                );
            }
            return element;
        }
    );

    exports = rule(
        sequence(tokens.EXPORTS),
        (state: ParserState): ast.Exports => {
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
                element.procedures.push(this.exportsItem.rule(state));
                while (state.tryConsume(element, CstNodeKind.Exports_Comma, tokens.Comma)) {
                    element.procedures.push(this.exportsItem.rule(state));
                }
            }

            state.consume(element, CstNodeKind.Exports_CloseParen, tokens.CloseParen);
            return element;
        }
    );

    reserves = rule(
        sequence(tokens.RESERVES),
        (state: ParserState): ast.Reserves => {
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
                const varToken = state.consume(element, CstNodeKind.Reserves_Variables0, tokens.ID);
                if (varToken) {
                    element.variables.push(varToken.image);
                }
                while (state.tryConsume(element, CstNodeKind.Reserves_Comma, tokens.Comma)) {
                    const nextVarToken = state.consume(element, CstNodeKind.Reserves_Variables1, tokens.ID);
                    if (nextVarToken) {
                        element.variables.push(nextVarToken.image);
                    }
                }
            }

            state.consume(element, CstNodeKind.Reserves_CloseParen, tokens.CloseParen);
            return element;
        }
    );

    options = rule(
        sequence(tokens.OPTIONS),
        (state: ParserState): ast.Options => {
            const element: ast.Options = {
                kind: ast.SyntaxKind.Options,
                container: null,
                items: [],
            };

            state.consume(element, CstNodeKind.Options_OPTIONS, tokens.OPTIONS);
            state.consume(element, CstNodeKind.Options_OpenParen, tokens.OpenParen);
            element.items.push(this.optionsItem.rule(state));
            while (state.tryConsume(element, CstNodeKind.Options_Comma, tokens.Comma)) {
                element.items.push(this.optionsItem.rule(state));
            }
            state.consume(element, CstNodeKind.Options_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    optionsItem = orRule<ast.OptionsItem>(
        () => this.simpleOptionsItem,
        () => this.linkageOptionsItem,
        () => this.CMPATOptionsItem,
        () => this.noMapOptionsItem,
    );


    simpleOptionsItem = rule(
        sequence(tokens.SimpleOptions),
        (state: ParserState): ast.SimpleOptionsItem => {
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
    );

    linkageOptionsItem = rule(
        sequence(tokens.LINKAGE),
        (state: ParserState): ast.LinkageOptionsItem => {
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
    );

    CMPATOptionsItem = rule(
        sequence(tokens.CMPAT),
        (state: ParserState): ast.CMPATOptionsItem => {
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
    );

    noMapOptionsItem = rule(
        sequence(tokens.NoMapOption),
        (state: ParserState): ast.NoMapOptionsItem => {
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
    );

    procedureStatement = rule(
        sequence(tokens.PROCEDURE),
        (state: ParserState): ast.ProcedureStatement => {
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
                element.parameters.push(this.procedureParameter.rule(state));
                while (state.tryConsume(element, CstNodeKind.ProcedureStatement_Comma, tokens.Comma)) {
                    element.parameters.push(this.procedureParameter.rule(state));
                }
                state.consume(element, CstNodeKind.ProcedureStatement_CloseParenParams, tokens.CloseParen);
            }

            while (!state.eof && !state.canConsume(tokens.Semicolon)) {
                if (state.canConsume(tokens.RETURNS)) {
                    element.options.push(this.returnsOption.rule(state));
                } else if (state.canConsumeFirst(this.options.first)) {
                    element.options.push(this.options.rule(state));
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
                } else if (state.canConsumeFirst(this.environmentOption.first)) {
                    element.options.push(this.environmentOption.rule(state));
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

            while (!state.eof && state.canConsumeFirst(this.statement.first)) {
                const statement = this.statement.rule(state);
                element.statements.push(statement);
            }
            state.tryConsume(element, CstNodeKind.ProcedureStatement_PROCEDURE_END, tokens.PROCEDURE);
            element.end = this.endStatement.rule(state);
            state.consume(element, CstNodeKind.ProcedureStatement_Semicolon1, tokens.Semicolon);
            return element;
        }
    );

    labelPrefix = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.LabelPrefix => {
            const element: ast.LabelPrefix = {
                kind: ast.SyntaxKind.LabelPrefix,
                container: null,
                nameToken: null,
                name: null,
            };
            const idToken = state.consume(element, CstNodeKind.LabelPrefix_Name, tokens.ID);
            if (idToken) {
                element.name = idToken.image;
                element.nameToken = idToken;
            }
            state.consume(element, CstNodeKind.LabelPrefix_Colon, tokens.Colon);
            return element;
        }
    );

    firstEntryStatement = rule(
        sequence(tokens.ENTRY),
        (state: ParserState): ast.EntryStatement => {
            const element: ast.EntryStatement = {
                kind: ast.SyntaxKind.EntryStatement,
                container: null,
                parameters: [],
                variable: [],
                limited: [],
                returns: [],
                options: [],
                environmentName: [],
            };

            state.consume(element, CstNodeKind.EntryStatement_ENTRY, tokens.ENTRY);

            if (state.tryConsume(element, CstNodeKind.EntryStatement_OpenParenParams, tokens.OpenParen)) {
                if (state.canConsumeFirst(this.procedureParameter.first)) {
                    element.parameters.push(this.procedureParameter.rule(state));
                    while (state.tryConsume(element, CstNodeKind.EntryStatement_Comma, tokens.Comma)) {
                        element.parameters.push(this.procedureParameter.rule(state));
                    }
                }
                state.consume(element, CstNodeKind.EntryStatement_CloseParenParams, tokens.CloseParen);
            }

            // Parse optional attributes (can appear multiple times)
            while (!state.eof && !state.canConsume(tokens.Semicolon)) {
                if (state.canConsumeFirst(this.environmentOption.first)) {
                    element.environmentName.push(this.environmentOption.rule(state));
                } else if (state.tryConsume(element, CstNodeKind.EntryStatement_Variable, tokens.VARIABLE)) {
                    element.variable.push("VARIABLE");
                } else if (state.tryConsume(element, CstNodeKind.EntryStatement_Limited, tokens.LIMITED)) {
                    element.limited.push("LIMITED");
                } else if (state.canConsume(tokens.RETURNS)) {
                    element.returns.push(this.returnsOption.rule(state));
                } else if (state.canConsumeFirst(this.options.first)) {
                    element.options.push(this.options.rule(state));
                } else {
                    // TODO: better error message
                    throw new Error("Unexpected token in entry statement");
                }
            }

            state.consume(element, CstNodeKind.EntryStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    environmentOption = rule(
        sequence(tokens.EXTERNAL),
        (state: ParserState): ast.EnvironmentOption => {
            const element = ast.createEnvironmentOption();
            state.consume(element, CstNodeKind.EntryStatement_EXTERNAL, tokens.EXTERNAL);
            if (state.tryConsume(element, CstNodeKind.EntryStatement_OpenParenEnv, tokens.OpenParen)) {
                element.environment = this.expression.rule(state);
                state.consume(element, CstNodeKind.EntryStatement_CloseParenEnv, tokens.CloseParen);
            }
            return element;
        }
    );

    statement = rule(
        choice(
            sequence(tokens.ID),
            sequence(tokens.OpenParen),
            //TODO add from Unit first sets
        ),
        (state: ParserState): ast.Statement => {
            const element: ast.Statement = {
                kind: ast.SyntaxKind.Statement,
                container: null,
                condition: null,
                labels: [],
                value: null,
            };

            if (state.canConsumeFirst(this.conditionPrefix.first)) {
                element.condition = this.conditionPrefix.rule(state);
            }

            while (state.canConsumeFirst(this.labelPrefix.first)) {
                element.labels.push(this.labelPrefix.rule(state));
            }

            element.value = this.unit.rule(state);

            return element;
        }
    );

    unit = orRule<ast.Unit>(
        () => this.allocateStatement,
        () => this.assertStatement,
        () => this.assignmentStatement,
        () => this.attachStatement,
        () => this.beginStatement,
        () => this.callStatement,
        () => this.cancelThreadStatement,
        () => this.closeStatement,
        () => this.declareStatement,
        () => this.defaultStatement,
        () => this.defineAliasStatement,
        () => this.defineOrdinalStatement,
        () => this.defineStructureStatement,
        () => this.delayStatement,
        () => this.deleteStatement,
        () => this.detachStatement,
        () => this.displayStatement,
        () => this.doStatement,
        () => this.entryStatement,
        () => this.execStatement,
        () => this.exitStatement,
        () => this.fetchStatement,
        () => this.flushStatement,
        () => this.formatStatement,
        () => this.freeStatement,
        () => this.getStatement,
        () => this.goToStatement,
        () => this.ifStatement,
        () => this.iterateStatement,
        () => this.leaveStatement,
        () => this.locateStatement,
        () => this.nullStatement,
        () => this.onStatement,
        () => this.openStatement,
        () => this.procincDirective, // TODO integrate into preprocessor
        () => this.putStatement,
        () => this.qualifyStatement,
        () => this.readStatement,
        () => this.reinitStatement,
        () => this.releaseStatement,
        () => this.resignalStatement,
        () => this.returnStatement,
        () => this.revertStatement,
        () => this.rewriteStatement,
        () => this.selectStatement,
        () => this.signalStatement,
        () => this.stopStatement,
        () => this.waitStatement,
        () => this.writeStatement,
        () => this.procedureStatement,
        () => this.package,
    );

    allocateStatement = rule(
        sequence(tokens.ALLOCATE),
        (state: ParserState): ast.AllocateStatement => {
            const element: ast.AllocateStatement = {
                kind: ast.SyntaxKind.AllocateStatement,
                container: null,
                variables: [],
            };
            state.consume(element, CstNodeKind.AllocateStatement_ALLOCATE, tokens.ALLOCATE);
            element.variables.push(this.allocatedVariable.rule(state));
            while (state.tryConsume(element, CstNodeKind.AllocateStatement_Comma, tokens.Comma)) {
                element.variables.push(this.allocatedVariable.rule(state));
            }
            state.consume(element, CstNodeKind.AllocateStatement_Semicolon, tokens.Semicolon);
            return element;
        }
    );

    allocatedVariable = rule(
        choice(
            sequence(tokens.NUMBER),
            sequence(tokens.ID)
        ),
        (state: ParserState): ast.AllocatedVariable => {
            const element: ast.AllocatedVariable = {
                kind: ast.SyntaxKind.AllocatedVariable,
                container: null,
                level: null,
                var: null,
                attribute: null,
            };

            if (state.tryConsume(element, CstNodeKind.AllocatedVariable_LevelNumber, tokens.NUMBER)) {
                const levelToken = state.last;
                element.level = levelToken!.image;
            }

            element.var = this.referenceItem.rule(state);

            if (state.canConsumeFirst(this.allocateAttribute.first)) {
                element.attribute = this.allocateAttribute.rule(state);
            }

            return element;
        }
    );

    ruleAllocateAttribute = orRule<ast.AllocateAttribute>(
        () => this.allocateDimension,
        () => this.allocateType,
        () => this.allocateLocationReferenceIn,
        () => this.allocateLocationReferenceSet,
        () => this.initialAttribute,
    );

    allocateLocationReferenceIn = rule(
        sequence(tokens.IN),
        (state: ParserState): ast.AllocateLocationReferenceIn => {
            const element: ast.AllocateLocationReferenceIn = {
                kind: ast.SyntaxKind.AllocateLocationReferenceIn,
                container: null,
                area: null,
            };

            state.consume(element, CstNodeKind.AllocateLocationReferenceIn_IN, tokens.IN);
            state.consume(element, CstNodeKind.AllocateLocationReferenceIn_OpenParen, tokens.OpenParen);
            element.area = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.AllocateLocationReferenceIn_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    allocateLocationReferenceSet = rule(
        sequence(tokens.SET),
        (state: ParserState): ast.AllocateLocationReferenceSet => {
            const element: ast.AllocateLocationReferenceSet = {
                kind: ast.SyntaxKind.AllocateLocationReferenceSet,
                container: null,
                locatorVariable: null,
            };

            state.consume(element, CstNodeKind.AllocateLocationReferenceSet_SET, tokens.SET);
            state.consume(element, CstNodeKind.AllocateLocationReferenceSet_OpenParen, tokens.OpenParen);
            element.locatorVariable = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.AllocateLocationReferenceSet_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    allocateDimension = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.AllocateDimension => {
            const element: ast.AllocateDimension = {
                kind: ast.SyntaxKind.AllocateDimension,
                container: null,
                dimensions: null,
            };

            element.dimensions = this.dimensions.rule(state);

            return element;
        }
    );

    allocateType = rule(
        sequence(tokens.AllocateAttributeType),
        (state: ParserState): ast.AllocateType => {
            const element: ast.AllocateType = {
                kind: ast.SyntaxKind.AllocateType,
                container: null,
                type: null,
                dimensions: null,
            };

            const typeToken = state.consume(element, CstNodeKind.AllocateAttributeType_Type, tokens.AllocateAttributeType);
            if (typeToken) {
                element.type = tokens.AllocateAttributeType.mapToEnumLiteral(typeToken.tokenTypeIdx);
            }

            if (state.canConsumeFirst(this.dimensions.first)) {
                element.dimensions = this.dimensions.rule(state);
            }

            return element;
        }
    );

    assertStatement = rule(
        sequence(tokens.ASSERT),
        (state: ParserState): ast.AssertStatement => {
            const element: ast.AssertStatement = {
                kind: ast.SyntaxKind.AssertStatement,
                container: null,
                true: false,
                actual: null,
                false: false,
                unreachable: false,
                displayExpression: null,
                compare: false,
                expected: null,
                operator: null,
            };

            state.consume(element, CstNodeKind.AssertStatement_ASSERT, tokens.ASSERT);

            if (state.canConsume(tokens.Boolean)) {
                const boolToken = state.consume(element, CstNodeKind.AssertStatement_Boolean, tokens.Boolean);
                if (boolToken) {
                    if (boolToken.image.toUpperCase() === "TRUE") {
                        element.true = true;
                    } else {
                        element.false = true;
                    }
                }
                state.consume(element, CstNodeKind.AssertStatement_OpenParen0, tokens.OpenParen);
                element.actual = this.expression.rule(state);
                state.consume(element, CstNodeKind.AssertStatement_CloseParen0, tokens.CloseParen);
            } else if (state.tryConsume(element, CstNodeKind.AssertStatement_COMPARE, tokens.COMPARE)) {
                element.compare = true;
                state.consume(element, CstNodeKind.AssertStatement_OpenParen1, tokens.OpenParen);
                element.actual = this.expression.rule(state);
                state.consume(element, CstNodeKind.AssertStatement_Comma0, tokens.Comma);
                element.expected = this.expression.rule(state);
                if (state.tryConsume(element, CstNodeKind.AssertStatement_Comma1, tokens.Comma)) {
                    const operatorToken = state.consume(element, CstNodeKind.AssertStatement_OperatorString, tokens.STRING_TERM);
                    if (operatorToken) {
                        element.operator = operatorToken.image;
                    }
                }
                state.consume(element, CstNodeKind.AssertStatement_CloseParen1, tokens.CloseParen);
            } else if (state.tryConsume(element, CstNodeKind.AssertStatement_UNREACHABLE, tokens.UNREACHABLE)) {
                element.unreachable = true;
            } else {
                // TODO better error message
                throw new Error("Expected ASSERT statement variant");
            }

            if (state.tryConsume(element, CstNodeKind.AssertStatement_TEXT, tokens.TEXT)) {
                element.displayExpression = this.expression.rule(state);
            }

            return element;
        }
    );

    assignmentStatement = rule(
        () => this.locatorCall.first,
        (state: ParserState): ast.AssignmentStatement => {
            const element: ast.AssignmentStatement = {
                kind: ast.SyntaxKind.AssignmentStatement,
                container: null,
                refs: [],
                operator: null,
                expression: null,
                dimacrossExpr: null,
            };

            // Parse left-hand side references (comma-separated)
            element.refs.push(this.locatorCall.rule(state));

            while (state.tryConsume(element, CstNodeKind.AssignmentStatement_Comma0, tokens.Comma)) {
                element.refs.push(this.locatorCall.rule(state));
            }

            // Parse assignment operator
            const operatorToken = state.consume(element, CstNodeKind.AssignmentStatement_Operator, tokens.AssignmentOperator);
            if (operatorToken) {
                element.operator = tokens.AssignmentOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx);
            }

            // Parse right-hand side expression
            element.expression = this.expression.rule(state);

            // Optional BY clause
            if (state.tryConsume(element, CstNodeKind.AssignmentStatement_Comma1, tokens.Comma)) {
                state.consume(element, CstNodeKind.AssignmentStatement_BY, tokens.BY);

                if (state.tryConsume(element, CstNodeKind.AssignmentStatement_NAME, tokens.NAME)) {
                    // BY NAME variant
                } else if (state.tryConsume(element, CstNodeKind.AssignmentStatement_DIMACROSS, tokens.DIMACROSS)) {
                    // BY DIMACROSS variant
                    element.dimacrossExpr = this.expression.rule(state);
                } else {
                    //TODO better error message
                    throw new Error("Expected NAME or DIMACROSS after BY");
                }
            }

            state.consume(element, CstNodeKind.AssignmentStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    attachStatement = rule(
        sequence(tokens.ATTACH),
        (state: ParserState): ast.AttachStatement => {
            const element: ast.AttachStatement = {
                kind: ast.SyntaxKind.AttachStatement,
                container: null,
                reference: null,
                task: null,
                environment: false,
                tstack: null,
            };

            state.consume(element, CstNodeKind.AttachStatement_ATTACH, tokens.ATTACH);
            element.reference = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.AttachStatement_THREAD, tokens.THREAD);
            state.consume(element, CstNodeKind.AttachStatement_OpenParenTask, tokens.OpenParen);
            element.task = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.AttachStatement_CloseParenTask, tokens.CloseParen);

            // Optional ENVIRONMENT clause
            if (state.tryConsume(element, CstNodeKind.AttachStatement_ENVIRONMENT, tokens.ENVIRONMENT)) {
                element.environment = true;
                state.consume(element, CstNodeKind.AttachStatement_OpenParenEnvironment, tokens.OpenParen);

                // Optional TSTACK inside ENVIRONMENT
                if (state.tryConsume(element, CstNodeKind.AttachStatement_TSTACK, tokens.TSTACK)) {
                    state.consume(element, CstNodeKind.AttachStatement_OpenParenTStack, tokens.OpenParen);
                    element.tstack = this.expression.rule(state);
                    state.consume(element, CstNodeKind.AttachStatement_CloseParenTStack, tokens.CloseParen);
                }

                state.consume(element, CstNodeKind.AttachStatement_CloseParenEnvironment, tokens.CloseParen);
            }

            state.consume(element, CstNodeKind.AttachStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    beginStatement = rule(
        sequence(tokens.BEGIN),
        (state: ParserState): ast.BeginStatement => {
            const element: ast.BeginStatement = {
                kind: ast.SyntaxKind.BeginStatement,
                container: null,
                options: null,
                recursive: false,
                statements: [],
                end: null,
                order: false,
                reorder: false,
            };

            state.consume(element, CstNodeKind.BeginStatement_BEGIN, tokens.BEGIN);

            if (state.canConsumeFirst(this.options.first)) {
                element.options = this.options.rule(state);
            }

            if (state.tryConsume(element, CstNodeKind.BeginStatement_RECURSIVE, tokens.RECURSIVE)) {
                element.recursive = true;
            }

            if (state.tryConsume(element, CstNodeKind.BeginStatement_ORDER, tokens.ORDER)) {
                const orderToken = state.last;
                if (orderToken!.image.toUpperCase() === "ORDER") {
                    element.order = true;
                } else if (orderToken!.image.toUpperCase() === "REORDER") {
                    element.reorder = true;
                }
            }

            state.consume(element, CstNodeKind.BeginStatement_Semicolon0, tokens.Semicolon);

            while (!state.eof && !state.canConsume(tokens.END)) {
                element.statements.push(this.statement.rule(state));
            }

            element.end = this.endStatement.rule(state);
            state.consume(element, CstNodeKind.BeginStatement_Semicolon1, tokens.Semicolon);

            return element;
        }
    );

    endStatement = rule(
        choice(
            sequence(tokens.ID),
            sequence(tokens.END)
        ),
        (state: ParserState): ast.EndStatement => {
            const element: ast.EndStatement = {
                kind: ast.SyntaxKind.EndStatement,
                container: null,
                labels: [],
                label: null,
            };

            // Parse optional label prefixes
            while (state.canConsumeFirst(this.labelPrefix.first)) {
                element.labels.push(this.labelPrefix.rule(state));
            }

            state.consume(element, CstNodeKind.EndStatement_END, tokens.END);

            // Optional label reference
            if (state.canConsumeFirst(this.labelReference.first)) {
                element.label = this.labelReference.rule(state);
            }

            return element;
        }
    );

    callStatement = rule(
        sequence(tokens.CALL),
        (state: ParserState): ast.CallStatement => {
            const element: ast.CallStatement = {
                kind: ast.SyntaxKind.CallStatement,
                container: null,
                call: null,
            };
            state.consume(element, CstNodeKind.CallStatement_CALL, tokens.CALL);
            element.call = this.procedureCall.rule(state);
            state.consume(element, CstNodeKind.CallStatement_Semicolon, tokens.Semicolon);
            return element;
        }
    );

    cancelThreadStatement = rule(
        sequence(tokens.CANCEL),
        (state: ParserState): ast.CancelThreadStatement => {
            const element: ast.CancelThreadStatement = {
                kind: ast.SyntaxKind.CancelThreadStatement,
                container: null,
                thread: null,
            };

            state.consume(element, CstNodeKind.CancelThreadStatement_CANCEL, tokens.CANCEL);
            state.consume(element, CstNodeKind.CancelThreadStatement_THREAD, tokens.THREAD);
            state.consume(element, CstNodeKind.CancelThreadStatement_OpenParen, tokens.OpenParen);
            element.thread = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.CancelThreadStatement_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.CancelThreadStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    closeStatement = rule(
        sequence(tokens.CLOSE),
        (state: ParserState): ast.CloseStatement => {
            const element: ast.CloseStatement = {
                kind: ast.SyntaxKind.CloseStatement,
                container: null,
                files: [],
            };

            state.consume(element, CstNodeKind.CloseStatement_CLOSE, tokens.CLOSE);
            state.consume(element, CstNodeKind.CloseStatement_FILE0, tokens.FILE);
            state.consume(element, CstNodeKind.CloseStatement_OpenParen0, tokens.OpenParen);

            // First file - either MemberCall or Star
            if (state.canConsumeFirst(this.memberCall.first)) {
                element.files.push(this.memberCall.rule(state));
            } else if (state.tryConsume(element, CstNodeKind.CloseStatement_FilesStar0, tokens.Star)) {
                const starToken = state.last;
                element.files.push(starToken!.image as "*");
            } else {
                //TODO better error message
                throw new Error("Expected file reference or '*' in CLOSE statement");
            }

            state.consume(element, CstNodeKind.CloseStatement_CloseParen0, tokens.CloseParen);

            // Additional files (can have optional commas)
            while (state.canConsume(tokens.FILE) || state.canConsume(tokens.Comma)) {
                // Optional comma before additional file
                state.tryConsume(element, CstNodeKind.CloseStatement_Comma, tokens.Comma);

                state.consume(element, CstNodeKind.CloseStatement_FILE1, tokens.FILE);
                state.consume(element, CstNodeKind.CloseStatement_OpenParen, tokens.OpenParen);

                // File reference - either MemberCall or Star
                if (state.canConsumeFirst(this.memberCall.first)) {
                    element.files.push(this.memberCall.rule(state));
                } else if (state.tryConsume(element, CstNodeKind.CloseStatement_FilesStar1, tokens.Star)) {
                    const starToken = state.last;
                    element.files.push(starToken!.image as "*");
                } else {
                    //TODO better error message
                    throw new Error("Expected file reference or '*' in CLOSE statement");
                }

                state.consume(element, CstNodeKind.CloseStatement_CloseParen1, tokens.CloseParen);
            }

            state.consume(element, CstNodeKind.CloseStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    defaultStatement = rule(
        sequence(tokens.DEFAULT),
        (state: ParserState): ast.DefaultStatement => {
            const element: ast.DefaultStatement = {
                kind: ast.SyntaxKind.DefaultStatement,
                container: null,
                expressions: [],
            };

            state.consume(element, CstNodeKind.DefaultStatement_DEFAULT, tokens.DEFAULT);

            element.expressions.push(this.defaultExpression.rule(state));

            while (state.tryConsume(element, CstNodeKind.DefaultStatement_Comma, tokens.Comma)) {
                element.expressions.push(this.defaultExpression.rule(state));
            }

            state.consume(element, CstNodeKind.DefaultStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    defaultExpression = rule(
        () => this.defaultExpressionPart.first,
        (state: ParserState): ast.DefaultExpression => {
            const element: ast.DefaultExpression = {
                kind: ast.SyntaxKind.DefaultExpression,
                container: null,
                expression: null,
                attributes: [],
            };

            element.expression = this.defaultExpressionPart.rule(state);

            while (state.canConsumeFirst(this.defaultDeclarationAttribute.first)) {
                element.attributes.push(this.defaultDeclarationAttribute.rule(state));
            }

            return element;
        }
    );

    defaultExpressionPart = rule(
        choice(
            sequence(tokens.DESCRIPTORS),
            sequence(tokens.RANGE),
            sequence(tokens.OpenParen)
        ),
        (state: ParserState): ast.DefaultExpressionPart => {
            const element: ast.DefaultExpressionPart = {
                kind: ast.SyntaxKind.DefaultExpressionPart,
                container: null,
                expression: null,
                identifiers: null,
            };

            if (state.canConsume(tokens.DESCRIPTORS)) {
                // DESCRIPTORS variant
                state.consume(element, CstNodeKind.DefaultExpressionPart_DESCRIPTORS, tokens.DESCRIPTORS);
                element.expression = this.defaultAttributeExpression.rule(state);
            } else if (state.canConsume(tokens.RANGE)) {
                // RANGE variant
                state.consume(element, CstNodeKind.DefaultExpressionPart_RANGE, tokens.RANGE);
                state.consume(element, CstNodeKind.DefaultExpressionPart_OpenParenRange, tokens.OpenParen);
                element.identifiers = this.defaultRangeIdentifiers.rule(state);
                state.consume(element, CstNodeKind.DefaultExpressionPart_CloseParenRange, tokens.CloseParen);
            } else if (state.canConsume(tokens.OpenParen)) {
                // Parenthesized attribute expression variant
                state.consume(element, CstNodeKind.DefaultExpressionPart_OpenParenAttribute, tokens.OpenParen);
                element.expression = this.defaultAttributeExpression.rule(state);
                state.consume(element, CstNodeKind.DefaultExpressionPart_CloseParenAttribute, tokens.CloseParen);
            } else {
                //TODO better error message
                throw new Error("Expected DESCRIPTORS, RANGE, or parenthesized expression in DefaultExpressionPart");
            }

            return element;
        }
    );

    defaultRangeIdentifiers = rule(
        choice(
            sequence(tokens.Star),
            sequence(tokens.ID),
        ),
        (state: ParserState): ast.DefaultRangeIdentifiers => {
            const element: ast.DefaultRangeIdentifiers = {
                kind: ast.SyntaxKind.DefaultRangeIdentifiers,
                container: null,
                identifiers: [],
            };

            // Parse first identifier (Star or DefaultRangeIdentifierItem)
            if (state.canConsume(tokens.Star)) {
                const starToken = state.consume(element, CstNodeKind.DefaultRangeIdentifiers_Star0, tokens.Star);
                if (starToken) {
                    element.identifiers.push(starToken.image as "*");
                }
            } else {
                element.identifiers.push(this.defaultRangeIdentifierItem.rule(state));
            }

            // Parse additional comma-separated identifiers
            while (state.tryConsume(element, CstNodeKind.DefaultRangeIdentifiers_Comma, tokens.Comma)) {
                if (state.canConsume(tokens.Star)) {
                    const starToken = state.consume(element, CstNodeKind.DefaultRangeIdentifiers_Star1, tokens.Star);
                    if (starToken) {
                        element.identifiers.push(starToken.image as "*");
                    }
                } else {
                    element.identifiers.push(this.defaultRangeIdentifierItem.rule(state));
                }
            }

            return element;
        }
    );

    defaultRangeIdentifierItem = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.DefaultRangeIdentifierItem => {
            const element: ast.DefaultRangeIdentifierItem = {
                kind: ast.SyntaxKind.DefaultRangeIdentifierItem,
                container: null,
                from: null,
                to: null,
            };

            const fromToken = state.consume(element, CstNodeKind.DefaultRangeIdentifierItem_FromID, tokens.ID);
            if (fromToken) {
                element.from = fromToken.image;
            }

            if (state.tryConsume(element, CstNodeKind.DefaultRangeIdentifierItem_Colon, tokens.Colon)) {
                const toToken = state.consume(element, CstNodeKind.DefaultRangeIdentifierItem_ToID, tokens.ID);
                if (toToken) {
                    element.to = toToken.image;
                }
            }

            return element;
        }
    );

    defaultAttributeExpression = rule(
        () => this.defaultAttributeExpressionNot.first,
        (state: ParserState): ast.DefaultAttributeExpression => {
            const element: ast.DefaultAttributeExpression = {
                kind: ast.SyntaxKind.DefaultAttributeExpression,
                container: null,
                items: [],
                operators: [],
            };

            // Parse first DefaultAttributeExpressionNot
            element.items.push(this.defaultAttributeExpressionNot.rule(state));

            // Parse optional binary operator and second operand
            if (state.canConsume(tokens.DefaultAttributeBinaryOperator)) {
                const operatorToken = state.consume(element, CstNodeKind.DefaultAttributeExpression_Operators, tokens.DefaultAttributeBinaryOperator);
                if (operatorToken) {
                    element.operators.push(tokens.DefaultAttributeBinaryOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx));
                }
                element.items.push(this.defaultAttributeExpressionNot.rule(state));
            }

            return element;
        }
    );

    defaultAttributeExpressionNot = rule(
        choice(
            sequence(tokens.NOT),
            sequence(tokens.DefaultAttribute),
        ),
        (state: ParserState): ast.DefaultAttributeExpressionNot => {
            const element: ast.DefaultAttributeExpressionNot = {
                kind: ast.SyntaxKind.DefaultAttributeExpressionNot,
                container: null,
                not: false,
                value: null,
            };

            if (state.tryConsume(element, CstNodeKind.DefaultAttributeExpressionNot_NOT, tokens.NOT)) {
                element.not = true;
            }

            const attributeToken = state.consume(element, CstNodeKind.DefaultAttribute_Value, tokens.DefaultAttribute);
            if (attributeToken) {
                element.value = tokens.DefaultAttribute.mapToEnumLiteral(attributeToken.tokenTypeIdx);
            }

            return element;
        }
    );

    defineAliasStatement = rule(
        sequence(tokens.DEFINE, tokens.ALIAS),
        (state: ParserState): ast.DefineAliasStatement => {
            const element: ast.DefineAliasStatement = {
                kind: ast.SyntaxKind.DefineAliasStatement,
                container: null,
                name: null,
                nameToken: null,
                attributes: [],
                xDefine: false,
            };

            const defineToken = state.consume(element, CstNodeKind.DefineAliasStatement_DEFINE, tokens.DEFINE);
            if (defineToken?.image.charAt(0).toUpperCase() === "X") {
                element.xDefine = true;
            }
            state.consume(element, CstNodeKind.DefineAliasStatement_ALIAS, tokens.ALIAS);

            const nameToken = state.consume(element, CstNodeKind.DefineAliasStatement_Name, tokens.ID);
            if (nameToken) {
                element.name = nameToken.image;
                element.nameToken = nameToken;
            }

            if (state.canConsumeFirst(this.declarationAttribute.first)) {
                element.attributes.push(this.declarationAttribute.rule(state));
            }

            state.consume(element, CstNodeKind.DefineAliasStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    defineOrdinalStatement = rule(
        sequence(tokens.DEFINE, tokens.ORDINAL),
        (state: ParserState): ast.DefineOrdinalStatement {
            const element: ast.DefineOrdinalStatement = {
                kind: ast.SyntaxKind.DefineOrdinalStatement,
                container: null,
                name: null,
                nameToken: null,
                attributes: [],
                ordinalValues: null,
                precision: null,
                xDefine: false,
            };

            const defineToken = state.consume(element, CstNodeKind.DefineOrdinalStatement_DEFINE, tokens.DEFINE);
            if (defineToken?.image.charAt(0).toUpperCase() === "X") {
                element.xDefine = true;
            }
            state.consume(element, CstNodeKind.DefineOrdinalStatement_ORDINAL, tokens.ORDINAL);

            const nameToken = state.consume(element, CstNodeKind.DefineOrdinalStatement_Name, tokens.ID);
            if (nameToken) {
                element.name = nameToken.image;
                element.nameToken = nameToken;
            }

            state.consume(element, CstNodeKind.DefineOrdinalStatement_OpenParenValues, tokens.OpenParen);
            element.ordinalValues = this.ordinalValues.rule(state);
            state.consume(element, CstNodeKind.DefineOrdinalStatement_CloseParenValues, tokens.CloseParen);

            while (!state.canConsume(tokens.Semicolon)) {
                if (state.tryConsume(element, CstNodeKind.DefineOrdinalStatement_Signed0, tokens.SIGNED)) {
                    element.attributes.push(ast.DefineOrdinalAttribute.SIGNED);
                } else if (state.tryConsume(element, CstNodeKind.DefineOrdinalStatement_Unsigned0, tokens.UNSIGNED)) {
                    element.attributes.push(ast.DefineOrdinalAttribute.UNSIGNED);
                } else if (state.tryConsume(element, CstNodeKind.DefineOrdinalStatement_PRECISION, tokens.PRECISION)) {
                    element.attributes.push(ast.DefineOrdinalAttribute.PRECISION);
                    state.consume(element, CstNodeKind.DefineOrdinalStatement_OpenParenPrecision, tokens.OpenParen);
                    const precisionNumberToken = state.consume(element, CstNodeKind.DefineOrdinalStatement_PrecisionNumber, tokens.NUMBER);
                    if (precisionNumberToken) {
                        element.precision = precisionNumberToken.image;
                    }
                    state.consume(element, CstNodeKind.DefineOrdinalStatement_CloseParenPrecision, tokens.CloseParen);
                } else {
                    //TODO better error message
                    throw new Error("Unexpected token in DEFINE ORDINAL statement");
                }
            }

            state.consume(element, CstNodeKind.DefineOrdinalStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    ordinalValueList = rule(
        () => this.ordinalValue.first,
        (state: ParserState): ast.OrdinalValueList => {
            const element: ast.OrdinalValueList = {
                kind: ast.SyntaxKind.OrdinalValueList,
                container: null,
                members: [],
            };

            element.members.push(this.ordinalValue.rule(state));
            while (state.tryConsume(element, CstNodeKind.OrdinalValueList_Comma, tokens.Comma)) {
                element.members.push(this.ordinalValue.rule(state));
            }

            return element;
        }
    );

    ordinalValue = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.OrdinalValue => {
            const element: ast.OrdinalValue = {
                kind: ast.SyntaxKind.OrdinalValue,
                container: null,
                name: null,
                nameToken: null,
                value: null,
            };

            const idToken = state.consume(element, CstNodeKind.OrdinalValue_Name, tokens.ID);
            if (idToken) {
                element.name = idToken.image;
                element.nameToken = idToken;
            }

            if (state.tryConsume(element, CstNodeKind.OrdinalValue_VALUE, tokens.VALUE)) {
                state.consume(element, CstNodeKind.OrdinalValue_OpenParen, tokens.OpenParen);
                element.value = this.expression.rule(state);
                state.consume(element, CstNodeKind.OrdinalValue_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    defineStructureStatement = rule(
        sequence(tokens.DEFINE, tokens.STRUCTURE),
        (state: ParserState): ast.DefineStructureStatement => {
            const element: ast.DefineStructureStatement = {
                kind: ast.SyntaxKind.DefineStructureStatement,
                container: null,
                xDefine: false,
                items: [],
            };

            const defineToken = state.consume(element, CstNodeKind.DefineStructureStatement_DEFINE, tokens.DEFINE);
            if (defineToken?.image.charAt(0).toUpperCase() === "X") {
                element.xDefine = true;
            }

            state.consume(element, CstNodeKind.DefineStructureStatement_STRUCTURE, tokens.STRUCTURE);

            element.items.push(this.declaredItem.rule(state));

            while (state.tryConsume(element, CstNodeKind.DefineStructureStatement_Comma, tokens.Comma)) {
                element.items.push(this.declaredItem.rule(state));
            }

            state.consume(element, CstNodeKind.DefineStructureStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    delayStatement = rule(
        sequence(tokens.DELAY),
        (state: ParserState): ast.DelayStatement => {
            const element: ast.DelayStatement = {
                kind: ast.SyntaxKind.DelayStatement,
                container: null,
                delay: null,
            };

            state.consume(element, CstNodeKind.DelayStatement_DELAY, tokens.DELAY);
            state.consume(element, CstNodeKind.DelayStatement_OpenParen, tokens.OpenParen);
            element.delay = this.expression.rule(state);
            state.consume(element, CstNodeKind.DelayStatement_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.DelayStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    deleteStatement = rule(
        sequence(tokens.DELETE),
        (state: ParserState): ast.DeleteStatement => {
            const element: ast.DeleteStatement = {
                kind: ast.SyntaxKind.DeleteStatement,
                container: null,
                file: null,
                key: null,
            };

            state.consume(element, CstNodeKind.DeleteStatement_DELETE, tokens.DELETE);
            state.consume(element, CstNodeKind.DeleteStatement_FILE, tokens.FILE);
            state.consume(element, CstNodeKind.DeleteStatement_OpenParenFile, tokens.OpenParen);
            element.file = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.DeleteStatement_CloseParenFile, tokens.CloseParen);

            // Optional KEY clause
            if (state.tryConsume(element, CstNodeKind.DeleteStatement_KEY, tokens.KEY)) {
                state.consume(element, CstNodeKind.DeleteStatement_OpenParenKey, tokens.OpenParen);
                element.key = this.expression.rule(state);
                state.consume(element, CstNodeKind.DeleteStatement_CloseParenKey, tokens.CloseParen);
            }

            state.consume(element, CstNodeKind.DeleteStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    detachStatement = rule(
        sequence(tokens.DETACH),
        (state: ParserState): ast.DetachStatement => {
            const element: ast.DetachStatement = {
                kind: ast.SyntaxKind.DetachStatement,
                container: null,
                reference: null,
            };

            state.consume(element, CstNodeKind.DetachStatement_DETACH, tokens.DETACH);
            state.consume(element, CstNodeKind.DetachStatement_THREAD, tokens.THREAD);
            state.consume(element, CstNodeKind.DetachStatement_OpenParen, tokens.OpenParen);
            element.reference = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.DetachStatement_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.DetachStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    displayStatement = rule(
        sequence(tokens.DISPLAY),
        (state: ParserState): ast.DisplayStatement => {
            const element: ast.DisplayStatement = {
                kind: ast.SyntaxKind.DisplayStatement,
                container: null,
                expression: null,
                reply: null,
                rout: [],
                desc: [],
            };

            state.consume(element, CstNodeKind.DisplayStatement_DISPLAY, tokens.DISPLAY);
            state.consume(element, CstNodeKind.DisplayStatement_OpenParenExpression, tokens.OpenParen);
            element.expression = this.expression.rule(state);
            state.consume(element, CstNodeKind.DisplayStatement_CloseParenExpression, tokens.CloseParen);

            // Optional REPLY clause
            if (state.tryConsume(element, CstNodeKind.DisplayStatement_REPLY, tokens.REPLY)) {
                state.consume(element, CstNodeKind.DisplayStatement_OpenParenReply, tokens.OpenParen);
                element.reply = this.locatorCall.rule(state);
                state.consume(element, CstNodeKind.DisplayStatement_CloseParenReply, tokens.CloseParen);
            }

            // Optional ROUTCDE clause
            if (state.tryConsume(element, CstNodeKind.DisplayStatement_ROUTCDE, tokens.ROUTCDE)) {
                state.consume(element, CstNodeKind.DisplayStatement_OpenParenRout, tokens.OpenParen);

                const routToken = state.consume(element, CstNodeKind.DisplayStatement_RoutNumber0, tokens.NUMBER);
                if (routToken) {
                    element.rout.push(routToken.image);
                }

                while (state.tryConsume(element, CstNodeKind.DisplayStatement_CommaRout, tokens.Comma)) {
                    const nextRoutToken = state.consume(element, CstNodeKind.DisplayStatement_RoutNumber1, tokens.NUMBER);
                    if (nextRoutToken) {
                        element.rout.push(nextRoutToken.image);
                    }
                }

                state.consume(element, CstNodeKind.DisplayStatement_CloseParenRout, tokens.CloseParen);

                // Optional DESC clause (only if ROUTCDE is present)
                if (state.tryConsume(element, CstNodeKind.DisplayStatement_DESC, tokens.DESC)) {
                    state.consume(element, CstNodeKind.DisplayStatement_OpenParenDesc, tokens.OpenParen);

                    const descToken = state.consume(element, CstNodeKind.DisplayStatement_DescNumber0, tokens.NUMBER);
                    if (descToken) {
                        element.desc.push(descToken.image);
                    }

                    while (state.tryConsume(element, CstNodeKind.DisplayStatement_CommaDesc, tokens.Comma)) {
                        const nextDescToken = state.consume(element, CstNodeKind.DisplayStatement_DescNumber1, tokens.NUMBER);
                        if (nextDescToken) {
                            element.desc.push(nextDescToken.image);
                        }
                    }

                    state.consume(element, CstNodeKind.DisplayStatement_CloseParenDesc, tokens.CloseParen);
                }
            }

            state.consume(element, CstNodeKind.DisplayStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

doStatement = rule(
    sequence(tokens.DO),
    (state: ParserState): ast.DoStatement => {
        const element: ast.DoStatement = {
            kind: ast.SyntaxKind.DoStatement,
            container: null,
            doToken: null,
            doType2: null,
            doType3: null,
            doType4: false,
            statements: [],
            end: null,
            skip: false,
        };

        const doToken = state.consume(element, CstNodeKind.DoStatement_DO, tokens.DO);
        element.doToken = doToken;

        // Optional DO type specification
        if (state.canConsumeFirst(this.doType2.first) || state.canConsumeFirst(this.doType3.first) || state.canConsume(tokens.LOOP)) {
            if (state.canConsumeFirst(this.doType2.first)) {
                element.doType2 = this.doType2.rule(state);
            } else if (state.canConsumeFirst(this.doType3.first)) {
                element.doType3 = this.doType3.rule(state);
            } else if (state.tryConsume(element, CstNodeKind.DoStatement_LOOP, tokens.LOOP)) {
                element.doType4 = true;
            }
        }

        state.consume(element, CstNodeKind.DoStatement_Semicolon0, tokens.Semicolon);

        // Parse statements until END
        while (!state.eof && !state.canConsume(tokens.END)) {
            const statement = this.statement.rule(state);
            element.statements.push(statement);
        }

        element.end = this.endStatement.rule(state);
        state.consume(element, CstNodeKind.DoStatement_Semicolon1, tokens.Semicolon);

        return element;
    }
);

doType2 = orRule<ast.DoType2>(
    () => this.doWhile,
    () => this.doUntil,
);

doWhile = rule(
    sequence(tokens.WHILE),
    (state: ParserState): ast.DoWhile => {
        const element: ast.DoWhile = {
            kind: ast.SyntaxKind.DoWhile,
            container: null,
            while: null,
            until: null,
        };

        state.consume(element, CstNodeKind.DoWhile_WHILE, tokens.WHILE);
        state.consume(element, CstNodeKind.DoWhile_OpenParenWhile, tokens.OpenParen);
        element.while = this.expression.rule(state);
        state.consume(element, CstNodeKind.DoWhile_CloseParenWhile, tokens.CloseParen);

        // Optional UNTIL clause
        if (state.tryConsume(element, CstNodeKind.DoWhile_UNTIL, tokens.UNTIL)) {
            state.consume(element, CstNodeKind.DoWhile_OpenParenUntil, tokens.OpenParen);
            element.until = this.expression.rule(state);
            state.consume(element, CstNodeKind.DoWhile_CloseParenUntil, tokens.CloseParen);
        }

        return element;
    }
);

doUntil = rule(
    sequence(tokens.UNTIL),
    (state: ParserState): ast.DoUntil => {
        const element: ast.DoUntil = {
            kind: ast.SyntaxKind.DoUntil,
            container: null,
            until: null,
            while: null,
        };

        state.consume(element, CstNodeKind.DoUntil_UNTIL, tokens.UNTIL);
        state.consume(element, CstNodeKind.DoUntil_OpenParenUntil, tokens.OpenParen);
        element.until = this.expression.rule(state);
        state.consume(element, CstNodeKind.DoUntil_CloseParenUntil, tokens.CloseParen);

        // Optional WHILE clause
        if (state.tryConsume(element, CstNodeKind.DoUntil_WHILE, tokens.WHILE)) {
            state.consume(element, CstNodeKind.DoUntil_OpenParenWhile, tokens.OpenParen);
            element.while = this.expression.rule(state);
            state.consume(element, CstNodeKind.DoUntil_CloseParenWhile, tokens.CloseParen);
        }

        return element;
    }
);

doType3 = rule(
    () => this.memberCall.first,
    (state: ParserState): ast.DoType3 => {
        const element: ast.DoType3 = {
            kind: ast.SyntaxKind.DoType3,
            container: null,
            variable: null,
            specifications: [],
        };

        element.variable = this.memberCall.rule(state);
        state.consume(element, CstNodeKind.DoType3_Equals, tokens.Equals);

        element.specifications.push(this.doSpecification.rule(state));

        while (state.tryConsume(element, CstNodeKind.DoType3_Comma, tokens.Comma)) {
            element.specifications.push(this.doSpecification.rule(state));
        }

        return element;
    }
);

doSpecification = rule(
    () => this.expression.first,
    (state: ParserState): ast.DoSpecification => {
        const element: ast.DoSpecification = {
            kind: ast.SyntaxKind.DoSpecification,
            container: null,
            expression: null,
            upthru: null,
            downthru: null,
            repeat: null,
            whileOrUntil: null,
            to: null,
            by: null,
        };

        element.expression = this.expression.rule(state);

        // Optional TO/BY/UPTHRU/DOWNTHRU/REPEAT clause
        if (state.canConsume(tokens.TO) || state.canConsume(tokens.BY) || 
            state.canConsume(tokens.UPTHRU) || state.canConsume(tokens.DOWNTHRU) || 
            state.canConsume(tokens.REPEAT)) {
            
            if (state.canConsume(tokens.TO)) {
                state.consume(element, CstNodeKind.DoSpecification_TO0, tokens.TO);
                element.to = this.expression.rule(state);
                
                if (state.tryConsume(element, CstNodeKind.DoSpecification_BY0, tokens.BY)) {
                    element.by = this.expression.rule(state);
                }
            } else if (state.canConsume(tokens.BY)) {
                state.consume(element, CstNodeKind.DoSpecification_BY1, tokens.BY);
                element.by = this.expression.rule(state);
                
                if (state.tryConsume(element, CstNodeKind.DoSpecification_TO1, tokens.TO)) {
                    element.to = this.expression.rule(state);
                }
            } else if (state.tryConsume(element, CstNodeKind.DoSpecification_UPTHRU, tokens.UPTHRU)) {
                element.upthru = this.expression.rule(state);
            } else if (state.tryConsume(element, CstNodeKind.DoSpecification_DOWNTHRU, tokens.DOWNTHRU)) {
                element.downthru = this.expression.rule(state);
            } else if (state.tryConsume(element, CstNodeKind.DoSpecification_REPEAT, tokens.REPEAT)) {
                element.repeat = this.expression.rule(state);
            }
        }

        // Optional WHILE or UNTIL clause
        if (state.canConsumeFirst(this.doWhile.first) || state.canConsumeFirst(this.doUntil.first)) {
            if (state.canConsumeFirst(this.doWhile.first)) {
                element.whileOrUntil = this.doWhile.rule(state);
            } else {
                element.whileOrUntil = this.doUntil.rule(state);
            }
        }

        return element;
    }



















    
);










}

export const HandwrittenParserInstance = new HandwrittenParser();
