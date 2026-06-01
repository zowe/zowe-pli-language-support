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

import { diagnosticFromCode } from "../../language-server/types";
import { CompilerOptionsCodes } from "./codes";
import { CompilerOptions, getDefaultCompilerOptions } from "./options-macro";
import {
  CompilerOptionSource,
  ensureArguments,
  ensureEnum,
  ensureToBeDefined,
  ensureType,
  originalImage,
  Translator,
} from "./translator";

const translator = new Translator<CompilerOptions>(() =>
  getDefaultCompilerOptions(),
);

translator.rule(
  ["CASE"],
  (option, options, _, configuration) => {
    ensureArguments(option, 1, 1);
    ensureToBeDefined(options.case);
    const value = option.values[0];
    ensureType(value, "plain");
    options.case = {
      case: ensureEnum(
        value,
        CompilerOptionsCodes.PPMacro.Case.InvalidParameter,
        CompilerOptions.Case,
      ),
      explicitlySet:
        configuration?.source !== undefined
          ? configuration.source === CompilerOptionSource.SOURCE_FILE
          : false,
    };
  },
  undefined,
  undefined,
  { recompile: true },
);

translator.rule(
  ["DBCS"],
  (option, options, acceptor) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plain");
    options.dbcs = ensureEnum(
      value,
      CompilerOptionsCodes.PPMacro.Dbcs.InvalidParameter,
      CompilerOptions.Dbcs,
    );
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.OptionNotSupported,
        option.token,
        "DBCS",
      ),
    );
  },
  undefined,
  undefined,
  { recompile: true },
);

translator.rule(["DEPRECATE"], (option, options) => {
  ensureArguments(option, 1);
  options.deprecate = new Set<string>();
  for (const value of option.values) {
    ensureType(value, "option");
    if (value.name !== "ENTRY") {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPMacro.Deprecate.InvalidSubOption,
        value.token,
        value.token.image,
      );
    }

    // ENTRY() is valid.
    for (const entry of value.values) {
      ensureType(entry, "plain");
      options.deprecate.add(entry.value as string);
    }
  }
});

translator.rule(["DEPRECATENEXT"], (option, options) => {
  ensureArguments(option, 1);
  options.deprecateNext = new Set<string>();
  for (const value of option.values) {
    ensureType(value, "option");
    if (value.name !== "ENTRY") {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPMacro.Deprecate.InvalidSubOption,
        value.token,
        value.token.image,
      );
    }

    // ENTRY() is valid.
    for (const entry of value.values) {
      ensureType(entry, "plain");
      options.deprecateNext.add(entry.value as string);
    }
  }
});

translator.flag(
  "eolComm",
  ["EOLCOMM"],
  ["NOEOLCOMM"],
  (option) => {
    throw diagnosticFromCode(
      CompilerOptionsCodes.OptionNotSupported,
      option.token,
      "EOLCOMM",
    );
  },
  { recompile: true },
);

translator.rule(["FIXED"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  options.fixed = ensureEnum(
    value,
    CompilerOptionsCodes.PPMacro.Fixed.InvalidParameter,
    CompilerOptions.Fixed,
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPMacro.Ignore.InvalidParameter,
        value.token,
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPMacro.NamePrefix.InvalidParameterLength,
        value.token,
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
  options.rescan = ensureEnum(
    value,
    CompilerOptionsCodes.PPMacro.Rescan.InvalidParameter,
    CompilerOptions.Rescan,
  );
});

export function getTranslator(): Translator<CompilerOptions> {
  return translator;
}
