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

import { AstNode, AstNodeDescription, AstUtils, DefaultScopeComputation, LangiumDocument, PrecomputedScopes } from "langium";
import { CancellationToken } from "vscode-languageserver";

export class PliScopeComputation extends DefaultScopeComputation {

    override async computeExports(document: LangiumDocument, cancelToken = CancellationToken.None): Promise<AstNodeDescription[]> {
        return this.computeExportsForNode(document.parseResult.value, document, AstUtils.streamAllContents, cancelToken);
    }

    protected override processNode(node: AstNode, document: LangiumDocument, scopes: PrecomputedScopes): void {
        const container = AstUtils.findRootNode(node);
        if (container) {
            const name = this.nameProvider.getName(node);
            if (name) {
                scopes.add(container, this.descriptions.createDescription(node, name, document));
            }
        }
    }
}
