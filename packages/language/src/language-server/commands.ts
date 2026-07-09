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

import { ExecuteCommandParams } from "vscode-languageserver";
import { updateOrCreateConfig } from "../utils/config";
import { WorkspaceContext } from "../workspace/workspace-context";

export async function commandCreateConfig(
  params: ExecuteCommandParams,
  workspace: WorkspaceContext,
): Promise<void> {
  if (!params.arguments) {
    return;
  }
  const programPath = params.arguments[0];
  if (!programPath) {
    return;
  }
  await updateOrCreateConfig(programPath, workspace);
}
