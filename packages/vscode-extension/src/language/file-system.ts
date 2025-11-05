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
  isPathSearch,
  SearchOptions,
  Stats,
  URI,
} from "pli-language";
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

  /**
   * Submits a request to the client to read the contents of a directory.
   * Returns an array of file & directory names as strings
   */
  async readDir(uri: URI): Promise<string[]> {
    const result = await this._connection.sendRequest(
      Messages.ReadDir,
      uri.toString(),
    );
    if (Array.isArray(result)) {
      return result as string[];
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
  async search(options: SearchOptions): Promise<URI | undefined> {
    const result = (await this._connection.sendRequest(
      Messages.Search,
      options,
    )) as string | undefined;
    if (result) {
      if (isPathSearch(options)) {
        return options.path.with({ path: result });
      } else {
        // not a path, take result as full URI
        return URI.parse(result);
      }
    } else {
      return undefined;
    }
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
