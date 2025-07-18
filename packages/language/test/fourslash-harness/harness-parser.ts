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

import { readFileSync } from "fs";
import { HarnessFile, HarnessTest, UnnamedFile } from "./types";
import { getFileName } from "./utils";
import { Wrapper } from "./wrapper";
import path from "path";

const HarnessFileTag = {
  // The name of the file
  FileName: "filename",
  // Wrap the test in a template, e.g. `STARTPR: PROCEDURE OPTIONS (MAIN); <...> END STARTPR;`
  Wrap: "wrap",
};

/**
 * Note: changing the `HARNESS_TAG_PREFIX` requires updating the `HARNESS_TAG_PATTERN`
 */
const HARNESS_TAG_PREFIX = "//";
export const HARNESS_FILE_PREFIX = "////";
const REFERENCE_PATH_PREFIX = "/// <reference path=";
const HARNESS_TAG_PATTERN = /^\/\/\s*@(?<name>\w+)\s*:(?<value>.*)$/;

type Context = {
  wrappers: Record<string, Wrapper>;
};

/**
 * Parses a harness test file into a `HarnessTest` object.
 *
 * @example of a harness test file:
 * ```ts
 * /// <reference path="./framework.ts" />
 *
 * /**
 *  * This test verifies that the linker can handle nested procedures.
 *  *\/
 *
 * // @wrap: main
 * // @filename: hej.pli
 * //// DCL <|1:A|>;
 * //// PUT(<|1>A);
 *
 * linker.expectLinks();
 * ```
 */
class HarnessTestParser {
  private text: string;
  private lines: string[];
  private seenReference: boolean = false;
  private lineOffset: number = 0;

  constructor(
    text: string,
    private fileName: string,
    private context: Context,
  ) {
    // Reverse it for performance reasons, faster to pop than shift
    this.lines = text.split("\n").toReversed();
    this.text = text;
  }

  private peek(): string | undefined {
    return this.lines[this.lines.length - 1];
  }

  private next(): string | undefined {
    this.lineOffset++;

    return this.lines.pop();
  }

  private parseTags(): Record<string, string> {
    const tags: Record<string, string> = {};

    while (true) {
      const line = this.peek();
      if (
        line === undefined ||
        line.startsWith(HARNESS_FILE_PREFIX) ||
        !line.startsWith(HARNESS_TAG_PREFIX)
      ) {
        break;
      }

      this.next();

      if (line.trim() === "") {
        throw new Error(`Empty line found after harness tag`);
      }

      const match = line.match(HARNESS_TAG_PATTERN);
      if (!match) {
        throw new Error(`Invalid tag: ${line}`);
      }

      tags[match.groups!.name] = match.groups!.value.trim();
    }

    return tags;
  }

  private getWrapper(wrap: string): Wrapper {
    const wrapper = this.context.wrappers[wrap];
    if (!wrapper) {
      throw new Error(`Wrapper '${wrap}' not found`);
    }

    return wrapper;
  }

  private parseHarnessFile(): HarnessFile {
    const lines: string[] = [];

    const tags = this.parseTags();
    const fileName = tags[HarnessFileTag.FileName];
    const wrap: string | undefined = tags[HarnessFileTag.Wrap];

    const lineOffsetPreWrap = this.lineOffset;

    while (true) {
      const line = this.peek();
      if (line === undefined || !line.startsWith(HARNESS_FILE_PREFIX)) {
        break;
      }

      this.next();

      // Remove the prefix
      const content = line.substring(HARNESS_FILE_PREFIX.length);
      lines.push(content);
    }

    let content = lines.join("\n");
    const wrapper = wrap ? this.getWrapper(wrap) : undefined;
    if (wrapper) {
      content = wrapper.wrap(content);
    }

    const wrapperLineOffset = wrapper ? wrapper.headerLength : 0;
    const lineOffset = lineOffsetPreWrap - wrapperLineOffset + 1;
    const characterOffset = HARNESS_FILE_PREFIX.length;

    return {
      fileName,
      wrap,
      content,
      lineOffset,
      characterOffset,
    };
  }

  parse(): HarnessTest {
    const files: Map<string | UnnamedFile, HarnessFile> = new Map();

    // We consume lines, parsing files as we find them
    while (this.lines.length > 0) {
      const line = this.peek();
      if (line === undefined) {
        break;
      }

      // Skip empty lines
      if (line.trim() === "") {
        this.next();
        continue;
      }

      // There is always one at the top of the file
      if (line.startsWith(REFERENCE_PATH_PREFIX)) {
        if (this.seenReference) {
          throw new Error("Multiple reference paths found in test file");
        }

        this.seenReference = true;
        this.next();
        continue;
      }

      const isComment =
        line.startsWith(HARNESS_TAG_PREFIX) ||
        line.startsWith(HARNESS_FILE_PREFIX);
      if (isComment) {
        const file = this.parseHarnessFile();
        const fileName = getFileName(file.fileName);

        if (files.get(fileName) !== undefined) {
          if (fileName === UnnamedFile) {
            throw new Error(`Multiple files without file names found`);
          }

          throw new Error(`Duplicate file name: '${fileName}'`);
        }

        files.set(fileName, file);
        continue;
      }

      // We didn't find a code block or reference path, so we continue.
      // Probably, we're looking at a JS command.
      this.next();
    }

    return {
      fileName: this.fileName,
      files,
      commands: this.text,
    };
  }
}

/**
 * Parse a harness test file into a `HarnessTest` object.
 *
 * @param text - The text of the harness test file.
 * @param filename - The filename of the harness test file.
 * @param context - The context of the harness test file.
 * @returns The `HarnessTest` object.
 */
export function parseHarnessTest(
  text: string,
  fileName: string,
  context: Context,
): HarnessTest {
  return new HarnessTestParser(text, fileName, context).parse();
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

const ownFile = readFileSync(__filename, "utf-8");
const header = normalize(ownFile.substring(0, ownFile.indexOf("*/") + 2));

/**
 * Parse a harness test file into a `HarnessTest` object.
 *
 * Will throw if parsing fails.
 *
 * @param fileName - The filename of the harness test file.
 * @param context - The context of the harness test file.
 * @returns The `HarnessTest` object.
 */
export function parseHarnessTestFile(
  relativePath: string,
  fileName: string,
  context: Context,
): HarnessTest {
  const text = readFileSync(fileName, "utf-8");

  if (!normalize(text).startsWith(header)) {
    throw new Error(
      `File '${relativePath}' does not start with the expected license header.`,
    );
  }

  try {
    return parseHarnessTest(text, fileName, context);
  } catch (e: unknown) {
    const relativePath = path.relative(__dirname, fileName);
    throw new Error(
      `Error in harness test: ${relativePath}: ${(e as Error).message}`,
    );
  }
}
