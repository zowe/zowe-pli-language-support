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
import { describe, test, expect, beforeEach } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";
import { setFilePath } from "../../src/preprocessor/instruction-interpreter";
import {
  VirtualFileSystemProvider,
  setFileSystemProvider,
} from "../../src/workspace/file-system-provider";
import {
  PluginConfigurationProvider,
  setPluginConfigurationProvider,
} from "../../src/workspace/plugin-configuration-provider";
import { URI } from "../../src/utils/uri";
import path from "path";

describe("setFilePath", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;
  let context: any;
  let item: { filePath: string | null; relativeFilePath: string | null };
  let workspaceRoot: string;

  beforeEach(async () => {
    item = { filePath: null, relativeFilePath: null };
    vfs = new VirtualFileSystemProvider();
    pluginConfig = new PluginConfigurationProvider();
    setFileSystemProvider(vfs);
    setPluginConfigurationProvider(pluginConfig);

    workspaceRoot = path.resolve("/workspace");
    await pluginConfig.init(workspaceRoot);

    context = null;
  });

  test("returns absolute path when target file resolves to absolute (outside workspace rules)", async () => {
    const absolutePath = path.resolve("/absolute-folder/absolute.pli");
    await vfs.writeFile(URI.file(absolutePath), "DECLARE VARC FIXED;");
    const doc = TextDocument.create(
      URI.file(absolutePath).toString(),
      "pli",
      1,
      "DECLARE VARC FIXED;",
    );
    context = { currentUri: URI.parse(doc.uri) };

    setFilePath(item, doc.uri, context);

    const expected = URI.file(absolutePath).path;
    expect(item.relativeFilePath).toBe(expected);
  });

  test("returns './file.pli' when file is directly under workspace root", async () => {
    const relPath = path.join(workspaceRoot, "relative.pli");
    await vfs.writeFile(URI.file(relPath), "DECLARE VARC FIXED;");
    const doc = TextDocument.create(
      URI.file(relPath).toString(),
      "pli",
      1,
      "DECLARE VARC FIXED;",
    );
    context = { currentUri: URI.parse(doc.uri) };

    setFilePath(item, doc.uri, context);

    expect(item.relativeFilePath).toBe("./relative.pli");
  });

  test("returns './nested/file.pli' for a nested file in workspace", async () => {
    const nestedPath = path.join(
      workspaceRoot,
      "nested",
      "relative-nested.pli",
    );
    await vfs.writeFile(URI.file(nestedPath), "DECLARE VARC FIXED;");
    const doc = TextDocument.create(
      URI.file(nestedPath).toString(),
      "pli",
      1,
      "DECLARE VARC FIXED;",
    );
    context = { currentUri: URI.parse(doc.uri) };

    setFilePath(item, doc.uri, context);

    expect(item.relativeFilePath).toBe("./nested/relative-nested.pli");
  });
});
