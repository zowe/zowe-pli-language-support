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
  PluginConfigurationProvider,
  PluginConfigurationProviderInstance,
  serializeProcessGroup,
} from "../../workspace/plugin-configuration-provider";

export async function quickFixResolveInclude(
  diagnostic: Diagnostic,
): Promise<CodeAction | undefined> {
  const unresolvedFile = diagnostic.data?.unresolvedFile;
  const procGrpsConfig =
    PluginConfigurationProviderInstance.getProcessGroupConfig("default");
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
  if (!parentFolder || procGrpsConfig.$computedLibs.includes(parentFolder)) {
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
    PluginConfigurationProvider.PROCESS_GROUP_CONFIG_FILE,
  );

  const action: CodeAction = {
    title: `Add '${parentFolder}' to INCLUDE libs`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    command: {
      title: "Apply INCLUDE fix",
      command: "pli.applyIncludeFix",
      arguments: [procGrpsFileUri.toString(), newContent],
    },
  };

  return action;
}

export async function applyQuickFixes(
  diagnostics: Diagnostic[],
): Promise<CodeAction[] | undefined> {
  const actions: CodeAction[] = [];
  // PLI CODES LIST
  const CODE_UNRESOLVED_INCLUDE = "IBM3841IS"; // The INCLUDE file could not be found, or if found, it could not be opened.

  for (const diagnostic of diagnostics) {
    if (diagnostic.code === CODE_UNRESOLVED_INCLUDE) {
      const action = await quickFixResolveInclude(diagnostic);
      if (action) actions.push(action);
    }
  }

  if (!actions.length) return undefined;
  return actions;
}
