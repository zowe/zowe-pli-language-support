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

import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HarnessTest, UnnamedFile } from "./types";
import { PliTestFile } from "../utils";

export const frameworkFileName = "framework.ts";
export const testsPath = "packages/language/test/fourslash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The root of the project.
 */
export const projectRoot = path.join(__dirname, "../../../..");

/**
 * The path to the `fourslash` directory.
 *
 * Important: Assume that the test files exist in the `packages/language/test/fourslash` directory.
 */
export const fourslashPath = path.join(__dirname, "../fourslash");

export const harnessPath = __dirname;

export function getTestFiles(): string[] {
  return readdirSync(fourslashPath, { recursive: true })
    .map((file) => file.toString())
    .filter((file) => file.endsWith(".ts")) // Only .ts files
    .filter((file) => file !== frameworkFileName); // No framework file
}

/**
 * Get the files to load for a harness test.
 *
 * @param testFile - The test file to get the files for.
 * @returns The files to load for the harness test.
 */
export function getFiles(testFile: HarnessTest): PliTestFile[] {
  return Array.from(testFile.files.entries()).map(([uri, file]) => ({
    uri: uri,
    content: file.content,
  }));
}

export function getFileName(
  fileName: string | undefined,
): string | UnnamedFile {
  if (fileName === undefined) {
    return UnnamedFile;
  }

  return fileName;
}
