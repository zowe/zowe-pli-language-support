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

import { minimatch } from "minimatch";
import { escapeRegExp } from "../parser/tokens/pli-tokens";
import { URI, UriUtils } from "../utils/uri";
import {
  FileSystemProvider,
  FileType,
} from "../workspace/file-system-provider";
import { resolveLibUri } from "./path-resolver";
import {
  JsonItem,
  LibsDDEntry,
  LibsDirEntry,
  LibsEntry,
  LibsType,
} from "./schema";

/*
 * Lib path expansion turns each `libs[]` entry from the config into one or
 * more in-memory {@link LibsEntry}s the include resolver can use. There are
 * two relevant shapes on disk, dispatched on `stat`:
 *
 *  - **Directory**: a real folder. Recursively expanded (the configured
 *    lib plus every subdirectory becomes its own dir entry). Each entry
 *    indexes its files by lower-cased basename so include resolution is an
 *    in-memory map lookup.
 *  - **Data set**: the mainframe convention surfaced into a regular file
 *    system. The lib path doesn't exist as either a file or a directory;
 *    instead, sibling files of the form `<libBasename>(<member>)` carry
 *    the data set's members. Detected by reading the parent directory.
 *
 * The expander uses `stat` to decide which case applies — no try/catch
 * driving control flow.
 *
 * Output is plain data: the provider converts unresolved entries to LSP
 * diagnostics; the lib-expander itself emits no LSP types.
 */

export const DATASET_MEMBER_FILE_REGEX = /^(.+)\((.+)\)(\..+)?$/;

async function safeStat(
  fs: FileSystemProvider,
  uri: URI,
): Promise<{ isDirectory: boolean; isFile: boolean } | undefined> {
  try {
    const stat = await fs.stat(uri);
    return { isDirectory: stat.isDirectory, isFile: stat.isFile };
  } catch {
    return undefined;
  }
}

async function safeReadDir(
  fs: FileSystemProvider,
  uri: URI,
): Promise<[string, FileType][] | undefined> {
  try {
    return await fs.readDir(uri);
  } catch {
    return undefined;
  }
}

/**
 * The kind of expansion produced for a single configured lib.
 */
export enum ExpandedLibKind {
  Unresolved,
  Directory,
  Dataset,
}

/**
 * Result of expanding a single lib. Carries the original `JsonItem` so a
 * caller emitting an "unresolved lib" diagnostic has the source range
 * directly without a separate path lookup.
 */
export interface ExpandedLib {
  kind: ExpandedLibKind;
  libItem: JsonItem<string>;
  /**
   * Computed entries. Empty for unresolved. May be multiple {@link LibsDirEntry}s
   * for a directory lib (the lib + recursive subdirs); a single
   * {@link LibsDDEntry} for a dataset lib.
   */
  entries: LibsEntry[];
}

/**
 * Result of expanding all libs in a process group. Computed entries are
 * deduplicated (by path) and sorted by depth then name so include
 * resolution sees a stable, shallow-first order.
 */
export interface ExpandedGroup {
  libs: LibsEntry[];
  /** Lib items that didn't resolve to anything on disk. */
  unresolved: JsonItem<string>[];
}

/**
 * A concrete lib to expand, tagged with the provenance needed to order the
 * results later: which `libs[]` entry it came from (`configIndex`) and the
 * segment count of that entry's static base (`baseDepth`), so an entry's depth
 * can be measured *relative to its own base* rather than from the filesystem
 * root.
 */
interface PlannedLib {
  item: JsonItem<string>;
  configIndex: number;
  baseDepth: number;
}

/** Segment count of a (normalized) path, used as a lib's base depth. */
function baseDepthOf(base: string): number {
  return UriUtils.parts(UriUtils.normalizePath(base)).length;
}

/**
 * Turns configured lib entries into the flat list of concrete libs to expand,
 * resolving wildcards along the way. Each concrete lib keeps its originating
 * config index and base depth (see {@link PlannedLib}). An unresolvable
 * wildcard is kept verbatim so it later surfaces as an unresolved diagnostic.
 */
