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

import { TextDocument } from "vscode-languageserver-textdocument";
import { Diagnostic as LspDiagnostic } from "vscode-languageserver-types";
import {
  Diagnostic,
  diagnosticFromCodeAtRange,
  offsetLengthToRange,
  PliLanguageName,
  rangeToLSP,
  severityToLsp,
} from "../language-server/types";
import {
  jsoncParseTree,
  jsoncPrintParseErrorCode,
  type JSONPath,
  type JsonNode,
  type ParseError,
} from "../utils/jsonc";
import { URI } from "../utils/uri";
import { LspCodes } from "../validation/lsp-codes";
import { DEFAULT_INSTRUCTION_LIMIT } from "../preprocessor/instruction-interpreter";
import {
  JsonItem,
  JsonItemMeta,
  plainItem,
  ProcessGroup,
  ProgramConfig,
} from "./schema";

/**
 * Result of loading and parsing a single config file. `config` is undefined
 * if the file is structurally unusable (parse errors that obliterate the
 * top-level shape); otherwise it is the parsed list (possibly empty).
 *
 * The loader performs a single tree walk via `jsoncParseTree` and pulls
 * each leaf's source location (`offset`/`length`) out of the same node it
 * extracts the value from - there is no second pass that re-discovers
 * ranges via `jsoncFindNodeAtLocation`.
 */
export interface LoadResult<T> {
  config: T[] | undefined;
  diagnostics: Diagnostic[];
}

/**
 * Optional entry-point navigation for {@link parseProgramConfigs} and
 * {@link parseProcessGroupConfigs}. When the config doesn't live at the
 * document root (e.g. inside a VS Code `settings.json` under
 * `pli.pgm_conf`, or inside a `.code-workspace` file under
 * `settings.pli.pgm_conf`), `containerPath` walks to the wrapping
 * object and `configKey` names the property that holds the config
 * object. `configKey` is matched as a single flat property name.
 */
export interface ParseEntry {
  containerPath?: JSONPath;
  configKey?: string;
}

const PGM_FILE = "pgm_conf.json";
const PROC_GRPS_FILE = "proc_grps.json";

/**
 * Parses `pgm_conf.json` text into a list of {@link ProgramConfig}s with
 * source locations attached at every leaf. Pure: no FS access, no LSP
 * conversion beyond the diagnostics it returns.
 */
export function parseProgramConfigs(
  text: string,
  configUri: URI,
  entry: ParseEntry = {},
): LoadResult<ProgramConfig> {
  const document = TextDocument.create(configUri.toString(), "jsonc", 0, text);
  const diagnostics: Diagnostic[] = [];
  const parseErrors: ParseError[] = [];
  const root = jsoncParseTree(text, parseErrors);
  diagnostics.push(
    ...createParseErrorDiagnostics(document, parseErrors, PGM_FILE),
  );

  const configRoot = navigateToEntry(root, entry);
  const pgmsNode = findProperty(configRoot, "pgms");
  if (
    !configRoot ||
    configRoot.type !== "object" ||
    !pgmsNode ||
    pgmsNode.type !== "array"
  ) {
    diagnostics.push(
      createStructureDiagnostic(
        document,
        PGM_FILE,
        formatExpectation(entry, "pgms array"),
      ),
    );
    return { config: undefined, diagnostics };
  }

  const pgmsPath: JSONPath = [...entryFullPath(entry), "pgms"];
  const configs: ProgramConfig[] = [];
  const children = pgmsNode.children ?? [];
  for (let i = 0; i < children.length; i++) {
    const entry = readProgramConfig(children[i], i, configUri, pgmsPath);
    if (entry) {
      configs.push(entry);
    }
  }
  return { config: configs, diagnostics };
}

/**
 * Parses `proc_grps.json` text into a list of {@link ProcessGroup}s with
 * source locations attached at every leaf. Pure: no FS access, no LSP
 * conversion beyond the diagnostics it returns.
 */
