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
import { CompletionItemKind } from "vscode-languageserver-types";
import { UriUtils, URI } from "../../src/utils/uri";
import {
  PluginConfigurationProvider,
  deserializeProcessGroup,
} from "../../src/workspace/plugin-configuration-provider";
import { WorkspaceContext } from "../../src/workspace/workspace-context";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { PluginConfiguration } from "../../src/language-server/constants";
import { configCompletionRequest } from "../../src/language-server/completion/completion-plugin-configuration";
import { TestGlobalConfigLoader } from "../../src";

const MARKER = "<CURSOR>";
const PGROUP_DETAIL = "Process group from 'proc_grps.json'";

let vfs: VirtualFileSystemProvider;
let pluginConfig: PluginConfigurationProvider;
let workspace: WorkspaceContext;

function pgmConfigUri(): URI {
  return UriUtils.joinPath(
    workspace.config.requireWorkspaceUri(),
    PluginConfiguration.PROGRAM_FILE_PATH,
  );
}

function processGroupUri(): URI {
  return UriUtils.joinPath(
    workspace.config.requireWorkspaceUri(),
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

function makeProcessGroup(name: string) {
  return deserializeProcessGroup({
    name,
    "include-extensions": [".inc"],
    libs: [],
  });
}

beforeEach(async () => {
  const uri = UriUtils.toUri("/workspace");
  vfs = new VirtualFileSystemProvider();
  workspace = new WorkspaceContext(vfs, new TestGlobalConfigLoader({}));
  pluginConfig = workspace.config;

  await pluginConfig.init(uri);
  await pluginConfig.setProcessGroupConfigs([makeProcessGroup("default")]);
});

describe("configCompletionRequest", () => {
  test("suggests groups when cursor is inside an empty pgroup value", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "${MARKER}" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);

    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );

    const emptyValueStart = text.indexOf(`""`);
    const emptyValueEnd = emptyValueStart + 2;
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      label: "default",
      kind: CompletionItemKind.Value,
      detail: PGROUP_DETAIL,
      filterText: `"default"`,
      edit: {
        range: { start: emptyValueStart, end: emptyValueEnd },
        text: `"default"`,
      },
    });
  });

  test("suggests groups when cursor is inside a partial pgroup value (replaces the whole string node, quotes included)", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "def${MARKER}" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);

    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );

    const stringNodeStart = text.indexOf(`"def"`);
    const stringNodeEnd = stringNodeStart + `"def"`.length;
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      label: "default",
      kind: CompletionItemKind.Value,
      detail: PGROUP_DETAIL,
      filterText: `"default"`,
      edit: {
        range: { start: stringNodeStart, end: stringNodeEnd },
        text: `"default"`,
      },
    });
  });

  test("suggests groups when cursor is right after the colon with no pgroup value yet (not even quotes)", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup":${MARKER} }] }`;
    const { text, offset } = fromMarker(mockPgmConf);

    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      label: "default",
      kind: CompletionItemKind.Value,
      detail: PGROUP_DETAIL,
      filterText: `"default"`,
      edit: {
        range: { start: offset, end: offset },
        text: `"default"`,
      },
    });
  });

  test("suggests groups when cursor is in whitespace before an existing pgroup value", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": ${MARKER}"oldvalue" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);

    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );

    const existingValueStart = text.indexOf(`"oldvalue"`);
    const existingValueEnd = existingValueStart + `"oldvalue"`.length;
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      label: "default",
      kind: CompletionItemKind.Value,
      detail: PGROUP_DETAIL,
      filterText: `"default"`,
      edit: {
        range: { start: existingValueStart, end: existingValueEnd },
        text: `"default"`,
      },
    });
  });

  test("returns [] when cursor is inside the property key", () => {
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgr${MARKER}oup": "" }] }`;
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
    const mockPgmConf = `{ "pgms": [{ "program": "*${MARKER}.pli", "pgroup": "" }] }`;
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
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli",${MARKER} "pgroup": "" }] }`;
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
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "${MARKER}" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      processGroupUri(),
    );
    expect(result).toHaveLength(0);
  });

  test("returns all loaded process groups, in load order, when many are configured", async () => {
    await pluginConfig.setProcessGroupConfigs([
      makeProcessGroup("default"),
      makeProcessGroup("completion-test"),
      makeProcessGroup("completion-test-2"),
      makeProcessGroup("completion-test-3"),
      makeProcessGroup("completion-test-4"),
    ]);

    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "${MARKER}" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );

    expect(result).toHaveLength(5);
    expect(result.map((completion) => completion.label)).toEqual([
      "default",
      "completion-test",
      "completion-test-2",
      "completion-test-3",
      "completion-test-4",
    ]);
    for (const completion of result) {
      expect(completion.filterText).toEqual(`"${completion.label}"`);
      expect(completion.edit.text).toEqual(`"${completion.label}"`);
    }
  });

  test("returns [] when no process groups are loaded", async () => {
    await pluginConfig.setProcessGroupConfigs([]);
    const mockPgmConf = `{ "pgms": [{ "program": "*.pli", "pgroup": "${MARKER}" }] }`;
    const { text, offset } = fromMarker(mockPgmConf);
    const result = configCompletionRequest(
      pluginConfig,
      text,
      offset,
      pgmConfigUri(),
    );
    expect(result).toHaveLength(0);
  });
});
