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
import { CompilerOptions, getDefaultCompilerOptions } from "./options-cics";
import {
  ensureArguments,
  ensureEnum,
  ensureNumberValue,
  ensureType,
  Translator,
} from "./translator";

const translator = new Translator<CompilerOptions>(() =>
  getDefaultCompilerOptions(),
);

/** {@link CompilerOptions.cics} */
translator.rule(["CICS"], (option, options) => {
  ensureArguments(option, 0, 0);
  options.cics = true;
});

translator.flag("cpsm", ["CPSM"], ["NOCPSM"]);

translator.flag("debug", ["DEBUG"], ["NODEBUG"]);

/** {@link CompilerOptions.dli} */
translator.rule(["DLI"], (option, options) => {
  ensureArguments(option, 0, 0);
  options.dli = true;
});

translator.flag("edf", ["EDF"], ["NOEDF"]);

/** {@link CompilerOptions.exci} */
translator.rule(["EXCI"], (option, options) => {
  ensureArguments(option, 0, 0);
  options.exci = true;
});

translator.flag("fepi", ["FEPI"], ["NOFEPI"]);

/** {@link CompilerOptions.flag} */
translator.rule(["FLAG", "F"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.flag = ensureEnum(
    value,
    CompilerOptionsCodes.PPCICS.Flag.InvalidParameter,
    CompilerOptions.Flag,
  );
});

/** {@link CompilerOptions.graphic} */
translator.flag("graphic", ["GRAPHIC"], ["NOGRAPHIC"], undefined, {
  recompile: true,
});

translator.flag("length", ["LENGTH"], ["NOLENGTH"]);

/** {@link CompilerOptions.lineCount} */
translator.rule(["LINECOUNT", "LC"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.lineCount = ensureNumberValue(value, 1, 255);
});

/** {@link CompilerOptions.margins} */
translator.rule(
  ["MARGINS", "MAR"],
  (option, options) => {
    ensureArguments(option, 2, 3);
    const m = option.values[0];
    const n = option.values[1];
    ensureType(m, "plainNotEmpty");
    ensureType(n, "plainNotEmpty");
    const mValue = ensureNumberValue(m, 1, 100);
    const nValue = ensureNumberValue(n, 1, 100);
    if (mValue >= nValue) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPCICS.Margins.InvalidMarginPosition,
        m.token,
      );
    }
    let cValue = 0;
    if (option.values.length > 2) {
      const c = option.values[2];
      ensureType(c, "plainNotEmpty");
      cValue = ensureNumberValue(c, 0, 100);
      if (cValue >= mValue && cValue <= nValue) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.PPCICS.Margins.InvalidAnsPosition,
          c.token,
        );
      }
    }
    options.margins = { m: mValue, n: nValue, c: cValue };
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.natLang} */
translator.rule(["NATLANG"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.natLang = ensureEnum(
    value,
    CompilerOptionsCodes.PPCICS.NatLang.InvalidParameter,
    CompilerOptions.NatLang,
  );
});

/** {@link CompilerOptions.opMargins} */
translator.rule(
  ["OPMARGINS", "OM"],
  (option, options) => {
    ensureArguments(option, 2, 3);
    const m = option.values[0];
    const n = option.values[1];
    ensureType(m, "plainNotEmpty");
    ensureType(n, "plainNotEmpty");
    const mValue = ensureNumberValue(m, 1, 80);
    const nValue = ensureNumberValue(n, 1, 80);
    if (mValue >= nValue) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPCICS.Margins.InvalidMarginPosition,
        m.token,
      );
    }
    let cValue = 0;
    if (option.values.length > 2) {
      const c = option.values[2];
      ensureType(c, "plainNotEmpty");
      cValue = ensureNumberValue(c, 0, 80);
      if (cValue >= mValue && cValue <= nValue) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.PPCICS.Margins.InvalidAnsPosition,
          c.token,
        );
      }
    }
    options.opMargins = { m: mValue, n: nValue, c: cValue };
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.opSequence} */
translator.rule(
  ["OPSEQUENCE", "OS"],
  (option, options) => {
    ensureArguments(option, 2, 2);
    const m = option.values[0];
    const n = option.values[1];
    ensureType(m, "plainNotEmpty");
    ensureType(n, "plainNotEmpty");
    const mValue = ensureNumberValue(m, 1, 100);
    const nValue = ensureNumberValue(n, 1, 100);
    options.opSequence = { m: mValue, n: nValue };
  },
  ["NOOPSEQUENCE", "NOS"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.opSequence = false;
  },
  { recompile: true },
);

translator.flag("options", ["OPTIONS", "OP"], ["NOOPTIONS", "NOP"]);

/** {@link CompilerOptions.sequence} */
translator.rule(
  ["SEQUENCE", "SEQ"],
  (option, options) => {
    ensureArguments(option, 2, 2);
    const m = option.values[0];
    const n = option.values[1];
    ensureType(m, "plainNotEmpty");
    ensureType(n, "plainNotEmpty");
    const mValue = ensureNumberValue(m, 1, 100);
    const nValue = ensureNumberValue(n, 1, 100);
    options.sequence = { m: mValue, n: nValue };
  },
  ["NOSEQUENCE", "NSEQ"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.sequence = false;
  },
  { recompile: true },
);

translator.flag("source", ["SOURCE"], ["NOSOURCE"]);

/** {@link CompilerOptions.sp} */
translator.rule(["SP"], (option, options) => {
  ensureArguments(option, 0, 0);
  options.sp = true;
});

translator.flag("spie", ["SPIE"], ["NOSPIE"]);

/** {@link CompilerOptions.sysEib} */
translator.rule(["SYSEIB"], (option, options) => {
  ensureArguments(option, 0, 0);
  options.sysEib = true;
});

translator.flag("vbref", ["VBREF", "XREF"], ["NOVBREF", "NOXREF"]);

translator.crossMutex("EXCI", "CICS");
translator.crossMutex("EXCI", "DLI");

export function getTranslator(): Translator<CompilerOptions> {
  return translator;
}