async function planLibs(
  libItems: readonly JsonItem<string>[],
  fs: FileSystemProvider,
  workspace: URI,
): Promise<PlannedLib[]> {
  const planned: PlannedLib[] = [];
  for (let configIndex = 0; configIndex < libItems.length; configIndex++) {
    const item = libItems[configIndex];
    if (!item.value.includes("*")) {
      planned.push({ item, configIndex, baseDepth: baseDepthOf(item.value) });
      continue;
    }
    const matched = await expandWildcardLib(item.value, fs, workspace);
    if (!matched.length) {
      planned.push({ item, configIndex, baseDepth: baseDepthOf(item.value) });
      continue;
    }
    const baseDepth = baseDepthOf(splitGlobPattern(item.value).base);
    for (const rel of matched) {
      planned.push({
        item: { value: rel, meta: item.meta },
        configIndex,
        baseDepth,
      });
    }
  }
  return planned;
}

/**
 * Expands every lib in `libItems` in parallel, dedupes overlapping entries,
 * and sorts the result. See {@link expandLib} for per-lib semantics.
 */
export async function expandGroup(
  libItems: readonly JsonItem<string>[],
  fs: FileSystemProvider,
  workspace: URI,
): Promise<ExpandedGroup> {
  const planned = await planLibs(libItems, fs, workspace);
  const expansions = await Promise.all(
    planned.map((p) => expandLib(p.item, fs, workspace)),
  );

  const seen = new Set<string>();
  const sortable: SortableLib[] = [];
  const unresolved: JsonItem<string>[] = [];
  for (let i = 0; i < expansions.length; i++) {
    const expansion = expansions[i];
    if (expansion.kind === ExpandedLibKind.Unresolved) {
      unresolved.push(expansion.libItem);
      continue;
    }
    const { configIndex, baseDepth } = planned[i];
    for (const entry of expansion.entries) {
      const key = `${entry.kind}:${entry.path}`;
      // Keep the first occurrence so duplicates from overlapping libs don't
      // shadow one another with empty/late maps.
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const depth = Math.max(0, UriUtils.parts(entry.path).length - baseDepth);
      sortable.push({ entry, configIndex, depth });
    }
  }

  sortable.sort(compareLibs);
  return { libs: sortable.map((s) => s.entry), unresolved };
}

/**
 * Expands a single lib by classifying the path with `stat`:
 *   - directory -> recursively walk, indexing files
 *   - file -> unresolved (a lib pointing at a file is never legal)
 *   - neither -> try the dataset convention against the parent directory
 *
 * Exposed separately from {@link expandGroup} so a future watcher event
 * can re-expand a single lib without redoing the whole group.
 */
export async function expandLib(
  libItem: JsonItem<string>,
  fs: FileSystemProvider,
  workspace: URI,
): Promise<ExpandedLib> {
  const libUri = resolveLibUri(libItem.value, workspace);
  let statIsDirectory = false;
  let statIsFile = false;
  const stats = await safeStat(fs, libUri);
  if (stats) {
    statIsDirectory = stats.isDirectory;
    statIsFile = stats.isFile;
  }

  if (statIsDirectory) {
    const entries = [await expandDirectoryTree(libItem.value, libUri, fs)];
    return { kind: ExpandedLibKind.Directory, libItem, entries };
  }
  if (statIsFile) {
    // Lib paths must point at a directory or a (notional) data set, not a
    // single file. Treat as unresolved so the user sees a diagnostic.
    return { kind: ExpandedLibKind.Unresolved, libItem, entries: [] };
  }

  // The path itself doesn't exist on disk. Try the data-set convention:
  // sibling files of the form `<basename>(<member>)`.
  const dataset = await tryReadDataset(libItem.value, libUri, fs);
  if (dataset) {
    return { kind: ExpandedLibKind.Dataset, libItem, entries: [dataset] };
  }

  // Final fallback: some FS providers (notably the in-memory test
  // VirtualFileSystemProvider and EmptyFileSystemProvider) report nothing
  // from `stat` for paths that aren't yet populated, but `readDir` happily
  // returns `[]`. Accept that as a phantom-directory lib so configuration
  // stays usable until files appear; on a real FS, `readDir` fails here
  // and we genuinely have nothing.
  const entries = await safeReadDir(fs, libUri);
  if (entries !== undefined) {
    const dirEntries = [await expandDirectoryTree(libItem.value, libUri, fs)];
    return { kind: ExpandedLibKind.Directory, libItem, entries: dirEntries };
  }
  return { kind: ExpandedLibKind.Unresolved, libItem, entries: [] };
}

