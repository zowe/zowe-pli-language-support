/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import {
  choice,
  ExpressionParameter,
  orRule,
  rule,
  RuleFirstPair,
  sequence,
  throwHasManualLookahead,
} from "./parser-types";
import * as ast from "../syntax-tree/ast";
import { tokenMatcher } from "chevrotain";
import { ParserState, RecoveryResult } from "./parser-state";
import * as tokens from "./tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import {
  constructBinaryExpression,
  IntermediateBinaryExpression,
} from "./binary-expressions";
import { Severe, Warning } from "../validation/pli-codes";
import { Diagnostic, Severity } from "../language-server/types";
import {
  hasEndStatementLookahead,
  performAssignmentLookahead,
  performEndStatementLookahead,
} from "./parser-lookahead";
import { Token } from "./tokens";
import { CompilerOptions } from "../preprocessor/compiler-options/options";

export function parsePli(
  input: tokens.Token[],
  compilerOptions?: CompilerOptions,
): {
  tree: ast.Program;
  diagnostics: Diagnostic[];
} {
  const state = new ParserState(input, compilerOptions);
  const program = pliProgram.rule(state);
  const tree = program ?? ast.createProgram();
  return { tree, diagnostics: state.diagnostics };
}

const pliProgram = rule(
  () => statement.first(),
  (state: ParserState): ast.Program => {
    const program = ast.createProgram();
    // Parse one or more packages (or top-level statements)
    const { inc } = state.createLoopContext("PliProgram");
    while (!state.eof) {
      inc();
      const stmt = statement.rule(state);
      stmt && program.statements.push(stmt);
    }
    return program;
  },
);

const packageRule = rule(
  sequence(tokens.PACKAGE),
  (state: ParserState): ast.Package => {
    const element = ast.createPackage();
    state.consume(element, CstNodeKind.Package_PACKAGE, tokens.PACKAGE);
    if (state.canConsumeFirst(exports.first())) {
      element.exports = exports.rule(state);
    }
    if (state.canConsumeFirst(reserves.first())) {
      element.reserves = reserves.rule(state);
    }
    if (state.canConsumeFirst(options.first())) {
      element.options = options.rule(state);
    }
    state.consume(element, CstNodeKind.Package_Semicolon, tokens.Semicolon);
    const { inc } = state.createLoopContext("Package");
    while (!state.eof && !hasEndStatementLookahead(state)) {
      inc();
      const stmt = statement.rule(state);
      stmt && element.statements.push(stmt);
    }
    // END statement for PACKAGE is always optional
    element.end = parseMulticloseEnd(state, true);
    return element;
  },
);

const conditionPrefix = rule(
  sequence(tokens.OpenParen),
  (state: ParserState): ast.ConditionPrefix => {
    const element = ast.createConditionPrefix();

    const { inc } = state.createLoopContext("ConditionPrefix");
    do {
      inc();
      state.consume(
        element,
        CstNodeKind.ConditionPrefix_OpenParen,
        tokens.OpenParen,
      );
      const item = conditionPrefixItem.rule(state);
      item && element.items.push(item);
      state.consume(
        element,
        CstNodeKind.ConditionPrefix_CloseParen,
        tokens.CloseParen,
      );
      state.consume(element, CstNodeKind.ConditionPrefix_Colon, tokens.Colon);
    } while (state.canConsume(tokens.OpenParen));

    return element;
  },
);

const conditionPrefixItem = rule(
  () => condition.first(),
  (state: ParserState): ast.ConditionPrefixItem => {
    const element = ast.createConditionPrefixItem();

    const lhs = condition.rule(state);
    lhs && element.conditions.push(lhs);
    const { inc } = state.createLoopContext("ConditionPrefixItem");
    while (state.canConsume(tokens.Comma)) {
      inc();
      state.consume(
        element,
        CstNodeKind.ConditionPrefixItem_Comma,
        tokens.Comma,
      );
      const rhs = condition.rule(state);
      rhs && element.conditions.push(rhs);
    }

    return element;
  },
);

const exportsItem = rule(
  sequence(tokens.ID),
  (state: ParserState): ast.ExportsItem => {
    const element = ast.createExportsItem();
    const token = state.consume(
      element,
      CstNodeKind.Exports_Procedure,
      tokens.ID,
    );
    if (token) {
      element.reference = ast.createReference(
        element,
        token,
        ast.ReferenceType.Variable,
      );
    }
    return element;
  },
);

const exports = rule(
  sequence(tokens.EXPORTS),
  (state: ParserState): ast.Exports => {
    const element = ast.createExports();

    state.consume(element, CstNodeKind.Exports_EXPORTS, tokens.EXPORTS);
    state.consume(element, CstNodeKind.Exports_OpenParen, tokens.OpenParen);

    if (state.tryConsume(element, CstNodeKind.Exports_AllStar, tokens.Star)) {
      element.all = true;
    } else {
      const lhs = exportsItem.rule(state);
      lhs && element.procedures.push(lhs);
      const { inc } = state.createLoopContext("Exports");
      while (
        state.tryConsume(element, CstNodeKind.Exports_Comma, tokens.Comma)
      ) {
        inc();
        const rhs = exportsItem.rule(state);
        rhs && element.procedures.push(rhs);
      }
    }

    state.consume(element, CstNodeKind.Exports_CloseParen, tokens.CloseParen);
    return element;
  },
);

const reserves = rule(
  sequence(tokens.RESERVES),
  (state: ParserState): ast.Reserves => {
    const element = ast.createReserves();

    state.consume(element, CstNodeKind.Reserves_RESERVES, tokens.RESERVES);
    state.consume(element, CstNodeKind.Reserves_OpenParen, tokens.OpenParen);

    if (state.tryConsume(element, CstNodeKind.Reserves_AllStar, tokens.Star)) {
      element.all = true;
    } else {
      const varToken = state.consume(
        element,
        CstNodeKind.Reserves_Variables0,
        tokens.ID,
      );
      if (varToken) {
        element.variables.push(varToken.image);
      }
      const { inc } = state.createLoopContext("Reserves");
      while (
        state.tryConsume(element, CstNodeKind.Reserves_Comma, tokens.Comma)
      ) {
        inc();
        const nextVarToken = state.consume(
          element,
          CstNodeKind.Reserves_Variables1,
          tokens.ID,
        );
        if (nextVarToken) {
          element.variables.push(nextVarToken.image);
        }
      }
    }

    state.consume(element, CstNodeKind.Reserves_CloseParen, tokens.CloseParen);
    return element;
  },
);

const options = rule(
  sequence(tokens.OPTIONS),
  (state: ParserState): ast.Options => {
    const element = ast.createOptions();
    state.consume(element, CstNodeKind.Options_OPTIONS, tokens.OPTIONS);
    state.consume(element, CstNodeKind.Options_OpenParen, tokens.OpenParen);
    const lhs = optionsItem.rule(state);
    lhs && element.items.push(lhs);
    const { inc } = state.createLoopContext("Options");
    while (
      state.canConsume(tokens.Comma) ||
      state.canConsumeFirst(optionsItem.first())
    ) {
      inc();
      state.tryConsume(element, CstNodeKind.Options_Comma, tokens.Comma);
      const rhs = optionsItem.rule(state);
      rhs && element.items.push(rhs);
    }
    state.consume(element, CstNodeKind.Options_CloseParen, tokens.CloseParen);

    return element;
  },
);

const optionsItem = orRule<ast.OptionsItem, []>(
  () => simpleOptionsItem,
  () => linkageOptionsItem,
  () => CMPATOptionsItem,
  () => noMapOptionsItem,
);

const simpleOptionsItem = rule(
  sequence(tokens.SimpleOptions),
  (state: ParserState): ast.SimpleOptionsItem => {
    const element = ast.createSimpleOptionsItem();
    const token = state.consume(
      element,
      CstNodeKind.SimpleOptionsItem_Value,
      tokens.SimpleOptions,
    );
    if (token) {
      element.value = tokens.SimpleOptions.mapToEnumLiteral(token.tokenTypeIdx);
    }
    return element;
  },
);

