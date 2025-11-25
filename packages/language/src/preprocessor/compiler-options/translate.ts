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

import { CompilerOptionResult, CompilerOptionsPP } from "./options";
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
import { Translator } from "./translator";

const translator = getTranslatorPLI();
const translatorMacro = getTranslatorMacro();
const translatorSQL = getTranslatorSQL();

export function translateCompilerOptions(
  input: AbstractCompilerOptions,
): CompilerOptionResult {
  // TODO ssmifi: Defaults are set here. They do not need to be set individually.
  translator.clear();
  translator.diagnostics = [...input.issues];
  const options = optionsToUpperCase(input.options);
  if (options.some((option) => option.name === "PP")) {
    // If there are PP compiler options, ignore the defaults, because the settings in PP start empty and are accumulated.
    translator.options.pp = { items: [] };
  }
  for (const option of options) {
    translator.translate(option);
  }

  // Handle nested compiler options that are not yet parsed.
  translatorMacro.clear();
  parseNestedOptions(translatorMacro, "MACRO", translator.options.ppMacro);
  translatorSQL.clear();
  parseNestedOptions(translatorSQL, "SQL", translator.options.ppSql);

  return {
    options: {
      ...(translator.options as CompilerOptionsPLI),
      macroOptions: translatorMacro.options as CompilerOptionsMacro,
      sqlOptions: translatorSQL.options as CompilerOptionsSQL,
    },
    tokens: input.tokens,
    issues: [
      ...translator.diagnostics,
      ...translatorMacro.diagnostics,
      ...translatorSQL.diagnostics,
    ],
  };
}

function parseNestedOptions<T extends CompilerOptionsPP>(
  ppTranslator: Translator<T>,
  ppId: string,
  ppDirectValue: CompilerOptions.PPValue | false | undefined,
): void {
  const items: CompilerOptions.PPValue[] = [
    ...(ppDirectValue ? [ppDirectValue] : []),
    ...(translator.options.pp?.items
      .filter((item) => item.name === ppId && typeof item.value === "string")
      .map((item) => ({ value: item.value, token: item.token })) ?? []),
  ];

  for (const item of items) {
    const nestedOptions = parseAbstractCompilerOptions(
      item.value as string,
      (item.token?.startOffset ?? 0) + 1,
    );
    nestedOptions.options.forEach((option) => ppTranslator.translate(option));
    ppTranslator.diagnostics.push(...nestedOptions.issues);
  }
}

// TODO ssmifi: remove the upper cases from the individual rules.
function optionsToUpperCase(options: CompilerOption[]): CompilerOption[] {
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
