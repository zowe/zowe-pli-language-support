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
  createConnection,
  ProposedFeatures,
} from "vscode-languageserver/node.js";
import {
  startLanguageServer,
  FileSystemProvider,
  SearchOptions,
  URI,
  setFileSystemProvider,
} from "pli-language";
import * as fs from "fs";
import * as nPath from "path";
import { searchFiles } from "../common/search";

class NodeFileSystemProvider implements FileSystemProvider {
  readFile(uri: URI): Promise<string> {
    return fs.promises.readFile(uri.fsPath, "utf8");
  }
  async fileExists(uri: URI): Promise<boolean> {
    try {
      await fs.promises.access(uri.fsPath);
      return true;
    } catch {
      return false;
    }
  }
  async writeFile(uri: URI, value: string): Promise<void> {
    throw new Error("Not supported.");
  }
  async deleteFile(uri: URI): Promise<void> {
    throw new Error("Not supported.");
  }
  async search(options: SearchOptions): Promise<URI | undefined> {
    const path = await searchFiles(options, async (path) => {
      const result = await fs.promises.readdir(path);
      return result.map((file) => nPath.basename(file));
    });
    if (path) {
      return options.path.with({ path });
    } else {
      return undefined;
    }
  }
}

setFileSystemProvider(new NodeFileSystemProvider());

const connection = createConnection(ProposedFeatures.all);
startLanguageServer(connection);