export function parseProcessGroupConfigs(
  text: string,
  configUri: URI,
  entry: ParseEntry = {},
): LoadResult<ProcessGroup> {
  const document = TextDocument.create(configUri.toString(), "jsonc", 0, text);
  const diagnostics: Diagnostic[] = [];
  const parseErrors: ParseError[] = [];
  const root = jsoncParseTree(text, parseErrors);
  diagnostics.push(
    ...createParseErrorDiagnostics(document, parseErrors, PROC_GRPS_FILE),
  );

  const configRoot = navigateToEntry(root, entry);
  const pgroupsNode = findProperty(configRoot, "pgroups");
  if (
    !configRoot ||
    configRoot.type !== "object" ||
    !pgroupsNode ||
    pgroupsNode.type !== "array"
  ) {
    diagnostics.push(
      createStructureDiagnostic(
        document,
        PROC_GRPS_FILE,
        formatExpectation(entry, "pgroups array"),
      ),
    );
    return { config: undefined, diagnostics };
  }

  const pgroupsPath: JSONPath = [...entryFullPath(entry), "pgroups"];
  const groups: ProcessGroup[] = [];
  const children = pgroupsNode.children ?? [];
  for (let i = 0; i < children.length; i++) {
    const entry = readProcessGroup(children[i], i, configUri, pgroupsPath);
    if (entry) {
      groups.push(entry);
    }
  }
  return { config: groups, diagnostics };
}

/**
 * Walk from `root` along `entry.containerPath`, then descend into
 * `entry.configKey` as a single flat property. Returns the node that
 * should be treated as the config root, or `undefined` if any step is
 * missing or not an object.
 */
function navigateToEntry(
  root: JsonNode | undefined,
  entry: ParseEntry,
): JsonNode | undefined {
  let current: JsonNode | undefined = root;
  for (const segment of entry.containerPath ?? []) {
    if (!current) return undefined;
    if (typeof segment === "string") {
      current = findProperty(current, segment);
    } else if (current.type === "array") {
      current = current.children?.[segment];
    } else {
      return undefined;
    }
  }
  if (entry.configKey === undefined) {
    return current;
  }
  if (!current || current.type !== "object") {
    return undefined;
  }
  return findProperty(current, entry.configKey);
}

function entryFullPath(entry: ParseEntry): JSONPath {
  const base: JSONPath = [...(entry.containerPath ?? [])];
  if (entry.configKey !== undefined) {
    base.push(entry.configKey);
  }
  return base;
}

function formatExpectation(entry: ParseEntry, suffix: string): string {
  const prefix = entryFullPath(entry).join(".");
  return prefix ? `${prefix}.${suffix}` : suffix;
}

function readProgramConfig(
  node: JsonNode | undefined,
  index: number,
  uri: URI,
  basePath: JSONPath,
): ProgramConfig | undefined {
  if (!node || node.type !== "object") {
    return undefined;
  }
  const path: JSONPath = [...basePath, index];
  const program = readStringField(node, "program", [...path, "program"], uri);
  const pgroup = readStringField(node, "pgroup", [...path, "pgroup"], uri);
  if (!program || !pgroup) {
    return undefined;
  }
  const compilerOptions = readStringArray(
    node,
    "compiler-options",
    [...path, "compiler-options"],
    uri,
  );
  return { program, pgroup, compilerOptions };
}

function readProcessGroup(
  node: JsonNode | undefined,
  index: number,
  uri: URI,
  basePath: JSONPath,
): ProcessGroup | undefined {
  if (!node || node.type !== "object") {
    return undefined;
  }
  const path: JSONPath = [...basePath, index];
  const name = readStringField(node, "name", [...path, "name"], uri);
  if (!name) {
    return undefined;
  }
  const compilerOptions = readStringArray(
    node,
    "compiler-options",
    [...path, "compiler-options"],
    uri,
  );
  const libs = readStringArray(node, "libs", [...path, "libs"], uri);
  const includeExtensions = readStringArray(
    node,
    "include-extensions",
    [...path, "include-extensions"],
    uri,
  );
  const memberNameValidation = readBooleanField(
    node,
    "member-name-validation",
    [...path, "member-name-validation"],
    uri,
  );

  const lspOptionsNode = findProperty(node, "lsp-options");
  const lspOptionsPath: JSONPath = [...path, "lsp-options"];
  const checkMargins =
    readBooleanField(
      lspOptionsNode,
      "check-margins",
      [...lspOptionsPath, "check-margins"],
      uri,
    ) ?? plainItem(false);
  const instructionCounterLimit =
    readNumberField(
      lspOptionsNode,
      "instruction-counter-limit",
      [...lspOptionsPath, "instruction-counter-limit"],
      uri,
    ) ?? plainItem(DEFAULT_INSTRUCTION_LIMIT);
  const caseUpperValidation =
    readBooleanField(
      lspOptionsNode,
      "case-upper-validation",
      [...lspOptionsPath, "case-upper-validation"],
      uri,
    ) ?? plainItem(true);

  return {
    meta: {
      path,
      range: offsetLengthToRange(node.offset, node.length),
      uri,
    },
    name,
    compilerOptions,
    libs,
    includeExtensions,
    lspOptions: {
      checkMargins,
      instructionCounterLimit,
      caseUpperValidation,
    },
    memberNameValidation,
  };
}

