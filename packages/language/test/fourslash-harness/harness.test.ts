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

import { describe, expect, test, vitest } from "vitest";
import { HarnessTesterInterface } from "./harness-interface";
import { HarnessCodes } from "./implementation/codes";
import { HarnessTest } from "./types";
import { runHarnessTest } from "./harness-runner";
import { parseHarnessTest } from "./harness-parser";
import { parseWrapperFile } from "./wrapper";
import { HarnessConstants } from "./implementation/constants";

type HarnessImplementationListener = (method: string, ...args: any[]) => void;

const INTERNAL_METHOD_NAME_PREFIX = "__methodName";

function createListenerCreator(listener: HarnessImplementationListener) {
  return (methodName: string) => {
    const _listener = function (...args: any[]) {
      listener(methodName, ...args);
    };
    _listener[INTERNAL_METHOD_NAME_PREFIX] = methodName;

    return _listener;
  };
}

function createTestingHarnessImplementation(
  listener: HarnessImplementationListener,
): HarnessTesterInterface {
  const listen = createListenerCreator(listener);

  return {
    linker: {
      expectLinks: listen("linker.expectLinks"),
      expectNoLinksAt: listen("linker.expectNoLinksAt"),
    },
    verify: {
      expectExclusiveErrorCodesAt: listen("verify.expectExclusiveErrorCodesAt"),
    },
    completion: {
      expectAt: listen("completion.expectAt"),
    },
    code: HarnessCodes,
    constants: HarnessConstants,
  };
}

describe("Harness test framework tests", () => {
  test("should run expectNoLinksAt command", () => {
    const mockFunction = vitest.fn().mockImplementation(() => {});
    const implementation = createTestingHarnessImplementation(mockFunction);
    const commands = `linker.expectNoLinksAt("label");`;

    const file: HarnessTest = {
      commands,
      fileName: "test.pli",
      files: new Map(),
    };

    runHarnessTest(file, implementation);

    expect(mockFunction).toHaveBeenCalledWith(
      "linker.expectNoLinksAt",
      "label",
    );
  });

  test("should run all commands", () => {
    const mockFunction = vitest.fn().mockImplementation(() => {});
    const implementation = createTestingHarnessImplementation(mockFunction);

    const functionCalls = Object.values(implementation).flatMap(
      (group, groupId) =>
        Object.values(group)
          .filter(
            (method) =>
              (method as any)?.[INTERNAL_METHOD_NAME_PREFIX] !== undefined,
          )
          .map((method, methodId) => [
            (method as any)[INTERNAL_METHOD_NAME_PREFIX],
            `${groupId}.${methodId}`,
          ]),
    );

    const commands = functionCalls
      .map(
        ([methodName, methodArguments]) =>
          `${methodName}("${methodArguments}")`,
      )
      .join("\n");

    const file: HarnessTest = {
      commands,
      fileName: "test.pli",
      files: new Map(),
    };

    runHarnessTest(file, implementation);

    for (const [method, methodArguments] of functionCalls) {
      expect(mockFunction).toHaveBeenCalledWith(method, methodArguments);
    }
  });

  test("should extract code from multiple file blocks", () => {
    const wrap1 = "main";
    const fileName1 = "file1.pli";
    const content1 = `line
 with space
  and newlines
  
two newlines`;

    const wrap2 = "main2";
    const fileName2 = "file2.pli";
    const content2 = `CONTENT`;

    const commands = `
/// <reference path="../framework.ts" />

import { whatever } from "wherever";

/**
 Ignore this comment please
 */

// @wrap: ${wrap1}
// @filename: ${fileName1}
${content1
  .split("\n")
  .map((line) => `////${line}`)
  .join("\n")}

// @wrap: ${wrap2}
// @filename: ${fileName2}
////${content2}
`;

    const file = parseHarnessTest(commands, "test.ts", {
      wrappers: {
        main: (content) => content,
        main2: (content) => content,
      },
    });

    const file1 = file.files.get(fileName1);
    const file2 = file.files.get(fileName2);

    expect(file1).toBeDefined();
    expect(file2).toBeDefined();

    expect(file1?.content).toBe(content1);
    expect(file2?.content).toBe(content2);

    expect(file1?.wrap).toBe(wrap1);
    expect(file2?.wrap).toBe(wrap2);

    expect(file.commands).toBe(commands);
    expect(file.fileName).toBe("test.ts");
  });

  test("should wrap a file in a wrapper", () => {
    const commands = `
/// <reference path="../framework.ts" />

// @wrap: main
// @filename: main.pli
////MY CONTENT
`;

    const file = parseHarnessTest(commands, "test.ts", {
      wrappers: {
        main: (content) => `WRAP_BEGIN ${content} WRAP_END`,
      },
    });

    const mainFile = file.files.get("main.pli");

    expect(mainFile).toBeDefined();
    expect(mainFile?.wrap).toBe("main");
    expect(mainFile?.content).toBe(`WRAP_BEGIN MY CONTENT WRAP_END`);
  });

  test("should parse a wrapper file", () => {
    const wrapFileContent = `////WRAP_BEGIN <...> WRAP_END`;
    const wrapper = parseWrapperFile(wrapFileContent);

    expect(wrapper("MY CONTENT")).toBe("WRAP_BEGIN MY CONTENT WRAP_END");
  });
});
