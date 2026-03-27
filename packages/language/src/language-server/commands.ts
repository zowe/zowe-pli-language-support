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

import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { ExecuteCommandParams } from "vscode-languageserver";
import { updateOrCreateConfig } from "../utils/config";
import { UriUtils } from "../utils/uri";

export async function commandResolveInclude(params: ExecuteCommandParams) {
  const [uri, content] = params.arguments as string[];
  try {
    await FileSystemProviderInstance.writeFile(UriUtils.toUri(uri), content);
  } catch (err) {
    console.error(`Failed to write file at URI: ${uri}`, err);
  }
}

export async function commandCreateConfig(
  params: ExecuteCommandParams,
): Promise<void> {
  if (!params.arguments) {
    return;
  }
  const programPath = params.arguments[0];
  if (!programPath) {
    return;
  }
  await updateOrCreateConfig(programPath);
}

export async function commandRemoveUnresolvedLib(params: ExecuteCommandParams) {
  const [uri, content] = params.arguments as string[];
  if (!uri || content === undefined) {
    return;
  }
  try {
    await FileSystemProviderInstance.writeFile(UriUtils.toUri(uri), content);
  } catch (err) {
    console.error(`Failed to write file at URI: ${uri}`, err);
  }
}