/**
 * Splits a glob `pattern` into its static `base` (the leading, glob-free path
 * prefix) and the `tail` that must be matched *relative to* that base.
 *
 * The base is everything up to the last separator before the first `*`; the
 * tail is the remainder. This lets a directory walk start at the base —
 * resolved the same way literal libs are, via {@link resolveLibUri} — instead
 * of always at the workspace. That is what makes absolute patterns such as
 * "C:/copybooks" + globstar work, while relative patterns keep an empty base
 * (i.e. the workspace) and behave exactly as before.
 *
 * The input is backslash-normalized and any trailing separators are trimmed.
 * Callers only reach this with a pattern containing `*`; a glob-free string is
 * handled defensively by returning it whole as the base with an empty tail.
 * A leading "/" is preserved so Unix-absolute bases stay absolute.
 */
export function splitGlobPattern(pattern: string): {
  base: string;
  tail: string;
} {
  // No shared helper trims trailing separators, so do that inline; the
  // backslash normalization reuses UriUtils (matching resolveLibUri).
  const normalized = UriUtils.normalizePath(pattern).replace(/\/+$/, "");
  const firstGlob = normalized.indexOf("*");
  if (firstGlob === -1) {
    return { base: normalized, tail: "" };
  }
  const lastSlash = normalized.lastIndexOf("/", firstGlob);
  if (lastSlash === -1) {
    // The glob lives in the first segment (e.g. globstar-first or a partial
    // segment like "copy*/…"): match relative to the workspace.
    return { base: "", tail: normalized };
  }
  const base = lastSlash === 0 ? "/" : normalized.slice(0, lastSlash);
  const tail = normalized.slice(lastSlash + 1);
  return { base, tail };
}

/**
 * Rejoins a static `base` with a base-relative match into a single lib string,
 * preserving the base's shape so a later {@link resolveLibUri} classifies it the
 * same way (absolute stays absolute, relative stays workspace-relative). An
 * empty base yields the workspace-relative match verbatim; an empty match (the
 * base directory itself) yields the base verbatim.
 */
function joinBaseRel(base: string, rel: string): string {
  if (!base) {
    return rel;
  }
  if (!rel) {
    return base;
  }
  return base.endsWith("/") ? `${base}${rel}` : `${base}/${rel}`;
}

/**
 * Expands a glob `pattern` (containing `*` and/or `**`) into the concrete
 * directory paths it matches. The pattern is split into a static base and a
 * glob tail (see {@link splitGlobPattern}); the walk is rooted at the resolved
 * base — so absolute patterns like `C:/copybooks/**` search under that base and
 * relative patterns search under the workspace — and each candidate directory is
 * matched against the tail. `*` matches a single path segment; `**` matches any
 * depth. A bare-globstar tail (from a `.../**` pattern) also yields the base
 * directory itself, which the walk never visits as a child. Matching is
 * case-insensitive. Returned paths preserve the base's shape (absolute stays
 * absolute) and are later indexed by {@link expandLib}.
 */
async function expandWildcardLib(
  pattern: string,
  fs: FileSystemProvider,
  workspace: URI,
): Promise<string[]> {
  const { base, tail } = splitGlobPattern(pattern);
  if (!tail) {
    return [];
  }
  const root = resolveLibUri(base, workspace);
  const tailHasGlobstar = tail.includes("**");
  // A bare-globstar tail (i.e. a `.../**` pattern) also matches the base
  // directory itself, which the walk below never reaches as a child.
  const includeBase = tail === "**";
  const searchBoundary = tailHasGlobstar
    ? Infinity
    : UriUtils.parts(tail).length;

  const matches: string[] = [];
  const queue = [{ relPath: "", uri: root }];
  while (queue.length > 0) {
    const { relPath, uri } = queue.shift()!;
    const depth = UriUtils.parts(relPath).length;
    if (depth >= searchBoundary) {
      continue;
    }
    const dirEntries = await safeReadDir(fs, uri);
    // Only emit the base when it actually exists on disk (readDir succeeded).
    if (relPath === "" && includeBase && dirEntries !== undefined) {
      matches.push("");
    }
    for (const [name, fileType] of dirEntries ?? []) {
      if (!(fileType & FileType.Directory)) {
        continue;
      }
      const childRel = relPath ? `${relPath}/${name}` : name;
      if (minimatch(childRel, tail, { nocase: true })) {
        matches.push(childRel);
      }
      queue.push({ relPath: childRel, uri: UriUtils.joinPath(uri, name) });
    }
  }

  return matches.map((rel) => joinBaseRel(base, rel));
}

