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
import { Messages, UriUtils } from "pli-language";
import { sendRequest } from "./messages";

export function registerPliDocumentIdentifier(lc: BaseLanguageClient) {
  const proposedFiles = new Set<string>();
  // Some files might be opened before the extension starts up
  for (const document of vscode.workspace.textDocuments) {
    checkFileType(proposedFiles, document, lc);
  }
  return vscode.workspace.onDidOpenTextDocument(async (document) => {
    checkFileType(proposedFiles, document, lc);
  });
}

async function checkFileType(
  proposedFiles: Set<string>,
  document: vscode.TextDocument,
  lc: BaseLanguageClient,
): Promise<void> {
  if (!Settings.getInstance().autoDetect) {
    // Auto-detection is disabled, so do not propose to set language for any file.
    return;
  }
  if (proposedFiles.has(document.uri.toString())) {
    // We've already proposed to change the language for this document.
    // It was previously declined, so don't propose again.
    return;
  }
  if (document.languageId !== "plaintext") {
    // Only attempt to identify PL/I documents that are currently marked as plaintext
    return;
  }
  if (
    // Assert that this can even be a PL/I document
    // (and isn't something else, like a .git file or a listing file)
    !isNotPliDocument(document) &&
    // Check that it likely is a PL/I document
    (await isPossiblePliDocument(document, lc))
  ) {
    proposePliLanguage(proposedFiles, document);
  }
}

const nonPliFileTypes = new Set([
  // VS Code will open .git files as plaintext in memory
  "git",
  // Listing files might contain PL/I code, but they are not PL/I source files
  "lst",
  "list",
  // The compiler also outputs .xml files
  "xml",
]);

function isNotPliDocument(document: vscode.TextDocument): boolean {
  // Look for file types that are likely not PL/I source files
  const ext = UriUtils.extname(document.uri).toLowerCase();
  if (nonPliFileTypes.has(ext)) {
    return true;
  }
  if (document.uri.scheme === "git") {
    // Don't propose on files opened from git
    return true;
  }
  const firstLine = document.lineAt(0).text;
  if (firstLine.startsWith("<?xml")) {
    return true;
  }
  // Example: 15655-PL6  IBM(R) Enterprise PL/I for z/OS
  const listingFileRegex = /^\d+-PL\d+\s+IBM/;
  if (listingFileRegex.test(firstLine)) {
    return true;
  }
  return false;
}

async function isPossiblePliDocument(
  document: vscode.TextDocument,
  lc: BaseLanguageClient,
): Promise<boolean> {
  // Try to do a simple check based on file extension first.
  const ext = UriUtils.extname(document.uri).toLowerCase();
  const possibleExt = ["pli", "pl1", "pl", "p1"];
  if (ext && possibleExt.includes(ext)) {
    return true;
  }
  // If the file extension doesn't give it away, ask the language server if it recognizes the file.
  try {
    const exists = await sendRequest(
      lc,
      Messages.ExistingFile,
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

async function proposePliLanguage(
  proposedFiles: Set<string>,
  document: vscode.TextDocument,
) {
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
  switch (selection) {
    case "Yes":
      vscode.languages.setTextDocumentLanguage(document, "pli");
      break;
    case "No":
      proposedFiles.add(document.uri.toString());
      break;
    case "Never":
      // Change the settings to never recommend PL/I for any file.
      const settings = Settings.getInstance();
      await settings.setAutoDetect(false);
      break;
  }
}
