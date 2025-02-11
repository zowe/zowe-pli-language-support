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

import { DefaultLexer, LexerResult, URI } from "langium";
import {
  CompilerOptionResult,
  mergeCompilerOptions,
} from "../compiler/options";
import { parseAbstractCompilerOptions } from "../compiler/parser";
import { translateCompilerOptions } from "../compiler/translator";
import { PliTokenBuilder } from "./pli-token-builder";
import { PliServices } from "../pli-module";
import { PliConfigStorage } from "../workspace/pli-config-storage";

const NEWLINE = "\n".charCodeAt(0);

export class PliLexer extends DefaultLexer {
  compilerOptions: CompilerOptionResult = {
    issues: [],
    options: {},
  };

  uri!: URI;

  declare protected readonly tokenBuilder: PliTokenBuilder;

  private readonly configStorage: PliConfigStorage;

  constructor(services: PliServices) {
    super(services);
    this.configStorage = services.shared.workspace.PliConfigStorage;
  }

  override tokenize(text: string): LexerResult {
    const lines = this.splitLines(text);
    this.fillCompilerOptions(lines);
    this.tokenBuilder.or = this.compilerOptions.options.or || "|";
    this.tokenBuilder.not = this.compilerOptions.options.not || "^";
    const adjustedLines = lines.map((line) => this.adjustLine(line));
    const adjustedText = adjustedLines.join("");
    return super.tokenize(adjustedText);
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

  private fillCompilerOptions(lines: string[]): CompilerOptionResult {
    const max = Math.min(lines.length, 100);
    const globalOptions = this.configStorage.getCompilerOptions(this.uri);
    let fullText = "";
    for (let i = 0; i < max; i++) {
      const line = lines[i];
      const { length, eol } = this.getLineInfo(line);
      const process = "*PROCESS";
      if (line.includes(process)) {
        const startChar = line.indexOf(process);
        const startParseChar = startChar + process.length;
        let endChar = line.lastIndexOf(";");
        if (endChar < 0) {
          endChar = length;
        }
        const compilerOptionsText = line.substring(startParseChar, endChar);
        fullText += " ".repeat(startParseChar) + compilerOptionsText;
        const parsed = parseAbstractCompilerOptions(fullText);
        this.compilerOptions = mergeCompilerOptions(
          globalOptions,
          translateCompilerOptions(parsed),
        );
        const newText = " ".repeat(length) + eol;
        lines[i] = newText;
        return this.compilerOptions;
      } else {
        fullText += " ".repeat(length) + eol;
      }
    }
    this.compilerOptions = globalOptions;
    return this.compilerOptions;
  }

  private adjustLine(line: string): string {
    const { length, eol } = this.getLineInfo(line);
    const prefixLength = 1;
    if (length < prefixLength) {
      return " ".repeat(length) + eol;
    }
    const lineEnd = 72;
    const prefix = " ".repeat(prefixLength);
    let postfix = "";
    if (length > lineEnd) {
      postfix = " ".repeat(length - lineEnd);
    }
    return (
      prefix +
      line.substring(prefixLength, Math.min(lineEnd, length)) +
      postfix +
      eol
    );
  }

  private getLineInfo(text: string): LineInfo {
    let eol = "";
    let length = text.length;
    if (text.endsWith("\r\n")) {
      eol = "\r\n";
      length -= 2;
    } else if (text.endsWith("\n")) {
      eol = "\n";
      length -= 1;
    }
    return {
      eol,
      length,
    };
  }
}

interface LineInfo {
  eol: string;
  length: number;
}
