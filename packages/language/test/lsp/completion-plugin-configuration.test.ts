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

import { beforeEach, describe, expect, test } from "vitest";
import { UriUtils, URI } from "../../src/utils/uri";
import {
  PluginConfigurationProvider,
  deserializeProcessGroup,
} from "../../src/workspace/plugin-configuration-provider";
import { WorkspaceContext } from "../../src/workspace/workspace-context";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { PluginConfiguration } from "../../src/language-server/constants";
import { configCompletionRequest } from "../../src/language-server/completion/completion-plugin-configuration";

let vfs: VirtualFileSystemProvider;
let pluginConfig: PluginConfigurationProvider;
let workspace: WorkspaceContext;
const MARKER = "<CURSOR>";

function pgmConfigUri(): URI {
  return UriUtils.joinPath(
    workspace.config.getWorkspacePath(),
    PluginConfiguration.PROGRAM_FILE_PATH,
  );
}
function processGroupUri(): URI {
  return UriUtils.joinPath(
    workspace.config.getWorkspacePath(),
    PluginConfiguration.PROCESS_GROUP_FILE_PATH,
  );
}
function fromMarker(textWithMarker: string): {
  text: string;
  offset: number;
} {
  const offset = textWithMarker.indexOf(MARKER);
  if (offset === -1) {
    throw new Error("Marker not found in provided text");
  }
  const text = textWithMarker.replace(MARKER, "");
  return { text, offset };
}

beforeEach(async () => {
  // Reset in-memory providers
  vfs = new VirtualFileSystemProvider();
  workspace = new WorkspaceContext(vfs);
  pluginConfig = workspace.config;

  // Base config setup
  const processGroup = [
    deserializeProcessGroup({
      name: "default",
      "include-extensions": [".inc"],
      libs: [],
    }),
  ];
  await pluginConfig.init(UriUtils.toUri("/workspace"));
  await pluginConfig.setProcessGroupConfigs(processGroup);
});

describe("configCompletionRequest", () => {
  test("returns all process group names when cursor is inside an empty pgroup value", () => {
    const mockPgmConf = `{
            "pgms": [
                { "program": "*.pli", "pgroup": "${MARKER}" }
            ]
        }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    const expected = pluginConfig.getProcessGroupNames();
    expect(result).toHaveLength(expected.length);
    expect(result.map((completion) => completion.label)).toEqual(expected);
  });
  test("returns items with edit range covering existing typed text", () => {
    const stringFragment = "def";
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "${stringFragment}<CURSOR>" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    const expectedStart = text.indexOf(stringFragment);
    const expectedEnd = expectedStart + stringFragment.length;
    for (const completion of result) {
      expect(completion.edit.range).toEqual({
        start: expectedStart,
        end: expectedEnd,
      });
      expect(completion.edit.text).toEqual(completion.label);
    }
  });
  test("returns [] when cursor is inside the property key", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgr<CURSOR>oup": "" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    expect(result).toHaveLength(0);
  });
  test("returns [] when cursor is inside a non-pgroup property value", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*<CURSOR>.pli", "pgroup": "" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    expect(result).toHaveLength(0);
  });
  test("returns [] when cursor is in whitespace between properties", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli",<CURSOR> "pgroup": "" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    expect(result).toHaveLength(0);
  });
  test("returns [] when URI is proc_grps.json", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "<CURSOR>" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      processGroupUri(),
    );
    expect(result).toHaveLength(0);
  });
  test("returns all groups when many process groups are loaded", async () => {
    const processGroups = [
      deserializeProcessGroup({
        name: "default",
        "include-extensions": [".inc"],
        libs: [],
      }),
      deserializeProcessGroup({
        name: "completion-test",
        "include-extensions": [".inc"],
        libs: [],
      }),
      deserializeProcessGroup({
        name: "completion-test-2",
        "include-extensions": [".inc"],
        libs: [],
      }),
      deserializeProcessGroup({
        name: "completion-test-3",
        "include-extensions": [".inc"],
        libs: [],
      }),
      deserializeProcessGroup({
        name: "completion-test-4",
        "include-extensions": [".inc"],
        libs: [],
      }),
    ];
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "<CURSOR>" }] }`;
    await pluginConfig.setProcessGroupConfigs(processGroups);

    const { text, offset } = fromMarker(mockPgmConf);
    const expected = pluginConfig.getProcessGroupNames();
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    expect(result).toHaveLength(expected.length);
    expect(result.map((completion) => completion.label)).toEqual(expected);
  });
  test("returns [] when no process groups are loaded", async () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "<CURSOR>" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    await pluginConfig.setProcessGroupConfigs([]);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    expect(result).toHaveLength(0);
  });
});
