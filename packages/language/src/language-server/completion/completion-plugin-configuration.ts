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
  jsoncFindNodeAtOffset,
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
  const rootNode = jsoncParseTree(documentText);
  if (!rootNode) {
    return [];
  }
  const currentNode = jsoncFindNodeAtOffset(rootNode, offset, true);
  if (!currentNode) {
    return [];
  }

  if (configProvider.isPgmConfigDocumentUri(uri)) {
    return pgroupValueCompletions(
      currentNode,
      configProvider.getProcessGroupNames(),
    );
  }

  // If completion for proc_grps.json file becomes necessary, add an
  // `if (configProvider.isProcGrpsDocumentUri(uri))` branch.
  return [];
}

function nodeContentRange(node: JsonNode): Range {
  const start = node.offset + 1;
  const end = Math.max(start, node.offset + node.length - 1);
  return { start, end };
}

function pgroupValueCompletions(
  node: JsonNode,
  pgroupNames: string[],
): CompletionItem[] {
  if (!pgroupNames.length || node.type !== "string") {
    return [];
  }
  const parentNode = node.parent;
  if (!parentNode) {
    return [];
  }
  const parentNodeChildren = parentNode.children;
  if (
    parentNode.type !== "property" ||
    !parentNodeChildren ||
    !parentNodeChildren.length ||
    parentNodeChildren[0].value !== "pgroup" ||
    parentNodeChildren[1] !== node
  ) {
    return [];
  }
  const range = nodeContentRange(node);

  const processGroupCompletions: CompletionItem[] = pgroupNames.map((name) => {
    return {
      label: name,
      kind: CompletionItemKind.Value,
      detail: "Process group from 'proc_grps.json'",
      edit: { range, text: name },
    };
  });

  return processGroupCompletions;
}
