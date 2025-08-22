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
  setFileSystemProvider,
  startLanguageServer,
  VirtualFileSystemProvider,
} from "pli-language";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from "vscode-languageserver/browser.js";
import { URI } from "vscode-uri";
import {
  FILE_SYSTEM_NAMESPACE,
  FileSystemMessage,
  LSFileAction,
} from "../utils";

class LSFileSystemProvider extends VirtualFileSystemProvider {
  constructor() {
    super();
    self.addEventListener("message", (event) => {
      if (event.data?.namespace === FILE_SYSTEM_NAMESPACE) {
        const message = event.data as FileSystemMessage;
        switch (message.type) {
          case LSFileAction.Add:
            this.writeFileSync(URI.parse(message.uri), message.content || "");
            break;
          case LSFileAction.Delete:
            this.deleteFileSync(URI.parse(event.data.uri));
            break;
          case LSFileAction.Rename:
            const content = this.readFileSync(URI.parse(event.data.uri));
            this.deleteFileSync(URI.parse(event.data.uri));
            this.writeFileSync(URI.parse(event.data.content), content || "");
            break;
          default:
            console.log("Unsupported file action: ", event.data.type);
            break;
        }
      }
    });
  }
}

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

// Start the language server with the shared services
setFileSystemProvider(new LSFileSystemProvider());
startLanguageServer(connection);
