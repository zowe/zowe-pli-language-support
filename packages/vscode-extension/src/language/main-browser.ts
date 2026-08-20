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
} from "vscode-languageserver/browser";
import { startLanguageServer } from "pli-language";
import { VSCodeFileSystemProvider } from "./file-system";
import { VscodeGlobalConfigLoader } from "./config-loader";

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const globalConfigLoader = new VscodeGlobalConfigLoader(connection);

startLanguageServer(
  connection,
  new VSCodeFileSystemProvider(connection),
  globalConfigLoader,
);
