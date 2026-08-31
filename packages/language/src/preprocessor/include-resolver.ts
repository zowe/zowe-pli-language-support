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

import { resolveLibFileUri } from "../config/path-resolver";
import {
  isLibsDir,
  LibsDDEntry,
  LibsDirEntry,
  ProcessGroup,
} from "../config/schema";
import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import { Token } from "../parser/tokens";
import { URI, UriUtils } from "../utils/uri";
import { LspCodes } from "../validation/lsp-codes";
import {
  BuiltinsSqlcaName,
  BuiltinsSqlcaUri,
  BuiltinsSqldaName,
  BuiltinsSqldaUri,
} from "../workspace/builtins";
import { CompilationUnit } from "../workspace/compilation-unit";

/**
 * %INCLUDE resolution.
 *
 * Two on-disk shapes need to be supported:
 *
 *  - **File include** (`%INCLUDE "name";` or `%INCLUDE name;`): look up
 *    `name` (with the configured extensions) in each directory lib's
 *    pre-built file index. Falls back to a live `fileExists` check for
 *    files added to the workspace after lib expansion ran.
 *  - **Member include** (`%INCLUDE LIBNAME(member);` or `%INCLUDE member;`):
 *    look up the member by name in either a directory lib's `datasetMembers`
 *    map or a DDName lib's `members` map. The mainframe data-set convention
 *    surfaces members as sibling files of the form `LIBNAME(member)`; the
 *    indexes are populated at lib-expansion time so each include site is an
 *    O(1) map hit.
 *
 * Resolution order: dataset members win over plain files in a directory
 * lib, so given `cpy/A.B.C(member)` and `cpy/member.pli` the data-set
 * member is returned.
 */

/**
 * Represents an include item to be processed — either a literal file
 * include or a member include (with or without an explicit DDName).
 */
export type IncludeItem = FileIncludeItem | MemberIncludeItem;

/** Literal file include: `%INCLUDE "name";`. */
export interface FileIncludeItem {
  fileName: string;
  token?: Token | null;
  idempotent: boolean;
  sql: boolean;
}

/** Member include, possibly with a ddname to disambiguate the data set. */
export interface MemberIncludeItem {
  memberName: string;
  ddname: string | null;
  ddnameTokens: Token[] | null;
  token?: Token | null;
  idempotent: boolean;
}

export function isFileIncludeItem(obj: any): obj is FileIncludeItem {
  return (
    obj &&
    typeof obj === "object" &&
    "fileName" in obj &&
    typeof obj.fileName === "string"
  );
}

export function isMemberIncludeItem(obj: any): obj is MemberIncludeItem {
  return (
    obj &&
    typeof obj === "object" &&
    "memberName" in obj &&
    typeof obj.memberName === "string"
  );
}

/**
 * Returns the file name or partial member name an include item resolves
 * against. Partial names are the form used when a member include omits
 * its DDName: the same string can match either a sibling file in a
 * directory lib or a member of any data set in libs.
 */
export function getFileNameOrPartialName(
  item: IncludeItem,
): string | undefined {
  if (isMemberIncludeItem(item) && item.ddname) {
    return `${item.ddname}(${item.memberName})`;
  } else if (isMemberIncludeItem(item)) {
    return item.memberName;
  } else if (item.fileName) {
    return item.fileName;
  }
  return undefined;
}

/**
 * What the resolver needs from its caller. Structurally compatible with
 * the interpreter's larger context object — the resolver pulls only what
 * it needs to keep dependencies narrow.
 */
export interface IncludeResolverContext {
  unit: CompilationUnit;
  currentUri: URI;
  entryUri: URI;
  diagnostics: Diagnostic[];
}

/**
 * Member-name pattern: a leading letter, followed by alphanumerics and a
 * fixed set of mainframe punctuation. Used both as a precondition for
 * member lookup and (when {@link ProcessGroup.memberNameValidation} is
 * enabled) as a validation rule.
 */
