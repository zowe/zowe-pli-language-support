import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { URI } from "../../src/utils/uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import { TextDocuments } from "../../src/language-server/text-documents";
import { replaceIndices } from "../utils";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { setFileSystemProvider } from "../../src/workspace/file-system-provider";
import { startLanguageServer } from "../../src/language-server/connection-handler";
import { Location } from "vscode-languageserver-types";

describe("Go To Definition request", () => {
  let fs: VirtualFileSystemProvider;
  let definitionHandler: (params: {
    textDocument: { uri: string };
    position: { line: number; character: number };
  }) => Location[];

  beforeEach(async () => {
    fs = new VirtualFileSystemProvider();
    setFileSystemProvider(fs);
    TextDocuments.all().forEach((doc) => TextDocuments.delete(doc.uri));

    // Create a mock connection with just the handler we need
    const mockConnection = {
      onDefinition: (handler: any) => {
        definitionHandler = handler;
      },
      onInitialize: () => {},
      onDidChangeTextDocument: () => {},
      onDidChangeWatchedFiles: () => {},
      onDidCloseTextDocument: () => {},
      onDidOpenTextDocument: () => {},
      onDidSaveTextDocument: () => {},
      onDidChangeConfiguration: () => {},
      onDidChangeContent: () => {},
      onDidClose: () => {},
      onDidOpen: () => {},
      onDidSave: () => {},
      onWillSaveTextDocument: () => {},
      onWillSaveTextDocumentWaitUntil: () => {},
      onCompletion: () => {},
      onReferences: () => {},
      languages: {
        semanticTokens: {
          on: () => {},
        },
      },
      onDocumentHighlight: () => {},
      onDocumentSymbol: () => {},
      onRenameRequest: () => {},
      onWorkspaceSymbol: () => {},
      listen: () => {},
      dispose: () => {},
      sendDiagnostics: () => {},
    };

    startLanguageServer(mockConnection as any);
  });

  afterEach(() => {
    setFileSystemProvider(undefined);
  });

  function expectDefinition(
    programs: string[],
    includeURIs: string[],
    expectAllRanges: boolean = true,
  ) {
    const codes: {
      output: string;
      indices: number[];
      ranges: [number, number][];
    }[] = [];
    const offsets: { offset: number; uri: string }[] = [];
    const ranges: { start: number; end: number; uri: string }[] = [];
    const allURIs = ["file:///test.pli", ...includeURIs];

    for (const program of programs) {
      codes.push(replaceIndices({ text: program }));
    }
    for (let i = 0; i < codes.length; i++) {
      const uri = URI.parse(allURIs[i]);
      fs.writeFile(uri, codes[i].output);
      offsets.push(
        ...codes[i].indices.map((offset) => ({ offset, uri: allURIs[i] })),
      );
      ranges.push(
        ...codes[i].ranges.map((range) => ({
          start: range[0],
          end: range[1],
          uri: allURIs[i],
        })),
      );
    }

    expect(offsets.length).toBeGreaterThan(0);

    const mainURI = URI.parse(allURIs[0]);
    const doc = TextDocument.create(
      mainURI.toString(),
      "pli",
      1,
      codes[0].output,
    );
    TextDocuments.set(doc);

    for (const offset of offsets) {
      const position = doc.positionAt(offset.offset);

      const definitions = definitionHandler({
        textDocument: { uri: offset.uri },
        position: { line: position.line, character: position.character },
      });

      if (expectAllRanges) {
        expect(definitions).toHaveLength(ranges.length);
      }
      // There exists at least one definition uri in the ranges uris with matching positions.
      for (const definition of definitions) {
        expect(
          ranges.some(
            (range) =>
              range.uri === definition.uri &&
              range.start === definition.range.start.character &&
              range.end === definition.range.end.character,
          ),
        ).toBe(true);
      }
    }
  }

  it("should resolve definition in same file", () => {
    const content = ` DCL <|X|> FIXED;
 <|>X = 1;`;

    expectDefinition([content], []);
  });

  it("should resolve definition in included file", () => {
    const includeContent = ` DCL <|Y|> FIXED;`;
    const mainContent = ` %INCLUDE "include.pli";
 <|>Y = 42;`;

    expectDefinition([mainContent, includeContent], ["file:///include.pli"]);
  });

  it("should resolve multiple requests", () => {
    const includeContent = ` DCL <|Y|> FIXED;`;
    const mainContent = ` %INCLUDE "include.pli";
 <|>Y = 42;
 <|>Y = 45;`;

    expectDefinition([mainContent, includeContent], ["file:///include.pli"]);
  });

  it("should resolve definition across multiple files", () => {
    const includeContent = ` DCL <|X|> FIXED;`;
    const includeContent2 = ` DCL <|Y|> FIXED;`;
    const mainContent = ` %INCLUDE "include.pli";
 %INCLUDE "include2.pli";
 <|>X = 42;
 <|>Y = 43;`;

    expectDefinition(
      [mainContent, includeContent, includeContent2],
      ["file:///include.pli", "file:///include2.pli"],
      false,
    );
  });
});
