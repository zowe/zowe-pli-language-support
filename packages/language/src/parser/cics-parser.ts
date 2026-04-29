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

import * as ast from "../syntax-tree/ast";
import * as t from "./tokens";
import { ParserState } from "./parser-state";
import { CstNodeKind } from "../syntax-tree/cst";
import { embeddedUnknownStatement } from "./unknown-parser";
import { anyOrderRule, orRule, rule, sequence } from "./parser-types";
import * as cicsTokens from "./tokens/cics-tokens.generated";
import { TraversalState, traverseAllNodes } from "../syntax-tree/ast-iterator";

export function cicsExecStatement(state: ParserState): ast.CicsExecStatement {
  const execStatement = ast.createCicsExecStatement();
  state.consume(execStatement, CstNodeKind.ExecCicsStatement_EXEC, t.EXEC);
  state.consume(execStatement, CstNodeKind.ExecCicsStatement_CICS, t.CICS);
  if (state.canConsumeFirst(cicsStatement.first())) {
    const cicsAst = cicsStatement.rule(state);
    if (cicsAst) {
      traverseAllNodes(cicsAst, (node) => {
        if (node.kind === ast.SyntaxKind.CicsReferenceItem && node.ref) {
          const token = node.ref.token;
          execStatement.hostVariables.push(token);
        }
        return TraversalState.Continue;
      });
      execStatement.content = cicsAst;
    }
  } else {
    //Note: Host variables are ignored here
    execStatement.content = embeddedUnknownStatement(
      state,
      CstNodeKind.ExecCicsStatement_COMMAND,
    );
    state.consume(
      execStatement,
      CstNodeKind.ExecCicsStatement_Semicolon,
      t.Semicolon,
    );
  }
  return execStatement;
}

// statements

const cicsStatement = orRule<ast.CicsStatement, []>(() => linkStatement);

type LinkStatementContent = {
  program: ast.CicsProgramSpecification;
  commArea: ast.CicsCommAreaSpecification;
  length: ast.CicsLengthSpecification;
  dataLength: ast.CicsDataLengthSpecification;
  channel: ast.CicsChannelSpecification;
  inputMessage: ast.CicsInputMessageSpecification;
  inputMessageLength: ast.CicsInputMessageLengthSpecification;
  systemId: ast.CicsSystemIdSpecification;
  syncOnReturn: ast.CicsSyncOnReturnSpecification;
  transactionId: ast.CicsTransactionIdSpecification;
};
const linkStatementContent = anyOrderRule<
  keyof LinkStatementContent,
  LinkStatementContent,
  []
>({
  program: () => programSpecification,
  commArea: () => commAreaSpecification,
  length: () => lengthSpecification,
  dataLength: () => dataLengthSpecification,
  channel: () => channelSpecification,
  inputMessage: () => inputMessageSpecification,
  inputMessageLength: () => inputMessageLengthSpecification,
  systemId: () => systemIdSpecification,
  syncOnReturn: () => syncOnReturnSpecification,
  transactionId: () => transactionIdSpecification,
});

const linkStatement = rule(
  sequence(cicsTokens.LINK),
  (state: ParserState): ast.CicsLinkStatement => {
    const linkStatement = ast.createCicsLinkStatement();
    linkStatement.commandToken = state.consume(
      linkStatement,
      CstNodeKind.CicsLinkStatement_COMMAND,
      cicsTokens.LINK,
    );

    const specs = linkStatementContent.rule(state);

    if (specs) {
      specs.program && (linkStatement.program = specs.program);
      specs.commArea && (linkStatement.commArea = specs.commArea);
      specs.length && (linkStatement.length = specs.length);
      specs.dataLength && (linkStatement.dataLength = specs.dataLength);
      specs.channel && (linkStatement.channel = specs.channel);
      specs.inputMessage && (linkStatement.inputMessage = specs.inputMessage);
      specs.inputMessageLength &&
        (linkStatement.inputMessageLength = specs.inputMessageLength);
      specs.systemId && (linkStatement.systemId = specs.systemId);
      specs.syncOnReturn && (linkStatement.syncOnReturn = specs.syncOnReturn);
      specs.transactionId &&
        (linkStatement.transactionId = specs.transactionId);
    }

    state.consume(
      linkStatement,
      CstNodeKind.CicsLinkStatement_Semicolon,
      t.Semicolon,
    );
    return linkStatement;
  },
);

// specifications
const programSpecification = rule(
  sequence(cicsTokens.PROGRAM),
  (state: ParserState): ast.CicsProgramSpecification => {
    const programSpec = ast.createCicsProgramSpecification();
    programSpec.specToken = state.consume(
      programSpec,
      CstNodeKind.CicsProgramSpecification_PROGRAM,
      cicsTokens.PROGRAM,
    );
    state.consume(
      programSpec,
      CstNodeKind.CicsProgramSpecification_OpenParen,
      t.OpenParen,
    );
    programSpec.name = cicsNameExpression.rule(state);
    state.consume(
      programSpec,
      CstNodeKind.CicsProgramSpecification_CloseParen,
      t.CloseParen,
    );
    return programSpec;
  },
);

