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

import { describe, expect, test, vitest, beforeAll, afterAll } from "vitest";
import { MarginIndicatorNotification } from "../../src/language-server/margin-indicator";
import { Connection } from "vscode-languageserver";
import { UriUtils } from "../../src/utils/uri";
import { parse } from "../utils";
import {
  ProcessGroup,
  ProgramConfig,
} from "../../src/workspace/plugin-configuration-provider";
import { makeProcessGroup, makeProgramConfig } from "../config-fixtures";
import { defaultTestWorkspace } from "../test-workspace";

describe("marginIndicator", () => {
  beforeAll(async () => {
    await defaultTestWorkspace().config.init(UriUtils.toUri("/test"));
  });

  afterAll(async () => {
    defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri(""), []);
    await defaultTestWorkspace().config.setProcessGroupConfigs([]);
  });

  test("sends notification with margins from *PROCESS directive", async () => {
    const sendNotification = vitest.fn();
    const mockConnection = {
      sendNotification,
    } as unknown as Connection;

    const uri = UriUtils.toUri("/test/test.pli");
    const inputText = `*PROCESS MARGINS(10, 80);
      DCL A fixed bin(31);`;

    const unit = await parse(inputText, { uri });

    // Trigger the revalidation which calls marginIndicator
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Filter calls to only check MarginIndicatorNotification
    const marginCalls = sendNotification.mock.calls.filter(
      (call: any[]) => call[0] === MarginIndicatorNotification,
    );

    expect(marginCalls).toHaveLength(1);
    expect(marginCalls[0]).toEqual([
      MarginIndicatorNotification,
      { uri: uri.toString(), m: 10, n: 80 },
    ]);
  });

  test("sends notification with default margins when not specified", async () => {
    const sendNotification = vitest.fn();
    const mockConnection = {
      sendNotification,
    } as unknown as Connection;

    const uri = UriUtils.toUri("/test/test.pli");
    const inputText = `DCL A fixed bin(31);`;

    const unit = await parse(inputText, { uri });

    // Trigger the revalidation which calls marginIndicator
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Filter calls to only check MarginIndicatorNotification
    const marginCalls = sendNotification.mock.calls.filter(
      (call: any[]) => call[0] === MarginIndicatorNotification,
    );

    expect(marginCalls).toHaveLength(1);
    expect(marginCalls[0]).toEqual([
      MarginIndicatorNotification,
      { uri: uri.toString(), m: 2, n: 72 },
    ]);
  });

  test("does not send notification when margins are cached and unchanged", async () => {
    const sendNotification = vitest.fn();
    const mockConnection = {
      sendNotification,
    } as unknown as Connection;

    const uri = UriUtils.toUri("/test/test.pli");
    const inputText = `*PROCESS MARGINS(5, 70);
      DCL A fixed bin(31);`;

    const unit = await parse(inputText, { uri });

    // First call
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });
    // Second call with same margins
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Filter calls to only check MarginIndicatorNotification
    const marginCalls = sendNotification.mock.calls.filter(
      (call: any[]) => call[0] === MarginIndicatorNotification,
    );

    // Should only be called once due to caching
    expect(marginCalls).toHaveLength(1);
  });

  test("sends notification when margins change", async () => {
    const sendNotification = vitest.fn();
    const mockConnection = {
      sendNotification,
    } as unknown as Connection;

    const uri = UriUtils.toUri("/test/test.pli");

    // First compilation with margins 5, 70
    let inputText = `*PROCESS MARGINS(5, 70);
      DCL A fixed bin(31);`;
    let unit = await parse(inputText, { uri });
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Second compilation with different margins 10, 80
    inputText = `*PROCESS MARGINS(10, 80);
      DCL B fixed bin(31);`;
    unit = await parse(inputText, { uri });
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Filter calls to only check MarginIndicatorNotification
    const marginCalls = sendNotification.mock.calls.filter(
      (call: any[]) => call[0] === MarginIndicatorNotification,
    );

    expect(marginCalls).toHaveLength(2);
    expect(marginCalls[0]).toEqual([
      MarginIndicatorNotification,
      { uri: uri.toString(), m: 5, n: 70 },
    ]);
    expect(marginCalls[1]).toEqual([
      MarginIndicatorNotification,
      { uri: uri.toString(), m: 10, n: 80 },
    ]);
  });

  test("sends notification with margins from process group config", async () => {
    const sendNotification = vitest.fn();
    const mockConnection = {
      sendNotification,
    } as unknown as Connection;

    const uri = UriUtils.toUri("/test/test.pli");
    const inputText = `DCL A fixed bin(31);`;

    const programConfig: ProgramConfig = makeProgramConfig({
      program: "test.pli",
      pgroup: "testGroup",
    });
    const processGroupConfig: ProcessGroup = makeProcessGroup({
      name: "testGroup",
      compilerOptions: ["MARGINS(15, 85)"],
      checkMargins: false,
      instructionCounterLimit: 5000,
      caseUpperValidation: false,
    });

    defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri("/test"), [
      programConfig,
    ]);
    await defaultTestWorkspace().config.setProcessGroupConfigs([
      processGroupConfig,
    ]);

    const unit = await parse(inputText, { uri });

    // Trigger the revalidation which calls marginIndicator
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Filter calls to only check MarginIndicatorNotification
    const marginCalls = sendNotification.mock.calls.filter(
      (call: any[]) => call[0] === MarginIndicatorNotification,
    );

    expect(marginCalls).toHaveLength(1);
    expect(marginCalls[0]).toEqual([
      MarginIndicatorNotification,
      { uri: uri.toString(), m: 15, n: 85 },
    ]);
  });

  test("does not send notification for virtual files", async () => {
    const sendNotification = vitest.fn();
    const mockConnection = {
      sendNotification,
    } as unknown as Connection;

    const uri = UriUtils.toUri(
      'git:/test/test.pli.git?{"path":"/test/test.pli","ref":""}',
    );
    const inputText = `*PROCESS MARGINS(10, 80);
      DCL A fixed bin(31);`;

    const unit = await parse(inputText, { uri });

    // Trigger the revalidation which calls marginIndicator
    unit.requestCaches.revalidateAll({ connection: mockConnection, unit });

    // Filter calls to only check MarginIndicatorNotification
    const marginCalls = sendNotification.mock.calls.filter(
      (call: any[]) => call[0] === MarginIndicatorNotification,
    );

    // Should NOT send notification for virtual git: URI
    expect(marginCalls).toHaveLength(0);
  });
});
