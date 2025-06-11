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
import { createTestBuilder, PliTestFile, TestBuilder } from "../test-builder";

describe("Go To Definition request", () => {
  let vfs: VirtualFileSystemProvider;
  let createFsTestBuilder: (content: string | PliTestFile[]) => TestBuilder;

  beforeAll(() => {
    vfs = new VirtualFileSystemProvider();
    setFileSystemProvider(vfs);
    createFsTestBuilder = (content: string | PliTestFile[]) =>
      createTestBuilder(content, { fs: vfs });
  });

  afterAll(() => {
    setFileSystemProvider(undefined);
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
