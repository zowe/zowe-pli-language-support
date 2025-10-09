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

import { CompilerOptionIssue, CompilerOptionsPP } from "./options";
import { Severity, tokenToRange } from "../../language-server/types";
import {
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  CompilerOptionValue,
  SyntaxKind,
} from "../../syntax-tree/ast";
import {
  ParametricPLICode,
  Warning as PLIWarning,
} from "../../validation/messages/pli-codes";
import { Token } from "../../parser/tokens";
import { CompilerOptionsCodes } from "./codes";

interface TranslatorRule<T extends CompilerOptionsPP = CompilerOptionsPP> {
  positive?: string[];
  negative?: string[];
  positiveTranslate?: Translate<T>;
  negativeTranslate?: Translate<T>;
}

type Translate<T extends CompilerOptionsPP> = (
  option: CompilerOption,
  options: T,
) => void;

/**
 * Tracks how a rule is applied, either positively or negatively
 */
enum RuleAlignment {
  POSITIVE = 1,
  NEGATIVE = -1,
}

export class Translator<T extends CompilerOptionsPP = CompilerOptionsPP> {
  options: T;
  defaults: T;
  issues: CompilerOptionIssue[] = [];

  constructor(defaults: T) {
    this.defaults = defaults;
    this.options = defaults;
  }

  /**
   * Translator rules that have been applied to the current options,
   * along w/ info on whether they were applied positively or negatively
   */
  appliedRules = new Map<TranslatorRule<T>, RuleAlignment>();

  private rules: TranslatorRule<T>[] = [];

  rule(
    positive: string[],
    positiveTranslate: Translate<T>,
    negative?: string[],
    negativeTranslate?: Translate<T>,
  ) {
    this.rules.push({
      positive,
      negative,
      positiveTranslate,
      negativeTranslate,
    });
  }

  flag(key: keyof T, positive: string[], negative: string[]) {
    this.rules.push({
      positive,
      positiveTranslate: (option, options) => {
        ensureArguments(option, 0, 0);
        (options as any)[key] = true;
      },
      negative,
      negativeTranslate: (option, options) => {
        ensureArguments(option, 0, 0);
        (options as any)[key] = false;
      },
    });
  }

  clear() {
    this.appliedRules.clear();
    this.issues = [];
    this.options = { ...this.defaults };
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
    return this.appliedRules.get(rule) === alignment;
  }

  translate(option: CompilerOption) {
    const name = option.name.toUpperCase();

    const reportError = (err: unknown) => {
      if (err instanceof TranslationError) {
        this.issues.push({
          range: tokenToRange(err.token),
          message: err.message,
          severity: err.severity,
        });
      } else {
        console.error(
          "Encountered unexpected error during compiler options translation:",
          String(err),
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
        this.appliedRules.set(rule, alignment);
      } else if (this.isRuleAlignedWith(rule, alignment)) {
        this.reportDupeOptIssue(option, name);
      } else {
        this.reportMutexOptIssue(option, name);
      }

      try {
        translate?.(option, this.options);
      } catch (err) {
        reportError(err);
      }
    } else {
      this.issues.push({
        range: tokenToRange(option.token),
        message: PLIWarning.IBM1159I.message(option.name),
        severity: Severity.W,
      });
    }
  }

  /**
   * Adds a duplicate compiler option issue to the list of issues.
   */
  reportDupeOptIssue(option: CompilerOption, name: string): void {
    this.issues.push({
      range: tokenToRange(option.token),
      message: CompilerOptionsCodes.DupeOptionIssue.message(name),
      severity: CompilerOptionsCodes.DupeOptionIssue.severity,
    });
  }

  /**
   * Adds a mutually exclusive compiler option issue to the list of issues.
   */
  reportMutexOptIssue(option: CompilerOption, name: string): void {
    this.issues.push({
      range: tokenToRange(option.token),
      message: CompilerOptionsCodes.MutexOptionIssue.message(name),
      severity: CompilerOptionsCodes.MutexOptionIssue.severity,
    });
  }
}

export class TranslationError {
  token: Token;
  message: string;
  severity: Severity;

  constructor(token: Token, message: string, severity: Severity) {
    this.token = token;
    this.message = message;
    this.severity = severity;
  }

  static fromCode(
    token: Token,
    code: ParametricPLICode,
    ...args: (string | number | undefined)[]
  ) {
    return new TranslationError(token, code.message(...args), code.severity);
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
    throw TranslationError.fromCode(
      option.token,
      CompilerOptionsCodes.InvalidParameterCount,
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
      throw new TranslationError(
        value.token,
        CompilerOptionsCodes.ExpectedOption.message(),
        CompilerOptionsCodes.ExpectedOption.severity,
      );
    }
  } else if (type === "plain" || type === "plainNotEmpty") {
    if (value.kind !== SyntaxKind.CompilerOptionText) {
      throw new TranslationError(
        value.token,
        CompilerOptionsCodes.ExpectedPlain.message(),
        CompilerOptionsCodes.ExpectedPlain.severity,
      );
    }
    if (type === "plainNotEmpty" && value.value.length === 0) {
      throw new TranslationError(
        value.token,
        CompilerOptionsCodes.ExpectedPlainNotEmpty.message(),
        CompilerOptionsCodes.ExpectedPlainNotEmpty.severity,
      );
    }
  } else if (type === "string") {
    if (value.kind !== SyntaxKind.CompilerOptionString) {
      throw new TranslationError(
        value.token,
        CompilerOptionsCodes.ExpectedString.message(),
        CompilerOptionsCodes.ExpectedString.severity,
      );
    }
  } else if (type === "plainOrString") {
    if (
      value.kind !== SyntaxKind.CompilerOptionText &&
      value.kind !== SyntaxKind.CompilerOptionString
    ) {
      throw new TranslationError(
        value.token,
        CompilerOptionsCodes.ExpectedPlainOrString.message(),
        CompilerOptionsCodes.ExpectedPlainOrString.severity,
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
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.ExpectedNumber,
    );
  }
  if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.ExpectedNumberRange,
      num,
      min,
      max,
    );
  }
  return num;
}

export function ensureArgument<T>(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  args: T[],
): (typeof args)[number] {
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
  const valueUpperCase = value.toUpperCase();
  for (const arg of args) {
    if (valueUpperCase === arg) {
      return arg;
    }
  }
  throw TranslationError.fromCode(
    optionValue.token,
    code,
    optionValue.token.image,
  );
}

export function ensureFlag(
  optionValue: CompilerOptionValue,
  code: ParametricPLICode,
  args: string[],
): boolean {
  return ensureArgument(optionValue, code, args) === args[0];
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
        num *= 1024;
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

export function plainTranslate<T extends CompilerOptionsPP = CompilerOptionsPP>(
  callback: (options: T, value: CompilerOptionText) => void,
  ...values: string[]
): Translate<T> {
  return (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plain");
    value.value = value.value.toUpperCase();
    if (values.length > 0 && !values.includes(value.value)) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.ExpectedPlainTranslate,
        value.value,
        ...values,
      );
    }
    callback(options, value);
  };
}
