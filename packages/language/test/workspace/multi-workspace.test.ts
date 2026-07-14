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
import { CompilationUnitHandler } from "../../src/workspace/compilation-unit";
import { UriUtils, VirtualFileSystemProvider } from "../../src";
import { makeProcessGroup } from "../config-fixtures";
import { ProcessGroup } from "../../src/config/schema";

describe("Multi Workspace Tests", () => {
  test("Example Test", async () => {
    const fs = new VirtualFileSystemProvider();
    const ch = new CompilationUnitHandler(fs);
    const firstWorkspace = await ch.initializeWorkspaceFolder("file:///first");
    const secondWorkspace = await ch.initializeWorkspaceFolder("file:///second");
    await firstWorkspace.config.setProcessGroupConfigs([
      createProcessGroup("default", ["cpy"]),
    ]);
    await secondWorkspace.config.setProcessGroupConfigs([
      createProcessGroup("default", ["lib"]),
    ]);

    const firstMainUri = UriUtils.joinPath(firstWorkspace.uri, "main.pli");
    const firstWrongUri = UriUtils.joinPath(firstWorkspace.uri, "wrong", "xxx.pli");
    await fs.writeFile(firstMainUri, "");
    await fs.writeFile(firstWrongUri, "");
    await (new Promise((resolve) => setTimeout(resolve, 500))); // Wait for the file system to update
    expect(await ch.getOrCreateCompilationUnit(firstMainUri)).toBeDefined();
  });
});

function createProcessGroup(name: string, libs: string[]): ProcessGroup {
  return makeProcessGroup({
    name,
    libs,
    includeExtensions: [".inc"],
    checkMargins: false,
    instructionCounterLimit: 5000,
    caseUpperValidation: false,
  });
}