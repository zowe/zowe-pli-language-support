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
import { SyntaxKind } from "../../syntax-tree/ast";
import { CompilerOptionsCodes } from "./codes";
import { CompilerOptions as CompilerOptionsPLI } from "./options-pli";
import { CompilerOptions, getDefaultCompilerOptions } from "./options-sql";
import {
  ensureArguments,
  ensureEnum,
  ensureNumberValue,
  ensureType,
  getCompilerOptionValueName,
  plainTranslateEnum,
  Translator,
} from "./translator";
import { getTranslator as getTranslatorPLI } from "./translator-pli";

const translator = new Translator<CompilerOptions>(() =>
  getDefaultCompilerOptions(),
);

/**
 * QUOTE is only valid for COBOL applications.
 */
translator.rule(
  ["APOST"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.apost = CompilerOptions.QuoteChar.APOST;
  },
  ["QUOTE"],
  (option, options, acceptor) => {
    ensureArguments(option, 0, 0);
    options.apost = CompilerOptions.QuoteChar.QUOTE;
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.Apost.QuoteOnlyValidForCobol,
        option.token,
      ),
    );
  },
);

/**
 * QUOTESQL is only valid for COBOL applications.
 */
translator.rule(
  ["APOSTSQL"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.apostSql = CompilerOptions.QuoteChar.APOST;
  },
  ["QUOTESQL"],
  (option, options, acceptor) => {
    ensureArguments(option, 0, 0);
    options.apostSql = CompilerOptions.QuoteChar.QUOTE;
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.ApostSql.QuoteSqlOnlyValidForCobol,
        option.token,
      ),
    );
  },
);

translator.rule(
  ["ATTACH"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.attach =
        CompilerOptions.Attach[
          value.value as keyof typeof CompilerOptions.Attach
        ];
    },
    CompilerOptionsCodes.PPSQL.Attach.InvalidParameter,
    CompilerOptions.Attach,
  ),
);

translator.rule(["CCSID"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.ccsid = ensureNumberValue(value, 1, 65535);
});

translator.flag("ccsid0", ["CCSID0"], ["NOCCSID0"]);

translator.flag("codepage", ["CODEPAGE"], ["NOCODEPAGE"]);

translator.rule(
  ["COMMA"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.comma = CompilerOptions.DecimalPoint.COMMA;
  },
  ["PERIOD"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.comma = CompilerOptions.DecimalPoint.PERIOD;
  },
);

translator.rule(["CONNECT", "CT"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const connect = ensureNumberValue(value, 1, 2);
  options.connect = connect as 1 | 2;
});

translator.rule(
  ["DATE"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.date =
        CompilerOptions.Date[value.value as keyof typeof CompilerOptions.Date];
    },
    CompilerOptionsCodes.PPSQL.Date.InvalidParameter,
    CompilerOptions.Date,
  ),
);

// TODO ssmifi: The D15.s & D31.s syntax is currently not supported by the translator.
translator.rule(["DEC", "DEC15", "DEC31"], (option, options) => {
  if (option.name === "DEC15" || option.name === "DEC31") {
    ensureArguments(option, 0, 0);
    options.dec = option.name === "DEC15" ? 15 : 31;
    return;
  }
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const dec = ensureNumberValue(value, 15, 31);
  if (dec !== 15 && dec !== 31) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.Dec.InvalidParameter,
      value.token,
      value.value,
    );
  }
  options.dec = dec;
});

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

translator.rule(["DECP"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainOrString");
  if (value.value.length < 1 || value.value.length > 8) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.Decp.InvalidParameterLength,
      value.token,
      value.value,
    );
  }
  options.decp = value.value;
});

translator.flag("emptyDbrm", ["EMPTYDBRM"], ["NOEMPTYDBRM"]);

translator.rule(
  ["FLAG"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.flag =
        CompilerOptions.Flag[value.value as keyof typeof CompilerOptions.Flag];
    },
    CompilerOptionsCodes.PPSQL.Flag.InvalidParameter,
    CompilerOptions.Flag,
  ),
);

translator.rule(
  ["FLOAT"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.float =
        CompilerOptions.Float[
          value.value as keyof typeof CompilerOptions.Float
        ];
    },
    CompilerOptionsCodes.PPSQL.Float.InvalidParameter,
    CompilerOptions.Float,
  ),
);

/**
 * No longer used for SQL statement processing; superseded by CCSID. Kept for
 * compatibility. GRAPHIC/NOGRAPHIC are mutually exclusive.
 */
