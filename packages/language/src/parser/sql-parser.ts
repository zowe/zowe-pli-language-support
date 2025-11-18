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
import { Severe } from "../validation/pli-codes";

export function isSqlAttributeStatement(state: ParserState): boolean {
  return state.canConsume(t.SQL, t.TYPE, t.IS);
}

export function sqlAttributeStatement(
  state: ParserState,
): ast.SqlAttributeStatement {
  const attributeStatement = ast.createSQLAttributeStatement();
  state.consume(
    attributeStatement,
    CstNodeKind.SqlAttributeStatement_SQL,
    t.SQL,
  );
  state.consume(
    attributeStatement,
    CstNodeKind.SqlAttributeStatement_TYPE,
    t.TYPE,
  );
  state.consume(attributeStatement, CstNodeKind.SqlAttributeStatement_IS, t.IS);
  if (state.canConsume(t.XML)) {
    state.consume(
      attributeStatement,
      CstNodeKind.SqlAttributeStatement_XML,
      t.XML,
    );
    state.consume(
      attributeStatement,
      CstNodeKind.SqlAttributeStatement_AS,
      t.AS,
    );
    attributeStatement.isXml = true;
  }
  const isLargePeek = state.peek(2)?.tokenTypeIdx === t.LARGE.tokenTypeIdx;
  if (state.canConsume(t.LOB)) {
    attributeStatement.body = parseSQLAttributeLob(
      state,
      attributeStatement.isXml,
    );
  } else if (
    state.canConsume(t.VARBINARY) ||
    (state.canConsume(t.BINARY) && !isLargePeek)
  ) {
    attributeStatement.body = parseSQLAttributeBinary(
      state,
      attributeStatement.isXml,
    );
  } else if (state.canConsume(t.CharOrBinary)) {
    attributeStatement.body = parseSQLAttributeExplicitLob(
      state,
      attributeStatement.isXml,
    );
  } else if (state.canConsume(t.LOBLocator)) {
    attributeStatement.body = ast.createSQLAttributeLobLocator();
    state.consume(
      attributeStatement.body,
      CstNodeKind.SqlAttributeLobLocator_LOB_LOCATOR,
      t.LOBLocator,
    );
  } else if (state.canConsume(t.LOBFile)) {
    attributeStatement.body = ast.createSQLAttributeLobFile();
    state.consume(
      attributeStatement.body,
      CstNodeKind.SqlAttributeLobFile_LOB_FILE,
      t.LOBFile,
    );
  } else if (state.canConsume(t.ROWID)) {
    attributeStatement.body = ast.createSQLAttributeRowId();
    state.consume(
      attributeStatement.body,
      CstNodeKind.SqlAttributeRowId_ROWID,
      t.ROWID,
    );
  }
  return attributeStatement;
}

function parseSQLAttributeBinary(
  state: ParserState,
  isXml: boolean,
): ast.SqlAttributeBinary {
  const binary = ast.createSQLAttributeBinary();
  let typename = "";
  // Can be BINARY or BINARY VARYING or VARBINARY
  if (state.canConsume(t.BINARY)) {
    state.consume(binary, CstNodeKind.SqlAttributeBinary_BINARY, t.BINARY);
    if (
      state.tryConsume(
        binary,
        CstNodeKind.SqlAttributeBinary_VARYING,
        t.VARYING,
      )
    ) {
      typename = "BINARY VARYING";
      binary.type = ast.SqlAttributeBinaryType.VARBINARY;
    } else {
      typename = "BINARY";
      binary.type = ast.SqlAttributeBinaryType.BINARY;
    }
  } else {
    binary.type = ast.SqlAttributeBinaryType.VARBINARY;
    state.consume(
      binary,
      CstNodeKind.SqlAttributeBinary_VARBINARY,
      t.VARBINARY,
    );
    typename = "VARBINARY";
  }
  parseSQLAttributeLobSize(state, binary, isXml, typename);
  return binary;
}

function parseSQLAttributeExplicitLob(
  state: ParserState,
  isXml: boolean,
): ast.SqlAttributeLob {
  const lob = ast.createSQLAttributeLob();
  const typeToken = state.consume(
    lob,
    CstNodeKind.SqlAttributeLob_Type,
    t.CharOrBinary,
  );
  state.consume(lob, CstNodeKind.SqlAttributeLob_LARGE, t.LARGE);
  state.consume(lob, CstNodeKind.SqlAttributeLob_OBJECT, t.OBJECT);
  let typename = "";
  switch (typeToken?.tokenTypeIdx) {
    case t.CHARACTER.tokenTypeIdx:
      lob.type = ast.SQLAttributeLobType.CLOB;
      typename = "CLOB";
      break;
    case t.BINARY.tokenTypeIdx:
      lob.type = ast.SQLAttributeLobType.BLOB;
      typename = "BLOB";
      break;
  }
  parseSQLAttributeLobSize(state, lob, isXml, typename);
  return lob;
}

function parseSQLAttributeLob(
  state: ParserState,
  isXml: boolean,
): ast.SqlAttributeLob {
  const lob = ast.createSQLAttributeLob();
  const typeToken = state.consume(lob, CstNodeKind.SqlAttributeLob_Type, t.LOB);
  let typename = "";
  switch (typeToken?.tokenTypeIdx) {
    case t.CLOB.tokenTypeIdx:
      lob.type = ast.SQLAttributeLobType.CLOB;
      typename = "CLOB";
      break;
    case t.BLOB.tokenTypeIdx:
      lob.type = ast.SQLAttributeLobType.BLOB;
      typename = "BLOB";
      break;
    case t.DBCLOB.tokenTypeIdx:
      lob.type = ast.SQLAttributeLobType.DBCLOB;
      typename = "DBCLOB";
      break;
  }
  parseSQLAttributeLobSize(state, lob, isXml, typename);
  return lob;
}

function parseSQLAttributeLobSize(
  state: ParserState,
  attribute: ast.SqlAttributeLob | ast.SqlAttributeBinary,
  isXml: boolean,
  typename: string,
): void {
  state.consume(
    attribute,
    CstNodeKind.SqlAttributeLob_OpenParen,
    t.OpenParen,
    isXml ? Severe.IBM3757I : Severe.IBM3754I,
    typename,
  );
  const lengthToken = state.consume(
    attribute,
    CstNodeKind.SqlAttributeLob_Length,
    t.NUMBER,
    isXml ? Severe.IBM3758I : Severe.IBM3755I,
    typename,
  );
  if (lengthToken) {
    attribute.length = parseInt(lengthToken.image, 10);
  }
  const modifierToken = state.tryConsume(
    attribute,
    CstNodeKind.SqlAttributeLob_LengthModifier,
    t.LOBSize,
  );
  switch (modifierToken?.tokenTypeIdx) {
    case t.K.tokenTypeIdx:
      attribute.size = ast.SQLAttributeLobSize.K;
      break;
    case t.M.tokenTypeIdx:
      attribute.size = ast.SQLAttributeLobSize.M;
      break;
    case t.G.tokenTypeIdx:
      attribute.size = ast.SQLAttributeLobSize.G;
      break;
  }
  state.consume(
    attribute,
    CstNodeKind.SqlAttributeLob_CloseParen,
    t.CloseParen,
    isXml ? Severe.IBM3759I : Severe.IBM3756I,
    typename,
  );
}
