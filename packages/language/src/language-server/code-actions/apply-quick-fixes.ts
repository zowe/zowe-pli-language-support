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

import { URI } from "../../utils/uri";
import { FileSystemProviderInstance } from "../../workspace/file-system-provider";
import { UriUtils } from "../../utils/uri";
import {
  CodeAction,
  CodeActionKind,
  Diagnostic,
  TextEdit,
} from "vscode-languageserver-types";
import {
  PluginConfigurationProviderInstance,
  ProcessGroup,
} from "../../workspace/plugin-configuration-provider";

import { Commands, PluginConfiguration } from "../constants";
import { LspCodes } from "../../validation/lsp-codes";
import { fullCode } from "../types";
import { PLICodes } from "../../validation/pli-codes";

export async function quickFixResolveInclude(
  diagnostic: Diagnostic,
): Promise<CodeAction | undefined> {
  const progConfig = PluginConfigurationProviderInstance.getProgramConfig(
    URI.parse(diagnostic.data.entryUri),
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
    path: URI.parse(unresolvedFile),
    extensions: configExtensions,
    global: true,
  });
  if (!unresolvedFilePath) return undefined;

  const workspaceFolderUri = URI.parse(
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
  const resolvedEntry = entryUri.startsWith("file://")
    ? URI.parse(entryUri).fsPath.replace(/\\/g, "/")
    : entryUri.replace(/\\/g, "/");

  const workspaceParts = URI.parse(workspace)
    .fsPath.replace(/\\/g, "/")
    .split("/")
    .filter((e) => e.length > 0);
  const entryParts = resolvedEntry.split("/").filter((e) => e.length > 0);

  const isInsideWorkspace = workspaceParts.every(
    (part, index) => part === entryParts[index],
  );

  const rawPath = isInsideWorkspace
    ? entryParts.slice(workspaceParts.length).join("/")
    : resolvedEntry;

  const programPath = UriUtils.processDriveLetter(rawPath).drive
    ? rawPath[0].toUpperCase() + rawPath.slice(1)
    : rawPath;

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

export async function applyQuickFixes(
  diagnostics: Diagnostic[],
): Promise<CodeAction[] | undefined> {
  const actions: CodeAction[] = [];
  // PLI CODES LIST
  const CODE_AMBIGUOUS_REFERENCE = fullCode(PLICodes.Severe.IBM1881I);
  const CODE_UNRESOLVED_INCLUDE = fullCode(PLICodes.Severe.IBM1848I); // The INCLUDE file could not be found
  const CODE_MISSING_CONFIG = fullCode(
    LspCodes.IncludeResolution.MissingConfiguration,
  ); // "Could not resolve include directive. Plugin configuration is missing"
  const CODE_MACRO_CASE = fullCode(LspCodes.UpperCase);

  for (const diagnostic of diagnostics) {
    if (!diagnostic.code) {
      return;
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
    }
  }

  if (!actions.length) return undefined;
  return actions;
}
