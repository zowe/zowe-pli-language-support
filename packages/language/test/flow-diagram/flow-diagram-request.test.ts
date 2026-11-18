/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

import { describe, expect, test, vi } from "vitest";
import type { Connection } from "vscode-languageserver";
import { parse } from "../utils";
import * as lifecycle from "../../src/workspace/lifecycle";
import {
  flowDiagramRequest,
  notifyFlowDiagram,
} from "../../src/language-server/flow-diagram-request";
import { Messages } from "../../src/utils/messages";
import { UriUtils } from "../../src/utils/uri";

function fakeConnection() {
  const sendNotification = vi.fn();
  return {
    connection: { sendNotification } as unknown as Connection,
    sendNotification,
  };
}

describe("Flow diagram request", () => {
  test("caches the model until the unit is parsed again", async () => {
    const unit = await parse(" P: PROC; X = 1; END P;", { validate: true });
    const first = flowDiagramRequest(unit);
    expect(flowDiagramRequest(unit)).toBe(first);

    // A new parse produces a new AST: the model is rebuilt.
    lifecycle.parse(unit);
    const second = flowDiagramRequest(unit);
    expect(second).not.toBe(first);
    expect(second).toEqual(first);
  });

  test("notifies the client once per change of the preprocessed text", async () => {
    const unit = await parse(" P: PROC; X = 1; END P;", { validate: true });
    const { connection, sendNotification } = fakeConnection();

    notifyFlowDiagram(connection, unit);
    expect(sendNotification).toHaveBeenCalledTimes(1);
    expect(sendNotification).toHaveBeenCalledWith(
      Messages.FlowDiagramChanged.method,
      { uris: [unit.uri.toString()] },
    );

    // Unchanged program: nothing to refresh.
    notifyFlowDiagram(connection, unit);
    expect(sendNotification).toHaveBeenCalledTimes(1);

    unit.preprocessedText += "\n";
    notifyFlowDiagram(connection, unit);
    expect(sendNotification).toHaveBeenCalledTimes(2);
  });

  test("does not notify for virtual documents", async () => {
    const unit = await parse(" P: PROC; END P;", {
      validate: true,
      uri: UriUtils.toUri("pli-builtin:///builtins.pli"),
    });
    const { connection, sendNotification } = fakeConnection();
    notifyFlowDiagram(connection, unit);
    expect(sendNotification).not.toHaveBeenCalled();
  });
});
