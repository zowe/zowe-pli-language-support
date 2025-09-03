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
  URI,
  setFileSystemProvider,
} from "pli-language";
import * as fs from "fs";
import * as glob from "glob";

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
  findFilesByGlob(pattern: string): Promise<string[]> {
    return glob.glob(pattern, {
      nodir: true,
      absolute: true,
      nocase: true,
    });
  }
}

setFileSystemProvider(new NodeFileSystemProvider());

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// // Inject the shared services and language-specific services
// const { shared } = createPliServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(connection);
