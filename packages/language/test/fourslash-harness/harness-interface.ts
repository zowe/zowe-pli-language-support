import { CompletionKeywords } from "../../src/language-server/completion/keywords";
import { Diagnostic } from "../../src/language-server/types";
import { PLICodes } from "../../src/validation/messages";
import { ExpectedCompletion } from "../test-builder";
import { type Severity } from "../../src/language-server/types";

type Label = string | number;

export interface HarnessTesterInterface {
  verify: {
    /**
     * Expect that the given label has the given error codes.
     * @param label The label to expect the error codes at.
     * @param codes The error codes to expect.
     */
    expectExclusiveErrorCodesAt(label: Label, codes: string[] | string): void;
    /**
     * Expect that the given label has the given diagnostics.
     * @param label The label to expect the diagnostics at.
     * @param diagnostics The diagnostics to expect.
     */
    expectExclusiveDiagnosticsAt(
      label: Label,
      diagnostics: Partial<Diagnostic> | Partial<Diagnostic>[],
    ): void;
    /**
     * Expect that the compilation unit has no diagnostics.
     */
    noDiagnostics(): void;
  };

  linker: {
    /**
     * Expect that the defined links actually links to the correct target.
     */
    expectLinks(): void;
    /**
     * Expect that the defined links do not link to the given label.
     * @param label The label to expect no links at.
     */
    expectNoLinksAt(label: Label): void;
  };

  completion: {
    /**
     * Expect that the completion items at the given label contains the given content.
     *
     * @param label The label to expect the completion items at.
     * @param expected The expected completion items.
     */
    expectAt(label: Label, expected: ExpectedCompletion): void;
  };

  code: {
    Severe: typeof PLICodes.Severe;
    Warning: typeof PLICodes.Warning;
    Information: typeof PLICodes.Info;
    Error: typeof PLICodes.Error;
  };

  constants: {
    CompletionKeywords: typeof CompletionKeywords;
    Severity: typeof Severity;
  };
}
