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
import {
  SemanticsKind,
  Preprocessor,
  Diagnostic,
  Token,
  Severity,
} from "preprocessor-api";
import { Case, CICSPreprocessor } from "preprocessor-cics";
import { URI } from "vscode-uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokenTypes } from "../language-server/semantic-tokens";
import { Db2SqlPreprocessor } from "preprocessor-db2";
import {
  Severity as LSSeverity,
  Diagnostic as LSDiagnostic,
} from "../language-server/types";
import { HostLanguageType } from "preprocessor-cics";
import { CompilerOptions } from "../preprocessor/compiler-options/options-pli";

/**
 * Parses the `EXEC CICS`/`EXEC SQL` statement, invoking the actual CICS/SQL
 * preprocessor engine. This should only be called from the dedicated
 * `ExecCicsPreprocessorPhase`/`ExecSqlPreprocessorPhase`'s own handler
 * (`exec-phase.ts`'s `createExecHandler`), which already checked that the fragment's
 * prefix matches that phase's own type before calling this.
 * Any other caller that merely needs to recognize and correctly skip over an EXEC statement
 * (e.g. the MACRO phase's internal walk, used only to delimit `%DO`/`%IF` blocks) must use
 * {@link deferredExecStatement} instead, which never invokes the real engine.
 */
