/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import * as vscode from "vscode";
import { BaseLanguageClient } from "vscode-languageclient";
// Deep imports keep the LSP integration of `sprotty-vscode` (and its own vscode-languageclient
// copy) out of the bundle.
import {
  OpenDiagramOptions,
  WebviewContainer,
  WebviewEndpoint,
} from "sprotty-vscode/lib/webview-endpoint";
import { WebviewPanelManager } from "sprotty-vscode/lib/webview-panel-manager";
import {
  createWebviewHtml,
  createWebviewTitle,
} from "sprotty-vscode/lib/webview-utils";
import type { SprottyDiagramIdentifier } from "sprotty-vscode";
import { DiagramServer } from "sprotty-protocol/lib/diagram-server";
import {
  FitToScreenAction,
  OpenAction,
  RequestModelAction,
  SelectAction,
} from "sprotty-protocol/lib/actions";
import type { SModelElement, SModelRoot } from "sprotty-protocol";
import { Commands, Messages } from "pli-language";
import {
  FLOW_DIAGRAM_TYPE,
  FlowSourceLocation,
} from "pli-language/flow-diagram";
import { onNotification, sendRequest } from "../messages";
import { createFlowLayoutEngine } from "./flow-layout";

/** Delay before re-rendering an open diagram after its program changed. */
const REFRESH_DELAY_MS = 500;

/** A newly opened diagram is fitted into the view, but small diagrams are not enlarged. */
const FIT_ON_OPEN_MAX_ZOOM = 1;

/** Normalizes URI spellings (`c:` vs `c%3A`) so diagram and LSP URIs compare equal. */
function normalizeUri(uri: string): string {
  return vscode.Uri.parse(uri).toString();
}

/** Diagram server running in the extension host: fetches the model from the LS, lays it out. */
class FlowDiagramServer extends DiagramServer {
  protected override async handleRequestModel(
    action: RequestModelAction,
  ): Promise<void> {
    await super.handleRequestModel(action);
    await this.dispatch(
      FitToScreenAction.create([], {
        padding: 20,
        maxZoom: FIT_ON_OPEN_MAX_ZOOM,
        animate: false,
      }),
    );
  }
}

interface DiagramSession {
  server: FlowDiagramServer;
  /** Source location of every element of the model currently shown. */
  sources: Map<string, FlowSourceLocation>;
  refreshTimer?: ReturnType<typeof setTimeout>;
}

/**
 * Opens flow diagram webviews and connects them to the language server.
 *
 * Data flow: the LS builds the control flow graph as a Sprotty model (`pli/getFlowDiagram`),
 * the extension host lays it out with ELK and forwards it to the webview, which renders it and
 * reports selections back so the corresponding source is highlighted in the editor.
 */
