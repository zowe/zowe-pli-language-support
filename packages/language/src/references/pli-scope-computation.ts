import { AstNode, AstNodeDescription, AstUtils, DefaultScopeComputation, LangiumDocument, PrecomputedScopes } from "langium";
import { CancellationToken } from "vscode-jsonrpc";

export class PliScopeComputation extends DefaultScopeComputation {

    override computeExports(_document: LangiumDocument, _cancelToken?: CancellationToken): Promise<AstNodeDescription[]> {
        return Promise.resolve([]);
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