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

import { CompilerOptionsPP } from "./options";
import {
  Diagnostic,
  diagnosticFromCode,
  isDiagnostic,
} from "../../language-server/types";
import {
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  CompilerOptionValue,
  SyntaxKind,
} from "../../syntax-tree/ast";
import { ParametricPLICode } from "../../validation/pli-codes";
import { CompilerOptionsCodes } from "./codes";
import { getEnumKeys } from "../util";

interface TranslatorRule<T extends CompilerOptionsPP = CompilerOptionsPP> {
  positive?: string[];
  negative?: string[];
  positiveTranslate?: Translate<T>;
  negativeTranslate?: Translate<T>;
  settings?: RuleSettings;
}

export enum CompilerOptionSource {
  SOURCE_FILE,
  PLUGIN_CONFIG,
}

export interface RuleConfiguration {
  source?: CompilerOptionSource;
}

export interface RuleSettings {
  allowDuplicates?: boolean;
  /**
   * When true, indicates that whenever this rule applies (or whenever its concrete
   * argument values change), downstream caches (notably InstructionCache) must
   * invalidate and the file must be re-tokenized/re-parsed.
   *
   * Set this on any rule whose effect reaches the lexer, preprocessor, or parser
   * (e.g. MARGINS, MARGINI, OR, NOT, PROCESS, CASE, GRAPHIC, BRACKETS, BLANK, NAMES, ...).
   */
  recompile?: boolean;
}

type TranslationDiagnosticAcceptor = (diagnostic: Diagnostic) => void;

type Translate<T extends CompilerOptionsPP> = (
  option: CompilerOption,
  options: T,
  acceptor: TranslationDiagnosticAcceptor,
  configuration?: RuleConfiguration,
) => void;

/**
 * Tracks how a rule is applied, either positively or negatively
 */
enum RuleAlignment {
  POSITIVE = 1,
  NEGATIVE = -1,
}

/**
 * Tracks how a rule was applied, including alignment and serialized arguments
 */
type AppliedRuleRecord = {
  alignment: RuleAlignment;
  /** Serialized argument values, used for the recompile fingerprint. */
  args?: string;
};

export class Translator<T extends CompilerOptionsPP = CompilerOptionsPP> {
  options: T;
  diagnostics: Diagnostic[] = [];

  constructor(private defaultsFactory: () => T) {
    this.options = defaultsFactory();
  }

  /**
   * Translator rules that have been applied to the current options,
   * along w/ info on whether they were applied positively or negatively,
   * and their concrete argument values (for recompile fingerprinting).
   */
  appliedRules = new Map<TranslatorRule<T>, AppliedRuleRecord>();

  private rules: TranslatorRule<T>[] = [];

  rule(
    positive: string[],
    positiveTranslate: Translate<T>,
    negative?: string[],
    negativeTranslate?: Translate<T>,
    settings?: RuleSettings,
  ) {
    this.rules.push({
      positive,
      negative,
      positiveTranslate,
      negativeTranslate,
      settings,
    });
  }

  flag(
    key: keyof T,
    positive: string[],
    negative: string[],
    callback?: (option: CompilerOption, options: T) => void,
    settings?: RuleSettings,
  ) {
    this.rules.push({
      positive,
      positiveTranslate: (option, options) => {
        ensureArguments(option, 0, 0);
        (options as any)[key] = true;
        callback?.(option, options);
      },
      negative,
      negativeTranslate: (option, options) => {
        ensureArguments(option, 0, 0);
        (options as any)[key] = false;
        callback?.(option, options);
      },
      settings,
    });
  }

  clear() {
    this.appliedRules.clear();
    this.diagnostics = [];
    this.options = this.defaultsFactory();
  }

  clearIssues() {
    this.diagnostics = [];
  }

  /**
   * Indicates whether a translator rule has been applied to a given option on this run
   */
  isRuleApplied(rule: TranslatorRule<T>): boolean {
    return this.appliedRules.get(rule) !== undefined;
  }

