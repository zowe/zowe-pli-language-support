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
  const textDocument = compilationUnit.files.getDocument(compilationUnit.uri);
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
  const tokens = compilationUnit.files.getTokens(textDocument.uri);
  if (!tokens) {
    return [];
  }
  const result: Range[] = [];

  for (const [index, token] of tokens.entries()) {
    if (
      token.kind === CstNodeKind.SkipDirective_SKIP &&
      token.element?.kind === SyntaxKind.SkipDirective
    ) {
      const element = token.element;
      const line = textDocument.positionAt(token.startOffset).line + 1;
      result.push({
        start: { line, character: 0 },
        end: { line: line + element.lineCount, character: 0 },
      });
    } else if (
      token.kind === CstNodeKind.IfStatement_IF &&
      token.element?.kind === SyntaxKind.IfStatement
    ) {
      const element = token.element;
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
    } else if (
      token.kind === CstNodeKind.DoStatement_SKIP &&
      token.element?.kind === SyntaxKind.DoStatement &&
      token.element.skip
    ) {
      const endStatement = token.element.end;
      let endToken = token;
      for (let i = index + 1; i < tokens.length; i++) {
        if (
          tokens[i].kind === CstNodeKind.EndStatement_END &&
          tokens[i].element?.kind === SyntaxKind.EndStatement &&
          tokens[i].element === endStatement
        ) {
          endToken = tokens[i];
          break;
        }
      }
      const start = textDocument.positionAt(token.endOffset + 2);
      const end = textDocument.positionAt(endToken.startOffset - 1);
      result.push({
        start,
        end,
      });
    }
  }

  return result;
}
