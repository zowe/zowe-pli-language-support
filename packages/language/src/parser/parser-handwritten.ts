import { choice, Parser, orRule, rule, sequence, RuleFirstPair } from "./parser-types";
import * as ast from "../syntax-tree/ast";
import { IRecognitionException, tokenMatcher } from "chevrotain";
import { finalParserState, ParserState } from "./parser-state";
import * as tokens from "./tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import { constructBinaryExpression, IntermediateBinaryExpression } from "./abstract-parser";

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
        () => this.statement.first(),
        (state: ParserState): ast.Program => {
            const program: ast.Program = {
                kind: ast.SyntaxKind.Program,
                container: null,
                statements: [],
            };
            // Parse one or more packages (or top-level statements)
            while (!state.eof) {
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
            if (state.canConsumeFirst(this.exports.first())) {
                element.exports = this.exports.rule(state);
            }
            if (state.canConsumeFirst(this.reserves.first())) {
                element.reserves = this.reserves.rule(state);
            }
            if (state.canConsumeFirst(this.options.first())) {
                element.options = this.options.rule(state);
            }
            state.consume(element, CstNodeKind.Package_Semicolon0, tokens.Semicolon);
            while (!state.eof && state.canConsumeFirst(this.statement.first())) {
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
        () => this.condition.first(),
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
                } else if (state.canConsumeFirst(this.options.first())) {
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
                } else if (state.canConsumeFirst(this.environmentOption.first())) {
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

            while (!state.eof && !state.canConsumeFirst(this.endStatement.first())) {
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
        sequence(tokens.ID, tokens.Colon),
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

    entryStatement = rule(
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
                if (state.canConsumeFirst(this.procedureParameter.first())) {
                    element.parameters.push(this.procedureParameter.rule(state));
                    while (state.tryConsume(element, CstNodeKind.EntryStatement_Comma, tokens.Comma)) {
                        element.parameters.push(this.procedureParameter.rule(state));
                    }
                }
                state.consume(element, CstNodeKind.EntryStatement_CloseParenParams, tokens.CloseParen);
            }

            // Parse optional attributes (can appear multiple times)
            while (!state.eof && !state.canConsume(tokens.Semicolon)) {
                if (state.canConsumeFirst(this.environmentOption.first())) {
                    element.environmentName.push(this.environmentOption.rule(state));
                } else if (state.tryConsume(element, CstNodeKind.EntryStatement_Variable, tokens.VARIABLE)) {
                    element.variable.push("VARIABLE");
                } else if (state.tryConsume(element, CstNodeKind.EntryStatement_Limited, tokens.LIMITED)) {
                    element.limited.push("LIMITED");
                } else if (state.canConsume(tokens.RETURNS)) {
                    element.returns.push(this.returnsOption.rule(state));
                } else if (state.canConsumeFirst(this.options.first())) {
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
            () => this.conditionPrefix.first(),
            () => this.unit.first(),
            //commented out, because performAssignmentLookahead is used instead of LL(1) lookahead
            //() => this.labelPrefix.first(),
            //() => this.assignmentStatement.first(),
        ),
        (state: ParserState): ast.Statement => {
            const element: ast.Statement = {
                kind: ast.SyntaxKind.Statement,
                container: null,
                condition: null,
                labels: [],
                value: null,
            };

            if (state.canConsumeFirst(this.conditionPrefix.first())) {
                element.condition = this.conditionPrefix.rule(state);
            }

            while (state.canConsumeFirst(this.labelPrefix.first())) {
                element.labels.push(this.labelPrefix.rule(state));
            }

            if(performAssignmentLookahead(n => state.peek(n))) {
                element.value = this.assignmentStatement.rule(state);
            } else {
                element.value = this.unit.rule(state);
            }

            state.recover();

            return element;
        }
    );

    unit = orRule<ast.Unit>(
        () => this.allocateStatement,
        () => this.assertStatement,
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
            () => this.referenceItem.first(),
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

            if (state.canConsumeFirst(this.allocateAttribute.first())) {
                element.attribute = this.allocateAttribute.rule(state);
            }

            return element;
        }
    );

    allocateAttribute = orRule<ast.AllocateAttribute>(
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
        () => this.dimensions.first(),
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

            if (state.canConsumeFirst(this.dimensions.first())) {
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
        () => this.locatorCall.first(),
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

            if (state.canConsumeFirst(this.options.first())) {
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
            sequence(tokens.END),
            //TODO: sequence(zeroOrMore(() => this.labelPrefix.first()), tokens.END),
            sequence(tokens.ID, tokens.Colon, tokens.END),
        ),
        (state: ParserState): ast.EndStatement => {
            const element: ast.EndStatement = {
                kind: ast.SyntaxKind.EndStatement,
                container: null,
                labels: [],
                label: null,
            };

            // Parse optional label prefixes
            while (state.canConsumeFirst(this.labelPrefix.first())) {
                element.labels.push(this.labelPrefix.rule(state));
            }

            state.consume(element, CstNodeKind.EndStatement_END, tokens.END);

            // Optional label reference
            if (state.canConsumeFirst(this.labelReference.first())) {
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
            if (state.canConsumeFirst(this.memberCall.first())) {
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
                if (state.canConsumeFirst(this.memberCall.first())) {
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
        () => this.defaultExpressionPart.first(),
        (state: ParserState): ast.DefaultExpression => {
            const element: ast.DefaultExpression = {
                kind: ast.SyntaxKind.DefaultExpression,
                container: null,
                expression: null,
                attributes: [],
            };

            element.expression = this.defaultExpressionPart.rule(state);

            while (state.canConsumeFirst(this.defaultDeclarationAttribute.first())) {
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
            () => this.defaultRangeIdentifierItem.first()
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
        () => this.defaultAttributeExpressionNot.first(),
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

            if (state.canConsumeFirst(this.declarationAttribute.first())) {
                element.attributes.push(this.declarationAttribute.rule(state));
                while(!state.canConsume(tokens.Semicolon)) {
                    state.tryConsume(element, CstNodeKind.DefineAliasStatement_Comma, tokens.Comma);
                    element.attributes.push(this.declarationAttribute.rule(state));
                }
            }

            state.consume(element, CstNodeKind.DefineAliasStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    defineOrdinalStatement = rule(
        sequence(tokens.DEFINE, tokens.ORDINAL),
        (state: ParserState): ast.DefineOrdinalStatement => {
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
            element.ordinalValues = this.ordinalValueList.rule(state);
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
        () => this.ordinalValue.first(),
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
            if (state.canConsumeFirst(this.doType2.first()) || state.canConsumeFirst(this.doType3.first()) || state.canConsume(tokens.LOOP)) {
                if (state.canConsumeFirst(this.doType2.first())) {
                    element.doType2 = this.doType2.rule(state);
                } else if (state.canConsumeFirst(this.doType3.first())) {
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
        () => this.memberCall.first(),
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
        () => this.expression.first(),
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
            if (state.canConsumeFirst(this.doWhile.first()) || state.canConsumeFirst(this.doUntil.first())) {
                if (state.canConsumeFirst(this.doWhile.first())) {
                    element.whileOrUntil = this.doWhile.rule(state);
                } else {
                    element.whileOrUntil = this.doUntil.rule(state);
                }
            }

            return element;
        }
    );

    execStatement = rule(
        sequence(tokens.EXEC),
        (state: ParserState): ast.ExecStatement => {
            const element: ast.ExecStatement = {
                kind: ast.SyntaxKind.ExecStatement,
                container: null,
                query: null,
            };

            state.consume(element, CstNodeKind.ExecStatement_EXEC, tokens.EXEC);
            const queryToken = state.consume(element, CstNodeKind.ExecStatement_Query, tokens.ExecFragment);
            if (queryToken) {
                element.query = queryToken.image;
            }
            state.consume(element, CstNodeKind.ExecStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    exitStatement = rule(
        sequence(tokens.EXIT),
        (state: ParserState): ast.ExitStatement => {
            const element: ast.ExitStatement = {
                kind: ast.SyntaxKind.ExitStatement,
                container: null,
            };

            state.consume(element, CstNodeKind.ExitStatement_EXIT, tokens.EXIT);
            state.consume(element, CstNodeKind.ExitStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    fetchStatement = rule(
        sequence(tokens.FETCH),
        (state: ParserState): ast.FetchStatement => {
            const element: ast.FetchStatement = {
                kind: ast.SyntaxKind.FetchStatement,
                container: null,
                entries: [],
            };

            state.consume(element, CstNodeKind.FetchStatement_FETCH, tokens.FETCH);
            element.entries.push(this.fetchEntry.rule(state));

            while (state.tryConsume(element, CstNodeKind.FetchStatement_Comma, tokens.Comma)) {
                element.entries.push(this.fetchEntry.rule(state));
            }

            state.consume(element, CstNodeKind.FetchStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    fetchEntry = rule(
        () => this.referenceItem.first(),
        (state: ParserState): ast.FetchEntry => {
            const element: ast.FetchEntry = {
                kind: ast.SyntaxKind.FetchEntry,
                container: null,
                entry: null,
                set: null,
                title: null,
            };

            element.entry = this.referenceItem.rule(state);

            // Optional SET clause
            if (state.tryConsume(element, CstNodeKind.FetchEntry_SET, tokens.SET)) {
                state.consume(element, CstNodeKind.FetchEntry_OpenParenSet, tokens.OpenParen);
                element.set = this.locatorCall.rule(state);
                state.consume(element, CstNodeKind.FetchEntry_CloseParenSet, tokens.CloseParen);
            }

            // Optional TITLE clause
            if (state.tryConsume(element, CstNodeKind.FetchEntry_TITLE, tokens.TITLE)) {
                state.consume(element, CstNodeKind.FetchEntry_OpenParenTitle, tokens.OpenParen);
                element.title = this.expression.rule(state);
                state.consume(element, CstNodeKind.FetchEntry_CloseParenTitle, tokens.CloseParen);
            }

            return element;
        }
    );

    flushStatement = rule(
        sequence(tokens.FLUSH),
        (state: ParserState): ast.FlushStatement => {
            const element: ast.FlushStatement = {
                kind: ast.SyntaxKind.FlushStatement,
                container: null,
                file: null,
            };

            state.consume(element, CstNodeKind.FlushStatement_FLUSH, tokens.FLUSH);
            state.consume(element, CstNodeKind.FlushStatement_FILE, tokens.FILE);
            state.consume(element, CstNodeKind.FlushStatement_OpenParen, tokens.OpenParen);

            if (state.canConsumeFirst(this.locatorCall.first())) {
                element.file = this.locatorCall.rule(state);
            } else if (state.tryConsume(element, CstNodeKind.FlushStatement_Star, tokens.Star)) {
                const starToken = state.last;
                element.file = starToken!.image as "*";
            } else {
                // TODO better error message
                throw new Error("Expected locator call or '*' in FLUSH statement");
            }

            state.consume(element, CstNodeKind.FlushStatement_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.FlushStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    formatStatement = rule(
        sequence(tokens.FORMAT),
        (state: ParserState): ast.FormatStatement => {
            const element: ast.FormatStatement = {
                kind: ast.SyntaxKind.FormatStatement,
                container: null,
                list: null,
            };

            state.consume(element, CstNodeKind.FormatStatement_FORMAT, tokens.FORMAT);
            state.consume(element, CstNodeKind.FormatStatement_OpenParen, tokens.OpenParen);
            element.list = this.formatList.rule(state);
            state.consume(element, CstNodeKind.FormatStatement_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.FormatStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    formatList = rule(
        () => this.formatListItem.first(),
        (state: ParserState): ast.FormatList => {
            const element: ast.FormatList = {
                kind: ast.SyntaxKind.FormatList,
                container: null,
                items: [],
            };

            element.items.push(this.formatListItem.rule(state));

            while (state.tryConsume(element, CstNodeKind.FormatList_Comma, tokens.Comma)) {
                element.items.push(this.formatListItem.rule(state));
            }

            return element;
        }
    );

    formatListItem = rule(
        choice(
            () => this.formatListItemLevel.first(),
            () => this.formatItem.first(),
            sequence(tokens.OpenParen),
        ),
        (state: ParserState): ast.FormatListItem => {
            const element: ast.FormatListItem = {
                kind: ast.SyntaxKind.FormatListItem,
                container: null,
                level: null,
                item: null,
                list: null,
            };

            // Optional level
            if (state.canConsumeFirst(this.formatListItemLevel.first())) {
                element.level = this.formatListItemLevel.rule(state);
            }

            // Either format item or nested list
            if (state.canConsumeFirst(this.formatItem.first())) {
                element.item = this.formatItem.rule(state);
            } else if (state.canConsume(tokens.OpenParen)) {
                state.consume(element, CstNodeKind.FormatListItem_OpenParen, tokens.OpenParen);
                element.list = this.formatList.rule(state);
                state.consume(element, CstNodeKind.FormatListItem_CloseParen, tokens.CloseParen);
            } else {
                // TODO better error message
                throw new Error("Expected format item or parenthesized format list");
            }

            return element;
        }
    );

    formatListItemLevel = rule(
        choice(
            sequence(tokens.NUMBER),
            sequence(tokens.OpenParen),
        ),
        (state: ParserState): ast.FormatListItemLevel => {
            const element: ast.FormatListItemLevel = {
                kind: ast.SyntaxKind.FormatListItemLevel,
                container: null,
                level: null,
            };

            if (state.canConsume(tokens.NUMBER)) {
                const levelToken = state.consume(element, CstNodeKind.FormatListItemLevel_LevelNumber, tokens.NUMBER);
                if (levelToken) {
                    element.level = levelToken.image;
                }
            } else if (state.canConsume(tokens.OpenParen)) {
                state.consume(element, CstNodeKind.FormatListItemLevel_OpenParen, tokens.OpenParen);
                element.level = this.expression.rule(state);
                state.consume(element, CstNodeKind.FormatListItemLevel_CloseParen, tokens.CloseParen);
            } else {
                // TODO better error message
                throw new Error("Expected number or parenthesized expression for format list item level");
            }

            return element;
        }
    );

    formatItem = orRule<ast.FormatItem>(
        () => this.AFormatItem,
        () => this.BFormatItem,
        () => this.CFormatItem,
        () => this.EFormatItem,
        () => this.FFormatItem,
        () => this.PFormatItem,
        () => this.columnFormatItem,
        () => this.GFormatItem,
        () => this.LFormatItem,
        () => this.lineFormatItem,
        () => this.pageFormatItem,
        () => this.RFormatItem,
        () => this.skipFormatItem,
        () => this.VFormatItem,
        () => this.XFormatItem,
    );

    AFormatItem = rule(
        sequence(tokens.A),
        (state: ParserState): ast.AFormatItem => {
            const element: ast.AFormatItem = {
                kind: ast.SyntaxKind.AFormatItem,
                container: null,
                fieldWidth: null,
            };

            state.consume(element, CstNodeKind.AFormatItem_A, tokens.A);

            if (state.tryConsume(element, CstNodeKind.AFormatItem_OpenParen, tokens.OpenParen)) {
                element.fieldWidth = this.expression.rule(state);
                state.consume(element, CstNodeKind.AFormatItem_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    BFormatItem = rule(
        sequence(tokens.B),
        (state: ParserState): ast.BFormatItem => {
            const element: ast.BFormatItem = {
                kind: ast.SyntaxKind.BFormatItem,
                container: null,
                fieldWidth: null,
            };

            state.consume(element, CstNodeKind.BFormatItem_B, tokens.B);

            if (state.tryConsume(element, CstNodeKind.BFormatItem_OpenParen, tokens.OpenParen)) {
                element.fieldWidth = this.expression.rule(state);
                state.consume(element, CstNodeKind.BFormatItem_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    CFormatItem = rule(
        sequence(tokens.C),
        (state: ParserState): ast.CFormatItem => {
            const element: ast.CFormatItem = {
                kind: ast.SyntaxKind.CFormatItem,
                container: null,
                item: null,
            };

            state.consume(element, CstNodeKind.CFormatItem_C, tokens.C);
            state.consume(element, CstNodeKind.CFormatItem_OpenParen, tokens.OpenParen);

            if (state.canConsumeFirst(this.FFormatItem.first())) {
                element.item = this.FFormatItem.rule(state);
            } else if (state.canConsumeFirst(this.EFormatItem.first())) {
                element.item = this.EFormatItem.rule(state);
            } else if (state.canConsumeFirst(this.PFormatItem.first())) {
                element.item = this.PFormatItem.rule(state);
            } else {
                // TODO better error message
                throw new Error("Expected F, E, or P format item in C format item");
            }

            state.consume(element, CstNodeKind.CFormatItem_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    FFormatItem = rule(
        sequence(tokens.F),
        (state: ParserState): ast.FFormatItem => {
            const element: ast.FFormatItem = {
                kind: ast.SyntaxKind.FFormatItem,
                container: null,
                fieldWidth: null,
                fractionalDigits: null,
                scalingFactor: null,
            };

            state.consume(element, CstNodeKind.FFormatItem_F, tokens.F);
            state.consume(element, CstNodeKind.FFormatItem_OpenParen, tokens.OpenParen);
            element.fieldWidth = this.expression.rule(state);

            // Optional fractional digits and scaling factor
            if (state.tryConsume(element, CstNodeKind.FFormatItem_CommaFractional, tokens.Comma)) {
                element.fractionalDigits = this.expression.rule(state);

                // Optional scaling factor
                if (state.tryConsume(element, CstNodeKind.FFormatItem_CommaScalingFactor, tokens.Comma)) {
                    element.scalingFactor = this.expression.rule(state);
                }
            }

            state.consume(element, CstNodeKind.FFormatItem_CloseParen, tokens.CloseParen);
            return element;
        }
    );

    EFormatItem = rule(
        sequence(tokens.E),
        (state: ParserState): ast.EFormatItem => {
            const element: ast.EFormatItem = {
                kind: ast.SyntaxKind.EFormatItem,
                container: null,
                fieldWidth: null,
                fractionalDigits: null,
                significantDigits: null,
            };

            state.consume(element, CstNodeKind.EFormatItem_E, tokens.E);
            state.consume(element, CstNodeKind.EFormatItem_OpenParen, tokens.OpenParen);
            element.fieldWidth = this.expression.rule(state);
            state.consume(element, CstNodeKind.EFormatItem_Comma0, tokens.Comma);
            element.fractionalDigits = this.expression.rule(state);

            // Optional significant digits
            if (state.tryConsume(element, CstNodeKind.EFormatItem_Comma1, tokens.Comma)) {
                element.significantDigits = this.expression.rule(state);
            }

            state.consume(element, CstNodeKind.EFormatItem_CloseParen, tokens.CloseParen);
            return element;
        }
    );

    PFormatItem = rule(
        sequence(tokens.P),
        (state: ParserState): ast.PFormatItem => {
            const element: ast.PFormatItem = {
                kind: ast.SyntaxKind.PFormatItem,
                container: null,
                specification: null,
            };

            state.consume(element, CstNodeKind.PFormatItem_P, tokens.P);
            const specToken = state.consume(element, CstNodeKind.PFormatItem_SpecificationString, tokens.STRING_TERM);
            if (specToken) {
                element.specification = specToken.image;
            }

            return element;
        }
    );

    columnFormatItem = rule(
        sequence(tokens.COLUMN),
        (state: ParserState): ast.ColumnFormatItem => {
            const element: ast.ColumnFormatItem = {
                kind: ast.SyntaxKind.ColumnFormatItem,
                container: null,
                characterPosition: null,
            };

            state.consume(element, CstNodeKind.ColumnFormatItem_COLUMN, tokens.COLUMN);
            state.consume(element, CstNodeKind.ColumnFormatItem_OpenParen, tokens.OpenParen);
            element.characterPosition = this.expression.rule(state);
            state.consume(element, CstNodeKind.ColumnFormatItem_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    GFormatItem = rule(
        sequence(tokens.G),
        (state: ParserState): ast.GFormatItem => {
            const element: ast.GFormatItem = {
                kind: ast.SyntaxKind.GFormatItem,
                container: null,
                fieldWidth: null,
            };

            state.consume(element, CstNodeKind.GFormatItem_G, tokens.G);

            if (state.tryConsume(element, CstNodeKind.GFormatItem_OpenParen, tokens.OpenParen)) {
                element.fieldWidth = this.expression.rule(state);
                state.consume(element, CstNodeKind.GFormatItem_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    LFormatItem = rule(
        sequence(tokens.L),
        (state: ParserState): ast.LFormatItem => {
            const element: ast.LFormatItem = {
                kind: ast.SyntaxKind.LFormatItem,
                container: null,
            };

            state.consume(element, CstNodeKind.LFormatItem_L, tokens.L);

            return element;
        }
    );

    lineFormatItem = rule(
        sequence(tokens.LINE),
        (state: ParserState): ast.LineFormatItem => {
            const element: ast.LineFormatItem = {
                kind: ast.SyntaxKind.LineFormatItem,
                container: null,
                lineNumber: null,
            };

            state.consume(element, CstNodeKind.LineFormatItem_LINE, tokens.LINE);
            state.consume(element, CstNodeKind.LineFormatItem_OpenParen, tokens.OpenParen);
            element.lineNumber = this.expression.rule(state);
            state.consume(element, CstNodeKind.LineFormatItem_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    pageFormatItem = rule(
        sequence(tokens.PAGE),
        (state: ParserState): ast.PageFormatItem => {
            const element: ast.PageFormatItem = {
                kind: ast.SyntaxKind.PageFormatItem,
                container: null,
            };

            state.consume(element, CstNodeKind.PageFormatItem_PAGE, tokens.PAGE);

            return element;
        }
    );

    RFormatItem = rule(
        sequence(tokens.R),
        (state: ParserState): ast.RFormatItem => {
            const element: ast.RFormatItem = {
                kind: ast.SyntaxKind.RFormatItem,
                container: null,
                labelReference: null,
            };

            state.consume(element, CstNodeKind.RFormatItem_R, tokens.R);
            state.consume(element, CstNodeKind.RFormatItem_OpenParen, tokens.OpenParen);
            const labelToken = state.consume(element, CstNodeKind.RFormatItem_LabelRef, tokens.ID);
            if (labelToken) {
                element.labelReference = labelToken.image;
            }
            state.consume(element, CstNodeKind.RFormatItem_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    skipFormatItem = rule(
        sequence(tokens.SKIP),
        (state: ParserState): ast.SkipFormatItem => {
            const element: ast.SkipFormatItem = {
                kind: ast.SyntaxKind.SkipFormatItem,
                container: null,
                skip: null,
            };

            state.consume(element, CstNodeKind.SkipFormatItem_SKIP, tokens.SKIP);

            if (state.tryConsume(element, CstNodeKind.SkipFormatItem_OpenParen, tokens.OpenParen)) {
                element.skip = this.expression.rule(state);
                state.consume(element, CstNodeKind.SkipFormatItem_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    VFormatItem = rule(
        sequence(tokens.V),
        (state: ParserState): ast.VFormatItem => {
            const element: ast.VFormatItem = {
                kind: ast.SyntaxKind.VFormatItem,
                container: null,
            };

            state.consume(element, CstNodeKind.VFormatItem_V, tokens.V);

            return element;
        }
    );

    XFormatItem = rule(
        sequence(tokens.X),
        (state: ParserState): ast.XFormatItem => {
            const element: ast.XFormatItem = {
                kind: ast.SyntaxKind.XFormatItem,
                container: null,
                width: null,
            };

            state.consume(element, CstNodeKind.XFormatItem_X, tokens.X);
            state.consume(element, CstNodeKind.XFormatItem_OpenParen, tokens.OpenParen);
            element.width = this.expression.rule(state);
            state.consume(element, CstNodeKind.XFormatItem_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    freeStatement = rule(
        sequence(tokens.FREE),
        (state: ParserState): ast.FreeStatement => {
            const element: ast.FreeStatement = {
                kind: ast.SyntaxKind.FreeStatement,
                container: null,
                references: [],
            };

            state.consume(element, CstNodeKind.FreeStatement_FREE, tokens.FREE);
            element.references.push(this.locatorCall.rule(state));

            while (state.tryConsume(element, CstNodeKind.FreeStatement_Comma, tokens.Comma)) {
                element.references.push(this.locatorCall.rule(state));
            }

            state.consume(element, CstNodeKind.FreeStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    getStatement = rule(
        sequence(tokens.GET),
        (state: ParserState): ast.GetStatement => {
            let element: ast.GetStatement = {
                kind: ast.SyntaxKind.GetFileStatement,
                container: null,
                specifications: [],
            } as ast.GetFileStatement;

            state.consume(element, CstNodeKind.GetStatement_GET, tokens.GET);

            if (state.tryConsume(element, CstNodeKind.GetStatement_STRING, tokens.STRING)) {
                // STRING variant
                const stringStatement: ast.GetStringStatement = {
                    kind: ast.SyntaxKind.GetStringStatement,
                    container: null,
                    dataSpecification: null,
                    expression: null,
                };
                element = stringStatement;

                state.consume(element, CstNodeKind.GetStatement_OpenParen, tokens.OpenParen);
                stringStatement.expression = this.expression.rule(state);
                state.consume(element, CstNodeKind.GetStatement_CloseParen, tokens.CloseParen);
                stringStatement.dataSpecification = this.dataSpecificationOptions.rule(state);
            } else {
                // FILE variant - one or more file specifications
                const fileStatement = element as ast.GetFileStatement;

                do {
                    if (state.canConsumeFirst(this.getFile.first())) {
                        fileStatement.specifications.push(this.getFile.rule(state));
                    } else if (state.canConsumeFirst(this.getCopy.first())) {
                        fileStatement.specifications.push(this.getCopy.rule(state));
                    } else if (state.canConsumeFirst(this.getSkip.first())) {
                        fileStatement.specifications.push(this.getSkip.rule(state));
                    } else if (state.canConsumeFirst(this.dataSpecificationOptions.first())) {
                        fileStatement.specifications.push(this.dataSpecificationOptions.rule(state));
                    } else {
                        // TODO: better error message
                        throw new Error("Expected file specification in GET statement");
                    }
                } while (!state.eof &&
                !state.canConsume(tokens.Semicolon) &&
                    (state.canConsumeFirst(this.getFile.first()) ||
                        state.canConsumeFirst(this.getCopy.first()) ||
                        state.canConsumeFirst(this.getSkip.first()) ||
                        state.canConsumeFirst(this.dataSpecificationOptions.first())));
            }

            state.consume(element, CstNodeKind.GetStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    getFile = rule(
        sequence(tokens.FILE),
        (state: ParserState): ast.GetFile => {
            const element: ast.GetFile = {
                kind: ast.SyntaxKind.GetFile,
                container: null,
                file: null,
            };

            state.consume(element, CstNodeKind.GetFile_FILE, tokens.FILE);
            state.consume(element, CstNodeKind.GetFile_OpenParen, tokens.OpenParen);
            element.file = this.expression.rule(state);
            state.consume(element, CstNodeKind.GetFile_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    getCopy = rule(
        sequence(tokens.COPY),
        (state: ParserState): ast.GetCopy => {
            const element: ast.GetCopy = {
                kind: ast.SyntaxKind.GetCopy,
                container: null,
                copyReference: null,
            };

            state.consume(element, CstNodeKind.GetCopy_COPY, tokens.COPY);

            if (state.tryConsume(element, CstNodeKind.GetCopy_OpenParen, tokens.OpenParen)) {
                const idToken = state.consume(element, CstNodeKind.GetCopy_CopyReference, tokens.ID);
                if (idToken) {
                    element.copyReference = idToken.image;
                }
                state.consume(element, CstNodeKind.GetCopy_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    getSkip = rule(
        sequence(tokens.SKIP),
        (state: ParserState): ast.GetSkip => {
            const element: ast.GetSkip = {
                kind: ast.SyntaxKind.GetSkip,
                container: null,
                skipExpression: null,
            };

            state.consume(element, CstNodeKind.GetSkip_SKIP, tokens.SKIP);

            if (state.tryConsume(element, CstNodeKind.GetSkip_OpenParen, tokens.OpenParen)) {
                element.skipExpression = this.expression.rule(state);
                state.consume(element, CstNodeKind.GetSkip_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    goToStatement = rule(
        choice(
            sequence(tokens.GO),
            sequence(tokens.GOTO)
        ),
        (state: ParserState): ast.GoToStatement => {
            const element: ast.GoToStatement = {
                kind: ast.SyntaxKind.GoToStatement,
                container: null,
                label: null,
            };

            if (state.canConsume(tokens.GO)) {
                state.consume(element, CstNodeKind.GoToStatement_GO, tokens.GO);
                state.consume(element, CstNodeKind.GoToStatement_TO, tokens.TO);
            } else if (state.tryConsume(element, CstNodeKind.GoToStatement_GOTO, tokens.GOTO)) {
                // GOTO consumed
            } else {
                // TODO better error message
                throw new Error("Expected GO TO or GOTO");
            }

            element.label = this.labelReference.rule(state);
            state.consume(element, CstNodeKind.GoToStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    genericAttribute = rule(
        sequence(tokens.GENERIC),
        (state: ParserState): ast.GenericAttribute => {
            const element: ast.GenericAttribute = {
                kind: ast.SyntaxKind.GenericAttribute,
                container: null,
                references: [],
            };

            state.consume(element, CstNodeKind.GenericAttribute_GENERIC, tokens.GENERIC);
            state.consume(element, CstNodeKind.GenericAttribute_OpenParen, tokens.OpenParen);

            // Optional generic references
            if (state.canConsumeFirst(this.genericReference.first())) {
                element.references.push(this.genericReference.rule(state));

                while (state.tryConsume(element, CstNodeKind.GenericAttribute_Comma, tokens.Comma)) {
                    element.references.push(this.genericReference.rule(state));
                }
            }

            state.consume(element, CstNodeKind.GenericAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    genericReference = rule(
        () => this.referenceItem.first(),
        (state: ParserState): ast.GenericReference => {
            const element: ast.GenericReference = {
                kind: ast.SyntaxKind.GenericReference,
                container: null,
                descriptors: [],
                otherwise: false,
                entry: null,
            };

            element.entry = this.referenceItem.rule(state);

            if (state.tryConsume(element, CstNodeKind.GenericReference_WHEN, tokens.WHEN)) {
                state.consume(element, CstNodeKind.GenericReference_OpenParen, tokens.OpenParen);

                if (state.canConsumeFirst(this.genericDescriptor.first())) {
                    element.descriptors.push(this.genericDescriptor.rule(state));
                }

                state.consume(element, CstNodeKind.GenericReference_CloseParen, tokens.CloseParen);
            } else if (state.tryConsume(element, CstNodeKind.GenericReference_OTHERWISE, tokens.OTHERWISE)) {
                element.otherwise = true;
            }

            return element;
        }
    );

    genericDescriptor = rule(
        () => this.declarationAttribute.first(),
        (state: ParserState): ast.GenericDescriptor => {
            const element: ast.GenericDescriptor = {
                kind: ast.SyntaxKind.GenericDescriptor,
                container: null,
                attributes: [],
            };

            element.attributes.push(this.declarationAttribute.rule(state));

            while (state.tryConsume(element, CstNodeKind.GenericDescriptor_Comma, tokens.Comma)) {
                element.attributes.push(this.declarationAttribute.rule(state));
            }

            return element;
        }
    );

    ifStatement = rule(
        sequence(tokens.IF),
        (state: ParserState): ast.IfStatement => {
            const element: ast.IfStatement = {
                kind: ast.SyntaxKind.IfStatement,
                container: null,
                expression: null,
                elseRange: null,
                else: null,
                unitRange: null,
                unit: null,
            };

            state.consume(element, CstNodeKind.IfStatement_IF, tokens.IF);
            element.expression = this.expression.rule(state);
            state.consume(element, CstNodeKind.IfStatement_THEN, tokens.THEN);
            element.unit = this.statement.rule(state);

            if (state.tryConsume(element, CstNodeKind.IfStatement_ELSE, tokens.ELSE)) {
                element.else = this.statement.rule(state);
            }

            return element;
        }
    );

    indForAttribute = rule(
        sequence(tokens.INDFOR),
        (state: ParserState): ast.IndForAttribute => {
            const element: ast.IndForAttribute = {
                kind: ast.SyntaxKind.IndForAttribute,
                container: null,
                reference: null,
            };

            state.consume(element, CstNodeKind.IndForAttribute_INDFOR, tokens.INDFOR);
            element.reference = this.locatorCall.rule(state);

            return element;
        }
    );

    iterateStatement = rule(
        sequence(tokens.ITERATE),
        (state: ParserState): ast.IterateStatement => {
            const element: ast.IterateStatement = {
                kind: ast.SyntaxKind.IterateStatement,
                container: null,
                label: null,
            };

            state.consume(element, CstNodeKind.IterateStatement_ITERATE, tokens.ITERATE);

            if (state.canConsumeFirst(this.labelReference.first())) {
                element.label = this.labelReference.rule(state);
            }

            state.consume(element, CstNodeKind.IterateStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    leaveStatement = rule(
        sequence(tokens.LEAVE),
        (state: ParserState): ast.LeaveStatement => {
            const element: ast.LeaveStatement = {
                kind: ast.SyntaxKind.LeaveStatement,
                container: null,
                label: null,
                leaveToken: null,
            };

            const leaveToken = state.consume(element, CstNodeKind.LeaveStatement_LEAVE, tokens.LEAVE);
            element.leaveToken = leaveToken;

            if (state.canConsumeFirst(this.labelReference.first())) {
                element.label = this.labelReference.rule(state);
            }

            state.consume(element, CstNodeKind.LeaveStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    locateStatement = rule(
        sequence(tokens.LOCATE),
        (state: ParserState): ast.LocateStatement => {
            const element: ast.LocateStatement = {
                kind: ast.SyntaxKind.LocateStatement,
                container: null,
                variable: null,
                arguments: [],
            };

            state.consume(element, CstNodeKind.LocateStatement_LOCATE, tokens.LOCATE);
            element.variable = this.locatorCall.rule(state);

            while (state.canConsumeFirst(this.locateStatementOption.first())) {
                element.arguments.push(this.locateStatementOption.rule(state));
            }

            state.consume(element, CstNodeKind.LocateStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    locateStatementOption = rule(
        sequence(tokens.LocateType),
        (state: ParserState): ast.LocateStatementOption => {
            const element: ast.LocateStatementOption = {
                kind: ast.SyntaxKind.LocateStatementOption,
                container: null,
                type: null,
                element: null,
            };

            const typeToken = state.consume(element, CstNodeKind.LocateStatementOption_Type, tokens.LocateType);
            if (typeToken) {
                element.type = tokens.LocateType.mapToEnumLiteral(typeToken.tokenTypeIdx);
            }

            state.consume(element, CstNodeKind.LocateStatementOption_OpenParen, tokens.OpenParen);
            element.element = this.expression.rule(state);
            state.consume(element, CstNodeKind.LocateStatementOption_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    nullStatement = rule(
        sequence(tokens.Semicolon),
        (state: ParserState): ast.NullStatement => {
            const element: ast.NullStatement = {
                kind: ast.SyntaxKind.NullStatement,
                container: null,
            };

            state.consume(element, CstNodeKind.NullStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    onStatement = rule(
        sequence(tokens.ON),
        (state: ParserState): ast.OnStatement => {
            const element: ast.OnStatement = {
                kind: ast.SyntaxKind.OnStatement,
                container: null,
                conditions: [],
                snap: false,
                system: false,
                onUnit: null,
            };

            state.consume(element, CstNodeKind.OnStatement_ON, tokens.ON);

            // Parse first condition
            element.conditions.push(this.condition.rule(state));

            // Parse additional comma-separated conditions
            while (state.tryConsume(element, CstNodeKind.OnStatement_Comma, tokens.Comma)) {
                element.conditions.push(this.condition.rule(state));
            }

            // Optional SNAP
            if (state.tryConsume(element, CstNodeKind.OnStatement_Snap, tokens.SNAP)) {
                element.snap = true;
            }

            // Either SYSTEM or a statement
            if (state.tryConsume(element, CstNodeKind.OnStatement_System, tokens.SYSTEM)) {
                element.system = true;
                state.consume(element, CstNodeKind.OnStatement_Semicolon, tokens.Semicolon);
            } else {
                element.onUnit = this.statement.rule(state);
            }

            return element;
        }
    );

    condition = orRule<ast.Condition>(
        () => this.keywordCondition,
        () => this.namedCondition,
        () => this.fileReferenceCondition,
    );

    keywordCondition = rule(
        sequence(tokens.KeywordConditions),
        (state: ParserState): ast.KeywordCondition => {
            const element: ast.KeywordCondition = {
                kind: ast.SyntaxKind.KeywordCondition,
                container: null,
                keyword: null,
            };

            const token = state.consume(element, CstNodeKind.KeywordCondition_Keyword, tokens.KeywordConditions);
            if (token) {
                element.keyword = tokens.KeywordConditions.mapToEnumLiteral(token.tokenTypeIdx);
            }

            return element;
        }
    );

    namedCondition = rule(
        sequence(tokens.CONDITION),
        (state: ParserState): ast.NamedCondition => {
            const element: ast.NamedCondition = {
                kind: ast.SyntaxKind.NamedCondition,
                container: null,
                name: null,
            };

            state.consume(element, CstNodeKind.NamedCondition_CONDITION, tokens.CONDITION);
            state.consume(element, CstNodeKind.NamedCondition_OpenParen, tokens.OpenParen);

            const nameToken = state.consume(element, CstNodeKind.NamedCondition_Name, tokens.ID);
            if (nameToken) {
                element.name = nameToken.image;
            }

            state.consume(element, CstNodeKind.NamedCondition_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    fileReferenceCondition = rule(
        sequence(tokens.FileReferenceConditions),
        (state: ParserState): ast.FileReferenceCondition => {
            const element: ast.FileReferenceCondition = {
                kind: ast.SyntaxKind.FileReferenceCondition,
                container: null,
                keyword: null,
                fileReference: null,
            };

            const keywordToken = state.consume(element, CstNodeKind.FileReferenceCondition_Keyword, tokens.FileReferenceConditions);
            if (keywordToken) {
                element.keyword = tokens.FileReferenceConditions.mapToEnumLiteral(keywordToken.tokenTypeIdx);
            }

            // Optional file reference in parentheses
            if (state.tryConsume(element, CstNodeKind.FileReferenceCondition_OpenParen, tokens.OpenParen)) {
                element.fileReference = this.referenceItem.rule(state);
                state.consume(element, CstNodeKind.FileReferenceCondition_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    openStatement = rule(
        sequence(tokens.OPEN),
        (state: ParserState): ast.OpenStatement => {
            const element: ast.OpenStatement = {
                kind: ast.SyntaxKind.OpenStatement,
                container: null,
                options: [],
            };

            state.consume(element, CstNodeKind.OpenStatement_OPEN, tokens.OPEN);

            element.options.push(this.openOptionsGroup.rule(state));

            while (state.tryConsume(element, CstNodeKind.OpenStatement_Comma, tokens.Comma)) {
                element.options.push(this.openOptionsGroup.rule(state));
            }

            state.consume(element, CstNodeKind.OpenStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    openOptionsGroup = rule(
        () => this.openOption.first(),
        (state: ParserState): ast.OpenOptionsGroup => {
            const element: ast.OpenOptionsGroup = {
                kind: ast.SyntaxKind.OpenOptionsGroup,
                container: null,
                options: [],
            };

            // Parse at least one open option
            element.options.push(this.openOption.rule(state));

            // Parse additional options as long as we can consume OpenOptionType tokens
            while (state.canConsumeFirst(this.openOption.first())) {
                element.options.push(this.openOption.rule(state));
            }

            return element;
        }
    );

    openOption = rule(
        sequence(tokens.OpenOptionType),
        (state: ParserState): ast.OpenOption => {
            // TODO: explain the discrepancy in the grammar
            // The language reference explains that BUFFERED/UNBUFFERED can only be followed by SEQUENTIAL or DIRECT
            // THIS IS NOT THE CASE
            // It can appear on its own
            // Therefore, we simply combine all open options into one single rule
            const element: ast.OpenOption = {
                kind: ast.SyntaxKind.OpenOption,
                container: null,
                option: null,
                expression: null,
            };

            const optionToken = state.consume(element, CstNodeKind.OpenOption_Type, tokens.OpenOptionType);
            if (optionToken) {
                element.option = tokens.OpenOptionType.mapToEnumLiteral(optionToken.tokenTypeIdx);
            }

            // Optional expression in parentheses
            if (state.tryConsume(element, CstNodeKind.OpenOption_OpenParen, tokens.OpenParen)) {
                // Note: Only FILE, TITLE, LINESIZE and PAGESIZE are supposed to use this
                // Validate against this later in the lifecycle
                element.expression = this.expression.rule(state);
                state.consume(element, CstNodeKind.OpenOption_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    procincDirective = rule(
        sequence(tokens.PROCINC),
        (state: ParserState): ast.ProcincDirective => {
            const element: ast.ProcincDirective = {
                kind: ast.SyntaxKind.ProcincDirective,
                container: null,
                datasetName: null,
            };

            state.consume(element, CstNodeKind.ProcincDirective_PROCINC, tokens.PROCINC);

            const datasetToken = state.consume(element, CstNodeKind.ProcincDirective_DatasetName, tokens.ID);
            if (datasetToken) {
                element.datasetName = datasetToken.image;
            }

            state.consume(element, CstNodeKind.ProcincDirective_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    putStatement = rule(
        sequence(tokens.PUT),
        (state: ParserState): ast.PutStatement => {
            // Start with file statement as default
            let element: ast.PutStatement = {
                kind: ast.SyntaxKind.PutFileStatement,
                container: null,
                items: [],
            } as ast.PutFileStatement;

            state.consume(element, CstNodeKind.PutStatement_PUT, tokens.PUT);

            if (state.canConsume(tokens.Semicolon)) {
                // No optional content, just consume semicolon
            } else if (state.tryConsume(element, CstNodeKind.PutStatement_STRING, tokens.STRING)) {
                // STRING variant - replace with string statement
                const stringStatement: ast.PutStringStatement = {
                    kind: ast.SyntaxKind.PutStringStatement,
                    container: null,
                    dataSpecification: null,
                    stringExpression: null,
                };
                element = stringStatement;

                state.consume(element, CstNodeKind.PutStatement_OpenParen, tokens.OpenParen);
                stringStatement.stringExpression = this.expression.rule(state);
                state.consume(element, CstNodeKind.PutStatement_CloseParen, tokens.CloseParen);
                stringStatement.dataSpecification = this.dataSpecificationOptions.rule(state);
            } else {
                // FILE variant - keep as file statement
                const fileStatement = element as ast.PutFileStatement;

                // Parse one or more put items or data specification options
                do {
                    if (state.canConsumeFirst(this.putItem.first())) {
                        fileStatement.items.push(this.putItem.rule(state));
                    } else if (state.canConsumeFirst(this.dataSpecificationOptions.first())) {
                        fileStatement.items.push(this.dataSpecificationOptions.rule(state));
                    } else {
                        // TODO: better error message
                        throw new Error("Expected put item or data specification in PUT statement");
                    }
                } while (!state.eof &&
                !state.canConsume(tokens.Semicolon) &&
                    (state.canConsumeFirst(this.putItem.first()) ||
                        state.canConsumeFirst(this.dataSpecificationOptions.first())));
            }

            state.consume(element, CstNodeKind.PutStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    putItem = rule(
        sequence(tokens.PutAttribute),
        (state: ParserState): ast.PutItem => {
            const element: ast.PutItem = {
                kind: ast.SyntaxKind.PutItem,
                container: null,
                attribute: null,
                expression: null,
            };

            const attributeToken = state.consume(element, CstNodeKind.PutAttribute_FILE, tokens.PutAttribute);
            if (attributeToken) {
                element.attribute = tokens.PutAttribute.mapToEnumLiteral(attributeToken.tokenTypeIdx);
            }

            // Optional expression in parentheses
            if (state.tryConsume(element, CstNodeKind.PutItem_OpenParen, tokens.OpenParen)) {
                element.expression = this.expression.rule(state);
                state.consume(element, CstNodeKind.PutItem_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    dataSpecificationOptions = rule(
        choice(
            sequence(tokens.LIST),
            sequence(tokens.OpenParen),
            sequence(tokens.DATA),
            sequence(tokens.EDIT),
        ),
        (state: ParserState): ast.DataSpecificationOptions => {
            const element: ast.DataSpecificationOptions = {
                kind: ast.SyntaxKind.DataSpecificationOptions,
                container: null,
                dataList: null,
                edit: false,
                dataLists: [],
                formatLists: [],
                data: false,
                dataListItems: [],
            };

            if (state.canConsume(tokens.LIST) || state.canConsume(tokens.OpenParen)) {
                // LIST variant (LIST is optional)
                state.tryConsume(element, CstNodeKind.DataSpecificationOptions_LIST, tokens.LIST);
                state.consume(element, CstNodeKind.DataSpecificationOptions_OpenParenList, tokens.OpenParen);
                element.dataList = this.dataSpecificationDataList.rule(state);
                state.consume(element, CstNodeKind.DataSpecificationOptions_CloseParenList, tokens.CloseParen);
            } else if (state.tryConsume(element, CstNodeKind.DataSpecificationOptions_Data, tokens.DATA)) {
                // DATA variant
                element.data = true;
                if (state.tryConsume(element, CstNodeKind.DataSpecificationOptions_OpenParenData, tokens.OpenParen)) {
                    element.dataListItems.push(this.dataSpecificationDataListItem.rule(state));
                    while (state.tryConsume(element, CstNodeKind.DataSpecificationOptions_Comma, tokens.Comma)) {
                        element.dataListItems.push(this.dataSpecificationDataListItem.rule(state));
                    }
                    state.consume(element, CstNodeKind.DataSpecificationOptions_CloseParenData, tokens.CloseParen);
                }
            } else if (state.tryConsume(element, CstNodeKind.DataSpecificationOptions_Edit, tokens.EDIT)) {
                // EDIT variant
                element.edit = true;
                do {
                    state.consume(element, CstNodeKind.DataSpecificationOptions_OpenParenEdit, tokens.OpenParen);
                    element.dataLists.push(this.dataSpecificationDataList.rule(state));
                    state.consume(element, CstNodeKind.DataSpecificationOptions_CloseParenEdit, tokens.CloseParen);

                    state.consume(element, CstNodeKind.DataSpecificationOptions_OpenParenFormat, tokens.OpenParen);
                    element.formatLists.push(this.formatList.rule(state));
                    state.consume(element, CstNodeKind.DataSpecificationOptions_CloseParenFormat, tokens.CloseParen);
                } while (!state.eof &&
                !state.canConsume(tokens.Semicolon) &&
                    state.canConsume(tokens.OpenParen));
            } else {
                // TODO better error message
                throw new Error("Expected LIST, DATA, or EDIT in data specification options");
            }

            return element;
        }
    );

    dataSpecificationDataList = rule(
        () => this.dataSpecificationDataListItem.first(),
        (state: ParserState): ast.DataSpecificationDataList => {
            const element: ast.DataSpecificationDataList = {
                kind: ast.SyntaxKind.DataSpecificationDataList,
                container: null,
                items: [],
            };

            element.items.push(this.dataSpecificationDataListItem.rule(state));

            while (state.tryConsume(element, CstNodeKind.DataSpecificationDataList_Comma, tokens.Comma)) {
                element.items.push(this.dataSpecificationDataListItem.rule(state));
            }

            return element;
        }
    );

    dataSpecificationDataListItem = rule(
        () => this.expression.first(),
        (state: ParserState): ast.DataSpecificationDataListItem => {
            const element: ast.DataSpecificationDataListItem = {
                kind: ast.SyntaxKind.DataSpecificationDataListItem,
                container: null,
                value: null,
            };

            // TODO: research, in some example, this can be found:
            // ((I, ENTRY(I) DO I = 0 TO ENTRY_TABLE_COUNT))
            // However, this does not conform to the language reference
            element.value = this.expression.rule(state);

            return element;
        }
    );

    qualifyStatement = rule(
        sequence(tokens.QUALIFY),
        (state: ParserState): ast.QualifyStatement => {
            const element: ast.QualifyStatement = {
                kind: ast.SyntaxKind.QualifyStatement,
                container: null,
                statements: [],
                end: null,
            };

            state.consume(element, CstNodeKind.QualifyStatement_QUALIFY, tokens.QUALIFY);
            state.consume(element, CstNodeKind.QualifyStatement_Semicolon0, tokens.Semicolon);

            while (!state.eof && !state.canConsumeFirst(this.endStatement.first())) {
                const statement = this.statement.rule(state);
                element.statements.push(statement);
            }

            element.end = this.endStatement.rule(state);
            state.consume(element, CstNodeKind.QualifyStatement_Semicolon1, tokens.Semicolon);

            return element;
        }
    );

    readStatement = rule(
        sequence(tokens.READ),
        (state: ParserState): ast.ReadStatement => {
            const element: ast.ReadStatement = {
                kind: ast.SyntaxKind.ReadStatement,
                container: null,
                arguments: [],
            };

            state.consume(element, CstNodeKind.ReadStatement_READ, tokens.READ);

            while (state.canConsumeFirst(this.readStatementOption.first())) {
                element.arguments.push(this.readStatementOption.rule(state));
            }

            state.consume(element, CstNodeKind.ReadStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    readStatementOption = rule(
        sequence(tokens.ReadStatementType),
        (state: ParserState): ast.ReadStatementOption => {
            const element: ast.ReadStatementOption = {
                kind: ast.SyntaxKind.ReadStatementOption,
                container: null,
                type: null,
                value: null,
            };

            const typeToken = state.consume(element, CstNodeKind.ReadStatementFile_Type, tokens.ReadStatementType);
            if (typeToken) {
                element.type = tokens.ReadStatementType.mapToEnumLiteral(typeToken.tokenTypeIdx);
            }

            state.consume(element, CstNodeKind.ReadStatementFile_OpenParen, tokens.OpenParen);
            element.value = this.expression.rule(state);
            state.consume(element, CstNodeKind.ReadStatementFile_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    reinitStatement = rule(
        sequence(tokens.REINIT),
        (state: ParserState): ast.ReinitStatement => {
            const element: ast.ReinitStatement = {
                kind: ast.SyntaxKind.ReinitStatement,
                container: null,
                reference: null,
            };

            state.consume(element, CstNodeKind.ReinitStatement_REINIT, tokens.REINIT);
            element.reference = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.ReinitStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    releaseStatement = rule(
        sequence(tokens.RELEASE),
        (state: ParserState): ast.ReleaseStatement => {
            const element: ast.ReleaseStatement = {
                kind: ast.SyntaxKind.ReleaseStatement,
                container: null,
                star: false,
                references: [],
            };

            state.consume(element, CstNodeKind.ReleaseStatement_RELEASE, tokens.RELEASE);

            if (state.tryConsume(element, CstNodeKind.ReleaseStatement_Star, tokens.Star)) {
                element.star = true;
            } else {
                const idToken = state.consume(element, CstNodeKind.ReleaseStatement_References0, tokens.ID);
                if (idToken) {
                    element.references.push(idToken.image);
                }

                while (state.tryConsume(element, CstNodeKind.ReleaseStatement_Comma, tokens.Comma)) {
                    const nextIdToken = state.consume(element, CstNodeKind.ReleaseStatement_References1, tokens.ID);
                    if (nextIdToken) {
                        element.references.push(nextIdToken.image);
                    }
                }
            }

            state.consume(element, CstNodeKind.ReleaseStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    resignalStatement = rule(
        sequence(tokens.RESIGNAL),
        (state: ParserState): ast.ResignalStatement => {
            const element: ast.ResignalStatement = {
                kind: ast.SyntaxKind.ResignalStatement,
                container: null,
            };

            state.consume(element, CstNodeKind.ResignalStatement_RESIGNAL, tokens.RESIGNAL);
            state.consume(element, CstNodeKind.ResignalStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    returnStatement = rule(
        sequence(tokens.RETURN),
        (state: ParserState): ast.ReturnStatement => {
            const element: ast.ReturnStatement = {
                kind: ast.SyntaxKind.ReturnStatement,
                container: null,
                expression: null,
                returnToken: null,
            };

            element.returnToken = state.consume(element, CstNodeKind.ReturnStatement_RETURN, tokens.RETURN);

            // Optional expression in parentheses
            if (state.tryConsume(element, CstNodeKind.ReturnStatement_OpenParen, tokens.OpenParen)) {
                element.expression = this.expression.rule(state);
                state.consume(element, CstNodeKind.ReturnStatement_CloseParen, tokens.CloseParen);
            }

            state.consume(element, CstNodeKind.ReturnStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    revertStatement = rule(
        sequence(tokens.REVERT),
        (state: ParserState): ast.RevertStatement => {
            const element: ast.RevertStatement = {
                kind: ast.SyntaxKind.RevertStatement,
                container: null,
                conditions: [],
            };

            state.consume(element, CstNodeKind.RevertStatement_REVERT, tokens.REVERT);

            // Parse first condition
            element.conditions.push(this.condition.rule(state));

            // Parse additional comma-separated conditions
            while (state.tryConsume(element, CstNodeKind.RevertStatement_Comma, tokens.Comma)) {
                element.conditions.push(this.condition.rule(state));
            }

            state.consume(element, CstNodeKind.RevertStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    rewriteStatement = rule(
        sequence(tokens.REWRITE),
        (state: ParserState): ast.RewriteStatement => {
            const element: ast.RewriteStatement = {
                kind: ast.SyntaxKind.RewriteStatement,
                container: null,
                arguments: [],
            };

            state.consume(element, CstNodeKind.RewriteStatement_REWRITE, tokens.REWRITE);

            // Parse zero or more rewrite statement options
            while (state.canConsumeFirst(this.rewriteStatementOption.first())) {
                element.arguments.push(this.rewriteStatementOption.rule(state));
            }

            state.consume(element, CstNodeKind.RewriteStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    rewriteStatementOption = rule(
        sequence(tokens.RewriteStatementType),
        (state: ParserState): ast.RewriteStatementOption => {
            const element: ast.RewriteStatementOption = {
                kind: ast.SyntaxKind.RewriteStatementOption,
                container: null,
                type: null,
                value: null,
            };

            const typeToken = state.consume(element, CstNodeKind.RewriteStatementFile_FILE, tokens.RewriteStatementType);
            if (typeToken) {
                element.type = tokens.RewriteStatementType.mapToEnumLiteral(typeToken.tokenTypeIdx);
            }

            state.consume(element, CstNodeKind.RewriteStatementFile_OpenParen, tokens.OpenParen);
            element.value = this.expression.rule(state);
            state.consume(element, CstNodeKind.RewriteStatementFile_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    selectStatement = rule(
        sequence(tokens.SELECT),
        (state: ParserState): ast.SelectStatement => {
            const element: ast.SelectStatement = {
                kind: ast.SyntaxKind.SelectStatement,
                container: null,
                selectToken: null,
                cases: [],
                on: null,
                end: null,
            };

            const selectToken = state.consume(element, CstNodeKind.SelectStatement_SELECT, tokens.SELECT);
            element.selectToken = selectToken;

            // Optional expression in parentheses
            if (state.tryConsume(element, CstNodeKind.SelectStatement_OpenParen, tokens.OpenParen)) {
                element.on = this.expression.rule(state);
                state.consume(element, CstNodeKind.SelectStatement_CloseParen, tokens.CloseParen);
            }

            state.consume(element, CstNodeKind.SelectStatement_Semicolon0, tokens.Semicolon);

            // Parse WHEN and OTHERWISE statements
            while (!state.eof && !state.canConsumeFirst(this.endStatement.first())) {
                if (state.canConsumeFirst(this.whenStatement.first())) {
                    element.cases.push(this.whenStatement.rule(state));
                } else if (state.canConsumeFirst(this.otherwiseStatement.first())) {
                    element.cases.push(this.otherwiseStatement.rule(state));
                } else {
                    // TODO: better error message
                    throw new Error("Expected WHEN or OTHERWISE statement in SELECT block");
                }
            }

            element.end = this.endStatement.rule(state);
            state.consume(element, CstNodeKind.SelectStatement_Semicolon1, tokens.Semicolon);

            return element;
        }
    );

    whenStatement = rule(
        sequence(tokens.WHEN),
        (state: ParserState): ast.WhenStatement => {
            const element: ast.WhenStatement = {
                kind: ast.SyntaxKind.WhenStatement,
                container: null,
                range: null,
                conditions: [],
                unit: null,
            };

            state.consume(element, CstNodeKind.WhenStatement_WHEN, tokens.WHEN);
            state.consume(element, CstNodeKind.WhenStatement_OpenParen, tokens.OpenParen);

            // Parse first condition
            element.conditions.push(this.expression.rule(state));

            // Parse additional comma-separated conditions
            while (state.tryConsume(element, CstNodeKind.WhenStatement_Comma, tokens.Comma)) {
                element.conditions.push(this.expression.rule(state));
            }

            state.consume(element, CstNodeKind.WhenStatement_CloseParen, tokens.CloseParen);
            element.unit = this.statement.rule(state);

            return element;
        }
    );

    otherwiseStatement = rule(
        sequence(tokens.OTHERWISE),
        (state: ParserState): ast.OtherwiseStatement => {
            const element: ast.OtherwiseStatement = {
                kind: ast.SyntaxKind.OtherwiseStatement,
                container: null,
                unit: null,
                range: null,
            };

            state.consume(element, CstNodeKind.OtherwiseStatement_OTHERWISE, tokens.OTHERWISE);
            element.unit = this.statement.rule(state);

            return element;
        }
    );

    signalStatement = rule(
        sequence(tokens.SIGNAL),
        (state: ParserState): ast.SignalStatement => {
            const element: ast.SignalStatement = {
                kind: ast.SyntaxKind.SignalStatement,
                container: null,
                condition: [],
            };

            state.consume(element, CstNodeKind.SignalStatement_SIGNAL, tokens.SIGNAL);
            element.condition.push(this.condition.rule(state));
            state.consume(element, CstNodeKind.SignalStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    stopStatement = rule(
        sequence(tokens.STOP),
        (state: ParserState): ast.StopStatement => {
            const element: ast.StopStatement = {
                kind: ast.SyntaxKind.StopStatement,
                container: null,
            };

            state.consume(element, CstNodeKind.StopStatement_STOP, tokens.STOP);
            state.consume(element, CstNodeKind.StopStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    waitStatement = rule(
        sequence(tokens.WAIT),
        (state: ParserState): ast.WaitStatement => {
            const element: ast.WaitStatement = {
                kind: ast.SyntaxKind.WaitStatement,
                container: null,
                task: null,
            };

            state.consume(element, CstNodeKind.WaitStatement_WAIT, tokens.WAIT);
            state.consume(element, CstNodeKind.WaitStatement_THREAD, tokens.THREAD);
            state.consume(element, CstNodeKind.WaitStatement_OpenParen, tokens.OpenParen);
            element.task = this.locatorCall.rule(state);
            state.consume(element, CstNodeKind.WaitStatement_CloseParen, tokens.CloseParen);
            state.consume(element, CstNodeKind.WaitStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    writeStatement = rule(
        sequence(tokens.WRITE),
        (state: ParserState): ast.WriteStatement => {
            const element: ast.WriteStatement = {
                kind: ast.SyntaxKind.WriteStatement,
                container: null,
                arguments: [],
            };

            state.consume(element, CstNodeKind.WriteStatement_WRITE, tokens.WRITE);

            while (state.canConsumeFirst(this.writeStatementOption.first())) {
                element.arguments.push(this.writeStatementOption.rule(state));
            }

            state.consume(element, CstNodeKind.WriteStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    writeStatementOption = rule(
        sequence(tokens.WriteStatementType),
        (state: ParserState): ast.WriteStatementOption => {
            const element: ast.WriteStatementOption = {
                kind: ast.SyntaxKind.WriteStatementOption,
                container: null,
                type: null,
                value: null,
            };

            const typeToken = state.consume(element, CstNodeKind.WriteStatementFile_FILE, tokens.WriteStatementType);
            if (typeToken) {
                element.type = tokens.WriteStatementType.mapToEnumLiteral(typeToken.tokenTypeIdx);
            }

            state.consume(element, CstNodeKind.WriteStatementFile_OpenParen, tokens.OpenParen);
            element.value = this.expression.rule(state);
            state.consume(element, CstNodeKind.WriteStatementFile_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    initialAttribute = rule(
        choice(
            sequence(tokens.INITIAL),
            sequence(tokens.INITACROSS),
        ),
        (state: ParserState): ast.InitialAttribute => {
            const element: ast.InitialAttribute = {
                kind: ast.SyntaxKind.InitialAttribute,
                container: null,
                across: false,
                expressions: [],
                direct: false,
                items: [],
                call: false,
                procedureCall: null,
                to: false,
                content: null,
                token: null,
            };

            if (state.canConsume(tokens.INITIAL)) {
                const token = state.consume(element, CstNodeKind.InitialAttribute_INITIAL, tokens.INITIAL);
                element.token = token;

                if (state.tryConsume(element, CstNodeKind.InitialAttribute_OpenParenDirect, tokens.OpenParen)) {
                    // INITIAL (items) variant
                    if (state.canConsumeFirst(this.initialAttributeItem.first())) {
                        element.items.push(this.initialAttributeItem.rule(state));
                        while (state.tryConsume(element, CstNodeKind.InitialAttribute_CommaDirect, tokens.Comma)) {
                            element.items.push(this.initialAttributeItem.rule(state));
                        }
                    }
                    state.consume(element, CstNodeKind.InitialAttribute_CloseParenDirect, tokens.CloseParen);
                } else if (state.tryConsume(element, CstNodeKind.InitialAttribute_Call, tokens.CALL)) {
                    // INITIAL CALL variant
                    element.call = true;
                    element.procedureCall = this.procedureCall.rule(state);
                } else if (state.tryConsume(element, CstNodeKind.InitialAttribute_To, tokens.TO)) {
                    // INITIAL TO variant  
                    element.to = true;
                    state.consume(element, CstNodeKind.InitialAttribute_OpenParenTo, tokens.OpenParen);
                    element.content = this.initialToContent.rule(state);
                    state.consume(element, CstNodeKind.InitialAttribute_CloseParenTo, tokens.CloseParen);
                    state.consume(element, CstNodeKind.InitialAttribute_OpenParenToItem, tokens.OpenParen);
                    element.items.push(this.initialAttributeItem.rule(state));
                    while (state.tryConsume(element, CstNodeKind.InitialAttribute_CommaToItem, tokens.Comma)) {
                        element.items.push(this.initialAttributeItem.rule(state));
                    }
                    state.consume(element, CstNodeKind.InitialAttribute_CloseParenToItem, tokens.CloseParen);
                } else {
                    // TODO: better error message
                    throw new Error("Expected '(', 'CALL', or 'TO' after INITIAL");
                }
            } else if (state.tryConsume(element, CstNodeKind.InitialAttribute_INITACROSS, tokens.INITACROSS)) {
                // INITACROSS variant
                element.across = true;
                state.consume(element, CstNodeKind.InitialAttribute_OpenParenInitAcross, tokens.OpenParen);
                element.expressions.push(this.initAcrossExpression.rule(state));
                while (state.tryConsume(element, CstNodeKind.InitialAttribute_CommaInitAcross, tokens.Comma)) {
                    element.expressions.push(this.initAcrossExpression.rule(state));
                }
                state.consume(element, CstNodeKind.InitialAttribute_CloseParenInitAcross, tokens.CloseParen);
            } else {
                // TODO: better error message
                throw new Error("Expected INITIAL or INITACROSS");
            }

            return element;
        }
    );

    initialToContent = rule(
        choice(
            sequence(tokens.Varying),
            sequence(tokens.CharType),
        ),
        (state: ParserState): ast.InitialToContent => {
            const element: ast.InitialToContent = {
                kind: ast.SyntaxKind.InitialToContent,
                container: null,
                varying: null,
                type: null,
            };

            // Varying and char tokens can appear in any order
            if (state.canConsume(tokens.Varying)) {
                const varyingToken = state.consume(element, CstNodeKind.InitialToContent_VARYING0, tokens.Varying);
                if (varyingToken) {
                    element.varying = tokens.Varying.mapToEnumLiteral(
                        varyingToken.tokenTypeIdx,
                    );;
                }

                if (state.canConsume(tokens.CharType)) {
                    const typeToken = state.consume(element, CstNodeKind.InitialToContent_CHAR0, tokens.CharType);
                    if (typeToken) {
                        element.type = tokens.CharType.mapToEnumLiteral(typeToken.tokenTypeIdx);
                    }
                }
            } else if (state.canConsume(tokens.CharType)) {
                const typeToken = state.consume(element, CstNodeKind.InitialToContent_CHAR1, tokens.CharType);
                if (typeToken) {
                    element.type = tokens.CharType.mapToEnumLiteral(typeToken.tokenTypeIdx);
                }

                if (state.canConsume(tokens.Varying)) {
                    const varyingToken = state.consume(element, CstNodeKind.InitialToContent_VARYING1, tokens.Varying);
                    if (varyingToken) {
                        element.varying = tokens.Varying.mapToEnumLiteral(
                            varyingToken.tokenTypeIdx,
                        );;
                    }
                }
            } else {
                // TODO: better error message
                throw new Error("Expected VARYING or character type in INITIAL TO content");
            }

            return element;
        }
    );

    initAcrossExpression = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.InitAcrossExpression => {
            const element: ast.InitAcrossExpression = {
                kind: ast.SyntaxKind.InitAcrossExpression,
                container: null,
                expressions: [],
            };

            state.consume(element, CstNodeKind.InitAcrossExpression_OpenParen, tokens.OpenParen);
            element.expressions.push(this.expression.rule(state));

            while (state.tryConsume(element, CstNodeKind.InitAcrossExpression_Comma, tokens.Comma)) {
                element.expressions.push(this.expression.rule(state));
            }

            state.consume(element, CstNodeKind.InitAcrossExpression_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    initialAttributeItem = orRule<ast.InitialAttributeItem>(
        () => this.initialAttributeItemStar,
        () => this.initialAttributeSpecification,
    );

    initialAttributeItemStar = rule(
        sequence(tokens.Star),
        (state: ParserState): ast.InitialAttributeItemStar => {
            const element: ast.InitialAttributeItemStar = {
                kind: ast.SyntaxKind.InitialAttributeItemStar,
                container: null,
            };

            state.consume(element, CstNodeKind.InitialAttributeItemStar_Star, tokens.Star);

            return element;
        }
    );

    initialAttributeSpecification = rule(
        choice(
            //LL(2) conflicts expression, decide at runtime
            //sequence(tokens.OpenParen, tokens.Star),
            () => this.expression.first(),
        ),
        (state: ParserState): ast.InitialAttributeSpecification => {
            const element: ast.InitialAttributeSpecification = {
                kind: ast.SyntaxKind.InitialAttributeSpecification,
                container: null,
                star: false,
                item: null,
                expression: null,
            };

            if (state.canConsume(tokens.OpenParen, tokens.Star)) {
                // (Star) variant
                state.consume(element, CstNodeKind.InitialAttributeSpecification_OpenParen, tokens.OpenParen);
                state.consume(element, CstNodeKind.InitialAttributeSpecification_Star, tokens.Star);
                element.star = true;
                state.consume(element, CstNodeKind.InitialAttributeSpecification_CloseParen, tokens.CloseParen);
            } else {
                // Expression variant
                element.expression = this.expression.rule(state);
            }

            // Optional iteration specification
            if (state.canConsumeFirst(this.initialAttributeSpecificationIteration.first())) {
                element.item = this.initialAttributeSpecificationIteration.rule(state);
            }

            return element;
        }
    );

    initialAttributeSpecificationIteration = orRule<ast.InitialAttributeSpecificationIteration>(
        () => this.initialAttributeItemStar,
        () => this.initialAttributeSpecificationIterationValue,
    );

    initialAttributeSpecificationIterationValue = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.InitialAttributeSpecificationIterationValue => {
            const element: ast.InitialAttributeSpecificationIterationValue = {
                kind: ast.SyntaxKind.InitialAttributeSpecificationIterationValue,
                container: null,
                items: [],
            };

            state.consume(element, CstNodeKind.InitialAttributeSpecificationIterationValue_OpenParen, tokens.OpenParen);

            element.items.push(this.initialAttributeItem.rule(state));

            while (state.tryConsume(element, CstNodeKind.InitialAttributeSpecificationIterationValue_Comma, tokens.Comma)) {
                element.items.push(this.initialAttributeItem.rule(state));
            }

            state.consume(element, CstNodeKind.InitialAttributeSpecificationIterationValue_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    declareStatement = rule(
        sequence(tokens.DECLARE),
        (state: ParserState): ast.DeclareStatement => {
            const element: ast.DeclareStatement = {
                kind: ast.SyntaxKind.DeclareStatement,
                container: null,
                items: [],
                xDeclare: false,
            };

            const declareToken = state.consume(element, CstNodeKind.DeclareStatement_DECLARE, tokens.DECLARE);
            if (declareToken?.image.charAt(0).toUpperCase() === "X") {
                element.xDeclare = true;
            }

            element.items.push(this.declaredItem.rule(state));

            while (state.tryConsume(element, CstNodeKind.DeclareStatement_Comma, tokens.Comma)) {
                element.items.push(this.declaredItem.rule(state));
            }

            state.consume(element, CstNodeKind.DeclareStatement_Semicolon, tokens.Semicolon);

            return element;
        }
    );

    declaredItem = rule(
        choice(
            sequence(tokens.NUMBER),
            () => this.declaredVariable.first(),
            sequence(tokens.Star),
            sequence(tokens.OpenParen),
        ),
        (state: ParserState): ast.DeclaredItem => {
            let element: ast.DeclaredItem = {
                kind: ast.SyntaxKind.DeclaredItem,
                container: null,
                level: null,
                attributes: [],
                elements: [],
                levelToken: null,
            };

            // Optional level number
            if (state.tryConsume(element, CstNodeKind.DeclaredItem_LevelNumber, tokens.NUMBER)) {
                const levelToken = state.last;
                if (levelToken) {
                    element.levelToken = levelToken;
                    element.level = parseInt(levelToken.image, 10);
                }
            }

            // Main content: variable, wildcard, or nested items
            if (state.canConsumeFirst(this.declaredVariable.first())) {
                element.elements.push(this.declaredVariable.rule(state));
            } else if (state.tryConsume(element, CstNodeKind.WildcardItem_Asterisk, tokens.Star)) {
                const wildcard: ast.WildcardItem = {
                    kind: ast.SyntaxKind.WildcardItem,
                    container: null,
                    token: state.last!,
                };
                element.elements.push(wildcard);
            } else if (state.tryConsume(element, CstNodeKind.DeclaredItem_OpenParen, tokens.OpenParen)) {
                // Nested items in parentheses
                element.elements.push(this.declaredItem.rule(state));

                while (state.tryConsume(element, CstNodeKind.DeclaredItem_Comma, tokens.Comma)) {
                    element.elements.push(this.declaredItem.rule(state));
                }

                state.consume(element, CstNodeKind.DeclaredItem_CloseParen, tokens.CloseParen);
            } else {
                // TODO better error message
                throw new Error("Expected variable name, '*', or parenthesized items in DECLARE statement");
            }

            // Parse attributes (can appear multiple times)
            while (state.canConsumeFirst(this.declarationAttribute.first())) {
                element.attributes.push(this.declarationAttribute.rule(state));
            }

            return element;
        }
    );

    declaredVariable = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.DeclaredVariable => {
            const element: ast.DeclaredVariable = {
                kind: ast.SyntaxKind.DeclaredVariable,
                container: null,
                name: null,
                nameToken: null,
            };

            const idToken = state.consume(element, CstNodeKind.DeclaredVariable_Name, tokens.ID);
            if (idToken) {
                element.name = idToken.image;
                element.nameToken = idToken;
            }

            return element;
        }
    );

    private commonDeclarationAttributes: (() => RuleFirstPair<ast.CommonDeclarationAttribute>)[] = [
        () => this.initialAttribute,
        () => this.dateAttribute,
        () => this.handleAttribute,
        () => this.definedAttribute,
        () => this.pictureAttribute,
        () => this.environmentAttribute,
        () => this.dimensionsDataAttribute,
        () => this.valueListFromAttribute,
        () => this.valueListAttribute,
        () => this.valueRangeAttribute,
        () => this.returnsAttribute,
        () => this.computationDataAttribute,
        () => this.entryAttribute,
        () => this.likeAttribute,
        () => this.typeAttribute,
       //TODO reenable with custom lookahead () => this.genericAttribute,
        () => this.indForAttribute,
    ];

    defaultDeclarationAttribute = orRule<ast.DefaultDeclarationAttribute>(
        ...this.commonDeclarationAttributes,
        () => this.defaultValueAttribute,
    );

    declarationAttribute = orRule<ast.DeclarationAttribute>(
        ...this.commonDeclarationAttributes,
        () => this.valueAttribute,
    );

    dateAttribute = rule(
        sequence(tokens.DATE),
        (state: ParserState): ast.DateAttribute => {
            const element: ast.DateAttribute = {
                kind: ast.SyntaxKind.DateAttribute,
                container: null,
                pattern: null,
            };

            state.consume(element, CstNodeKind.DateAttribute_DATE, tokens.DATE);

            if (state.tryConsume(element, CstNodeKind.DateAttribute_OpenParen, tokens.OpenParen)) {
                const patternToken = state.consume(element, CstNodeKind.DateAttribute_PatternString, tokens.STRING_TERM);
                if (patternToken) {
                    element.pattern = patternToken.image;
                }
                state.consume(element, CstNodeKind.DateAttribute_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    definedAttribute = rule(
        sequence(tokens.DEFINED),
        (state: ParserState): ast.DefinedAttribute => {
            const element: ast.DefinedAttribute = {
                kind: ast.SyntaxKind.DefinedAttribute,
                container: null,
                reference: null,
                position: null,
            };

            state.consume(element, CstNodeKind.DefinedAttribute_DEFINED, tokens.DEFINED);

            if (state.canConsumeFirst(this.memberCall.first())) {
                element.reference = this.memberCall.rule(state);
            } else if (state.tryConsume(element, CstNodeKind.DefinedAttribute_OpenParenRef, tokens.OpenParen)) {
                element.reference = this.memberCall.rule(state);
                state.consume(element, CstNodeKind.DefinedAttribute_CloseParenRef, tokens.CloseParen);
            } else {
                // TODO better error message
                throw new Error("Expected member call in DEFINED attribute");
            }

            if (state.tryConsume(element, CstNodeKind.DefinedAttribute_POSITION, tokens.POSITION)) {
                state.consume(element, CstNodeKind.DefinedAttribute_OpenParenPos, tokens.OpenParen);
                element.position = this.expression.rule(state);
                state.consume(element, CstNodeKind.DefinedAttribute_CloseParenPos, tokens.CloseParen);
            }

            return element;
        }
    );

    pictureAttribute = rule(
        choice(
            sequence(tokens.PICTURE),
            sequence(tokens.WIDEPIC),
        ),
        (state: ParserState): ast.PictureAttribute => {
            const element: ast.PictureAttribute = {
                kind: ast.SyntaxKind.PictureAttribute,
                container: null,
                picture: null,
                pictureToken: null,
            };

            if (state.canConsume(tokens.PICTURE)) {
                element.pictureToken = state.consume(element, CstNodeKind.PictureAttribute_PICTURE, tokens.PICTURE);
            } else if (state.canConsume(tokens.WIDEPIC)) {
                element.pictureToken = state.consume(element, CstNodeKind.PictureAttribute_WIDEPIC, tokens.WIDEPIC);
            } else {
                // TODO better error message
                throw new Error("Expected PICTURE or WIDEPIC");
            }

            if (state.canConsume(tokens.STRING_TERM)) {
                const pictureStringToken = state.consume(element, CstNodeKind.PictureAttribute_PictureString, tokens.STRING_TERM);
                if (pictureStringToken) {
                    element.picture = pictureStringToken.image;
                }
            }

            return element;
        }
    );

    dimensionsDataAttribute = rule(
        choice(
            sequence(tokens.DIMENSION),
            () => this.dimensions.first(),
        ),
        (state: ParserState): ast.DimensionsDataAttribute => {
            const element: ast.DimensionsDataAttribute = {
                kind: ast.SyntaxKind.DimensionsDataAttribute,
                container: null,
                dimensions: null,
            };

            // Optional DIMENSION keyword
            state.tryConsume(element, CstNodeKind.DimensionsDataAttribute_DIMENSION, tokens.DIMENSION);

            // Required dimensions
            element.dimensions = this.dimensions.rule(state);

            return element;
        }
    );

    typeAttribute = rule(
        sequence(tokens.TypeOrOrdinal),
        (state: ParserState): ast.TypeAttribute => {
            const element: ast.TypeAttribute = {
                kind: ast.SyntaxKind.TypeAttribute,
                container: null,
                type: null,
                typeToken: null,
            };

            // "TYPE" and "ORDINAL" are interchangeable here
            // We need to validate that the "ORDINAL" keyword is used exclusively with ordinal types
            // We do this in the validation phase
            element.typeToken = state.consume(element, CstNodeKind.TypeAttribute_TYPE, tokens.TypeOrOrdinal);

            if (state.canConsume(tokens.ID)) {
                // Simple type reference: TYPE MYTYPE
                const idToken = state.consume(element, CstNodeKind.TypeAttribute_TypeId0, tokens.ID);
                if (idToken) {
                    element.type = ast.createReference(
                        element,
                        idToken,
                        ast.ReferenceType.Type,
                    );
                }
            } else if (state.tryConsume(element, CstNodeKind.TypeAttribute_OpenParen, tokens.OpenParen)) {
                // Parenthesized type reference: TYPE (MYTYPE)
                const idToken = state.consume(element, CstNodeKind.TypeAttribute_TypeId1, tokens.ID);
                if (idToken) {
                    element.type = ast.createReference(
                        element,
                        idToken,
                        ast.ReferenceType.Type,
                    );
                }
                state.consume(element, CstNodeKind.TypeAttribute_CloseParen, tokens.CloseParen);
            } else {
                // TODO: better error message
                throw new Error("Expected type name or parenthesized type name in TYPE attribute");
            }

            return element;
        }
    );

    returnsAttribute = rule(
        sequence(tokens.RETURNS),
        (state: ParserState): ast.ReturnsAttribute => {
            const element: ast.ReturnsAttribute = {
                kind: ast.SyntaxKind.ReturnsAttribute,
                container: null,
                attrs: [],
            };

            state.consume(element, CstNodeKind.ReturnsAttribute_RETURNS, tokens.RETURNS);
            state.consume(element, CstNodeKind.ReturnsAttribute_OpenParen, tokens.OpenParen);

            // Parse zero or more declaration attributes
            while (!state.eof && !state.canConsume(tokens.CloseParen)) {
                if (state.canConsumeFirst(this.computationDataAttribute.first())) {
                    element.attrs.push(this.computationDataAttribute.rule(state));
                } else if (state.canConsumeFirst(this.dateAttribute.first())) {
                    element.attrs.push(this.dateAttribute.rule(state));
                } else if (state.canConsumeFirst(this.valueListAttribute.first())) {
                    element.attrs.push(this.valueListAttribute.rule(state));
                } else if (state.canConsumeFirst(this.valueRangeAttribute.first())) {
                    element.attrs.push(this.valueRangeAttribute.rule(state));
                } else {
                    // TODO: better error message
                    throw new Error("Expected declaration attribute in RETURNS clause");
                }
            }

            state.consume(element, CstNodeKind.ReturnsAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    computationDataAttribute = rule(
        sequence(tokens.DefaultAttribute),
        (state: ParserState): ast.ComputationDataAttribute => {
            const element: ast.ComputationDataAttribute = {
                kind: ast.SyntaxKind.ComputationDataAttribute,
                typeToken: null,
                container: null,
                type: null,
                dimensions: null,
            };

            const token = state.consume(element, CstNodeKind.DefaultAttribute_Value, tokens.DefaultAttribute);
            if (token) {
                element.typeToken = token;
                element.type = tokens.DefaultAttribute.mapToEnumLiteral(token.tokenTypeIdx);
            }

            // Optional dimensions
            if (state.canConsumeFirst(this.dimensions.first())) {
                element.dimensions = this.dimensions.rule(state);
            }

            return element;
        }
    );

    defaultValueAttribute = rule(
        sequence(tokens.VALUE),
        (state: ParserState): ast.DefaultValueAttribute => {
            const element: ast.DefaultValueAttribute = {
                kind: ast.SyntaxKind.DefaultValueAttribute,
                container: null,
                items: [],
            };

            state.consume(element, CstNodeKind.DefaultValueAttribute_VALUE, tokens.VALUE);
            state.consume(element, CstNodeKind.DefaultValueAttribute_OpenParen, tokens.OpenParen);

            element.items.push(this.defaultValueAttributeItem.rule(state));

            while (state.tryConsume(element, CstNodeKind.DefaultValueAttribute_Comma, tokens.Comma)) {
                element.items.push(this.defaultValueAttributeItem.rule(state));
            }

            state.consume(element, CstNodeKind.DefaultValueAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    valueAttribute = rule(
        sequence(tokens.VALUE),
        (state: ParserState): ast.ValueAttribute => {
            const element: ast.ValueAttribute = {
                kind: ast.SyntaxKind.ValueAttribute,
                container: null,
                value: null,
            };

            state.consume(element, CstNodeKind.ValueAttribute_VALUE, tokens.VALUE);
            state.consume(element, CstNodeKind.ValueAttribute_OpenParen, tokens.OpenParen);
            element.value = this.expression.rule(state);
            state.consume(element, CstNodeKind.ValueAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    defaultValueAttributeItem = rule(
        () => this.declarationAttribute.first(),
        (state: ParserState): ast.DefaultValueAttributeItem => {
            const element: ast.DefaultValueAttributeItem = {
                kind: ast.SyntaxKind.DefaultValueAttributeItem,
                container: null,
                attributes: [],
            };

            // Parse at least one declaration attribute
            element.attributes.push(this.declarationAttribute.rule(state));

            // Parse additional attributes
            while (state.canConsumeFirst(this.declarationAttribute.first())) {
                element.attributes.push(this.declarationAttribute.rule(state));
            }

            return element;
        }
    );

    valueListAttribute = rule(
        sequence(tokens.VALUELIST),
        (state: ParserState): ast.ValueListAttribute => {
            const element: ast.ValueListAttribute = {
                kind: ast.SyntaxKind.ValueListAttribute,
                container: null,
                values: [],
            };

            state.consume(element, CstNodeKind.ValueListAttribute_VALUELIST, tokens.VALUELIST);
            state.consume(element, CstNodeKind.ValueListAttribute_OpenParen, tokens.OpenParen);

            if (state.canConsumeFirst(this.expression.first())) {
                element.values.push(this.expression.rule(state));
                while (state.tryConsume(element, CstNodeKind.ValueListAttribute_Comma, tokens.Comma)) {
                    element.values.push(this.expression.rule(state));
                }
            }

            state.consume(element, CstNodeKind.ValueListAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    valueListFromAttribute = rule(
        sequence(tokens.VALUELISTFROM),
        (state: ParserState): ast.ValueListFromAttribute => {
            const element: ast.ValueListFromAttribute = {
                kind: ast.SyntaxKind.ValueListFromAttribute,
                container: null,
                from: null,
            };

            state.consume(element, CstNodeKind.ValueListFromAttribute_VALUELISTFROM, tokens.VALUELISTFROM);
            element.from = this.locatorCall.rule(state);

            return element;
        }
    );

    valueRangeAttribute = rule(
        sequence(tokens.VALUERANGE),
        (state: ParserState): ast.ValueRangeAttribute => {
            const element: ast.ValueRangeAttribute = {
                kind: ast.SyntaxKind.ValueRangeAttribute,
                container: null,
                values: [],
            };

            state.consume(element, CstNodeKind.ValueRangeAttribute_VALUERANGE, tokens.VALUERANGE);
            state.consume(element, CstNodeKind.ValueRangeAttribute_OpenParen, tokens.OpenParen);

            if (state.canConsumeFirst(this.expression.first())) {
                element.values.push(this.expression.rule(state));
                while (state.tryConsume(element, CstNodeKind.ValueRangeAttribute_Comma, tokens.Comma)) {
                    element.values.push(this.expression.rule(state));
                }
            }

            state.consume(element, CstNodeKind.ValueRangeAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    likeAttribute = rule(
        sequence(tokens.LIKE),
        (state: ParserState): ast.LikeAttribute => {
            const element: ast.LikeAttribute = {
                kind: ast.SyntaxKind.LikeAttribute,
                container: null,
                reference: null,
            };

            state.consume(element, CstNodeKind.LikeAttribute_LIKE, tokens.LIKE);
            element.reference = this.locatorCall.rule(state);

            return element;
        }
    );

    handleAttribute = rule(
        sequence(tokens.HANDLE),
        (state: ParserState): ast.HandleAttribute => {
            const element: ast.HandleAttribute = {
                kind: ast.SyntaxKind.HandleAttribute,
                container: null,
                size: null,
                type: null,
            };

            state.consume(element, CstNodeKind.HandleAttribute_HANDLE, tokens.HANDLE);

            // Optional size in parentheses
            if (state.tryConsume(element, CstNodeKind.HandleAttribute_OpenParenSize, tokens.OpenParen)) {
                const sizeToken = state.consume(element, CstNodeKind.HandleAttribute_SizeNumber, tokens.NUMBER);
                if (sizeToken) {
                    element.size = sizeToken.image;
                }
                state.consume(element, CstNodeKind.HandleAttribute_CloseParenSize, tokens.CloseParen);
            }

            // Required type reference
            if (state.canConsume(tokens.ID)) {
                // Simple type reference: HANDLE MYTYPE
                const idToken = state.consume(element, CstNodeKind.HandleAttribute_TypeId0, tokens.ID);
                if (idToken) {
                    element.type = ast.createReference(
                        element,
                        idToken,
                        ast.ReferenceType.Type,
                    );
                }
            } else if (state.tryConsume(element, CstNodeKind.HandleAttribute_OpenParenType, tokens.OpenParen)) {
                // Parenthesized type reference: HANDLE (MYTYPE)
                const idToken = state.consume(element, CstNodeKind.HandleAttribute_TypeId1, tokens.ID);
                if (idToken) {
                    element.type = ast.createReference(
                        element,
                        idToken,
                        ast.ReferenceType.Type,
                    );
                }
                state.consume(element, CstNodeKind.HandleAttribute_CloseParenType, tokens.CloseParen);
            } else {
                // TODO: better error message
                throw new Error("Expected type name or parenthesized type name in HANDLE attribute");
            }

            return element;
        }
    );

    dimensions = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.Dimensions => {
            const element: ast.Dimensions = {
                kind: ast.SyntaxKind.Dimensions,
                container: null,
                dimensions: [],
                token: null,
            };

            const openToken = state.consume(element, CstNodeKind.Dimensions_OpenParen, tokens.OpenParen);
            element.token = openToken;

            // Optional dimension bounds
            if (state.canConsumeFirst(this.dimensionBound.first())) {
                element.dimensions.push(this.dimensionBound.rule(state));

                while (state.tryConsume(element, CstNodeKind.Dimensions_Comma, tokens.Comma)) {
                    element.dimensions.push(this.dimensionBound.rule(state));
                }
            }

            state.consume(element, CstNodeKind.Dimensions_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    dimensionBound = rule(
        () => this.bound.first(),
        (state: ParserState): ast.DimensionBound => {
            const element: ast.DimensionBound = {
                kind: ast.SyntaxKind.DimensionBound,
                container: null,
                lower: null,
                upper: null,
            };

            // First bound is the upper bound
            element.upper = this.bound.rule(state);

            // Optional colon followed by lower bound
            if (state.tryConsume(element, CstNodeKind.DimensionBound_Colon, tokens.Colon)) {
                element.lower = element.upper; // Move upper to lower
                element.upper = this.bound.rule(state); // Parse new upper
            }

            return element;
        }
    );

    bound = rule(
        choice(
            sequence(tokens.Star),
            () => this.expression.first(),
        ),
        (state: ParserState): ast.Bound => {
            const element: ast.Bound = {
                kind: ast.SyntaxKind.Bound,
                container: null,
                expression: null,
                refer: null,
            };

            if (state.tryConsume(element, CstNodeKind.Bound_Star, tokens.Star)) {
                // Star bound (indicates variable size)
                element.expression = "*";
            } else {
                // Expression bound
                element.expression = this.expression.rule(state);

                // Optional REFER clause
                if (state.tryConsume(element, CstNodeKind.Bound_REFER, tokens.REFER)) {
                    state.consume(element, CstNodeKind.Bound_OpenParen, tokens.OpenParen);
                    element.refer = this.locatorCall.rule(state);
                    state.consume(element, CstNodeKind.Bound_CloseParen, tokens.CloseParen);
                }
            }

            return element;
        }
    );

    environmentAttribute = rule(
        sequence(tokens.ENVIRONMENT),
        (state: ParserState): ast.EnvironmentAttribute => {
            const element: ast.EnvironmentAttribute = {
                kind: ast.SyntaxKind.EnvironmentAttribute,
                container: null,
                items: [],
            };

            state.consume(element, CstNodeKind.EnvironmentAttribute_ENVIRONMENT, tokens.ENVIRONMENT);
            state.consume(element, CstNodeKind.EnvironmentAttribute_OpenParen, tokens.OpenParen);

            // Parse zero or more environment attribute items
            while (!state.eof && !state.canConsume(tokens.CloseParen)) {
                element.items.push(this.environmentAttributeItem.rule(state));

                // TODO: research, This does not align to the language spec
                // Optional comma between items
                state.tryConsume(element, CstNodeKind.EnvironmentAttributeItem_Comma, tokens.Comma);
            }

            state.consume(element, CstNodeKind.EnvironmentAttribute_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    environmentAttributeItem = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.EnvironmentAttributeItem => {
            const element: ast.EnvironmentAttributeItem = {
                kind: ast.SyntaxKind.EnvironmentAttributeItem,
                container: null,
                environment: null,
                args: [],
            };

            const envToken = state.consume(element, CstNodeKind.EnvironmentAttributeItem_Environment, tokens.ID);
            if (envToken) {
                element.environment = envToken.image;
            }

            // Optional arguments in parentheses
            if (state.tryConsume(element, CstNodeKind.EnvironmentAttributeItem_OpenParen, tokens.OpenParen)) {
                // Optional expression list
                if (state.canConsumeFirst(this.expression.first())) {
                    element.args.push(this.expression.rule(state));

                    while (!state.eof && !state.canConsume(tokens.CloseParen)) {
                        // Optional comma before next expression
                        state.tryConsume(element, CstNodeKind.EnvironmentAttributeItem_Comma, tokens.Comma);

                        if (state.canConsumeFirst(this.expression.first())) {
                            element.args.push(this.expression.rule(state));
                        } else {
                            break; //TODO is this correct?! Very weird behavior
                        }
                    }
                }

                state.consume(element, CstNodeKind.EnvironmentAttributeItem_CloseParen, tokens.CloseParen);
            }

            return element;
        }
    );

    entryAttribute = rule(
        choice(
            sequence(tokens.LIMITED),
            sequence(tokens.ENTRY),
        ),
        (state: ParserState): ast.EntryAttribute => {
            const element: ast.EntryAttribute = {
                kind: ast.SyntaxKind.EntryAttribute,
                container: null,
                entryToken: null,
                attributes: [],
                options: [],
                variable: [],
                limited: [],
                returns: [],
                environmentName: [],
            };

            // Parse zero or more LIMITED tokens at the beginning
            while (state.tryConsume(element, CstNodeKind.EntryAttribute_Limited0, tokens.LIMITED)) {
                const limitedToken = state.last;
                if (limitedToken) {
                    element.limited.push(limitedToken);
                }
            }

            // Parse required ENTRY token
            element.entryToken = state.consume(element, CstNodeKind.EntryAttribute_ENTRY, tokens.ENTRY);

            // Optional parameter list
            if (state.tryConsume(element, CstNodeKind.EntryAttribute_OpenParenAttribute, tokens.OpenParen)) {
                element.attributes.push(this.entryDescription.rule(state));

                while (state.tryConsume(element, CstNodeKind.EntryAttribute_CommaAttribute, tokens.Comma)) {
                    element.attributes.push(this.entryDescription.rule(state));
                }

                state.consume(element, CstNodeKind.EntryAttribute_CloseParenAttribute, tokens.CloseParen);
            }

            // Parse zero or more trailing options
            while (!state.eof && !state.canConsume(tokens.Semicolon)) {
                if (state.canConsumeFirst(this.options.first())) {
                    element.options.push(this.options.rule(state));
                } else if (state.tryConsume(element, CstNodeKind.EntryAttribute_Variable, tokens.VARIABLE)) {
                    const variableToken = state.last;
                    if (variableToken) {
                        element.variable.push(variableToken);
                    }
                } else if (state.tryConsume(element, CstNodeKind.EntryAttribute_Limited1, tokens.LIMITED)) {
                    const limitedToken = state.last;
                    if (limitedToken) {
                        element.limited.push(limitedToken);
                    }
                } else if (state.canConsumeFirst(this.returnsOption.first())) {
                    element.returns.push(this.returnsOption.rule(state));
                } else if (state.tryConsume(element, CstNodeKind.EntryAttribute_EXTERNAL, tokens.EXTERNAL)) {
                    if (state.tryConsume(element, CstNodeKind.EntryAttribute_OpenParenEnv, tokens.OpenParen)) {
                        const envExpression = this.expression.rule(state);
                        element.environmentName.push(envExpression);
                        state.consume(element, CstNodeKind.EntryAttribute_CloseParenEnv, tokens.CloseParen);
                    }
                } else {
                    // TODO: better error message
                    throw new Error("Unexpected token in ENTRY attribute");
                }
            }

            return element;
        }
    );

    returnsOption = rule(
        sequence(tokens.RETURNS),
        (state: ParserState): ast.ReturnsOption => {
            const element: ast.ReturnsOption = {
                kind: ast.SyntaxKind.ReturnsOption,
                container: null,
                returnAttributes: [],
            };

            state.consume(element, CstNodeKind.ReturnsOption_RETURNS, tokens.RETURNS);
            state.consume(element, CstNodeKind.ReturnsOption_OpenParen, tokens.OpenParen);

            // Parse zero or more declaration attributes
            while (!state.eof && !state.canConsume(tokens.CloseParen)) {
                if (state.canConsumeFirst(this.declarationAttribute.first())) {
                    element.returnAttributes.push(this.declarationAttribute.rule(state));
                } else {
                    // TODO: better error message
                    throw new Error("Expected declaration attribute in RETURNS clause");
                }
            }

            state.consume(element, CstNodeKind.ReturnsOption_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    entryDescription = orRule<ast.EntryDescription>(
        () => this.entryParameterDescription,
        () => this.entryUnionDescription,
    );

    entryParameterDescription = rule(
        choice(
            sequence(tokens.Star),
            () => this.declarationAttribute.first(),
        ),
        (state: ParserState): ast.EntryParameterDescription => {
            const element: ast.EntryParameterDescription = {
                kind: ast.SyntaxKind.EntryParameterDescription,
                container: null,
                attributes: [],
                star: false,
            };

            if (state.tryConsume(element, CstNodeKind.EntryParameterDescription_Star, tokens.Star)) {
                element.star = true;
                // Parse optional attributes after the star
                while (state.canConsumeFirst(this.declarationAttribute.first())) {
                    element.attributes.push(this.declarationAttribute.rule(state));
                }
            } else {
                // Parse at least one declaration attribute
                element.attributes.push(this.declarationAttribute.rule(state));

                // Parse additional attributes
                while (state.canConsumeFirst(this.declarationAttribute.first())) {
                    element.attributes.push(this.declarationAttribute.rule(state));
                }
            }

            return element;
        }
    );

    entryUnionDescription = rule(
        sequence(tokens.NUMBER),
        (state: ParserState): ast.EntryUnionDescription => {
            const element: ast.EntryUnionDescription = {
                kind: ast.SyntaxKind.EntryUnionDescription,
                container: null,
                init: null,
                attributes: [],
                prefixedAttributes: [],
            };

            const initToken = state.consume(element, CstNodeKind.EntryUnionDescription_InitNumber, tokens.NUMBER);
            if (initToken) {
                element.init = initToken.image;
            }

            // Parse zero or more declaration attributes
            while (state.canConsumeFirst(this.declarationAttribute.first())) {
                element.attributes.push(this.declarationAttribute.rule(state));
            }

            // Required comma
            state.consume(element, CstNodeKind.EntryUnionDescription_Comma, tokens.Comma);

            // Parse zero or more prefixed attributes
            while (state.canConsumeFirst(this.prefixedAttribute.first())) {
                element.prefixedAttributes.push(this.prefixedAttribute.rule(state));
            }

            return element;
        }
    );

    prefixedAttribute = rule(
        sequence(tokens.NUMBER),
        (state: ParserState): ast.PrefixedAttribute => {
            const element: ast.PrefixedAttribute = {
                kind: ast.SyntaxKind.PrefixedAttribute,
                container: null,
                level: null,
                attributes: [],
            };

            const levelToken = state.consume(element, CstNodeKind.PrefixedAttribute_LevelNumber, tokens.NUMBER);
            if (levelToken) {
                element.level = levelToken.image;
            }

            // Parse zero or more declaration attributes
            while (state.canConsumeFirst(this.declarationAttribute.first())) {
                element.attributes.push(this.declarationAttribute.rule(state));
            }

            return element;
        }
    );

    procedureParameter = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.ProcedureParameter => {
            const element: ast.ProcedureParameter = {
                kind: ast.SyntaxKind.ProcedureParameter,
                container: null,
                ref: null,
            };

            const idToken = state.consume(element, CstNodeKind.ProcedureParameter_Id, tokens.ID);
            if (idToken) {
                element.ref = ast.createReference(
                    element,
                    idToken,
                    ast.ReferenceType.Variable,
                );
            }

            return element;
        }
    );

    referenceItem = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.ReferenceItem => {
            const element: ast.ReferenceItem = {
                kind: ast.SyntaxKind.ReferenceItem,
                container: null,
                ref: null,
                dimensions: null,
            };

            const idToken = state.consume(element, CstNodeKind.ReferenceItem_Ref, tokens.ID);
            if (idToken) {
                element.ref = ast.createReference(
                    element,
                    idToken,
                    ast.ReferenceType.Variable,
                );
            }

            // Optional dimensions
            if (state.canConsumeFirst(this.dimensions.first())) {
                element.dimensions = this.dimensions.rule(state);
            }

            return element;
        }
    );

    expression = rule(
        () => this.primaryExpression.first(),
        (state: ParserState): ast.Expression => {
            const element: IntermediateBinaryExpression = {
                infix: true,
                items: [],
                operators: [],
                operatorTokens: [],
            };

            // Parse first primary expression
            element.items.push(this.primaryExpression.rule(state));

            // Parse zero or more operator-expression pairs
            while (state.canConsume(tokens.BinaryOperator)) {
                const operatorToken = state.consume(element as any, CstNodeKind.BinaryExpression_Operator, tokens.BinaryOperator);
                if (operatorToken) {
                    element.operators.push(
                        tokens.BinaryOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx)
                    );
                    element.operatorTokens.push(operatorToken);
                }
                element.items.push(this.primaryExpression.rule(state));
            }

            return constructBinaryExpression(element)!; //TODO check nonnull assertion
        }
    );

    primaryExpression = orRule<ast.Expression>(
        () => this.literal,
        () => this.parenthesizedExpression,
        () => this.unaryExpression,
        () => this.locatorCall,
    );

    parenthesizedExpression = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.Parenthesis | ast.Literal => {
            const element: ast.Parenthesis = {
                kind: ast.SyntaxKind.Parenthesis,
                container: null,
                value: null,
                do: null,
            };

            state.consume(element, CstNodeKind.ParenthesizedExpression_OpenParen, tokens.OpenParen);
            element.value = this.expression.rule(state);

            // Optional DO clause
            if (state.tryConsume(element, CstNodeKind.ParenthesizedExpression_DO, tokens.DO)) {
                element.do = this.doType3.rule(state);
            }

            state.consume(element, CstNodeKind.ParenthesizedExpression_CloseParen, tokens.CloseParen);

            // Optional literal multiplication - this is a special case where parentheses can be followed by a literal
            if (state.canConsumeFirst(this.literalValue.first())) {
                // Replace the parenthesis with a literal that has the parenthesis as its multiplier
                const literal: ast.Literal = {
                    kind: ast.SyntaxKind.Literal,
                    container: null,
                    multiplier: element,
                    value: null,
                };
                literal.value = this.literalValue.rule(state);
                return literal;
            }

            return element;
        }
    );

    memberCall = rule(
        () => this.referenceItem.first(),
        (state: ParserState): ast.MemberCall => {
            let element: ast.MemberCall = {
                kind: ast.SyntaxKind.MemberCall,
                container: null,
                element: null,
                previous: null,
            };

            // Parse first reference item
            element.element = this.referenceItem.rule(state);

            // Parse zero or more dot-separated member accesses
            while (state.tryConsume(element, CstNodeKind.MemberCall_Dot, tokens.Dot)) {
                // Create a new MemberCall for the chain
                const previous = element;
                element = {
                    kind: ast.SyntaxKind.MemberCall,
                    container: null,
                    element: null,
                    previous: previous,
                };

                element.element = this.referenceItem.rule(state);
            }

            return element;
        }
    );

    locatorCall = rule(
        () => this.memberCall.first(),
        (state: ParserState): ast.LocatorCall => {
            let element: ast.LocatorCall = {
                kind: ast.SyntaxKind.LocatorCall,
                container: null,
                element: null,
                previous: null,
                pointer: false,
                handle: false,
            };

            // Parse first member call
            element.element = this.memberCall.rule(state);

            // Parse zero or more pointer/handle chains
            while (!state.eof && (state.canConsume(tokens.MinusGreaterThan) || state.canConsume(tokens.EqualsGreaterThan))) {
                // Create a new LocatorCall for the chain
                const previous = element;
                element = {
                    kind: ast.SyntaxKind.LocatorCall,
                    container: null,
                    element: null,
                    previous: previous,
                    pointer: false,
                    handle: false,
                };

                if (state.tryConsume(element, CstNodeKind.LocatorCall_Pointer, tokens.MinusGreaterThan)) {
                    element.pointer = true;
                } else if (state.tryConsume(element, CstNodeKind.LocatorCall_Handle, tokens.EqualsGreaterThan)) {
                    element.handle = true;
                }

                element.element = this.memberCall.rule(state);
            }

            return element;
        }
    );

    procedureCall = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.ProcedureCall => {
            const element: ast.ProcedureCall = {
                kind: ast.SyntaxKind.ProcedureCall,
                container: null,
                procedure: null,
                args1: null,
                args2: null,
            };

            const idToken = state.consume(element, CstNodeKind.ProcedureCall_ProcedureRef, tokens.ID);
            if (idToken) {
                element.procedure = ast.createReference(
                    element,
                    idToken,
                    ast.ReferenceType.Variable,
                );
            }

            /* //TODO was this correctly translated?
            
            let i = 0;
                // Use MANY to prevent grammar ambiguity
                this.MANY({
                  DEF: () => {
                    this.SUBRULE_ASSIGN(this.ProcedureCallArgs, {
                      assign: (result) => {
                        if (i === 0) {
                          element.args1 = result;
                        } else {
                          element.args2 = result;
                        }
                      },
                    });
                    i++;
                  },
                  // Use a gate to prevent parsing this more than twice
                  GATE: () => i < 2,
                });
            
            */

            // Parse optional argument lists (up to 2)
            let argCount = 0;
            while (argCount < 2 && state.canConsumeFirst(this.procedureCallArgs.first())) {
                const args = this.procedureCallArgs.rule(state);
                if (argCount === 0) {
                    element.args1 = args;
                } else {
                    element.args2 = args;
                }
                argCount++;
            }

            return element;
        }
    );

    procedureCallArgs = rule(
        sequence(tokens.OpenParen),
        (state: ParserState): ast.ProcedureCallArgs => {
            const element: ast.ProcedureCallArgs = {
                kind: ast.SyntaxKind.ProcedureCallArgs,
                container: null,
                list: [],
            };

            state.consume(element, CstNodeKind.ProcedureCallArgs_OpenParen, tokens.OpenParen);

            // Optional argument list
            if (!state.canConsume(tokens.CloseParen)) {
                // Parse first argument (expression or star)
                if (state.canConsume(tokens.Star)) {
                    const starToken = state.consume(element, CstNodeKind.ProcedureCallArgs_Star0, tokens.Star);
                    element.list.push(starToken!.image as "*");
                } else {
                    element.list.push(this.expression.rule(state));
                }

                // Parse additional comma-separated arguments
                while (state.tryConsume(element, CstNodeKind.ProcedureCallArgs_Comma, tokens.Comma)) {
                    if (state.canConsume(tokens.Star)) {
                        const starToken = state.consume(element, CstNodeKind.ProcedureCallArgs_Star1, tokens.Star);
                        element.list.push(starToken!.image as "*");
                    } else {
                        element.list.push(this.expression.rule(state));
                    }
                }
            }

            state.consume(element, CstNodeKind.ProcedureCallArgs_CloseParen, tokens.CloseParen);

            return element;
        }
    );

    labelReference = rule(
        sequence(tokens.ID),
        (state: ParserState): ast.LabelReference => {
            const element: ast.LabelReference = {
                kind: ast.SyntaxKind.LabelReference,
                container: null,
                label: null,
            };

            const idToken = state.consume(element, CstNodeKind.LabelReference_LabelRef, tokens.ID);
            if (idToken) {
                element.label = ast.createReference(
                    element,
                    idToken,
                    ast.ReferenceType.Variable,
                );
            }

            return element;
        }
    );

    unaryExpression = rule(
        sequence(tokens.UnaryOperator),
        (state: ParserState): ast.UnaryExpression => {
            const element: ast.UnaryExpression = {
                kind: ast.SyntaxKind.UnaryExpression,
                container: null,
                op: null,
                expr: null,
            };

            const operatorToken = state.consume(element, CstNodeKind.UnaryExpression_Operator, tokens.UnaryOperator);
            if (operatorToken) {
                element.op = tokens.UnaryOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx);
            }

            element.expr = this.expression.rule(state);

            return element;
        }
    );

    literal = rule(
        () => this.literalValue.first(),
        (state: ParserState): ast.Literal => {
            const element: ast.Literal = {
                kind: ast.SyntaxKind.Literal,
                container: null,
                multiplier: null,
                value: null,
            };

            element.value = this.literalValue.rule(state);

            return element;
        }
    );

    literalValue = orRule<ast.LiteralValue>(
        () => this.stringLiteral,
        () => this.numberLiteral,
    );

    stringLiteral = rule(
        sequence(tokens.STRING_TERM),
        (state: ParserState): ast.StringLiteral => {
            const element: ast.StringLiteral = {
                kind: ast.SyntaxKind.StringLiteral,
                container: null,
                value: null,
            };

            const stringToken = state.consume(element, CstNodeKind.StringLiteral_ValueString, tokens.STRING_TERM);
            if (stringToken) {
                element.value = stringToken.image;
            }

            return element;
        }
    );

    numberLiteral = rule(
        sequence(tokens.NUMBER),
        (state: ParserState): ast.NumberLiteral => {
            const element: ast.NumberLiteral = {
                kind: ast.SyntaxKind.NumberLiteral,
                container: null,
                value: null,
            };

            const numberToken = state.consume(element, CstNodeKind.NumberLiteral_ValueNumber, tokens.NUMBER);
            if (numberToken) {
                element.value = numberToken.image;
            }

            return element;
        }
    );
}

export const HandwrittenParserInstance = new HandwrittenParser();

const expressionTokenTypes = [
    tokens.ID,
    tokens.BinaryOperator,
    tokens.UnaryOperator,
    tokens.AssignmentOperator,
    tokens.STRING_TERM,
    tokens.NUMBER,
    tokens.Comma,
];

export function performAssignmentLookahead(
    lookahead: (la: number) => tokens.Token | undefined,
): boolean {
    let i = 1;
    let token = lookahead(i++);
    // First token of an assigment needs to be an ID
    if (!token || !tokenMatcher(token, tokens.ID)) {
        return false;
    }
    token = lookahead(i++);
    // We have found a match immediately with the assignment operator
    if (token && tokenMatcher(token, tokens.AssignmentOperator)) {
        return true;
    }
    // Otherwise expect an opening parenthesis
    if (!token || !tokenMatcher(token, tokens.OpenParen)) {
        return false;
    }
    // The compiler will not use more than 160 tokens to perform the lookahead
    const max = 160;
    let parenthesis = 1;
    while (i < max) {
        const token = lookahead(i++);
        if (!token) {
            return false;
        }
        if (parenthesis === 0) {
            // If we are outside of the parentheses, we always try to match the assignment operator
            return tokenMatcher(token, tokens.AssignmentOperator);
        }
        if (tokenMatcher(token, tokens.OpenParen)) {
            parenthesis++;
        } else if (tokenMatcher(token, tokens.CloseParen)) {
            parenthesis--;
        } else if (tokenMatcher(token, tokens.Semicolon)) {
            // Semicolon indicates the end of the statement
            return false;
        } else {
            if (
                !expressionTokenTypes.some((tokenType) =>
                    tokenMatcher(token, tokenType),
                )
            ) {
                return false;
            }
            // Continue with the next token, the current token is a valid expression token
        }
    }
    // If we reach this point, the lookahead was not successful
    return false;
}