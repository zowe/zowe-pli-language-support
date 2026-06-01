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
import { TextDocument } from "vscode-languageserver-textdocument";
import { isVirtualFile } from "../utils/uri";

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
  const uriString = compilationUnit.uri.toString();

  // Do not send skipped code notifications for virtual files
  if (isVirtualFile(uriString)) {
    return;
  }

  const textDocument = compilationUnit.services.files.getDocument(
    compilationUnit.uri,
  );
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
      uri: uriString,
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
  const tokens = compilationUnit.services.files.getTokens(textDocument.uri);
  if (!tokens) {
    return [];
  }
  const result: Range[] = [];

  for (const [index, token] of tokens.entries()) {
    if (
      token.kind === CstNodeKind.IfStatement_IF &&
      token.element?.kind === SyntaxKind.IfStatement
    ) {
      const element = token.element;
      const evaluationResult =
        compilationUnit.preprocessorEvaluationResults.branchExecutions.get(
          element,
        );
      if (evaluationResult === undefined) {
        continue;
      }
      const { elseRange, unitRange } = element;
      const executedThen = evaluationResult.has(0);
      const executedElse = evaluationResult.has(1);
      if (unitRange && !executedThen) {
        result.push({
          start: textDocument.positionAt(unitRange.start),
          end: textDocument.positionAt(unitRange.end),
        });
      } else if (elseRange && !executedElse) {
        result.push({
          start: textDocument.positionAt(elseRange.start),
          end: textDocument.positionAt(elseRange.end),
        });
      }
    } else if (
      token.kind === CstNodeKind.SelectStatement_SELECT &&
      token.element?.kind === SyntaxKind.SelectStatement
    ) {
      const element = token.element;
      const evaluationResult =
        compilationUnit.preprocessorEvaluationResults.branchExecutions.get(
          element,
        );
      if (evaluationResult === undefined) {
        continue;
      }
      for (let i = 0; i < element.cases.length; i++) {
        const caseElement = element.cases[i];
        const caseRange = caseElement.range;
        // If the case hasn't been executed, we display it as skipped
        if (caseRange && !evaluationResult.has(i)) {
          result.push({
            start: textDocument.positionAt(caseRange.start),
            end: textDocument.positionAt(caseRange.end),
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