  /**
   * Assumes a rule has been applied, checks if it was applied positively
   */
  isRuleAlignedWith(
    rule: TranslatorRule<T>,
    alignment: RuleAlignment,
  ): boolean {
    return this.appliedRules.get(rule)?.alignment === alignment;
  }

  translate(option: CompilerOption, configuration?: RuleConfiguration): void {
    const name = option.name.toUpperCase();

    const reportError = (error: unknown) => {
      if (isDiagnostic(error)) {
        this.diagnostics.push(error);
      } else {
        console.error(
          "Encountered unexpected error during compiler options translation:",
          String(error),
        );
      }
    };

    const rule = this.rules.find(
      (r) => r.positive?.includes(name) || r.negative?.includes(name),
    );

    if (rule) {
      const alignment =
        rule.positive && rule.positive.includes(name)
          ? RuleAlignment.POSITIVE
          : RuleAlignment.NEGATIVE;
      const translate =
        alignment === RuleAlignment.POSITIVE
          ? rule.positiveTranslate
          : rule.negativeTranslate;

      if (!this.isRuleApplied(rule)) {
        const args = this.serializeOptionValues(option);
        this.appliedRules.set(rule, { alignment, args });
      } else if (this.isRuleAlignedWith(rule, alignment)) {
        if (!rule.settings?.allowDuplicates) {
          this.reportDupeOptIssue(option, name);
        }
      } else {
        this.reportMutexOptIssue(option, name);
      }

      try {
        const localDiagnostics: Diagnostic[] = [];
        const diagnosticsAcceptor: TranslationDiagnosticAcceptor = (
          diagnostic: Diagnostic,
        ) => {
          localDiagnostics.push(diagnostic);
        };
        translate?.(option, this.options, diagnosticsAcceptor, configuration);
        this.diagnostics.push(...localDiagnostics); // Only add diagnostics if no exception was thrown.
      } catch (err) {
        reportError(err);
      }
    } else {
      this.diagnostics.push(
        diagnosticFromCode(
          CompilerOptionsCodes.UnknownOption,
          option.token,
          option.name,
        ),
      );
    }
  }

  /**
   * Adds a duplicate compiler option issue to the list of issues.
   */
  reportDupeOptIssue(option: CompilerOption, name: string): void {
    this.diagnostics.push(
      diagnosticFromCode(
        CompilerOptionsCodes.DupeOptionIssue,
        option.token,
        name,
      ),
    );
  }

  /**
   * Adds a mutually exclusive compiler option issue to the list of issues.
   */
  reportMutexOptIssue(option: CompilerOption, name: string): void {
    this.diagnostics.push(
      diagnosticFromCode(
        CompilerOptionsCodes.MutexOptionIssue,
        option.token,
        name,
      ),
    );
  }

  /**
   * Serializes the arguments of a compiler option for fingerprint comparison.
   */
  private serializeOptionValues(option: CompilerOption): string {
    const parts: string[] = [];
    for (const value of option.values) {
      if (value.kind === SyntaxKind.CompilerOption) {
        parts.push(`${value.name}(${this.serializeOptionValues(value)})`);
      } else if (
        value.kind === SyntaxKind.CompilerOptionText ||
        value.kind === SyntaxKind.CompilerOptionString
      ) {
        parts.push(value.value);
      }
    }
    return parts.join(",");
  }

  /**
   * Stable string identifying which forceRecompile-flagged rules applied, and how.
   * Used to invalidate InstructionCache when recompile-relevant options change.
   * @param prefix Optional prefix to distinguish between PLI/Macro/SQL translators
   */
  getRecompileFingerprint(prefix?: string): string {
    const parts: string[] = [];
    for (const [rule, rec] of this.appliedRules) {
      if (!rule.settings?.recompile) continue;
      const id = (rule.positive?.[0] ?? rule.negative?.[0]) || "?";
      const entry = `${id}|${rec.alignment}|${rec.args ?? ""}`;
      parts.push(prefix ? `${prefix}:${entry}` : entry);
    }
    parts.sort();
    return parts.join("\n");
  }
}

