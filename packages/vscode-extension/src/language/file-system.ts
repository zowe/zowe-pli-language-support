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

import {
  FileSystemProvider,
  FileType,
  Stats,
  URI,
  sendRequest,
} from "pli-language";
import { Connection } from "vscode-languageserver";
import { Messages } from "../common/messages";

export class VSCodeFileSystemProvider implements FileSystemProvider {
  private _connection: Connection;

  constructor(connection: Connection) {
    this._connection = connection;
  }

  async readFile(uri: URI): Promise<string | undefined> {
    try {
      const result = await sendRequest(
        this._connection,
        Messages.ReadFile,
        uri.toString(),
      );
      // The connection object returns null, even if the handler returns undefined
      // Handle all non-string results as undefined
      if (typeof result !== "string") {
        return undefined;
      }
      return result;
    } catch {
      return undefined;
    }
  }

  async readDir(uri: URI): Promise<[string, FileType][]> {
    const result = await sendRequest(
      this._connection,
      Messages.ReadDir,
      uri.toString(),
    );
    return result;
  }

  async fileExists(uri: URI): Promise<boolean> {
    const result = await sendRequest(
      this._connection,
      Messages.FileExists,
      uri.toString(),
    );
    return result;
  }
  async findFile(
    path: URI,
    extensions: readonly string[],
  ): Promise<URI | undefined> {
    const result = await sendRequest(this._connection, Messages.FindFile, {
      path: path.toString(),
      extensions: [...extensions],
    });
    if (result) {
      return path.with({ path: result });
    }
    return undefined;
  }

  async stat(uri: URI): Promise<Stats> {
    const result = await sendRequest(
      this._connection,
      Messages.Stat,
      uri.toString(),
    );
    return result;
  }

  async writeFile(uri: URI, value: string): Promise<void> {
    const uriString = uri.toString();
    await sendRequest(this._connection, Messages.WriteFile, [uriString, value]);
  }

  deleteFile(_uri: URI): Promise<void> {
    throw new Error("Not supported.");
  }
}
