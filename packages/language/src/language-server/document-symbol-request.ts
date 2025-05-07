import {
  DocumentSymbol,
  Position,
  SymbolKind,
} from "vscode-languageserver-types";
import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";
import { Range, rangeToLSP, getSyntaxNodeRange, tokenToRange } from "./types";
import { TextDocuments } from "./text-documents";
import {
  DeclaredItem,
  ProcedureStatement,
  Statement,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { TextDocument } from "vscode-languageserver-textdocument";

// ---- Document Symbol Builder ----

interface LevelSymbol {
  level: number | null;
  symbol: DocumentSymbol;
}

interface SymbolBuilder {
  canHandle(node: SyntaxNode): boolean;
  buildSymbol(
    node: SyntaxNode,
    textDocument: TextDocument,
    childSymbols: DocumentSymbol[],
  ): DocumentSymbol[];
}

class ProcedureSymbolBuilder implements SymbolBuilder {
  canHandle(node: SyntaxNode): boolean {
    return node.kind === SyntaxKind.ProcedureStatement;
  }

  buildSymbol(
    node: SyntaxNode,
    textDocument: TextDocument,
    childSymbols: DocumentSymbol[],
  ): DocumentSymbol[] {
    const procedureStatement = node as ProcedureStatement;
    const labelPrefixStatement = node.container as Statement;
    const procedureName =
      labelPrefixStatement.labels.map((label) => label.name).join(" ") ??
      "<unknown>";
    const range = getSyntaxNodeRange(labelPrefixStatement.labels[0]) ?? {
      start: 0,
      end: 0,
    };
    const symbol = createDocumentSymbol(
      procedureName,
      SymbolKind.Function,
      range,
      childSymbols,
      textDocument,
    );
    // Set the range end to the end statement of the procedure if a label exists.
    if (procedureStatement.end) {
      const endStatementToken = procedureStatement.end.label?.label?.token;
      if (endStatementToken) {
        symbol.range.end = rangeToLSP(
          textDocument,
          tokenToRange(endStatementToken),
        ).end;
      }
    }
    return [symbol];
  }
}

class DeclareSymbolBuilder implements SymbolBuilder {
  canHandle(node: SyntaxNode): boolean {
    return node.kind === SyntaxKind.DeclareStatement;
  }

  buildSymbol(
    node: SyntaxNode,
    textDocument: TextDocument,
    childSymbols: DocumentSymbol[],
  ): DocumentSymbol[] {
    const levelSymbols: LevelSymbol[] = [];
    const hierarchyBuilder = new DeclareSymbolBuilder.LevelHierarchyBuilder();
    const declareNode = node as { items: DeclaredItem[] };

    for (const item of declareNode.items.filter(
      (i: DeclaredItem) => i.kind === SyntaxKind.DeclaredItem,
    )) {
      levelSymbols.push(
        ...this.retrieveLevelSymbols(item, null, childSymbols, textDocument),
      );
    }

    for (const levelSymbol of levelSymbols) {
      hierarchyBuilder.addSymbol(levelSymbol.level, levelSymbol.symbol);
    }

    return hierarchyBuilder.getRootSymbols();
  }

  private static LevelHierarchyBuilder = class {
    private levelMap: Map<number, DocumentSymbol>;
    private rootSymbols: DocumentSymbol[];

    constructor() {
      this.levelMap = new Map();
      this.rootSymbols = [];
    }

    addSymbol(level: number | null, symbol: DocumentSymbol): void {
      if (!level) {
        this.rootSymbols.push(symbol);
        return;
      }

      let parentLevel = level - 1;
      while (!this.levelMap.has(parentLevel) && parentLevel > 0) {
        parentLevel--;
      }

      if (parentLevel > 0) {
        const parentSymbol = this.levelMap.get(parentLevel);
        if (parentSymbol) {
          parentSymbol.children = [symbol, ...(parentSymbol.children ?? [])];
          parentSymbol.kind = SymbolKind.Struct;
          parentSymbol.range.end = getLastPositionOrDefault(
            parentSymbol.children,
            symbol.range.end,
          );
        }
      } else {
        this.rootSymbols.push(symbol);
      }

      this.levelMap.set(level, symbol);
      // Remove all larger levels to reset position
      for (const key of this.levelMap.keys()) {
        if (key > level) {
          this.levelMap.delete(key);
        }
      }
    }

    getRootSymbols(): DocumentSymbol[] {
      return this.rootSymbols;
    }
  };

  private retrieveLevelSymbols(
    item: DeclaredItem,
    inheritedLevel: number | null,
    children: DocumentSymbol[],
    textDocument: TextDocument,
  ): LevelSymbol[] {
    const levelSymbols: LevelSymbol[] = [];

    let kind: SymbolKind = SymbolKind.Variable;
    if (
      // Type is lower case in the ast but upper case in the definition.
      item.attributes.some(
        (a) =>
          a.kind === SyntaxKind.ComputationDataAttribute &&
          a.type?.toString() === "constant",
      )
    ) {
      kind = SymbolKind.Constant;
    }

    for (const element of item.elements.filter((e) => e !== "*")) {
      if (element.kind === SyntaxKind.DeclaredItem) {
        // Declared struct items can inherit their level from the parent,
        // e.g., 11 (XX, ZZ) char(10).
        levelSymbols.push(
          ...this.retrieveLevelSymbols(
            element,
            item.level ?? inheritedLevel,
            children,
            textDocument,
          ),
        );
      } else if (element.kind === SyntaxKind.DeclaredVariable) {
        const name = element.name ?? "<unknown>";
        const range = getSyntaxNodeRange(element) ?? { start: 0, end: 0 };
        levelSymbols.push({
          level: item.level ?? inheritedLevel,
          symbol: createDocumentSymbol(
            name,
            kind,
            range,
            children,
            textDocument,
          ),
        });
      }
    }

    return levelSymbols;
  }
}

class LabelSymbolBuilder implements SymbolBuilder {
  canHandle(node: SyntaxNode): boolean {
    if (node.kind !== SyntaxKind.LabelPrefix) {
      return false;
    }

    const container = node.container;
    if (!container || container.kind !== SyntaxKind.Statement) {
      return true;
    }

    return container.value?.kind !== SyntaxKind.ProcedureStatement;
  }

  buildSymbol(
    node: SyntaxNode,
    textDocument: TextDocument,
    childSymbols: DocumentSymbol[],
  ): DocumentSymbol[] {
    const labelPrefixStatement = node.container as Statement;
    if (!labelPrefixStatement?.labels?.length) {
      return [];
    }

    return labelPrefixStatement.labels.map((label) => {
      const name = label.name ?? "<unknown>";
      const range = getSyntaxNodeRange(label) ?? { start: 0, end: 0 };

      return createDocumentSymbol(
        name,
        SymbolKind.Key,
        range,
        childSymbols,
        textDocument,
      );
    });
  }
}

// ---- Document Symbol Request ----

const DOCUMENT_SYMBOL_BUILDERS: SymbolBuilder[] = [
  new ProcedureSymbolBuilder(),
  new DeclareSymbolBuilder(),
  new LabelSymbolBuilder(),
];

export function documentSymbolRequest(
  compilationUnit: CompilationUnit,
  uri: URI,
): DocumentSymbol[] {
  const symbols: DocumentSymbol[] = [];
  const textDocument = TextDocuments.get(uri.toString());

  if (!textDocument) {
    return symbols;
  }

  const collectSymbols = (node: SyntaxNode): DocumentSymbol[] => {
    const childSymbols: DocumentSymbol[] = [];

    // DeclaredItems are handled separately as they are organized flat,
    // but structs should be displayed in the hierarchy.
    if (node.kind !== SyntaxKind.DeclareStatement) {
      forEachNode(node, (child) => {
        const childSymbol = collectSymbols(child);
        if (childSymbol) {
          childSymbols.push(...childSymbol);
        }
      });
    }

    for (const builder of DOCUMENT_SYMBOL_BUILDERS) {
      if (builder.canHandle(node)) {
        return builder.buildSymbol(node, textDocument, childSymbols);
      }
    }

    return childSymbols;
  };

  // Start collecting symbols from the root
  const rootSymbols = collectSymbols(compilationUnit.ast);
  symbols.push(...rootSymbols);
  return symbols;
}

function createDocumentSymbol(
  name: string,
  kind: SymbolKind,
  selectionRange: Range,
  children: DocumentSymbol[],
  textDocument: TextDocument,
): DocumentSymbol {
  const selectionLSPRange = rangeToLSP(textDocument, selectionRange);
  const range = {
    start: selectionLSPRange.start,
    end: getLastPositionOrDefault(children, selectionLSPRange.end),
  };
  return DocumentSymbol.create(
    name,
    undefined,
    kind,
    range,
    selectionLSPRange,
    children,
  );
}

function getLastPositionOrDefault(
  children: DocumentSymbol[],
  defaultPosition: Position,
): Position {
  if (children.length === 0) {
    return defaultPosition;
  }

  // Among children on the last line, find the one with highest character position
  const lastLine = Math.max(...children.map((child) => child.range.end.line));
  const lastLineChildren = children.filter(
    (child) => child.range.end.line === lastLine,
  );
  const lastCharacter = Math.max(
    ...lastLineChildren.map((child) => child.range.end.character),
  );

  return {
    line: lastLine,
    character: lastCharacter,
  };
}
