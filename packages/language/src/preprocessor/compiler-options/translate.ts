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

import {
  CompilerOptionResult,
  CompilerOptionsPP,
  getDefaultCompilerOptions,
} from "./options";
import {
  AbstractCompilerOptions,
  parseAbstractCompilerOptions,
} from "./parser";
import { CompilerOption, SyntaxKind } from "../../syntax-tree/ast";
import { getTranslator as getTranslatorPLI } from "./translator-pli";
import { getTranslator as getTranslatorMacro } from "./translator-macro";
import { getTranslator as getTranslatorSQL } from "./translator-sql";
import {
  CompilerOptions,
  CompilerOptions as CompilerOptionsPLI,
} from "./options-pli";
import { CompilerOptions as CompilerOptionsMacro } from "./options-macro";
import { CompilerOptions as CompilerOptionsSQL } from "./options-sql";
import {
  CompilerOptionSource,
  RuleConfiguration,
  Translator,
} from "./translator";
import { Diagnostic, Range } from "../../language-server/types";

export interface DiagnosticAnchor {
  range: Range;
  uri: string;
  message: (text: string) => string;
}
export class CompilerOptionTranslator {
  protected translator = getTranslatorPLI();
  protected translatorMacro = getTranslatorMacro();
  protected translatorSQL = getTranslatorSQL();

  protected result: CompilerOptionResult = {
    options: getDefaultCompilerOptions(),
    tokens: [],
    comments: [],
    issues: [],
  };

  protected diagnosticAnchor: DiagnosticAnchor | null | undefined = undefined;

  translateCompilerOptions(
    input: AbstractCompilerOptions,
    configuration?: RuleConfiguration,
  ): void {
    const options = this.optionsToUpperCase(input.options);
    if (options.some((option) => option.name === "PP")) {
      // If there are PP compiler options, ignore the defaults, because the settings in PP start empty and are accumulated.
      // Keep the ppInclude value that might have been set previously.
      this.translator.options.pp = {
        items: [],
        ppInclude: this.translator.options.pp?.ppInclude,
      };
    }
    for (const option of options) {
      this.translator.translate(option, configuration);
    }

    // Handle nested compiler options that are not yet parsed.
    this.parseNestedOptions(
      this.translatorMacro,
      CompilerOptions.PPItemName.MACRO,
      this.translator.options.ppMacro,
      configuration,
    );
    this.parseNestedOptions(
      this.translatorSQL,
      CompilerOptions.PPItemName.SQL,
      this.translator.options.ppSql,
      configuration,
    );

    this.result.options = {
      ...(this.translator.options as CompilerOptionsPLI),
      macroOptions: this.translatorMacro.options as CompilerOptionsMacro,
      sqlOptions: this.translatorSQL.options as CompilerOptionsSQL,
    };
    if (configuration?.source === CompilerOptionSource.SOURCE_FILE) {
      this.result.tokens.push(...input.tokens);
      this.result.comments.push(...input.comments);
    }
    this.result.issues.push(
      ...this.applyDiagnosticAnchor([
        ...this.translator.diagnostics,
        ...this.translatorMacro.diagnostics,
        ...this.translatorSQL.diagnostics,
      ]),
    );
    this.translator.clearIssues();
    this.translatorMacro.clearIssues();
    this.translatorSQL.clearIssues();
  }

  clear(): void {
    this.translator.clear();
    this.translatorMacro.clear();
    this.translatorSQL.clear();
    this.result = {
      options: getDefaultCompilerOptions(),
      tokens: [],
      comments: [],
      issues: [],
    };
  }

  getResults(): CompilerOptionResult {
    return this.result;
  }

  /**
   * Returns a stable fingerprint of all forceRecompile-flagged rules and their arguments
   * across PLI, Macro, and SQL translators. Used to invalidate InstructionCache.
   */
  getRecompileFingerprint(): string {
    return [
      this.translator.getRecompileFingerprint(),
      this.translatorMacro.getRecompileFingerprint("MACRO"),
      this.translatorSQL.getRecompileFingerprint("SQL"),
    ].join("\n--\n");
  }

  protected parseNestedOptions<T extends CompilerOptionsPP>(
    ppTranslator: Translator<T>,
    ppItemName: CompilerOptions.PPItemName,
    ppDirectValue: CompilerOptions.PPValue | false | undefined,
    configuration?: RuleConfiguration,
  ): void {
    const items: CompilerOptions.PPValue[] = [
      ...(ppDirectValue ? [ppDirectValue] : []),
    ];

    // Process items from pp.items array and mark them as processed
    const ppItems =
      this.translator.options.pp?.items.filter(
        (item) =>
          item.name === ppItemName &&
          typeof item.value === "string" &&
          !item.processed,
      ) ?? [];

    items.push(...ppItems);

    for (const item of items) {
      const nestedOptions = parseAbstractCompilerOptions(
        item.value as string,
        item.token?.uri,
        (item.token?.startOffset ?? 0) + 1,
        item.token?.startLine,
        (item.token?.startColumn ?? 0) + 1,
      );
      item.processed = true;
      const options = this.optionsToUpperCase(nestedOptions.options);
      options.forEach((option) =>
        ppTranslator.translate(option, configuration),
      );
      ppTranslator.diagnostics.push(...nestedOptions.issues);
    }
  }

  // TODO ssmifi: remove the upper cases from the individual rules.
  protected optionsToUpperCase(options: CompilerOption[]): CompilerOption[] {
    const upperCasedOptions: CompilerOption[] = [...options];
    const optionToUpperCase = (option: CompilerOption) => {
      option.name = option.name.toUpperCase();
      for (const value of option.values) {
        switch (value.kind) {
          case SyntaxKind.CompilerOptionText:
            value.value = value.value.toUpperCase();
            break;
          case SyntaxKind.CompilerOption:
            optionToUpperCase(value);
        }
      }
    };

    upperCasedOptions.forEach(optionToUpperCase);
    return upperCasedOptions;
  }

  setDiagnosticAnchor(): void;
  setDiagnosticAnchor(
    range: Range,
    uri: string,
    message: (text: string) => string,
  ): void;
  setDiagnosticAnchor(
    range?: Range,
    uri?: string,
    message?: (text: string) => string,
  ): void {
    if (!range || !uri || !message) {
      this.diagnosticAnchor = null;
    } else {
      this.diagnosticAnchor = { range, uri, message };
    }
  }

  clearDiagnosticAnchor(): void {
    this.diagnosticAnchor = undefined;
  }

  protected applyDiagnosticAnchor(diagnostics: Diagnostic[]): Diagnostic[] {
    if (this.diagnosticAnchor === undefined) {
      return diagnostics;
    } else if (this.diagnosticAnchor === null) {
      return [];
    } else {
      return diagnostics.map((diag) => ({
        ...diag,
        range: this.diagnosticAnchor!.range,
        uri: this.diagnosticAnchor!.uri,
        message: this.diagnosticAnchor!.message(diag.message),
      }));
    }
  }

  addIssues(issues: Diagnostic[]): void {
    this.result.issues.push(...this.applyDiagnosticAnchor(issues));
  }
}
