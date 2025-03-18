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

import { IToken } from "chevrotain";
import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";

export function getNameToken(node: SyntaxNode): IToken | undefined {
    if (node.kind === SyntaxKind.DeclaredVariable && node.nameToken) {
        return node.nameToken;
    }
    return undefined;
}
