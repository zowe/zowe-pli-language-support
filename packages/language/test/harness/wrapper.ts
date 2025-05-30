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

import { readdirSync, readFileSync } from "fs";
import path from "path";
import { HARNESS_FILE_PREFIX } from "./harness-parser";

/**
 * Used to mark where content will be inserted in the wrapper file.
 */
const WRAPPER_CONTENT_TAG = "<...>";

export type Wrapper = (content: string) => string;

/**
 * By using the `@wrap` tag, we can specify a wrapper file to use for the test.
 *
 * We use the <...>
 *
 * @returns
 */
export function getWrappers(): Record<string, Wrapper> {
  const wrapperPaths = path.resolve(__dirname, "wrappers");

  const files = readdirSync(wrapperPaths);
  const wrappers: Record<string, Wrapper> = {};

  for (const file of files) {
    const wrapperName = file.replace(/\.ts$/, "");
    const wrapper = readFileSync(path.resolve(wrapperPaths, file), "utf8");
    const wrapperContent = wrapper
      .split("\n")
      .map((v) => v.substring(HARNESS_FILE_PREFIX.length))
      .join("\n");
    wrappers[wrapperName] = (content: string) =>
      wrapperContent.replace(WRAPPER_CONTENT_TAG, content);
  }

  return wrappers;
}