export class FlowDiagramPanelManager
  extends WebviewPanelManager
  implements vscode.Disposable
{
  private readonly sessions = new Map<WebviewEndpoint, DiagramSession>();
  private readonly highlight = vscode.window.createTextEditorDecorationType({
    backgroundColor: new vscode.ThemeColor("editor.rangeHighlightBackground"),
    isWholeLine: true,
    overviewRulerColor: new vscode.ThemeColor(
      "editorOverviewRuler.rangeHighlightForeground",
    ),
    overviewRulerLane: vscode.OverviewRulerLane.Full,
  });

  constructor(
    extensionUri: vscode.Uri,
    private readonly client: BaseLanguageClient,
  ) {
    const webviewRoot = vscode.Uri.joinPath(extensionUri, "out", "webview");
    super({
      extensionUri,
      defaultDiagramType: FLOW_DIAGRAM_TYPE,
      localResourceRoots: [webviewRoot],
      createWebviewHtml: (identifier, container) =>
        createFlowWebviewHtml(identifier, container, webviewRoot),
    });
  }

  override async openDiagram(
    uri: vscode.Uri,
    options?: OpenDiagramOptions & { preserveFocus?: boolean },
  ): Promise<WebviewEndpoint | undefined> {
    const endpoint = await super.openDiagram(uri, options);
    // Re-opening an existing diagram resets the title to the bare file name.
    if (endpoint?.diagramIdentifier) {
      endpoint.webviewContainer.title = flowTitle(endpoint.diagramIdentifier);
    }
    return endpoint;
  }

  protected override createEndpoint(
    identifier: SprottyDiagramIdentifier,
  ): WebviewEndpoint {
    const webviewContainer = this.createWebview(identifier);
    webviewContainer.title = flowTitle(identifier);
    const participant = this.messenger.registerWebviewPanel(webviewContainer);
    let session: DiagramSession | undefined;
    const endpoint: WebviewEndpoint = new WebviewEndpoint({
      webviewContainer,
      messenger: this.messenger,
      messageParticipant: participant,
      identifier,
      diagramServerFactory: (dispatch) => {
        const server = new FlowDiagramServer(dispatch, {
          DiagramGenerator: {
            // Initial load (and re-open): nothing is shown yet, so the sources apply at once.
            generate: async () => {
              const model = await this.fetchModel(endpoint);
              session!.sources = collectSources(model);
              return model;
            },
          },
          ModelLayoutEngine: createFlowLayoutEngine(),
        });
        session = { server, sources: new Map() };
        return server;
      },
    });
    this.sessions.set(endpoint, session!);
    endpoint.addActionHandler<SelectAction>(SelectAction.KIND, (action) =>
      this.revealSource(endpoint, action.selectedElementsIDs, false),
    );
    endpoint.addActionHandler<OpenAction>(OpenAction.KIND, (action) =>
      this.revealSource(endpoint, [action.elementId], true),
    );
    webviewContainer.onDidDispose(() => {
      clearTimeout(this.sessions.get(endpoint)?.refreshTimer);
      this.sessions.delete(endpoint);
      this.clearHighlight();
    });
    return endpoint;
  }

  /** Fetches the (not yet laid out) model from the language server. */
  private async fetchModel(endpoint: WebviewEndpoint): Promise<SModelRoot> {
    const uri = endpoint.diagramIdentifier?.uri;
    if (!uri) {
      throw new Error("The flow diagram has no source file.");
    }
    const model = await sendRequest(
      this.client,
      Messages.GetFlowDiagram,
      normalizeUri(uri),
    );
    if (!model) {
      throw new Error(
        `No PL/I program found for ${vscode.Uri.parse(uri).fsPath}.`,
      );
    }
    return model;
  }

  /** Re-renders open diagrams of a changed compilation unit (debounced). */
  refresh(changedUris: string[]): void {
    const changed = new Set(changedUris.map(normalizeUri));
    for (const endpoint of this.endpoints) {
      const uri = endpoint.diagramIdentifier?.uri;
      const session = this.sessions.get(endpoint);
      if (!uri || !session || !changed.has(normalizeUri(uri))) {
        continue;
      }
      clearTimeout(session.refreshTimer);
      session.refreshTimer = setTimeout(async () => {
        try {
          const model = await this.fetchModel(endpoint);
          await session.server.updateModel(model);
          // Element ids are positional: switch the click targets only once the webview has
          // the new model, so a click in between still resolves against what is displayed.
          session.sources = collectSources(model);
        } catch (error) {
          console.error("Failed to refresh the PL/I flow diagram:", error);
        }
      }, REFRESH_DELAY_MS);
    }
  }

  /** Fits the diagram of the active flow diagram panel into its view. */
  fitActiveDiagram(): void {
    void this.findActiveWebview()?.sendAction(
      FitToScreenAction.create([], { padding: 20, animate: true }),
    );
  }

  /**
   * Highlights the source of the first selected element that has one. With `focus`, the editor
   * also takes the keyboard focus and the cursor moves to the element.
   */
  private async revealSource(
    endpoint: WebviewEndpoint,
    elementIds: string[],
    focus: boolean,
  ): Promise<void> {
    const sources = this.sessions.get(endpoint)?.sources;
    const location = elementIds
      .map((id) => sources?.get(id))
      .find((loc) => loc !== undefined);
    if (!location) {
      this.clearHighlight();
      return;
    }
    const uri = vscode.Uri.parse(location.uri);
    const { start, end } = location.range;
    const range = new vscode.Range(
      start.line,
      start.character,
      end.line,
      end.character,
    );

    let editor = vscode.window.visibleTextEditors.find(
      (e) => e.document.uri.toString() === uri.toString(),
    );
    if (!editor || focus) {
      const document = await vscode.workspace.openTextDocument(uri);
      editor = await vscode.window.showTextDocument(document, {
        viewColumn: editor?.viewColumn ?? this.sourceColumn(endpoint),
        preserveFocus: !focus,
        preview: false,
      });
    }
    if (focus) {
      editor.selection = new vscode.Selection(range.start, range.start);
    }
    this.clearHighlight();
    editor.setDecorations(this.highlight, [range]);
    editor.revealRange(
      range,
      vscode.TextEditorRevealType.InCenterIfOutsideViewport,
    );
  }

  /** Column for opening sources: any column but the one showing the diagram. */
  private sourceColumn(endpoint: WebviewEndpoint): vscode.ViewColumn {
    const container = endpoint.webviewContainer as vscode.WebviewPanel;
    return container.viewColumn === vscode.ViewColumn.One
      ? vscode.ViewColumn.Two
      : vscode.ViewColumn.One;
  }

  private clearHighlight(): void {
    for (const editor of vscode.window.visibleTextEditors) {
      editor.setDecorations(this.highlight, []);
    }
  }

  dispose(): void {
    for (const session of this.sessions.values()) {
      clearTimeout(session.refreshTimer);
    }
    for (const endpoint of [...this.endpoints]) {
      (endpoint.webviewContainer as vscode.WebviewPanel).dispose();
    }
    this.highlight.dispose();
  }
}

