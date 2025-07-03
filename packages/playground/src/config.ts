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

import * as vscode from "vscode";
import { LogLevel } from "@codingame/monaco-vscode-api";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import getExplorerServiceOverride from "@codingame/monaco-vscode-explorer-service-override";
import getOutlineServiceOverride from "@codingame/monaco-vscode-outline-service-override";
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";
import type { WrapperConfig } from "monaco-editor-wrapper";
import workerUrl from "./language-server?worker&url";
import { BrowserMessageReader } from "vscode-languageserver/browser";
import { BrowserMessageWriter } from "vscode-languageserver/browser";
import languageConfig from "../../vscode-extension/language-configuration.json?raw";
import textmateGrammar from "../../vscode-extension/syntaxes/pli.merged.json?raw";

export type ConfigResult = {
  wrapperConfig: WrapperConfig;
  workspaceFileUri: vscode.Uri;
  pliWorker: Worker;
};

export const configure = async (
  htmlContainer?: HTMLElement,
): Promise<ConfigResult> => {
  // Should lie outside of the /workspace folder.
  const workspaceFileUri = vscode.Uri.file("/workspace.code-workspace");

  const extensionFilesOrContents = new Map<string, string | URL>();
  extensionFilesOrContents.set("/configuration.json", languageConfig);
  extensionFilesOrContents.set("/grammar.json", textmateGrammar);

  const pliWorker = loadPliWorker();
  const reader = new BrowserMessageReader(pliWorker);
  const writer = new BrowserMessageWriter(pliWorker);

  const wrapperConfig: WrapperConfig = {
    $type: "extended",
    id: "AAP",
    logLevel: LogLevel.Debug,
    htmlContainer,
    vscodeApiConfig: {
      serviceOverrides: {
        ...getKeybindingsServiceOverride(),
        ...getExplorerServiceOverride(),
        ...getMarkersServiceOverride(),
        ...getOutlineServiceOverride(),
      },
      enableExtHostWorker: true,
      viewsConfig: {
        viewServiceType: "ViewsService",
        htmlAugmentationInstructions: htmlAugmentationInstructions,
        viewsInitFunc: viewsInit,
      },
      workspaceConfig: {
        enableWorkspaceTrust: true,
        windowIndicator: {
          label: "pli-example",
          tooltip: "",
          command: "",
        },
        workspaceProvider: {
          trusted: true,
          async open() {
            window.open(window.location.href);
            return true;
          },
          workspace: {
            workspaceUri: workspaceFileUri,
          },
        },
        configurationDefaults: {
          "window.title": "pli-example${separator}${dirty}${activeEditorShort}",
        },
        productConfiguration: {
          nameShort: "pli-example",
          nameLong: "pli-example",
        },
      },
      userConfiguration: {
        json: JSON.stringify({
          "workbench.colorTheme": "Default Dark Modern",
          "editor.wordBasedSuggestions": "off",
          "typescript.tsserver.web.projectWideIntellisense.enabled": true,
          "typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors": false,
          "editor.guides.bracketPairsHorizontal": true,
          "editor.experimental.asyncTokenization": false,
        }),
      },
    },
    extensions: [
      {
        config: {
          name: "pli-example",
          publisher: "Zowe",
          version: "1.0.0",
          engines: {
            vscode: "*",
          },
          contributes: {
            languages: [
              {
                id: "pli",
                extensions: [".pli",".pl1",".inc"],
                aliases: ["PL/I", "pli"],
                configuration: "./configuration.json",
              },
            ],
            grammars: [
              {
                language: "pli",
                scopeName: "source.pli",
                path: "./grammar.json",
              },
            ],
          },
        },
        filesOrContents: extensionFilesOrContents,
      },
    ],
    editorAppConfig: {
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
    languageClientConfigs: {
      configs: {
        langium: {
          clientOptions: {
            documentSelector: ["pli"],
          },
          connection: {
            options: {
              $type: "WorkerDirect",
              worker: pliWorker,
            },
            messageTransports: { reader, writer },
          },
        },
      },
    },
  };

  return {
    wrapperConfig,
    workspaceFileUri,
    pliWorker,
  };
};

const viewsHtml = `<div id="workbench-container">
    <div id="workbench-top">
        <div id="sidebarDiv">
            <div id="sidebar"></div>
        </div>
        <div id="editorsDiv">
            <div id="editors"></div>
            <div id="panel"></div>
        </div>
    </div>
</div>`;

const htmlAugmentationInstructions = (
  htmlElement: HTMLElement | null | undefined,
) => {
  const htmlContainer = document.createElement("div", { is: "app" });
  htmlContainer.innerHTML = viewsHtml;
  htmlElement?.append(htmlContainer);
};

const viewsInit = async () => {
  const {
    Parts,
    Position,
    onPartVisibilityChange,
    isPartVisibile,
    attachPart,
    getSideBarPosition,
    onDidChangeSideBarPosition,
  } = await import("@codingame/monaco-vscode-views-service-override");

  for (const config of [
    {
      part: Parts.SIDEBAR_PART,
      get element() {
        return getSideBarPosition() === Position.LEFT
          ? "#sidebar"
          : "#sidebar-right";
      },
      onDidElementChange: onDidChangeSideBarPosition,
    },
    { part: Parts.EDITOR_PART, element: "#editors" },
    { part: Parts.PANEL_PART, element: "#panel" },
  ]) {
    attachPart(
      config.part,
      document.querySelector<HTMLDivElement>(config.element)!,
    );

    config.onDidElementChange?.(() => {
      attachPart(
        config.part,
        document.querySelector<HTMLDivElement>(config.element)!,
      );
    });

    if (!isPartVisibile(config.part)) {
      document.querySelector<HTMLDivElement>(config.element)!.style.display =
        "none";
    }

    onPartVisibilityChange(config.part, (visible) => {
      document.querySelector<HTMLDivElement>(config.element)!.style.display =
        visible ? "block" : "none";
    });
  }
};

const loadPliWorker = () => {
  console.log(`PL/I worker URL: ${workerUrl}`);
  return new Worker(workerUrl, {
    type: "module",
    name: "PLI LS",
  });
};
