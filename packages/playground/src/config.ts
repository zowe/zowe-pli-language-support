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

import { Logger } from "monaco-languageclient/tools";
import { useWorkerFactory } from "monaco-editor-wrapper/workerFactory";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
} from "vscode-languageclient/browser.js";
import type { WrapperConfig } from "monaco-editor-wrapper";
import languageConfig from "../../vscode-extension/language-configuration.json?raw";
import textmateGrammar from "../../vscode-extension/syntaxes/pli.merged.json?raw";
import text from "../../../code_samples/RXGIM.pli?raw";
import workerUrl from "./language-server?worker&url";

import {
  Parts,
  onPartVisibilityChange,
  isPartVisibile,
  attachPart,
} from "@codingame/monaco-vscode-views-service-override";

export const defaultViewsInit = () => {
  for (const config of [
    { part: Parts.EDITOR_PART, element: "#editors" },
    { part: Parts.PANEL_PART, element: "#panel" },
  ]) {
    attachPart(
      config.part,
      document.querySelector<HTMLDivElement>(config.element)!,
    );

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

export const defaultViewsHtml = `<div id="workbench-container">
    <div id="workbench-top">
        <div id="editorsDiv">
            <div id="editors"></div>
            <div id="monaco-root"></div>
        </div>
    </div>
    <div id="panel"></div>
</div>`;

export const defaultHtmlAugmentationInstructions = (
  htmlElement: HTMLElement | null | undefined,
) => {
  const htmlContainer = document.createElement("div", { is: "app" });
  htmlContainer.innerHTML = defaultViewsHtml;
  htmlElement?.append(htmlContainer);
};

export const configureMonacoWorkers = (logger?: Logger) => {
  useWorkerFactory({
    workerOverrides: {
      ignoreMapping: true,
      workerLoaders: {
        TextEditorWorker: () =>
          new Worker(
            new URL(
              "monaco-editor/esm/vs/editor/editor.worker.js",
              import.meta.url,
            ),
            { type: "module" },
          ),
        TextMateWorker: () =>
          new Worker(
            new URL(
              "@codingame/monaco-vscode-textmate-service-override/worker",
              import.meta.url,
            ),
            { type: "module" },
          ),
      },
    },
    logger,
  });
};

export const loadPliWorker = () => {
  console.log(`PL/I worker URL: ${workerUrl}`);
  return new Worker(workerUrl, {
    type: "module",
    name: "PLI LS",
  });
};

export const setupClient = async (content?: string): Promise<WrapperConfig> => {
  const extensionFilesOrContents = new Map<string, string | URL>();
  // vite build is easier with string content
  extensionFilesOrContents.set("/configuration.json", languageConfig);
  extensionFilesOrContents.set("/grammar.json", textmateGrammar);

  const pliWorker = loadPliWorker();
  const reader = new BrowserMessageReader(pliWorker);
  const writer = new BrowserMessageWriter(pliWorker);

  return {
    $type: "extended",
    htmlContainer: document.getElementById("vscode-views-root")!,
    logLevel: 3,
    vscodeApiConfig: {
      serviceOverrides: {
        ...getKeybindingsServiceOverride(),
        ...getMarkersServiceOverride(),
      },
      userConfiguration: {
        json: JSON.stringify({
          "workbench.colorTheme": "Default Dark Modern",
          "editor.guides.bracketPairsHorizontal": "active",
          "editor.wordBasedSuggestions": "off",
          "editor.experimental.asyncTokenization": true,
        }),
      },
      viewsConfig: {
        viewServiceType: "ViewsService",
        htmlAugmentationInstructions: defaultHtmlAugmentationInstructions,
        viewsInitFunc: defaultViewsInit,
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
                extensions: [".pli"],
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
      codeResources: {
        modified: {
          text: content ?? text,
          fileExt: "pli",
        },
      },
      monacoWorkerFactory: configureMonacoWorkers,
    },
    languageClientConfigs: {
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
  };
};
