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
import { Location, tokenToRange } from "./types";
import {
  getNameToken,
  getReference,
  isIncludeItemToken,
  isNameToken,
  isReferenceToken,
} from "../linking/tokens";
import { URI } from "../utils/uri";
import { SyntaxKind, iterateReferenceNodes } from "../syntax-tree/ast";
import { getTokenAt } from "../linking/resolver";

export function definitionRequest(
  compilationUnit: CompilationUnit,
  uri: URI,
  offset: number,
): Location[] {
  const locations: Location[] = [];
  const token = getTokenAt(compilationUnit, uri, offset);
  if (!token) {
    return locations;
  }
  if (isNameToken(token.kind) && token.uri) {
    locations.push({
      uri: token.uri.toString(),
      range: {
        start: token.startOffset,
        end: token.endOffset + 1,
      },
    });
  } else if (isReferenceToken(token.kind) && token.element) {
    const ref = getReference(token.element);
    if (!ref || !ref.node) {
      return locations;
    }
    // If we're looking at ourselves, we don't report the definition.
    if (ref.node === token.element) {
      return locations;
    }
    for (const node of iterateReferenceNodes(ref)) {
      const nameToken = getNameToken(node);
      // A `synthetic` name token belongs to a preprocessor-generated declaration.
      // There is no meaningful source location to jump to, so we skip it.
      if (!nameToken?.uri || nameToken.synthetic) {
        continue;
      }
      locations.push({
        uri: nameToken.uri.toString(),
        range: {
          start: nameToken.startOffset,
          end: nameToken.endOffset + 1,
        },
        source: tokenToRange(token),
      });
    }
  } else if (
    isIncludeItemToken(token.kind) &&
    (token.element?.kind === SyntaxKind.IncludeItemFile ||
      token.element?.kind === SyntaxKind.IncludeItemMember ||
      token.element?.kind === SyntaxKind.InscanDirective)
  ) {
    let sourceRange = tokenToRange(token);
    if (
      token.element.kind !== SyntaxKind.InscanDirective &&
      token.element.range
    ) {
      sourceRange = token.element.range;
    }
    // allow jumping to the resolved file when present
    const filePath = token.element.filePath;
    if (filePath) {
      locations.push({
        uri: filePath,
        range: {
          start: 0,
          end: 0,
        },
        source: sourceRange,
      });
    }
  }
  return locations;
}
