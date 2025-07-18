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

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  VirtualFileSystemProvider,
  setFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import { PliTestFile, TestBuilder } from "../test-builder";
import { PluginConfigurationProviderInstance } from "../../src/workspace/plugin-configuration-provider";

describe("Go To Definition request", () => {
  let vfs: VirtualFileSystemProvider;
  let createFsTestBuilder: (content: string | PliTestFile[]) => TestBuilder;

  beforeAll(() => {
    vfs = new VirtualFileSystemProvider();
    // ensure that the Pli plugin provider has the default path set for includes to resolve
    PluginConfigurationProviderInstance.setProgramConfigs("", [
      {
        program: "*.pli",
        pgroup: "default",
      },
    ]);
    PluginConfigurationProviderInstance.setProcessGroupConfigs([
      {
        name: "default",
        libs: ["./"],
        "include-extensions": [".pli"],
      },
    ]);
    setFileSystemProvider(vfs);
    createFsTestBuilder = (content: string | PliTestFile[]) =>
      TestBuilder.create(content, { fs: vfs });
  });

  afterAll(() => {
    setFileSystemProvider(undefined);
    PluginConfigurationProviderInstance.setProgramConfigs("", []);
    PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
  });

  it("should resolve definition in same file", () => {
    const content = `
 DCL <|1:X|> FIXED;
 <|1>X = 1;`;
    createFsTestBuilder(content).expectLinks();
  });

  it("should not resolve wrong request in TestBuilder", () => {
    const content = ` DCL <|1:X|> FIXED;
 <|2>X = 1;`;

    expect(() => createFsTestBuilder(content).expectLinks()).toThrow();
  });

  it("should resolve multiple requests", () => {
    const include = ` DCL <|1:Y|> FIXED;`;
    const main = ` %INCLUDE "include.pli";
 <|1>Y = 42;
 <|1>Y = 45;`;

    createFsTestBuilder([
      { uri: "file:///main.pli", content: main },
      { uri: "file:///include.pli", content: include },
    ]).expectLinks();
  });
});
