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

import { Diagnostic, Range } from "../language-server/types";
import { AbstractCompilerOptions } from "../preprocessor/compiler-options/parser";
import { JSONPath } from "../utils/jsonc";
import { URI } from "../utils/uri";

/**
 * Source location of a value loaded from a JSON config file. Carried with
 * the value itself (see {@link JsonItem}) so any field can produce a precise
 * diagnostic without a separate lookup.
 *
 * Absent (`meta === undefined`) when the value did not come from JSON —
 * e.g. a default applied because a field was missing or invalid.
 */
export interface JsonItemMeta {
  range: Range;
  uri: URI;
  path: JSONPath;
}

/**
 * A value loaded from a JSON config file, paired with its source location.
 *
 * The schema types below ({@link ProgramConfig}, {@link ProcessGroup}) hold
 * `JsonItem<T>` at every leaf rather than maintaining a side-channel
 * "property map" of paths-to-ranges. This means a diagnostic about, say,
 * an invalid `libs` entry has the entry's exact JSON range available
 * directly on the value — no path lookup, no consume-by-splice ordering
 * games.
 */
export interface JsonItem<T> {
  value: T;
  meta?: JsonItemMeta;
}

/**
 * Constructs a {@link JsonItem} for a value supplied by the application
 * (defaults, test fixtures) rather than parsed from JSON. Such items have
 * no source location.
 */
export function plainItem<T>(value: T): JsonItem<T> {
  return { value };
}

/**
 * Program configuration. A pure DTO mirroring `pgm_conf.json` — every leaf
 * carries its source location via {@link JsonItem}. Derived data
 * (parsed compiler options, issues) lives on {@link ProgramRecord}.
 */
export interface ProgramConfig {
  program: JsonItem<string>;
  pgroup: JsonItem<string>;
  compilerOptions: JsonItem<string>[];
}

/**
 * Process group configuration. A pure DTO mirroring one entry of
 * `proc_grps.json`'s `pgroups` array. Derived data (computed libs, issue
 * counts) lives on {@link GroupRecord}.
 */
export interface ProcessGroup {
  meta?: JsonItemMeta;
  name: JsonItem<string>;
  compilerOptions: JsonItem<string>[];
  libs: JsonItem<string>[];
  includeExtensions: JsonItem<string>[];

  lspOptions: {
    checkMargins: JsonItem<boolean>;
    instructionCounterLimit: JsonItem<number>;
    caseUpperValidation: JsonItem<boolean>;
  };

  /**
   * Whether member name validation is enabled for this process group.
   * Validation constrains member names to no more than 8 chars, starting
   * with a letter, containing only A-Z, 0-9, @, #, _, and $ (case-insensitive).
   */
  memberNameValidation?: JsonItem<boolean>;
}

/**
 * A {@link ProcessGroup} together with the data that the plugin
 * configuration provider derives from it at load time. Returned by
 * lookups (`getProcessGroupConfig`) and attached to compilation units
 * via `unit.processGroup`. Consumers reach the on-disk fields directly
 * (e.g. `record.libs`) and the derived fields without a second lookup.
 */
export interface GroupRecord extends ProcessGroup {
  /**
   * Libs from the config plus any subdirectories discovered during
   * expansion, plus any data-set entries detected from the parent
   * directory. Sorted shallow-first.
   */
  computedLibs: LibsEntry[];

  /**
   * Lower-noise lookup for `getProcessGroupConfigFromLib` — only
   * directory libs, normalized to forward slashes.
   */
  computedLibsSet: Set<string>;
}

/**
 * A {@link ProgramConfig} together with its merged compiler options. The
 * pli-options strings (this config's plus the bound process group's) are
 * parsed once at load time so each lookup hands back a ready-to-use
 * {@link AbstractCompilerOptions}.
 */
export interface ProgramRecord extends ProgramConfig {
  abstractOptions: AbstractCompilerOptions;
  /**
   * Issues found while parsing the pli-options. Surfaced here so the
   * compiler-options translator doesn't double-report them.
   */
  issues: Diagnostic[];
}

/**
 * Library entry in a process group's computed libs. Tag-union on `kind`:
 * the directory branch lists files inside the dir; the dataset branch
 * lists members of a single data set whose lib path doesn't actually
 * exist on disk.
 */
export type LibsEntry = LibsDirEntry | LibsDDEntry;

export enum LibsType {
  Directory,
  Dataset,
}

/**
 * A directory lib. `path` exists on disk as a real directory and may
 * contain regular files and/or data-set-style files (`name(member)`).
 *
 * `files` indexes regular files: lower-case basename -> on-disk filename
 * (preserves original casing for the resolved URI).
 *
 * `datasetMembers` indexes any data-set-style files found directly in
 * this directory. Lets `%INCLUDE m1;` resolve to `cpy/A.B.C(m1)` in O(1)
 * when `cpy` is the configured lib.
 */
export interface LibsDirEntry {
  kind: LibsType.Directory;
  path: string;
  files: Map<string, string>;
  datasetMembers: Map<string, string>;
}

/**
 * A DD ("data definition") lib. `path` doesn't exist on disk as either
 * a file or a directory; instead, sibling files of the form
 * `path(member)` carry the data set's members. `members` indexes those
 * members for O(1) lookups.
 */
export interface LibsDDEntry {
  kind: LibsType.Dataset;
  path: string;
  members: Map<string, string>;
}

export function isLibsDir(entry: LibsEntry): entry is LibsDirEntry {
  return entry.kind === LibsType.Directory;
}

/** ProgramEntry: a single program entry in `pgm_conf.json`. */
export interface ProgramEntry {
  program: string;
  pgroup: string;
}

/** PgmsConfig: top-level structure of `pgm_conf.json`. */
export interface PgmsConfig {
  pgms: ProgramEntry[];
}
