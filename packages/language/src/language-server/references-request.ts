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
import { Location, tokenToRange } from "./types";
import { getNameToken, getReference, isNameToken, isReferenceToken } from "../linking/tokens";

export function referencesRequest(sourceFile: SourceFile, offset: number): Location[] {
    const token = binaryTokenSearch(sourceFile.tokens, offset);
    const payload = token?.payload as TokenPayload;
    if (!payload) {
        return [];
    }
    let element = payload.element;
    if (isReferenceToken(payload.kind)) {
        // Find the reference beloging to the token
        const ref = getReference(payload.element);
        if (ref && ref.node) {
            element = ref.node;
        } else {
            return [];
        }
    } else if (!isNameToken(payload.kind)) {
        // Not a reference or a name token
        return [];
    }
    const reverseReferences = sourceFile.references.findReferences(element);
    const locations: Location[] = [];
    const nameToken = getNameToken(element);
    if (nameToken) {
        locations.push({
            uri: sourceFile.uri.toString(),
            range: tokenToRange(nameToken)
        })
    }
    for (const ref of reverseReferences) {
        locations.push({
            uri: payload.uri ?? sourceFile.uri.toString(),
            range: tokenToRange(ref.token)
        });
    }
    return locations;
}
