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
import { CstNodeKind } from "../syntax-tree/cst";
import { ReferenceItem } from "../syntax-tree/ast";
import { Location } from "./types";
import { getNameToken } from "../linking/names";
import { resolveReference } from "../linking/resolver";

export function definitionRequest(sourceFile: SourceFile, offset: number): Location[] {
    const token = binaryTokenSearch(sourceFile.tokens, offset);
    if (!token) {
        return [];
    }
    const payload = token.payload as TokenPayload;
    if (!payload) {
        return [];
    }
    const element = payload.element;
    if (payload.kind === CstNodeKind.ReferenceItem_ref_ID_0) {
        const refItem = element as ReferenceItem;
        const symbol = resolveReference(sourceFile, refItem, refItem.ref);
        if (!symbol) {
            return [];
        }
        const nameToken = getNameToken(symbol);
        if (!nameToken) {
            return [];
        }
        return [{
            uri: payload.uri ?? sourceFile.uri.toString(),
            range: {
                start: nameToken.startOffset,
                end: nameToken.endOffset! + 1
            }
        }];
    }
    return [];
}
