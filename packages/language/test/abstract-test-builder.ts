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

import { Diagnostic, fullCode, Severity } from "../src/language-server/types";
import { isPLICode, PLICode } from "../src/validation/pli-codes";
import {
  createTestFiles,
  extractIndices,
  extractRanges,
  PliTestFile,
  TestFile,
  TestIndex,
  TestRange,
} from "./utils";

export type Label = string | number | string[] | number[];

/**
 * Extended Diagnostic type that allows RegExp for message field in tests.
 * This enables more flexible message matching that is less brittle to, e.g., parser changes.
 */
export type TestDiagnostic = Omit<Partial<Diagnostic>, "message"> & {
  message?: string | RegExp;
};

/**
 * Type for diagnostic expectations in tests.
 * Accepts TestDiagnostic (with optional RegExp message), PLICode, or arrays of either.
 */
export type DiagnosticExpectation =
  | TestDiagnostic
  | TestDiagnostic[]
  | PLICode
  | PLICode[];

/**
 * Structural shape that both `Diagnostic` (language-server) and listing diagnostics
 * satisfy. The shared diagnostic matcher/formatter operates on this minimal contract.
 */
export type DiagnosticLike = {
  code?: string;
  severity?: Severity;
  message?: string;
};

/**
 * Base class for test builders that share the same marker-based file/index/range setup.
 *
 * Subclasses hold backend-specific state (e.g. a `CompilationUnit` or a compiler listing)
 * but inherit the shared scaffolding for: file/marker initialization, label resolution,
 * and the diagnostic matcher used by `expectDiagnosticsAt`-style assertions.
 */
export abstract class AbstractTestBuilder {
  protected files: Map<string, TestFile> = new Map();
  protected indices: Record<string, TestIndex[]> = {};
  protected ranges: Record<string, TestRange[]> = {};

  /**
   * Populate `files`, `indices`, and `ranges` from the marker-annotated source files.
   * Subclasses call this from their own `init()` before doing backend-specific work.
   */
  protected initMarkerState(files: PliTestFile[]): void {
    this.files = createTestFiles(files);
    this.indices = extractIndices(this.files);
    this.ranges = extractRanges(this.files);
  }

  /**
   * Apply `fn` once per label. Accepts a single label, a numeric label, or an array of
   * labels - flattening the array fan-out that both subclasses used to inline at the
   * top of `expectDiagnosticsAt`.
   */
  protected forEachLabel(label: Label, fn: (label: string) => void): void {
    if (Array.isArray(label)) {
      for (const l of label) {
        fn(l.toString());
      }
    } else {
      fn(label.toString());
    }
  }

  /**
   * Look up the unique range for `label`. Throws if the label has no ranges, or more
   * than one - backends that need a single line/range per label rely on this.
   */
  protected resolveSingleRange(label: string): TestRange {
    const ranges = this.ranges[label];
    if (!ranges || ranges.length === 0) {
      throw new Error(`No range found for label ${label}`);
    }
    if (ranges.length > 1) {
      throw new Error(
        `Multiple ranges found for label ${label}, expected only one.`,
      );
    }
    return ranges[0];
  }

  /**
   * Map a character offset within a test file to a 1-based line number, as expected by
   * compiler listing diagnostics.
   */
  protected offsetToLine(file: TestFile, offset: number): number {
    return file.output.slice(0, offset).split("\n").length;
  }

  /**
   * Check whether `actual` (any diagnostic carrying `code`/`severity`/`message`)
   * satisfies an expected `TestDiagnostic` or `PLICode`.
   * Supports RegExp patterns for string fields and structural equality for nested objects.
   */
  protected diagnosticMatchesExpectation<T extends DiagnosticLike>(
    actual: T,
    expected: TestDiagnostic | PLICode,
  ): boolean {
    if (isPLICode(expected)) {
      return actual.code === fullCode(expected);
    }

    for (const key of Object.keys(expected)) {
      const expectedValue = (expected as any)[key];
      const actualValue = (actual as any)[key];

      if (typeof expectedValue === "object" && expectedValue !== null) {
        // Check if it is a RegExp. We cannot use `instanceof` here because the
        // RegExp might come from a different realm.
        if (typeof expectedValue.test === "function") {
          if (
            typeof actualValue !== "string" ||
            !expectedValue.test(actualValue)
          ) {
            return false;
          }
        } else {
          if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
            return false;
          }
        }
      } else {
        if (actualValue !== expectedValue) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Format an expected diagnostic for inclusion in error messages.
   * Properly stringifies RegExp values (their `.toString()` is more useful than
   * `JSON.stringify`, which produces `{}`).
   */
  protected formatExpectedDiagnostic(
    expected: TestDiagnostic | PLICode,
  ): string {
    if (isPLICode(expected)) {
      return `code: ${fullCode(expected)}`;
    }

    const parts: string[] = [];
    for (const key of Object.keys(expected)) {
      const value = (expected as any)[key];

      if (typeof value === "object" && value !== null) {
        if (typeof value.test === "function") {
          parts.push(`${key}: ${value.toString()}`);
        } else {
          parts.push(`${key}: ${JSON.stringify(value)}`);
        }
      } else {
        parts.push(`${key}: ${JSON.stringify(value)}`);
      }
    }
    return `{ ${parts.join(", ")} }`;
  }
}
