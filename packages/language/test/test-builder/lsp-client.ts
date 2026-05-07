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

import {
  Connection,
  CompletionParams,
  DefinitionParams,
  HoverParams,
  InitializeParams,
  PublishDiagnosticsParams,
  ReferenceParams,
  SemanticTokensParams,
  SignatureHelpParams,
  DocumentHighlightParams,
  RenameParams,
  DocumentSymbolParams,
  WorkspaceSymbolParams,
  CodeActionParams,
  ExecuteCommandParams,
} from "vscode-languageserver/node";
import {
  CompletionItem,
  Diagnostic,
  Hover,
  Location,
  LocationLink,
  Position,
  SemanticTokens,
  SignatureHelp,
  TextDocumentItem,
  DocumentHighlight,
  WorkspaceEdit,
  DocumentSymbol,
  SymbolInformation,
  CodeAction,
  Command,
} from "vscode-languageserver-types";
import { createTestConnection } from "./lsp-connection";
import { startLanguageServer } from "../../src/language-server/connection-handler";
import { FileSystemProvider } from "../../src/workspace/file-system-provider";

export interface TestFileInfo {
  uri: string;
  content: string;
  languageId?: string;
}

export class TestLspClient {
  private connection: Connection;
  private serverConnection: Connection;
  private dispose: () => void;
  private diagnosticsByUri = new Map<string, Diagnostic[]>();
  private initializePromise: Promise<void>;

  constructor(files: Map<string, TestFileInfo>, fs: FileSystemProvider) {
    const { clientConnection, serverConnection, dispose } =
      createTestConnection();
    this.connection = clientConnection;
    this.serverConnection = serverConnection;
    this.dispose = dispose;

    this.connection.onNotification(
      "textDocument/publishDiagnostics",
      (params: PublishDiagnosticsParams) => {
        this.diagnosticsByUri.set(params.uri, params.diagnostics);
      },
    );

    startLanguageServer(this.serverConnection, fs);

    this.connection.listen();

    this.initializePromise = this.initialize(files);
  }

  private async initialize(files: Map<string, TestFileInfo>): Promise<void> {
    const initParams: InitializeParams = {
      processId: process.pid,
      rootUri: null,
      capabilities: {
        textDocument: {
          hover: {
            contentFormat: ["markdown", "plaintext"],
          },
          completion: {
            completionItem: {
              snippetSupport: false,
            },
          },
          signatureHelp: {
            signatureInformation: {
              documentationFormat: ["markdown", "plaintext"],
            },
          },
          semanticTokens: {
            requests: {
              full: true,
            },
            tokenTypes: [],
            tokenModifiers: [],
            formats: ["relative"],
          },
        },
      },
      workspaceFolders: null,
    };

    await this.connection.sendRequest("initialize", initParams);

    await this.connection.sendNotification("initialized", {});

    for (const [uri, fileInfo] of files) {
      await this.didOpen(uri, fileInfo.content, fileInfo.languageId);
    }
  }

  async ensureInitialized(): Promise<void> {
    await this.initializePromise;
  }

  async didOpen(
    uri: string,
    content: string,
    languageId: string = "pli",
  ): Promise<void> {
    const textDocument: TextDocumentItem = {
      uri,
      languageId,
      version: 1,
      text: content,
    };

    await this.connection.sendNotification("textDocument/didOpen", {
      textDocument,
    });

    // Wait for diagnostics to be published
    await this.waitForDiagnostics(uri);
  }

  /**
   * Waits for diagnostics to be published and stable for a URI.
   * Waits until diagnostics are published, then waits a bit more to ensure they're stable.
   */
  private async waitForDiagnostics(
    uri: string,
    timeoutMs: number = 1000,
  ): Promise<void> {
    const startTime = Date.now();
    let delay = 5; // Start with 5ms
    let lastChangeTime: number | undefined;
    let lastDiagnosticCount = -1;
    let hasSeenDiagnostics = false;

    while (Date.now() - startTime < timeoutMs) {
      const currentDiagnostics = this.diagnosticsByUri.get(uri);
      const currentCount = currentDiagnostics?.length ?? -1;

      // Track if we've seen any diagnostics publication
      if (!hasSeenDiagnostics && this.diagnosticsByUri.has(uri)) {
        hasSeenDiagnostics = true;
      }

      // Check if diagnostics have changed
      if (currentCount !== lastDiagnosticCount) {
        lastDiagnosticCount = currentCount;
        lastChangeTime = Date.now();
      }

      // If we've seen diagnostics and they've been stable for 50ms, consider them final
      if (
        hasSeenDiagnostics &&
        lastChangeTime &&
        Date.now() - lastChangeTime >= 50
      ) {
        return;
      }

      // Wait with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, 50); // Cap at 50ms
    }

    // Timeout reached - diagnostics may legitimately be empty or still changing
  }

  async didChange(uri: string, content: string): Promise<void> {
    await this.connection.sendNotification("textDocument/didChange", {
      textDocument: {
        uri,
        version: 1,
      },
      contentChanges: [{ text: content }],
    });

    // Wait for updated diagnostics to be published
    await this.waitForDiagnostics(uri);
  }

  async didClose(uri: string): Promise<void> {
    await this.connection.sendNotification("textDocument/didClose", {
      textDocument: { uri },
    });
  }

  async hover(uri: string, position: Position): Promise<Hover | null> {
    await this.ensureInitialized();

    const params: HoverParams = {
      textDocument: { uri },
      position,
    };

    return this.connection.sendRequest("textDocument/hover", params);
  }

