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
import { GlobalConfigLoader, Messages, sendRequest, URI } from "pli-language";
import { Connection } from "vscode-languageserver";

export class VscodeGlobalConfigLoader implements GlobalConfigLoader {
  constructor(private readonly connection: Connection) {}
  async loadGlobalConfig(
    workspaceUri: URI | undefined,
  ): Promise<Messages.GlobalConfig> {
    return await sendRequest(
      this.connection,
      Messages.GetGlobalConfig,
      workspaceUri?.toString() ?? null,
    );
  }
}
