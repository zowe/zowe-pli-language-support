/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import { readdirSync, readFileSync } from "fs";
import path from "path";
import { HARNESS_FILE_PREFIX } from "./harness-parser";
import { harnessPath } from "./utils";
import { tokenize } from "../../src/parser/tokenizer";

/**
 * Used to mark where content will be inserted in the wrapper file.
 */
const WRAPPER_CONTENT_TAG = "<...>";

export type Wrapper = {
  wrap: (content: string) => string;
  headerLength: number;
  footerLength: number;
};

/**
 * Parse a wrapper file into a function that can be used to wrap content.
 *
 * We use the <...> tag to mark where the content will be inserted in the wrapper file.
 *
 * @param content - The content of the wrapper file.
 * @returns A function that can be used to wrap content.
 */
export function parseWrapperFile(content: string): Wrapper {
  const wrapperLines = content
    .split("\n")
    .map((v) => v.substring(HARNESS_FILE_PREFIX.length));
  const wrapperContent = wrapperLines.join("\n");
  const wrapperFunction = (content: string) =>
    wrapperContent.replace(WRAPPER_CONTENT_TAG, () => content);

  const headerLength = wrapperLines.findIndex((v) =>
    v.includes(WRAPPER_CONTENT_TAG),
  );
  const footerLength = wrapperLines.length - headerLength - 1;

  return {
    wrap: wrapperFunction,
    headerLength,
    footerLength,
  };
}

/**
 * By using the `@wrap` tag, we can specify a wrapper file to use for the test.
 *
 * We use the <...> tag to mark where the content will be inserted in the wrapper file.
 *
 * @returns
 */
export function getWrappers(): Record<string, Wrapper> {
  const wrapperPaths = path.resolve(harnessPath, "wrappers");

  const files = readdirSync(wrapperPaths);
  const wrappers: Record<string, Wrapper> = {};

  for (const file of files) {
    const wrapperName = file.replace(/\.ts$/, "");
    const wrapper = readFileSync(path.resolve(wrapperPaths, file), "utf8");
    wrappers[wrapperName] = parseWrapperFile(wrapper);
  }

  return wrappers;
}

/**
 * Marker used to find the position of the wrapped content when tokenizing a wrapper.
 */
const WRAPPER_MARKER = "__WRAPPER_CONTENT_MARKER__";

/**
 * Creates a function that surrounds the expected preprocessor output with the header and footer of a wrapper.
 *
 * This is used by tests that tag themselves with `@wrapTokens`: the source file is wrapped in a procedure
 * (so that it is valid PL/I for a real compiler), and the preprocessor output therefore contains the
 * wrapper's header and footer tokens as well. The test only needs to describe the part it cares about.
 *
 * @param wrapper - The wrapper of the test file or `undefined` if the file is not wrapped.
 * @returns A function that adds the wrapper to expected tokens, or the identity if there is no wrapper.
 */
export function createExpectedTokensWrapper(
  wrapper: Wrapper | undefined,
): (expected: string | string[]) => string | string[] {
  if (!wrapper) {
    return (expected) => expected;
  }
  const [header, footer] = wrapper.wrap(WRAPPER_MARKER).split(WRAPPER_MARKER);
  const headerTokens = tokenize(header, undefined).tokens.map((t) => t.image);
  const footerTokens = tokenize(footer, undefined).tokens.map((t) => t.image);
  return (expected) =>
    Array.isArray(expected)
      ? [...headerTokens, ...expected, ...footerTokens]
      : wrapper.wrap(expected);
}
