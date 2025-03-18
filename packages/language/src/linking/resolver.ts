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

import { Reference, SyntaxNode } from "../syntax-tree/ast";
import { SourceFile } from "../workspace/source-file";

export function resolveReference<T extends SyntaxNode>(sourceFile: SourceFile, context: SyntaxNode, reference: Reference<T> | null): T | undefined {
    if (reference === null || reference.node === null) {
        return undefined;
    }
    if (reference.node === undefined) {
        const symbol = sourceFile.symbols.getSymbol(context, reference.text);
        if (symbol) {
            reference.node = symbol as T;
            return symbol as T;
        } else {
            reference.node = null;
            return undefined;
        }
    }
    return reference.node;
}
