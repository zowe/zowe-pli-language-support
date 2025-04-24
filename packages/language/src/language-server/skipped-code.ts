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

export interface SkippedPliCodeNotificationParams {
  uri: string;
  ranges: Array<{
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }>;
}

export const SkippedPliCodeNotification =
  new NotificationType<SkippedPliCodeNotificationParams>("pli/skippedCode");

export function skippedCode(
  connection: Connection,
  uri: string,
  compilationUnit: CompilationUnit,
  textDocument: TextDocument,
) {
  let ranges: Array<{
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }> = [];

  if (compilationUnit) {
    ranges = [
      ...ranges,
      ...skippedCodeRanges(uri, compilationUnit, textDocument),
    ];
  }

  connection.sendNotification(SkippedPliCodeNotification, {
    uri: uri,
    ranges: ranges,
  });
}

export function skippedCodeRanges(
  uri: string,
  compilationUnit: CompilationUnit,
  textDocument: TextDocument,
): Array<{
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}> {
  const result: Array<{
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }> = [];

  // const ppSkips: PPSkip[] = compilationUnit.preprocessorStatements.filter(
  //   (statement) => statement.type === "skip",
  // ) as PPSkip[];

  // for (const skip of ppSkips) {
  //   const line = textDocument.positionAt(skip.startOffset).line + 1;
  //   const range = {
  //     range: {
  //       start: { line: line, character: 0 },
  //       end: { line: line + skip.lineCount, character: 0 },
  //     },
  //   };
  //   result.push(range);
  // }

  // const ppIfs: PPIfStatement[] = compilationUnit.preprocessorStatements.filter(
  //   (statement) => statement.type === "if",
  // ) as PPIfStatement[];

  // for (const ifStatement of ppIfs) {
  //   if (ifStatement.conditionEval === undefined) {
  //     continue;
  //   }

  //   if (ifStatement.conditionEval) {
  //     if (ifStatement.elseUnitRange) {
  //       result.push({
  //         range: {
  //           start: textDocument.positionAt(ifStatement.elseUnitRange!.start),
  //           end: textDocument.positionAt(ifStatement.elseUnitRange!.end),
  //         },
  //       });
  //     }
  //   } else {
  //     result.push({
  //       range: {
  //         start: textDocument.positionAt(ifStatement.thenUnitRange.start),
  //         end: textDocument.positionAt(ifStatement.thenUnitRange.end),
  //       },
  //     });
  //   }
  // }

  return result;
}
