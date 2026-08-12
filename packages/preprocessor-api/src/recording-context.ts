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

/** One recorded `resolveInclude` call - see {@link RecordingPreprocessorContext}. */
export interface RecordedInclude {
  name: string;
  range?: Range;
}

/**
 * A minimal in-memory {@link PreprocessorContext} that records every call it receives.
 * A `Preprocessor`'s complete observable output flows through the interface's members
 * (edits with their classified token lists, diagnostics, include resolutions), so running
 * `execute` against this recorder and asserting on what was recorded is a full conformance
 * check of a preprocessor implementation - including a future external one talking over a
 * serialized boundary. `resolveInclude` records the attempt and reports it unresolved
 * (returns `undefined`); `insertContext` records the call.
 */
export class RecordingPreprocessorContext implements PreprocessorContext {
  readonly diagnostics: Diagnostic[] = [];
  /** Recorded `replace` calls - how a preprocessor rewrites `EXEC` fragments in place. */
  readonly edits: RecordedEdit[] = [];
  readonly includes: RecordedInclude[] = [];
  /**
   * Recorded `insertContext` calls - how a preprocessor splices a resolved include's own
   * (recursively processed) context into the text, as opposed to a flat `replace`.
   */
  readonly insertions: { offset: number; context: PreprocessorContext }[] = [];

  constructor(readonly text: string) {}

  pushDiagnostic(diagnostic: Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }

  replace(range: Range, text: string, tokens?: Token[]): void {
    this.edits.push({ range, text, tokens: tokens ?? [] });
  }

  async resolveInclude(
    name: string,
    range?: Range,
  ): Promise<PreprocessorContext | undefined> {
    this.includes.push({ name, range });
    return undefined;
  }

  insertContext(offset: number, nested: PreprocessorContext): void {
    this.insertions.push({ offset, context: nested });
  }
}
