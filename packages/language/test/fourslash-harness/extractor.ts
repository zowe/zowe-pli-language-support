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

import fs from "fs";
import path from "path";
import { parseHarnessTestFile } from "./harness-parser";
import { getWrappers } from "./wrapper";
import { fourslashPath, getTestFiles } from "./utils";
import { UriUtils } from "../../src/utils/uri";
import { replaceNamedIndices } from "../utils";

export async function extractCompilerTestFiles(
  targetDir: string,
): Promise<void> {
  const wrappers = getWrappers();
  const files = getTestFiles();
  const skipped: string[] = [];
  for (const relativeFile of files) {
    const fullPath = path.join(fourslashPath, relativeFile);
    const testFile = await parseHarnessTestFile(relativeFile, fullPath, {
      wrappers,
    });
    if (testFile.tags["compiler"] !== "true") {
      if (testFile.tags["compiler"] === "skip") {
        skipped.push(relativeFile);
      }
      continue; // Only extract compiler tests
    }
    // Target path for the generated workspace - based on the test path/name
    let testTargetPath = path.join(targetDir, relativeFile);
    if (testTargetPath.endsWith(".ts")) {
      testTargetPath = testTargetPath.slice(0, -3);
    }
    const entries = Array.from(testFile.files.entries());
    const [[firstFileUri]] = entries;
    if (!firstFileUri) {
      console.warn(`No files found in test ${relativeFile}`);
      continue;
    }
    const firstFilePath = UriUtils.toFilePath(firstFileUri);
    const relativeDir = path.dirname(firstFilePath);
    for (const [fileUri, file] of testFile.files) {
      const fileContent = replaceNamedIndices(file.content).output;
      // Generate relative path within the test files
      const currentFilePath = UriUtils.toFilePath(fileUri);
      const relativePath = path.relative(relativeDir, currentFilePath);
      // Write the file to the target directory, preserving the relative structure
      const targetPath = path.join(testTargetPath, relativePath);
      const targetDirPath = path.dirname(targetPath);
      await fs.promises.mkdir(targetDirPath, { recursive: true });
      await fs.promises.writeFile(targetPath, fileContent);
    }
    console.log(`Extracted test ${relativeFile}`);
  }
  if (skipped.length) {
    console.warn(
      `The following tests were explicitly marked as skipped and were not extracted:\n${skipped
        .map((f) => `- ${f}`)
        .join("\n")}`,
    );
  }
}
