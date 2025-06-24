import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";

const SyntaxKindReverseLookup: Map<SyntaxKind, string> = new Map(
  Object.values(SyntaxKind)
    .filter((key) => typeof key === "number")
    .map((key) => [key, SyntaxKind[key]]),
);

/**
 * This function assigns a `_debugKind: string` to each node that
 * alleviates debugging by allowing the user to see the kind
 * of the node in the debugger.
 */
export function assignDebugKinds(node: SyntaxNode) {
  (node as any)._debugKind = SyntaxKindReverseLookup.get(node.kind);
  forEachNode(node, assignDebugKinds);
}
