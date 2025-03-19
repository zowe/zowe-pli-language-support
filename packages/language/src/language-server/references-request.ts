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
import { Location, tokenToRange } from "./types";
import { resolveReference } from "../linking/resolver";
import { allReferences } from "../syntax-tree/ast-iterator";

export function referencesRequest(sourceFile: SourceFile, offset: number): Location[] {
    const token = binaryTokenSearch(sourceFile.tokens, offset);
    if (!token) {
        return [];
    }
    const payload = token.payload as TokenPayload;
    if (!payload) {
        return [];
    }
    const element = payload.element;
    if (payload.kind === CstNodeKind.DeclaredVariable_Name) {
        const refItem = element as ReferenceItem;
        const allRefs = allReferences(sourceFile.ast);
        const references = allRefs.filter(([item, ref]) => resolveReference(sourceFile, item, ref) === refItem);
        return references.map(([item, ref]) => {
            return {
                uri: payload.uri ?? sourceFile.uri.toString(),
                range: tokenToRange(ref.token)
            };
        });
    }
    return [];
}
