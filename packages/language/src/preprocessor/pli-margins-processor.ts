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

import { Range } from "../language-server/types";
import { CompilerOptionsProcessorResult } from "./compiler-options-processor";

const NEWLINE = "\n".charCodeAt(0);

export interface MarginsProcessor {
  processMargins(input: CompilerOptionsProcessorResult): string;
}

/**
 * Helper class to replace text margins with space characters (characters 2-72 are normal program text)
 */
export class PliMarginsProcessor implements MarginsProcessor {
  processMargins(input: CompilerOptionsProcessorResult): string {
    let margins: Range = {
      start: 2,
      end: 72,
    };
    if (input.result && input.result.options.margins) {
      const start = input.result.options.margins.m;
      const end = input.result.options.margins.n;
      if (!isNaN(start)) {
        margins.start = start;
      }
      if (!isNaN(end)) {
        margins.end = end;
      }
    }
    const lines = this.splitLines(input.text);
    const adjustedLines = lines.map((line) => this.adjustLine(line, margins));
    return adjustedLines.join("");
  }

  private splitLines(text: string): string[] {
    const lines: string[] = [];
    for (let i = 0; i < text.length; i++) {
      const start = i;
      while (i < text.length && text.charCodeAt(i) !== NEWLINE) {
        i++;
      }
      lines.push(text.substring(start, i + 1));
    }
    return lines;
  }

  private adjustLine(line: string, margins: Range): string {
    let eol = "";
    if (line.endsWith("\r\n")) {
      eol = "\r\n";
    } else if (line.endsWith("\n")) {
      eol = "\n";
    }
    const prefixLength = margins.start - 1; // margins are column based, so -1
    const lineLength = line.length - eol.length;
    if (lineLength < prefixLength) {
      return " ".repeat(lineLength) + eol;
    }
    const lineEnd = margins.end;
    const prefix = " ".repeat(prefixLength);
    let postfix = "";
    if (lineLength > lineEnd) {
      postfix = " ".repeat(lineLength - lineEnd);
    }
    return (
      prefix +
      line.substring(prefixLength, Math.min(lineEnd, lineLength)) +
      postfix +
      eol
    );
  }
}
