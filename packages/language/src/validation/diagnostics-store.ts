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

export class DiagnosticsStore {
  private keys = new Set<string>();
  private diagnostics: Diagnostic[][] = [];

  constructor() {
    for (let i = 0; i <= DiagnosticCategory.Validation; i++) {
      this.diagnostics[i] = [];
    }
  }

  clear(): void {
    this.keys.clear();
    for (let i = 0; i <= DiagnosticCategory.Validation; i++) {
      this.diagnostics[i] = [];
    }
  }

  add(category: DiagnosticCategory, diagnostic: Diagnostic): void {
    const key = this.getDiagnosticKey(diagnostic);
    if (!key || this.keys.has(key)) {
      return;
    }
    this.keys.add(key);
    this.diagnostics[category].push(diagnostic);
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
    return this.diagnostics[category];
  }

  getAll(): Diagnostic[] {
    return this.diagnostics.flat();
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
