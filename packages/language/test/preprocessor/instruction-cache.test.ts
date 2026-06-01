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

import { describe, expect, test } from "vitest";
import {
  InstructionCache,
  FileInstructionResult,
} from "../../src/preprocessor/instruction-cache";
import { UriUtils } from "../../src/utils/uri";

/**
 * Tests for InstructionCache to verify that it correctly invalidates
 * when recompile-relevant compiler options change.
 */
describe("InstructionCache - Fingerprint-based invalidation", () => {
  const createMockResult = (marker: string): FileInstructionResult => ({
    tokens: [],
    comments: [],
    diagnostics: [],
    statements: [],
    result: { marker } as any, // Include a marker to verify identity
  });

  test("Same text + same fingerprint -> cache hit (same result instance)", async () => {
    const cache = new InstructionCache();
    const uri = UriUtils.toUri("memory:///test.pli");
    const text = "TEST: PROC OPTIONS(MAIN);";
    const fingerprint = "MARGINS|1|2,72";

    cache.update(fingerprint);
    const result1 = await cache.get(uri, text, async () =>
      createMockResult("result1"),
    );

    cache.update(fingerprint); // Same fingerprint
    const result2 = await cache.get(uri, text, async () =>
      createMockResult("result2"),
    );

    // Should return the same cached instance
    expect(result2).toBe(result1);
    expect((result2.result as any).marker).toBe("result1");
  });

  test("Same text + changed MARGINS in fingerprint -> cache miss (re-tokenized)", async () => {
    const cache = new InstructionCache();
    const uri = UriUtils.toUri("memory:///test.pli");
    const text = "TEST: PROC OPTIONS(MAIN);";

    const fingerprint1 = "MARGINS|1|2,72";
    cache.update(fingerprint1);
    const result1 = await cache.get(uri, text, async () =>
      createMockResult("margins-72"),
    );

    const fingerprint2 = "MARGINS|1|2,120";
    cache.update(fingerprint2);
    const result2 = await cache.get(uri, text, async () =>
      createMockResult("margins-120"),
    );

    expect(result2).not.toBe(result1);
    expect((result2.result as any).marker).toBe("margins-120");
    expect((result1.result as any).marker).toBe("margins-72");
  });

  test("Same text + changed OR/NOT in fingerprint -> cache miss (regression check)", async () => {
    const cache = new InstructionCache();
    const uri = UriUtils.toUri("memory:///test.pli");
    const text = "TEST: PROC OPTIONS(MAIN);";

    const fingerprint1 = "OR|1||";
    cache.update(fingerprint1);
    const result1 = await cache.get(uri, text, async () =>
      createMockResult("or-pipe"),
    );

    const fingerprint2 = "OR|1|!";
    cache.update(fingerprint2);
    const result2 = await cache.get(uri, text, async () =>
      createMockResult("or-bang"),
    );

    expect(result2).not.toBe(result1);
    expect((result2.result as any).marker).toBe("or-bang");
  });

  test("Changed text -> cache miss regardless of fingerprint", async () => {
    const cache = new InstructionCache();
    const uri = UriUtils.toUri("memory:///test.pli");
    const fingerprint = "MARGINS|1|2,72";

    cache.update(fingerprint);
    const result1 = await cache.get(
      uri,
      "TEST: PROC OPTIONS(MAIN);",
      async () => createMockResult("text1"),
    );

    cache.update(fingerprint);
    const result2 = await cache.get(
      uri,
      "TEST: PROC OPTIONS(MAIN); END;",
      async () => createMockResult("text2"),
    );

    expect(result2).not.toBe(result1);
    expect((result2.result as any).marker).toBe("text2");
  });

  test("Rule removed from fingerprint -> cache miss", async () => {
    const cache = new InstructionCache();
    const uri = UriUtils.toUri("memory:///test.pli");
    const text = "TEST: PROC OPTIONS(MAIN);";

    const fingerprint1 = "MARGINS|1|2,72";
    cache.update(fingerprint1);
    const result1 = await cache.get(uri, text, async () =>
      createMockResult("with-margins"),
    );

    const fingerprint2 = "";
    cache.update(fingerprint2);
    const result2 = await cache.get(uri, text, async () =>
      createMockResult("no-margins"),
    );

    expect(result2).not.toBe(result1);
    expect((result2.result as any).marker).toBe("no-margins");
  });
});
