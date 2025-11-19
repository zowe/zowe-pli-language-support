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
} from "vscode-languageserver-types";
import {
  PluginConfigurationProviderInstance,
  serializeProcessGroup,
} from "../../workspace/plugin-configuration-provider";

import { Commands, PluginConfiguration } from "../constants";
import { PLICodes } from "../../validation/pli-codes";
import { LspCodes } from "../../validation/lsp-codes";
import { fullCode } from "../types";

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

  let parentFolder = UriUtils.computeWorkspaceRelativeParentFolder(
    unresolvedFilePath,
    workspaceFolderUri,
  );
  if (!parentFolder || procGrpsConfig.$computedLibsSet.has(parentFolder)) {
    return undefined;
  }

  const serializedProcGrpsConfig = serializeProcessGroup(procGrpsConfig);
  const newContent = JSON.stringify(
    {
      pgroups: [
        {
          ...serializedProcGrpsConfig,
          libs: [...(serializedProcGrpsConfig.libs ?? []), parentFolder],
        },
      ],
    },
    undefined,
    2,
  );

  const procGrpsFileUri = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROCESS_GROUP_FILE_PATH,
  );

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
  const entryUri = UriUtils.basename(URI.parse(diagnostic.data.entryUri));
  if (!diagnostic.data.entryUri || !entryUri) {
    return undefined;
  }
  const action: CodeAction = {
    title: `Create a plugin configuration folder for this file.`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    command: {
      title: "Create configuration folder",
      command: Commands.CREATE_CONFIG,
      arguments: [entryUri],
    },
  };

  return action;
}

export async function applyQuickFixes(
  diagnostics: Diagnostic[],
): Promise<CodeAction[] | undefined> {
  const actions: CodeAction[] = [];
  // PLI CODES LIST
  const CODE_UNRESOLVED_INCLUDE = fullCode(PLICodes.Severe.IBM3841I); // The INCLUDE file could not be found, or if found, it could not be opened.
  const CODE_MISSING_CONFIG = fullCode(
    LspCodes.IncludeResolution.MissingConfiguration,
  ); // "Could not resolve include directive. Plugin configuration is missing"

  for (const diagnostic of diagnostics) {
    if (!diagnostic.code) {
      return;
    }
    let action: CodeAction | undefined;
    switch (diagnostic.code) {
      case CODE_UNRESOLVED_INCLUDE:
        action = await quickFixResolveInclude(diagnostic);
        if (action) actions.push(action);
        break;
      case CODE_MISSING_CONFIG:
        action = await quickFixCreateConfig(diagnostic);
        if (action) actions.push(action);
        break;
    }
  }

  if (!actions.length) return undefined;
  return actions;
}
