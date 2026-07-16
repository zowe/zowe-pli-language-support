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
import { resetDocumentProviders } from "../../src/language-server/text-documents";

describe("Multi Workspace Tests", () => {
  test("Example Test", async () => {
    const fs = new VirtualFileSystemProvider();
    resetDocumentProviders(fs);
    const ch = new CompilationUnitHandler(fs);

    const first = {
      programConfig: UriUtils.toUri("file:///first/.pliplugin/pgm_conf.json"),
      groupsConfig: UriUtils.toUri("file:///first/.pliplugin/proc_grps.json"),
      program: UriUtils.toUri("file:///first/test1.pli"),
    };
    const second = {
      programConfig: UriUtils.toUri("file:///second/.pliplugin/pgm_conf.json"),
      groupsConfig: UriUtils.toUri("file:///second/.pliplugin/proc_grps.json"),
      program: UriUtils.toUri("file:///second/test2.pli"),
    };

    await fs.writeFile(first.programConfig, JSON.stringify({
      "pgms": [
        {
          "program": "*.pli",
          "pgroup": "xxx"
        }
      ]
    }));
    await fs.writeFile(first.groupsConfig, JSON.stringify({
      "pgroups": [
        {
          "name": "xxx",
          "compiler-options": [
            "AGGREGATE",
            "MARGINS(2,72)"
          ],
          "member-name-validation": true,
          "libs": [
            "cpy"
          ],
          "include-extensions": [
            ".pli",
            ".cpy",
            ".inc"
          ]
        }
      ]
    }));
    await fs.writeFile(first.program, "/* test1 */");
    await fs.writeFile(second.programConfig, JSON.stringify({
      "pgms": [
        {
          "program": "*.pli",
          "pgroup": "yyy"
        }
      ]
    }));
    await fs.writeFile(second.groupsConfig, JSON.stringify({
      "pgroups": [
        {
          "name": "yyy",
          "compiler-options": [
            "MARGINS(20,100)"
          ],
          "member-name-validation": true,
          "libs": [
            "cpy"
          ],
          "include-extensions": [
            ".pli",
            ".cpy",
            ".inc"
          ]
        }
      ]
    }));
    await fs.writeFile(second.program, "/* test2 */");

    const firstWorkspace = await ch.initializeWorkspaceFolder("file:///first");
  // const secondWorkspace = await ch.initializeWorkspaceFolder("file:///second");
    
    expect(firstWorkspace.config.hasProgramConfig(first.program)).toBeTruthy(); 
  });
});