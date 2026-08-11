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
import { CompilerOptions as CompilerOptionsPLI } from "./options-pli";
import { CompilerOptions, getDefaultCompilerOptions } from "./options-sql";
import { ensureArguments, ensureType, Translator } from "./translator";
import { getTranslator as getTranslatorPLI } from "./translator-pli";

const translator = new Translator<CompilerOptions>(() =>
  getDefaultCompilerOptions(),
);

translator.flag("ccsid0", ["CCSID0"], ["NOCCSID0"]);

translator.flag("codepage", ["CODEPAGE"], ["NOCODEPAGE"]);

translator.rule(["DEPRECATE"], (option, options) => {
  ensureArguments(option, 1);
  options.deprecate = new Set<string>();
  for (const value of option.values) {
    ensureType(value, "option");
    if (value.name !== "STMT") {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.Deprecate.InvalidSubOption,
        value.token,
        value.token.image,
      );
    }

    // TODO: check STMT().
    for (const entry of value.values) {
      ensureType(entry, "plain");

      if (
        !["EXPLAIN", "GRANT", "REVOKE", "SET_CURRENT_SQLID", ""].includes(
          entry.value,
        )
      ) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.PPSQL.Deprecate.InvalidSubStatement,
          entry.token,
          entry.value,
        );
      }
      options.deprecate.add(entry.value as string);
    }
  }
});

translator.flag("emptyDbrm", ["EMPTYDBRM"], ["NOEMPTYDBRM"]);

translator.flag("hostCopy", ["HOSTCOPY"], ["NOHOSTCOPY"]).postProcess({
  id: "hostCopy.ignoredWithLp32",
  run: (options, acceptor, getOwnToken) => {
    const token = getOwnToken();
    if (
      token === undefined ||
      !options.hostCopy ||
      getTranslatorPLI().options.LP !== CompilerOptionsPLI.LP.LP32
    ) {
      return;
    }
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.HostCopy.IgnoredWithLp32,
        token,
      ),
    );
  },
});

translator.flag("incOnly", ["INCONLY"], ["NOINCONLY"]);

translator.rule(
  ["LINEFILE"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.line = CompilerOptions.Line.LINEFILE;
  },
  ["LINEONLY"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.line = CompilerOptions.Line.LINEONLY;
  },
);

translator.flag("warnDecp", ["WARNDECP"], ["NOWARNDECP"]);

export function getTranslator(): Translator<CompilerOptions> {
  return translator;
}
