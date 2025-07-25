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
import { LexingError } from "./pli-lexer";

const NEWLINE = "\n".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const PREFIX_PATTERN = /^[0-9\+\- ]+$/;
const SEQUENCE_PATTERN = /^\s*[A-Z0-9]*\r?\n?$/;

export interface MarginsProcessor {
  issues: LexingError[];
  processMargins(input: CompilerOptionsProcessorResult): string;
}

/**
 * Helper class to replace text margins with space characters (characters 2-72 are normal program text)
 */
export class PliMarginsProcessor implements MarginsProcessor {
  static readonly MARGIN_ERROR_MESSAGE_LEFT =
    "PL/I statements must start from column 2 or as defined in MARGINS(M,N).";
  static readonly MARGIN_ERROR_MESSAGE_RIGHT = "Line exceeds right margin!";

  issues: LexingError[] = [];

  processMargins(input: CompilerOptionsProcessorResult): string {
    this.issues = [];
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
    const lines = this.splitLines(input.text, margins);
    const adjustedLines = lines.map((line) => this.adjustLine(line, margins));
    return adjustedLines.join("");
  }

  private splitLines(text: string, margins: Range): string[] {
    const lines: string[] = [];
    const prefixLength = margins.start - 1;

    const reportViolation = (
      side: "left" | "right",
      start: number,
      end: number,
    ) => {
      this.issues.push({
        message:
          side === "left"
            ? PliMarginsProcessor.MARGIN_ERROR_MESSAGE_LEFT
            : PliMarginsProcessor.MARGIN_ERROR_MESSAGE_RIGHT,
        range: { start, end },
        uri: undefined,
      });
    };

    for (let i = 0; i < text.length; i++) {
      const start = i;
      const leftMarginEnd = i + prefixLength;
      const rightMarginStart = i + margins.end;

      // Basically, while scanning the text for the newline, the margins are checked via
      // if ((i < leftMarginEnd || i > rightMarginStart) && code !== SPACE) {
      //   possibleViolation = true;
      // }
      // Since the the majority of the line usually lives inbetween the margins,
      // it is more efficient to check the margins in three dedicated loops,
      // one for the left margin, one for the characters between the margins,
      // and one for the right margin.
      let code;
      let possibleViolationLeft = false;
      let possibleViolationRight = false;
      const leftMarginSpace = Math.min(leftMarginEnd, text.length);
      while (i < leftMarginSpace) {
        code = text.charCodeAt(i);
        if (code === NEWLINE) {
          break;
        }
        i++;
        if (code !== SPACE) {
          possibleViolationLeft = true;
          // We can stop here, the next loop will take care of the rest of the line.
          break;
        }
      }
      if (code !== NEWLINE) {
        const rightMarginSpace = Math.min(rightMarginStart, text.length);
        while (i < rightMarginSpace) {
          code = text.charCodeAt(i);
          if (code === NEWLINE) {
            break;
          }
          i++;
        }
        if (code !== NEWLINE) {
          while (i < text.length) {
            code = text.charCodeAt(i);
            if (code === NEWLINE) {
              break;
            }
            if (code !== SPACE) {
              possibleViolationRight = true;
            }
            i++;
          }
        }
      }
      const line = text.substring(start, i + 1);
      lines.push(line);

      // Check the left margin.
      // TODO ssmifi: While COL1 should be reserved for %|*PROCESS, there are examples (ADVNTOPT)
      // that use single digits, +, and -.
      if (
        possibleViolationLeft &&
        !(
          (line[0] === "%" || line[0] === "*") &&
          line.substring(0, 8).toUpperCase().startsWith("PROCESS", 1)
        ) &&
        !PREFIX_PATTERN.test(line.substring(0, prefixLength))
      ) {
        reportViolation("left", start, start + prefixLength);
      }

      // Check the right margin.
      if (possibleViolationRight) {
        const sequence = line.substring(margins.end).toUpperCase();
        if (!SEQUENCE_PATTERN.test(sequence)) {
          // Do not include the newline character.
          reportViolation(
            "right",
            start + margins.end,
            start + line.length - 1,
          );
        }
      }
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
