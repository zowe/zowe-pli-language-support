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
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Diagnostic } from "vscode-languageserver-types";
import * as applyQuickFixes from "../../src/language-server/code-actions/apply-quick-fixes";
import { FileSystemProviderInstance } from "../../src/workspace/file-system-provider";
import {
  deserializeProcessGroup,
  PluginConfigurationProviderInstance,
} from "../../src/workspace/plugin-configuration-provider";
import { URI, UriUtils } from "../../src/utils/uri";

// Mock dependencies
vi.mock("../../workspace/file-system-provider");
vi.mock("../../workspace/plugin-configuration-provider");
vi.mock("../../utils/uri");
const mockConfig = deserializeProcessGroup({
  name: "default",
  "include-extensions": [".inc"],
  libs: [],
});

describe("quickFixResolveInclude", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should return undefined when no unresolved file in diagnostic", async () => {
    const diagnostic = { data: {} } as Diagnostic;

    PluginConfigurationProviderInstance.getProcessGroupConfig = vi
      .fn()
      .mockReturnValue(mockConfig);
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("should return undefined when no process group config", async () => {
    const diagnostic = { data: { unresolvedFile: "some/file" } } as Diagnostic;
    PluginConfigurationProviderInstance.getProcessGroupConfig = vi
      .fn()
      .mockReturnValue(undefined);

    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("should return undefined when file not found", async () => {
    const diagnostic = {
      data: { unresolvedFile: "missing/file" },
    } as Diagnostic;

    PluginConfigurationProviderInstance.getProcessGroupConfig = vi
      .fn()
      .mockReturnValue(mockConfig);
    FileSystemProviderInstance.search = vi.fn().mockResolvedValue(undefined);

    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);
    expect(result).toBeUndefined();
  });

  test("should return code action when all conditions are met", async () => {
    const diagnostic = {
      data: { unresolvedFile: "some/file.inc" },
    } as Diagnostic;
    PluginConfigurationProviderInstance.getProcessGroupConfig = vi
      .fn()
      .mockReturnValue(mockConfig);
    FileSystemProviderInstance.search = vi
      .fn()
      .mockReturnValue(URI.parse("/workspace/some/file.inc"));
    PluginConfigurationProviderInstance.getWorkspacePath = vi
      .fn()
      .mockReturnValue("workspace/");
    const result = await applyQuickFixes.quickFixResolveInclude(diagnostic);

    expect(result).toBeDefined();
    expect(result!.title).toBe("Add 'some' to INCLUDE libs");
    expect(result!.kind).toBe("quickfix");
    expect(result!.command!.command).toBe("pli.applyIncludeFix");
  });
});

describe("applyQuickFixes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should return code actions only for IBM3841IS diagnostics", async () => {
    const diagnostics = [
      { code: "IBM3841IS", data: { unresolvedFile: "file1" } } as Diagnostic,
      { code: "IBM3842IS", data: {} } as Diagnostic,
      { code: "IBM3841IS", data: { unresolvedFile: "file2" } } as Diagnostic,
    ];
    FileSystemProviderInstance.search = vi
      .fn()
      .mockReturnValueOnce(URI.parse("/workspace/some/file1.inc"))
      .mockReturnValueOnce(URI.parse("/workspace/some/file2.inc"));

    vi.spyOn(UriUtils, "joinPath").mockReturnValue(
      URI.parse("/workspace/proc-groups.json"),
    );

    PluginConfigurationProviderInstance.getProcessGroupConfig = vi
      .fn()
      .mockReturnValue(mockConfig);
    PluginConfigurationProviderInstance.getWorkspacePath = vi
      .fn()
      .mockReturnValue("workspace/");

    const resultApplyQuickFixes =
      await applyQuickFixes.applyQuickFixes(diagnostics);
    expect(resultApplyQuickFixes).toHaveLength(2);
  });

  test("should return undefined when no IBM3841IS diagnostics", async () => {
    const diagnostics = [
      { code: "IBM3842IS" } as Diagnostic,
      { code: "IBM3844IS" } as Diagnostic,
    ];

    const result = await applyQuickFixes.applyQuickFixes(diagnostics);
    expect(result).toBeUndefined();
  });
});