// If a compiler option value is empty, the token actually may contain a closing parenthesis. We don't want to show that in the diagnostics.
export function originalImage(value: CompilerOptionValue): string {
  if (
    value.kind === SyntaxKind.CompilerOptionText ||
    value.kind === SyntaxKind.CompilerOptionString
  ) {
    if (value.value.length === 0) {
      return "";
    }
  }
  return value.token.image;
}

export function ensureArguments(
  option: CompilerOption,
  min: number,
  max?: number,
) {
  if (
    option.values.length < min ||
    (max !== undefined && option.values.length > max)
  ) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.InvalidParameterCount,
      option.token,
      option.values.length,
      min,
      max,
    );
  }
}

export function ensureType(
  value: CompilerOptionValue,
  type: "plain",
): asserts value is CompilerOptionText;
export function ensureType(
  value: CompilerOptionValue,
  type: "plainNotEmpty",
): asserts value is CompilerOptionText;
export function ensureType(
  value: CompilerOptionValue,
  type: "string",
): asserts value is CompilerOptionString;
export function ensureType(
  value: CompilerOptionValue,
  type: "plainOrString",
): asserts value is CompilerOptionString | CompilerOptionText;
export function ensureType(
  value: CompilerOptionValue,
  type: "option",
): asserts value is CompilerOption;
export function ensureType(
  value: CompilerOptionValue,
  type: "option" | "plainOrString" | "string" | "plain" | "plainNotEmpty",
): void {
  if (type === "option") {
    if (value.kind !== SyntaxKind.CompilerOption) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.ExpectedOption,
        value.token,
      );
    }
  } else if (type === "plain" || type === "plainNotEmpty") {
    if (value.kind !== SyntaxKind.CompilerOptionText) {
      throw diagnosticFromCode(CompilerOptionsCodes.ExpectedPlain, value.token);
    }
    if (type === "plainNotEmpty" && value.value.length === 0) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.ExpectedPlainNotEmpty,
        value.token,
      );
    }
  } else if (type === "string") {
    if (value.kind !== SyntaxKind.CompilerOptionString) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.ExpectedString,
        value.token,
      );
    }
  } else if (type === "plainOrString") {
    if (
      value.kind !== SyntaxKind.CompilerOptionText &&
      value.kind !== SyntaxKind.CompilerOptionString
    ) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.ExpectedPlainOrString,
        value.token,
      );
    }
  }
}

export function ensureNumberValue(
  value: CompilerOptionText,
  min?: number,
  max?: number,
): number {
  const num = stringToNumber(value.value);
  if (isNaN(num)) {
    throw diagnosticFromCode(CompilerOptionsCodes.ExpectedNumber, value.token);
  }
  if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.ExpectedNumberRange,
      value.token,
      num,
      min,
      max,
    );
  }
  return num;
}

/**
 * Ensures that a compiler option value matches one of the allowed arguments.
 * Supports two modes:
 *
 * 1. Simple array mode: `["DECIMAL", "HEXADEC"]`
 *    - Accepts and returns exact matches
 *
 * 2. Aliases mode: `[["SHORT", "S"], ["FULL", "F"]]`
 *    - Accepts any alias in each sub-array
 *    - Always returns the canonical form (first element of matched sub-array)
 *    - Example: "S" input returns "SHORT", "F" input returns "FULL"
 */
export function ensureArgument<
  const T extends readonly (readonly [string, ...string[]])[],