const linkageOptionsItem = rule(
  sequence(tokens.LINKAGE),
  (state: ParserState): ast.LinkageOptionsItem => {
    const element = ast.createLinkageOptionsItem();
    state.consume(
      element,
      CstNodeKind.LinkageOptionsItem_Linkage,
      tokens.LINKAGE,
    );
    state.consume(
      element,
      CstNodeKind.LinkageOptionsItem_OpenParen,
      tokens.OpenParen,
    );
    const valueToken = state.consume(
      element,
      CstNodeKind.LinkageOptionsItem_Value,
      tokens.LinkageOption,
    );
    if (valueToken) {
      element.value = tokens.LinkageOption.mapToEnumLiteral(
        valueToken.tokenTypeIdx,
      );
    }
    state.consume(
      element,
      CstNodeKind.LinkageOptionsItem_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const CMPATOptionsItem = rule(
  sequence(tokens.CMPAT),
  (state: ParserState): ast.CMPATOptionsItem => {
    const element = ast.createCMPATOptionsItem();
    state.consume(element, CstNodeKind.CMPATOptionsItem_CMPAT, tokens.CMPAT);
    state.consume(
      element,
      CstNodeKind.CMPATOptionsItem_OpenParen,
      tokens.OpenParen,
    );
    const vxToken = state.consume(
      element,
      CstNodeKind.CMPATOptionsItem_Value,
      tokens.VX,
    );
    if (vxToken) {
      element.value = tokens.VX.mapToEnumLiteral(vxToken.tokenTypeIdx);
    }
    state.consume(
      element,
      CstNodeKind.CMPATOptionsItem_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const noMapOptionsItem = rule(
  sequence(tokens.NoMapOption),
  (state: ParserState): ast.NoMapOptionsItem => {
    const element = ast.createNoMapOptionsItem();
    const typeToken = state.consume(
      element,
      CstNodeKind.NoMapOptionsItem_Type,
      tokens.NoMapOption,
    );
    if (typeToken) {
      element.type = tokens.NoMapOption.mapToEnumLiteral(
        typeToken.tokenTypeIdx,
      );
    }

    if (
      state.tryConsume(
        element,
        CstNodeKind.NoMapOptionsItem_OpenParen,
        tokens.OpenParen,
      )
    ) {
      const idToken = state.consume(
        element,
        CstNodeKind.NoMapOptionsItem_Parameters0,
        tokens.ID,
      );
      if (idToken) {
        element.parameters.push(idToken.image);
      }
      const { inc } = state.createLoopContext("NoMapOptionsItem");
      while (
        state.tryConsume(
          element,
          CstNodeKind.NoMapOptionsItem_Comma,
          tokens.Comma,
        )
      ) {
        inc();
        const nextIdToken = state.consume(
          element,
          CstNodeKind.NoMapOptionsItem_Parameters1,
          tokens.ID,
        );
        if (nextIdToken) {
          element.parameters.push(nextIdToken.image);
        }
      }
      state.consume(
        element,
        CstNodeKind.NoMapOptionsItem_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const procedureStatement = rule(
  sequence(tokens.PROCEDURE),
  (state: ParserState): ast.ProcedureStatement => {
    const element = ast.createProcedureStatement();
    const procToken = state.consume(
      element,
      CstNodeKind.ProcedureStatement_PROCEDURE,
      tokens.PROCEDURE,
    );
    element.procToken = procToken;
    element.xProc = procToken?.image[0].toUpperCase() === "X";

    if (
      state.tryConsume(
        element,
        CstNodeKind.ProcedureStatement_OpenParenParams,
        tokens.OpenParen,
      )
    ) {
      if (state.canConsumeFirst(procedureParameter.first())) {
        const lhs = procedureParameter.rule(state);
        lhs && element.parameters.push(lhs);
        const { inc } = state.createLoopContext("ProcedureStatement 1");
        while (
          state.tryConsume(
            element,
            CstNodeKind.ProcedureStatement_Comma,
            tokens.Comma,
          )
        ) {
          inc();
          const rhs = procedureParameter.rule(state);
          rhs && element.parameters.push(rhs);
        }
      }
      state.consume(
        element,
        CstNodeKind.ProcedureStatement_CloseParenParams,
        tokens.CloseParen,
      );
    }

    const { inc } = state.createLoopContext("ProcedureStatement 2");
    while (
      !state.eof &&
      (state.canConsume(tokens.RETURNS) ||
        state.canConsumeFirst(options.first()) ||
        state.canConsume(tokens.RECURSIVE) ||
        state.canConsume(tokens.ProcedureOrder) ||
        state.canConsumeFirst(environmentOption.first()) ||
        state.canConsume(tokens.ScopeAttribute))
    ) {
      inc();
      if (state.canConsume(tokens.RETURNS)) {
        const option = returnsOption.rule(state);
        option && element.options.push(option);
      } else if (state.canConsumeFirst(options.first())) {
        const opts = options.rule(state);
        opts && element.options.push(opts);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.ProcedureStatement_Recursive,
          tokens.RECURSIVE,
        )
      ) {
        element.options.push({
          kind: ast.SyntaxKind.ProcedureRecursiveOption,
          container: null,
        });
      } else if (state.canConsume(tokens.ProcedureOrder)) {
        const token = state.consume(
          element,
          CstNodeKind.ProcedureStatement_Order,
          tokens.ProcedureOrder,
        );
        if (token) {
          const order = ast.createProcedureOrderOption();
          order.order = tokens.ProcedureOrder.mapToEnumLiteral(
            token.tokenTypeIdx,
          );
          element.options.push(order);
        }
      } else if (state.canConsumeFirst(environmentOption.first())) {
        const option = environmentOption.rule(state);
        option && element.options.push(option);
      } else if (state.canConsume(tokens.ScopeAttribute)) {
        const scopeToken = state.consume(
          element,
          CstNodeKind.ScopeAttribute_Scope,
          tokens.ScopeAttribute,
        );
        if (scopeToken) {
          const scope = ast.createProcedureScopeOption();
          scope.scope = tokens.ScopeAttribute.mapToEnumLiteral(
            scopeToken.tokenTypeIdx,
          );
          element.options.push(scope);
        }
      }
    }
    state.consume(
      element,
      CstNodeKind.ProcedureStatement_Semicolon,
      tokens.Semicolon,
    );

    const { inc: inc3 } = state.createLoopContext("ProcedureStatement 3");
    while (!state.eof && !hasEndStatementLookahead(state)) {
      inc3();
      const stmt = statement.rule(state);
      stmt && element.statements.push(stmt);
    }
    element.end = parseMulticloseEnd(state);
    return element;
  },
);

const labelPrefix = rule(
  sequence(tokens.ID, tokens.Colon),
  (state: ParserState): ast.LabelPrefix => {
    const element = ast.createLabelPrefix();
    const idToken = state.consume(
      element,
      CstNodeKind.LabelPrefix_Name,
      tokens.ID,
    );
    if (idToken) {
      element.name = idToken.image;
      element.nameToken = idToken;
    }
    state.consume(element, CstNodeKind.LabelPrefix_Colon, tokens.Colon);
    return element;
  },
);

const entryStatement = rule(
  sequence(tokens.ENTRY),
  (state: ParserState): ast.EntryStatement => {
    const element = ast.createEntryStatement();
    state.consume(element, CstNodeKind.EntryStatement_ENTRY, tokens.ENTRY);
    if (
      state.tryConsume(
        element,
        CstNodeKind.EntryStatement_OpenParenParams,
        tokens.OpenParen,
      )
    ) {
      if (state.canConsumeFirst(procedureParameter.first())) {
        const lhs = procedureParameter.rule(state);
        lhs && element.parameters.push(lhs);
        const { inc } = state.createLoopContext("EntryStatement 1");
        while (
          state.tryConsume(
            element,
            CstNodeKind.EntryStatement_Comma,
            tokens.Comma,
          )
        ) {
          inc();
          const rhs = procedureParameter.rule(state);
          rhs && element.parameters.push(rhs);
        }
      }
      state.consume(
        element,
        CstNodeKind.EntryStatement_CloseParenParams,
        tokens.CloseParen,
      );
    }

    // Parse optional attributes (can appear multiple times)
    const { inc } = state.createLoopContext("EntryStatement 2");
    while (
      !state.eof &&
      (state.canConsumeFirst(environmentOption.first()) ||
        state.canConsume(tokens.VARIABLE) ||
        state.canConsume(tokens.LIMITED) ||
        state.canConsume(tokens.RETURNS) ||
        state.canConsumeFirst(options.first()))
    ) {
      inc();
      if (state.canConsumeFirst(environmentOption.first())) {
        const option = environmentOption.rule(state);
        option && element.environmentName.push(option);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.EntryStatement_Variable,
          tokens.VARIABLE,
        )
      ) {
        element.variable.push("VARIABLE");
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.EntryStatement_Limited,
          tokens.LIMITED,
        )
      ) {
        element.limited.push("LIMITED");
      } else if (state.canConsumeFirst(returnsOption.first())) {
        const option = returnsOption.rule(state);
        option && element.returns.push(option);
      } else if (state.canConsumeFirst(options.first())) {
        const opts = options.rule(state);
        opts && element.options.push(opts);
      }
    }

    state.consume(
      element,
      CstNodeKind.EntryStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const environmentOption = rule(
  sequence(tokens.EXTERNAL),
  (state: ParserState): ast.EnvironmentOption => {
    const element = ast.createEnvironmentOption();
    state.consume(
      element,
      CstNodeKind.EntryStatement_EXTERNAL,
      tokens.EXTERNAL,
    );
    if (
      state.tryConsume(
        element,
        CstNodeKind.EntryStatement_OpenParenEnv,
        tokens.OpenParen,
      )
    ) {
      element.environment = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.EntryStatement_CloseParenEnv,
        tokens.CloseParen,
      );
    }
    return element;
  },
);

const statement = rule(
  choice(
    () => conditionPrefix.first(),
    () => unit.first(),
    //commented out, because performAssignmentLookahead is used instead of LL(1) lookahead
    //() => labelPrefix.first(),
    //() => assignmentStatement.first(),
  ),
  (state: ParserState): ast.Statement => {
    const element = ast.createStatement();

    element.startToken = state.token ?? null;

    if (state.canConsumeFirst(conditionPrefix.first())) {
      element.condition = conditionPrefix.rule(state);
    }

    const { inc } = state.createLoopContext("Statement");
    while (state.canConsumeFirst(labelPrefix.first())) {
      inc();
      const label = labelPrefix.rule(state);
      label && element.labels.push(label);
    }

    // Store labels in state so compound statements can access them
    const previousLabels = state.currentStatementLabels;
    state.currentStatementLabels = element.labels;

    if (performAssignmentLookahead(state)) {
      element.value = assignmentStatement.rule(state);
    } else {
      element.value = unit.rule(state);
    }

    // Restore previous labels
    state.currentStatementLabels = previousLabels;

    element.endToken = state.last ?? null;

    state.recover(() => performRecovery(state));

    return element;
  },
);

function performRecovery(state: ParserState): RecoveryResult {
  const token = state.token;
  if (!token) {
    return RecoveryResult.Continue;
  }
  if (tokenMatcher(state.token, tokens.Semicolon)) {
    return RecoveryResult.RecoverNext;
  } else if (
    state.canConsumeFirst(statement.first()) ||
    performAssignmentLookahead(state)
  ) {
    return RecoveryResult.Recover;
  }
  return RecoveryResult.Continue;
}

const unit = orRule<ast.Unit, []>(
  () => allocateStatement,
  () => assertStatement,
  () => attachStatement,
  () => beginStatement,
  () => callStatement,
  () => cancelThreadStatement,
  () => closeStatement,
  () => declareStatement,
  () => defaultStatement,
  () => defineAliasStatement,
  () => defineOrdinalStatement,
  () => defineStructureStatement,
  () => delayStatement,
  () => deleteStatement,
  () => detachStatement,
  () => displayStatement,
  () => doStatement,
  () => entryStatement,
  () => exitStatement,
  () => fetchStatement,
  () => flushStatement,
  () => formatStatement,
  () => freeStatement,
  () => getStatement,
  () => goToStatement,
  () => ifStatement,
  () => iterateStatement,
  () => leaveStatement,
  () => locateStatement,
  () => nullStatement,
  () => onStatement,
  () => openStatement,
  () => putStatement,
  () => qualifyStatement,
  () => readStatement,
  () => reinitStatement,
  () => releaseStatement,
  () => resignalStatement,
  () => returnStatement,
  () => revertStatement,
  () => rewriteStatement,
  () => selectStatement,
  () => signalStatement,
  () => stopStatement,
  () => waitStatement,
  () => writeStatement,
  () => procedureStatement,
  () => packageRule,
  () => execVariableReference,
);

const allocateStatement = rule(
  sequence(tokens.ALLOCATE),
  (state: ParserState): ast.AllocateStatement => {
    const element = ast.createAllocateStatement();
    state.consume(
      element,
      CstNodeKind.AllocateStatement_ALLOCATE,
      tokens.ALLOCATE,
    );
    const lhs = allocatedVariable.rule(state);
    lhs && element.variables.push(lhs);
    const { inc } = state.createLoopContext("AllocateStatement");
    while (
      state.tryConsume(
        element,
        CstNodeKind.AllocateStatement_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = allocatedVariable.rule(state);
      rhs && element.variables.push(rhs);
    }
    state.consume(
      element,
      CstNodeKind.AllocateStatement_Semicolon,
      tokens.Semicolon,
    );
    return element;
  },
);

const allocatedVariable = rule(
  choice(sequence(tokens.NUMBER), () => referenceItem.first()),
  (state: ParserState): ast.AllocatedVariable => {
    const element = ast.createAllocatedVariable();

    const levelToken = state.tryConsume(
      element,
      CstNodeKind.AllocatedVariable_LevelNumber,
      tokens.NUMBER,
    );
    if (levelToken) {
      element.level = levelToken.image;
    }

    element.var = referenceItem.rule(state, ast.ReferenceType.Variable);

    const { inc } = state.createLoopContext("AllocatedVariable");
    while (state.canConsumeFirst(allocateAttribute.first())) {
      inc();
      const attribute = allocateAttribute.rule(state);
      if (attribute) {
        element.attributes.push(attribute);
      }
    }

    return element;
  },
);

const allocateAttribute = orRule<ast.AllocateAttribute, []>(
  () => allocateDimension,
  () => allocateType,
  () => allocateLocationReferenceIn,
  () => allocateLocationReferenceSet,
  () => initialAttribute,
);

const allocateLocationReferenceIn = rule(
  sequence(tokens.IN),
  (state: ParserState): ast.AllocateLocationReferenceIn => {
    const element = ast.createAllocateLocationReferenceIn();

    state.consume(
      element,
      CstNodeKind.AllocateLocationReferenceIn_IN,
      tokens.IN,
    );
    state.consume(
      element,
      CstNodeKind.AllocateLocationReferenceIn_OpenParen,
      tokens.OpenParen,
    );
    element.area = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.AllocateLocationReferenceIn_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const allocateLocationReferenceSet = rule(
  sequence(tokens.SET),
  (state: ParserState): ast.AllocateLocationReferenceSet => {
    const element = ast.createAllocateLocationReferenceSet();
    state.consume(
      element,
      CstNodeKind.AllocateLocationReferenceSet_SET,
      tokens.SET,
    );
    state.consume(
      element,
      CstNodeKind.AllocateLocationReferenceSet_OpenParen,
      tokens.OpenParen,
    );
    element.locatorVariable = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.AllocateLocationReferenceSet_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const allocateDimension = rule(
  () => dimensions.first(),
  (state: ParserState): ast.AllocateDimension => {
    const element = ast.createAllocateDimension();
    element.dimensions = dimensions.rule(state);

    return element;
  },
);

const allocateType = rule(
  sequence(tokens.AllocateAttributeType),
  (state: ParserState): ast.AllocateType => {
    const element = ast.createAllocateType();

    const typeToken = state.consume(
      element,
      CstNodeKind.AllocateAttributeType_Type,
      tokens.AllocateAttributeType,
    );
    if (typeToken) {
      element.type = tokens.AllocateAttributeType.mapToEnumLiteral(
        typeToken.tokenTypeIdx,
      );
    }

    if (state.canConsumeFirst(dimensions.first())) {
      element.dimensions = dimensions.rule(state);
    }

    return element;
  },
);

const assertStatement = rule(
  sequence(tokens.ASSERT),
  (state: ParserState): ast.AssertStatement => {
    const element = ast.createAssertStatement();

    state.consume(element, CstNodeKind.AssertStatement_ASSERT, tokens.ASSERT);

    if (state.canConsume(tokens.BooleanType)) {
      const boolToken = state.consume(
        element,
        CstNodeKind.AssertStatement_Boolean,
        tokens.BooleanType,
      );
      if (boolToken) {
        if (boolToken.image.toUpperCase() === "TRUE") {
          element.true = true;
        } else {
          element.false = true;
        }
      }
      state.consume(
        element,
        CstNodeKind.AssertStatement_OpenParen0,
        tokens.OpenParen,
      );
      element.actual = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.AssertStatement_CloseParen0,
        tokens.CloseParen,
      );
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.AssertStatement_COMPARE,
        tokens.COMPARE,
      )
    ) {
      element.compare = true;
      state.consume(
        element,
        CstNodeKind.AssertStatement_OpenParen1,
        tokens.OpenParen,
      );
      element.actual = expression.rule(state);
      state.consume(element, CstNodeKind.AssertStatement_Comma0, tokens.Comma);
      element.expected = expression.rule(state);
      if (
        state.tryConsume(
          element,
          CstNodeKind.AssertStatement_Comma1,
          tokens.Comma,
        )
      ) {
        const operatorToken = state.consume(
          element,
          CstNodeKind.AssertStatement_OperatorString,
          tokens.STRING_TERM,
        );
        if (operatorToken) {
          element.operator = operatorToken.image;
        }
      }
      state.consume(
        element,
        CstNodeKind.AssertStatement_CloseParen1,
        tokens.CloseParen,
      );
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.AssertStatement_UNREACHABLE,
        tokens.UNREACHABLE,
      )
    ) {
      element.unreachable = true;
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
    }

    if (
      state.tryConsume(element, CstNodeKind.AssertStatement_TEXT, tokens.TEXT)
    ) {
      element.displayExpression = expression.rule(state);
    }

    return element;
  },
);

const assignmentStatement = rule(
  () => locatorCall.first(),
  (state: ParserState): ast.AssignmentStatement => {
    const element = ast.createAssignmentStatement();

    // Parse left-hand side references (comma-separated)
    const lhs = locatorCall.rule(state);
    lhs && element.refs.push(lhs);
    const { inc } = state.createLoopContext("AssignmentStatement");
    while (
      state.tryConsume(
        element,
        CstNodeKind.AssignmentStatement_Comma0,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = locatorCall.rule(state);
      rhs && element.refs.push(rhs);
    }

    // Parse assignment operator
    const operatorToken = state.consume(
      element,
      CstNodeKind.AssignmentStatement_Operator,
      tokens.AssignmentOperator,
    );
    if (operatorToken) {
      element.operator = tokens.AssignmentOperator.mapToEnumLiteral(
        operatorToken.tokenTypeIdx,
      );
    }

    // Parse right-hand side expression
    element.expression = expression.rule(state);

    // Optional BY clause
    if (
      state.tryConsume(
        element,
        CstNodeKind.AssignmentStatement_Comma1,
        tokens.Comma,
      )
    ) {
      state.consume(element, CstNodeKind.AssignmentStatement_BY, tokens.BY);

      if (
        state.tryConsume(
          element,
          CstNodeKind.AssignmentStatement_NAME,
          tokens.NAME,
        )
      ) {
        // BY NAME variant
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.AssignmentStatement_DIMACROSS,
          tokens.DIMACROSS,
        )
      ) {
        // BY DIMACROSS variant
        element.dimacrossExpr = expression.rule(state);
      } else {
        state.error(Severe.IBM3988I.message, state.token, Severity.S);
        return element;
      }
    }

    state.consume(
      element,
      CstNodeKind.AssignmentStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const attachStatement = rule(
  sequence(tokens.ATTACH),
  (state: ParserState): ast.AttachStatement => {
    const element = ast.createAttachStatement();

    state.consume(element, CstNodeKind.AttachStatement_ATTACH, tokens.ATTACH);
    element.reference = locatorCall.rule(state);
    state.consume(element, CstNodeKind.AttachStatement_THREAD, tokens.THREAD);
    state.consume(
      element,
      CstNodeKind.AttachStatement_OpenParenTask,
      tokens.OpenParen,
    );
    element.task = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.AttachStatement_CloseParenTask,
      tokens.CloseParen,
    );

    // Optional ENVIRONMENT clause
    if (
      state.tryConsume(
        element,
        CstNodeKind.AttachStatement_ENVIRONMENT,
        tokens.ENVIRONMENT,
      )
    ) {
      element.environment = true;
      state.consume(
        element,
        CstNodeKind.AttachStatement_OpenParenEnvironment,
        tokens.OpenParen,
      );

      // Optional TSTACK inside ENVIRONMENT
      if (
        state.tryConsume(
          element,
          CstNodeKind.AttachStatement_TSTACK,
          tokens.TSTACK,
        )
      ) {
        state.consume(
          element,
          CstNodeKind.AttachStatement_OpenParenTStack,
          tokens.OpenParen,
        );
        element.tstack = expression.rule(state);
        state.consume(
          element,
          CstNodeKind.AttachStatement_CloseParenTStack,
          tokens.CloseParen,
        );
      }

      state.consume(
        element,
        CstNodeKind.AttachStatement_CloseParenEnvironment,
        tokens.CloseParen,
      );
    }

    state.consume(
      element,
      CstNodeKind.AttachStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const beginStatement = rule(
  sequence(tokens.BEGIN),
  (state: ParserState): ast.BeginStatement => {
    const element = ast.createBeginStatement();

    state.consume(element, CstNodeKind.BeginStatement_BEGIN, tokens.BEGIN);
    if (state.canConsumeFirst(options.first())) {
      element.options = options.rule(state);
    }

    if (
      state.tryConsume(
        element,
        CstNodeKind.BeginStatement_RECURSIVE,
        tokens.RECURSIVE,
      )
    ) {
      element.recursive = true;
    }

    if (
      state.tryConsume(element, CstNodeKind.BeginStatement_ORDER, tokens.ORDER)
    ) {
      const orderToken = state.last;
      if (orderToken!.image.toUpperCase() === "ORDER") {
        element.order = true;
      } else if (orderToken!.image.toUpperCase() === "REORDER") {
        element.reorder = true;
      }
    }

    state.consume(
      element,
      CstNodeKind.BeginStatement_Semicolon,
      tokens.Semicolon,
    );
    const { inc } = state.createLoopContext("BeginStatement");
    while (!state.eof && !hasEndStatementLookahead(state)) {
      inc();
      const stmt = statement.rule(state);
      stmt && element.statements.push(stmt);
    }

    element.end = parseMulticloseEnd(state);

    return element;
  },
);

const endStatement = rule(
  throwHasManualLookahead,
  (state: ParserState): ast.EndStatement => {
    const element = ast.createEndStatement();

    // Parse optional label prefixes
    const { inc } = state.createLoopContext("EndStatement");
    while (state.canConsumeFirst(labelPrefix.first())) {
      inc();
      const prefix = labelPrefix.rule(state);
      prefix && element.labels.push(prefix);
    }

    element.endToken = state.consume(
      element,
      CstNodeKind.EndStatement_END,
      tokens.END,
    );

    // Optional label reference
    if (state.canConsumeFirst(labelReference.first())) {
      element.label = labelReference.rule(state);
    }

    element.semicolon = state.consume(
      element,
      CstNodeKind.EndStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

/**
 * Parses an END statement with RULES(MULTICLOSE) and label-matching logic.
 *
 * With RULES(MULTICLOSE) (or alwaysOptional=true):
 * - Unlabeled END: Consumed by first (innermost) compound statement that sees it
 * - Labeled END: Only consumed if label matches one of the current statement's labels
 * - If END exists but doesn't match, it's left for outer scope
 *
 * With RULES(NOMULTICLOSE) (and alwaysOptional=false):
 * - END is required - parsing error reported if missing
 *
 * @param state Parser state
 * @param alwaysOptional If true, END is always optional regardless of MULTICLOSE setting (for PACKAGE)
 * @returns EndStatement if END is present/required, null if optional and not present/matching
 */
function parseMulticloseEnd(
  state: ParserState,
  alwaysOptional: boolean = false,
): ast.EndStatement | null {
  const endInfo = performEndStatementLookahead(state);

  if (alwaysOptional) {
    // PACKAGE: END is truly optional (can be omitted entirely)
    if (endInfo.endStatement === false) {
      return null;
    }
    // END present for PACKAGE - always consume it
    return endStatement.rule(state);
  }

  if (state.isEndOptional()) {
    // MULTICLOSE mode: END can skip levels via labels, but must exist somewhere
    if (endInfo.endStatement === false) {
      // No END found (at EOF) - ERROR even with MULTICLOSE
      return endStatement.rule(state); // Will generate parser error
    }

    // END found - check if label matches this statement
    if (state.endLabelMatches(endInfo.endStatement)) {
      // Label matches (or unlabeled END for innermost) - consume it
      return endStatement.rule(state);
    } else {
      // Label doesn't match - leave END for outer scope to consume
      // This is a multiclose - emit warning on the END token
      if (endInfo.endTokenIndex !== undefined) {
        const endToken = state.peek(endInfo.endTokenIndex);
        if (endToken) {
          state.diagnostic(Warning.IBM1120I, endToken);
        }
      }
      return null;
    }
  } else {
    // NOMULTICLOSE: END is required for each compound
    return endStatement.rule(state);
  }
}

const callStatement = rule(
  sequence(tokens.CALL),
  (state: ParserState): ast.CallStatement => {
    const element = ast.createCallStatement();
    state.consume(element, CstNodeKind.CallStatement_CALL, tokens.CALL);
    element.call = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.CallStatement_Semicolon,
      tokens.Semicolon,
    );
    return element;
  },
);

const cancelThreadStatement = rule(
  sequence(tokens.CANCEL),
  (state: ParserState): ast.CancelThreadStatement => {
    const element = ast.createCancelThreadStatement();

    state.consume(
      element,
      CstNodeKind.CancelThreadStatement_CANCEL,
      tokens.CANCEL,
    );
    state.consume(
      element,
      CstNodeKind.CancelThreadStatement_THREAD,
      tokens.THREAD,
    );
    state.consume(
      element,
      CstNodeKind.CancelThreadStatement_OpenParen,
      tokens.OpenParen,
    );
    element.thread = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.CancelThreadStatement_CloseParen,
      tokens.CloseParen,
    );
    state.consume(
      element,
      CstNodeKind.CancelThreadStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const closeStatement = rule(
  sequence(tokens.CLOSE),
  (state: ParserState): ast.CloseStatement => {
    const element = ast.createCloseStatement();

    state.consume(element, CstNodeKind.CloseStatement_CLOSE, tokens.CLOSE);
    state.consume(element, CstNodeKind.CloseStatement_FILE0, tokens.FILE);
    state.consume(
      element,
      CstNodeKind.CloseStatement_OpenParen0,
      tokens.OpenParen,
    );

    // First file - either MemberCall or Star
    if (state.canConsumeFirst(memberCall.first())) {
      const call = memberCall.rule(state);
      call && element.files.push(call);
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.CloseStatement_FilesStar0,
        tokens.Star,
      )
    ) {
      element.files.push("*");
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    state.consume(
      element,
      CstNodeKind.CloseStatement_CloseParen0,
      tokens.CloseParen,
    );

    // Additional files (can have optional commas)
    const { inc } = state.createLoopContext("CloseStatement");
    while (state.canConsume(tokens.FILE) || state.canConsume(tokens.Comma)) {
      inc();
      // Optional comma before additional file
      state.tryConsume(element, CstNodeKind.CloseStatement_Comma, tokens.Comma);

      state.consume(element, CstNodeKind.CloseStatement_FILE1, tokens.FILE);
      state.consume(
        element,
        CstNodeKind.CloseStatement_OpenParen,
        tokens.OpenParen,
      );

      // File reference - either MemberCall or Star
      if (state.canConsumeFirst(memberCall.first())) {
        const call = memberCall.rule(state);
        call && element.files.push(call);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.CloseStatement_FilesStar1,
          tokens.Star,
        )
      ) {
        element.files.push("*");
      } else {
        state.error(Severe.IBM3988I.message, state.token, Severity.S);
        return element;
      }

      state.consume(
        element,
        CstNodeKind.CloseStatement_CloseParen1,
        tokens.CloseParen,
      );
    }

    state.consume(
      element,
      CstNodeKind.CloseStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const defaultStatement = rule(
  sequence(tokens.DEFAULT),
  (state: ParserState): ast.DefaultStatement => {
    const element = ast.createDefaultStatement();

    state.consume(
      element,
      CstNodeKind.DefaultStatement_DEFAULT,
      tokens.DEFAULT,
    );

    const lhs = defaultExpression.rule(state);
    lhs && element.expressions.push(lhs);

    const { inc } = state.createLoopContext("DefaultStatement");
    while (
      state.tryConsume(
        element,
        CstNodeKind.DefaultStatement_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = defaultExpression.rule(state);
      rhs && element.expressions.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.DefaultStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const defaultExpression = rule(
  () => defaultExpressionPart.first(),
  (state: ParserState): ast.DefaultExpression => {
    const element = ast.createDefaultExpression();

    element.expression = defaultExpressionPart.rule(state);

    const { inc } = state.createLoopContext("DefaultExpression");
    while (state.canConsumeFirst(defaultDeclarationAttribute.first())) {
      inc();
      const attr = defaultDeclarationAttribute.rule(state);
      attr && element.attributes.push(attr);
    }

    return element;
  },
);

const defaultExpressionPart = rule(
  choice(
    sequence(tokens.DESCRIPTORS),
    sequence(tokens.RANGE),
    sequence(tokens.OpenParen),
  ),
  (state: ParserState): ast.DefaultExpressionPart => {
    const element = ast.createDefaultExpressionPart();

    if (state.canConsume(tokens.DESCRIPTORS)) {
      // DESCRIPTORS variant
      state.consume(
        element,
        CstNodeKind.DefaultExpressionPart_DESCRIPTORS,
        tokens.DESCRIPTORS,
      );
      element.expression = defaultAttributeExpression.rule(state);
    } else if (state.canConsume(tokens.RANGE)) {
      // RANGE variant
      state.consume(
        element,
        CstNodeKind.DefaultExpressionPart_RANGE,
        tokens.RANGE,
      );
      state.consume(
        element,
        CstNodeKind.DefaultExpressionPart_OpenParenRange,
        tokens.OpenParen,
      );
      element.identifiers = defaultRangeIdentifiers.rule(state);
      state.consume(
        element,
        CstNodeKind.DefaultExpressionPart_CloseParenRange,
        tokens.CloseParen,
      );
    } else if (state.canConsume(tokens.OpenParen)) {
      // Parenthesized attribute expression variant
      state.consume(
        element,
        CstNodeKind.DefaultExpressionPart_OpenParenAttribute,
        tokens.OpenParen,
      );
      element.expression = defaultAttributeExpression.rule(state);
      state.consume(
        element,
        CstNodeKind.DefaultExpressionPart_CloseParenAttribute,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    return element;
  },
);

const defaultRangeIdentifiers = rule(
  choice(sequence(tokens.Star), () => defaultRangeIdentifierItem.first()),
  (state: ParserState): ast.DefaultRangeIdentifiers => {
    const element = ast.createDefaultRangeIdentifiers();

    // Parse first identifier (Star or DefaultRangeIdentifierItem)
    if (state.canConsume(tokens.Star)) {
      const starToken = state.consume(
        element,
        CstNodeKind.DefaultRangeIdentifiers_Star0,
        tokens.Star,
      );
      if (starToken) {
        element.identifiers.push("*");
      }
    } else {
      const item = defaultRangeIdentifierItem.rule(state);
      item && element.identifiers.push(item);
    }

    // Parse additional comma-separated identifiers
    const { inc } = state.createLoopContext("DefaultRangeIdentifiers");
    while (
      state.tryConsume(
        element,
        CstNodeKind.DefaultRangeIdentifiers_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      if (state.canConsume(tokens.Star)) {
        const starToken = state.consume(
          element,
          CstNodeKind.DefaultRangeIdentifiers_Star1,
          tokens.Star,
        );
        if (starToken) {
          element.identifiers.push("*");
        }
      } else {
        const item = defaultRangeIdentifierItem.rule(state);
        item && element.identifiers.push(item);
      }
    }

    return element;
  },
);

const defaultRangeIdentifierItem = rule(
  sequence(tokens.ID),
  (state: ParserState): ast.DefaultRangeIdentifierItem => {
    const element = ast.createDefaultRangeIdentifierItem();

    const fromToken = state.consume(
      element,
      CstNodeKind.DefaultRangeIdentifierItem_FromID,
      tokens.ID,
    );
    if (fromToken) {
      element.from = fromToken.image;
    }

    if (
      state.tryConsume(
        element,
        CstNodeKind.DefaultRangeIdentifierItem_Colon,
        tokens.Colon,
      )
    ) {
      const toToken = state.consume(
        element,
        CstNodeKind.DefaultRangeIdentifierItem_ToID,
        tokens.ID,
      );
      if (toToken) {
        element.to = toToken.image;
      }
    }

    return element;
  },
);

const defaultAttributeExpression = rule(
  () => defaultAttributeExpressionNot.first(),
  (state: ParserState): ast.DefaultAttributeExpression => {
    const element = ast.createDefaultAttributeExpression();

    // Parse first DefaultAttributeExpressionNot
    const lhs = defaultAttributeExpressionNot.rule(state);
    lhs && element.items.push(lhs);

    // Parse optional binary operator and second operand
    if (state.canConsume(tokens.DefaultAttributeBinaryOperator)) {
      const operatorToken = state.consume(
        element,
        CstNodeKind.DefaultAttributeExpression_Operators,
        tokens.DefaultAttributeBinaryOperator,
      );
      if (operatorToken) {
        element.operators.push(
          tokens.DefaultAttributeBinaryOperator.mapToEnumLiteral(
            operatorToken.tokenTypeIdx,
          ),
        );
      }
      const rhs = defaultAttributeExpressionNot.rule(state);
      rhs && element.items.push(rhs);
    }

    return element;
  },
);

const defaultAttributeExpressionNot = rule(
  choice(sequence(tokens.NOT), sequence(tokens.DefaultAttribute)),
  (state: ParserState): ast.DefaultAttributeExpressionNot => {
    const element = ast.createDefaultAttributeExpressionNot();

    if (
      state.tryConsume(
        element,
        CstNodeKind.DefaultAttributeExpressionNot_NOT,
        tokens.NOT,
      )
    ) {
      element.not = true;
    }

    const attributeToken = state.consume(
      element,
      CstNodeKind.DefaultAttribute_Value,
      tokens.DefaultAttribute,
    );
    if (attributeToken) {
      element.value = tokens.DefaultAttribute.mapToEnumLiteral(
        attributeToken.tokenTypeIdx,
      );
    }

    return element;
  },
);

const defineAliasStatement = rule(
  sequence(tokens.DEFINE, tokens.ALIAS),
  (state: ParserState): ast.DefineAliasStatement => {
    const element = ast.createDefineAliasStatement();

    const defineToken = state.consume(
      element,
      CstNodeKind.DefineAliasStatement_DEFINE,
      tokens.DEFINE,
    );
    if (defineToken?.image.charAt(0).toUpperCase() === "X") {
      element.xDefine = true;
    }
    state.consume(
      element,
      CstNodeKind.DefineAliasStatement_ALIAS,
      tokens.ALIAS,
    );

    const nameToken = state.consume(
      element,
      CstNodeKind.DefineAliasStatement_Name,
      tokens.ID,
    );
    if (nameToken) {
      element.name = nameToken.image;
      element.nameToken = nameToken;
    }

    if (state.canConsumeFirst(declarationAttribute.first())) {
      const lhs = declarationAttribute.rule(state);
      lhs && element.attributes.push(lhs);
      const { inc } = state.createLoopContext("DefineAliasStatement");
      while (
        state.canConsume(tokens.Comma) ||
        state.canConsumeFirst(declarationAttribute.first())
      ) {
        inc();
        state.tryConsume(
          element,
          CstNodeKind.DefineAliasStatement_Comma,
          tokens.Comma,
        );
        const rhs = declarationAttribute.rule(state);
        rhs && element.attributes.push(rhs);
      }
    }

    state.consume(
      element,
      CstNodeKind.DefineAliasStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const defineOrdinalStatement = rule(
  sequence(tokens.DEFINE, tokens.ORDINAL),
  (state: ParserState): ast.DefineOrdinalStatement => {
    const element = ast.createDefineOrdinalStatement();

    const defineToken = state.consume(
      element,
      CstNodeKind.DefineOrdinalStatement_DEFINE,
      tokens.DEFINE,
    );
    element.startToken = defineToken ?? null;
    if (defineToken?.image.charAt(0).toUpperCase() === "X") {
      element.xDefine = true;
    }
    state.consume(
      element,
      CstNodeKind.DefineOrdinalStatement_ORDINAL,
      tokens.ORDINAL,
    );

    const nameToken = state.consume(
      element,
      CstNodeKind.DefineOrdinalStatement_Name,
      tokens.ID,
    );
    if (nameToken) {
      element.name = nameToken.image;
      element.nameToken = nameToken;
    }

    state.consume(
      element,
      CstNodeKind.DefineOrdinalStatement_OpenParenValues,
      tokens.OpenParen,
    );
    element.ordinalValues = ordinalValueList.rule(state);
    state.consume(
      element,
      CstNodeKind.DefineOrdinalStatement_CloseParenValues,
      tokens.CloseParen,
    );

    const { inc } = state.createLoopContext("DefineOrdinalStatement");
    while (
      state.canConsume(tokens.SIGNED) ||
      state.canConsume(tokens.UNSIGNED) ||
      state.canConsume(tokens.PRECISION)
    ) {
      inc();
      if (
        state.tryConsume(
          element,
          CstNodeKind.DefineOrdinalStatement_Signed0,
          tokens.SIGNED,
        )
      ) {
        element.attributes.push(ast.DefineOrdinalAttribute.SIGNED);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.DefineOrdinalStatement_Unsigned0,
          tokens.UNSIGNED,
        )
      ) {
        element.attributes.push(ast.DefineOrdinalAttribute.UNSIGNED);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.DefineOrdinalStatement_PRECISION,
          tokens.PRECISION,
        )
      ) {
        element.attributes.push(ast.DefineOrdinalAttribute.PRECISION);
        state.consume(
          element,
          CstNodeKind.DefineOrdinalStatement_OpenParenPrecision,
          tokens.OpenParen,
        );
        const precisionNumberToken = state.consume(
          element,
          CstNodeKind.DefineOrdinalStatement_PrecisionNumber,
          tokens.NUMBER,
        );
        if (precisionNumberToken) {
          element.precision = precisionNumberToken.image;
        }
        state.consume(
          element,
          CstNodeKind.DefineOrdinalStatement_CloseParenPrecision,
          tokens.CloseParen,
        );
      }
    }

    element.endToken = state.consume(
      element,
      CstNodeKind.DefineOrdinalStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const ordinalValueList = rule(
  () => ordinalValue.first(),
  (state: ParserState): ast.OrdinalValueList => {
    const element = ast.createOrdinalValueList();

    const lhs = ordinalValue.rule(state);
    lhs && element.members.push(lhs);
    const { inc } = state.createLoopContext("OrdinalValueList");
    while (
      state.tryConsume(
        element,
        CstNodeKind.OrdinalValueList_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = ordinalValue.rule(state);
      rhs && element.members.push(rhs);
    }

    return element;
  },
);

const ordinalValue = rule(
  sequence(tokens.ID),
  (state: ParserState): ast.OrdinalValue => {
    const element = ast.createOrdinalValue();

    const idToken = state.consume(
      element,
      CstNodeKind.OrdinalValue_Name,
      tokens.ID,
    );
    if (idToken) {
      element.name = idToken.image;
      element.nameToken = idToken;
    }

    if (
      state.tryConsume(element, CstNodeKind.OrdinalValue_VALUE, tokens.VALUE)
    ) {
      state.consume(
        element,
        CstNodeKind.OrdinalValue_OpenParen,
        tokens.OpenParen,
      );
      element.value = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.OrdinalValue_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const defineStructureStatement = rule(
  sequence(tokens.DEFINE, tokens.STRUCTURE),
  (state: ParserState): ast.DefineStructureStatement => {
    const element = ast.createDefineStructureStatement();

    const defineToken = state.consume(
      element,
      CstNodeKind.DefineStructureStatement_DEFINE,
      tokens.DEFINE,
    );
    if (defineToken?.image.charAt(0).toUpperCase() === "X") {
      element.xDefine = true;
    }

    state.consume(
      element,
      CstNodeKind.DefineStructureStatement_STRUCTURE,
      tokens.STRUCTURE,
    );

    const lhs = declaredItem.rule(state);
    lhs && element.items.push(lhs);

    const { inc } = state.createLoopContext("DefineStructureStatement");
    while (
      state.tryConsume(
        element,
        CstNodeKind.DefineStructureStatement_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = declaredItem.rule(state);
      rhs && element.items.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.DefineStructureStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const delayStatement = rule(
  sequence(tokens.DELAY),
  (state: ParserState): ast.DelayStatement => {
    const element = ast.createDelayStatement();

    state.consume(element, CstNodeKind.DelayStatement_DELAY, tokens.DELAY);
    state.consume(
      element,
      CstNodeKind.DelayStatement_OpenParen,
      tokens.OpenParen,
    );
    element.delay = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.DelayStatement_CloseParen,
      tokens.CloseParen,
    );
    state.consume(
      element,
      CstNodeKind.DelayStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const deleteStatement = rule(
  sequence(tokens.DELETE),
  (state: ParserState): ast.DeleteStatement => {
    const element = ast.createDeleteStatement();

    state.consume(element, CstNodeKind.DeleteStatement_DELETE, tokens.DELETE);
    state.consume(element, CstNodeKind.DeleteStatement_FILE, tokens.FILE);
    state.consume(
      element,
      CstNodeKind.DeleteStatement_OpenParenFile,
      tokens.OpenParen,
    );
    element.file = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.DeleteStatement_CloseParenFile,
      tokens.CloseParen,
    );

    // Optional KEY clause
    if (
      state.tryConsume(element, CstNodeKind.DeleteStatement_KEY, tokens.KEY)
    ) {
      state.consume(
        element,
        CstNodeKind.DeleteStatement_OpenParenKey,
        tokens.OpenParen,
      );
      element.key = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.DeleteStatement_CloseParenKey,
        tokens.CloseParen,
      );
    }

    state.consume(
      element,
      CstNodeKind.DeleteStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const detachStatement = rule(
  sequence(tokens.DETACH),
  (state: ParserState): ast.DetachStatement => {
    const element = ast.createDetachStatement();

    state.consume(element, CstNodeKind.DetachStatement_DETACH, tokens.DETACH);
    state.consume(element, CstNodeKind.DetachStatement_THREAD, tokens.THREAD);
    state.consume(
      element,
      CstNodeKind.DetachStatement_OpenParen,
      tokens.OpenParen,
    );
    element.reference = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.DetachStatement_CloseParen,
      tokens.CloseParen,
    );
    state.consume(
      element,
      CstNodeKind.DetachStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const displayStatement = rule(
  sequence(tokens.DISPLAY),
  (state: ParserState): ast.DisplayStatement => {
    const element = ast.createDisplayStatement();

    state.consume(
      element,
      CstNodeKind.DisplayStatement_DISPLAY,
      tokens.DISPLAY,
    );
    state.consume(
      element,
      CstNodeKind.DisplayStatement_OpenParenExpression,
      tokens.OpenParen,
    );
    element.expression = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.DisplayStatement_CloseParenExpression,
      tokens.CloseParen,
    );

    // Optional REPLY clause
    if (
      state.tryConsume(
        element,
        CstNodeKind.DisplayStatement_REPLY,
        tokens.REPLY,
      )
    ) {
      state.consume(
        element,
        CstNodeKind.DisplayStatement_OpenParenReply,
        tokens.OpenParen,
      );
      element.reply = locatorCall.rule(state);
      state.consume(
        element,
        CstNodeKind.DisplayStatement_CloseParenReply,
        tokens.CloseParen,
      );
    }

    // Optional ROUTCDE clause
    if (
      state.tryConsume(
        element,
        CstNodeKind.DisplayStatement_ROUTCDE,
        tokens.ROUTCDE,
      )
    ) {
      state.consume(
        element,
        CstNodeKind.DisplayStatement_OpenParenRout,
        tokens.OpenParen,
      );

      const routToken = state.consume(
        element,
        CstNodeKind.DisplayStatement_RoutNumber0,
        tokens.NUMBER,
      );
      if (routToken) {
        element.rout.push(routToken.image);
      }

      const { inc } = state.createLoopContext("DisplayStatement 1");
      while (
        state.tryConsume(
          element,
          CstNodeKind.DisplayStatement_CommaRout,
          tokens.Comma,
        )
      ) {
        inc();
        const nextRoutToken = state.consume(
          element,
          CstNodeKind.DisplayStatement_RoutNumber1,
          tokens.NUMBER,
        );
        if (nextRoutToken) {
          element.rout.push(nextRoutToken.image);
        }
      }

      state.consume(
        element,
        CstNodeKind.DisplayStatement_CloseParenRout,
        tokens.CloseParen,
      );

      // Optional DESC clause (only if ROUTCDE is present)
      if (
        state.tryConsume(
          element,
          CstNodeKind.DisplayStatement_DESC,
          tokens.DESC,
        )
      ) {
        state.consume(
          element,
          CstNodeKind.DisplayStatement_OpenParenDesc,
          tokens.OpenParen,
        );

        const descToken = state.consume(
          element,
          CstNodeKind.DisplayStatement_DescNumber0,
          tokens.NUMBER,
        );
        if (descToken) {
          element.desc.push(descToken.image);
        }

        const { inc } = state.createLoopContext("DisplayStatement 2");
        while (
          state.tryConsume(
            element,
            CstNodeKind.DisplayStatement_CommaDesc,
            tokens.Comma,
          )
        ) {
          inc();
          const nextDescToken = state.consume(
            element,
            CstNodeKind.DisplayStatement_DescNumber1,
            tokens.NUMBER,
          );
          if (nextDescToken) {
            element.desc.push(nextDescToken.image);
          }
        }

        state.consume(
          element,
          CstNodeKind.DisplayStatement_CloseParenDesc,
          tokens.CloseParen,
        );
      }
    }

    state.consume(
      element,
      CstNodeKind.DisplayStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const doStatement = rule(
  sequence(tokens.DO),
  (state: ParserState): ast.DoStatement => {
    const element = ast.createDoStatement();

    const doToken = state.consume(
      element,
      CstNodeKind.DoStatement_DO,
      tokens.DO,
    );
    element.doToken = doToken;

    // Optional DO type specification
    if (
      state.canConsumeFirst(doType2.first()) ||
      state.canConsumeFirst(doType3.first()) ||
      state.canConsume(tokens.LOOP)
    ) {
      if (state.canConsumeFirst(doType2.first())) {
        element.doType2 = doType2.rule(state);
      } else if (
        state.tryConsume(element, CstNodeKind.DoStatement_LOOP, tokens.LOOP)
      ) {
        element.doType4 = true;
      } else if (state.canConsumeFirst(doType3.first())) {
        element.doType3 = doType3.rule(state);
      }
    }

    state.consume(element, CstNodeKind.DoStatement_Semicolon, tokens.Semicolon);

    // Parse statements until END
    const { inc } = state.createLoopContext("DoStatement");
    while (!state.eof && !hasEndStatementLookahead(state)) {
      inc();
      const stmt = statement.rule(state);
      stmt && element.statements.push(stmt);
    }

    element.end = parseMulticloseEnd(state);

    return element;
  },
);

const doType2 = orRule<ast.DoType2, []>(
  () => doWhile,
  () => doUntil,
);

const doWhile = rule(
  sequence(tokens.WHILE),
  (state: ParserState): ast.DoWhile => {
    const element = ast.createDoWhile();

    state.consume(element, CstNodeKind.DoWhile_WHILE, tokens.WHILE);
    state.consume(
      element,
      CstNodeKind.DoWhile_OpenParenWhile,
      tokens.OpenParen,
    );
    element.while = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.DoWhile_CloseParenWhile,
      tokens.CloseParen,
    );

    // Optional UNTIL clause
    if (state.tryConsume(element, CstNodeKind.DoWhile_UNTIL, tokens.UNTIL)) {
      state.consume(
        element,
        CstNodeKind.DoWhile_OpenParenUntil,
        tokens.OpenParen,
      );
      element.until = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.DoWhile_CloseParenUntil,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const doUntil = rule(
  sequence(tokens.UNTIL),
  (state: ParserState): ast.DoUntil => {
    const element = ast.createDoUntil();

    state.consume(element, CstNodeKind.DoUntil_UNTIL, tokens.UNTIL);
    state.consume(
      element,
      CstNodeKind.DoUntil_OpenParenUntil,
      tokens.OpenParen,
    );
    element.until = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.DoUntil_CloseParenUntil,
      tokens.CloseParen,
    );

    // Optional WHILE clause
    if (state.tryConsume(element, CstNodeKind.DoUntil_WHILE, tokens.WHILE)) {
      state.consume(
        element,
        CstNodeKind.DoUntil_OpenParenWhile,
        tokens.OpenParen,
      );
      element.while = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.DoUntil_CloseParenWhile,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const doType3 = rule(
  () => memberCall.first(),
  (state: ParserState): ast.DoType3 => {
    const element = ast.createDoType3();

    element.variable = memberCall.rule(state);
    state.consume(element, CstNodeKind.DoType3_Equals, tokens.Equals);

    const lhs = doSpecification.rule(state);
    lhs && element.specifications.push(lhs);

    const { inc } = state.createLoopContext("DoType3");
    while (state.tryConsume(element, CstNodeKind.DoType3_Comma, tokens.Comma)) {
      inc();
      const rhs = doSpecification.rule(state);
      rhs && element.specifications.push(rhs);
    }

    return element;
  },
);

const doSpecification = rule(
  () => expression.first(),
  (state: ParserState): ast.DoSpecification => {
    const element = ast.createDoSpecification();

    element.expression = expression.rule(state);

    // Optional TO/BY/UPTHRU/DOWNTHRU/REPEAT clause
    if (
      state.canConsume(tokens.TO) ||
      state.canConsume(tokens.BY) ||
      state.canConsume(tokens.UPTHRU) ||
      state.canConsume(tokens.DOWNTHRU) ||
      state.canConsume(tokens.REPEAT)
    ) {
      if (state.canConsume(tokens.TO)) {
        state.consume(element, CstNodeKind.DoSpecification_TO0, tokens.TO);
        element.to = expression.rule(state);

        if (
          state.tryConsume(element, CstNodeKind.DoSpecification_BY0, tokens.BY)
        ) {
          element.by = expression.rule(state);
        }
      } else if (state.canConsume(tokens.BY)) {
        state.consume(element, CstNodeKind.DoSpecification_BY1, tokens.BY);
        element.by = expression.rule(state);

        if (
          state.tryConsume(element, CstNodeKind.DoSpecification_TO1, tokens.TO)
        ) {
          element.to = expression.rule(state);
        }
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.DoSpecification_UPTHRU,
          tokens.UPTHRU,
        )
      ) {
        element.upthru = expression.rule(state);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.DoSpecification_DOWNTHRU,
          tokens.DOWNTHRU,
        )
      ) {
        element.downthru = expression.rule(state);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.DoSpecification_REPEAT,
          tokens.REPEAT,
        )
      ) {
        element.repeat = expression.rule(state);
      }
    }

    // Optional WHILE or UNTIL clause
    if (
      state.canConsumeFirst(doWhile.first()) ||
      state.canConsumeFirst(doUntil.first())
    ) {
      if (state.canConsumeFirst(doWhile.first())) {
        element.whileOrUntil = doWhile.rule(state);
      } else {
        element.whileOrUntil = doUntil.rule(state);
      }
    }

    return element;
  },
);

const exitStatement = rule(
  sequence(tokens.EXIT),
  (state: ParserState): ast.ExitStatement => {
    const element = ast.createExitStatement();
    state.consume(element, CstNodeKind.ExitStatement_EXIT, tokens.EXIT);
    state.consume(
      element,
      CstNodeKind.ExitStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const fetchStatement = rule(
  sequence(tokens.FETCH),
  (state: ParserState): ast.FetchStatement => {
    const element = ast.createFetchStatement();

    state.consume(element, CstNodeKind.FetchStatement_FETCH, tokens.FETCH);
    const lhs = fetchEntry.rule(state);
    lhs && element.entries.push(lhs);

    const { inc } = state.createLoopContext("FetchStatement");
    while (
      state.tryConsume(element, CstNodeKind.FetchStatement_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = fetchEntry.rule(state);
      rhs && element.entries.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.FetchStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const fetchEntry = rule(
  () => referenceItem.first(),
  (state: ParserState): ast.FetchEntry => {
    const element = ast.createFetchEntry();

    element.entry = referenceItem.rule(state);

    // Optional SET clause
    if (state.tryConsume(element, CstNodeKind.FetchEntry_SET, tokens.SET)) {
      state.consume(
        element,
        CstNodeKind.FetchEntry_OpenParenSet,
        tokens.OpenParen,
      );
      element.set = locatorCall.rule(state);
      state.consume(
        element,
        CstNodeKind.FetchEntry_CloseParenSet,
        tokens.CloseParen,
      );
    }

    // Optional TITLE clause
    if (state.tryConsume(element, CstNodeKind.FetchEntry_TITLE, tokens.TITLE)) {
      state.consume(
        element,
        CstNodeKind.FetchEntry_OpenParenTitle,
        tokens.OpenParen,
      );
      element.title = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.FetchEntry_CloseParenTitle,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const flushStatement = rule(
  sequence(tokens.FLUSH),
  (state: ParserState): ast.FlushStatement => {
    const element = ast.createFlushStatement();

    state.consume(element, CstNodeKind.FlushStatement_FLUSH, tokens.FLUSH);
    state.consume(element, CstNodeKind.FlushStatement_FILE, tokens.FILE);
    state.consume(
      element,
      CstNodeKind.FlushStatement_OpenParen,
      tokens.OpenParen,
    );

    if (state.canConsumeFirst(locatorCall.first())) {
      element.file = locatorCall.rule(state);
    } else if (
      state.tryConsume(element, CstNodeKind.FlushStatement_Star, tokens.Star)
    ) {
      const starToken = state.last;
      element.file = starToken!.image as "*";
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    state.consume(
      element,
      CstNodeKind.FlushStatement_CloseParen,
      tokens.CloseParen,
    );
    state.consume(
      element,
      CstNodeKind.FlushStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const formatStatement = rule(
  sequence(tokens.FORMAT),
  (state: ParserState): ast.FormatStatement => {
    const element = ast.createFormatStatement();

    state.consume(element, CstNodeKind.FormatStatement_FORMAT, tokens.FORMAT);
    state.consume(
      element,
      CstNodeKind.FormatStatement_OpenParen,
      tokens.OpenParen,
    );
    element.list = formatList.rule(state);
    state.consume(
      element,
      CstNodeKind.FormatStatement_CloseParen,
      tokens.CloseParen,
    );
    state.consume(
      element,
      CstNodeKind.FormatStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const formatList = rule(
  () => formatListItem.first(),
  (state: ParserState): ast.FormatList => {
    const element = ast.createFormatList();

    const lhs = formatListItem.rule(state);
    lhs && element.items.push(lhs);

    const { inc } = state.createLoopContext("FormatList");
    while (
      state.tryConsume(element, CstNodeKind.FormatList_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = formatListItem.rule(state);
      rhs && element.items.push(rhs);
    }

    return element;
  },
);

const formatListItem = rule(
  choice(
    () => formatListItemLevel.first(),
    () => formatItem.first(),
    sequence(tokens.OpenParen),
  ),
  (state: ParserState): ast.FormatListItem => {
    const element = ast.createFormatListItem();

    // Optional level
    if (state.canConsumeFirst(formatListItemLevel.first())) {
      element.level = formatListItemLevel.rule(state);
    }

    // Either format item or nested list
    if (state.canConsumeFirst(formatItem.first())) {
      element.item = formatItem.rule(state);
    } else if (state.canConsume(tokens.OpenParen)) {
      state.consume(
        element,
        CstNodeKind.FormatListItem_OpenParen,
        tokens.OpenParen,
      );
      element.list = formatList.rule(state);
      state.consume(
        element,
        CstNodeKind.FormatListItem_CloseParen,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    return element;
  },
);

const formatListItemLevel = rule(
  choice(sequence(tokens.NUMBER), sequence(tokens.OpenParen)),
  (state: ParserState): ast.FormatListItemLevel => {
    const element = ast.createFormatListItemLevel();

    if (state.canConsume(tokens.NUMBER)) {
      const levelToken = state.consume(
        element,
        CstNodeKind.FormatListItemLevel_LevelNumber,
        tokens.NUMBER,
      );
      if (levelToken) {
        element.level = levelToken.image;
      }
    } else if (state.canConsume(tokens.OpenParen)) {
      state.consume(
        element,
        CstNodeKind.FormatListItemLevel_OpenParen,
        tokens.OpenParen,
      );
      element.level = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.FormatListItemLevel_CloseParen,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    return element;
  },
);

const formatItem = orRule<ast.FormatItem, []>(
  () => AFormatItem,
  () => BFormatItem,
  () => CFormatItem,
  () => EFormatItem,
  () => FFormatItem,
  () => PFormatItem,
  () => columnFormatItem,
  () => GFormatItem,
  () => LFormatItem,
  () => lineFormatItem,
  () => pageFormatItem,
  () => RFormatItem,
  () => skipFormatItem,
  () => VFormatItem,
  () => XFormatItem,
);

const AFormatItem = rule(
  sequence(tokens.A),
  (state: ParserState): ast.AFormatItem => {
    const element = ast.createAFormatItem();

    state.consume(element, CstNodeKind.AFormatItem_A, tokens.A);

    if (
      state.tryConsume(
        element,
        CstNodeKind.AFormatItem_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.fieldWidth = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.AFormatItem_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const BFormatItem = rule(
  sequence(tokens.B),
  (state: ParserState): ast.BFormatItem => {
    const element = ast.createBFormatItem();

    state.consume(element, CstNodeKind.BFormatItem_B, tokens.B);

    if (
      state.tryConsume(
        element,
        CstNodeKind.BFormatItem_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.fieldWidth = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.BFormatItem_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const CFormatItem = rule(
  sequence(tokens.C),
  (state: ParserState): ast.CFormatItem => {
    const element = ast.createCFormatItem();

    state.consume(element, CstNodeKind.CFormatItem_C, tokens.C);
    state.consume(element, CstNodeKind.CFormatItem_OpenParen, tokens.OpenParen);

    if (state.canConsumeFirst(FFormatItem.first())) {
      element.item = FFormatItem.rule(state);
    } else if (state.canConsumeFirst(EFormatItem.first())) {
      element.item = EFormatItem.rule(state);
    } else if (state.canConsumeFirst(PFormatItem.first())) {
      element.item = PFormatItem.rule(state);
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    state.consume(
      element,
      CstNodeKind.CFormatItem_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const FFormatItem = rule(
  sequence(tokens.F),
  (state: ParserState): ast.FFormatItem => {
    const element = ast.createFFormatItem();

    state.consume(element, CstNodeKind.FFormatItem_F, tokens.F);
    state.consume(element, CstNodeKind.FFormatItem_OpenParen, tokens.OpenParen);
    element.fieldWidth = expression.rule(state);

    // Optional fractional digits and scaling factor
    if (
      state.tryConsume(
        element,
        CstNodeKind.FFormatItem_CommaFractional,
        tokens.Comma,
      )
    ) {
      element.fractionalDigits = expression.rule(state);

      // Optional scaling factor
      if (
        state.tryConsume(
          element,
          CstNodeKind.FFormatItem_CommaScalingFactor,
          tokens.Comma,
        )
      ) {
        element.scalingFactor = expression.rule(state);
      }
    }

    state.consume(
      element,
      CstNodeKind.FFormatItem_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const EFormatItem = rule(
  sequence(tokens.E),
  (state: ParserState): ast.EFormatItem => {
    const element = ast.createEFormatItem();

    state.consume(element, CstNodeKind.EFormatItem_E, tokens.E);
    state.consume(element, CstNodeKind.EFormatItem_OpenParen, tokens.OpenParen);
    element.fieldWidth = expression.rule(state);
    state.consume(element, CstNodeKind.EFormatItem_Comma0, tokens.Comma);
    element.fractionalDigits = expression.rule(state);

    // Optional significant digits
    if (
      state.tryConsume(element, CstNodeKind.EFormatItem_Comma1, tokens.Comma)
    ) {
      element.significantDigits = expression.rule(state);
    }

    state.consume(
      element,
      CstNodeKind.EFormatItem_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const PFormatItem = rule(
  sequence(tokens.P),
  (state: ParserState): ast.PFormatItem => {
    const element = ast.createPFormatItem();

    state.consume(element, CstNodeKind.PFormatItem_P, tokens.P);
    const specToken = state.consume(
      element,
      CstNodeKind.PFormatItem_SpecificationString,
      tokens.STRING_TERM,
    );
    if (specToken) {
      element.specification = specToken.image;
    }

    return element;
  },
);

const columnFormatItem = rule(
  sequence(tokens.COLUMN),
  (state: ParserState): ast.ColumnFormatItem => {
    const element = ast.createColumnFormatItem();

    state.consume(element, CstNodeKind.ColumnFormatItem_COLUMN, tokens.COLUMN);
    state.consume(
      element,
      CstNodeKind.ColumnFormatItem_OpenParen,
      tokens.OpenParen,
    );
    element.characterPosition = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.ColumnFormatItem_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const GFormatItem = rule(
  sequence(tokens.G),
  (state: ParserState): ast.GFormatItem => {
    const element = ast.createGFormatItem();

    state.consume(element, CstNodeKind.GFormatItem_G, tokens.G);

    if (
      state.tryConsume(
        element,
        CstNodeKind.GFormatItem_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.fieldWidth = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.GFormatItem_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const LFormatItem = rule(
  sequence(tokens.L),
  (state: ParserState): ast.LFormatItem => {
    const element = ast.createLFormatItem();

    state.consume(element, CstNodeKind.LFormatItem_L, tokens.L);

    return element;
  },
);

const lineFormatItem = rule(
  sequence(tokens.LINE),
  (state: ParserState): ast.LineFormatItem => {
    const element = ast.createLineFormatItem();

    state.consume(element, CstNodeKind.LineFormatItem_LINE, tokens.LINE);
    state.consume(
      element,
      CstNodeKind.LineFormatItem_OpenParen,
      tokens.OpenParen,
    );
    element.lineNumber = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.LineFormatItem_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const pageFormatItem = rule(
  sequence(tokens.PAGE),
  (state: ParserState): ast.PageFormatItem => {
    const element = ast.createPageFormatItem();

    state.consume(element, CstNodeKind.PageFormatItem_PAGE, tokens.PAGE);

    return element;
  },
);

const RFormatItem = rule(
  sequence(tokens.R),
  (state: ParserState): ast.RFormatItem => {
    const element = ast.createRFormatItem();

    state.consume(element, CstNodeKind.RFormatItem_R, tokens.R);
    state.consume(element, CstNodeKind.RFormatItem_OpenParen, tokens.OpenParen);
    const labelToken = state.consume(
      element,
      CstNodeKind.RFormatItem_LabelRef,
      tokens.ID,
    );
    if (labelToken) {
      element.labelReference = labelToken.image;
    }
    state.consume(
      element,
      CstNodeKind.RFormatItem_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const skipFormatItem = rule(
  sequence(tokens.SKIP),
  (state: ParserState): ast.SkipFormatItem => {
    const element = ast.createSkipFormatItem();

    state.consume(element, CstNodeKind.SkipFormatItem_SKIP, tokens.SKIP);

    if (
      state.tryConsume(
        element,
        CstNodeKind.SkipFormatItem_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.skip = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.SkipFormatItem_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const VFormatItem = rule(
  sequence(tokens.V),
  (state: ParserState): ast.VFormatItem => {
    const element = ast.createVFormatItem();

    state.consume(element, CstNodeKind.VFormatItem_V, tokens.V);

    return element;
  },
);

const XFormatItem = rule(
  sequence(tokens.X),
  (state: ParserState): ast.XFormatItem => {
    const element = ast.createXFormatItem();
    state.consume(element, CstNodeKind.XFormatItem_X, tokens.X);
    state.consume(element, CstNodeKind.XFormatItem_OpenParen, tokens.OpenParen);
    element.width = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.XFormatItem_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const freeStatement = rule(
  sequence(tokens.FREE),
  (state: ParserState): ast.FreeStatement => {
    const element = ast.createFreeStatement();

    state.consume(element, CstNodeKind.FreeStatement_FREE, tokens.FREE);
    const lhs = locatorCall.rule(state);
    lhs && element.references.push(lhs);

    const { inc } = state.createLoopContext("FreeStatement");
    while (
      state.tryConsume(element, CstNodeKind.FreeStatement_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = locatorCall.rule(state);
      rhs && element.references.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.FreeStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const getStatement = rule(
  sequence(tokens.GET),
  (state: ParserState): ast.GetStatement => {
    let element = ast.createGetFileStatement();

    state.consume(element, CstNodeKind.GetStatement_GET, tokens.GET);

    if (
      state.tryConsume(element, CstNodeKind.GetStatement_STRING, tokens.STRING)
    ) {
      // STRING variant
      const stringStatement = element as unknown as ast.GetStringStatement;
      stringStatement.kind = ast.SyntaxKind.GetStringStatement;
      stringStatement.container = null;
      stringStatement.dataSpecification = null;
      stringStatement.expression = null;

      state.consume(
        stringStatement,
        CstNodeKind.GetStatement_OpenParen,
        tokens.OpenParen,
      );
      stringStatement.expression = expression.rule(state);
      state.consume(
        stringStatement,
        CstNodeKind.GetStatement_CloseParen,
        tokens.CloseParen,
      );
      stringStatement.dataSpecification = dataSpecificationOptions.rule(state);
    } else {
      // FILE variant - one or more file specifications
      const { inc } = state.createLoopContext("GetStatement");
      const fileStatement = element as ast.GetFileStatement;
      do {
        inc();
        if (state.canConsumeFirst(getFile.first())) {
          const file = getFile.rule(state);
          file && fileStatement.specifications.push(file);
        } else if (state.canConsumeFirst(getCopy.first())) {
          const copy = getCopy.rule(state);
          copy && fileStatement.specifications.push(copy);
        } else if (state.canConsumeFirst(getSkip.first())) {
          const skip = getSkip.rule(state);
          skip && fileStatement.specifications.push(skip);
        } else if (state.canConsumeFirst(dataSpecificationOptions.first())) {
          const dataSpec = dataSpecificationOptions.rule(state);
          dataSpec && fileStatement.specifications.push(dataSpec);
        } else {
          state.error(Severe.IBM3988I.message, state.token, Severity.S);
          return element;
        }
      } while (
        !state.eof &&
        (state.canConsumeFirst(getFile.first()) ||
          state.canConsumeFirst(getCopy.first()) ||
          state.canConsumeFirst(getSkip.first()) ||
          state.canConsumeFirst(dataSpecificationOptions.first()))
      );
    }

    state.consume(
      element,
      CstNodeKind.GetStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const getFile = rule(
  sequence(tokens.FILE),
  (state: ParserState): ast.GetFile => {
    const element = ast.createGetFile();
    state.consume(element, CstNodeKind.GetFile_FILE, tokens.FILE);
    state.consume(element, CstNodeKind.GetFile_OpenParen, tokens.OpenParen);
    element.file = expression.rule(state);
    state.consume(element, CstNodeKind.GetFile_CloseParen, tokens.CloseParen);
    return element;
  },
);

const getCopy = rule(
  sequence(tokens.COPY),
  (state: ParserState): ast.GetCopy => {
    const element = ast.createGetCopy();

    state.consume(element, CstNodeKind.GetCopy_COPY, tokens.COPY);

    if (
      state.tryConsume(element, CstNodeKind.GetCopy_OpenParen, tokens.OpenParen)
    ) {
      const idToken = state.consume(
        element,
        CstNodeKind.GetCopy_CopyReference,
        tokens.ID,
      );
      if (idToken) {
        element.copyReference = idToken.image;
      }
      state.consume(element, CstNodeKind.GetCopy_CloseParen, tokens.CloseParen);
    }

    return element;
  },
);

const getSkip = rule(
  sequence(tokens.SKIP),
  (state: ParserState): ast.GetSkip => {
    const element = ast.createGetSkip();

    state.consume(element, CstNodeKind.GetSkip_SKIP, tokens.SKIP);

    if (
      state.tryConsume(element, CstNodeKind.GetSkip_OpenParen, tokens.OpenParen)
    ) {
      element.skipExpression = expression.rule(state);
      state.consume(element, CstNodeKind.GetSkip_CloseParen, tokens.CloseParen);
    }

    return element;
  },
);

const goToStatement = rule(
  choice(sequence(tokens.GO), sequence(tokens.GOTO)),
  (state: ParserState): ast.GoToStatement => {
    const element = ast.createGoToStatement();

    if (state.canConsume(tokens.GO)) {
      state.consume(element, CstNodeKind.GoToStatement_GO, tokens.GO);
      state.consume(element, CstNodeKind.GoToStatement_TO, tokens.TO);
    } else if (
      state.tryConsume(element, CstNodeKind.GoToStatement_GOTO, tokens.GOTO)
    ) {
      // GOTO consumed
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    element.label = labelReference.rule(state);
    state.consume(
      element,
      CstNodeKind.GoToStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const genericAttribute = rule(
  sequence(tokens.GENERIC),
  (state: ParserState): ast.GenericAttribute => {
    const element = ast.createGenericAttribute();

    state.consume(
      element,
      CstNodeKind.GenericAttribute_GENERIC,
      tokens.GENERIC,
    );
    state.consume(
      element,
      CstNodeKind.GenericAttribute_OpenParen,
      tokens.OpenParen,
    );

    // Optional generic references
    if (state.canConsumeFirst(genericReference.first())) {
      const lhs = genericReference.rule(state);
      lhs && element.references.push(lhs);

      const { inc } = state.createLoopContext("GenericAttribute");
      while (
        state.tryConsume(
          element,
          CstNodeKind.GenericAttribute_Comma,
          tokens.Comma,
        )
      ) {
        inc();
        const rhs = genericReference.rule(state);
        rhs && element.references.push(rhs);
      }
    }

    state.consume(
      element,
      CstNodeKind.GenericAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const genericReference = rule(
  () => referenceItem.first(),
  (state: ParserState): ast.GenericReference => {
    const element = ast.createGenericReference();

    element.entry = referenceItem.rule(state);

    if (
      state.tryConsume(element, CstNodeKind.GenericReference_WHEN, tokens.WHEN)
    ) {
      state.consume(
        element,
        CstNodeKind.GenericReference_OpenParen,
        tokens.OpenParen,
      );

      if (state.canConsumeFirst(genericDescriptor.first())) {
        const descr = genericDescriptor.rule(state);
        descr && element.descriptors.push(descr);
      }

      state.consume(
        element,
        CstNodeKind.GenericReference_CloseParen,
        tokens.CloseParen,
      );
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.GenericReference_OTHERWISE,
        tokens.OTHERWISE,
      )
    ) {
      element.otherwise = true;
    }

    return element;
  },
);

const genericDescriptor = rule(
  () => declarationAttribute.first(),
  (state: ParserState): ast.GenericDescriptor => {
    const element = ast.createGenericDescriptor();

    const lhs = declarationAttribute.rule(state);
    lhs && element.attributes.push(lhs);
    const { inc } = state.createLoopContext("GenericDescriptor");
    while (
      state.tryConsume(
        element,
        CstNodeKind.GenericDescriptor_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = declarationAttribute.rule(state);
      rhs && element.attributes.push(rhs);
    }

    return element;
  },
);

const ifStatement = rule(
  sequence(tokens.IF),
  (state: ParserState): ast.IfStatement => {
    const element = ast.createIfStatement();

    state.consume(element, CstNodeKind.IfStatement_IF, tokens.IF);
    element.expression = expression.rule(state);
    state.consume(element, CstNodeKind.IfStatement_THEN, tokens.THEN);
    element.unit = statement.rule(state);

    if (state.tryConsume(element, CstNodeKind.IfStatement_ELSE, tokens.ELSE)) {
      element.else = statement.rule(state);
    }

    return element;
  },
);

const indForAttribute = rule(
  sequence(tokens.INDFOR),
  (state: ParserState): ast.IndForAttribute => {
    const element = ast.createIndForAttribute();

    state.consume(element, CstNodeKind.IndForAttribute_INDFOR, tokens.INDFOR);
    element.reference = locatorCall.rule(state);

    return element;
  },
);

const iterateStatement = rule(
  sequence(tokens.ITERATE),
  (state: ParserState): ast.IterateStatement => {
    const element = ast.createIterateStatement();

    state.consume(
      element,
      CstNodeKind.IterateStatement_ITERATE,
      tokens.ITERATE,
    );

    if (state.canConsumeFirst(labelReference.first())) {
      element.label = labelReference.rule(state);
    }

    state.consume(
      element,
      CstNodeKind.IterateStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const leaveStatement = rule(
  sequence(tokens.LEAVE),
  (state: ParserState): ast.LeaveStatement => {
    const element = ast.createLeaveStatement();

    const leaveToken = state.consume(
      element,
      CstNodeKind.LeaveStatement_LEAVE,
      tokens.LEAVE,
    );
    element.leaveToken = leaveToken;

    if (state.canConsumeFirst(labelReference.first())) {
      element.label = labelReference.rule(state);
    }

    state.consume(
      element,
      CstNodeKind.LeaveStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const locateStatement = rule(
  sequence(tokens.LOCATE),
  (state: ParserState): ast.LocateStatement => {
    const element = ast.createLocateStatement();

    state.consume(element, CstNodeKind.LocateStatement_LOCATE, tokens.LOCATE);
    element.variable = locatorCall.rule(state);

    const { inc } = state.createLoopContext("LocateStatement");
    while (state.canConsumeFirst(locateStatementOption.first())) {
      inc();
      const option = locateStatementOption.rule(state);
      option && element.arguments.push(option);
    }

    state.consume(
      element,
      CstNodeKind.LocateStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const locateStatementOption = rule(
  sequence(tokens.LocateType),
  (state: ParserState): ast.LocateStatementOption => {
    const element = ast.createLocateStatementOption();

    const typeToken = state.consume(
      element,
      CstNodeKind.LocateStatementOption_Type,
      tokens.LocateType,
    );
    if (typeToken) {
      element.type = tokens.LocateType.mapToEnumLiteral(typeToken.tokenTypeIdx);
    }

    state.consume(
      element,
      CstNodeKind.LocateStatementOption_OpenParen,
      tokens.OpenParen,
    );
    element.element = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.LocateStatementOption_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const nullStatement = rule(
  sequence(tokens.Semicolon),
  (state: ParserState): ast.NullStatement => {
    const element = ast.createNullStatement();
    state.consume(
      element,
      CstNodeKind.NullStatement_Semicolon,
      tokens.Semicolon,
    );
    return element;
  },
);

const onStatement = rule(
  sequence(tokens.ON),
  (state: ParserState): ast.OnStatement => {
    const element = ast.createOnStatement();

    state.consume(element, CstNodeKind.OnStatement_ON, tokens.ON);

    // Parse first condition
    const lhs = condition.rule(state);
    lhs && element.conditions.push(lhs);

    // Parse additional comma-separated conditions
    const { inc } = state.createLoopContext("OnStatement");
    while (
      state.tryConsume(element, CstNodeKind.OnStatement_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = condition.rule(state);
      rhs && element.conditions.push(rhs);
    }

    // Optional SNAP
    if (state.tryConsume(element, CstNodeKind.OnStatement_Snap, tokens.SNAP)) {
      element.snap = true;
    }

    // Either SYSTEM or a statement
    if (
      state.tryConsume(element, CstNodeKind.OnStatement_System, tokens.SYSTEM)
    ) {
      element.system = true;
      state.consume(
        element,
        CstNodeKind.OnStatement_Semicolon,
        tokens.Semicolon,
      );
    } else {
      element.onUnit = statement.rule(state);
    }

    return element;
  },
);

const condition = orRule<ast.Condition, []>(
  () => keywordCondition,
  () => namedCondition,
  () => fileReferenceCondition,
);

const keywordCondition = rule(
  sequence(tokens.KeywordConditions),
  (state: ParserState): ast.KeywordCondition => {
    const element = ast.createKeywordCondition();
    const token = state.consume(
      element,
      CstNodeKind.KeywordCondition_Keyword,
      tokens.KeywordConditions,
    );
    if (token) {
      element.keyword = tokens.KeywordConditions.mapToEnumLiteral(
        token.tokenTypeIdx,
      );
    }
    return element;
  },
);

const namedCondition = rule(
  sequence(tokens.CONDITION),
  (state: ParserState): ast.NamedCondition => {
    const element = ast.createNamedCondition();

    state.consume(
      element,
      CstNodeKind.NamedCondition_CONDITION,
      tokens.CONDITION,
    );
    state.consume(
      element,
      CstNodeKind.NamedCondition_OpenParen,
      tokens.OpenParen,
    );

    const nameToken = state.consume(
      element,
      CstNodeKind.NamedCondition_Name,
      tokens.ID,
    );
    if (nameToken) {
      element.name = nameToken.image;
    }

    state.consume(
      element,
      CstNodeKind.NamedCondition_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const fileReferenceCondition = rule(
  sequence(tokens.FileReferenceConditions),
  (state: ParserState): ast.FileReferenceCondition => {
    const element = ast.createFileReferenceCondition();

    const keywordToken = state.consume(
      element,
      CstNodeKind.FileReferenceCondition_Keyword,
      tokens.FileReferenceConditions,
    );
    if (keywordToken) {
      element.keyword = tokens.FileReferenceConditions.mapToEnumLiteral(
        keywordToken.tokenTypeIdx,
      );
    }

    // Optional file reference in parentheses
    if (
      state.tryConsume(
        element,
        CstNodeKind.FileReferenceCondition_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.fileReference = locatorCall.rule(state);
      state.consume(
        element,
        CstNodeKind.FileReferenceCondition_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const openStatement = rule(
  sequence(tokens.OPEN),
  (state: ParserState): ast.OpenStatement => {
    const element = ast.createOpenStatement();

    state.consume(element, CstNodeKind.OpenStatement_OPEN, tokens.OPEN);

    const lhs = openOptionsGroup.rule(state);
    lhs && element.options.push(lhs);

    const { inc } = state.createLoopContext("OpenStatement");
    while (
      state.tryConsume(element, CstNodeKind.OpenStatement_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = openOptionsGroup.rule(state);
      rhs && element.options.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.OpenStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const openOptionsGroup = rule(
  () => openOption.first(),
  (state: ParserState): ast.OpenOptionsGroup => {
    const element = ast.createOpenOptionsGroup();

    // Parse at least one open option
    const lhs = openOption.rule(state);
    lhs && element.options.push(lhs);

    // Parse additional options as long as we can consume OpenOptionType tokens
    const { inc } = state.createLoopContext("OpenOptionsGroup");
    while (state.canConsumeFirst(openOption.first())) {
      inc();
      const rhs = openOption.rule(state);
      rhs && element.options.push(rhs);
    }

    return element;
  },
);

const openOption = rule(
  sequence(tokens.OpenOptionType),
  (state: ParserState): ast.OpenOption => {
    // TODO: explain the discrepancy in the grammar
    // The language reference explains that BUFFERED/UNBUFFERED can only be followed by SEQUENTIAL or DIRECT
    // THIS IS NOT THE CASE
    // It can appear on its own
    // Therefore, we simply combine all open options into one single rule
    const element = ast.createOpenOption();

    const optionToken = state.consume(
      element,
      CstNodeKind.OpenOption_Type,
      tokens.OpenOptionType,
    );
    if (optionToken) {
      element.option = tokens.OpenOptionType.mapToEnumLiteral(
        optionToken.tokenTypeIdx,
      );
    }

    // Optional expression in parentheses
    if (
      state.tryConsume(
        element,
        CstNodeKind.OpenOption_OpenParen,
        tokens.OpenParen,
      )
    ) {
      // Note: Only FILE, TITLE, LINESIZE and PAGESIZE are supposed to use this
      // Validate against this later in the lifecycle
      element.expression = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.OpenOption_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const putStatement = rule(
  sequence(tokens.PUT),
  (state: ParserState): ast.PutStatement => {
    // Start with file statement as default
    let element = ast.createPutFileStatement();

    state.consume(element, CstNodeKind.PutStatement_PUT, tokens.PUT);

    if (state.canConsume(tokens.Semicolon)) {
      // No optional content, just consume semicolon
    } else if (
      state.tryConsume(element, CstNodeKind.PutStatement_STRING, tokens.STRING)
    ) {
      const stringStatement: ast.PutStringStatement =
        element as unknown as ast.PutStringStatement;
      stringStatement.kind = ast.SyntaxKind.PutStringStatement;
      stringStatement.container = null;
      stringStatement.dataSpecification = null;
      stringStatement.stringExpression = null;
      state.consume(
        stringStatement,
        CstNodeKind.PutStatement_OpenParen,
        tokens.OpenParen,
      );
      stringStatement.stringExpression = expression.rule(state);
      state.consume(
        stringStatement,
        CstNodeKind.PutStatement_CloseParen,
        tokens.CloseParen,
      );
      stringStatement.dataSpecification = dataSpecificationOptions.rule(state);
    } else {
      // FILE variant - keep as file statement
      const fileStatement = element as ast.PutFileStatement;
      fileStatement.kind = ast.SyntaxKind.PutFileStatement;

      // Parse one or more put items or data specification options
      const { inc } = state.createLoopContext("PutStatement");
      do {
        inc();
        if (state.canConsumeFirst(putItem.first())) {
          const item = putItem.rule(state);
          item && fileStatement.items.push(item);
        } else if (state.canConsumeFirst(dataSpecificationOptions.first())) {
          const option = dataSpecificationOptions.rule(state);
          option && fileStatement.items.push(option);
        }
      } while (
        !state.eof &&
        (state.canConsumeFirst(putItem.first()) ||
          state.canConsumeFirst(dataSpecificationOptions.first()))
      );
    }

    state.consume(
      element,
      CstNodeKind.PutStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const putItem = rule(
  sequence(tokens.PutAttribute),
  (state: ParserState): ast.PutItem => {
    const element = ast.createPutItem();

    const attributeToken = state.consume(
      element,
      CstNodeKind.PutAttribute_FILE,
      tokens.PutAttribute,
    );
    if (attributeToken) {
      element.attribute = tokens.PutAttribute.mapToEnumLiteral(
        attributeToken.tokenTypeIdx,
      );
    }

    // Optional expression in parentheses
    if (
      state.tryConsume(element, CstNodeKind.PutItem_OpenParen, tokens.OpenParen)
    ) {
      element.expression = expression.rule(state);
      state.consume(element, CstNodeKind.PutItem_CloseParen, tokens.CloseParen);
    }

    return element;
  },
);

const dataSpecificationOptions = rule(
  choice(
    sequence(tokens.LIST),
    sequence(tokens.OpenParen),
    sequence(tokens.DATA),
    sequence(tokens.EDIT),
  ),
  (state: ParserState): ast.DataSpecificationOptions => {
    const element = ast.createDataSpecificationOptions();

    if (state.canConsume(tokens.LIST) || state.canConsume(tokens.OpenParen)) {
      // LIST variant (LIST is optional)
      state.tryConsume(
        element,
        CstNodeKind.DataSpecificationOptions_LIST,
        tokens.LIST,
      );
      state.consume(
        element,
        CstNodeKind.DataSpecificationOptions_OpenParenList,
        tokens.OpenParen,
      );
      element.dataList = dataSpecificationDataList.rule(state);
      state.consume(
        element,
        CstNodeKind.DataSpecificationOptions_CloseParenList,
        tokens.CloseParen,
      );
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.DataSpecificationOptions_Data,
        tokens.DATA,
      )
    ) {
      // DATA variant
      element.data = true;
      if (
        state.tryConsume(
          element,
          CstNodeKind.DataSpecificationOptions_OpenParenData,
          tokens.OpenParen,
        )
      ) {
        const lhs = dataSpecificationDataListItem.rule(state);
        lhs && element.dataListItems.push(lhs);
        const { inc } = state.createLoopContext("DataSpecificationOptions 1");
        while (
          state.tryConsume(
            element,
            CstNodeKind.DataSpecificationOptions_Comma,
            tokens.Comma,
          )
        ) {
          inc();
          const rhs = dataSpecificationDataListItem.rule(state);
          rhs && element.dataListItems.push(rhs);
        }
        state.consume(
          element,
          CstNodeKind.DataSpecificationOptions_CloseParenData,
          tokens.CloseParen,
        );
      }
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.DataSpecificationOptions_Edit,
        tokens.EDIT,
      )
    ) {
      // EDIT variant
      element.edit = true;
      const { inc } = state.createLoopContext("DataSpecificationOptions 2");
      do {
        inc();
        state.consume(
          element,
          CstNodeKind.DataSpecificationOptions_OpenParenEdit,
          tokens.OpenParen,
        );
        const list = dataSpecificationDataList.rule(state);
        list && element.dataLists.push(list);
        state.consume(
          element,
          CstNodeKind.DataSpecificationOptions_CloseParenEdit,
          tokens.CloseParen,
        );

        state.consume(
          element,
          CstNodeKind.DataSpecificationOptions_OpenParenFormat,
          tokens.OpenParen,
        );
        const list2 = formatList.rule(state);
        list2 && element.formatLists.push(list2);
        state.consume(
          element,
          CstNodeKind.DataSpecificationOptions_CloseParenFormat,
          tokens.CloseParen,
        );
      } while (
        !state.eof &&
        !state.canConsume(tokens.Semicolon) &&
        state.canConsume(tokens.OpenParen)
      );
    }

    return element;
  },
);

const dataSpecificationDataList = rule(
  () => dataSpecificationDataListItem.first(),
  (state: ParserState): ast.DataSpecificationDataList => {
    const element = ast.createDataSpecificationDataList();
    const lhs = dataSpecificationDataListItem.rule(state);
    lhs && element.items.push(lhs);
    const { inc } = state.createLoopContext("DataSpecificationDataList");
    while (
      state.tryConsume(
        element,
        CstNodeKind.DataSpecificationDataList_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = dataSpecificationDataListItem.rule(state);
      rhs && element.items.push(rhs);
    }
    return element;
  },
);

const dataSpecificationDataListItem = rule(
  () => expression.first(),
  (state: ParserState): ast.DataSpecificationDataListItem => {
    const element = ast.createDataSpecificationDataListItem();

    // Allows multiple sub-expressions separated by comma
    element.value = expression.rule(state, { multiple: true });

    return element;
  },
);

const qualifyStatement = rule(
  sequence(tokens.QUALIFY),
  (state: ParserState): ast.QualifyStatement => {
    const element = ast.createQualifyStatement();

    state.consume(
      element,
      CstNodeKind.QualifyStatement_QUALIFY,
      tokens.QUALIFY,
    );
    state.consume(
      element,
      CstNodeKind.QualifyStatement_Semicolon,
      tokens.Semicolon,
    );

    const { inc } = state.createLoopContext("QualifyStatement");
    while (!state.eof && !hasEndStatementLookahead(state)) {
      inc();
      const stmt = statement.rule(state);
      stmt && element.statements.push(stmt);
    }

    element.end = parseMulticloseEnd(state);

    return element;
  },
);

const reservedAttribute = rule(
  sequence(tokens.RESERVED),
  (state: ParserState): ast.ReservedAttribute => {
    const element = ast.createReservedAttribute();

    state.consume(
      element,
      CstNodeKind.ReservedAttribute_RESERVED,
      tokens.RESERVED,
    );
    if (
      state.tryConsume(
        element,
        CstNodeKind.ReservedAttribute_OpenParen,
        tokens.OpenParen,
      )
    ) {
      const importedToken = state.consume(
        element,
        CstNodeKind.ReservedAttribute_Imported,
        tokens.IMPORTED,
      );
      element.importedToken = importedToken;
      state.consume(
        element,
        CstNodeKind.ReservedAttribute_CloseParen,
        tokens.CloseParen,
      );
    }
    return element;
  },
);

const readStatement = rule(
  sequence(tokens.READ),
  (state: ParserState): ast.ReadStatement => {
    const element = ast.createReadStatement();

    state.consume(element, CstNodeKind.ReadStatement_READ, tokens.READ);
    const { inc } = state.createLoopContext("ReadStatement");
    while (state.canConsumeFirst(readStatementOption.first())) {
      inc();
      const option = readStatementOption.rule(state);
      option && element.arguments.push(option);
    }

    state.consume(
      element,
      CstNodeKind.ReadStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const readStatementOption = rule(
  sequence(tokens.ReadStatementType),
  (state: ParserState): ast.ReadStatementOption => {
    const element = ast.createReadStatementOption();

    const typeToken = state.consume(
      element,
      CstNodeKind.ReadStatementFile_Type,
      tokens.ReadStatementType,
    );
    if (typeToken) {
      element.type = tokens.ReadStatementType.mapToEnumLiteral(
        typeToken.tokenTypeIdx,
      );
    }

    state.consume(
      element,
      CstNodeKind.ReadStatementFile_OpenParen,
      tokens.OpenParen,
    );
    element.value = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.ReadStatementFile_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const reinitStatement = rule(
  sequence(tokens.REINIT),
  (state: ParserState): ast.ReinitStatement => {
    const element = ast.createReinitStatement();

    state.consume(element, CstNodeKind.ReinitStatement_REINIT, tokens.REINIT);
    element.reference = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.ReinitStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const releaseStatement = rule(
  sequence(tokens.RELEASE),
  (state: ParserState): ast.ReleaseStatement => {
    const element = ast.createReleaseStatement();

    state.consume(
      element,
      CstNodeKind.ReleaseStatement_RELEASE,
      tokens.RELEASE,
    );

    if (
      state.tryConsume(element, CstNodeKind.ReleaseStatement_Star, tokens.Star)
    ) {
      element.star = true;
    } else {
      const idToken = state.consume(
        element,
        CstNodeKind.ReleaseStatement_References0,
        tokens.ID,
      );
      if (idToken) {
        element.references.push(idToken.image);
      }

      const { inc } = state.createLoopContext("ReleaseStatement");
      while (
        state.tryConsume(
          element,
          CstNodeKind.ReleaseStatement_Comma,
          tokens.Comma,
        )
      ) {
        inc();
        const nextIdToken = state.consume(
          element,
          CstNodeKind.ReleaseStatement_References1,
          tokens.ID,
        );
        if (nextIdToken) {
          element.references.push(nextIdToken.image);
        }
      }
    }

    state.consume(
      element,
      CstNodeKind.ReleaseStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const resignalStatement = rule(
  sequence(tokens.RESIGNAL),
  (state: ParserState): ast.ResignalStatement => {
    const element = ast.createResignalStatement();

    state.consume(
      element,
      CstNodeKind.ResignalStatement_RESIGNAL,
      tokens.RESIGNAL,
    );
    state.consume(
      element,
      CstNodeKind.ResignalStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const returnStatement = rule(
  sequence(tokens.RETURN),
  (state: ParserState): ast.ReturnStatement => {
    const element = ast.createReturnStatement();

    element.returnToken = state.consume(
      element,
      CstNodeKind.ReturnStatement_RETURN,
      tokens.RETURN,
    );

    // Optional expression in parentheses
    if (
      state.tryConsume(
        element,
        CstNodeKind.ReturnStatement_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.expression = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.ReturnStatement_CloseParen,
        tokens.CloseParen,
      );
    }

    state.consume(
      element,
      CstNodeKind.ReturnStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const revertStatement = rule(
  sequence(tokens.REVERT),
  (state: ParserState): ast.RevertStatement => {
    const element = ast.createRevertStatement();

    state.consume(element, CstNodeKind.RevertStatement_REVERT, tokens.REVERT);

    // Parse first condition
    const lhs = condition.rule(state);
    lhs && element.conditions.push(lhs);

    // Parse additional comma-separated conditions
    const { inc } = state.createLoopContext("RevertStatement");
    while (
      state.tryConsume(element, CstNodeKind.RevertStatement_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = condition.rule(state);
      rhs && element.conditions.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.RevertStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const rewriteStatement = rule(
  sequence(tokens.REWRITE),
  (state: ParserState): ast.RewriteStatement => {
    const element = ast.createRewriteStatement();

    state.consume(
      element,
      CstNodeKind.RewriteStatement_REWRITE,
      tokens.REWRITE,
    );

    // Parse zero or more rewrite statement options
    const { inc } = state.createLoopContext("RewriteStatement");
    while (state.canConsumeFirst(rewriteStatementOption.first())) {
      inc();
      const option = rewriteStatementOption.rule(state);
      option && element.arguments.push(option);
    }

    state.consume(
      element,
      CstNodeKind.RewriteStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const rewriteStatementOption = rule(
  sequence(tokens.RewriteStatementType),
  (state: ParserState): ast.RewriteStatementOption => {
    const element = ast.createRewriteStatementOption();

    const typeToken = state.consume(
      element,
      CstNodeKind.RewriteStatementFile_FILE,
      tokens.RewriteStatementType,
    );
    if (typeToken) {
      element.type = tokens.RewriteStatementType.mapToEnumLiteral(
        typeToken.tokenTypeIdx,
      );
    }

    state.consume(
      element,
      CstNodeKind.RewriteStatementFile_OpenParen,
      tokens.OpenParen,
    );
    element.value = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.RewriteStatementFile_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const selectStatement = rule(
  sequence(tokens.SELECT),
  (state: ParserState): ast.SelectStatement => {
    const element = ast.createSelectStatement();

    const selectToken = state.consume(
      element,
      CstNodeKind.SelectStatement_SELECT,
      tokens.SELECT,
    );
    element.selectToken = selectToken;

    // Optional expression in parentheses
    if (
      state.tryConsume(
        element,
        CstNodeKind.SelectStatement_OpenParen,
        tokens.OpenParen,
      )
    ) {
      element.on = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.SelectStatement_CloseParen,
        tokens.CloseParen,
      );
    }

    state.consume(
      element,
      CstNodeKind.SelectStatement_Semicolon,
      tokens.Semicolon,
    );

    // Parse WHEN and OTHERWISE statements
    const { inc } = state.createLoopContext("SelectStatement");
    while (
      !state.eof &&
      (state.canConsumeFirst(whenStatement.first()) ||
        state.canConsumeFirst(otherwiseStatement.first()))
    ) {
      inc();
      if (state.canConsumeFirst(whenStatement.first())) {
        const when = whenStatement.rule(state);
        when && element.cases.push(when);
      } else if (state.canConsumeFirst(otherwiseStatement.first())) {
        const otherwise = otherwiseStatement.rule(state);
        otherwise && element.cases.push(otherwise);
      }
    }

    element.end = parseMulticloseEnd(state);

    return element;
  },
);

const whenStatement = rule(
  sequence(tokens.WHEN),
  (state: ParserState): ast.WhenStatement => {
    const element = ast.createWhenStatement();

    state.consume(element, CstNodeKind.WhenStatement_WHEN, tokens.WHEN);
    state.consume(
      element,
      CstNodeKind.WhenStatement_OpenParen,
      tokens.OpenParen,
    );

    // Parse first condition
    const lhs = expression.rule(state);
    lhs && element.conditions.push(lhs);

    // Parse additional comma-separated conditions
    const { inc } = state.createLoopContext("WhenStatement");
    while (
      state.tryConsume(element, CstNodeKind.WhenStatement_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = expression.rule(state);
      rhs && element.conditions.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.WhenStatement_CloseParen,
      tokens.CloseParen,
    );
    element.unit = statement.rule(state);

    return element;
  },
);

const otherwiseStatement = rule(
  sequence(tokens.OTHERWISE),
  (state: ParserState): ast.OtherwiseStatement => {
    const element = ast.createOtherwiseStatement();

    state.consume(
      element,
      CstNodeKind.OtherwiseStatement_OTHERWISE,
      tokens.OTHERWISE,
    );
    element.unit = statement.rule(state);

    return element;
  },
);

const signalStatement = rule(
  sequence(tokens.SIGNAL),
  (state: ParserState): ast.SignalStatement => {
    const element = ast.createSignalStatement();

    state.consume(element, CstNodeKind.SignalStatement_SIGNAL, tokens.SIGNAL);
    const cond = condition.rule(state);
    cond && element.condition.push(cond);
    state.consume(
      element,
      CstNodeKind.SignalStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const stopStatement = rule(
  sequence(tokens.STOP),
  (state: ParserState): ast.StopStatement => {
    const element = ast.createStopStatement();

    state.consume(element, CstNodeKind.StopStatement_STOP, tokens.STOP);
    state.consume(
      element,
      CstNodeKind.StopStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const waitStatement = rule(
  sequence(tokens.WAIT),
  (state: ParserState): ast.WaitStatement => {
    const element = ast.createWaitStatement();
    state.consume(element, CstNodeKind.WaitStatement_WAIT, tokens.WAIT);
    state.consume(element, CstNodeKind.WaitStatement_THREAD, tokens.THREAD);
    state.consume(
      element,
      CstNodeKind.WaitStatement_OpenParen,
      tokens.OpenParen,
    );
    element.task = locatorCall.rule(state);
    state.consume(
      element,
      CstNodeKind.WaitStatement_CloseParen,
      tokens.CloseParen,
    );
    state.consume(
      element,
      CstNodeKind.WaitStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const writeStatement = rule(
  sequence(tokens.WRITE),
  (state: ParserState): ast.WriteStatement => {
    const element = ast.createWriteStatement();

    state.consume(element, CstNodeKind.WriteStatement_WRITE, tokens.WRITE);

    const { inc } = state.createLoopContext("WriteStatement");
    while (state.canConsumeFirst(writeStatementOption.first())) {
      inc();
      const option = writeStatementOption.rule(state);
      option && element.arguments.push(option);
    }

    state.consume(
      element,
      CstNodeKind.WriteStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const writeStatementOption = rule(
  sequence(tokens.WriteStatementType),
  (state: ParserState): ast.WriteStatementOption => {
    const element = ast.createWriteStatementOption();

    const typeToken = state.consume(
      element,
      CstNodeKind.WriteStatementFile_FILE,
      tokens.WriteStatementType,
    );
    if (typeToken) {
      element.type = tokens.WriteStatementType.mapToEnumLiteral(
        typeToken.tokenTypeIdx,
      );
    }

    state.consume(
      element,
      CstNodeKind.WriteStatementFile_OpenParen,
      tokens.OpenParen,
    );
    element.value = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.WriteStatementFile_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const initAcrossAttribute = rule(
  sequence(tokens.INITACROSS),
  (state: ParserState): ast.InitAcrossAttribute => {
    const element = ast.createInitAcrossAttribute();
    element.token = state.consume(
      element,
      CstNodeKind.InitAcrossAttribute_INITACROSS,
      tokens.INITACROSS,
    );
    state.consume(
      element,
      CstNodeKind.InitAcrossAttribute_OpenParen,
      tokens.OpenParen,
    );
    const list = initAcrossList.rule(state);
    if (list) {
      element.lists.push(list);
    }
    const { inc } = state.createLoopContext("InitAcrossAttribute");
    while (
      state.tryConsume(
        element,
        CstNodeKind.InitAcrossAttribute_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const nextList = initAcrossList.rule(state);
      if (nextList) {
        element.lists.push(nextList);
      }
    }
    state.consume(
      element,
      CstNodeKind.InitAcrossAttribute_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const initAcrossList = rule(
  () => initAcrossExpression.first(),
  (state: ParserState): ast.InitAcrossList => {
    const element = ast.createInitAcrossList();
    state.consume(
      element,
      CstNodeKind.InitAcrossList_OpenParen,
      tokens.OpenParen,
    );
    const expr = expression.rule(state, { multiple: true, init: true });
    if (expr) {
      element.expressions.push(expr);
    }
    const { inc } = state.createLoopContext("InitAcrossList");
    while (
      state.tryConsume(element, CstNodeKind.InitAcrossList_Comma, tokens.Comma)
    ) {
      inc();
      const nextExpr = expression.rule(state, { multiple: true, init: true });
      if (nextExpr) {
        element.expressions.push(nextExpr);
      }
    }
    state.consume(
      element,
      CstNodeKind.InitAcrossList_CloseParen,
      tokens.CloseParen,
    );
    return element;
  },
);

const initialAttribute = rule(
  choice(sequence(tokens.INITIAL)),
  (
    state: ParserState,
  ):
    | ast.InitialAttribute
    | ast.InitialCallAttribute
    | ast.InitialToAttribute
    | null => {
    // Manual lookahead, because our lookahead can't decide between INITIAL CALL, INITIAL TO and just INITIAL
    if (state.canConsume(tokens.INITIAL, tokens.CALL)) {
      return initialCallAttribute.rule(state);
    } else if (state.canConsume(tokens.INITIAL, tokens.TO)) {
      return initialToAttribute.rule(state);
    }

    const element = ast.createInitialAttribute();

    if (state.canConsume(tokens.INITIAL)) {
      const token = state.consume(
        element,
        CstNodeKind.InitialAttribute_INITIAL,
        tokens.INITIAL,
      );
      element.initial = token;

      if (
        state.tryConsume(
          element,
          CstNodeKind.InitialAttribute_OpenParen,
          tokens.OpenParen,
        )
      ) {
        // Allow empty parentheses
        if (state.canConsumeFirst(expression.first())) {
          const expr = expression.rule(state, {
            multiple: true,
            init: true,
          });
          expr && element.expressions.push(expr);
          const { inc } = state.createLoopContext("InitialAttribute");
          while (
            state.tryConsume(
              element,
              CstNodeKind.InitialAttribute_Comma,
              tokens.Comma,
            )
          ) {
            inc();
            const nextExpr = expression.rule(state, {
              multiple: true,
              init: true,
            });
            nextExpr && element.expressions.push(nextExpr);
          }
        }
        state.consume(
          element,
          CstNodeKind.InitialAttribute_CloseParen,
          tokens.CloseParen,
        );
      }
    }

    return element;
  },
);

const initialCallAttribute = rule(
  throwHasManualLookahead,
  (state: ParserState): ast.InitialCallAttribute => {
    const attribute = ast.createInitialCallAttribute();
    attribute.initial = state.consume(
      attribute,
      CstNodeKind.InitialCallAttribute_INITIAL,
      tokens.INITIAL,
    );
    state.consume(
      attribute,
      CstNodeKind.InitialCallAttribute_CALL,
      tokens.CALL,
    );
    attribute.procedureCall = referenceItem.rule(state);
    return attribute;
  },
);

const initialToAttribute = rule(
  throwHasManualLookahead,
  (state: ParserState): ast.InitialToAttribute => {
    const attribute = ast.createInitialToAttribute();
    attribute.initial = state.consume(
      attribute,
      CstNodeKind.InitialToAttribute_INITIAL,
      tokens.INITIAL,
    );
    state.consume(attribute, CstNodeKind.InitialToAttribute_TO, tokens.TO);
    state.consume(
      attribute,
      CstNodeKind.InitialToAttribute_OpenParenTo,
      tokens.OpenParen,
    );
    if (state.canConsume(tokens.Varying)) {
      const varyingToken = state.consume(
        attribute,
        CstNodeKind.InitialToAttribute_VARYING,
        tokens.Varying,
      );
      if (varyingToken) {
        attribute.varying = tokens.Varying.mapToEnumLiteral(
          varyingToken.tokenTypeIdx,
        );
      }

      if (state.canConsume(tokens.CharType)) {
        const typeToken = state.consume(
          attribute,
          CstNodeKind.InitialToAttribute_CHAR,
          tokens.CharType,
        );
        if (typeToken) {
          attribute.type = tokens.CharType.mapToEnumLiteral(
            typeToken.tokenTypeIdx,
          );
        }
      }
    } else if (state.canConsume(tokens.CharType)) {
      const typeToken = state.consume(
        attribute,
        CstNodeKind.InitialToAttribute_CHAR,
        tokens.CharType,
      );
      if (typeToken) {
        attribute.type = tokens.CharType.mapToEnumLiteral(
          typeToken.tokenTypeIdx,
        );
      }

      if (state.canConsume(tokens.Varying)) {
        const varyingToken = state.consume(
          attribute,
          CstNodeKind.InitialToAttribute_VARYING,
          tokens.Varying,
        );
        if (varyingToken) {
          attribute.varying = tokens.Varying.mapToEnumLiteral(
            varyingToken.tokenTypeIdx,
          );
        }
      }
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
    }
    state.consume(
      attribute,
      CstNodeKind.InitialToAttribute_CloseParenTo,
      tokens.CloseParen,
    );
    state.consume(
      attribute,
      CstNodeKind.InitialToAttribute_OpenParenItems,
      tokens.OpenParen,
    );
    const item = expression.rule(state, { multiple: true, init: true });
    if (item) {
      attribute.expressions.push(item);
    }
    const { inc } = state.createLoopContext("InitialToAttribute");
    while (
      state.tryConsume(
        attribute,
        CstNodeKind.InitialToAttribute_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const nextItem = expression.rule(state, { multiple: true, init: true });
      if (nextItem) {
        attribute.expressions.push(nextItem);
      }
    }
    state.consume(
      attribute,
      CstNodeKind.InitialToAttribute_CloseParenItems,
      tokens.CloseParen,
    );
    return attribute;
  },
);

const initAcrossExpression = rule(
  sequence(tokens.OpenParen),
  (state: ParserState): ast.InitAcrossList => {
    const element = ast.createInitAcrossList();

    state.consume(
      element,
      CstNodeKind.InitAcrossList_OpenParen,
      tokens.OpenParen,
    );
    const lhs = expression.rule(state);
    lhs && element.expressions.push(lhs);

    const { inc } = state.createLoopContext("InitAcrossExpression");
    while (
      state.tryConsume(element, CstNodeKind.InitAcrossList_Comma, tokens.Comma)
    ) {
      inc();
      const rhs = expression.rule(state);
      rhs && element.expressions.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.InitAcrossList_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const declareStatement = rule(
  sequence(tokens.DECLARE),
  (state: ParserState): ast.DeclareStatement => {
    const element = ast.createDeclareStatement();

    const declareToken = state.consume(
      element,
      CstNodeKind.DeclareStatement_DECLARE,
      tokens.DECLARE,
    );
    if (declareToken?.image.charAt(0).toUpperCase() === "X") {
      element.xDeclare = true;
    }

    const lhs = declaredItem.rule(state);
    lhs && element.items.push(lhs);
    const { inc } = state.createLoopContext("DeclareStatement");
    while (
      state.tryConsume(
        element,
        CstNodeKind.DeclareStatement_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = declaredItem.rule(state);
      rhs && element.items.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.DeclareStatement_Semicolon,
      tokens.Semicolon,
    );

    return element;
  },
);

const declaredItem = rule(
  choice(
    sequence(tokens.NUMBER),
    () => declaredVariable.first(),
    sequence(tokens.Star),
    sequence(tokens.OpenParen),
  ),
  (state: ParserState): ast.DeclaredItem => {
    let element = ast.createDeclaredItem();

    // Optional level number
    if (
      state.tryConsume(
        element,
        CstNodeKind.DeclaredItem_LevelNumber,
        tokens.NUMBER,
      )
    ) {
      const levelToken = state.last;
      if (levelToken) {
        element.startToken = levelToken;
        element.levelToken = levelToken;
        element.level = parseInt(levelToken.image, 10);
      }
    }

    // Main content: variable, wildcard, or nested items
    if (state.canConsumeFirst(declaredVariable.first())) {
      if (element.startToken == null) {
        element.startToken = state.token!;
      }
      const variable = declaredVariable.rule(state);
      variable && element.elements.push(variable);
    } else if (
      state.tryConsume(element, CstNodeKind.WildcardItem_Asterisk, tokens.Star)
    ) {
      if (element.startToken == null) {
        element.startToken = state.last!;
      }
      const wildcard: ast.WildcardItem = {
        kind: ast.SyntaxKind.WildcardItem,
        container: null,
        token: state.last!,
      };
      element.elements.push(wildcard);
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.DeclaredItem_OpenParen,
        tokens.OpenParen,
      )
    ) {
      if (element.startToken == null) {
        element.startToken = state.last!;
      }
      // Nested items in parentheses
      const lhs = declaredItem.rule(state);
      lhs && element.elements.push(lhs);

      const { inc } = state.createLoopContext("DeclaredItem 1");
      while (
        state.tryConsume(element, CstNodeKind.DeclaredItem_Comma, tokens.Comma)
      ) {
        inc();
        const rhs = declaredItem.rule(state);
        rhs && element.elements.push(rhs);
      }

      state.consume(
        element,
        CstNodeKind.DeclaredItem_CloseParen,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    // Parse attributes (can appear multiple times)
    const { inc } = state.createLoopContext("DeclaredItem 2");
    while (state.canConsumeFirst(declarationAttribute.first())) {
      inc();
      const attr = declarationAttribute.rule(state);
      attr && element.attributes.push(attr);
    }

    element.endToken = state.last || null;

    return element;
  },
);

const declaredVariable = rule(
  sequence(tokens.ID),
  (state: ParserState): ast.DeclaredVariable => {
    const element = ast.createDeclaredVariable();

    const idToken = state.consume(
      element,
      CstNodeKind.DeclaredVariable_Name,
      tokens.ID,
    );
    if (idToken) {
      element.name = idToken.image;
      element.nameToken = idToken;
    }

    return element;
  },
);

const commonDeclarationAttributes: (() => RuleFirstPair<ast.CommonDeclarationAttribute>)[] =
  [
    () => initialAttribute,
    () => initAcrossAttribute,
    () => dateAttribute,
    () => handleAttribute,
    () => definedAttribute,
    () => pictureAttribute,
    () => environmentAttribute,
    () => dimensionsDataAttribute,
    () => valueListFromAttribute,
    () => valueListAttribute,
    () => valueRangeAttribute,
    () => returnsAttribute,
    () => computationDataAttribute,
    () => anyAttribute,
    () => entryAttribute,
    () => likeAttribute,
    () => typeAttribute,
    () => genericAttribute,
    () => indForAttribute,
    () => reservedAttribute,
  ];

const defaultDeclarationAttribute = orRule<ast.DefaultDeclarationAttribute, []>(
  ...commonDeclarationAttributes,
  () => defaultValueAttribute,
);

const declarationAttribute = orRule<ast.DeclarationAttribute, []>(
  ...commonDeclarationAttributes,
  () => valueAttribute,
);

const dateAttribute = rule(
  sequence(tokens.DATE),
  (state: ParserState): ast.DateAttribute => {
    const element = ast.createDateAttribute();

    state.consume(element, CstNodeKind.DateAttribute_DATE, tokens.DATE);

    if (
      state.tryConsume(
        element,
        CstNodeKind.DateAttribute_OpenParen,
        tokens.OpenParen,
      )
    ) {
      const patternToken = state.consume(
        element,
        CstNodeKind.DateAttribute_PatternString,
        tokens.STRING_TERM,
      );
      if (patternToken) {
        element.pattern = patternToken.image;
      }
      state.consume(
        element,
        CstNodeKind.DateAttribute_CloseParen,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const definedAttribute = rule(
  sequence(tokens.DEFINED),
  (state: ParserState): ast.DefinedAttribute => {
    const element = ast.createDefinedAttribute();

    state.consume(
      element,
      CstNodeKind.DefinedAttribute_DEFINED,
      tokens.DEFINED,
    );

    if (state.canConsumeFirst(memberCall.first())) {
      element.reference = memberCall.rule(state);
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.DefinedAttribute_OpenParenRef,
        tokens.OpenParen,
      )
    ) {
      element.reference = memberCall.rule(state);
      state.consume(
        element,
        CstNodeKind.DefinedAttribute_CloseParenRef,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    if (
      state.tryConsume(
        element,
        CstNodeKind.DefinedAttribute_POSITION,
        tokens.POSITION,
      )
    ) {
      state.consume(
        element,
        CstNodeKind.DefinedAttribute_OpenParenPos,
        tokens.OpenParen,
      );
      element.position = expression.rule(state);
      state.consume(
        element,
        CstNodeKind.DefinedAttribute_CloseParenPos,
        tokens.CloseParen,
      );
    }

    return element;
  },
);

const pictureAttribute = rule(
  choice(sequence(tokens.PICTURE), sequence(tokens.WIDEPIC)),
  (state: ParserState): ast.PictureAttribute => {
    const element = ast.createPictureAttribute();

    if (state.canConsume(tokens.PICTURE)) {
      element.pictureToken = state.consume(
        element,
        CstNodeKind.PictureAttribute_PICTURE,
        tokens.PICTURE,
      );
    } else if (state.canConsume(tokens.WIDEPIC)) {
      element.pictureToken = state.consume(
        element,
        CstNodeKind.PictureAttribute_WIDEPIC,
        tokens.WIDEPIC,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    if (state.canConsume(tokens.STRING_TERM)) {
      const pictureStringToken = state.consume(
        element,
        CstNodeKind.PictureAttribute_PictureString,
        tokens.STRING_TERM,
      );
      if (pictureStringToken) {
        element.picture = pictureStringToken.image;
      }
    }

    return element;
  },
);

const dimensionsDataAttribute = rule(
  choice(sequence(tokens.DIMENSION), () => dimensions.first()),
  (state: ParserState): ast.DimensionsDataAttribute => {
    const element = ast.createDimensionsDataAttribute();

    // Optional DIMENSION keyword
    state.tryConsume(
      element,
      CstNodeKind.DimensionsDataAttribute_DIMENSION,
      tokens.DIMENSION,
    );

    // Required dimensions
    element.dimensions = dimensions.rule(state);

    return element;
  },
);

const typeAttribute = rule(
  sequence(tokens.TypeOrOrdinal),
  (state: ParserState): ast.TypeAttribute => {
    const element = ast.createTypeAttribute();

    // "TYPE" and "ORDINAL" are interchangeable here
    // We need to validate that the "ORDINAL" keyword is used exclusively with ordinal types
    // We do this in the validation phase
    element.typeToken = state.consume(
      element,
      CstNodeKind.TypeAttribute_TYPE,
      tokens.TypeOrOrdinal,
    );

    if (state.canConsume(tokens.ID)) {
      // Simple type reference: TYPE MYTYPE
      const idToken = state.consume(
        element,
        CstNodeKind.TypeAttribute_TypeId0,
        tokens.ID,
      );
      if (idToken) {
        element.type = ast.createReference(
          element,
          idToken,
          ast.ReferenceType.Type,
        );
      }
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.TypeAttribute_OpenParen,
        tokens.OpenParen,
      )
    ) {
      // Parenthesized type reference: TYPE (MYTYPE)
      const idToken = state.consume(
        element,
        CstNodeKind.TypeAttribute_TypeId1,
        tokens.ID,
      );
      if (idToken) {
        element.type = ast.createReference(
          element,
          idToken,
          ast.ReferenceType.Type,
        );
      }
      state.consume(
        element,
        CstNodeKind.TypeAttribute_CloseParen,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    return element;
  },
);

const returnsAttribute = rule(
  sequence(tokens.RETURNS),
  (state: ParserState): ast.ReturnsAttribute => {
    const element = ast.createReturnsAttribute();

    state.consume(
      element,
      CstNodeKind.ReturnsAttribute_RETURNS,
      tokens.RETURNS,
    );
    state.consume(
      element,
      CstNodeKind.ReturnsAttribute_OpenParen,
      tokens.OpenParen,
    );

    // Parse zero or more declaration attributes
    const { inc } = state.createLoopContext("ReturnsAttribute");
    while (
      !state.eof &&
      (state.canConsumeFirst(computationDataAttribute.first()) ||
        state.canConsumeFirst(dateAttribute.first()) ||
        state.canConsumeFirst(valueListAttribute.first()) ||
        state.canConsumeFirst(valueRangeAttribute.first()) ||
        state.canConsumeFirst(anyAttribute.first()))
    ) {
      inc();
      if (state.canConsumeFirst(computationDataAttribute.first())) {
        const attr = computationDataAttribute.rule(state);
        attr && element.attrs.push(attr);
      } else if (state.canConsumeFirst(dateAttribute.first())) {
        const attr = dateAttribute.rule(state);
        attr && element.attrs.push(attr);
      } else if (state.canConsumeFirst(valueListAttribute.first())) {
        const attr = valueListAttribute.rule(state);
        attr && element.attrs.push(attr);
      } else if (state.canConsumeFirst(valueRangeAttribute.first())) {
        const attr = valueRangeAttribute.rule(state);
        attr && element.attrs.push(attr);
      } else if (state.canConsumeFirst(anyAttribute.first())) {
        const attr = anyAttribute.rule(state);
        attr && element.attrs.push(attr);
      }
    }

    state.consume(
      element,
      CstNodeKind.ReturnsAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const anyAttribute = rule(
  sequence(tokens.ANY),
  (state: ParserState): ast.AnyAttribute => {
    const element = ast.createAnyAttribute();
    element.token = state.consume(
      element,
      CstNodeKind.AnyAttribute_ANY,
      tokens.ANY,
    );
    if (
      state.tryConsume(
        element,
        CstNodeKind.AnyAttribute_OpenAngle,
        tokens.LessThan,
      )
    ) {
      const dataTypeToken = state.consume(
        element,
        CstNodeKind.AnyAttribute_DataType,
        tokens.DataTypes,
      );
      element.dataType = tokens.DataTypes.mapToEnumLiteral(
        dataTypeToken!.tokenTypeIdx,
      );
      state.consume(
        element,
        CstNodeKind.AnyAttribute_CloseAngle,
        tokens.GreaterThan,
      );
    }
    if (state.canConsumeFirst(dimensions.first())) {
      element.dimensions = dimensions.rule(state);
    }
    return element;
  },
);

const computationDataAttribute = rule(
  sequence(tokens.DefaultAttribute),
  (state: ParserState): ast.ComputationDataAttribute => {
    const element = ast.createComputationDataAttribute();

    const token = state.consume(
      element,
      CstNodeKind.DefaultAttribute_Value,
      tokens.DefaultAttribute,
    );
    if (token) {
      element.typeToken = token;
      element.type = tokens.DefaultAttribute.mapToEnumLiteral(
        token.tokenTypeIdx,
      );
    }

    // Optional dimensions
    if (state.canConsumeFirst(dimensions.first())) {
      element.dimensions = dimensions.rule(state);
    }

    return element;
  },
);

const defaultValueAttribute = rule(
  sequence(tokens.VALUE),
  (state: ParserState): ast.DefaultValueAttribute => {
    const element = ast.createDefaultValueAttribute();

    state.consume(
      element,
      CstNodeKind.DefaultValueAttribute_VALUE,
      tokens.VALUE,
    );
    state.consume(
      element,
      CstNodeKind.DefaultValueAttribute_OpenParen,
      tokens.OpenParen,
    );

    const lhs = defaultValueAttributeItem.rule(state);
    lhs && element.items.push(lhs);
    const { inc } = state.createLoopContext("DefaultValueAttribute");
    while (
      state.tryConsume(
        element,
        CstNodeKind.DefaultValueAttribute_Comma,
        tokens.Comma,
      )
    ) {
      inc();
      const rhs = defaultValueAttributeItem.rule(state);
      rhs && element.items.push(rhs);
    }

    state.consume(
      element,
      CstNodeKind.DefaultValueAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const valueAttribute = rule(
  sequence(tokens.VALUE),
  (state: ParserState): ast.ValueAttribute => {
    const element = ast.createValueAttribute();

    state.consume(element, CstNodeKind.ValueAttribute_VALUE, tokens.VALUE);
    state.consume(
      element,
      CstNodeKind.ValueAttribute_OpenParen,
      tokens.OpenParen,
    );
    element.value = expression.rule(state);
    state.consume(
      element,
      CstNodeKind.ValueAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const defaultValueAttributeItem = rule(
  () => declarationAttribute.first(),
  (state: ParserState): ast.DefaultValueAttributeItem => {
    const element = ast.createDefaultValueAttributeItem();

    // Parse at least one declaration attribute
    const lhs = declarationAttribute.rule(state);
    lhs && element.attributes.push(lhs);

    // Parse additional attributes
    const { inc } = state.createLoopContext("DefaultValueAttributeItem");
    while (state.canConsumeFirst(declarationAttribute.first())) {
      inc();
      const rhs = declarationAttribute.rule(state);
      rhs && element.attributes.push(rhs);
    }

    return element;
  },
);

const valueListAttribute = rule(
  sequence(tokens.VALUELIST),
  (state: ParserState): ast.ValueListAttribute => {
    const element = ast.createValueListAttribute();

    state.consume(
      element,
      CstNodeKind.ValueListAttribute_VALUELIST,
      tokens.VALUELIST,
    );
    state.consume(
      element,
      CstNodeKind.ValueListAttribute_OpenParen,
      tokens.OpenParen,
    );

    if (state.canConsumeFirst(expression.first())) {
      const lhs = expression.rule(state);
      lhs && element.values.push(lhs);
      const { inc } = state.createLoopContext("ValueListAttribute");
      while (
        state.tryConsume(
          element,
          CstNodeKind.ValueListAttribute_Comma,
          tokens.Comma,
        )
      ) {
        inc();
        const rhs = expression.rule(state);
        rhs && element.values.push(rhs);
      }
    }

    state.consume(
      element,
      CstNodeKind.ValueListAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const valueListFromAttribute = rule(
  sequence(tokens.VALUELISTFROM),
  (state: ParserState): ast.ValueListFromAttribute => {
    const element = ast.createValueListFromAttribute();

    state.consume(
      element,
      CstNodeKind.ValueListFromAttribute_VALUELISTFROM,
      tokens.VALUELISTFROM,
    );
    element.from = locatorCall.rule(state);

    return element;
  },
);

const valueRangeAttribute = rule(
  sequence(tokens.VALUERANGE),
  (state: ParserState): ast.ValueRangeAttribute => {
    const element = ast.createValueRangeAttribute();

    state.consume(
      element,
      CstNodeKind.ValueRangeAttribute_VALUERANGE,
      tokens.VALUERANGE,
    );
    state.consume(
      element,
      CstNodeKind.ValueRangeAttribute_OpenParen,
      tokens.OpenParen,
    );

    if (state.canConsumeFirst(expression.first())) {
      const lhs = expression.rule(state);
      lhs && element.values.push(lhs);
      const { inc } = state.createLoopContext("ValueRangeAttribute");
      while (
        state.tryConsume(
          element,
          CstNodeKind.ValueRangeAttribute_Comma,
          tokens.Comma,
        )
      ) {
        inc();
        const rhs = expression.rule(state);
        rhs && element.values.push(rhs);
      }
    }

    state.consume(
      element,
      CstNodeKind.ValueRangeAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const likeAttribute = rule(
  sequence(tokens.LIKE),
  (state: ParserState): ast.LikeAttribute => {
    const element = ast.createLikeAttribute();

    element.likeToken = state.consume(
      element,
      CstNodeKind.LikeAttribute_LIKE,
      tokens.LIKE,
    );
    element.reference = locatorCall.rule(state);

    return element;
  },
);

const handleAttribute = rule(
  sequence(tokens.HANDLE),
  (state: ParserState): ast.HandleAttribute => {
    const element = ast.createHandleAttribute();

    state.consume(element, CstNodeKind.HandleAttribute_HANDLE, tokens.HANDLE);

    // Optional size in parentheses
    if (state.canConsume(tokens.OpenParen, tokens.NUMBER)) {
      state.consume(
        element,
        CstNodeKind.HandleAttribute_OpenParenSize,
        tokens.OpenParen,
      );
      const sizeToken = state.consume(
        element,
        CstNodeKind.HandleAttribute_SizeNumber,
        tokens.NUMBER,
      );
      if (sizeToken) {
        element.size = sizeToken.image;
      }
      state.consume(
        element,
        CstNodeKind.HandleAttribute_CloseParenSize,
        tokens.CloseParen,
      );
    }

    // Required type reference
    if (state.canConsume(tokens.ID)) {
      // Simple type reference: HANDLE MYTYPE
      const idToken = state.consume(
        element,
        CstNodeKind.HandleAttribute_TypeId0,
        tokens.ID,
      );
      if (idToken) {
        element.type = ast.createReference(
          element,
          idToken,
          ast.ReferenceType.Type,
        );
      }
    } else if (
      state.tryConsume(
        element,
        CstNodeKind.HandleAttribute_OpenParenType,
        tokens.OpenParen,
      )
    ) {
      // Parenthesized type reference: HANDLE (MYTYPE)
      const idToken = state.consume(
        element,
        CstNodeKind.HandleAttribute_TypeId1,
        tokens.ID,
      );
      if (idToken) {
        element.type = ast.createReference(
          element,
          idToken,
          ast.ReferenceType.Type,
        );
      }
      state.consume(
        element,
        CstNodeKind.HandleAttribute_CloseParenType,
        tokens.CloseParen,
      );
    } else {
      state.error(Severe.IBM3988I.message, state.token, Severity.S);
      return element;
    }

    return element;
  },
);

const dimensions = rule(
  sequence(tokens.OpenParen),
  (state: ParserState): ast.Dimensions => {
    const element = ast.createDimensions();

    const openToken = state.consume(
      element,
      CstNodeKind.Dimensions_OpenParen,
      tokens.OpenParen,
    );
    element.token = openToken;
    let startToken = openToken;
    let endToken: Token | null = null;

    // Optional dimension bounds
    if (state.canConsumeFirst(dimensionBound.first())) {
      let current = dimensionBound.rule(state, ast.ReferenceType.Variable);
      current && element.dimensions.push(current);
      const { inc } = state.createLoopContext("Dimensions");
      while (
        (endToken = state.tryConsume(
          element,
          CstNodeKind.Dimensions_Comma,
          tokens.Comma,
        ))
      ) {
        inc();
        applyBoundsTokens(current);
        startToken = endToken;
        current = dimensionBound.rule(state, ast.ReferenceType.Variable);
        current && element.dimensions.push(current);
      }
    }

    endToken = state.consume(
      element,
      CstNodeKind.Dimensions_CloseParen,
      tokens.CloseParen,
    );

    if (element.dimensions.length > 0) {
      applyBoundsTokens(element.dimensions[element.dimensions.length - 1]);
    }

    return element;

    function applyBoundsTokens(bounds: ast.DimensionBound | null) {
      if (bounds) {
        bounds.startToken = startToken;
        bounds.endToken = endToken;
      }
    }
  },
);

const dimensionsWithTypes = rule(
  sequence(tokens.OpenParenColon),
  (state: ParserState): ast.Dimensions => {
    const element = ast.createDimensions();

    const openToken = state.consume(
      element,
      CstNodeKind.Dimensions_OpenParenColon,
      tokens.OpenParenColon,
    );
    element.token = openToken;
    let startToken = openToken;
    let endToken: Token | null = null;

    // Optional dimension bounds
    if (state.canConsumeFirst(dimensionBound.first())) {
      let current = dimensionBound.rule(
        state,
        ast.ReferenceType.TypeOrVariable,
      );
      current && element.dimensions.push(current);
      const { inc } = state.createLoopContext("DimensionsWithTypes");
      while (
        (endToken = state.tryConsume(
          element,
          CstNodeKind.Dimensions_Comma,
          tokens.Comma,
        ))
      ) {
        inc();
        applyBoundsTokens(current);
        startToken = endToken;
        current = dimensionBound.rule(state, ast.ReferenceType.TypeOrVariable);
        current && element.dimensions.push(current);
      }
    }

    endToken = state.consume(
      element,
      CstNodeKind.Dimensions_CloseParenColon,
      tokens.CloseParenColon,
    );

    if (element.dimensions.length > 0) {
      applyBoundsTokens(element.dimensions[element.dimensions.length - 1]);
    }

    return element;

    function applyBoundsTokens(bounds: ast.DimensionBound | null) {
      if (bounds) {
        bounds.startToken = startToken;
        bounds.endToken = endToken;
      }
    }
  },
);

const dimensionBound = rule(
  () => bound.first(),
  (state: ParserState, refType: ast.ReferenceType): ast.DimensionBound => {
    const element = ast.createDimensionBound();

    // First bound is the upper bound
    element.upper = bound.rule(state, refType);

    // Optional colon followed by lower bound
    if (
      state.tryConsume(element, CstNodeKind.DimensionBound_Colon, tokens.Colon)
    ) {
      element.lower = element.upper; // Move upper to lower
      element.upper = bound.rule(state, refType); // Parse new upper
    }

    return element;
  },
);

const bound = rule(
  () => expression.first(),
  (state: ParserState, refType?: ast.ReferenceType): ast.Bound => {
    const element = ast.createBound();

    // Expression bound
    element.token = state.token ?? null;
    element.expression = expression.rule(state, {
      refType: refType,
    });

    // Optional REFER clause
    if (state.tryConsume(element, CstNodeKind.Bound_REFER, tokens.REFER)) {
      state.consume(element, CstNodeKind.Bound_OpenParen, tokens.OpenParen);
      element.refer = locatorCall.rule(state);
      state.consume(element, CstNodeKind.Bound_CloseParen, tokens.CloseParen);
    }

    return element;
  },
);

const environmentAttribute = rule(
  sequence(tokens.ENVIRONMENT),
  (state: ParserState): ast.EnvironmentAttribute => {
    const element = ast.createEnvironmentAttribute();

    state.consume(
      element,
      CstNodeKind.EnvironmentAttribute_ENVIRONMENT,
      tokens.ENVIRONMENT,
    );
    state.consume(
      element,
      CstNodeKind.EnvironmentAttribute_OpenParen,
      tokens.OpenParen,
    );

    // Parse zero or more environment attribute items
    const { inc } = state.createLoopContext("EnvironmentAttribute");
    while (!state.eof && state.canConsumeFirst(environmentOptionItem.first())) {
      inc();
      const item = environmentOptionItem.rule(state);
      item && element.items.push(item);

      // TODO: research, This does not align to the language spec
      // Optional comma between items
      state.tryConsume(
        element,
        CstNodeKind.EnvironmentOptionItem_Comma,
        tokens.Comma,
      );
    }

    state.consume(
      element,
      CstNodeKind.EnvironmentAttribute_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const environmentOptionItem = orRule<ast.EnvironmentOptionItem, []>(
  () => environmentOptionOrganization,
  () => environmentOptionRecordFormat,
  () => environmentOptionSymbol,
  () => environmentOptionValue,
);

const environmentOptionSymbol = rule(
  sequence(tokens.EnvironmentOptionSymbolName),
  (state: ParserState): ast.EnvironmentOptionSymbol => {
    const element = ast.createEnvironmentOptionSymbol();

    element.token = state.consume(
      element,
      CstNodeKind.EnvironmentOptionSymbol_Name,
      tokens.EnvironmentOptionSymbolName,
    );
    if (element.token) {
      element.name = tokens.EnvironmentOptionSymbolName.mapToEnumLiteral(
        element.token.tokenTypeIdx,
      );
    }

    return element;
  },
);

const environmentOptionValue = rule(
  sequence(tokens.EnvironmentOptionValueName),
  (state: ParserState): ast.EnvironmentOptionValue => {
    const element = ast.createEnvironmentOptionValue();

    element.token = state.consume(
      element,
      CstNodeKind.EnvironmentOptionValue_Name,
      tokens.EnvironmentOptionValueName,
    );
    if (element.token) {
      element.name = tokens.EnvironmentOptionValueName.mapToEnumLiteral(
        element.token.tokenTypeIdx,
      );
    }
    state.consume(
      element,
      CstNodeKind.EnvironmentOptionValue_OpenParen,
      tokens.OpenParen,
    );

    const expr = expression.rule(state);
    expr && (element.value = expr);

    state.consume(
      element,
      CstNodeKind.EnvironmentOptionValue_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const environmentOptionRecordFormat = rule(
  sequence(tokens.RecordFormat),
  (state: ParserState): ast.EnvironmentOptionRecordFormat => {
    const element = ast.createEnvironmentOptionRecordFormat();

    const token = state.consume(
      element,
      CstNodeKind.EnvironmentOptionRecordFormat_RECORDFORMAT,
      tokens.RecordFormat,
    );
    if (token) {
      element.token = token;
      element.format = tokens.RecordFormat.mapToEnumLiteral(token.tokenTypeIdx);
    }

    return element;
  },
);

const environmentOptionOrganization = rule(
  sequence(tokens.ORGANIZATION),
  (state: ParserState): ast.EnvironmentOptionOrganization => {
    const element = ast.createEnvironmentOptionOrganization();

    state.consume(
      element,
      CstNodeKind.EnvironmentOptionOrganization_ORGANIZATION,
      tokens.ORGANIZATION,
    );
    state.consume(
      element,
      CstNodeKind.EnvironmentOptionOrganization_OpenParen,
      tokens.OpenParen,
    );

    const orgToken = state.consume(
      element,
      CstNodeKind.EnvironmentOptionOrganization_Organization,
      tokens.Organization,
    );
    if (orgToken) {
      element.token = orgToken;
      element.organization = tokens.Organization.mapToEnumLiteral(
        orgToken.tokenTypeIdx,
      );
    }

    state.consume(
      element,
      CstNodeKind.EnvironmentOptionOrganization_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const entryAttribute = rule(
  choice(sequence(tokens.LIMITED), sequence(tokens.ENTRY)),
  (state: ParserState): ast.EntryAttribute => {
    const element = ast.createEntryAttribute();

    // Parse zero or more LIMITED tokens at the beginning
    const { inc } = state.createLoopContext("EntryAttribute 1");
    while (
      state.tryConsume(
        element,
        CstNodeKind.EntryAttribute_Limited0,
        tokens.LIMITED,
      )
    ) {
      inc();
      const limitedToken = state.last;
      if (limitedToken) {
        element.limited.push(limitedToken);
      }
    }

    // Parse required ENTRY token
    element.entryToken = state.consume(
      element,
      CstNodeKind.EntryAttribute_ENTRY,
      tokens.ENTRY,
    );

    // Optional parameter list
    if (
      state.tryConsume(
        element,
        CstNodeKind.EntryAttribute_OpenParenAttribute,
        tokens.OpenParen,
      )
    ) {
      // DISCREPANCY: The language spec says that the parameter list cannot be empty
      // But the compiler seems to allow it, so we do the same here
      if (state.canConsumeFirst(entryDescription.first())) {
        const lhs = entryDescription.rule(state);
        lhs && element.attributes.push(lhs);

        const { inc } = state.createLoopContext("EntryAttribute 2");
        while (
          state.tryConsume(
            element,
            CstNodeKind.EntryAttribute_CommaAttribute,
            tokens.Comma,
          )
        ) {
          inc();
          const rhs = entryDescription.rule(state);
          rhs && element.attributes.push(rhs);
        }
      }
      state.consume(
        element,
        CstNodeKind.EntryAttribute_CloseParenAttribute,
        tokens.CloseParen,
      );
    }

    // Parse zero or more trailing options
    const { inc: inc3 } = state.createLoopContext("EntryAttribute 3");
    while (
      !state.eof &&
      (state.canConsumeFirst(options.first()) ||
        state.canConsume(tokens.VARIABLE) ||
        state.canConsume(tokens.LIMITED) ||
        state.canConsumeFirst(returnsOption.first()) ||
        state.canConsume(tokens.EXTERNAL))
    ) {
      inc3();
      if (state.canConsumeFirst(options.first())) {
        const opts = options.rule(state);
        opts && element.options.push(opts);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.EntryAttribute_Variable,
          tokens.VARIABLE,
        )
      ) {
        const variableToken = state.last;
        if (variableToken) {
          element.variable.push(variableToken);
        }
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.EntryAttribute_Limited1,
          tokens.LIMITED,
        )
      ) {
        const limitedToken = state.last;
        if (limitedToken) {
          element.limited.push(limitedToken);
        }
      } else if (state.canConsumeFirst(returnsOption.first())) {
        const option = returnsOption.rule(state);
        option && element.returns.push(option);
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.EntryAttribute_EXTERNAL,
          tokens.EXTERNAL,
        )
      ) {
        element.hasExternal = true;
        if (
          state.tryConsume(
            element,
            CstNodeKind.EntryAttribute_OpenParenEnv,
            tokens.OpenParen,
          )
        ) {
          const envExpression = expression.rule(state);
          envExpression && (element.environmentName = envExpression);
          state.consume(
            element,
            CstNodeKind.EntryAttribute_CloseParenEnv,
            tokens.CloseParen,
          );
        }
      }
    }

    return element;
  },
);

const returnsOption = rule(
  sequence(tokens.RETURNS),
  (state: ParserState): ast.ReturnsOption => {
    const element = ast.createReturnsOption();

    element.returnsToken = state.consume(
      element,
      CstNodeKind.ReturnsOption_RETURNS,
      tokens.RETURNS,
    );
    state.consume(
      element,
      CstNodeKind.ReturnsOption_OpenParen,
      tokens.OpenParen,
    );

    // Parse zero or more declaration attributes
    const { inc } = state.createLoopContext("ReturnsOption");
    while (!state.eof && state.canConsumeFirst(declarationAttribute.first())) {
      inc();
      const attr = declarationAttribute.rule(state);
      attr && element.returnAttributes.push(attr);
    }

    state.consume(
      element,
      CstNodeKind.ReturnsOption_CloseParen,
      tokens.CloseParen,
    );

    return element;
  },
);

const entryDescription = orRule<ast.EntryDescription, []>(
  () => entryParameterDescription,
  () => entryUnionDescription,
);

const entryParameterDescription = rule(
  choice(sequence(tokens.Star), () => declarationAttribute.first()),
  (state: ParserState): ast.EntryParameterDescription => {
    const element = ast.createEntryParameterDescription();

    if (
      state.tryConsume(
        element,
        CstNodeKind.EntryParameterDescription_Star,
        tokens.Star,
      )
    ) {
      element.star = true;
      // Parse optional attributes after the star
      const { inc } = state.createLoopContext("EntryParameterDescription 1");
      while (state.canConsumeFirst(declarationAttribute.first())) {
        inc();
        const attr = declarationAttribute.rule(state);
        attr && element.attributes.push(attr);
      }
    } else {
      // Parse at least one declaration attribute
      const lhs = declarationAttribute.rule(state);
      lhs && element.attributes.push(lhs);

      // Parse additional attributes
      const { inc } = state.createLoopContext("EntryParameterDescription 2");
      while (state.canConsumeFirst(declarationAttribute.first())) {
        inc();
        const rhs = declarationAttribute.rule(state);
        rhs && element.attributes.push(rhs);
      }
    }

    return element;
  },
);

const entryUnionDescription = rule(
  sequence(tokens.NUMBER),
  (state: ParserState): ast.EntryUnionDescription => {
    const element = ast.createEntryUnionDescription();

    const initToken = state.consume(
      element,
      CstNodeKind.EntryUnionDescription_InitNumber,
      tokens.NUMBER,
    );
    if (initToken) {
      element.init = initToken.image;
    }

    // Parse zero or more declaration attributes
    const { inc } = state.createLoopContext("EntryUnionDescription 1");
    while (state.canConsumeFirst(declarationAttribute.first())) {
      inc();
      const attr = declarationAttribute.rule(state);
      attr && element.attributes.push(attr);
    }

    // DISCREPANCY: The language spec says that there is a mandatory comma here
    // And that the prefixed attributes aren't separated by commas
    // However, this simply seems to be a documentation error in the syntax diagram

    const { inc: inc2 } = state.createLoopContext("EntryUnionDescription 2");
    // IMPORTANT NOTE: Since the comma can also indicate that the next element is a declaration attribute,
    // we have to check for both comma AND number here to prevent parser errors
    while (state.canConsume(tokens.Comma, tokens.NUMBER)) {
      inc2();
      state.consume(
        element,
        CstNodeKind.EntryUnionDescription_Comma,
        tokens.Comma,
      );
      const attr = prefixedAttribute.rule(state);
      attr && element.prefixedAttributes.push(attr);
    }

    return element;
  },
);

const prefixedAttribute = rule(
  sequence(tokens.NUMBER),
  (state: ParserState): ast.PrefixedAttribute => {
    const element = ast.createPrefixedAttribute();

    const levelToken = state.consume(
      element,
      CstNodeKind.PrefixedAttribute_LevelNumber,
      tokens.NUMBER,
    );
    if (levelToken) {
      element.level = levelToken.image;
    }

    // Parse zero or more declaration attributes
    const { inc } = state.createLoopContext("PrefixedAttribute");
    while (state.canConsumeFirst(declarationAttribute.first())) {
      inc();
      const attr = declarationAttribute.rule(state);
      attr && element.attributes.push(attr);
    }

    return element;
  },
);

const procedureParameter = rule(
  sequence(tokens.ID),
  (state: ParserState): ast.ProcedureParameter => {
    const element = ast.createProcedureParameter();

    const idToken = state.consume(
      element,
      CstNodeKind.ProcedureParameter_Id,
      tokens.ID,
    );
    if (idToken) {
      element.ref = ast.createReference(
        element,
        idToken,
        ast.ReferenceType.Variable,
      );
    }

    return element;
  },
);

const referenceItem = rule(
  sequence(tokens.ID),
  (state: ParserState, refType?: ast.ReferenceType): ast.ReferenceItem => {
    const element = ast.createReferenceItem();

    const idToken = state.consume(
      element,
      CstNodeKind.ReferenceItem_Ref,
      tokens.ID,
    );
    if (idToken) {
      element.ref = ast.createReference(
        element,
        idToken,
        refType ?? ast.ReferenceType.Variable,
      );
    }

    let withoutType = false;
    let withType = false;
    while (
      (withoutType = state.canConsumeFirst(dimensions.first())) ||
      (withType = state.canConsumeFirst(dimensionsWithTypes.first()))
    ) {
      if (withoutType) {
        // "Normal" dimensions, that simply target variables in their references
        const dim = dimensions.rule(state);
        dim && element.dimensions.push(dim);
      } else if (withType) {
        // Dimensions that can also target types in their references
        const dim = dimensionsWithTypes.rule(state);
        dim && element.dimensions.push(dim);
      }
    }
    return element;
  },
);

const expression = rule(
  () => primaryExpression.first(),
  (state: ParserState, params?: ExpressionParameter): ast.Expression | null => {
    params ??= {};
    const element: IntermediateBinaryExpression = {
      infix: true,
      items: [],
      operators: [],
      operatorTokens: [],
    };

    // Parse first primary expression
    const lhs = primaryExpression.rule(state, params);
    lhs && element.items.push(lhs);

    // Parse zero or more operator-expression pairs
    const { inc } = state.createLoopContext("BinaryExpression");
    while (state.canConsume(tokens.BinaryOperator)) {
      inc();
      const operatorToken = state.consume(
        element as any,
        CstNodeKind.BinaryExpression_Operator,
        tokens.BinaryOperator,
      );
      if (operatorToken) {
        element.operators.push(
          tokens.BinaryOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx),
        );
        element.operatorTokens.push(operatorToken);
      }
      const rhs = primaryExpression.rule(state, params);
      rhs && element.items.push(rhs);
    }

    return constructBinaryExpression(element);
  },
);

const primaryExpression = orRule<ast.Expression, [ExpressionParameter]>(
  () => stringLiteral,
  () => numberLiteral,
  () => parenthesizedExpression,
  () => unaryExpression,
  () => locatorCall,
  () => wildcardItem,
);

// Generally, wildcard expression (*) is not a valid expression on its own,
// However, there are so many contexts in which it is allowed
// (e.g. in array bounds, initial attribute values, initial attribute repetition).
// Therefore, we allow it to be parsed as an expression.
// We later have to check (in the type checker) whether it is used in a valid context or not
const wildcardItem = rule(
  sequence(tokens.Star),
  (state: ParserState): ast.WildcardItem => {
    const element = ast.createWildcardItem();

    element.token = state.consume(
      element,
      CstNodeKind.WildcardExpression_Star,
      tokens.Star,
    );

    return element;
  },
);

const parenthesizedExpression = rule(
  sequence(tokens.OpenParen),
  (
    state: ParserState,
    params: ExpressionParameter,
  ): ast.Parenthesis | ast.RepeatedExpression => {
    const element = ast.createParenthesis();
    state.consume(
      element,
      CstNodeKind.ParenthesizedExpression_OpenParen,
      tokens.OpenParen,
    );
    const expr = expression.rule(state, params);
    if (expr) {
      element.expressions.push(expr);
    }

    // Additional expressions separated by commas
    // This is not a general syntax rule, but is only allowed in specific parser contexts:
    // 1. In data specifications of PUT/GET statements, where it indicates multiple fields being specified together
    // 2. In INITIAL attribute expressions, where it indicates how to initialize an array of values
    // This is a workaround to allow parsing of both cases without having to introduce a separate syntax node
    // for a comma-separated list of expressions.
    // This would make both parsing and evaluation of ASTs exponentially more complicated.
    while (
      params.multiple &&
      state.tryConsume(
        element,
        CstNodeKind.ParenthesizedExpression_Comma,
        tokens.Comma,
      )
    ) {
      const nextExpr = expression.rule(state, params);
      if (nextExpr) {
        element.expressions.push(nextExpr);
      }
    }

    // Optional DO clause
    if (
      state.tryConsume(
        element,
        CstNodeKind.ParenthesizedExpression_DO,
        tokens.DO,
      )
    ) {
      element.do = doType3.rule(state);
    }

    state.consume(
      element,
      CstNodeKind.ParenthesizedExpression_CloseParen,
      tokens.CloseParen,
    );

    // See documentation of RepeatedExpression for details on this syntax
    if (params.init && repeatedExpressionLookahead(state)) {
      const repeated = expression.rule(state, params);
      if (repeated !== null) {
        const repeatedExpr = ast.createRepeatedExpression();
        repeatedExpr.count = element;
        repeatedExpr.expression = repeated;
        return repeatedExpr;
      }
    }

    return element;
  },
);

function repeatedExpressionLookahead(state: ParserState): boolean {
  // First check for the syntax that indicates a repeated expression
  if (!state.canConsumeFirst(expression.first())) {
    return false;
  }
  // Next, prevent ambiguities with wildcard expressions (*)
  // I.e. an expression like (2 + 3) * 5 should not be parsed as a repeated expression
  // with count (2 + 3) and wildcard item *
  if (state.canConsume(tokens.Star)) {
    const nextToken = state.peek(2);
    if (!nextToken) {
      return true;
    }
    // if the next token can start a new expression,
    // then the asterisk is not a wildcard, but a multiplication operator
    state.index++; // Temporarily consume the asterisk to check the next token
    const canStartExpression = state.canConsumeFirst(expression.first());
    state.index--;
    return !canStartExpression;
  }
  // We can safely assume that this is a repeated expression
  return true;
}

const memberCall = rule(
  () => referenceItem.first(),
  (state: ParserState, refType?: ast.ReferenceType): ast.MemberCall => {
    let element = ast.createMemberCall();

    // Parse first reference item
    element.element = referenceItem.rule(state, refType);

    // Parse zero or more dot-separated member accesses
    const { inc } = state.createLoopContext("MemberCall");
    while (state.canConsume(tokens.Dot)) {
      inc();
      // Create a new MemberCall for the chain
      const previous = element;
      element = {
        kind: ast.SyntaxKind.MemberCall,
        container: null,
        element: null,
        previous: previous,
      };
      state.consume(element, CstNodeKind.MemberCall_Dot, tokens.Dot);
      element.element = referenceItem.rule(state, refType);
    }

    return element;
  },
);

const locatorCall = rule(
  () => memberCall.first(),
  (state: ParserState, params?: ExpressionParameter): ast.LocatorCall => {
    let element = ast.createLocatorCall();

    // Parse first member call
    element.element = memberCall.rule(state, params?.refType);

    // Parse zero or more pointer/handle chains
    const { inc } = state.createLoopContext("LocatorCall");
    while (
      !state.eof &&
      (state.canConsume(tokens.MinusGreaterThan) ||
        state.canConsume(tokens.EqualsGreaterThan))
    ) {
      inc();
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

      if (
        state.tryConsume(
          element,
          CstNodeKind.LocatorCall_Pointer,
          tokens.MinusGreaterThan,
        )
      ) {
        element.pointer = true;
      } else if (
        state.tryConsume(
          element,
          CstNodeKind.LocatorCall_Handle,
          tokens.EqualsGreaterThan,
        )
      ) {
        element.handle = true;
      }

      element.element = memberCall.rule(state, params?.refType);
    }

    return element;
  },
);

const labelReference = rule(
  sequence(tokens.ID),
  (state: ParserState): ast.LabelReference => {
    const element = ast.createLabelReference();

    const idToken = state.consume(
      element,
      CstNodeKind.LabelReference_LabelRef,
      tokens.ID,
    );
    if (idToken) {
      element.label = ast.createReference(
        element,
        idToken,
        ast.ReferenceType.Variable,
      );
    }

    return element;
  },
);

const unaryExpression = rule(
  sequence(tokens.UnaryOperator),
  (state: ParserState, params: ExpressionParameter): ast.UnaryExpression => {
    const element = ast.createUnaryExpression();

    const operatorToken = state.consume(
      element,
      CstNodeKind.UnaryExpression_Operator,
      tokens.UnaryOperator,
    );
    if (operatorToken) {
      element.op = tokens.UnaryOperator.mapToEnumLiteral(
        operatorToken.tokenTypeIdx,
      );
    }

    element.expr = expression.rule(state, params);

    return element;
  },
);

const stringLiteral = rule(
  sequence(tokens.STRING_TERM),
  (state: ParserState): ast.StringLiteral => {
    const element = ast.createStringLiteral();

    const stringToken = state.consume(
      element,
      CstNodeKind.StringLiteral_ValueString,
      tokens.STRING_TERM,
    );
    if (stringToken) {
      element.value = stringToken.image;
    }

    return element;
  },
);

const numberLiteral = rule(
  sequence(tokens.NUMBER),
  (state: ParserState): ast.NumberLiteral => {
    const element = ast.createNumberLiteral();

    const numberToken = state.consume(
      element,
      CstNodeKind.NumberLiteral_ValueNumber,
      tokens.NUMBER,
    );
    if (numberToken) {
      element.value = numberToken.image;
    }

    return element;
  },
);

const execVariableReference = rule(
  sequence(tokens.EXEC_VARIABLE_MARKER),
  (state: ParserState): ast.ExecVariableReference => {
    const element = ast.createExecVariableReference();
    state.consume(
      element,
      CstNodeKind.CicsVariableReference_Marker,
      tokens.EXEC_VARIABLE_MARKER,
    );
    const id = state.consume(
      element,
      CstNodeKind.CicsVariableReference_HostVariable,
      tokens.ID,
    );
    if (id) {
      element.ref = ast.createReference(
        element,
        id,
        ast.ReferenceType.Variable,
      );
    }
    return element;
  },
);
