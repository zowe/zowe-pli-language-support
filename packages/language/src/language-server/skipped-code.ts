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

import { Connection, NotificationType, Range } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { CstNodeKind } from "../syntax-tree/cst";
import { TextDocuments } from "./text-documents";
import { isEqual } from "lodash-es";

export interface SkippedCodeNotificationParams {
  uri: string;
  ranges: Range[];
}

export const SkippedCodeNotification =
  new NotificationType<SkippedCodeNotificationParams>("pli/skippedCode");

/**
 * Sends a notification to the client with the ranges of skipped code in the given compilation unit.
 * Skipped code is either produced by the SKIP or by the IF preprocessor directive.
 */
export function skippedCode(
  connection: Connection,
  compilationUnit: CompilationUnit,
) {
  const ranges = compilationUnit ? skippedCodeRanges(compilationUnit) : [];
  const cachedRanges = compilationUnit.requestCaches.get("skippedCodeRanges");

  if (
    !cachedRanges?.length ||
    cachedRanges.length !== ranges.length ||
    !cachedRanges.every((range, index) => isEqual(range, ranges[index]))
  ) {
    compilationUnit.requestCaches.set("skippedCodeRanges", ranges);
    connection.sendNotification(SkippedCodeNotification, {
      uri: compilationUnit.uri.toString(),
      ranges,
    });
  }
}

/**
 * Returns the ranges of skipped code in the given compilation unit.
 * Handles both SKIP and IF preprocessor directives.
 */
export function skippedCodeRanges(compilationUnit: CompilationUnit): Range[] {
  const textDocument = TextDocuments.get(compilationUnit.uri.toString());
  if (!textDocument) {
    return [];
  }

  const tokens = compilationUnit.tokens.fileTokens[textDocument.uri] ?? [];
  const result: Range[] = [];

  for (const token of tokens) {
    if (token.payload?.kind === CstNodeKind.SkipDirective_SKIP) {
      const line = textDocument.positionAt(token.startOffset).line + 1;
      result.push({
        start: { line, character: 0 },
        end: { line: line + token.payload.element.lineCount, character: 0 },
      });
    } else if (token.payload?.kind === CstNodeKind.IfStatement_IF) {
      const evaluationResult =
        compilationUnit.preprocessorEvaluationResults.get(
          token.payload.element,
        );
      if (evaluationResult !== undefined) {
        const { elseRange, unitRange } = token.payload.element;
        const startOffset = evaluationResult
          ? (elseRange?.start ?? 0)
          : (unitRange?.start ?? 0);
        const endOffset = evaluationResult
          ? (elseRange?.end ?? 0)
          : (unitRange?.end ?? 0);
        result.push({
          start: textDocument.positionAt(startOffset),
          end: textDocument.positionAt(endOffset),
        });
      }
    }
  }

  return result;
}
