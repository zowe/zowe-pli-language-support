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

import {
  applyEdits,
  findNodeAtLocation,
  findNodeAtOffset,
  getLocation,
  type Location,
  modify,
  parseTree,
  type JSONPath,
  type Node,
  parse,
  printParseErrorCode,
  type ParseError,
  ParseOptions,
} from "jsonc-parser";

// Provide default parse options
// Since we now also use this for parsing vscode settings, we need to be lenient
const defaultOptions: ParseOptions = {
  allowEmptyContent: true,
  allowTrailingComma: true,
  disallowComments: false,
};

export function jsoncParseTree(
  text: string,
  errors?: ParseError[],
): Node | undefined {
  return parseTree(text, errors, defaultOptions);
}

export function jsoncParse(text: string, errors?: ParseError[]): any {
  return parse(text, errors, defaultOptions);
}

export {
  applyEdits as jsoncApplyEdits,
  findNodeAtLocation as jsoncFindNodeAtLocation,
  findNodeAtOffset as jsoncFindNodeAtOffset,
  getLocation as jsoncGetLocation,
  type Location as jsoncLocation,
  modify as jsoncModify,
  type JSONPath,
  printParseErrorCode as jsoncPrintParseErrorCode,
  type Node as JsonNode,
  type ParseError,
};
