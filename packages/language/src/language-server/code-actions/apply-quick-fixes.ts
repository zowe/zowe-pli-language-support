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

import { URI, UriUtils } from "../../utils/uri";
import { FileSystemProviderInstance } from "../../workspace/file-system-provider";
import {
  CodeAction,
  CodeActionKind,
  Diagnostic,
  TextEdit,
} from "vscode-languageserver-types";
import {
  PluginConfigUnresolvedLibData,
  PluginConfigurationProviderInstance,
  ProcessGroup,
} from "../../workspace/plugin-configuration-provider";

import { Commands, PluginConfiguration } from "../constants";
import { LspCodes } from "../../validation/lsp-codes";
import { fullCode } from "../types";
import { PLICodes } from "../../validation/pli-codes";
import { jsoncApplyEdits, jsoncModify, type JSONPath } from "../../utils/jsonc";

const JSONC_FORMAT = {
  formattingOptions: { tabSize: 2, insertSpaces: true },
} as const;

function isProcGrpsDocumentUri(documentUri: string): boolean {
  const workspacePath = PluginConfigurationProviderInstance.getWorkspacePath();
  if (!workspacePath) {
    return false;
  }
  const expected = UriUtils.joinPath(
    UriUtils.toUri(workspacePath),
    ".pliplugin",
    "proc_grps.json",
  );
  return UriUtils.equals(documentUri, expected);
}

async function readProcGrpsText(): Promise<
  { uri: URI; text: string } | undefined
> {
  const workspacePath = PluginConfigurationProviderInstance.getWorkspacePath();
  if (!workspacePath) {
    return undefined;
  }
  const procGrpsUri = UriUtils.joinPath(
    UriUtils.toUri(workspacePath),
    ".pliplugin",
    "proc_grps.json",
  );
  try {
    const content = await FileSystemProviderInstance.readFile(procGrpsUri);
    if (content === undefined) {
      return undefined;
    }
    return { uri: procGrpsUri, text: content };
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function quickFixResolveInclude(
  diagnostic: Diagnostic,
): Promise<CodeAction | undefined> {
  const progConfig = PluginConfigurationProviderInstance.getProgramConfig(
    UriUtils.toUri(diagnostic.data.entryUri),
  );
  if (!progConfig) return;
  const procGrpsConfig =
    PluginConfigurationProviderInstance.getProcessGroupConfig(
      progConfig.pgroup,
    );
  const unresolvedFile = diagnostic.data?.unresolvedFile;
  if (!procGrpsConfig || !unresolvedFile) return undefined;

  const configExtensions = procGrpsConfig.includeExtensions;
  const unresolvedFilePath = await FileSystemProviderInstance.search({
    path: UriUtils.toUri(unresolvedFile),
    extensions: configExtensions,
    global: true,
  });
  if (!unresolvedFilePath) return undefined;

  const workspaceFolderUri = UriUtils.toUri(
    PluginConfigurationProviderInstance.getWorkspacePath(),
  );

  const parentFolder = UriUtils.computeWorkspaceRelativeParentFolder(
    unresolvedFilePath,
    workspaceFolderUri,
  );
  if (!parentFolder || procGrpsConfig.$computedLibsSet.has(parentFolder)) {
    return undefined;
  }
  const procGrpsFileUri = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROCESS_GROUP_FILE_PATH,
  );
  let newFileContent;
  try {
    const originalFileContent =
      await FileSystemProviderInstance.readFile(procGrpsFileUri);
    if (!originalFileContent) {
      console.error("Missing 'proc_grps.json' file content.");
      return;
    }
    newFileContent = JSON.parse(originalFileContent);
    if (!newFileContent.pgroups) {
      console.error("Missing 'pgroups' property under 'proc_grps.json' file");
      return;
    }
  } catch (err) {
    console.error(
      "Error reading or parsing configuration 'proc_grps.json' file: ",
      err,
    );
    return;
  }
  const groupToUpdate = newFileContent.pgroups.find(
    (g: ProcessGroup) => g.name === progConfig.pgroup,
  );
  if (!groupToUpdate) {
    return;
  }
  groupToUpdate.libs.push(parentFolder);
  const newContent = JSON.stringify(newFileContent, undefined, 2);

  const action: CodeAction = {
    title: `Add '${parentFolder}' to INCLUDE libs.`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    command: {
      title: "Apply INCLUDE fix",
      command: Commands.RESOLVE_INCLUDE,
      arguments: [procGrpsFileUri.toString(), newContent],
    },
  };

  return action;
}

export async function quickFixCreateConfig(
  diagnostic: Diagnostic,
): Promise<CodeAction | undefined> {
  const workspace = PluginConfigurationProviderInstance.getWorkspacePath();
  const entryUri = diagnostic.data.entryUri as string;
  if (!workspace || !entryUri) {
    return;
  }
  const resolvedEntry = UriUtils.toFilePath(entryUri);
  const workspacePath = UriUtils.toFilePath(workspace);

  const workspaceParts = UriUtils.parts(workspacePath);
  const entryParts = UriUtils.parts(resolvedEntry);

  const isInsideWorkspace = workspaceParts.every(
    (part, index) => part === entryParts[index],
  );

  const programPath = isInsideWorkspace
    ? entryParts.slice(workspaceParts.length).join("/")
    : resolvedEntry;

  const action: CodeAction = {
    title: `Create a startup configuration for this file.`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    command: {
      title: "Create a startup configuration",
      command: Commands.CREATE_CONFIG,
      arguments: [programPath],
    },
  };

  return action;
}

export function quickFixUppercaseText(
  diagnostic: Diagnostic,
): CodeAction | undefined {
  const range = diagnostic.range;
  if (!diagnostic.data || !diagnostic.data.text || !diagnostic.data.uri) {
    console.error("Diagnostic data is missing for quick fix uppercase text.");
    return undefined;
  }
  const text = diagnostic.data.text;
  const uri = diagnostic.data.uri;

  const action: CodeAction = {
    title: `Convert to uppercase`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [uri]: [TextEdit.replace(range, text.toUpperCase())],
      },
    },
  };

  return action;
}