  async completion(uri: string, position: Position): Promise<CompletionItem[]> {
    await this.ensureInitialized();

    const params: CompletionParams = {
      textDocument: { uri },
      position,
    };

    const result = await this.connection.sendRequest(
      "textDocument/completion",
      params,
    );

    // Handle both CompletionItem[] and CompletionList responses
    if (Array.isArray(result)) {
      return result as CompletionItem[];
    } else if (result && typeof result === "object" && "items" in result) {
      return (result as { items: CompletionItem[] }).items;
    }
    return [];
  }

  async definition(
    uri: string,
    position: Position,
  ): Promise<(Location | LocationLink)[]> {
    await this.ensureInitialized();

    const params: DefinitionParams = {
      textDocument: { uri },
      position,
    };

    const result = await this.connection.sendRequest(
      "textDocument/definition",
      params,
    );

    if (!result) {
      return [];
    }

    return Array.isArray(result)
      ? (result as (Location | LocationLink)[])
      : [result as Location | LocationLink];
  }

  async references(
    uri: string,
    position: Position,
    includeDeclaration: boolean = true,
  ): Promise<Location[]> {
    await this.ensureInitialized();

    const params: ReferenceParams = {
      textDocument: { uri },
      position,
      context: { includeDeclaration },
    };

    const result = await this.connection.sendRequest(
      "textDocument/references",
      params,
    );

    return (result as Location[] | null) ?? [];
  }

  async semanticTokens(uri: string): Promise<SemanticTokens | null> {
    await this.ensureInitialized();

    const params: SemanticTokensParams = {
      textDocument: { uri },
    };

    return this.connection.sendRequest(
      "textDocument/semanticTokens/full",
      params,
    );
  }

  async signatureHelp(
    uri: string,
    position: Position,
  ): Promise<SignatureHelp | null> {
    await this.ensureInitialized();

    const params: SignatureHelpParams = {
      textDocument: { uri },
      position,
    };

    return this.connection.sendRequest("textDocument/signatureHelp", params);
  }

  async documentHighlight(
    uri: string,
    position: Position,
  ): Promise<DocumentHighlight[]> {
    await this.ensureInitialized();

    const params: DocumentHighlightParams = {
      textDocument: { uri },
      position,
    };

    const result = await this.connection.sendRequest(
      "textDocument/documentHighlight",
      params,
    );

    return (result as DocumentHighlight[] | null) ?? [];
  }

  async rename(
    uri: string,
    position: Position,
    newName: string,
  ): Promise<WorkspaceEdit | null> {
    await this.ensureInitialized();

    const params: RenameParams = {
      textDocument: { uri },
      position,
      newName,
    };

    return this.connection.sendRequest("textDocument/rename", params);
  }

  async documentSymbol(
    uri: string,
  ): Promise<(DocumentSymbol | SymbolInformation)[]> {
    await this.ensureInitialized();

    const params: DocumentSymbolParams = {
      textDocument: { uri },
    };

    const result = await this.connection.sendRequest(
      "textDocument/documentSymbol",
      params,
    );

    return (result as (DocumentSymbol | SymbolInformation)[] | null) ?? [];
  }

  async workspaceSymbol(query: string): Promise<SymbolInformation[]> {
    await this.ensureInitialized();

    const params: WorkspaceSymbolParams = {
      query,
    };

    const result = await this.connection.sendRequest(
      "workspace/symbol",
      params,
    );

    return (result as SymbolInformation[] | null) ?? [];
  }

  async codeAction(
    uri: string,
    range: { start: Position; end: Position },
    diagnostics: Diagnostic[] = [],
    only?: string[],
  ): Promise<(CodeAction | Command)[]> {
    await this.ensureInitialized();

    const params: CodeActionParams = {
      textDocument: { uri },
      range,
      context: {
        diagnostics,
        only,
      },
    };

    const result = await this.connection.sendRequest(
      "textDocument/codeAction",
      params,
    );

    return (result as (CodeAction | Command)[] | null) ?? [];
  }

  async executeCommand(command: string, args?: any[]): Promise<any> {
    await this.ensureInitialized();

    const params: ExecuteCommandParams = {
      command,
      arguments: args,
    };

    return this.connection.sendRequest("workspace/executeCommand", params);
  }

  async applyCodeAction(action: CodeAction | Command): Promise<void> {
    await this.ensureInitialized();

    // Check if it's a Command (has 'command' as string property)
    if (
      typeof (action as Command).command === "string" &&
      !(action as CodeAction).edit
    ) {
      const command = action as Command;
      await this.executeCommand(command.command, command.arguments);
      return;
    }

    // Otherwise, it's a CodeAction with an edit
    const codeAction = action as CodeAction;
    if (codeAction.edit?.changes) {
      const affectedUris: string[] = [];

      // Apply the workspace edit by sending didChange notifications
      for (const [uri, edits] of Object.entries(codeAction.edit.changes)) {
        affectedUris.push(uri);

        // Send didChange notification with the edits
        await this.connection.sendNotification("textDocument/didChange", {
          textDocument: {
            uri,
            version: 1,
          },
          contentChanges: edits.map((edit) => ({
            range: edit.range,
            text: edit.newText,
          })),
        });
      }

      // Wait for diagnostics to be republished for all affected files
      for (const uri of affectedUris) {
        await this.waitForDiagnostics(uri);
      }
    }
  }

  getDiagnostics(uri: string): Diagnostic[] {
    return this.diagnosticsByUri.get(uri) ?? [];
  }

  getAllDiagnostics(): Map<string, Diagnostic[]> {
    return new Map(this.diagnosticsByUri);
  }

  async shutdown(): Promise<void> {
    try {
      await this.connection.sendRequest("shutdown");
      await this.connection.sendNotification("exit");
    } catch (error) {
      // Ignore errors during shutdown
    } finally {
      this.dispose();
    }
  }
}
