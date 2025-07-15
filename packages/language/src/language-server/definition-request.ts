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

import { CompilationUnit } from "../workspace/compilation-unit";
import { binaryTokenSearch } from "../utils/search";
import { Location } from "./types";
import {
  getNameToken,
  getReference,
  isIncludeItemToken,
  isNameToken,
  isReferenceToken,
} from "../linking/tokens";
import { URI } from "../utils/uri";
import { SyntaxKind } from "../syntax-tree/ast";

export function definitionRequest(
  compilationUnit: CompilationUnit,
  uri: URI,
  offset: number,
): Location[] {
  const tokens = compilationUnit.tokens.fileTokens.get(uri.toString());
  if (!tokens) {
    return [];
  }
  const token = binaryTokenSearch(tokens, offset);
  const payload = token?.payload;
  if (!payload) {
    return [];
  }
  if (isNameToken(payload.kind) && payload.uri) {
    return [
      {
        uri: payload.uri.toString(),
        range: {
          start: token.startOffset,
          end: token.endOffset + 1,
        },
      },
    ];
  } else if (isReferenceToken(payload.kind) && payload.element) {
    const ref = getReference(payload.element);
    if (!ref || !ref.node) {
      return [];
    }
    // If we're looking at ourselves, we don't report the definition.
    if (ref.node === payload.element) {
      return [];
    }
    const nameToken = getNameToken(ref.node);
    if (!nameToken?.payload.uri) {
      return [];
    }
    return [
      {
        uri: nameToken.payload.uri.toString(),
        range: {
          start: nameToken.startOffset,
          end: nameToken.endOffset + 1,
        },
      },
    ];
  } else if (
    isIncludeItemToken(payload.kind) &&
    payload.element?.kind === SyntaxKind.IncludeItem
  ) {
    // allow jumping to the resolved file when present
    const filePath = payload.element.filePath;
    if (filePath) {
      return [
        {
          uri: filePath,
          range: {
            start: 0,
            end: 0,
          },
        },
      ];
    }
  }
  return [];
}
