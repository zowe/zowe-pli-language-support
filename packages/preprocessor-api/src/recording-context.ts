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

import { Diagnostic, PreprocessorContext, Range, Token } from "./types";

/** One recorded `replace` call - see {@link RecordingPreprocessorContext}. */
export interface RecordedEdit {
  range: Range;
  text: string;
  tokens: Token[];
}

/** One recorded `include` call - see {@link RecordingPreprocessorContext}. */
export interface RecordedInclude {
  name: string;
  statementRange: Range;
  nameRange: Range;
  context?: RecordingPreprocessorContext;
}

/**
 * A minimal in-memory {@link PreprocessorContext} that records every call it receives.
 * Used for testing certain preprocessor features.
 */
export class RecordingPreprocessorContext implements PreprocessorContext {
  readonly diagnostics: Diagnostic[] = [];
  /** Recorded `replace` calls - how a preprocessor rewrites `EXEC` fragments in place. */
  readonly edits: RecordedEdit[] = [];
  readonly includes: RecordedInclude[] = [];

  constructor(
    readonly text: string,
    readonly documentUri: string = "file:///main.pli",
    readonly unitUri: string = documentUri,
    private readonly includeTexts: Readonly<Record<string, string>> = {},
  ) {}

  pushDiagnostic(diagnostic: Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }

  replace(range: Range, text: string, tokens?: Token[]): void {
    this.edits.push({ range, text, tokens: tokens ?? [] });
  }

  async include(
    name: string,
    statementRange: Range,
    nameRange: Range,
    tokens?: Token[],
  ): Promise<PreprocessorContext | undefined> {
    const included = this.includeTexts[name];
    const context =
      included === undefined
        ? undefined
        : new RecordingPreprocessorContext(
            included,
            `file:///${name}.inc`,
            this.unitUri,
            this.includeTexts,
          );
    this.includes.push({ name, statementRange, nameRange, context });
    this.replace(statementRange, "", tokens);
    return context;
  }
}
