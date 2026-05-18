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

import path from "path";

let targetDir = process.argv[2];
if (!targetDir) {
  console.error("Usage: extract-compiler-tests <target-directory>");
  process.exit(1);
}

if (!path.isAbsolute(targetDir)) {
  targetDir = path.resolve(process.cwd(), targetDir);
}

import { extractCompilerTestFiles } from "../packages/language/test/fourslash-harness/extractor";

await extractCompilerTestFiles(targetDir);