function findProperty(
  objectNode: JsonNode | undefined,
  key: string,
): JsonNode | undefined {
  if (!objectNode || objectNode.type !== "object" || !objectNode.children) {
    return undefined;
  }
  for (const property of objectNode.children) {
    const propKey = property.children?.[0];
    if (propKey?.type === "string" && propKey.value === key) {
      return property.children?.[1];
    }
  }
  return undefined;
}

function readStringField(
  parent: JsonNode | undefined,
  key: string,
  path: JSONPath,
  uri: URI,
): JsonItem<string> | undefined {
  const value = findProperty(parent, key);
  if (!value || value.type !== "string") {
    return undefined;
  }
  return makeItem(value.value as string, value, uri, path);
}

function readBooleanField(
  parent: JsonNode | undefined,
  key: string,
  path: JSONPath,
  uri: URI,
): JsonItem<boolean> | undefined {
  const value = findProperty(parent, key);
  if (!value || value.type !== "boolean") {
    return undefined;
  }
  return makeItem(value.value as boolean, value, uri, path);
}

function readNumberField(
  parent: JsonNode | undefined,
  key: string,
  path: JSONPath,
  uri: URI,
): JsonItem<number> | undefined {
  const value = findProperty(parent, key);
  if (!value || value.type !== "number") {
    return undefined;
  }
  return makeItem(value.value as number, value, uri, path);
}

function readStringArray(
  parent: JsonNode | undefined,
  key: string,
  path: JSONPath,
  uri: URI,
): JsonItem<string>[] {
  const value = findProperty(parent, key);
  if (!value || value.type !== "array" || !value.children) {
    return [];
  }
  const items: JsonItem<string>[] = [];
  value.children.forEach((child, index) => {
    if (child.type === "string") {
      items.push(makeItem(child.value as string, child, uri, [...path, index]));
    }
  });
  return items;
}

function makeItem<T>(
  value: T,
  node: JsonNode,
  uri: URI,
  path: JSONPath,
): JsonItem<T> {
  const meta: JsonItemMeta = {
    range: offsetLengthToRange(node.offset, node.length),
    uri,
    path,
  };
  return { value, meta };
}

function createParseErrorDiagnostics(
  document: TextDocument,
  parseErrors: ParseError[],
  fileName: string,
): Diagnostic[] {
  return parseErrors.map((error) => {
    const range = offsetLengthToRange(error.offset, error.length);
    return diagnosticFromCodeAtRange(
      LspCodes.PluginConfiguration.ParseError,
      document.uri,
      range,
      fileName,
      jsoncPrintParseErrorCode(error.error),
    );
  });
}

function createStructureDiagnostic(
  document: TextDocument,
  fileName: string,
  expected: string,
): Diagnostic {
  return diagnosticFromCodeAtRange(
    LspCodes.PluginConfiguration.InvalidStructure,
    document.uri,
    offsetLengthToRange(0, 1),
    fileName,
    expected,
  );
}

/**
 * Internal-to-loader Diagnostic -> LspDiagnostic converter. The provider
 * exposes its own conversion for runtime-discovered diagnostics (e.g. from
 * lib expansion); this helper handles diagnostics produced inside the
 * pure parse step.
 */
export function toLspDiagnostic(
  diagnostic: Diagnostic,
  document: TextDocument | undefined,
): LspDiagnostic {
  const rangeFallback = {
    start: { line: 0, character: 0 },
    end: { line: 0, character: 1 },
  };
  const range =
    diagnostic.range && document
      ? rangeToLSP(document, diagnostic.range)
      : rangeFallback;
  return {
    severity: severityToLsp(diagnostic.severity),
    message: diagnostic.message,
    code: diagnostic.code,
    source: diagnostic.source ?? PliLanguageName,
    range,
    data: diagnostic.data,
  };
}
