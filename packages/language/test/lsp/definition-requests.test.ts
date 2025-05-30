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
import { TestBuilder } from "../utils";
import {
  VirtualFileSystemProvider,
  setFileSystemProvider,
} from "../../src/workspace/file-system-provider";

describe("Go To Definition request", () => {
  let vfs: VirtualFileSystemProvider;

  beforeAll(() => {
    vfs = new VirtualFileSystemProvider();
    setFileSystemProvider(vfs);
  });

  afterAll(() => {
    setFileSystemProvider(undefined);
  });

  it("should resolve definition in same file", () => {
    const content = ` DCL <|1:X|> FIXED;
 <|1>X = 1;`;

    new TestBuilder(content, undefined, vfs).expectLinks();
  });

  it("should not resolve wrong request in TestBuilder", () => {
    const content = ` DCL <|1:X|> FIXED;
 <|2>X = 1;`;

    expect(() =>
      new TestBuilder(content, undefined, vfs).expectLinks(),
    ).toThrow();
  });

  it("should resolve definition in included file", () => {
    const include = ` DCL <|1:Y|> FIXED;`;
    const main = ` %INCLUDE "include.pli";
 <|1>Y = 42;`;

    new TestBuilder(
      [
        { uri: "file:///main.pli", content: main },
        { uri: "file:///include.pli", content: include },
      ],
      undefined,
      vfs,
    ).expectLinks();
  });

  it("should resolve multiple requests", () => {
    const include = ` DCL <|1:Y|> FIXED;`;
    const main = ` %INCLUDE "include.pli";
 <|1>Y = 42;
 <|1>Y = 45;`;

    new TestBuilder(
      [
        { uri: "file:///main.pli", content: main },
        { uri: "file:///include.pli", content: include },
      ],
      undefined,
      vfs,
    ).expectLinks();
  });

  it("should resolve definition across multiple files", () => {
    const include = ` DCL <|1:X|> FIXED;`;
    const include2 = ` DCL <|2:Y|> FIXED;`;
    const main = ` %INCLUDE "include.pli";
 %INCLUDE "include2.pli";
 <|1>X = 42;
 <|2>Y = 43;`;

    new TestBuilder(
      [
        { uri: "file:///main.pli", content: main },
        { uri: "file:///include.pli", content: include },
        { uri: "file:///include2.pli", content: include2 },
      ],
      undefined,
      vfs,
    ).expectLinks();
  });
});
