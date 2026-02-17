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

import { URI } from "vscode-uri";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { ExecuteCommandParams } from "vscode-languageserver";
import { updateOrCreateConfig } from "../utils/config";

export async function commandResolveInclude(params: ExecuteCommandParams) {
  const [uri, content] = params.arguments as string[];
  try {
    await FileSystemProviderInstance.writeFile(URI.parse(uri), content);
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
