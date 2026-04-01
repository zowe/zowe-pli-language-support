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
import { Settings } from "./settings";
import { BaseLanguageClient } from "vscode-languageclient";

export function registerPliDocumentIdentifier(lc: BaseLanguageClient) {
  const proposedFiles = new Set<string>();
  return vscode.workspace.onDidOpenTextDocument(async (document) => {
    if (!Settings.getInstance().autoDetect) {
      // Auto-detection is disabled, so do not propose to set language for any file.
      return;
    }
    if (proposedFiles.has(document.uri.toString())) {
      // We've already proposed to change the language for this document.
      return;
    }
    if (document.languageId !== "plaintext") {
      // Only attempt to identify PL/I documents that are currently marked as plaintext
      return;
    }
    proposedFiles.add(document.uri.toString());
    if (await isPossiblePliDocument(document, lc)) {
      proposePliLanguage(document);
    }
  });
}

async function isPossiblePliDocument(
  document: vscode.TextDocument,
  lc: BaseLanguageClient,
): Promise<boolean> {
  // Try to do a simple check based on file extension first.
  const ext = document.uri.path.split(".").pop()?.toLowerCase();
  const possibleExt = ["pli", "pl1", "pl", "p1"];
  if (ext && possibleExt.includes(ext)) {
    return true;
  }
  // If the file extension doesn't give it away, ask the language server if it recognizes the file.
  try {
    const exists = await lc.sendRequest(
      "pli/existingFileRequest",
      document.uri.toString(),
    );
    if (exists) {
      return true;
    }
  } catch {
    // Ignore errors, we'll just do a heuristic check below.
  }
  // Then, look for PL/I specific constellations in the first 200 lines of the document.
  const text = document.getText(
    new vscode.Range(0, 0, Math.min(200, document.lineCount), 0),
  );
  const keywordRegex =
    /\b(dcl|declare|:\s*proc(edure)?|then\s*do|else\s*do)\b/i;
  if (keywordRegex.test(text)) {
    return true;
  }
  return false;
}

async function proposePliLanguage(document: vscode.TextDocument) {
  console.log(
    `Proposing to set language of ${document.uri.toString(true)} to PL/I`,
  );
  const fileName = document.uri.path.split("/").pop();
  const selection = await vscode.window.showInformationMessage(
    `The file '${fileName}' looks like a PL/I source file. Do you want to set the language to PL/I?`,
    "Yes",
    "No",
    "Never",
  );
  if (selection === "Yes") {
    vscode.languages.setTextDocumentLanguage(document, "pli");
  } else if (selection === "Never") {
    // Change the settings to never recommend PL/I for any file.
    const settings = Settings.getInstance();
    await settings.setAutoDetect(false);
  }
}
