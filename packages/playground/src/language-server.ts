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
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from "vscode-languageserver/browser.js";
import {
  setFileSystemProvider,
  startLanguageServer,
  VirtualFileSystemProvider,
} from "pli-language";
import { URI } from "vscode-uri";

export enum LSFileAction {
  Add = "add",
  Delete = "delete",
  Rename = "rename",
}

export const FILE_SYSTEM_NAMESPACE = "file-system" as const;

export interface FileSystemMessage {
  namespace: typeof FILE_SYSTEM_NAMESPACE;
  type: LSFileAction;
  uri: string;
  content?: string;
}

class LSFileSystemProvider extends VirtualFileSystemProvider {
  constructor() {
    super();
    self.addEventListener("message", (event) => {
      if (event.data?.namespace === FILE_SYSTEM_NAMESPACE) {
        const message = event.data as FileSystemMessage;
        console.log("Received file system message: ", message);
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
const messageReader = new BrowserMessageReader(self as any);
const messageWriter = new BrowserMessageWriter(self as any);

const connection = createConnection(messageReader, messageWriter);

// Start the language server with the shared services
setFileSystemProvider(new LSFileSystemProvider());
startLanguageServer(connection);
