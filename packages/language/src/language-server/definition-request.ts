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

import { SourceFile } from "../workspace/source-file";
import { binaryTokenSearch } from "../utils/search";
import { TokenPayload } from "../parser/abstract-parser";
import { Location } from "./types";
import {
  getNameToken,
  getReference,
  isNameToken,
  isReferenceToken,
} from "../linking/tokens";

export function definitionRequest(
  sourceFile: SourceFile,
  offset: number,
): Location[] {
  const token = binaryTokenSearch(sourceFile.tokens, offset);
  const payload = token?.payload as TokenPayload;
  if (!payload || !token) {
    return [];
  }
  if (isNameToken(payload.kind)) {
    return [
      {
        uri: sourceFile.uri.toString(),
        range: {
          start: token.startOffset,
          end: token.endOffset! + 1,
        },
      },
    ];
  } else if (isReferenceToken(payload.kind)) {
    const ref = getReference(payload.element);
    if (!ref || !ref.node) {
      return [];
    }
    const nameToken = getNameToken(ref.node);
    if (!nameToken) {
      return [];
    }
    return [
      {
        uri: payload.uri ?? sourceFile.uri.toString(),
        range: {
          start: nameToken.startOffset,
          end: nameToken.endOffset! + 1,
        },
      },
    ];
  }
  return [];
}
