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

const DATASET_MEMBER_FILE_REGEX = /^(.+)\((.+)\)(\..+)?$/;

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
 * Expands every lib in `libItems` in parallel, dedupes overlapping entries,
 * and sorts the result. See {@link expandLib} for per-lib semantics.
 */
export async function expandGroup(
  libItems: readonly JsonItem<string>[],
  fs: FileSystemProvider,
  workspace: URI,
): Promise<ExpandedGroup> {
  const expansions = await Promise.all(
    libItems.map((item) => expandLib(item, fs, workspace)),
  );

  const libsByKey = new Map<string, LibsEntry>();
  const unresolved: JsonItem<string>[] = [];
  for (const expansion of expansions) {
    if (expansion.kind === ExpandedLibKind.Unresolved) {
      unresolved.push(expansion.libItem);
      continue;
    }
    for (const entry of expansion.entries) {
      const key = `${entry.kind}:${entry.path}`;
      // Keep the first occurrence so duplicates from overlapping libs don't
      // shadow one another with empty/late maps.
      if (!libsByKey.has(key)) {
        libsByKey.set(key, entry);
      }
    }
  }

  const libs = Array.from(libsByKey.values()).sort(compareByDepthThenName);
  return { libs, unresolved };
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
    const entries = await expandDirectoryTree(libItem.value, libUri, fs);
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
    const dirEntries = await expandDirectoryTree(libItem.value, libUri, fs);
    return { kind: ExpandedLibKind.Directory, libItem, entries: dirEntries };
  }
  return { kind: ExpandedLibKind.Unresolved, libItem, entries: [] };
}

/**
 * BFS over a real directory tree. Returns one {@link LibsDirEntry} per
 * discovered directory (the root and every subdirectory). File type is
 * read directly from the {@link FileSystemProvider.readDir} result, avoiding
 * per-entry stat calls (see https://github.com/zowe/zowe-pli-language-support/issues/465).
 */
async function expandDirectoryTree(
  rootLib: string,
  rootUri: URI,
  fs: FileSystemProvider,
): Promise<LibsDirEntry[]> {
  rootLib = UriUtils.normalizePath(rootLib);
  const entries: LibsDirEntry[] = [];
  const queue: { lib: string; uri: URI }[] = [{ lib: rootLib, uri: rootUri }];

  while (queue.length > 0) {
    const { lib, uri } = queue.shift()!;
    const dirEntries = (await safeReadDir(fs, uri)) ?? [];

    const files = new Map<string, string>();
    const datasetMembers = new Map<string, string>();
    for (const [name, fileType] of dirEntries) {
      if (fileType & FileType.Directory) {
        queue.push({
          lib: `${lib}/${name}`,
          uri: UriUtils.joinPath(uri, name),
        });
        continue;
      }
      if (!(fileType & FileType.File)) {
        continue;
      }
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

    entries.push({
      kind: LibsType.Directory,
      path: lib,
      files,
      datasetMembers,
    });
  }

  return entries;
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

/**
 * Sort comparator used to keep `computedLibs` in a stable, shallow-first
 * order. Include resolution iterates this list, so the order is observable.
 */
function compareByDepthThenName(a: LibsEntry, b: LibsEntry): number {
  const aKey = a.path;
  const bKey = b.path;
  const aDepth = (aKey.match(/\//g) || []).length;
  const bDepth = (bKey.match(/\//g) || []).length;
  if (aDepth - bDepth === 0) {
    return aKey.localeCompare(bKey);
  }
  return aDepth - bDepth;
}
