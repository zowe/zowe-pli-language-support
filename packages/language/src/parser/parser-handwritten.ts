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
            } else if (state.canConsumeFirst(this.firstEnvironmentOption)) {
                element.options.push(this.ruleEnvironmentOption(state));
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

    firstLabelPrefix = [tokens.ID];
    ruleLabelPrefix(state: ParserState): ast.LabelPrefix {
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

    firstEntryStatement = [tokens.ENTRY];
    ruleEntryStatement(state: ParserState): ast.EntryStatement {
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
            if (state.canConsumeFirst(this.firstProcedureParameter)) {
                element.parameters.push(this.ruleProcedureParameter(state));
                while (state.tryConsume(element, CstNodeKind.EntryStatement_Comma, tokens.Comma)) {
                    element.parameters.push(this.ruleProcedureParameter(state));
                }
            }
            state.consume(element, CstNodeKind.EntryStatement_CloseParenParams, tokens.CloseParen);
        }

        // Parse optional attributes (can appear multiple times)
        while (!state.eof && !state.canConsume(tokens.Semicolon)) {
            if (state.canConsumeFirst(this.firstEnvironmentOption)) {
                element.environmentName.push(this.ruleEnvironmentOption(state));
            } else if (state.tryConsume(element, CstNodeKind.EntryStatement_Variable, tokens.VARIABLE)) {
                element.variable.push("VARIABLE");
            } else if (state.tryConsume(element, CstNodeKind.EntryStatement_Limited, tokens.LIMITED)) {
                element.limited.push("LIMITED");
            } else if (state.canConsume(tokens.RETURNS)) {
                element.returns.push(this.ruleReturnsOption(state));
            } else if (state.canConsumeFirst(this.firstOptions)) {
                element.options.push(this.ruleOptions(state));
            } else {
                // TODO: better error message
                throw new Error("Unexpected token in entry statement");
            }
        }

        state.consume(element, CstNodeKind.EntryStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstEnvironmentOption = [tokens.EXTERNAL];
    ruleEnvironmentOption(state: ParserState): ast.EnvironmentOption {
        const element = ast.createEnvironmentOption();
        state.consume(element, CstNodeKind.EntryStatement_EXTERNAL, tokens.EXTERNAL);
        if (state.tryConsume(element, CstNodeKind.EntryStatement_OpenParenEnv, tokens.OpenParen)) {
            element.environment = this.ruleExpression(state);
            state.consume(element, CstNodeKind.EntryStatement_CloseParenEnv, tokens.CloseParen);
        }
        return element;
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

        if (state.canConsumeFirst(this.firstConditionPrefix)) {
            element.condition = this.ruleConditionPrefix(state);
        }

        while (state.canConsumeFirst(this.firstLabelPrefix)) {
            element.labels.push(this.ruleLabelPrefix(state));
        }

        element.value = this.ruleUnit(state);

        return element;
    }

    ruleUnit(state: ParserState): ast.Unit {
        return state.consumeAlternatives<ast.Unit>([
            [this.firstAllocateStatement, this.ruleAllocateStatement],
            [this.firstAssertStatement, this.ruleAssertStatement],
            [this.firstAssignmentStatement, this.ruleAssignmentStatement],
            [this.firstAttachStatement, this.ruleAttachStatement],
            [this.firstBeginStatement, this.ruleBeginStatement],
            [this.firstCallStatement, this.ruleCallStatement],
            [this.firstCancelThreadStatement, this.ruleCancelThreadStatement],
            [this.firstCloseStatement, this.ruleCloseStatement],
            [this.firstDeclareStatement, this.ruleDeclareStatement],
            [this.firstDefaultStatement, this.ruleDefaultStatement],
            [this.firstDefineAliasStatement, this.ruleDefineAliasStatement],
            [this.firstDefineOrdinalStatement, this.ruleDefineOrdinalStatement],
            [this.firstDefineStructureStatement, this.ruleDefineStructureStatement],
            [this.firstDelayStatement, this.ruleDelayStatement],
            [this.firstDeleteStatement, this.ruleDeleteStatement],
            [this.firstDetachStatement, this.ruleDetachStatement],
            [this.firstDisplayStatement, this.ruleDisplayStatement],
            [this.firstDoStatement, this.ruleDoStatement],
            [this.firstEntryStatement, this.ruleEntryStatement],
            [this.firstExecStatement, this.ruleExecStatement],
            [this.firstExitStatement, this.ruleExitStatement],
            [this.firstFetchStatement, this.ruleFetchStatement],
            [this.firstFlushStatement, this.ruleFlushStatement],
            [this.firstFormatStatement, this.ruleFormatStatement],
            [this.firstFreeStatement, this.ruleFreeStatement],
            [this.firstGetStatement, this.ruleGetStatement],
            [this.firstGoToStatement, this.ruleGoToStatement],
            [this.firstIfStatement, this.ruleIfStatement],
            [this.firstIterateStatement, this.ruleIterateStatement],
            [this.firstLeaveStatement, this.ruleLeaveStatement],
            [this.firstLocateStatement, this.ruleLocateStatement],
            [this.firstNullStatement, this.ruleNullStatement],
            [this.firstOnStatement, this.ruleOnStatement],
            [this.firstOpenStatement, this.ruleOpenStatement],
            [this.firstProcincDirective, this.ruleProcincDirective], // TODO integrate into preprocessor
            [this.firstPutStatement, this.rulePutStatement],
            [this.firstQualifyStatement, this.ruleQualifyStatement],
            [this.firstReadStatement, this.ruleReadStatement],
            [this.firstReinitStatement, this.ruleReinitStatement],
            [this.firstReleaseStatement, this.ruleReleaseStatement],
            [this.firstResignalStatement, this.ruleResignalStatement],
            [this.firstReturnStatement, this.ruleReturnStatement],
            [this.firstRevertStatement, this.ruleRevertStatement],
            [this.firstRewriteStatement, this.ruleRewriteStatement],
            [this.firstSelectStatement, this.ruleSelectStatement],
            [this.firstSignalStatement, this.ruleSignalStatement],
            [this.firstStopStatement, this.ruleStopStatement],
            [this.firstWaitStatement, this.ruleWaitStatement],
            [this.firstWriteStatement, this.ruleWriteStatement],
            [this.firstProcedureStatement, this.ruleProcedureStatement],
            [this.firstPackage, this.rulePackage],
        ]);
    }

    firstAllocateStatement = [tokens.ALLOCATE];
    ruleAllocateStatement(state: ParserState): ast.AllocateStatement {
        const element: ast.AllocateStatement = {
            kind: ast.SyntaxKind.AllocateStatement,
            container: null,
            variables: [],
        };
        state.consume(element, CstNodeKind.AllocateStatement_ALLOCATE, tokens.ALLOCATE);
        element.variables.push(this.ruleAllocatedVariable(state));
        while (state.tryConsume(element, CstNodeKind.AllocateStatement_Comma, tokens.Comma)) {
            element.variables.push(this.ruleAllocatedVariable(state));
        }
        state.consume(element, CstNodeKind.AllocateStatement_Semicolon, tokens.Semicolon);
        return element;
    }

    firstAllocatedVariable = [tokens.NUMBER, tokens.ID]; // NUMBER is optional, ID is required for ReferenceItem
    ruleAllocatedVariable(state: ParserState): ast.AllocatedVariable {
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

        element.var = this.ruleReferenceItem(state);

        if (state.canConsumeFirst(this.firstAllocateAttribute)) {
            element.attribute = this.ruleAllocateAttribute(state);
        }

        return element;
    }

    ruleAllocateAttribute(state: ParserState): ast.AllocateAttribute {
        return state.consumeAlternatives<ast.AllocateAttribute>([
            [this.firstAllocateDimension, this.ruleAllocateDimension],
            [this.firstAllocateType, this.ruleAllocateType],
            [this.firstAllocateLocationReferenceIn, this.ruleAllocateLocationReferenceIn],
            [this.firstAllocateLocationReferenceSet, this.ruleAllocateLocationReferenceSet],
            [this.firstInitialAttribute, this.ruleInitialAttribute],
        ]);
    }

    firstAllocateLocationReferenceIn = [tokens.IN];
    ruleAllocateLocationReferenceIn(state: ParserState): ast.AllocateLocationReferenceIn {
        const element: ast.AllocateLocationReferenceIn = {
            kind: ast.SyntaxKind.AllocateLocationReferenceIn,
            container: null,
            area: null,
        };

        state.consume(element, CstNodeKind.AllocateLocationReferenceIn_IN, tokens.IN);
        state.consume(element, CstNodeKind.AllocateLocationReferenceIn_OpenParen, tokens.OpenParen);
        element.area = this.ruleLocatorCall(state);
        state.consume(element, CstNodeKind.AllocateLocationReferenceIn_CloseParen, tokens.CloseParen);

        return element;
    }

    firstAllocateLocationReferenceSet = [tokens.SET];
    ruleAllocateLocationReferenceSet(state: ParserState): ast.AllocateLocationReferenceSet {
        const element: ast.AllocateLocationReferenceSet = {
            kind: ast.SyntaxKind.AllocateLocationReferenceSet,
            container: null,
            locatorVariable: null,
        };

        state.consume(element, CstNodeKind.AllocateLocationReferenceSet_SET, tokens.SET);
        state.consume(element, CstNodeKind.AllocateLocationReferenceSet_OpenParen, tokens.OpenParen);
        element.locatorVariable = this.ruleLocatorCall(state);
        state.consume(element, CstNodeKind.AllocateLocationReferenceSet_CloseParen, tokens.CloseParen);

        return element;
    }

    firstAllocateDimension = [tokens.OpenParen];
    ruleAllocateDimension(state: ParserState): ast.AllocateDimension {
        const element: ast.AllocateDimension = {
            kind: ast.SyntaxKind.AllocateDimension,
            container: null,
            dimensions: null,
        };

        element.dimensions = this.ruleDimensions(state);

        return element;
    }

    firstAllocateType = [tokens.AllocateAttributeType];
    ruleAllocateType(state: ParserState): ast.AllocateType {
        const element: ast.AllocateType = {
            kind: ast.SyntaxKind.AllocateType,
            container: null,
            type: null,
            dimensions: null,
        };

        const typeToken = state.consume(element, CstNodeKind.AllocateAttributeType_Type, tokens.AllocateAttributeType)!;
        element.type = tokens.AllocateAttributeType.mapToEnumLiteral(typeToken.tokenTypeIdx);

        if (state.canConsumeFirst(this.firstDimensions)) {
            element.dimensions = this.ruleDimensions(state);
        }

        return element;
    }

    firstAssertStatement = [tokens.ASSERT];
    ruleAssertStatement(state: ParserState): ast.AssertStatement {
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
            const boolToken = state.consume(element, CstNodeKind.AssertStatement_Boolean, tokens.Boolean)!;
            if (boolToken.image.toUpperCase() === "TRUE") {
                element.true = true;
            } else {
                element.false = true;
            }
            state.consume(element, CstNodeKind.AssertStatement_OpenParen0, tokens.OpenParen);
            element.actual = this.ruleExpression(state);
            state.consume(element, CstNodeKind.AssertStatement_CloseParen0, tokens.CloseParen);
        } else if (state.tryConsume(element, CstNodeKind.AssertStatement_COMPARE, tokens.COMPARE)) {
            element.compare = true;
            state.consume(element, CstNodeKind.AssertStatement_OpenParen1, tokens.OpenParen);
            element.actual = this.ruleExpression(state);
            state.consume(element, CstNodeKind.AssertStatement_Comma0, tokens.Comma);
            element.expected = this.ruleExpression(state);
            if (state.tryConsume(element, CstNodeKind.AssertStatement_Comma1, tokens.Comma)) {
                const operatorToken = state.consume(element, CstNodeKind.AssertStatement_OperatorString, tokens.STRING_TERM)!;
                element.operator = operatorToken.image;
            }
            state.consume(element, CstNodeKind.AssertStatement_CloseParen1, tokens.CloseParen);
        } else if (state.tryConsume(element, CstNodeKind.AssertStatement_UNREACHABLE, tokens.UNREACHABLE)) {
            element.unreachable = true;
        } else {
            // TODO better error message
            throw new Error("Expected ASSERT statement variant");
        }

        if (state.tryConsume(element, CstNodeKind.AssertStatement_TEXT, tokens.TEXT)) {
            element.displayExpression = this.ruleExpression(state);
        }

        return element;
    }

    firstAssignmentStatement = [tokens.ID]; // Assignment statements start with ID (variable reference)
    ruleAssignmentStatement(state: ParserState): ast.AssignmentStatement {
        const element: ast.AssignmentStatement = {
            kind: ast.SyntaxKind.AssignmentStatement,
            container: null,
            refs: [],
            operator: null,
            expression: null,
            dimacrossExpr: null,
        };

        // Parse left-hand side references (comma-separated)
        element.refs.push(this.ruleLocatorCall(state));

        while (state.tryConsume(element, CstNodeKind.AssignmentStatement_Comma0, tokens.Comma)) {
            element.refs.push(this.ruleLocatorCall(state));
        }

        // Parse assignment operator
        const operatorToken = state.consume(element, CstNodeKind.AssignmentStatement_Operator, tokens.AssignmentOperator)!;
        element.operator = tokens.AssignmentOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx);

        // Parse right-hand side expression
        element.expression = this.ruleExpression(state);

        // Optional BY clause
        if (state.tryConsume(element, CstNodeKind.AssignmentStatement_Comma1, tokens.Comma)) {
            state.consume(element, CstNodeKind.AssignmentStatement_BY, tokens.BY);

            if (state.tryConsume(element, CstNodeKind.AssignmentStatement_NAME, tokens.NAME)) {
                // BY NAME variant
            } else if (state.tryConsume(element, CstNodeKind.AssignmentStatement_DIMACROSS, tokens.DIMACROSS)) {
                // BY DIMACROSS variant
                element.dimacrossExpr = this.ruleExpression(state);
            } else {
                throw new Error("Expected NAME or DIMACROSS after BY");
            }
        }

        state.consume(element, CstNodeKind.AssignmentStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstAttachStatement = [tokens.ATTACH];
    ruleAttachStatement(state: ParserState): ast.AttachStatement {
        const element: ast.AttachStatement = {
            kind: ast.SyntaxKind.AttachStatement,
            container: null,
            reference: null,
            task: null,
            environment: false,
            tstack: null,
        };

        state.consume(element, CstNodeKind.AttachStatement_ATTACH, tokens.ATTACH);
        element.reference = this.ruleLocatorCall(state);
        state.consume(element, CstNodeKind.AttachStatement_THREAD, tokens.THREAD);
        state.consume(element, CstNodeKind.AttachStatement_OpenParenTask, tokens.OpenParen);
        element.task = this.ruleLocatorCall(state);
        state.consume(element, CstNodeKind.AttachStatement_CloseParenTask, tokens.CloseParen);

        // Optional ENVIRONMENT clause
        if (state.tryConsume(element, CstNodeKind.AttachStatement_ENVIRONMENT, tokens.ENVIRONMENT)) {
            element.environment = true;
            state.consume(element, CstNodeKind.AttachStatement_OpenParenEnvironment, tokens.OpenParen);
            
            // Optional TSTACK inside ENVIRONMENT
            if (state.tryConsume(element, CstNodeKind.AttachStatement_TSTACK, tokens.TSTACK)) {
                state.consume(element, CstNodeKind.AttachStatement_OpenParenTStack, tokens.OpenParen);
                element.tstack = this.ruleExpression(state);
                state.consume(element, CstNodeKind.AttachStatement_CloseParenTStack, tokens.CloseParen);
            }
            
            state.consume(element, CstNodeKind.AttachStatement_CloseParenEnvironment, tokens.CloseParen);
        }

        state.consume(element, CstNodeKind.AttachStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstBeginStatement = [tokens.BEGIN];
    ruleBeginStatement(state: ParserState): ast.BeginStatement {
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

        if (state.canConsumeFirst(this.firstOptions)) {
            element.options = this.ruleOptions(state);
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
            element.statements.push(this.ruleStatement(state));
        }

        element.end = this.ruleEndStatement(state);
        state.consume(element, CstNodeKind.BeginStatement_Semicolon1, tokens.Semicolon);

        return element;
    }

    firstEndStatement = [tokens.ID, tokens.END]; // Can start with label prefixes or END directly
    ruleEndStatement(state: ParserState): ast.EndStatement {
        const element: ast.EndStatement = {
            kind: ast.SyntaxKind.EndStatement,
            container: null,
            labels: [],
            label: null,
        };

        // Parse optional label prefixes
        while (state.canConsumeFirst(this.firstLabelPrefix)) {
            element.labels.push(this.ruleLabelPrefix(state));
        }

        state.consume(element, CstNodeKind.EndStatement_END, tokens.END);

        // Optional label reference
        if (state.canConsumeFirst(this.firstLabelReference)) {
            element.label = this.ruleLabelReference(state);
        }

        return element;
    }

    firstCallStatement = [tokens.CALL];
    ruleCallStatement(state: ParserState): ast.CallStatement {
        const element: ast.CallStatement = {
            kind: ast.SyntaxKind.CallStatement,
            container: null,
            call: null,
        };
        state.consume(element, CstNodeKind.CallStatement_CALL, tokens.CALL);
        element.call = this.ruleProcedureCall(state);
        state.consume(element, CstNodeKind.CallStatement_Semicolon, tokens.Semicolon);
        return element;
    }

    firstCancelThreadStatement = [tokens.CANCEL];
    ruleCancelThreadStatement(state: ParserState): ast.CancelThreadStatement {
        const element: ast.CancelThreadStatement = {
            kind: ast.SyntaxKind.CancelThreadStatement,
            container: null,
            thread: null,
        };

        state.consume(element, CstNodeKind.CancelThreadStatement_CANCEL, tokens.CANCEL);
        state.consume(element, CstNodeKind.CancelThreadStatement_THREAD, tokens.THREAD);
        state.consume(element, CstNodeKind.CancelThreadStatement_OpenParen, tokens.OpenParen);
        element.thread = this.ruleLocatorCall(state);
        state.consume(element, CstNodeKind.CancelThreadStatement_CloseParen, tokens.CloseParen);
        state.consume(element, CstNodeKind.CancelThreadStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstCloseStatement = [tokens.CLOSE];
    ruleCloseStatement(state: ParserState): ast.CloseStatement {
        const element: ast.CloseStatement = {
            kind: ast.SyntaxKind.CloseStatement,
            container: null,
            files: [],
        };

        state.consume(element, CstNodeKind.CloseStatement_CLOSE, tokens.CLOSE);
        state.consume(element, CstNodeKind.CloseStatement_FILE0, tokens.FILE);
        state.consume(element, CstNodeKind.CloseStatement_OpenParen0, tokens.OpenParen);
        
        // First file - either MemberCall or Star
        if (state.canConsumeFirst(this.firstMemberCall)) {
            element.files.push(this.ruleMemberCall(state));
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
            if (state.canConsumeFirst(this.firstMemberCall)) {
                element.files.push(this.ruleMemberCall(state));
            } else if (state.tryConsume(element, CstNodeKind.CloseStatement_FilesStar1, tokens.Star)) {
                const starToken = state.last;
                element.files.push(starToken!.image as "*");
            } else {
                throw new Error("Expected file reference or '*' in CLOSE statement");
            }
            
            state.consume(element, CstNodeKind.CloseStatement_CloseParen1, tokens.CloseParen);
        }

        state.consume(element, CstNodeKind.CloseStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstDefaultStatement = [tokens.DEFAULT];
    ruleDefaultStatement(state: ParserState): ast.DefaultStatement {
        const element: ast.DefaultStatement = {
            kind: ast.SyntaxKind.DefaultStatement,
            container: null,
            expressions: [],
        };

        state.consume(element, CstNodeKind.DefaultStatement_DEFAULT, tokens.DEFAULT);
        
        element.expressions.push(this.ruleDefaultExpression(state));
        
        while (state.tryConsume(element, CstNodeKind.DefaultStatement_Comma, tokens.Comma)) {
            element.expressions.push(this.ruleDefaultExpression(state));
        }
        
        state.consume(element, CstNodeKind.DefaultStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstDefaultExpression = () => this.firstDefaultExpressionPart;
    ruleDefaultExpression(state: ParserState): ast.DefaultExpression {
        const element: ast.DefaultExpression = {
            kind: ast.SyntaxKind.DefaultExpression,
            container: null,
            expression: null,
            attributes: [],
        };

        element.expression = this.ruleDefaultExpressionPart(state);
        
        while (state.canConsumeFirst(this.firstDefaultDeclarationAttribute)) {
            element.attributes.push(this.ruleDefaultDeclarationAttribute(state));
        }

        return element;
    }

    firstDefaultExpressionPart = [tokens.DESCRIPTORS, tokens.RANGE, tokens.OpenParen];
    ruleDefaultExpressionPart(state: ParserState): ast.DefaultExpressionPart {
        const element: ast.DefaultExpressionPart = {
            kind: ast.SyntaxKind.DefaultExpressionPart,
            container: null,
            expression: null,
            identifiers: null,
        };

        if (state.canConsume(tokens.DESCRIPTORS)) {
            // DESCRIPTORS variant
            state.consume(element, CstNodeKind.DefaultExpressionPart_DESCRIPTORS, tokens.DESCRIPTORS);
            element.expression = this.ruleDefaultAttributeExpression(state);
        } else if (state.canConsume(tokens.RANGE)) {
            // RANGE variant
            state.consume(element, CstNodeKind.DefaultExpressionPart_RANGE, tokens.RANGE);
            state.consume(element, CstNodeKind.DefaultExpressionPart_OpenParenRange, tokens.OpenParen);
            element.identifiers = this.ruleDefaultRangeIdentifiers(state);
            state.consume(element, CstNodeKind.DefaultExpressionPart_CloseParenRange, tokens.CloseParen);
        } else if (state.canConsume(tokens.OpenParen)) {
            // Parenthesized attribute expression variant
            state.consume(element, CstNodeKind.DefaultExpressionPart_OpenParenAttribute, tokens.OpenParen);
            element.expression = this.ruleDefaultAttributeExpression(state);
            state.consume(element, CstNodeKind.DefaultExpressionPart_CloseParenAttribute, tokens.CloseParen);
        } else {
            //TODO better error message
            throw new Error("Expected DESCRIPTORS, RANGE, or parenthesized expression in DefaultExpressionPart");
        }

        return element;
    }

    firstDefaultRangeIdentifiers = [tokens.Star, tokens.ID];
    ruleDefaultRangeIdentifiers(state: ParserState): ast.DefaultRangeIdentifiers {
        const element: ast.DefaultRangeIdentifiers = {
            kind: ast.SyntaxKind.DefaultRangeIdentifiers,
            container: null,
            identifiers: [],
        };

        // Parse first identifier (Star or DefaultRangeIdentifierItem)
        if (state.canConsume(tokens.Star)) {
            const starToken = state.consume(element, CstNodeKind.DefaultRangeIdentifiers_Star0, tokens.Star)!;
            element.identifiers.push(starToken.image as "*");
        } else {
            element.identifiers.push(this.ruleDefaultRangeIdentifierItem(state));
        }

        // Parse additional comma-separated identifiers
        while (state.tryConsume(element, CstNodeKind.DefaultRangeIdentifiers_Comma, tokens.Comma)) {
            if (state.canConsume(tokens.Star)) {
                const starToken = state.consume(element, CstNodeKind.DefaultRangeIdentifiers_Star1, tokens.Star)!;
                element.identifiers.push(starToken.image as "*");
            } else {
                element.identifiers.push(this.ruleDefaultRangeIdentifierItem(state));
            }
        }

        return element;
    }

    firstDefaultRangeIdentifierItem = [tokens.ID];
    ruleDefaultRangeIdentifierItem(state: ParserState): ast.DefaultRangeIdentifierItem {
        const element: ast.DefaultRangeIdentifierItem = {
            kind: ast.SyntaxKind.DefaultRangeIdentifierItem,
            container: null,
            from: null,
            to: null,
        };

        const fromToken = state.consume(element, CstNodeKind.DefaultRangeIdentifierItem_FromID, tokens.ID)!;
        element.from = fromToken.image;

        if (state.tryConsume(element, CstNodeKind.DefaultRangeIdentifierItem_Colon, tokens.Colon)) {
            const toToken = state.consume(element, CstNodeKind.DefaultRangeIdentifierItem_ToID, tokens.ID)!;
            element.to = toToken.image;
        }

        return element;
    }

    firstDefaultAttributeExpression = () => this.firstDefaultAttributeExpressionNot;
    ruleDefaultAttributeExpression(state: ParserState): ast.DefaultAttributeExpression {
        const element: ast.DefaultAttributeExpression = {
            kind: ast.SyntaxKind.DefaultAttributeExpression,
            container: null,
            items: [],
            operators: [],
        };

        // Parse first DefaultAttributeExpressionNot
        element.items.push(this.ruleDefaultAttributeExpressionNot(state));

        // Parse optional binary operator and second operand
        if (state.canConsume(tokens.DefaultAttributeBinaryOperator)) {
            const operatorToken = state.consume(element, CstNodeKind.DefaultAttributeExpression_Operators, tokens.DefaultAttributeBinaryOperator)!;
            element.operators.push(tokens.DefaultAttributeBinaryOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx));
            element.items.push(this.ruleDefaultAttributeExpressionNot(state));
        }

        return element;
    }

    firstDefaultAttributeExpressionNot = [tokens.NOT, tokens.DefaultAttribute];
    ruleDefaultAttributeExpressionNot(state: ParserState): ast.DefaultAttributeExpressionNot {
        const element: ast.DefaultAttributeExpressionNot = {
            kind: ast.SyntaxKind.DefaultAttributeExpressionNot,
            container: null,
            not: false,
            value: null,
        };

        if (state.tryConsume(element, CstNodeKind.DefaultAttributeExpressionNot_NOT, tokens.NOT)) {
            element.not = true;
        }

        const attributeToken = state.consume(element, CstNodeKind.DefaultAttribute_Value, tokens.DefaultAttribute)!;
        element.value = tokens.DefaultAttribute.mapToEnumLiteral(attributeToken.tokenTypeIdx);

        return element;
    }

    firstDefineAliasStatement = [tokens.DEFINE];
    ruleDefineAliasStatement(state: ParserState): ast.DefineAliasStatement {
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
        if(nameToken) {
            element.name = nameToken.image;
            element.nameToken = nameToken;
        }
        
        if(state.canConsumeFirst(this.firstDeclarationAttribute)) {
            element.attributes.push(this.ruleDeclarationAttribute(state));
        }
        
        state.consume(element, CstNodeKind.DefineAliasStatement_Semicolon, tokens.Semicolon);

        return element;
    }

    firstDefineOrdinalStatement = [tokens.DEFINE];
    ruleDefineOrdinalStatement(state: ParserState): ast.DefineOrdinalStatement {
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
        if(nameToken) {
            element.name = nameToken.image;
            element.nameToken = nameToken;
        }
        
        state.consume(element, CstNodeKind.DefineOrdinalStatement_OpenParenValues, tokens.OpenParen);
        element.ordinalValues = this.ruleOrdinalValues(state);
        state.consume(element, CstNodeKind.DefineOrdinalStatement_CloseParenValues, tokens.CloseParen);

        while (!state.canConsume(tokens.Semicolon)) {
            if(state.tryConsume(element, CstNodeKind.DefineOrdinalStatement_Signed0, tokens.SIGNED)) {
                element.attributes.push(ast.DefineOrdinalAttribute.SIGNED);
            } else if(state.tryConsume(element, CstNodeKind.DefineOrdinalStatement_Unsigned0, tokens.UNSIGNED)) {
                element.attributes.push(ast.DefineOrdinalAttribute.UNSIGNED);
            } else if(state.tryConsume(element, CstNodeKind.DefineOrdinalStatement_PRECISION, tokens.PRECISION)) {
                element.attributes.push(ast.DefineOrdinalAttribute.PRECISION);
                state.consume(element, CstNodeKind.DefineOrdinalStatement_OpenParenPrecision, tokens.OpenParen);
                const precisionNumberToken = state.consume(element, CstNodeKind.DefineOrdinalStatement_PrecisionNumber, tokens.NUMBER);
                if(precisionNumberToken) {
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

}

export const HandwrittenParserInstance = new HandwrittenParser();
