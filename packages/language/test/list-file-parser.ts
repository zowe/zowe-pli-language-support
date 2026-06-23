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

import { CICSPreprocessorBase } from "preprocessor-cics";
import { PliLanguageName } from "../src/language-server/types";

export interface ListFilePosition {
  line: number;
  file: number;
}

export interface CompilerSourceLine {
  position: ListFilePosition;
  text: string;
}

export interface XrefEntry {
  /** undefined when the identifier is predefined (shown as +++++++ in the listing) */
  definedAt: ListFilePosition | undefined;
  identifier: string;
  refs: ListFilePosition[];
  sets: ListFilePosition[];
}

export type MessageSeverity = "I" | "W" | "E" | "S" | "U" | "L";

export interface CompilerMessage {
  code: string;
  severity: MessageSeverity;
  position: ListFilePosition;
  description: string;
  source: string;
}

export interface FileTableEntry {
  fileIndex: number;
  includedFrom: ListFilePosition | undefined;
  name: string;
}

export interface ParsedListFile {
  compilerSource: CompilerSourceLine[];
  xrefTable: XrefEntry[];
  compilerMessages: CompilerMessage[];
  macroMessages: CompilerMessage[];
  fileTable: FileTableEntry[];
}

function parsePosition(text: string | undefined): ListFilePosition | undefined {
  if (!text) return undefined;
  const match = text.match(/^(\d+)\.(\d+)$/);
  if (!match) return undefined;
  return { line: parseInt(match[1], 10), file: parseInt(match[2], 10) };
}

function parsePositions(raw: string): ListFilePosition[] {
  return raw
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(parsePosition)
    .filter((p): p is ListFilePosition => p !== undefined);
}

type Section =
  | "none"
  | "compilerSource"
  | "xrefTable"
  | "compilerMessages"
  | "macroMessages"
  | "fileTable"
  | "unreferencedIdentifiers"
  | "cicsMessages";

/**
 * Parses an IBM Enterprise PL/I compiler .list file.
 */
export function parseListFile(content: string): ParsedListFile {
  const result: ParsedListFile = {
    compilerSource: [],
    xrefTable: [],
    compilerMessages: [],
    macroMessages: [],
    fileTable: [],
  };

  let section: Section = "none";
  let skipNextLine = false;

  for (const rawLine of content.split(/\r?\n/)) {
    if (rawLine.length === 0) continue;

    // First character is an ANSI carriage-control character; strip it.
    const line = rawLine.slice(1);

    // Page header lines – skip without affecting skipNextLine state.
    if (/^\d{5}-PL\d/.test(line)) continue;

    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }

    const trimmed = line.trimStart();

    // --- Section detection ---
    if (trimmed === "Compiler Source") {
      section = "compilerSource";
      skipNextLine = true;
      continue;
    }
    if (trimmed === "Unreferenced Identifiers") {
      section = "unreferencedIdentifiers";
      skipNextLine = true;
      continue;
    }
    if (trimmed.startsWith("Attribute/Xref Table")) {
      section = "xrefTable";
      skipNextLine = true;
      continue;
    }
    if (trimmed === "Compiler Messages") {
      section = "compilerMessages";
      skipNextLine = true;
      continue;
    }
    if (/^MACRO\b.*Messages$/.test(trimmed)) {
      section = "macroMessages";
      skipNextLine = true;
      continue;
    }
    if (trimmed.startsWith("File Reference Table")) {
      section = "fileTable";
      skipNextLine = true;
      continue;
    }
    if (/CICS \(Built:\d+\) Messages/.test(trimmed)) {
      section = "cicsMessages";
      skipNextLine = true;
      continue;
    }
    // Component summary / end-of-compilation – stop collecting.
    if (
      trimmed.startsWith("Component ") ||
      trimmed.startsWith("End of compilation")
    ) {
      section = "none";
      continue;
    }

    // --- Content parsing per section ---
    switch (section) {
      case "compilerSource": {
        const m = line.match(/^\s+(\d+\.\d+)\s*(.*)/);
        if (m) {
          const [, rawPosition, text] = m;
          const position = parsePosition(rawPosition);
          if (position) {
            result.compilerSource.push({ position, text });
          }
        }
        break;
      }

      case "xrefTable": {
        // New entry: {+++++++|*******|line.file}  {identifier}  {Refs|Sets}: {pos...}
        const newEntry = line.match(
          /^\s+(\+{7}|\*{7}|\d+\.\d+)\s+(\S+)\s+(Refs|Sets):\s*(.*)/,
        );
        if (newEntry) {
          const [, rawDefinedAt, identifier, kind, rawPositions] = newEntry;
          const definedAt = parsePosition(rawDefinedAt);
          const positions = parsePositions(rawPositions);
          const entry: XrefEntry = {
            definedAt,
            identifier,
            refs: [],
            sets: [],
          };
          if (kind === "Refs") entry.refs = positions;
          else entry.sets = positions;
          result.xrefTable.push(entry);
        } else {
          // Continuation line: additional {Refs|Sets} for the previous entry
          const cont = line.match(/^\s+(Refs|Sets):\s*(.*)/);
          if (cont && result.xrefTable.length > 0) {
            const [, kind, rawPositions] = cont;
            const last = result.xrefTable[result.xrefTable.length - 1];
            const positions = parsePositions(rawPositions);
            if (kind === "Refs") last.refs.push(...positions);
            else last.sets.push(...positions);
          }
        }
        break;
      }

      case "cicsMessages":
      case "compilerMessages":
      case "macroMessages": {
        const source =
          section === "cicsMessages"
            ? CICSPreprocessorBase.Name
            : PliLanguageName;
        // Format: {IBM<code>} {severity}  {line.file}  {description}
        const m = line.match(/^\s*(IBM\w+)\s+([IWESUL])\s+(\d+\.\d+)\s+(.*)/);
        if (m) {
          const [, code, severity, rawPosition, description] = m;
          const position = parsePosition(rawPosition);
          if (position) {
            const msg: CompilerMessage = {
              code,
              severity: severity as MessageSeverity,
              position,
              description: description.trim(),
              source,
            };
            if (section === "macroMessages") {
              result.macroMessages.push(msg);
            } else {
              result.compilerMessages.push(msg);
            }
          }
        }
        break;
      }

      case "fileTable": {
        // Format: {index}  [{includedFrom}]  {name}
        const m = line.match(/^\s+(\d+)\s+(\d+\.\d+\s+)?(\S.*)/);
        if (m) {
          const [, index, includedFromRaw, name] = m;
          const includedFrom = parsePosition(includedFromRaw?.trim());
          result.fileTable.push({
            fileIndex: parseInt(index, 10),
            includedFrom,
            name: name.trim(),
          });
        }
        break;
      }
    }
  }

  return result;
}