export type AmbiguousReferenceData = {
  symbols: {
    nameChain: string[];
    /** hide this option, when the symbol is not from the same structure */
    visible: boolean;
  }[];
  uri: string;
};

type ReferenceData = {
  visible: boolean;
  parentsLeft: string[];
  replaceText: string;
};

export function quickFixResolveAmbiguousReference(
  diagnostic: Diagnostic,
): CodeAction[] {
  const { symbols, uri } = diagnostic.data as AmbiguousReferenceData;
  let current: ReferenceData[] = symbols.map((sym) => ({
    visible: sym.visible,
    parentsLeft: sym.nameChain.slice(0, -1),
    replaceText: sym.nameChain[sym.nameChain.length - 1],
  }));
  const names = new Set<string>();
  do {
    names.clear();
    for (const { replaceText } of current) {
      names.add(replaceText);
    }
    if (
      names.size === current.length ||
      current.every(({ parentsLeft }) => parentsLeft.length === 0)
    ) {
      break;
    }
    current = current.map(({ visible, parentsLeft, replaceText }) => {
      if (parentsLeft.length === 0) {
        return { visible, parentsLeft: [], replaceText } as const;
      }
      const parent = parentsLeft.slice(0, -1);
      const name = replaceText;
      return {
        visible,
        parentsLeft: parent,
        replaceText: `${parentsLeft[parentsLeft.length - 1]}.${name}`,
      } as const;
    });
  } while (true);
  if (names.size !== current.length) {
    return [];
  } else {
    const actions: CodeAction[] = [];
    //Example for a `current` list containing suffixes(*): "AA.BB.CC", *"BB.CC", *"CC"
    //Here "CC" is suffix of "BB.CC", which is suffix of "AA.BB.CC". Here it is only save to suggest "AA.BB.CC".
    //We filter out all real suffixes. If all members are suffixes of each other, there are no suggestions.
    const isSuffixOf = (suffix: string, str: string) =>
      str.endsWith("." + suffix) || str === suffix;
    const whereNameIsNotASuffix = (name: string, index: number): boolean =>
      !current.some(
        ({ replaceText }, i) => i !== index && isSuffixOf(name, replaceText),
      );
    for (const { replaceText } of current.filter(
      ({ visible, replaceText }, index) =>
        whereNameIsNotASuffix(replaceText, index) && visible,
    )) {
      const action: CodeAction = {
        title: `Change to "${replaceText}"`,
        kind: CodeActionKind.QuickFix,
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [uri]: [TextEdit.replace(diagnostic.range, replaceText)],
          },
        },
      };
      actions.push(action);
    }
    return actions;
  }
}

export async function quickFixRemoveUnresolvedLib(
  diagnostic: Diagnostic,
): Promise<CodeAction | undefined> {
  const data = diagnostic.data as PluginConfigUnresolvedLibData | undefined;
  if (!data?.lib || !data?.pgroup) {
    return undefined;
  }
  if (!data.path) {
    return undefined;
  }
  const read = await readProcGrpsText();
  if (!read) {
    return undefined;
  }
  const { uri: procGrpsUri, text } = read;

  let newContent: string;
  try {
    newContent = jsoncApplyEdits(
      text,
      jsoncModify(text, data.path, undefined, JSONC_FORMAT),
    );
  } catch (err) {
    console.error("Failed to build proc_grps edit for remove lib:", err);
    return undefined;
  }

  return {
    title: `Remove unresolved library '${data.lib}'.`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    command: {
      title: "Remove unresolved lib",
      command: Commands.REMOVE_DEAD_LIB,
      arguments: [procGrpsUri.toString(), newContent],
    },
  };
}

