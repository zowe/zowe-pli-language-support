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

import { CompilerOptionsCodes } from "./codes";
import { CompilerOptions, getDefaultCompilerOptions } from "./options-macro";
import {
  ensureArgument,
  ensureArguments,
  ensureType,
  originalImage,
  TranslationError,
  Translator,
} from "./translator";

const translator = new Translator<CompilerOptions>(getDefaultCompilerOptions());

translator.rule(["CASE"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  options.case = ensureArgument(
    value,
    CompilerOptionsCodes.PPMacro.Case.InvalidParameter,
    ["UPPER", "ASIS"],
  );
});

translator.rule(["DBCS"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  options.dbcs = ensureArgument(
    value,
    CompilerOptionsCodes.PPMacro.Dbcs.InvalidParameter,
    ["EXACT", "INEXACT"],
  );
});

translator.rule(["DEPRECATE"], (option, options) => {
  ensureArguments(option, 1);
  options.deprecate = [];
  for (const value of option.values) {
    ensureType(value, "option");
    if (value.name !== "ENTRY") {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.PPMacro.Deprecate.InvalidSubOption,
        value.token.image,
      );
    }

    // ENTRY() is valid.
    for (const entry of value.values) {
      ensureType(entry, "plain");
      options.deprecate.push(entry.value as string);
    }
  }
});

translator.rule(["DEPRECATENEXT"], (option, options) => {
  ensureArguments(option, 1);
  options.deprecateNext = [];
  for (const value of option.values) {
    ensureType(value, "option");
    if (value.name !== "ENTRY") {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.PPMacro.Deprecate.InvalidSubOption,
        value.token.image,
      );
    }

    // ENTRY() is valid.
    for (const entry of value.values) {
      ensureType(entry, "plain");
      options.deprecateNext.push(entry.value as string);
    }
  }
});

translator.flag("eolComm", ["EOLCOMM"], ["NOEOLCOMM"]);

translator.rule(["FIXED"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  options.fixed = ensureArgument(
    value,
    CompilerOptionsCodes.PPMacro.Fixed.InvalidParameter,
    ["DECIMAL", "BINARY"],
  );
});

translator.rule(["ID"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "string");
  options.id = option.values[0].value as string;
});

translator.rule(
  ["IGNORE"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plain");
    if (value.value !== "NOPRINT") {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.PPMacro.Ignore.InvalidParameter,
        originalImage(value),
      );
    }
    options.ignore = { noprint: true };
  },
  ["NOIGNORE"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.ignore = false;
  },
);

translator.flag("incOnly", ["INCONLY"], ["NOINCONLY"]);

translator.rule(
  ["NAMEPREFIX"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    if (value.value.length !== 1) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.PPMacro.NamePrefix.InvalidParameterLength,
        value.token.image,
      );
    }
    options.namePrefix = { character: value.value };
  },
  ["NONAMEPREFIX"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.namePrefix = false;
  },
);

translator.rule(["RESCAN"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  options.rescan = ensureArgument(
    value,
    CompilerOptionsCodes.PPMacro.Rescan.InvalidParameter,
    ["UPPER", "ASIS"],
  );
});

export function getTranslator(): Translator<CompilerOptions> {
  return translator;
}
