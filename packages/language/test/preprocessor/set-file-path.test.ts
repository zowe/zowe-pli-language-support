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

describe("setFilePath", () => {
  let vfs: VirtualFileSystemProvider;
  let pluginConfig: PluginConfigurationProvider;

  let context: any;
  let item: { filePath: string | null; relativeFilePath: string | null };

  beforeEach(async () => {
    item = { filePath: null, relativeFilePath: null };

    vfs = new VirtualFileSystemProvider();
    pluginConfig = new PluginConfigurationProvider();

    setFileSystemProvider(vfs);
    setPluginConfigurationProvider(pluginConfig);

    if (["darwin", "linux", "win32"].includes(process.platform)) {
      await pluginConfig.init("/workspace");
    } else if (process.platform === "win32") {
      await pluginConfig.init("C:\\workspace");
    }
    context = null;
  });

  test.runIf(["darwin", "linux", "win32"].includes(process.platform))(
    "returns absolute path when target file resolves to absolute (outside workspace rules)",
    async () => {
      const absolutePath = "/Users/mockUser/Desktop/anotherfolder/absolute.pli";
      await vfs.writeFile(URI.parse(absolutePath), " DECLARE VARC FIXED;");

      const doc = TextDocument.create(
        URI.file(absolutePath).toString(),
        "pli",
        1,
        " DECLARE VARC FIXED;",
      );
      context = { currentUri: URI.parse(doc.uri) };
      setFilePath(item, doc.uri, context);

      expect(item.relativeFilePath).toBe(
        "/Users/mockUser/Desktop/anotherfolder/absolute.pli",
      );
    },
  );

  test.runIf(process.platform === "win32")(
    "returns absolute path when target file resolves to absolute (outside workspace rules)",
    async () => {
      const absolutePath =
        "C:\\Users\\mockUser\\Desktop\\anotherfolder\\absolute.pli";
      await vfs.writeFile(URI.parse(absolutePath), " DECLARE VARC FIXED;");

      const doc = TextDocument.create(
        URI.file(absolutePath).toString(),
        "pli",
        1,
        " DECLARE VARC FIXED;",
      );
      context = { currentUri: URI.parse(doc.uri) };
      setFilePath(item, doc.uri, context);

      expect(item.relativeFilePath).toBe(
        "C:\\Users\\mockUser\\Desktop\\anotherfolder\\absolute.pli",
      );
    },
  );

  test("returns './file.pli' when file is directly under workspace root", async () => {
    const relPath = "/workspace/relative.pli";
    await vfs.writeFile(URI.parse(relPath), " DECLARE VARC FIXED;");

    const doc = TextDocument.create(
      URI.file(relPath).toString(),
      "pli",
      1,
      " DECLARE VARC FIXED;",
    );
    context = { currentUri: URI.parse(doc.uri) };
    setFilePath(item, doc.uri, context);

    expect(item.relativeFilePath).toBe("./relative.pli");
  });

  test("returns './nested/file.pli' for a nested file in workspace", async () => {
    const nestedPath = "/workspace/nested/relative-nested.pli";
    await vfs.writeFile(URI.parse(nestedPath), " DECLARE VARC FIXED;");

    const doc = TextDocument.create(
      URI.file(nestedPath).toString(),
      "pli",
      1,
      " DECLARE VARC FIXED;",
    );
    context = { currentUri: URI.parse(doc.uri) };
    setFilePath(item, doc.uri, context);

    expect(item.relativeFilePath).toBe("./nested/relative-nested.pli");
  });
});
