import type { SyntaxNode } from "./ast";
import type { CstNodeKind } from "./cst";

export class CstNode {
    kind: CstNodeKind;
    offset: number;
    endOffset: number;
    children: CstNode[];
    parent: CstNode;
    root: CstNode;
    uri: string;
    ast: SyntaxNode;

    constructor(kind: CstNodeKind, root: CstNode, offset: number, endOffset: number, uri: string) {
        this.kind = kind;
        this.root = root;
        this.uri = uri;
        this.offset = offset;
        this.endOffset = endOffset;
        this.children = [];
    }
}