const MEMBER_NAME_REGEX = /^[A-Z][A-Z0-9@#_$]*$/i;

/**
 * Mainframe DDname rules: members are at most 8 characters and must match
 * {@link MEMBER_NAME_REGEX}. Validation only runs when the process group
 * opts in via `member-name-validation: true`; the diagnostics it produces
 * are pushed onto the resolver context. Nothing happens for file
 * includes that didn't go through member-style resolution.
 */
function validateMemberName(
  memberName: string,
  pgroup: ProcessGroup,
  token: Token | null | undefined,
  diagnostics: Diagnostic[],
): void {
  if (!pgroup.memberNameValidation?.value) {
    return;
  }
  if (memberName.length > 8) {
    diagnostics.push(
      diagnosticFromCode(LspCodes.MemberValidation.ExceedsMaxLength, token),
    );
  }
  if (!MEMBER_NAME_REGEX.test(memberName)) {
    diagnostics.push(
      diagnosticFromCode(LspCodes.MemberValidation.InvalidName, token),
    );
  }
}

/**
 * Type guard: standalone member without a DDName specified
 * (e.g. `%INCLUDE m1;`). Such an item can match either a dataset member
 * inside any directory lib or a member of any DDName-style lib.
 */
function isMemberWithoutDDName(item: IncludeItem): item is MemberIncludeItem {
  return isMemberIncludeItem(item) && !item.ddname;
}

/**
 * Type guard: member with an explicit DDName (e.g. `%INCLUDE A.B.C(M);`).
 */
function isMemberWithDDName(
  item: IncludeItem,
): item is MemberIncludeItem & { ddname: string; memberName: string } {
  return (
    isMemberIncludeItem(item) &&
    item.ddname !== null &&
    item.memberName.length > 0
  );
}

/**
 * Looks up `name` (and optionally `name + ext` for each extension) in a
 * pre-built file index. Returns the on-disk filename of the first match,
 * preserving its casing, or undefined.
 */
function findIndexedFile(
  files: Map<string, string>,
  name: string,
  extensions: readonly string[],
): string | undefined {
  const lower = name.toLowerCase();
  const exact = files.get(lower);
  if (exact) {
    return exact;
  }
  for (const ext of extensions) {
    const suffix = ext.startsWith(".") ? ext : `.${ext}`;
    const match = files.get(lower + suffix.toLowerCase());
    if (match) {
      return match;
    }
  }
  return undefined;
}

/**
 * Live `fileExists` fallback for files added to the workspace after lib
 * expansion ran (and for tests that populate a virtual FS lazily). Real
 * provider failures (network, permissions) are swallowed and surface as
 * "not found" rather than propagating.
 */
async function tryLiveFile(
  unit: CompilationUnit,
  path: URI,
  extensions: readonly string[],
): Promise<URI | undefined> {
  const fs = unit.services.workspace.fs;
  if (await fs.fileExists(path).catch(() => false)) {
    return path;
  }
  for (const ext of extensions) {
    const suffix = ext.startsWith(".") ? ext : `.${ext}`;
    const candidate = path.with({ path: path.path + suffix });
    if (await fs.fileExists(candidate).catch(() => false)) {
      return candidate;
    }
  }
  return undefined;
}

/**
 * Builds the URI of a data-set member file. The lib path identifies the
 * data set (e.g. `cpy/A.B.C`); the actual member file lives next to it
 * (e.g. `cpy/A.B.C(M1)`). `memberFileName` comes from the lib's pre-built
 * member index, so it preserves the on-disk casing.
 */
function buildDatasetMemberUri(
  libPath: string,
  memberFileName: string,
  workspace: URI | undefined,
  scheme: string,
): URI | undefined {
  const datasetUri = resolveLibFileUri(libPath, undefined, workspace, scheme);
  if (!datasetUri) {
    return undefined;
  }
  const parentUri = UriUtils.dirname(datasetUri);
  return UriUtils.joinPath(parentUri, memberFileName);
}

/**
 * Looks for `query` as a data-set member inside a directory lib's
 * `datasetMembers` index. Resolution order in {@link resolveIncludeFileUri}
 * runs this *before* the file lookup so `cpy/A.B.C(member)` wins over
 * `cpy/member.pli` when both exist.
 */
function tryResolveDatasetMemberInDir(
  lib: LibsDirEntry,
  query: string,
  workspace: URI | undefined,
  scheme: string,
): URI | undefined {
  if (!MEMBER_NAME_REGEX.test(query)) {
    return undefined;
  }
  const memberFileName = lib.datasetMembers.get(query.toLowerCase());
  if (!memberFileName) {
    return undefined;
  }
  return resolveLibFileUri(lib.path, memberFileName, workspace, scheme);
}

/**
 * Looks for `query` (with each of the configured extensions appended) as a
 * regular file in a directory lib. Tries the pre-built index first, then
 * falls back to a live `fileExists` check for files added after lib
 * expansion ran.
 */
async function tryResolveFileInDir(
  lib: LibsDirEntry,
  query: string,
  extensions: readonly string[],
  unit: CompilationUnit,
  workspace: URI | undefined,
  scheme: string,
): Promise<URI | undefined> {
  const matchedFileName = findIndexedFile(lib.files, query, extensions);
  if (matchedFileName) {
    return resolveLibFileUri(lib.path, matchedFileName, workspace, scheme);
  }
  const libFileUri = resolveLibFileUri(lib.path, query, workspace, scheme);
  if (!libFileUri) {
    return undefined;
  }
  return tryLiveFile(unit, libFileUri, extensions);
}

/**
 * Tries to resolve a standalone-member include against a DDName-style lib.
 * The lib already enumerated all its members at expand time; this is an
 * O(1) map hit.
 */
function tryResolveStandaloneMemberInDDLib(
  lib: LibsDDEntry,
  memberName: string,
  workspace: URI | undefined,
  scheme: string,
): URI | undefined {
  const memberFileName = lib.members.get(memberName.toLowerCase());
  if (!memberFileName) {
    return undefined;
  }
  return buildDatasetMemberUri(lib.path, memberFileName, workspace, scheme);
}

/**
 * Tries to resolve a `LIBNAME(member)` include against a DDName-style lib.
 * The lib's `ddLib` may include directory parts; only the trailing
 * basename needs to match the include's `ddname`.
 */
function tryResolveDDNameMember(
  lib: LibsDDEntry,
  ddname: string,
  memberName: string,
  workspace: URI | undefined,
  scheme: string,
): URI | undefined {
  // Ensure that we match the whole ddname, not just a suffix of it
  const partialDDNamePath = "/" + ddname.toLowerCase();
  if (!lib.path.toLowerCase().endsWith(partialDDNamePath)) {
    return undefined;
  }
  const memberFileName = lib.members.get(memberName.toLowerCase());
  if (!memberFileName) {
    return undefined;
  }
  return buildDatasetMemberUri(lib.path, memberFileName, workspace, scheme);
}

/**
 * Builtins fallback for SQL includes. SQLCA and SQLDA are conceptually
 * mainframe-supplied — they don't exist on the user's filesystem but
 * still need to resolve so SQL-using code can preprocess.
 */
function tryResolveSqlBuiltin(item: IncludeItem): URI | undefined {
  if (!isFileIncludeItem(item) || !item.sql) {
    return undefined;
  }
  if (item.fileName.toUpperCase() === BuiltinsSqlcaName) {
    return UriUtils.toUri(BuiltinsSqlcaUri);
  }
  if (item.fileName.toUpperCase() === BuiltinsSqldaName) {
    return UriUtils.toUri(BuiltinsSqldaUri);
  }
  return undefined;
}

/**
 * Attempts to resolve the URI of an include file factoring in process
 * group libs. Iterates the group's pre-computed (and pre-sorted) lib list
 * and dispatches each entry to one of the `tryResolve*` helpers.
 */
export async function resolveIncludeFileUri(
  item: IncludeItem,
  context: IncludeResolverContext,
): Promise<URI | undefined> {
  if (!context.entryUri || (!isFileIncludeItem(item) && !item.memberName)) {
    return undefined;
  }
  const workspaceCtx = context.unit.services.workspace;
  const pgroup = context.unit.processGroup;
  if (!pgroup) {
    return undefined;
  }

  const fileNameOrPartial = getFileNameOrPartialName(item);
  if (!fileNameOrPartial) {
    return undefined;
  }

  const workspaceUri = workspaceCtx.config.getWorkspaceUri();
  const scheme = context.entryUri.scheme;
  const includeExtensions = pgroup.includeExtensions.map((e) => e.value);

  // Whether we ended up doing a member lookup. Only members go through
  // member-name validation; flipped back to false if a directory lib
  // resolves the include via a regular file rather than a member.
  let needsMemberValidation =
    isMemberWithoutDDName(item) || isMemberWithDDName(item);

  let libMatch: URI | undefined;
  for (const lib of pgroup.computedLibs) {
    if (isLibsDir(lib)) {
      // Dataset members in this dir win over regular files. A dataset
      // match keeps `needsMemberValidation` at its initial value because
      // the include resolved as a member; a plain file match clears it
      // unless the include itself was ddname-qualified.
      libMatch = tryResolveDatasetMemberInDir(
        lib,
        fileNameOrPartial,
        workspaceUri,
        scheme,
      );
      if (libMatch) break;

      libMatch = await tryResolveFileInDir(
        lib,
        fileNameOrPartial,
        includeExtensions,
        context.unit,
        workspaceUri,
        scheme,
      );
      if (libMatch) {
        needsMemberValidation = isMemberWithDDName(item);
        break;
      }
    } else if (isMemberWithoutDDName(item)) {
      libMatch = tryResolveStandaloneMemberInDDLib(
        lib,
        fileNameOrPartial,
        workspaceUri,
        scheme,
      );
      if (libMatch) break;
    } else if (isMemberWithDDName(item)) {
      libMatch = tryResolveDDNameMember(
        lib,
        item.ddname,
        item.memberName,
        workspaceUri,
        scheme,
      );
      if (libMatch) break;
    }
  }

  if (needsMemberValidation) {
    const memberToValidate = isMemberWithDDName(item)
      ? item.memberName
      : fileNameOrPartial;
    validateMemberName(
      memberToValidate,
      pgroup,
      item.token,
      context.diagnostics,
    );
  }

  return libMatch ?? tryResolveSqlBuiltin(item);
}