const commAreaSpecification = rule(
  sequence(cicsTokens.COMMAREA),
  (state: ParserState): ast.CicsCommAreaSpecification => {
    const commAreaSpec = ast.createCicsCommAreaSpecification();
    commAreaSpec.specToken = state.consume(
      commAreaSpec,
      CstNodeKind.CicsCommAreaSpecification_COMMAREA,
      cicsTokens.COMMAREA,
    );
    state.consume(
      commAreaSpec,
      CstNodeKind.CicsCommAreaSpecification_OpenParen,
      t.OpenParen,
    );
    commAreaSpec.commArea = cicsDataAreaExpression.rule(state);
    state.consume(
      commAreaSpec,
      CstNodeKind.CicsCommAreaSpecification_CloseParen,
      t.CloseParen,
    );
    return commAreaSpec;
  },
);

const lengthSpecification = rule(
  sequence(cicsTokens.LENGTH),
  (state: ParserState): ast.CicsLengthSpecification => {
    const lengthSpec = ast.createCicsLengthSpecification();
    lengthSpec.specToken = state.consume(
      lengthSpec,
      CstNodeKind.CicsLengthSpecification_LENGTH,
      cicsTokens.LENGTH,
    );
    state.consume(
      lengthSpec,
      CstNodeKind.CicsLengthSpecification_OpenParen,
      t.OpenParen,
    );
    lengthSpec.length = cicsDataValueExpression.rule(state);
    state.consume(
      lengthSpec,
      CstNodeKind.CicsLengthSpecification_CloseParen,
      t.CloseParen,
    );
    return lengthSpec;
  },
);

const dataLengthSpecification = rule(
  sequence(cicsTokens.DATALENGTH),
  (state: ParserState): ast.CicsDataLengthSpecification => {
    const dataLengthSpec = ast.createCicsDataLengthSpecification();
    dataLengthSpec.specToken = state.consume(
      dataLengthSpec,
      CstNodeKind.CicsDataLengthSpecification_DATALENGTH,
      cicsTokens.DATALENGTH,
    );
    state.consume(
      dataLengthSpec,
      CstNodeKind.CicsDataLengthSpecification_OpenParen,
      t.OpenParen,
    );
    dataLengthSpec.length = cicsDataValueExpression.rule(state);
    state.consume(
      dataLengthSpec,
      CstNodeKind.CicsDataLengthSpecification_CloseParen,
      t.CloseParen,
    );
    return dataLengthSpec;
  },
);

const channelSpecification = rule(
  sequence(cicsTokens.CHANNEL),
  (state: ParserState): ast.CicsChannelSpecification => {
    const channelSpec = ast.createCicsChannelSpecification();
    channelSpec.specToken = state.consume(
      channelSpec,
      CstNodeKind.CicsChannelSpecification_CHANNEL,
      cicsTokens.CHANNEL,
    );
    state.consume(
      channelSpec,
      CstNodeKind.CicsChannelSpecification_OpenParen,
      t.OpenParen,
    );
    channelSpec.channelName = cicsNameExpression.rule(state);
    state.consume(
      channelSpec,
      CstNodeKind.CicsChannelSpecification_CloseParen,
      t.CloseParen,
    );
    return channelSpec;
  },
);

const inputMessageSpecification = rule(
  sequence(cicsTokens.INPUTMSG),
  (state: ParserState): ast.CicsInputMessageSpecification => {
    const inputMessageSpec = ast.createCicsInputMessageSpecification();
    inputMessageSpec.specToken = state.consume(
      inputMessageSpec,
      CstNodeKind.CicsInputMessageSpecification_INPUTMSG,
      cicsTokens.INPUTMSG,
    );
    state.consume(
      inputMessageSpec,
      CstNodeKind.CicsInputMessageSpecification_OpenParen,
      t.OpenParen,
    );
    inputMessageSpec.inputMessage = cicsDataAreaExpression.rule(state);
    state.consume(
      inputMessageSpec,
      CstNodeKind.CicsInputMessageSpecification_CloseParen,
      t.CloseParen,
    );
    return inputMessageSpec;
  },
);

const inputMessageLengthSpecification = rule(
  sequence(cicsTokens.INPUTMSGLEN),
  (state: ParserState): ast.CicsInputMessageLengthSpecification => {
    const inputMsgLengthSpec = ast.createCicsInputMessageLengthSpecification();
    inputMsgLengthSpec.specToken = state.consume(
      inputMsgLengthSpec,
      CstNodeKind.CicsInputMessageLengthSpecification_INPUTMSGLEN,
      cicsTokens.INPUTMSGLEN,
    );
    state.consume(
      inputMsgLengthSpec,
      CstNodeKind.CicsInputMessageLengthSpecification_OpenParen,
      t.OpenParen,
    );
    inputMsgLengthSpec.length = cicsDataValueExpression.rule(state);
    state.consume(
      inputMsgLengthSpec,
      CstNodeKind.CicsInputMessageLengthSpecification_CloseParen,
      t.CloseParen,
    );
    return inputMsgLengthSpec;
  },
);

