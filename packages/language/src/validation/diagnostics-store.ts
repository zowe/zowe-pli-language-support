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

import { Diagnostic } from "../language-server/types";
import { ValidationAcceptor } from "./validator";

export enum DiagnosticCategory {
  CompilerOptions,
  Lexer,
  Parser,
  SymbolTable,
  Linking,
  TypeSystem,
  Validation,
}


export const DiagnosticCategoryToString: Record<DiagnosticCategory, string> = {
  [DiagnosticCategory.CompilerOptions]: "compiler options errors",
  [DiagnosticCategory.Lexer]: "lexing errors",
  [DiagnosticCategory.Parser]: "parsing errors",
  [DiagnosticCategory.SymbolTable]: "symbol table errors",
  [DiagnosticCategory.Linking]: "linking errors",
  [DiagnosticCategory.TypeSystem]: "type system errors",
  [DiagnosticCategory.Validation]: "validation errors",
};

const MaxCategory = Math.max(
  ...(Object.values(DiagnosticCategory).filter(
    (v) => typeof v === "number",
  ) as number[]),
);

export class DiagnosticsStore {
  private keys = new Set<string>();
  private diagnosticsByCategoryAndUri: Map<DiagnosticCategory, Map<string, Diagnostic[]>> = new Map();

  constructor() {
    for (let i = 0; i <= MaxCategory; i++) {
      this.diagnosticsByCategoryAndUri.set(i, new Map());
    }
  }

  clear(): void {
    this.keys.clear();
    for (let i = 0; i <= MaxCategory; i++) {
      this.diagnosticsByCategoryAndUri.get(i)!.clear();
    }
  }

  add(category: DiagnosticCategory, diagnostic: Diagnostic): void {
    const key = this.getDiagnosticKey(diagnostic);
    if (!key || this.keys.has(key)) {
      return;
    }
    this.keys.add(key);
    const uri = diagnostic.uri ?? "";
    const diagnosticsByUri = this.diagnosticsByCategoryAndUri.get(category)!;
    if (!diagnosticsByUri.has(uri)) {
      diagnosticsByUri.set(uri, []);
    }
    diagnosticsByUri.get(uri)!.push(diagnostic);
  }

  addAll(
    category: DiagnosticCategory,
    diagnostics: Iterable<Diagnostic>,
  ): void {
    for (const diagnostic of diagnostics) {
      this.add(category, diagnostic);
    }
  }

  get(category: DiagnosticCategory): Diagnostic[] {
    const diagnosticsByUri = this.diagnosticsByCategoryAndUri.get(category)!;
    return Array.from(diagnosticsByUri.values()).flat();
  }

  getByUri(category: DiagnosticCategory, uri: string): Diagnostic[] {
    const diagnosticsByUri = this.diagnosticsByCategoryAndUri.get(category)!;
    return diagnosticsByUri.get(uri) ?? [];
  }

  getAll(): Diagnostic[] {
    return Array.from(this.diagnosticsByCategoryAndUri.values())
      .map((diagnosticsByUri) => Array.from(diagnosticsByUri.values()).flat())
      .flat();
  }

  getAcceptor(category: DiagnosticCategory): ValidationAcceptor {
    return (diagnostic: Diagnostic) => this.add(category, diagnostic);
  }

  private getDiagnosticKey(diagnostic: Diagnostic): string | undefined {
    if (diagnostic.range && diagnostic.uri) {
      return `${diagnostic.uri}@${diagnostic.range.start}-${diagnostic.range.end}:${diagnostic.code ?? diagnostic.message}`;
    }
    return undefined;
  }
}
