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

import {
  diagnostic,
  Diagnostic,
  Range,
  Severity,
} from "../language-server/types";
import { CompilerOptionsProcessorResult } from "./compiler-options-processor";
import { URI } from "../utils/uri";
import { Warning } from "../validation/pli-codes";
import { CompilationUnit } from "../workspace/compilation-unit";

const NEWLINE = "\n".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const PREFIX_PATTERN = /^[0-9\+\- \r\t]+$/;
const SEQUENCE_PATTERN = /^\s*[A-Z0-9]*\r?\n?$/;

/**
 * Helper class to replace text margins with space characters (characters 2-72 are normal program text)
 */
export class MarginsProcessor {
  static readonly MARGIN_ERROR_MESSAGE_LEFT = (m: number, n: number) => {
    if (m === 2) {
      return `PL/I statements must start from column 2.`;
    }
    return `PL/I statements must start from column ${m} as defined in MARGINS(${m},${n}).`;
  };
  static readonly MARGIN_ERROR_MESSAGE_RIGHT = Warning.IBM1084I.message;

  issues: Diagnostic[] = [];

  protected checkMargins: boolean = false;

  processMargins(
    input: CompilerOptionsProcessorResult,
    uri: URI,
    unit: CompilationUnit,
  ): string {
    this.issues = [];
    this.checkMargins =
      unit.processGroup?.lspOptions.checkMargins.value ?? false;

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

    // Adjust each line as it is scanned - materializing all raw lines first and
    // mapping them afterwards would hold two arrays of one string per line alive
    return this.splitLines(input.text, margins, uri).join("");
  }

  private splitLines(text: string, margins: Range, uri: URI): string[] {
    const lines: string[] = [];
    const prefixLength = margins.start - 1;
    const prefix = " ".repeat(prefixLength);

    const reportViolation = (
      side: "left" | "right",
      start: number,
      end: number,
    ) => {
      this.issues.push(
        diagnostic(
          Severity.W,
          side === "left"
            ? MarginsProcessor.MARGIN_ERROR_MESSAGE_LEFT(
                margins.start,
                margins.end,
              )
            : MarginsProcessor.MARGIN_ERROR_MESSAGE_RIGHT,
          { start, end },
          uri.toString(),
        ),
      );
    };

    let possibleViolationLeft = false;
    let possibleViolationRight = false;
    for (let i = 0; i < text.length; i++) {
      const start = i;

      if (this.checkMargins) {
        // Basically, while scanning the text for the newline, the margins are checked via
        // if ((i < leftMarginEnd || i > rightMarginStart) && code !== SPACE) {
        //   possibleViolation = true;
        // }
        // Since the the majority of the line usually lives inbetween the margins,
        // we check the margins in three dedicated loops,
        // one for the left margin, one for the characters between the margins,
        // and one for the right margin.
        let code;
        const leftMarginEnd = i + prefixLength;
        const rightMarginStart = i + margins.end;
        possibleViolationLeft = false;
        possibleViolationRight = false;
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
      } else {
        // Margin check is disabled.
        while (i < text.length && text.charCodeAt(i) !== NEWLINE) {
          i++;
        }
      }
      const line = text.substring(start, i + 1);
      lines.push(this.adjustLine(line, margins, prefix));

      // Check the left margin.
      // TODO ssmifi: While COL1 should be reserved for %|*PROCESS, there are examples (ADVNTOPT)
      // that use single digits, +, and -.
      if (
        possibleViolationLeft &&
        !(
          (line[0] === "%" || line[0] === "*") &&
          line.substring(1, 8).toUpperCase().startsWith("PROCESS")
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

  private adjustLine(line: string, margins: Range, prefix: string): string {
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
