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

import { FileSystemProvider, FileType, Stats, URI } from "pli-language";
import { Connection } from "vscode-languageserver";
import { Messages } from "../common/messages";

export class VSCodeFileSystemProvider implements FileSystemProvider {
  private _connection: Connection;

  constructor(connection: Connection) {
    this._connection = connection;
  }

  async readFile(uri: URI): Promise<string | undefined> {
    const result = await this._connection.sendRequest(
      Messages.ReadFile,
      uri.toString(),
    );
    if (typeof result === "string") {
      return result;
    } else {
      return undefined;
    }
  }

  async readDir(uri: URI): Promise<[string, FileType][]> {
    const result = await this._connection.sendRequest(
      Messages.ReadDir,
      uri.toString(),
    );
    if (Array.isArray(result)) {
      return result as [string, FileType][];
    } else {
      return [];
    }
  }

  async fileExists(uri: URI): Promise<boolean> {
    const result = await this._connection.sendRequest(
      Messages.FileExists,
      uri.toString(),
    );
    return Boolean(result);
  }
  async findFile(
    path: URI,
    extensions: readonly string[],
  ): Promise<URI | undefined> {
    const result = (await this._connection.sendRequest(Messages.FindFile, {
      path: path.toString(),
      extensions: [...extensions],
    })) as string | undefined;
    if (result) {
      return path.with({ path: result });
    }
    return undefined;
  }

  async stat(uri: URI): Promise<Stats> {
    const result = await this._connection.sendRequest(
      Messages.Stat,
      uri.toString(),
    );
    return result as Stats;
  }

  async writeFile(uri: URI, value: string): Promise<void> {
    const stringUri = uri.toString();
    await this._connection.sendRequest(Messages.WriteFile, {
      stringUri,
      value,
    });
  }

  deleteFile(_uri: URI): Promise<void> {
    throw new Error("Not supported.");
  }
}
