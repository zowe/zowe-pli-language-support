import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";

const SyntaxKindReverseLookup: Map<SyntaxKind, string> = new Map(
  Object.values(SyntaxKind)
    .filter((key) => typeof key === "number")
    .map((key) => [key, SyntaxKind[key]]),
);

const createDebugIdGenerator = () => {
  let id = 0;
  return () => {
    return id++;
  };
};

const generateDebugId = createDebugIdGenerator();

/**
 * This function assigns a `_debugKind: string` to each node that
 * alleviates debugging by allowing the user to see the kind
 * of the node in the debugger.
 */
export function assignDebugKinds(node: SyntaxNode) {
  (node as any)._debugKind = SyntaxKindReverseLookup.get(node.kind);
  (node as any)._debugId = generateDebugId();
  forEachNode(node, assignDebugKinds);
}
