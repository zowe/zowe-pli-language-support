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
import { BaseLanguageClient } from "vscode-languageclient";
import { Messages } from "../common/messages";

export function registerFileSystemProvider(client: BaseLanguageClient): void {
  client.onRequest(Messages.ReadFile, async (uriString: string) => {
    const uri = vscode.Uri.parse(uriString);
    try {
      const data = await vscode.workspace.fs.readFile(uri);
      const textDecoder = new TextDecoder();
      return textDecoder.decode(data);
    } catch {
      return undefined;
    }
  });
  client.onRequest(Messages.FileExists, async (uriString: string) => {
    const uri = vscode.Uri.parse(uriString);
    try {
      await vscode.workspace.fs.stat(uri);
      return true;
    } catch {
      return false;
    }
  });
  client.onRequest(
    Messages.FindFile,
    async (params: { path: string; extensions: string[] }) => {
      // Workspace-wide lookup: match a file whose path ends with the given
      // suffix, optionally with one of the configured extensions.
      const uri = vscode.Uri.parse(params.path);
      const suffix = uri.path.replace(/\\/g, "/");
      const exts =
        params.extensions.length > 0
          ? `{,${params.extensions
              .map((e) => (e.startsWith(".") ? e : `.${e}`))
              .join(",")}}`
          : "";
      const matches = await vscode.workspace.findFiles(
        `**${suffix}${exts}`,
        undefined,
        1,
      );
      return matches.length > 0 ? matches[0].path : undefined;
    },
  );
  client.onRequest(Messages.Stat, async (uriString: string) => {
    const uri = vscode.Uri.parse(uriString);
    const stat = await vscode.workspace.fs.stat(uri);
    return {
      isFile: stat.type === vscode.FileType.File,
      isDirectory: stat.type === vscode.FileType.Directory,
    };
  });
  client.onRequest(
    Messages.WriteFile,
    async (params: { uriString: string; value: string }) => {
      const uri = vscode.Uri.parse(params.uriString);
      await vscode.workspace.fs.writeFile(
        uri,
        new TextEncoder().encode(params.value),
      );
    },
  );
  client.onRequest(Messages.ReadDir, async (uriString: string) => {
    const uri = vscode.Uri.parse(uriString);
    const result = await vscode.workspace.fs.readDirectory(uri);
    return result;
  });
}