translator.flag("graphic", ["GRAPHIC"], ["NOGRAPHIC"]).postProcess({
  id: "graphic.supersededByCcsid",
  run: (options, acceptor, getOwnToken) => {
    const token = getOwnToken();
    if (token === undefined || options.ccsid === undefined) {
      return;
    }
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.Graphic.SupersededByCcsid,
        token,
      ),
    );
  },
});

translator.rule(["HOST"], (option, options, acceptor) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];

  if (value.kind === SyntaxKind.CompilerOptionText) {
    ensureType(value, "plainNotEmpty");
    const language = ensureEnum(
      value,
      CompilerOptionsCodes.PPSQL.Host.InvalidParameter,
      CompilerOptions.HostLanguage,
    );
    options.host = { language };
  } else {
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.Host.ExpectedPLI,
        value.token,
        getCompilerOptionValueName(value),
      ),
    );
  }
});

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

translator.rule(["LEVEL", "L"], (option, options) => {
  ensureArguments(option, 0, 1);
  if (option.values.length === 0) {
    options.level = "";
    return;
  }
  const value = option.values[0];
  ensureType(value, "plainOrString");
  if (value.value.length > 0 && !/^[a-zA-Z0-9]{1,7}$/.test(value.value)) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.Level.InvalidParameter,
      value.token,
      value.value,
    );
  }
  options.level = value.value;
});

translator.rule(["LINECOUNT", "LC"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.lineCount = ensureNumberValue(value, 0);
});

translator.rule(["MARGINS", "MAR"], (option, options) => {
  ensureArguments(option, 2, 3);
  const m = option.values[0];
  const n = option.values[1];
  ensureType(m, "plainNotEmpty");
  ensureType(n, "plainNotEmpty");
  const mValue = ensureNumberValue(m, 1, 80);
  const nValue = ensureNumberValue(n, 1, 80);
  if (mValue >= nValue) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.Margins.InvalidMarginPosition,
      m.token,
    );
  }
  let cValue: number | undefined;
  if (option.values.length > 2) {
    const c = option.values[2];
    ensureType(c, "plainNotEmpty");
    cValue = ensureNumberValue(c, 1, 80);
    if (cValue >= mValue && cValue <= nValue) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPSQL.Margins.InvalidContinuationPosition,
        c.token,
      );
    }
  }
  options.margins = { m: mValue, n: nValue, c: cValue };
});

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

/**
 * Deprecated: use SQLLEVEL instead. Kept for compatibility; always warns when used.
 */
translator.rule(["NEWFUN"], (option, options, acceptor) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const newFun = ensureEnum(
    value,
    CompilerOptionsCodes.PPSQL.NewFun.InvalidParameter,
    CompilerOptions.NewFun,
  );
  options.newFun = newFun;
  acceptor(
    diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.NewFun.Deprecated,
      option.token,
    ),
  );
});

// TODO: The spec does not mention a FOR option. Should be checked.
translator.rule(["NOFOR"], (option, options) => {
  ensureArguments(option, 0, 0);
  options.noFor = true;
});

translator.rule(
  ["ONEPASS", "ON"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.onePass = true;
  },
  ["TWOPASS", "TW"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.onePass = false;
  },
);

translator.flag("printOptions", ["OPTIONS", "OPTN"], ["NOOPTIONS", "NOOPTN"]);

translator.flag("source", ["SOURCE", "S"], ["NOSOURCE", "NOS"]);

translator.rule(["SQLLEVEL"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const level = value.value.toUpperCase();
  if (!/^V\d{2}R\d(M\d{3})?$/.test(level)) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.SqlLevel.InvalidParameter,
      value.token,
      value.value,
    );
  }
  options.sqlLevel = level;
});

translator.rule(["STDSQL"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const upper = value.value.toUpperCase();
  if (upper !== "YES" && upper !== "NO") {
    throw diagnosticFromCode(
      CompilerOptionsCodes.PPSQL.StdSql.InvalidParameter,
      value.token,
      value.value,
    );
  }
  options.stdSql = upper === "YES";
  // STDSQL(YES) implies NOFOR.
  if (options.stdSql) {
    options.noFor = true;
  }
});

translator.rule(
  ["TIME"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.time =
        CompilerOptions.Time[value.value as keyof typeof CompilerOptions.Time];
    },
    CompilerOptionsCodes.PPSQL.Time.InvalidParameter,
    CompilerOptions.Time,
  ),
);

translator.flag("warnDecp", ["WARNDECP"], ["NOWARNDECP"]);

translator.flag("xref", ["XREF"], ["NOXREF"]);

export function getTranslator(): Translator<CompilerOptions> {
  return translator;
}
