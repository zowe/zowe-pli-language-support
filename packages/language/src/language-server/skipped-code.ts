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

import { Connection, NotificationType } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CstNodeKind } from "../syntax-tree/cst";
import { Range } from "vscode-languageserver-types";

export interface SkippedPliCodeNotificationParams {
  uri: string;
  ranges: Range[];
}

export const SkippedPliCodeNotification =
  new NotificationType<SkippedPliCodeNotificationParams>("pli/skippedCode");

/**
 * Sends a notification to the client with the ranges of skipped code in the given compilation unit.
 * Skipped code is either produced by the SKIP or by the IF preprocessor directive.
 */
export function skippedCode(
  connection: Connection,
  uri: string,
  compilationUnit: CompilationUnit,
  textDocument: TextDocument,
) {
  let ranges: Range[] = [];

  if (compilationUnit) {
    ranges = skippedCodeRanges(uri, compilationUnit, textDocument);
  }

  connection.sendNotification(SkippedPliCodeNotification, {
    uri: uri,
    ranges: ranges,
  });
}

/**
 * Returns the ranges of skipped code in the given compilation unit.
 * Handles both SKIP and IF preprocessor directives.
 */
export function skippedCodeRanges(
  uri: string,
  compilationUnit: CompilationUnit,
  textDocument: TextDocument,
): Range[] {
  const result: Range[] = [];

  const tokens = compilationUnit.tokens.fileTokens[textDocument.uri] ?? [];

  for (const token of tokens) {
    if (token.payload?.kind === CstNodeKind.SkipDirective_SKIP) {
      const line = textDocument.positionAt(token.startOffset).line + 1;
      result.push({
        start: { line: line, character: 0 },
        end: { line: line + token.payload.element.lineCount, character: 0 },
      });
    } else if (token.payload?.kind === CstNodeKind.IfStatement_IF) {
      const evaluationResult =
        compilationUnit.preprocessorEvaluationResults.get(
          token.payload.element,
        );
      if (evaluationResult !== undefined) {
        const startOffset = evaluationResult
          ? (token.payload.element.elseRange?.start ?? 0)
          : (token.payload.element.unitRange?.start ?? 0);
        const endOffset = evaluationResult
          ? (token.payload.element.elseRange?.end ?? 0)
          : (token.payload.element.unitRange?.end ?? 0);
        result.push({
          start: textDocument.positionAt(startOffset),
          end: textDocument.positionAt(endOffset),
        });
      }
    }
  }

  return result;
}
