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
} from "jsonc-parser";

export {
  applyEdits as jsoncApplyEdits,
  findNodeAtLocation as jsoncFindNodeAtLocation,
  findNodeAtOffset as jsoncFindNodeAtOffset,
  getLocation as jsoncGetLocation,
  type Location as jsoncLocation,
  modify as jsoncModify,
  parseTree as jsoncParseTree,
  type JSONPath,
  parse as jsoncParse,
  printParseErrorCode as jsoncPrintParseErrorCode,
  type Node as JsonNode,
  type ParseError,
};
