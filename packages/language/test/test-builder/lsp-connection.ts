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

import { PassThrough } from "stream";
import {
  createConnection,
  Connection,
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-languageserver/node";

export interface TestConnectionPair {
  serverConnection: Connection;
  clientConnection: Connection;
  dispose: () => void;
}

export function createTestConnection(): TestConnectionPair {
  const clientToServer = new PassThrough();
  const serverToClient = new PassThrough();

  const serverConnection = createConnection(
    new StreamMessageReader(clientToServer),
    new StreamMessageWriter(serverToClient),
  );

  const clientConnection = createConnection(
    new StreamMessageReader(serverToClient),
    new StreamMessageWriter(clientToServer),
  );

  const dispose = () => {
    serverConnection.dispose();
    clientConnection.dispose();

    clientToServer.end();
    serverToClient.end();
  };

  return {
    serverConnection,
    clientConnection,
    dispose,
  };
}
