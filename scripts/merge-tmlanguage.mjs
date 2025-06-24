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

import { createLangiumGrammarServices } from 'langium/grammar';
import { NodeFileSystem } from 'langium/node';
import { parseHelper } from 'langium/test';
import { AstUtils, GrammarAST, RegExpUtils } from 'langium';
import { readFileSync } from 'fs';

const services = createLangiumGrammarServices({
    fileSystemProvider: NodeFileSystem.fileSystemProvider
});
const parse = parseHelper(services.grammar);

const file = readFileSync('./packages/language/src/pli.langium', 'utf8');
const grammar = await parse(file);
const keywords = AstUtils.streamAst(grammar.parseResult.value)
    .filter(GrammarAST.isKeyword)
    .map(e => e.value)
    .filter(e => /\w/.test(e));

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
    'deactivate',
    'activate',
];

const storageKeywords = keywords.map(e => e.toLowerCase()).exclude(controlKeywords).toArray();
storageKeywords.push('SCAN', 'RESCAN');

function toPattern(keywords) {
    const patterns = [];
    for (const keyword of keywords) {
        let keywordPattern = '';
        for (const char of keyword) {
            keywordPattern += RegExpUtils.escapeRegExp(char);
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
