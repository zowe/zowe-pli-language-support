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

import * as fs from 'fs/promises';
import * as tokens from '../packages/language/src/parser/tokens.js';

const keywords = Array.from(tokens.keywordMap, ([key]) => key.toLowerCase()).toSorted();
const manual = JSON.parse(await fs.readFile('./packages/vscode-extension/syntaxes/pli.manual.json', 'utf8'));

const controlKeywords = [
    'if',
    'else',
    'then',
    'do',
    'end',
    'select',
    'otherwise',
    'on',
    'while',
    'next',
    'go',
    'to',
    'goto',
    'return',
    'when',
    'begin',
    'process',
    'include',
    'xinclude',
    'inscan',
    'xinscan',
    'deactivate',
    'deact',
    'activate',
    'act',
].sort();

const storageKeywords: string[] = [];
for (const keyword of keywords) {
    if (!controlKeywords.includes(keyword)) {
        storageKeywords.push(keyword);
    }
}

function toPattern(keywords: string[]) {
    const patterns: string[] = [];
    for (const keyword of keywords) {
        let keywordPattern = '';
        for (const char of keyword) {
            keywordPattern += tokens.escapeRegExp(char);
        }
        patterns.push(keywordPattern);
    }
    return `(?i)\\b(${patterns.join('|')})\\b`;
}

const controlPattern = toPattern(controlKeywords);
const storagePattern = toPattern(storageKeywords);

manual.patterns.unshift({
    name: 'keyword.control.pli',
    match: controlPattern
});

manual.patterns.unshift({
    name: 'keyword.storage.pli',
    match: storagePattern
});

const json = JSON.stringify(manual, null, 2);
await fs.writeFile('./packages/vscode-extension/syntaxes/pli.merged.json', json);
