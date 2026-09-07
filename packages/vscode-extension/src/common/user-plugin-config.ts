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

import * as vscode from "vscode";
import { PluginConfiguration, UriUtils } from "pli-language";
import { notifyUserConfigAppended } from "../extension/user-settings";

const DEFAULT_PGROUP =
  PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT.pgms[0].pgroup;

/** Same shape as `ProgramEntry` / `PgmsConfig` in the language schema (not on the public export). */
interface ProgramEntry {
  program: string;
  pgroup: string;
}

interface PgmConf {
  pgms: ProgramEntry[];
}

interface ProcGrps {
  pgroups: Record<string, unknown>[];
}

/** Distinguishes first-time create (reveal settings) from a later append (toast). */
type UserPluginConfigResult = "created" | "appended" | "unchanged";

/**
 * `program` we write for this document. Local: `/a/b/c/hello.pli` (not
 * `file:///...`). Remote (e.g. Zowe): the full URI.
 */
export function programKeyForDocument(uri: vscode.Uri): string {
  return uri.scheme === "file"
    ? UriUtils.normalizePath(uri.fsPath)
    : uri.toString();
}

/**
 * True when the user has set `pli.pgm_conf` or `pli.proc_grps`.
 * `get()` cannot answer this: both keys contribute empty defaults.
 */
export function userPluginConfigExists(): boolean {
  const config = vscode.workspace.getConfiguration("pli");
  return (
    config.inspect("pgm_conf")?.globalValue !== undefined ||
    config.inspect("proc_grps")?.globalValue !== undefined
  );
}

/**
 * True when user-scope `pgm_conf` already lists this file. Exact key only
 * (not globs); used so a first-open prompt is not shown before the server
 * has loaded settings.
 */
export function userPluginConfigHasProgram(uri: vscode.Uri): boolean {
  const program = programKeyForDocument(uri);
  const pgmConf = readPgmConf(vscode.workspace.getConfiguration("pli"));
  return hasProgramEntry(pgmConf, program);
}

function readPgmConf(config: vscode.WorkspaceConfiguration): PgmConf {
  const value = config.inspect<Partial<PgmConf>>("pgm_conf")?.globalValue;
  const pgms = (Array.isArray(value?.pgms) ? value.pgms : []).filter(
    (entry): entry is ProgramEntry =>
      typeof entry?.program === "string" && typeof entry?.pgroup === "string",
  );
  return { ...value, pgms };
}

function readProcGrps(config: vscode.WorkspaceConfiguration): ProcGrps {
  const value = config.inspect<Partial<ProcGrps>>("proc_grps")?.globalValue;
  const pgroups = (Array.isArray(value?.pgroups) ? value.pgroups : []).filter(
    (group): group is Record<string, unknown> =>
      typeof group === "object" && group !== null,
  );
  return { ...value, pgroups };
}

/** Case-insensitive so the same file is not registered twice via a differently-cased path. */
function isSameProgram(a: string, b: string): boolean {
  return (
    UriUtils.normalizePath(a).toLowerCase() ===
    UriUtils.normalizePath(b).toLowerCase()
  );
}

function hasProgramEntry(pgmConf: PgmConf, program: string): boolean {
  return pgmConf.pgms.some((entry) => isSameProgram(entry.program, program));
}

/**
 * Writes `uri` into the user-scope plugin settings, creating them from plugin
 * defaults if needed. Uses `update()` so comments survive and the server
 * reloads. Does not apply glob matching — callers must have already asked
 * the language server.
 */
async function ensureUserPluginConfig(
  uri: vscode.Uri,
): Promise<UserPluginConfigResult> {
  const config = vscode.workspace.getConfiguration("pli");
  const existedBefore = userPluginConfigExists();
  const program = programKeyForDocument(uri);

  const pgmConf = readPgmConf(config);
  if (hasProgramEntry(pgmConf, program)) {
    return "unchanged";
  }

  const procGrps = readProcGrps(config);
  if (!procGrps.pgroups.some((group) => group.name === DEFAULT_PGROUP)) {
    // Same stub as `.pliplugin`, but drop `cpy`/`inc`: those are workspace-
    // relative and cannot resolve from user settings. Write this first so a
    // later pgm_conf failure can still retry without a missing `default` group.
    procGrps.pgroups.push(
      ...PluginConfiguration.DEFAULT_PROCESS_GROUP_FILE_CONTENT.pgroups.map(
        (group) => ({ ...group, libs: [] }),
      ),
    );
    await config.update(
      "proc_grps",
      procGrps,
      vscode.ConfigurationTarget.Global,
    );
  }

  pgmConf.pgms.push({ program, pgroup: DEFAULT_PGROUP });
  await config.update("pgm_conf", pgmConf, vscode.ConfigurationTarget.Global);

  return existedBefore ? "appended" : "created";
}

/**
 * Writes the user-scope plugin config for `uri` and offers to open settings
 * (copybook `libs` are empty in the user-scope stub). Returns `undefined`
 * if the write failed (error already shown).
 */
export async function applyUserPluginConfig(
  uri: vscode.Uri,
): Promise<UserPluginConfigResult | undefined> {
  try {
    const result = await ensureUserPluginConfig(uri);
    if (result === "created" || result === "appended") {
      await notifyUserConfigAppended(programKeyForDocument(uri));
    }
    return result;
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to update the PL/I user settings: ${error instanceof Error ? error.message : String(error)}`,
    );
    return undefined;
  }
}