function createFlowWebviewHtml(
  identifier: SprottyDiagramIdentifier,
  container: WebviewContainer,
  webviewRoot: vscode.Uri,
): string {
  return createWebviewHtml(identifier, container, {
    scriptUri: vscode.Uri.joinPath(webviewRoot, "flow-diagram.js"),
    cssUri: vscode.Uri.joinPath(webviewRoot, "flow-diagram.css"),
    title: flowTitle(identifier),
  });
}

function flowTitle(identifier: SprottyDiagramIdentifier): string {
  return `Flow: ${createWebviewTitle(identifier)}`;
}

function collectSources(root: SModelElement): Map<string, FlowSourceLocation> {
  const sources = new Map<string, FlowSourceLocation>();
  const visit = (element: SModelElement & { source?: FlowSourceLocation }) => {
    if (element.source) {
      sources.set(element.id, element.source);
    }
    element.children?.forEach(visit);
  };
  visit(root);
  return sources;
}

function isPliDocument(document: vscode.TextDocument | undefined): boolean {
  return document?.languageId === "pli";
}

/**
 * Registers the "Show PL/I Flow Diagram" command and keeps open diagrams in sync with the
 * language server.
 */
export function registerFlowDiagram(
  context: vscode.ExtensionContext,
  client: BaseLanguageClient,
): vscode.Disposable {
  const manager = new FlowDiagramPanelManager(context.extensionUri, client);

  onNotification(client, Messages.FlowDiagramChanged, ({ uris }) =>
    manager.refresh(uris),
  );

  const showCommand = vscode.commands.registerCommand(
    Commands.SHOW_FLOW_DIAGRAM,
    async (resource?: unknown) => {
      // Invoked with the document URI from the editor context menu, without from the palette.
      let uri = resource instanceof vscode.Uri ? resource : undefined;
      if (!uri) {
        const document = vscode.window.activeTextEditor?.document;
        if (!isPliDocument(document)) {
          void vscode.window.showInformationMessage(
            "Open a PL/I program to show its flow diagram.",
          );
          return;
        }
        uri = document!.uri;
      }
      await manager.openDiagram(uri, { reveal: true, preserveFocus: true });
    },
  );

  const fitCommand = vscode.commands.registerCommand(
    Commands.FIT_FLOW_DIAGRAM,
    () => manager.fitActiveDiagram(),
  );

  return vscode.Disposable.from(manager, showCommand, fitCommand);
}