>(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  args: T,
): ExtractCanonicalForms<T>;
export function ensureArgument<const T extends readonly string[]>(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  args: T,
): T[number];
export function ensureArgument<T>(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  args: readonly T[] | readonly (readonly [string, ...string[]])[],
): T | string {
  let value;
  if (optionValue.kind === SyntaxKind.CompilerOptionText) {
    value = optionValue.value;
  } else if (optionValue.kind === SyntaxKind.CompilerOptionString) {
    value = optionValue.value;
  } else if (optionValue.kind === SyntaxKind.CompilerOption) {
    value = optionValue.name;
  } else {
    throw new Error("Compiler option value is not supported.");
  }
  let simpleArgs;
  if (args.length > 0 && Array.isArray(args[0])) {
    const aliasGroups = args as readonly (readonly [string, ...string[]])[];
    for (const group of aliasGroups) {
      for (const alias of group) {
        if (value === alias) {
          return group[0]; // Return the canonical form (first element)
        }
      }
    }
    simpleArgs = aliasGroups.flatMap((group) => group); // flatten for error reporting
  } else {
    simpleArgs = args as readonly T[];
    for (const arg of simpleArgs) {
      if (value === arg) {
        return arg;
      }
    }
  }
  throw diagnosticFromCode(
    code,
    optionValue.token,
    originalImage(optionValue),
    ...simpleArgs,
  );
}

type ExtractCanonicalForms<T> = T extends readonly (readonly [
  infer U extends string,
  ...(readonly string[]),
])[]
  ? U
  : never;

export function ensureFlag(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  args: readonly string[],
): boolean {
  return ensureArgument(optionValue, code, args) === args[0];
}

/**
 * Ensures that a compiler option value matches one of the allowed enum values.
 * Returns the matching enum value.
 * Supports both string enums and numeric enums.
 */
export function ensureEnum<T extends Record<string, string | number>>(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  enumObject: T,
  aliases?: readonly (readonly [string, ...string[]])[],
): T[keyof T] {
  let value: string;
  if (optionValue.kind === SyntaxKind.CompilerOptionText) {
    value = optionValue.value.toUpperCase();
  } else if (optionValue.kind === SyntaxKind.CompilerOptionString) {
    value = optionValue.value.toUpperCase();
  } else if (optionValue.kind === SyntaxKind.CompilerOption) {
    value = optionValue.name.toUpperCase();
  } else {
    throw new Error("Compiler option value is not supported.");
  }

  // Check aliases first if provided
  if (aliases) {
    for (const group of aliases) {
      for (const alias of group) {
        if (value === alias.toUpperCase()) {
          const canonical = group[0].toUpperCase();
          // Find enum value matching canonical form
          // Filter out numeric keys (reverse mappings in numeric enums)
          for (const [enumKey, enumValue] of Object.entries(enumObject)) {
            if (isNaN(Number(enumKey)) && enumKey.toUpperCase() === canonical) {
              return enumValue as T[keyof T];
            }
          }
        }
      }
    }
  }

  // Check direct enum values
  // Filter out numeric keys (reverse mappings in numeric enums)
  for (const [enumKey, enumValue] of Object.entries(enumObject)) {
    if (isNaN(Number(enumKey)) && enumKey.toUpperCase() === value) {
      return enumValue as T[keyof T];
    }
  }

  // If not found, throw error with all possible values
  throw diagnosticFromCode(
    code,
    optionValue.token,
    originalImage(optionValue),
    ...getEnumKeys(enumObject),
  );
}

export function ensureToBeDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new Error(CompilerOptionsCodes.ExpectedInitializedValue.message());
  }
}

function stringToNumber(text: string): number {
  const numRegex = /^\s*(\-?\d+)([km])?\s*$/i;
  const match = numRegex.exec(text);
  if (!match) {
    return NaN;
  }
  let num = Number(match[1]);
  if (match[2]) {
    switch (match[2]) {
      case "M":
      case "m":
        num *= 1024 * 1024;
        break;
      // We are not allowed to fall through here because of non-technical reasons.
      case "K":
      case "k":
        num *= 1024;
    }
  }
  return num;
}

export function stringTranslate<
  T extends CompilerOptionsPP = CompilerOptionsPP,
>(callback: (options: T, value: CompilerOptionString) => void): Translate<T> {
  return (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    callback(options, value);
  };
}

