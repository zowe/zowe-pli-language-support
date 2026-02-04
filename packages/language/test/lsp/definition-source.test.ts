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
  setFileSystemProvider,
  VirtualFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import {
  deserializeProcessGroup,
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { URI } from "../../src/utils/uri";
import { parseAndLink } from "../utils";
import { definitionRequest } from "../../src/language-server/definition-request";

let vfs: VirtualFileSystemProvider;
let pluginConfig: PluginConfigurationProvider;

async function setupIncludes(path: string, libEntry: string): Promise<void> {
  vfs = new VirtualFileSystemProvider();
  pluginConfig = new PluginConfigurationProvider();
  setFileSystemProvider(vfs);
  setPluginConfigurationProvider(pluginConfig);

  const pathUri = URI.file(path);
  await vfs.writeFile(pathUri, "");

  await pluginConfig.init("/workspace");

  // Base config setup
  const processGroup = deserializeProcessGroup({
    name: "default",
    "include-extensions": [".pli"],
    libs: [libEntry],
  });

  await pluginConfig.setProcessGroupConfigs([processGroup]);
  pluginConfig.setProgramConfigs("/workspace", [
    { program: "*.pli", pgroup: "default" },
  ]);
}

describe("Definition Source Ranges", () => {
  test("Include source range on strings", async () => {
    await setupIncludes("/workspace/lib/included.pli", "/workspace/lib/");
    const code = ' %INCLUDE "included.pli";';
    const index = code.indexOf("included.pli");
    const uri = URI.file("/workspace/main.pli");
    const unit = await parseAndLink(code, {
      uri,
    });
    const definitions = definitionRequest(unit, uri, index);
    expect(definitions).toHaveLength(1);
    const def = definitions[0];
    expect(def.source).toBeDefined();
    // Should start with the opening quote character
    expect(def.source?.start).toBe(index - 1);
    // Should end with the closing quote character
    expect(def.source?.end).toBe(index + "included.pli".length + 1);
  });

  test("Include source range on members", async () => {
    await setupIncludes("/workspace/lib/A.B.C(test).pli", "/workspace/lib");
    const code = " %INCLUDE A.B.C(test);";
    const index = code.indexOf("A.B.C(test)");
    const uri = URI.file("/workspace/main.pli");
    const unit = await parseAndLink(code, {
      uri,
    });
    const definitions = definitionRequest(unit, uri, index);
    expect(definitions).toHaveLength(1);
    const def = definitions[0];
    expect(def.source).toBeDefined();
    // Should start at the beginning of the member
    expect(def.source?.start).toBe(index);
    // Should end at the end of the member
    expect(def.source?.end).toBe(index + "A.B.C(test)".length);
  });

  test("Include source range on simple names", async () => {
    await setupIncludes("/workspace/lib/simple.pli", "/workspace/lib/");
    const code = " %INCLUDE simple;";
    const index = code.indexOf("simple");
    const uri = URI.file("/workspace/main.pli");
    const unit = await parseAndLink(code, {
      uri,
    });
    const definitions = definitionRequest(unit, uri, index);
    expect(definitions).toHaveLength(1);
    const def = definitions[0];
    expect(def.source).toBeDefined();
    // Should start at the beginning of the name
    expect(def.source?.start).toBe(index);
    // Should end at the end of the name
    expect(def.source?.end).toBe(index + "simple".length);
  });
});
