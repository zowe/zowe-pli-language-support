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
import { Diagnostic as LspDiagnostic } from "vscode-languageserver-types";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { PluginConfigurationProvider } from "../../src/workspace/plugin-configuration-provider";
import { WorkspaceContext } from "../../src/workspace/workspace-context";
import { UriUtils } from "../../src/utils/uri";
import { PluginConfiguration } from "../../src/language-server/constants";
import { MultiMap } from "../../src/utils/collections";
import { resetDocumentProviders } from "../../src/language-server/text-documents";

const WORKSPACE_PATH = UriUtils.toUri("/workspace");
const PGM_CONF_URI = UriUtils.joinPath(
  WORKSPACE_PATH,
  PluginConfiguration.PROGRAM_FILE_PATH,
);
const PROC_GRPS_URI = UriUtils.joinPath(
  WORKSPACE_PATH,
  PluginConfiguration.PROCESS_GROUP_FILE_PATH,
);

const UNKNOWN_PGROUP_CODE = "COPC04E";

let vfs: VirtualFileSystemProvider;
let workspace: WorkspaceContext;
let pluginConfig: PluginConfigurationProvider;

beforeEach(() => {
  vfs = new VirtualFileSystemProvider();
  workspace = new WorkspaceContext(vfs);
  pluginConfig = workspace.config;
  resetDocumentProviders(vfs);
});

function writePgmConf(content: object): Promise<void> {
  return vfs.writeFile(PGM_CONF_URI, JSON.stringify(content, null, 2));
}

function writeProcGrps(content: object): Promise<void> {
  return vfs.writeFile(PROC_GRPS_URI, JSON.stringify(content, null, 2));
}

/**
 * Helper to fetch only the UnknownProcessGroup (COPC04E) diagnostics
 * for pgm_conf.json from the diagnostics map returned by `init`.
 *
 * We filter by code so tests aren't sensitive to unrelated diagnostics
 * (e.g. parse errors, unresolved libs) that the same file might also
 * accumulate in scenarios we don't care about.
 */
function unknownPgroupDiagsFor(
  diagnostics: MultiMap<string, LspDiagnostic>,
): LspDiagnostic[] {
  const entries = diagnostics.get(PGM_CONF_URI.toString()) ?? [];
  return entries.filter((d) => d.code === UNKNOWN_PGROUP_CODE);
}

/**
 * Note on test scope:
 *
 * The behavioral matrix for this diagnostic (happy path, multiple
 * offenders, empty value, suppression when proc_grps has zero groups,
 * and that the squiggle attaches to pgm_conf.json) now lives as
 * end-to-end fourslash tests under
 * `test/fourslash/validate/unknown-pgroup-*.ts` (diagnostics) and
 * `test/fourslash/quick-fixes/unknown-process-group/*.ts` (quick fixes).
 *
 * What remains here is what the fourslash harness can't express:
 *  - the suppression rule when proc_grps.json is missing entirely: the
 *    test harness always synthesizes a default proc_grps.json when a test
 *    doesn't supply one, so a physically absent file can't be simulated, and
 *  - the reload lifecycle (reloadConfigurations), which has no harness
 *    equivalent.
 */
describe("UnknownProcessGroup diagnostic (COPC04) — provider integration", () => {
  test("suppression rule: when proc_grps.json is missing entirely, no UnknownProcessGroup diagnostics are emitted", async () => {
    // Even though every program reference is technically unresolved, we
    // suppress to avoid piling per-program noise on top of the more
    // fundamental problem (the proc_grps file is gone).
    await writePgmConf({
      pgms: [
        { program: "a.pli", pgroup: "default" },
        { program: "b.pli", pgroup: "anything" },
      ],
    });
    // Note: no writeProcGrps() call — file does not exist in the VFS.

    const diagnostics = await pluginConfig.init(WORKSPACE_PATH);

    expect(unknownPgroupDiagsFor(diagnostics)).toEqual([]);
  });

  test("regression: renaming a pgroup in proc_grps.json orphans the existing pgm_conf reference on reload", async () => {
    // This is the bug the new diagnostic exists for. The user had a valid
    // config; they renamed a group in proc_grps.json; their pgm_conf is
    // now silently broken. Re-validation on reload must catch it.
    await writePgmConf({
      pgms: [{ program: "a.pli", pgroup: "default" }],
    });
    await writeProcGrps({
      pgroups: [{ name: "default", "compiler-options": [], libs: [] }],
    });

    // First load — valid, nothing to flag.
    const initial = await pluginConfig.init(WORKSPACE_PATH);
    expect(unknownPgroupDiagsFor(initial)).toEqual([]);

    // User renames "default" → "main" in proc_grps.json, doesn't touch
    // pgm_conf.json. Reload.
    await writeProcGrps({
      pgroups: [{ name: "main", "compiler-options": [], libs: [] }],
    });
    const afterRename = await pluginConfig.reloadConfigurations();
    const found = unknownPgroupDiagsFor(afterRename);

    expect(found).toHaveLength(1);
    expect(found[0].message).toBe(`Unknown process group 'default'.`);
  });

  test("regression: fixing the offending pgroup value clears the diagnostic on reload", async () => {
    // The mirror image of the previous test — proves the diagnostic is
    // not sticky. If we ever introduce caching that fails to invalidate
    // on reload, this test will catch it.
    await writePgmConf({
      pgms: [{ program: "a.pli", pgroup: "doesnotexist" }],
    });
    await writeProcGrps({
      pgroups: [{ name: "default", "compiler-options": [], libs: [] }],
    });

    const initial = await pluginConfig.init(WORKSPACE_PATH);
    expect(unknownPgroupDiagsFor(initial)).toHaveLength(1);

    // User fixes the typo.
    await writePgmConf({
      pgms: [{ program: "a.pli", pgroup: "default" }],
    });
    const afterFix = await pluginConfig.reloadConfigurations();

    expect(unknownPgroupDiagsFor(afterFix)).toEqual([]);
  });
});
