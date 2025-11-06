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

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  PluginConfigurationProviderInstance,
  ProcessGroup,
  ProgramConfig,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { URI } from "vscode-uri";
import { parse } from "../utils";
import {
  FileSystemProviderInstance,
  setFileSystemProvider,
  VirtualFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import { resetDocumentProviders } from "../../src/language-server/text-documents";
import { Diagnostic } from "vscode-languageserver-types";

/**
 * Helper to modify the program config & process group w/ a given lib for each os-specific test
 */
async function init(libPath: string): Promise<Diagnostic[]> {
  const programConfig: ProgramConfig = {
    program: "test.pli",
    pgroup: "testGroup",
    pliOptions: {},
  };
  const processGroupConfig: ProcessGroup = {
    name: "testGroup",
    compilerOptions: [],
    implicitBuiltins: new Set(),
    includeExtensions: [],
    libs: [libPath],
    $computedLibs: [],
    $computedLibsSet: new Set<string>(),
    lspOptions: { checkMargins: false },
    pliOptions: {},
  };

  await PluginConfigurationProviderInstance.init("/test");
  PluginConfigurationProviderInstance.setProgramConfigs("/test", [
    programConfig,
  ]);
  return await PluginConfigurationProviderInstance.setProcessGroupConfigs([
    processGroupConfig,
  ]);
}

/**
 * Helper for writing library files to the vfs
 */
async function writeLibFile(path: string, content: string): Promise<void> {
  await FileSystemProviderInstance.writeFile(URI.file(path), content);
}

/**
 * Expect tokens for a given workspace, by dictating the main file + lib files to create & test.
 * One compile unit will be generated from the main file, which will include the lib files as needed.
 * Note that this function does not clean up the vfs afterwards.
 *
 * @param mainFileContent Main file to build a compile unit from, name is fixed to /test/test.pli
 * @param libFiles Pairs of [path, content] entries to create lib files in the virtual file system
 * @param expectedTokens Expected array of tokens (by image) to be found in the resulting compile unit once done
 */
async function expectTokensForWorkspace(
  mainFileContent: string,
  libFiles: Array<[string, string]>,
  expectedTokens: string[],
): Promise<void> {
  for (const [path, content] of libFiles) {
    await writeLibFile(path, content);
  }

  // parse the main program
  const cu = await parse(mainFileContent, {
    validate: true,
    uri: URI.file("/test/test.pli"),
  });

  // ensure we have a clean result w/ the right tokens
  expect(cu.diagnostics.lexer).toHaveLength(0);
  expect(cu.diagnostics.parser).toHaveLength(0);
  const tokenImgs = cu.tokens.map((t) => t.image);
  expect(tokenImgs).toEqual(expectedTokens);
}

describe("Preprocessor Tests", () => {
  beforeEach(() => {
    const vfs = new VirtualFileSystemProvider();
    setFileSystemProvider(vfs);
    resetDocumentProviders();
  });

  afterEach(async () => {
    setFileSystemProvider(undefined);
    setPluginConfigurationProvider(undefined);
    PluginConfigurationProviderInstance.setProgramConfigs("", []);
    await PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
  });

  // macOS + linux absolute path resolution
  test.runIf(["darwin", "linux", "win32"].includes(process.platform))(
    "unix path resolution",
    async () => {
      await init("/test/libs");

      await expectTokensForWorkspace(
        ` %INCLUDE "lib.pli";`,
        [["/test/libs/lib.pli", ` DECLARE LIB_VAR FIXED;`]],
        ["DECLARE", "LIB_VAR", "FIXED", ";"],
      );

      // lib path should now exist, re-init to check for no diagnostics
      const diagnostics = await init("/test/libs");
      expect(diagnostics).toHaveLength(0);
    },
  );

  // tests win absolute path resolution w/ a drive letter
  test.runIf(process.platform === "win32")(
    "Windows path resolution",
    async () => {
      await init("C:/test/libs/");

      await expectTokensForWorkspace(
        ` %INCLUDE "lib.pli";`,
        [["C:/test/libs/lib.pli", ` DECLARE LIB_VAR FIXED;`]],
        ["DECLARE", "LIB_VAR", "FIXED", ";"],
      );

      // lib path should now exist, re-init to check for no diagnostics
      const diagnostics = await init("c:/test/libs");
      expect(diagnostics).toHaveLength(0);
    },
  );
});