export async function execStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.ExecStatement> {
  const execStatement = ast.createExecStatement();
  state.consume(execStatement, CstNodeKind.ExecStatement_EXEC, t.EXEC);
  const fragmentToken = state.consume(
    execStatement,
    CstNodeKind.ExecStatement_ExecFragment,
    t.ExecFragment,
  );
  if (fragmentToken) {
    const { preprocessor, statementText, startOffset } = handleExecFragment(
      fragmentToken,
      execStatement,
      state.compilerOptions,
    );
    if (preprocessor) {
      const { diagnostics, tokens, replacement } =
        await preprocessor.execute(statementText);
      handleDiagnostics(
        diagnostics,
        state,
        textDocument.uri,
        startOffset,
        preprocessor,
      );
      execStatement.preprocessorTokens = handleTokens(
        tokens,
        startOffset,
        textDocument,
      );
      if (replacement) {
        if (replacement.type === "text") {
          execStatement.replacement = replacement.text;
        } else {
          const item = ast.createIncludeItemFile();
          item.sql = true;
          item.fileName = replacement.filePath;
          item.token = toPliToken(startOffset, replacement.token, textDocument);
          item.token.kind = CstNodeKind.IncludeItem_MemberID;
          item.token.element = item;
          execStatement.replacement = ast.createIncludeDirective();
          execStatement.replacement.items.push(item);
        }
      }
    }
  }
  state.consume(
    execStatement,
    CstNodeKind.ExecStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}

/**
 * Recognizes and correctly consumes an `EXEC CICS`/`EXEC SQL` statement WITHOUT invoking
 * the real preprocessor engine. Used by any caller that isn't the dedicated
 * `PP(CICS)`/`PP(SQL)` phase's own handler (see {@link execStatement}). Since no
 * preprocessing happens here, there's nothing CICS/SQL-specific to represent - the
 * statement's tokens are preserved verbatim as a plain `ast.TokenStatement` (the same
 * shape `consumeTokenStatement` produces for other unrecognized text), which the
 * existing token-based instruction generation already re-emits unchanged, deferring real
 * processing entirely to whichever dedicated phase (if any) is configured to run later.
 */
export function deferredExecStatement(state: ParserState): ast.TokenStatement {
  const tokenStatement = ast.createTokenStatement();
  const start = state.index;
  state.consume(undefined, undefined, t.EXEC);
  state.consume(undefined, undefined, t.ExecFragment);
  state.consume(undefined, undefined, t.Semicolon);
  tokenStatement.tokens = state.tokens.slice(start, state.index);
  return tokenStatement;
}

function handleTokens(
  tokens: Token[],
  startOffset: number,
  textDocument: TextDocument,
) {
  const result: ast.PreprocessorToken[] = [];
  for (const token of tokens) {
    const pliToken = toPliToken(startOffset, token, textDocument);

    let semanticType: SemanticTokenTypes = SemanticTokenTypes.modifier;
    switch (token.semanticsKind) {
      case SemanticsKind.Comment:
        semanticType = SemanticTokenTypes.comment;
        break;
      case SemanticsKind.Identifier:
        semanticType = SemanticTokenTypes.variable;
        break;
      case SemanticsKind.Keyword:
        semanticType = SemanticTokenTypes.keyword;
        break;
      case SemanticsKind.Number:
        semanticType = SemanticTokenTypes.number;
        break;
      case SemanticsKind.String:
        semanticType = SemanticTokenTypes.string;
        break;
    }

    result.push({ token: pliToken, semanticType });
  }
  return result;
}

function toPliToken(
  startOffset: number,
  token: Token,
  textDocument: TextDocument,
) {
  const tokenStart = startOffset + token.startOffset;
  const tokenEnd = startOffset + token.endOffset;
  const positionStart = textDocument.positionAt(tokenStart);
  const positionEnd = textDocument.positionAt(tokenEnd);
  const pliToken = t.createTokenInstance(
    token.image,
    token.image,
    t.ID,
    tokenStart,
    positionStart.line,
    positionStart.character,
    tokenEnd,
    positionEnd.line,
    positionEnd.character,
    URI.parse(textDocument.uri.toString()),
  );
  return pliToken;
}

function handleDiagnostics(
  diagnostics: Diagnostic[],
  state: ParserState,
  uri: string,
  startOffset: number,
  preprocessor: Preprocessor,
) {
  state.diagnostics.push(
    ...diagnostics.map((d) => {
      let severity: LSSeverity;
      switch (d.severity) {
        case Severity.Error:
          severity = LSSeverity.E;
          break;
        case Severity.Warning:
          severity = LSSeverity.W;
          break;
        case Severity.Info:
          severity = LSSeverity.I;
          break;
        default:
          severity = LSSeverity.E;
      }
      return {
        message: d.message,
        severity: severity,
        code: d.code,
        source: preprocessor.name,
        range: {
          start: startOffset + d.startOffset,
          end: startOffset + d.endOffset,
        },
        uri,
      } as LSDiagnostic;
    }),
  );
}

const TranslateCase: Record<
  CompilerOptions.Case.ASIS | CompilerOptions.Case.UPPER,
  Case
> = {
  [CompilerOptions.Case.UPPER]: Case.Upper,
  [CompilerOptions.Case.ASIS]: Case.AsIs,
};

function handleExecFragment(
  fragmentToken: t.Token,
  execStatement: ast.ExecStatement,
  compilerOptions: CompilerOptions | undefined,
) {
  const prefixMatch = /^(\w+)\s*/i.exec(fragmentToken.image);
  const prefixLength = prefixMatch?.[0].length || 0;
  const startOffset = fragmentToken.startOffset + prefixLength;
  const statementText = fragmentToken.image.substring(prefixLength);
  let preprocessor: Preprocessor | undefined;
  const recognizedType = recognizeExecType(prefixMatch?.[1]);
  execStatement.preprocessorType = recognizedType;

  switch (recognizedType) {
    case ast.PreprocessorType.CICS:
      const casing =
        TranslateCase[compilerOptions?.case ?? CompilerOptions.Case.UPPER];
      preprocessor = new CICSPreprocessor(HostLanguageType.PLI, casing);
      break;
    case ast.PreprocessorType.SQL:
      preprocessor = new Db2SqlPreprocessor();
      break;
  }
  return { preprocessor, statementText, startOffset };
}

function recognizeExecType(prefix: string | undefined): ast.PreprocessorType {
  switch (prefix?.toUpperCase()) {
    case "CICS":
      return ast.PreprocessorType.CICS;
    case "SQL":
      return ast.PreprocessorType.SQL;
    default:
      return ast.PreprocessorType.UNKNOWN;
  }
}