const systemIdSpecification = rule(
  sequence(cicsTokens.SYSID),
  (state: ParserState): ast.CicsSystemIdSpecification => {
    const systemIdSpec = ast.createCicsSystemIdSpecification();
    systemIdSpec.specToken = state.consume(
      systemIdSpec,
      CstNodeKind.CicsSystemIdSpecification_SYSID,
      cicsTokens.SYSID,
    );
    state.consume(
      systemIdSpec,
      CstNodeKind.CicsSystemIdSpecification_OpenParen,
      t.OpenParen,
    );
    systemIdSpec.id = cicsNameExpression.rule(state);
    state.consume(
      systemIdSpec,
      CstNodeKind.CicsSystemIdSpecification_CloseParen,
      t.CloseParen,
    );
    return systemIdSpec;
  },
);

const syncOnReturnSpecification = rule(
  sequence(cicsTokens.SYNCONRETURN),
  (state: ParserState): ast.CicsSyncOnReturnSpecification => {
    const syncOnReturnSpec = ast.createCicsSyncOnReturnSpecification();
    syncOnReturnSpec.specToken = state.consume(
      syncOnReturnSpec,
      CstNodeKind.CicsSyncOnReturnSpecification_SYNCONRETURN,
      cicsTokens.SYNCONRETURN,
    );
    return syncOnReturnSpec;
  },
);

const transactionIdSpecification = rule(
  sequence(cicsTokens.TRANSID),
  (state: ParserState): ast.CicsTransactionIdSpecification => {
    const transactionIdSpec = ast.createCicsTransactionIdSpecification();
    transactionIdSpec.specToken = state.consume(
      transactionIdSpec,
      CstNodeKind.CicsTransactionIdSpecification_TRANSID,
      cicsTokens.TRANSID,
    );
    state.consume(
      transactionIdSpec,
      CstNodeKind.CicsTransactionIdSpecification_OpenParen,
      t.OpenParen,
    );
    transactionIdSpec.id = cicsNameExpression.rule(state);
    state.consume(
      transactionIdSpec,
      CstNodeKind.CicsTransactionIdSpecification_CloseParen,
      t.CloseParen,
    );
    return transactionIdSpec;
  },
);

// values

const cicsNameExpression = orRule<ast.CicsNameExpression, []>(
  () => cicsReferenceItem,
  () => cicsStringLiteral,
);

const cicsDataAreaExpression = orRule<ast.CicsDataAreaExpression, []>(
  () => cicsReferenceItem,
  () => cicsAreaLiteral,
);

const cicsDataValueExpression = orRule<ast.CicsDataValueExpression, []>(
  () => cicsReferenceItem,
  () => cicsNumericLiteral,
);

const cicsReferenceItem = rule(
  sequence(t.ID),
  (state: ParserState): ast.CicsReferenceItem => {
    const refItem = ast.createCicsReferenceItem();
    const token = state.consume(
      refItem,
      CstNodeKind.CicsReferenceItem_ID,
      t.ID,
    );
    if (token) {
      token.immediateFollow = false;
      refItem.ref = ast.createReference(
        refItem,
        token,
        ast.ReferenceType.Variable,
      );
    }
    return refItem;
  },
);

const cicsStringLiteral = rule(
  sequence(t.STRING_TERM),
  (state: ParserState): ast.CicsStringLiteral => {
    const strLiteral = ast.createCicsStringLiteral();
    const token = state.consume(
      strLiteral,
      CstNodeKind.CicsStringLiteral_STRING_TERM,
      t.STRING_TERM,
    );
    strLiteral.value = token?.image ?? "";
    return strLiteral;
  },
);

const cicsAreaLiteral = rule(
  sequence(t.STRING_TERM),
  (state: ParserState): ast.CicsAreaLiteral => {
    const strLiteral = ast.createCicsAreaLiteral();
    const token = state.consume(
      strLiteral,
      CstNodeKind.CicsAreaLiteral_STRING_TERM,
      t.STRING_TERM,
    );
    strLiteral.value = token?.image ?? "";
    return strLiteral;
  },
);

const cicsNumericLiteral = rule(
  sequence(t.NUMBER),
  (state: ParserState): ast.CicsNumericLiteral => {
    const numLiteral = ast.createCicsNumericLiteral();
    const token = state.consume(
      numLiteral,
      CstNodeKind.CicsNumericLiteral_NUMBER,
      t.NUMBER,
    );
    numLiteral.value = token?.image ?? "";
    return numLiteral;
  },
);
