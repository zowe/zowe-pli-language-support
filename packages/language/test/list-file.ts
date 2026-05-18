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

import { Severity } from "../src/language-server/types";
import { tokenize } from "../src/parser/tokenizer";
import { Token } from "../src/parser/tokens";
import { URI } from "../src/utils/uri";
import type { ParsedListFile, CompilerMessage } from "./list-file-parser";

export interface File {
  index: number;
  uri: URI;
}

export interface FilePosition {
  line: number;
  file: File;
}

export interface Definition {
  position: FilePosition | undefined;
  name: string;
  refs: FilePosition[];
  sets: FilePosition[];
}

export interface Diagnostic {
  code: string;
  severity: Severity;
  position: FilePosition;
  message: string;
}

export class ListFile {
  files: File[] = [];
  definitions: Definition[] = [];
  diagnostics: Diagnostic[] = [];
  sourceCode: string = "";

  getTokens(): Token[] {
    const result = tokenize(this.sourceCode, undefined);
    return result.tokens;
  }

  getFile(index: number): File {
    const file = this.files.find((f) => f.index === index);
    if (!file) {
      throw new Error(`File with index ${index} not found in listing.`);
    }
    return file;
  }

  getDiagnostics(line: number): Diagnostic[] {
    return this.diagnostics.filter((msg) => msg.position.line === line);
  }
}

export function fromParsedListFile(parsed: ParsedListFile): ListFile {
  const listFile = new ListFile();
  const files = parsed.fileTable.map((entry) => ({
    index: entry.fileIndex,
    uri: URI.file(entry.name),
  }));
  listFile.files = files;
  listFile.sourceCode = parsed.compilerSource
    .map((line) => line.text)
    .join("\n");
  listFile.diagnostics = parsed.compilerMessages.map((msg) =>
    compilerMessageToDiagnostic(listFile, msg),
  );
  listFile.diagnostics.push(
    ...parsed.macroMessages.map((msg) =>
      compilerMessageToDiagnostic(listFile, msg),
    ),
  );
  listFile.definitions = parsed.xrefTable.map((entry) => ({
    position: entry.definedAt
      ? {
          line: entry.definedAt.line,
          file: listFile.getFile(entry.definedAt.file),
        }
      : undefined,
    name: entry.identifier,
    refs: entry.refs.map((ref) => ({
      line: ref.line,
      file: listFile.getFile(ref.file),
    })),
    sets: entry.sets.map((set) => ({
      line: set.line,
      file: listFile.getFile(set.file),
    })),
  }));
  return listFile;
}

function compilerMessageToDiagnostic(
  listFile: ListFile,
  msg: CompilerMessage,
): Diagnostic {
  let severity: Severity = Severity.I;
  switch (msg.severity) {
    case "I":
      severity = Severity.I;
      break;
    case "W":
      severity = Severity.W;
      break;
    case "E":
      severity = Severity.E;
      break;
    case "S":
      severity = Severity.S;
      break;
    case "U":
      severity = Severity.U;
      break;
    case "L":
      throw new Error("Severity L is not supported in diagnostics.");
  }
  return {
    code: msg.code,
    severity,
    message: msg.description,
    position: {
      line: msg.position.line,
      file: listFile.getFile(msg.position.file),
    },
  };
}
