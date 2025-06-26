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

import * as path from "node:path";
import * as fs from "node:fs";
import { minimatch } from "minimatch";

/**
 * Process groups cache
 * This cache holds the latest process group configuration loaded from .pliplugin/proc_grps.json
 */
let cachedProcGrps: any = undefined;

/**
 * Program configs cache
 * This cache holds the list of program config 'program' entries (glob patterns) loaded from
 * .pliplugin/pgm_conf.json
 */
let cachedProgramConfigs: string[] = [];

/**
 * Caches the latest process group config from .pliplugin/proc_grps.json.
 * Intended to be called when the .pliplugin folder changes or on extension activation.
 * @param workspaceFolder - The workspace folder to resolve relative paths
 */
export function loadProcessGroupsCache(workspaceFolder: string) {
  const procGrpsPath = path.join(
    workspaceFolder,
    ".pliplugin",
    "proc_grps.json",
  );
  if (!fs.existsSync(procGrpsPath)) {
    cachedProcGrps = undefined;
  } else {
    try {
      cachedProcGrps = JSON.parse(fs.readFileSync(procGrpsPath, "utf8"));
    } catch {
      cachedProcGrps = undefined;
      console.warn(
        `Failed to parse ${procGrpsPath}. Process groups cache is now empty.`,
      );
    }
  }
}

/**
 * Caches the list of program config 'program' entries (glob patterns) from .pliplugin/pgm_conf.json
 * Intended to be called when the .pliplugin folder changes or on extension activation.
 * @param workspaceFolder - The workspace folder to resolve relative paths
 */
export function loadProgramConfigsCache(workspaceFolder: string) {
  const pgmConfPath = path.join(workspaceFolder, ".pliplugin", "pgm_conf.json");
  cachedProgramConfigs = [];
  if (!fs.existsSync(pgmConfPath)) return;
  try {
    const pgmConf = JSON.parse(fs.readFileSync(pgmConfPath, "utf8"));
    for (const entry of pgmConf.pgms ?? []) {
      if (typeof entry.program === "string") {
        cachedProgramConfigs.push(entry.program);
      }
    }
  } catch {
    console.warn(
      `Failed to parse ${pgmConfPath}. Program configs cache is now empty.`,
    );
    cachedProgramConfigs = [];
  }
}

/**
 * Indicates whether the given path corresponds to a PL/I library file
 * based on the cached process groups config
 * @param filePath - The file path to check
 * @param workspaceFolder - The workspace folder to resolve relative paths
 * @returns Whether the file is a PL/I library file
 */
export function isPLILibFile(
  filePath: string,
  workspaceFolder: string,
): boolean {
  if (!cachedProcGrps) {
    loadProcessGroupsCache(workspaceFolder);
  }
  for (const group of cachedProcGrps?.pgroups ?? []) {
    for (const lib of group.libs ?? []) {
      const libDir = path.join(workspaceFolder, lib);
      if (filePath.startsWith(libDir + path.sep)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns true if the given file path (extension-less) matches any program config 'program' entry (glob pattern)
 * @param filePath - The file path to check
 * @param workspaceFolder - The workspace folder to resolve relative paths
 * @returns Whether the file path matches any program config entry
 */
export function isExtensionlessProgramEntry(
  filePath: string,
  workspaceFolder: string,
): boolean {
  if (!cachedProgramConfigs.length) {
    loadProgramConfigsCache(workspaceFolder);
    if (!cachedProgramConfigs.length) {
      return false;
    }
  }

  // only consider extension-less files for program entries
  if (path.extname(filePath)) {
    return false;
  }

  // check for a match against any program config entry
  const relPath = path.relative(workspaceFolder, filePath);
  for (const pattern of cachedProgramConfigs) {
    if (minimatch(relPath, pattern)) {
      return true;
    }
  }
  return false;
}
