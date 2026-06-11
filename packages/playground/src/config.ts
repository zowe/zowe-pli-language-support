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
import { configureDefaultWorkerFactory } from "monaco-languageclient/workerFactory";
import type { MonacoVscodeApiConfig } from "monaco-languageclient/vscodeApiWrapper";

// Load the PL/I extension directly - no need to load the worker
import "../pli-language-support.vsix";

export const configure = async (
  htmlContainer?: HTMLElement,
): Promise<MonacoVscodeApiConfig> => {
  const workspaceFileUri = vscode.Uri.file("/workspace.code-workspace");

  const vscodeApiConfig: MonacoVscodeApiConfig = {
    $type: "extended",
    logLevel: LogLevel.Debug,
    serviceOverrides: {
      ...getKeybindingsServiceOverride(),
      ...getExplorerServiceOverride(),
      ...getMarkersServiceOverride(),
      ...getOutlineServiceOverride(),
    },
    viewsConfig: {
      $type: "ViewsService",
      htmlContainer,
      htmlAugmentationInstructions: htmlAugmentationInstructions,
      viewsInitFunc: viewsInit,
    },
    workspaceConfig: {
      enableWorkspaceTrust: true,
      windowIndicator: {
        label: "PLI Playground",
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
        "window.title":
          "PLI Playground${separator}${dirty}${activeEditorShort}",
      },
      productConfiguration: {
        nameShort: "pli-playground",
        nameLong: "pli-playground",
      },
    },
    userConfiguration: {
      json: JSON.stringify({
        "workbench.colorTheme": "Default Dark Modern",
        "editor.wordBasedSuggestions": "off",
        "editor.guides.bracketPairsHorizontal": true,
        "editor.experimental.asyncTokenization": false,
      }),
    },
    extensions: [
      {
        config: {
          name: "pli-playground",
          publisher: "Broadcom",
          version: "1.0.0",
          engines: {
            vscode: "*",
          },
        },
      },
    ],
    advanced: {
      enableExtHostWorker: true,
    },
    monacoWorkerFactory: configureDefaultWorkerFactory,
  };

  return vscodeApiConfig;
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
