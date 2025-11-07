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
import { URI } from "../../src/utils/uri";
import {
  FileSystemProviderInstance,
  setFileSystemProvider,
  VirtualFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import {
  PluginConfigurationProviderInstance,
  ProcessGroup,
} from "../../src/workspace/plugin-configuration-provider";

describe("Plugin Configuration Tests", () => {
  beforeEach(() => {
    const vfs: VirtualFileSystemProvider = new VirtualFileSystemProvider();
    setFileSystemProvider(vfs);
  });

  afterEach(async () => {
    PluginConfigurationProviderInstance.setProgramConfigs("", []);
    await PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
    setFileSystemProvider(undefined);
  });

  /**
   * Helper function to create a process group configuration with default values
   */
  function createProcessGroup(name: string, libs: string[]): ProcessGroup {
    return {
      name,
      compilerOptions: [],
      libs,
      $computedLibs: [],
      $computedLibsSet: new Set<string>(),
      includeExtensions: [".inc"],
      lspOptions: { checkMargins: false },
      pliOptions: {},
      implicitBuiltins: new Set(),
    };
  }

  test("No libs produce no diagnostics", async () => {
    await PluginConfigurationProviderInstance.init("file:///");

    // set up a process group with no libs
    const diagnostics =
      await PluginConfigurationProviderInstance.setProcessGroupConfigs([
        createProcessGroup("default", []),
      ]);

    expect(diagnostics).toEqual([]);
  });

  test("Valid libs produce no diagnostics", async () => {
    await PluginConfigurationProviderInstance.init("file:///");

    // create a virtual directory to satisfy the subsequent libs check
    await FileSystemProviderInstance.writeFile(
      URI.parse("file:///libs/existing/dummy.pli"),
      "",
    );

    // set up a process group w/ a libs entry that exists
    const diagnostics =
      await PluginConfigurationProviderInstance.setProcessGroupConfigs([
        createProcessGroup("default", ["libs/existing"]),
      ]);

    expect(diagnostics).toEqual([]);
  });

  test("Invalid libs produce diagnostics", async () => {
    await PluginConfigurationProviderInstance.init("file:///");

    // populate the virtual file system with at least one file so it's not empty
    await FileSystemProviderInstance.writeFile(
      URI.parse("file:///dummy.pli"),
      "",
    );

    // set up a process group with a libs entry that does not exist
    const diagnostics =
      await PluginConfigurationProviderInstance.setProcessGroupConfigs([
        createProcessGroup("default", ["nonexistent-libs"]),
      ]);

    // should generate a diagnostic for the non-existing lib
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].code).toBe("COPC01");
    expect(diagnostics[0].message).toContain("nonexistent-libs");
    expect(diagnostics[0].severity).toBe(1); // err
  });

  test("Only invalid libs produce diagnostics, not valid ones", async () => {
    await PluginConfigurationProviderInstance.init("file:///");

    await FileSystemProviderInstance.writeFile(
      URI.parse("file:///libs/existing1/p1.pli"),
      "",
    );
    await FileSystemProviderInstance.writeFile(
      URI.parse("file:///libs/existing2/p2.pli"),
      "",
    );

    const diagnostics =
      await PluginConfigurationProviderInstance.setProcessGroupConfigs([
        createProcessGroup("default", [
          "libs/existing1",
          "libs/existing2",

          "invalid1",
          "invalid2",
        ]),
      ]);

    // expect diagnostics for the 2 invalid libs only
    expect(diagnostics).toHaveLength(2);

    const d0 = diagnostics[0];
    expect(d0.code).toBe("COPC01");
    expect(diagnostics.some((d) => d.message.includes("invalid1"))).toBe(true);

    const d1 = diagnostics[1];
    expect(d1.code).toBe("COPC01");
    expect(diagnostics.some((d) => d.message.includes("invalid2"))).toBe(true);
  });
});
