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
  readFileSync(uri: URI): string {
    return fs.readFileSync(uri.fsPath, "utf8");
  }
  fileExistsSync(uri: URI): boolean {
    return fs.existsSync(uri.fsPath);
  }
  writeFileSync(uri: URI, value: string): void {
    // Do nothing for now.
    // Todo (ssmifi): Should we throw an error here?
  }
  findFilesByGlobSync(pattern: string): string[] {
    return glob.sync(pattern, {
      nodir: true,
      absolute: true,
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