/**
 * Indexes a single directory (non-recursively) into one {@link LibsDirEntry}.
 * Only the directory's *direct* files are recorded; subdirectories are
 * ignored. Recursion is opt-in at the pattern level (`**`), where
 * {@link expandWildcardLib} enumerates each descendant directory and each one
 * is indexed here in turn — so depth is driven by the configured lib pattern
 * rather than baked into this walk.
 *
 * Each file is indexed twice: by lower-cased basename (for plain include
 * resolution) and, when it matches the `<name>(<member>)` shape, by member
 * name (for data-set member resolution). File type is read directly from the
 * {@link FileSystemProvider.readDir} result, avoiding per-entry stat calls
 * (see https://github.com/zowe/zowe-pli-language-support/issues/465).
 */
async function expandDirectoryTree(
  rootLib: string,
  rootUri: URI,
  fs: FileSystemProvider,
): Promise<LibsDirEntry> {
  rootLib = UriUtils.normalizePath(rootLib);
  const files = new Map<string, string>();
  const datasetMembers = new Map<string, string>();
  const dirEntries = (await safeReadDir(fs, rootUri)) ?? [];
  for (const [name, fileType] of dirEntries) {
    if (fileType & FileType.File) {
      const lowerName = name.toLowerCase();
      if (!files.has(lowerName)) {
        files.set(lowerName, name);
      }
      const datasetMatch = DATASET_MEMBER_FILE_REGEX.exec(name);
      if (datasetMatch) {
        // Member name in the source can be in any case; normalize for
        // lookup but keep the original file name for the URI.
        const memberName = datasetMatch[2].toLowerCase();
        if (!datasetMembers.has(memberName)) {
          datasetMembers.set(memberName, name);
        }
      }
    }
  }
  return {
    kind: LibsType.Directory,
    path: rootLib,
    files,
    datasetMembers,
  };
}

/**
 * Detect a data-set lib by scanning the parent directory for files that
 * match `<basename>(<member>)`. Returns a {@link LibsDDEntry} with every
 * member indexed, or undefined if no matches (and therefore: not a dataset).
 */
async function tryReadDataset(
  lib: string,
  libUri: URI,
  fs: FileSystemProvider,
): Promise<LibsDDEntry | undefined> {
  const parentUri = UriUtils.dirname(libUri);
  try {
    const parentStat = await fs.stat(parentUri);
    if (!parentStat.isDirectory) {
      return undefined;
    }
  } catch {
    // If we can't read the parent directory, we can't find dataset members
    return undefined;
  }

  const libName = UriUtils.basename(libUri);
  // Look for files named like `<libName>(<member>)(.ext)?` in the parent directory
  const ddnamePattern = new RegExp(
    `^${escapeRegExp(libName)}\\((.+)\\)(\..+)?$`,
    "i",
  );
  const parentEntries = (await safeReadDir(fs, parentUri)) ?? [];
  const members = new Map<string, string>();
  for (const [entry, fileType] of parentEntries) {
    // Only consider files as dataset members
    if (!(fileType & FileType.File)) {
      continue;
    }
    const match = ddnamePattern.exec(entry);
    if (match) {
      const memberName = match[1].toLowerCase();
      if (!members.has(memberName)) {
        members.set(memberName, entry);
      }
    }
  }
  if (members.size === 0) {
    return undefined;
  }
  return { kind: LibsType.Dataset, path: lib, members };
}

/** A computed lib entry tagged with the keys used to order it. */
interface SortableLib {
  entry: LibsEntry;
  /** Position of the originating `libs[]` entry in the config. */
  configIndex: number;
  /** Segment count below the originating lib's own base. */
  depth: number;
}

/**
 * Orders computed libs so include resolution (which picks the first match) sees
 * a stable, predictable priority:
 *   1. shallowest first, where depth is measured *relative to each lib's own
 *      base* — so an absolute lib and a relative lib compare fairly instead of
 *      the absolute one always losing on its longer filesystem path;
 *   2. then by config order, so an earlier `libs[]` entry wins a same-depth tie;
 *   3. then alphabetically by path, to break any remaining ties deterministically.
 */
function compareLibs(a: SortableLib, b: SortableLib): number {
  return (
    a.depth - b.depth ||
    a.configIndex - b.configIndex ||
    a.entry.path.localeCompare(b.entry.path)
  );
}
