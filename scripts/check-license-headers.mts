#!/usr/bin/env npx tsx
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

import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";

const fixFlag = process.argv.includes("--fix");

const header = (await readFile("license-header.js", "utf-8")).replace(
  /\r\n/g,
  "\n",
);
const files = await glob("**/{src,test}/**/*.{js,mjs,cjs,ts,mts,cts}");
let count = 0;
for (let file of files) {
  file = file.replace(/\\/g, "/");
  if (
    file.includes("/generated/") ||
    file.startsWith("packages/language/test/fourslash-harness/wrappers")
  ) {
    continue;
  }

  const content = await readFile(file, "utf-8");
  if (!content.startsWith(header)) {
    count++;
    if (!fixFlag) {
      console.error(`${file}: missing license header.`);
    } else {
      await writeFile(file, header + content);
      console.error(`${file}: added license header.`);
    }
  }
}

if (count > 0) {
  const are = fixFlag ? "were" : "are";
  console.error(
    `${count} files of ${files.length} ${are} missing license headers.`,
  );
  !fixFlag && process.exit(1);
} else {
  console.log(`All ${files.length} files have a license header.`);
}
