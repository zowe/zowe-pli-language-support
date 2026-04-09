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

import * as fs from "fs/promises";
import * as tokens from "../packages/language/src/parser/tokens.js";
import * as sqlTokens from "../packages/language/src/parser/tokens/sql-tokens.js";
import * as cicsTokens from "../packages/language/src/parser/tokens/cics-tokens.generated.js";
import { toPattern } from "./pattern-trie.js";

const manual = JSON.parse(
  await fs.readFile(
    "./packages/vscode-extension/syntaxes/pli.manual.json",
    "utf8",
  ),
);

const controlKeywords: string[] = [];
const storageKeywords: string[] = [];

const mergedMap = new Map([
  ...sqlTokens.keywordMap,
  ...cicsTokens.keywordMap,
  ...tokens.keywordMap,
]);

for (const [text, type] of mergedMap.entries()) {
  const lowerText = text.toLowerCase();
  if (tokens.controlTokens.has(type)) {
    controlKeywords.push(lowerText);
  } else {
    storageKeywords.push(lowerText);
  }
}

const controlPattern = toPattern(controlKeywords);
const storagePattern = toPattern(storageKeywords);

manual.patterns.unshift({
  name: "keyword.control.pli",
  match: controlPattern,
});

manual.patterns.unshift({
  name: "keyword.storage.pli",
  match: storagePattern,
});

const json = JSON.stringify(manual, null, 2);
await fs.writeFile(
  "./packages/vscode-extension/syntaxes/pli.merged.json",
  json,
);
