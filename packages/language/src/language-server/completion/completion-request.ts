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
  binaryTokenSearch,
  completionTokenIndexSearch,
} from "../../utils/search";
import { URI } from "../../utils/uri";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { CompletionItem, SimpleCompletionItem } from "../types";
import { SyntaxNode } from "../../syntax-tree/ast";
import {
  FollowElement,
  getFollowElements,
  provideEntryPointFollowElements,
} from "./follow-elements";
import { generateCompletionItems } from "./completion-generator";
import { fuzzyMatch } from "../../utils/fuzzy-matcher";
import { Token } from "../../parser/tokens";

export function completionRequest(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): CompletionItem[] {
  const tokens = unit.tokens.fileTokens[uri.toString()] ?? [];
  const tokenIndex = completionTokenIndexSearch(tokens, offset);
  const cursorToken = binaryTokenSearch(tokens, offset);
  const token = tokens[tokenIndex];
  const followElements: FollowElement[] = [];
  let context: SyntaxNode | undefined;
  if (token) {
    context = getTokenContext(tokens, tokenIndex);
    followElements.push(...getFollowElements(context, token));
  } else {
    followElements.push(...provideEntryPointFollowElements());
  }
  const items = followElements.flatMap((element) =>
    generateCompletionItems(unit, context, element),
  );
  return convertSimpleToItem(items, offset, cursorToken);
}

function getTokenContext(
  tokens: Token[],
  index: number,
): SyntaxNode | undefined {
  // Random magic number to get the context of the current completion request
  // If we don't find a context within those 5 tokens, the input is probably massively malformed
  // This prevents us from giving a completion for cross references, but that's ok
  for (let i = 0; i < 5; i++) {
    let token = tokens[index - i];
    if (!token) {
      return undefined;
    } else if (token.payload.element) {
      return token.payload.element;
    }
  }
  return undefined;
}

function getCompletionItemElements(token: Token | undefined, offset: number) {
  if (!token) {
    return {
      query: "",
      range: {
        start: offset,
        end: offset,
      },
    };
  }

  return {
    query: token.image.substring(0, offset - token.startOffset),
    range: {
      start: token.startOffset,
      end: token.endOffset + 1,
    },
  };
}

function convertSimpleToItem(
  items: SimpleCompletionItem[],
  offset: number,
  token?: Token,
): CompletionItem[] {
  const { query, range } = getCompletionItemElements(token, offset);

  return items
    .filter((item) => fuzzyMatch(query, item.text))
    .map(
      (item): CompletionItem => ({
        label: item.label,
        kind: item.kind,
        detail: item.detail,
        documentation: item.documentation,
        insertTextFormat: item.insertTextFormat,
        edit: {
          range,
          text: item.text,
        },
      }),
    );
}
