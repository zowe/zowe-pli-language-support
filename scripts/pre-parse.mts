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
import { PliPreprocessorParser } from '../packages/language/src/preprocessor/pli-preprocessor-parser';
import { URI } from '../packages/language/src/utils/uri';
import { SyntaxKind } from '../packages/language/src/syntax-tree/ast';
import * as fs from 'fs';
import * as path from 'path';

// ------------------------------------------------------------------------------------------------
//  show usage and exit if no file path is provided
// ------------------------------------------------------------------------------------------------

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    showUsage();
    process.exit(1);
}

const filePath = args[0];

// Check if file exists
if (!fs.existsSync(filePath)) {
    console.error(`Error: File '${filePath}' does not exist.`);
    showUsage();
    process.exit(1);
}

// Read file contents
let pliCode: string;
try {
    pliCode = fs.readFileSync(filePath, 'utf8');
} catch (error) {
    console.error(`Error reading file '${filePath}':`, error);
    process.exit(1);
}

function showUsage(): void {
    const scriptName = path.basename(new URL(import.meta.url).pathname);
    console.warn(`Usage: npx tsx ${scriptName} <file-path>`);
    console.warn('  <file-path>: Path to a PL/I file to parse');
}

// ------------------------------------------------------------------------------------------------
//  parse the code
// ------------------------------------------------------------------------------------------------

// Create lexer and parser
const parser = new PliPreprocessorParser();

// Parse the code
const absolutePath = path.resolve(filePath);
const uri = URI.parse(`file://${absolutePath}`);
const state = parser.initializeState(pliCode, uri);
const result = parser.parse(state);

// ------------------------------------------------------------------------------------------------
//  display the results
// ------------------------------------------------------------------------------------------------

// whitelist token properties to be displayed
const whitelistTokenProperties = ['image', 'startOffset', 'endOffset'];

// blacklist AST properties not to be displayed
const blacklistASTProperties = ['condition', 'container', 'dimacrossExpr', 'dimensions', 'handle', 'labels', 'level', 'levelToken', 'multiplier', 'nameToken', 'owner', 'pointer', 'previous', 'scanMode', 'token', 'xDeclare'];

console.log('\n-------------\nLexer tokens:', result.tokens.length, "\n", JSON.stringify(result.tokens, composeReplacers(createCycleReplacer(), createLexerTokenReplacer()), 2));
console.log('\n-------------\nParse AST:', result.statements.length, "\n", JSON.stringify(result.statements, composeReplacers(createCycleReplacer(), createParserASTReplacer()), 2));
console.log('\n-------------\nParse errors:', result.errors.length, "\n", JSON.stringify(result.errors, createCycleReplacer(), 2));

// Create composable replacer functions
type Replacer = (key: string, value: any) => any;

function composeReplacers(...replacers: Replacer[]): Replacer {
    return (key: string, value: any) => replacers.reduce((currentValue, replacer) => replacer(key, currentValue), value);
}

function createCycleReplacer(): Replacer {
    const visited = new WeakSet();
    return (key: string, value: any) => {
        if (isObject(value)) {
            if (visited.has(value)) {
                return '[Circular Reference]';
            }
            visited.add(value);
        }
        return value;
    };
}

function createLexerTokenReplacer(): Replacer {
    return (key: string, value: any) => isObject(value) && !Array.isArray(value) ? replaceToken(value) : value;
}

function createParserASTReplacer(): Replacer {
    return (key: number | string, value: any) => {
        if (isObject(value)) {
            if (Array.isArray(value)) {
                return (key === 'tokens') ? value.map(token => replaceToken(token)) : value;
            }
            const filteredValue = Object.fromEntries(
                Object.keys(value)
                    .filter(propertyKey => !blacklistASTProperties.includes(propertyKey))
                    .map(propertyKey => [propertyKey, value[propertyKey]])
            );
            if ('kind' in filteredValue && typeof filteredValue.kind === 'number') {
                filteredValue.kind = SyntaxKind[filteredValue.kind] || `Unknown(${filteredValue.kind})`;
            }
            return filteredValue;
        }
        return value;
    };
}

function replaceToken(token: any): any {
    return Object.fromEntries(
        Object.keys(token)
            .filter(propertyKey => whitelistTokenProperties.includes(propertyKey))
            .map(propertyKey => [propertyKey, token[propertyKey]])
    );
}

function isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
}