export function isEmptyParameterList(option: CompilerOption): boolean {
  // Is only true if there are parentheses without any text inside.
  return (
    option.values.length == 1 &&
    option.values[0].kind == SyntaxKind.CompilerOptionText &&
    option.values[0].value.length == 0
  );
}

/**
 * Helper for translating plain compiler option values that match enum values.
 * Validates against enum object and supports aliases.
 */
export function plainTranslateEnum<
  T extends CompilerOptionsPP = CompilerOptionsPP,
>(
  callback: (options: T, value: CompilerOptionText) => void,
  code: ParametricPLICode,
  enumObject: Record<string, string | number>,
  aliases?: readonly (readonly [string, ...string[]])[],
): Translate<T> {
  return (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    value.value = value.value.toUpperCase();

    ensureEnum(value, code, enumObject, aliases);

    if (aliases) {
      // Canonicalize value.value to the enum key name for the callback
      // This handles aliases: "S" -> "SHORT", "F" -> "FULL", etc.
      const inputValue = value.value.toUpperCase();
      for (const group of aliases) {
        for (const alias of group) {
          if (inputValue === alias.toUpperCase()) {
            value.value = group[0].toUpperCase();
            break;
          }
        }
      }
    }

    // Ensure the final value matches an enum key (case-insensitive)
    // Filter out numeric keys (reverse mappings in numeric enums)
    for (const enumKey of Object.keys(enumObject)) {
      if (
        isNaN(Number(enumKey)) &&
        enumKey.toUpperCase() === value.value.toUpperCase()
      ) {
        value.value = enumKey;
        break;
      }
    }

    callback(options, value);
  };
}

/**
 * Helper for translating plain compiler option values against a list of allowed values.
 * Supports both simple lists and aliases mode.
 */
export function plainTranslate<T extends CompilerOptionsPP = CompilerOptionsPP>(
  callback: (options: T, value: CompilerOptionText) => void,
  code: ParametricPLICode,
  values: readonly string[] | readonly (readonly [string, ...string[]])[],
): Translate<T> {
  return (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    value.value = value.value.toUpperCase();

    // Check if it's aliases mode (array of arrays)
    const isAliasesMode = values.length > 0 && Array.isArray(values[0]);

    if (isAliasesMode) {
      const aliasGroups = values as readonly (readonly [string, ...string[]])[];
      const canonicalValue = ensureArgument(value, code, aliasGroups);
      value.value = canonicalValue;
      callback(options, value);
    } else {
      const stringValues = values as readonly string[];
      ensureArgument(value, code, stringValues);
      callback(options, value);
    }
  };
}

export function getCompilerOptionValueName(value: CompilerOptionValue): string {
  if (
    value.kind === SyntaxKind.CompilerOptionText ||
    value.kind === SyntaxKind.CompilerOptionString
  ) {
    return value.value;
  } else if (value.kind === SyntaxKind.CompilerOption) {
    return value.name;
  }
  throw new Error("Compiler option value is not supported.");
}

export function reportDuplicateSubOptions(
  parent: CompilerOption,
  acceptor: TranslationDiagnosticAcceptor,
) {
  const seen = new Set<string>();
  for (const value of parent.values) {
    const name = getCompilerOptionValueName(value);
    if (seen.has(name)) {
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.DupeOptionIssue,
          value.token,
          `${parent.token.image}(${value.token.image})`,
        ),
      );
    } else {
      seen.add(name);
    }
  }
}

export function reportMutexSubOptions(
  parent: CompilerOption,
  acceptor: TranslationDiagnosticAcceptor,
  mutex: string[][],
) {
  const seen = new Set<string>();
  for (const value of parent.values) {
    const name = getCompilerOptionValueName(value);
    for (const group of mutex) {
      if (group.includes(name)) {
        for (const other of group) {
          if (other !== name && seen.has(other)) {
            acceptor(
              diagnosticFromCode(
                CompilerOptionsCodes.MutexOptionIssue,
                value.token,
                `${parent.token.image}(${value.token.image})`,
              ),
            );
          }
        }
      }
    }
    seen.add(name);
  }
}
