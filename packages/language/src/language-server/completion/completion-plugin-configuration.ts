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

import type { PluginConfigurationProvider } from "../../workspace/plugin-configuration-provider";
import type { CompletionItem, Range } from "../types";
import {
  jsoncFindNodeAtLocation,
  jsoncGetLocation,
  jsoncLocation,
  jsoncParseTree,
  type JsonNode,
} from "../../utils/jsonc";
import type { URI } from "../../utils/uri";
import { CompletionItemKind } from "vscode-languageserver-types";

export function configCompletionRequest(
  configProvider: PluginConfigurationProvider,
  documentText: string,
  offset: number,
  uri: URI,
): CompletionItem[] {
  if (configProvider.isPgmConfigDocumentUri(uri)) {
    const rootNode = jsoncParseTree(documentText);
    if (!rootNode) {
      return [];
    }
    const nodeLocation = jsoncGetLocation(documentText, offset);
    const pgroupNames = configProvider.getProcessGroupNames();
    const completions = pgroupValueCompletions(
      rootNode,
      offset,
      nodeLocation,
      pgroupNames,
    );
    return completions;
  }

  // If completion for proc_grps.json file becomes necessary, add an
  // `if (configProvider.isProcGrpsDocumentUri(uri))` branch.
  return [];
}

function pgroupValueCompletions(
  rootNode: JsonNode,
  offset: number,
  nodeLocation: jsoncLocation,
  pgroupNames: string[],
): CompletionItem[] {
  if (
    !pgroupNames.length ||
    nodeLocation.isAtPropertyKey ||
    !nodeLocation.matches(["pgms", "*", "pgroup"])
  ) {
    return [];
  }
  const nodeValue = jsoncFindNodeAtLocation(rootNode, nodeLocation.path);
  const range: Range =
    nodeValue?.type === "string"
      ? { start: nodeValue.offset, end: nodeValue.offset + nodeValue.length }
      : { start: offset, end: offset };

  const processGroupCompletions: CompletionItem[] = pgroupNames.map((name) => {
    return {
      label: name,
      kind: CompletionItemKind.Value,
      detail: "Process group from 'proc_grps.json'",
      filterText: `"${name}"`,
      edit: { range, text: `"${name}"` },
    };
  });
  return processGroupCompletions;
}