/**
 * Removes every distinct (pgroup, lib) in one write.
 * Applies removals right-to-left so array indices stay valid.
 */
export async function quickFixRemoveAllUnresolvedLibs(
  pairs: readonly PluginConfigUnresolvedLibData[],
  relatedDiagnostics: Diagnostic[],
): Promise<CodeAction | undefined> {
  const unique: (PluginConfigUnresolvedLibData & { path: JSONPath })[] = [];
  const seen = new Set<string>();
  for (const pair of pairs) {
    if (!pair.path) {
      continue;
    }
    const key = pair.path.join("/");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(pair as PluginConfigUnresolvedLibData & { path: JSONPath });
  }
  if (unique.length < 2) {
    return undefined;
  }

  const read = await readProcGrpsText();
  if (!read) {
    return undefined;
  }
  const { uri, text: initialText } = read;
  let text = initialText;

  unique.sort((a, b) => {
    // Sort from highest index first so earlier indices remain valid when removing right-to-left.
    return Number(b.path.at(-1)) - Number(a.path.at(-1));
  });

  for (const { path } of unique) {
    try {
      text = jsoncApplyEdits(
        text,
        jsoncModify(text, path, undefined, JSONC_FORMAT),
      );
    } catch (err) {
      console.error(
        "Failed to build proc_grps edit from unresolved lib path:",
        err,
      );
      return undefined;
    }
  }

  return {
    title: `Remove all ${unique.length} unresolved libraries`,
    kind: CodeActionKind.QuickFix,
    diagnostics: relatedDiagnostics,
    command: {
      title: "Remove all unresolved libs",
      command: Commands.REMOVE_DEAD_LIB,
      arguments: [uri.toString(), text],
    },
  };
}

async function handleMultipleUnresolvedLibs(
  diagnostics: Diagnostic[],
  unresolvedLibCode: string,
  documentUri?: string,
): Promise<CodeAction | undefined> {
  const unresolvedInContext = diagnostics.filter(
    (d) => d.code === unresolvedLibCode,
  );
  const procGrpsEntries =
    documentUri &&
    isProcGrpsDocumentUri(documentUri) &&
    unresolvedInContext.length > 0
      ? PluginConfigurationProviderInstance.getLastProcGrpsUnresolvedLibEntries()
      : [];
  if (!procGrpsEntries.length) {
    return;
  }

  const action = await quickFixRemoveAllUnresolvedLibs(
    procGrpsEntries,
    unresolvedInContext,
  );
  return action;
}

export async function applyQuickFixes(
  diagnostics: Diagnostic[],
  documentUri?: string,
): Promise<CodeAction[] | undefined> {
  const actions: CodeAction[] = [];
  // PLI CODES LIST
  const CODE_AMBIGUOUS_REFERENCE = fullCode(PLICodes.Severe.IBM1881I);
  const CODE_UNRESOLVED_INCLUDE = fullCode(PLICodes.Severe.IBM1848I); // The INCLUDE file could not be found
  const CODE_MISSING_CONFIG = fullCode(
    LspCodes.IncludeResolution.MissingConfiguration,
  ); // "Could not resolve include directive. Plugin configuration is missing"
  const CODE_MACRO_CASE = fullCode(LspCodes.UpperCase);
  const CODE_UNRESOLVED_LIB = fullCode(
    LspCodes.PluginConfiguration.UnresolvedEntry,
  );
  const hasHandledUnresolvedLibs = await handleMultipleUnresolvedLibs(
    diagnostics,
    CODE_UNRESOLVED_LIB,
    documentUri,
  );
  if (hasHandledUnresolvedLibs) actions.push(hasHandledUnresolvedLibs);

  for (const diagnostic of diagnostics) {
    if (!diagnostic.code) {
      continue;
    }
    let action: CodeAction | undefined;
    switch (diagnostic.code) {
      case CODE_AMBIGUOUS_REFERENCE:
        actions.push(...quickFixResolveAmbiguousReference(diagnostic));
        break;
      case CODE_UNRESOLVED_INCLUDE:
        action = await quickFixResolveInclude(diagnostic);
        if (action) actions.push(action);
        break;
      case CODE_MISSING_CONFIG:
        action = await quickFixCreateConfig(diagnostic);
        if (action) actions.push(action);
        break;
      case CODE_MACRO_CASE:
        action = quickFixUppercaseText(diagnostic);
        if (action) actions.push(action);
        break;
      case CODE_UNRESOLVED_LIB:
        action = await quickFixRemoveUnresolvedLib(diagnostic);
        if (action) actions.push(action);
        break;
    }
  }

  if (!actions.length) {
    return undefined;
  }
  return actions;
}
