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
import { isEqual } from "lodash-es";
import { SyntaxKind } from "../syntax-tree/ast";
import { TextDocuments } from "./text-documents";
import { IfEvaluationResult } from "../preprocessor/instruction-interpreter";
import { TextDocument } from "vscode-languageserver-textdocument";

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
  const textDocument = TextDocuments.get(compilationUnit.uri.toString());
  const ranges = textDocument
    ? skippedCodeRanges(compilationUnit, textDocument)
    : [];
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
export function skippedCodeRanges(
  compilationUnit: CompilationUnit,
  textDocument: TextDocument,
): Range[] {
  const tokens = compilationUnit.tokens.fileTokens.get(textDocument.uri);
  if (!tokens) {
    return [];
  }
  const result: Range[] = [];

  for (const token of tokens) {
    if (
      token.payload.kind === CstNodeKind.SkipDirective_SKIP &&
      token.payload.element?.kind === SyntaxKind.SkipDirective
    ) {
      const element = token.payload.element;
      const line = textDocument.positionAt(token.startOffset).line + 1;
      result.push({
        start: { line, character: 0 },
        end: { line: line + element.lineCount, character: 0 },
      });
    } else if (
      token.payload.kind === CstNodeKind.IfStatement_IF &&
      token.payload.element?.kind === SyntaxKind.IfStatement
    ) {
      const element = token.payload.element;
      const evaluationResult =
        compilationUnit.preprocessorEvaluationResults.ifStatements.get(element);
      if (
        // If the code block hasn't been evaluated, it likely was included in another un-evaluated block
        // This will automatically skip the block already, so we don't have to do anything
        evaluationResult !== undefined &&
        // If both branches have been evaluated (maybe as part of a loop), do nothing
        evaluationResult !== IfEvaluationResult.Both
      ) {
        const { elseRange, unitRange } = element;
        // If the "else" branch has been evaluated, it means we need to skip the "then" branch
        // If the "then" branch has been evaluated, it means we need to skip the "else" branch
        const range =
          evaluationResult === IfEvaluationResult.False ? unitRange : elseRange;
        if (range) {
          result.push({
            start: textDocument.positionAt(range.start),
            end: textDocument.positionAt(range.end),
          });
        }
      }
    }
  }

  return result;
}
