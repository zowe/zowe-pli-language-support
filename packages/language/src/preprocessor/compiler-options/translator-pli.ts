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
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  SyntaxKind,
} from "../../syntax-tree/ast";
import { NOT_CHARACTER } from "../../utils/const";
import { CompilerOptionsCodes } from "./codes";
import { CompilerOptions as Options } from "./options";
import {
  CompilerConditions,
  CompilerOptions,
  getDefaultCompilerOptions,
} from "./options-pli";
import {
  ensureArgument,
  ensureArguments,
  ensureFlag,
  ensureNumberValue,
  ensureToBeDefined,
  ensureType,
  isEmptyParameterList,
  plainTranslate,
  reportDuplicateSubOptions,
  reportMutexSubOptions,
  stringTranslate,
  TranslationError,
  Translator,
} from "./translator";

const translator = new Translator<CompilerOptions>(getDefaultCompilerOptions());

const $1K = 1024;
const $1M = 1024 * 1024;

/** {@link CompilerOptions.aggregate} */
translator.rule(
  ["AGGREGATE", "AG"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    const value = option.values[0];
    if (value) {
      ensureType(value, "plain");
      const text = value.value.toUpperCase();
      if (text === "DECIMAL" || text === "HEXADEC") {
        options.aggregate = {
          offsets: text,
        };
      } else {
        throw new TranslationError(
          value.token,
          "Invalid aggregate value. Expected DECIMAL or HEXADEC.",
          1,
        );
      }
    } else {
      // AGGREGATE can be set without the suboption.
      options.aggregate = {};
    }
  },
  ["NOAGGREGATE", "NAG"],
  (_, options) => {
    options.aggregate = false;
  },
);

/** {@link CompilerOptions.arch} */
translator.rule(
  ["ARCH"],
  plainTranslate(
    (options, value) => {
      options.arch = Number(value);
    },
    "10",
    "11",
    "12",
    "13",
    "14",
  ),
);

/** {@link CompilerOptions.assert} */
translator.rule(
  ["ASSERT"],
  plainTranslate(
    (options, value) => {
      options.assert = value.value as CompilerOptions.Assert;
    },
    "ENTRY",
    "CONDITION",
  ),
);

/** {@link CompilerOptions.attributes} */
translator.rule(
  ["ATTRIBUTES", "A"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    options.attributes = {
      include: true,
      identifiers: attributeIdentifiers(option),
    };
  },
  ["NOATTRIBUTES", "NA"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    options.attributes = {
      include: false,
      identifiers: attributeIdentifiers(option) ?? undefined,
    };
  },
);

function attributeIdentifiers(
  option: CompilerOption,
): "FULL" | "SHORT" | undefined {
  const value = option.values[0];
  if (value) {
    ensureType(value, "plain");
    const text = value.value.toUpperCase();
    if (text === "F" || text === "FULL") {
      return "FULL";
    } else if (text === "S" || text === "SHORT") {
      return "SHORT";
    } else {
      throw new TranslationError(
        value.token,
        "Invalid attribute value. Expected FULL or SHORT.",
        1,
      );
    }
  }
  return undefined;
}

/** {@link CompilerOptions.backreg} */
translator.rule(
  ["BACKREG"],
  plainTranslate(
    (options, value) => {
      options.backreg = Number(value);
    },
    "5",
    "11",
  ),
);

/** {@link CompilerOptions.bifprec} */
translator.rule(
  ["BIFPREC"],
  plainTranslate(
    (options, value) => {
      options.bifprec = Number(value);
    },
    "31",
    "15",
  ),
);

/** {@link CompilerOptions.blank} */
translator.rule(["BLANK"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "string");

  if (value.value.length !== 1) {
    throw new TranslationError(
      value.token,
      "BLANK option value must be a single character.",
      1,
    );
  }

  if (Options.PLI_CHARACTER_REGEX.test(value.value)) {
    throw new TranslationError(
      value.token,
      "BLANK option value contains disallowed characters. Cannot contain letters, numbers, spaces, or PL/I special characters.",
      1,
    );
  }

  options.blank = value.value;
});

/** {@link CompilerOptions.blkoff} */
translator.flag("blkoff", ["BLKOFF"], ["NOBLKOFF"]);

/** {@link CompilerOptions.brackets} */
translator.rule(
  ["BRACKETS"],
  stringTranslate((options, value) => {
    const length = value.value.length;
    if (length !== 2) {
      throw new TranslationError(
        value.token,
        "BRACKETS option value must be two characters.",
        1,
      );
    }
    const start = value.value.charAt(0);
    const end = value.value.charAt(1);

    if (
      Options.PLI_CHARACTER_REGEX.test(start) ||
      Options.PLI_CHARACTER_REGEX.test(end)
    ) {
      throw new TranslationError(
        value.token,
        "BRACKETS option value contains disallowed characters. Cannot contain letters, numbers, spaces, or PL/I special characters.",
        1,
      );
    }

    if (start === end) {
      throw new TranslationError(
        value.token,
        "BRACKETS option value must be two different characters.",
        1,
      );
    }

    options.brackets = [start, end];
  }),
);

/** {@link CompilerOptions.case} */
translator.rule(
  ["CASE"],
  plainTranslate(
    (options, value) => {
      options.case = value.value as CompilerOptions.Case;
    },
    "UPPER",
    "ASIS",
  ),
);

/** {@link CompilerOptions.caserules} */
translator.rule(["CASERULES"], (option, options, acceptor) => {
  ensureArguments(option, 1, 1);
  const keyword = option.values[0];
  ensureType(keyword, "option");
  if (keyword.name.toUpperCase() !== "KEYWORD") {
    throw new TranslationError(
      keyword.token,
      `Expected "KEYWORD" as compiler option value.`,
      1,
    );
  }
  ensureArguments(keyword, 1, 1);
  const keywordCase = keyword.values[0];
  ensureType(keywordCase, "plain");
  plainTranslate<CompilerOptions>(
    (options, value) => {
      options.caserules = value.value as CompilerOptions.CaseRules;
    },
    "MIXED",
    "UPPER",
    "LOWER",
    "START",
  )(keyword, options, acceptor);
});

/** {@link CompilerOptions.check} */
translator.rule(["CHECK"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  for (const value of option.values) {
    ensureType(value, "plain");
    const text = value.value.toUpperCase();
    if (text === "STORAGE" || text === "STG") {
      options.check = {
        storage: "STORAGE",
      };
    } else if (text === "NOSTORAGE" || text === "NSTG") {
      options.check = {
        storage: "NOSTORAGE",
      };
    } else {
      throw new TranslationError(
        value.token,
        `Invalid check option value. Expected STORAGE or NOSTORAGE, but received '${text}'.`,
        1,
      );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [["STORAGE", "NOSTORAGE"]]);
});

/** {@link CompilerOptions.cmpat} */
translator.rule(
  ["CMPAT", "CMP"],
  plainTranslate<CompilerOptions>(
    (options, value) => {
      options.cmpat = value.value as CompilerOptions.CMPat;
    },
    "V1",
    "V2",
    "V3",
    "LE",
  ),
);

/** {@link CompilerOptions.codepage} */
translator.rule(["CODEPAGE", "CP"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "plain");
  const validCodepages = [
    "01047",
    "01140",
    "01141",
    "01142",
    "01143",
    "01144",
    "01025",
    "01145",
    "01146",
    "01147",
    "01148",
    "01149",
    "00037",
    "01155",
    "00273",
    "00277",
    "00278",
    "00280",
    "00284",
    "00285",
    "00297",
    "00500",
    "00871",
    "00819",
    "00813",
    "00920",
  ];
  if (!validCodepages.includes(option.values[0].value)) {
    throw new TranslationError(
      option.values[0].token,
      `Invalid codepage value. Expected one of ${validCodepages.join(", ")}, but received '${option.values[0].value}'.`,
      1,
    );
  }
  options.codepage = option.values[0].value;
});

/** {@link CompilerOptions.common} */
translator.flag("common", ["COMMON"], ["NOCOMMON"]);

/** {@link CompilerOptions.compile} */
translator.rule(
  ["COMPILE", "C"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.compile = true;
  },
  ["NOCOMPILE", "NC"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    const severity = option.values[0];
    let sev: CompilerOptions.Compile["severity"] | undefined;
    if (severity) {
      ensureType(severity, "plain");
      const value = severity.value.toUpperCase();
      if (value === "S") {
        sev = "SEVERE";
      } else if (value === "W") {
        sev = "WARNING";
      } else if (value === "E") {
        sev = "ERROR";
      } else {
        throw new TranslationError(
          severity.token,
          `Invalid severity value. Expected S, W or E, but received '${value}'`,
          1,
        );
      }
    }
    options.compile = {
      severity: sev,
    };
  },
);

/** {@link CompilerOptions.copyright} */
translator.rule(
  ["COPYRIGHT"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const valueOption = option.values[0];
    ensureType(valueOption, "string");
    options.copyright = valueOption.value;
  },
  ["NOCOPYRIGHT"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.copyright = false;
  },
);

/** {@link CompilerOptions.csect} */
translator.flag("csect", ["CSECT", "CSE"], ["NOCSECT", "NOCSE"]);

/** {@link CompilerOptions.csectcut} */
translator.rule(
  ["CSECTCUT"],
  plainTranslate((options, value) => {
    if (!["0", "1", "2", "3", "4", "5", "6", "7"].includes(value.value)) {
      throw new TranslationError(
        value.token,
        `Invalid csectcut value. Expected a number between 0 and 7, but received '${value.value}'.`,
        1,
      );
    }
    options.csectcut = Number(value);
  }),
);

/** {@link CompilerOptions.currency} */
translator.rule(
  ["CURRENCY", "CURR"],
  stringTranslate((options, value) => {
    if (value.value.length === 0) {
      throw new TranslationError(
        value.token,
        "Currency character required.",
        1,
      );
    } else if (value.value.length > 1) {
      throw new TranslationError(
        value.token,
        `Currency character must be a single character, but received '${value.value}'.`,
        1,
      );
    }
    options.currency = value.value;
  }),
);

/** {@link CompilerOptions.dbcs} */
translator.flag("dbcs", ["DBCS"], ["NODBCS"]);

/** {@link CompilerOptions.dbrmlib} */
translator.rule(
  ["DBRMLIB"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    const dataSetName = option.values[0];
    ensureType(dataSetName, "string");
    options.dbrmlib = dataSetName.value;
  },
  ["NODBRMLIB"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.dbrmlib = false;
  },
);

/** {@link CompilerOptions.dd} */
translator.rule(["DD"], (option, options) => {
  ensureArguments(option, 0, 8);
  options.dd = {};
  const dd = [
    "sysprint",
    "sysin",
    "syslib",
    "syspunch",
    "syslin",
    "sysadata",
    "sysxmlsd",
    "sysdebug",
  ] as const;
  for (let i = 0; i < option.values.length; i++) {
    const value = option.values[i];
    ensureType(value, "plain");
    if (!/^[a-z]+$/i.test(value.value)) {
      throw new TranslationError(
        value.token,
        `Invalid DD name. Expected a text containing only letters, but received '${value.value}'.`,
        1,
      );
    }
    options.dd[dd[i]] = value.value;
  }
});

/** {@link CompilerOptions.ddsql} */
translator.rule(["DDSQL"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainOrString");
  if (value.kind === SyntaxKind.CompilerOptionText) {
    if (value.value.length === 0) {
      throw new TranslationError(
        value.token,
        "DDSQL option value cannot be empty without parentheses.",
        1,
      );
    }
  }
  options.ddsql = value.value;
});

/** {@link CompilerOptions.decimal} */
translator.rule(["DECIMAL", "DEC"], (option, options, acceptor) => {
  options.decimal = {};
  ensureArguments(option, 1);
  for (const opt of option.values) {
    ensureType(opt, "plain");
    const value = opt.value.toUpperCase();
    switch (value) {
      case "CHECKFLOAT":
        options.decimal.checkfloat = true;
        break;
      case "NOCHECKFLOAT":
        options.decimal.checkfloat = false;
        break;
      case "FOFLONADD":
        options.decimal.foflonadd = true;
        break;
      case "NOFOFLONADD":
        options.decimal.foflonadd = false;
        break;
      case "FOFLONASGN":
        options.decimal.foflonasgn = true;
        break;
      case "NOFOFLONASGN":
        options.decimal.foflonasgn = false;
        break;
      case "FOFLONDIV":
        options.decimal.foflondiv = true;
        break;
      case "NOFOFLONDIV":
        options.decimal.foflondiv = false;
        break;
      case "FOFLONMULT":
        options.decimal.foflonmult = true;
        break;
      case "NOFOFLONMULT":
        options.decimal.foflonmult = false;
        break;
      case "FORCEDSIGN":
        options.decimal.forcedsign = true;
        break;
      case "NOFORCEDSIGN":
        options.decimal.forcedsign = false;
        break;
      case "KEEPMINUS":
        options.decimal.keepminus = true;
        break;
      case "NOKEEPMINUS":
        options.decimal.keepminus = false;
        break;
      case "TRUNCFLOAT":
        options.decimal.truncfloat = true;
        break;
      case "NOTRUNCFLOAT":
        options.decimal.truncfloat = false;
        break;
      default:
        throw new TranslationError(
          opt.token,
          `Invalid decimal option. Expected one of 'CHECKFLOAT', 'NOCHECKFLOAT', 'FOFLONADD', 'NOFOFLONADD', 'FOFLONASGN', 'NOFOFLONASGN', 'FOFLONDIV', 'NOFOFLONDIV', 'FOFLONMULT', 'NOFOFLONMULT', 'FORCEDSIGN', 'NOFORCEDSIGN', 'KEEPMINUS', 'NOKEEPMINUS', 'TRUNCFLOAT', 'NOTRUNCFLOAT', but received '${value}'.`,
          1,
        );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [
    ["CHECKFLOAT", "NOCHECKFLOAT"],
    ["FOFLONADD", "NOFOFLONADD"],
    ["FOFLONASGN", "NOFOFLONASGN"],
    ["FOFLONDIV", "NOFOFLONDIV"],
    ["FOFLONMULT", "NOFOFLONMULT"],
    ["FORCEDSIGN", "NOFORCEDSIGN"],
    ["KEEPMINUS", "NOKEEPMINUS"],
    ["TRUNCFLOAT", "NOTRUNCFLOAT"],
  ]);
});

/** {@link CompilerOptions.decomp} */
translator.flag("decomp", ["DECOMP"], ["NODECOMP"]);

/** {@link CompilerOptions.default} */
translator.rule(["DEFAULT", "DFT"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  const def: CompilerOptions.Default = (options.default = {});
  if (
    option.values.length === 1 &&
    option.values[0].kind === SyntaxKind.CompilerOptionText &&
    option.values[0].value === ""
  ) {
    return;
  }

  for (const opt of option.values) {
    if (opt.kind === SyntaxKind.CompilerOptionText) {
      const val = opt.value.toUpperCase();
      switch (val) {
        case "ALIGNED":
        case "UNALIGNED":
          def.aligned = val === "ALIGNED";
          break;
        case "IBM":
        case "ANS":
          def.architecture = val;
          break;
        case "EBCDIC":
        case "ASCII":
          def.encoding = val;
          break;
        case "ASSIGNABLE":
        case "NONASSIGNABLE":
          def.assignable = val === "ASSIGNABLE";
          break;
        case "BIN1ARG":
        case "NOBIN1ARG":
          def.bin1arg = val === "BIN1ARG";
          break;
        case "BYADDR":
        case "BYVALUE":
          def.allocator = val;
          break;
        case "CONNECTED":
        case "NONCONNECTED":
          def.connected = val === "CONNECTED";
          break;
        case "DESCLIST":
        case "DESCLOCATOR":
          def.desc = val.substring(4) as "LIST" | "LOCATOR";
          break;
        case "DESCRIPTOR":
        case "NODESCRIPTOR":
          def.descriptor = val === "DESCRIPTOR";
          break;
        case "EVENDEC":
        case "NOEVENDEC":
          def.evendec = val === "EVENDEC";
          break;
        case "HEXADEC":
        case "IEEE":
          def.format = val;
          break;
        case "INITFILL":
        case "NOINITFILL":
          def.initfill = val === "INITFILL" ? "00" : false;
          break;
        case "INLINE":
        case "NOINLINE":
          def.inline = val === "INLINE";
          break;
        case "LAXQUAL":
        case "NOLAXQUAL":
          def.laxqual = val === "LAXQUAL";
          break;
        case "LOWERINC":
        case "UPPERINC":
          def.inc = val;
          break;
        case "NATIVE":
        case "NONNATIVE":
          def.native = val === "NATIVE";
          break;
        case "NATIVEADDR":
        case "NONATIVEADDR":
          def.nativeAddr = val === "NATIVEADDR";
          break;
        case "NULLSYS":
        case "NULL370":
          def.nullsys = val;
          break;
        case "NULLSTRADDR":
        case "NONULLSTRADDR":
          def.nullStrAddr = val === "NULLSTRADDR";
          break;
        case "ORDER":
        case "REORDER":
          def.order = val;
          break;
        case "OVERLAP":
        case "NOOVERLAP":
          def.overlap = val === "OVERLAP";
          break;
        case "PADDING":
        case "NOPADDING":
          def.padding = val === "PADDING";
          break;
        case "PSEUDODUMMY":
        case "NOPSEUDODUMMY":
          def.pseudodummy = val === "PSEUDODUMMY";
          break;
        case "RECURSIVE":
        case "NORECURSIVE":
          def.recursive = val === "RECURSIVE";
          break;
        case "RETCODE":
        case "NORETCODE":
          def.retcode = val === "RETCODE";
          break;
        default:
          throw new TranslationError(
            opt.token,
            `Invalid default option value: ${val}`,
            1,
          );
      }
    } else if (opt.kind === SyntaxKind.CompilerOption) {
      ensureArguments(opt, 1, 1);
      ensureType(opt.values[0], "plain");
      const value = opt.values[0].value.toUpperCase();

      const invalidOption = () => {
        throw new TranslationError(
          opt.values[0].token,
          `Invalid default option value: ${value}`,
          1,
        );
      };

      switch (opt.name.toUpperCase()) {
        case "DUMMY":
          def.dummy = {};
          if (value === "ALIGNED" || value === "") {
            def.dummy.aligned = true;
          } else if (value === "UNALIGNED") {
            def.dummy.aligned = false;
          } else {
            invalidOption();
          }
          break;

        case "E":
          def.e = {};
          if (value === "HEXADEC" || value === "") {
            def.e.format = "HEXADEC";
          } else if (value === "IEEE") {
            def.e.format = "IEEE";
          } else {
            invalidOption();
          }
          break;

        case "INITFILL":
          // TODO ssmifi: INITFILL can also accept a string value in which case the hex value should not have an X suffix.
          if (/[0-9a-fA-F]{2}x/i.test(value)) {
            def.initfill = value;
          } else {
            throw new TranslationError(
              opt.values[0].token,
              `INITFILL expects a hex value, but received '${value}'.`,
              1,
            );
          }
          break;

        case "LINKAGE":
          def.linkage = {};
          if (value === "OPTLINK" || value === "") {
            def.linkage.type = "OPTLINK";
          } else if (value === "SYSTEM") {
            def.linkage.type = "SYSTEM";
          } else {
            invalidOption();
          }
          break;

        case "NULLINIT":
          def.nullinit = {};
          if (value === "NULL" || value === "") {
            def.nullinit.type = "NULL";
          } else if (value === "SYSNULL") {
            def.nullinit.type = "SYSNULL";
          } else {
            invalidOption();
          }
          break;

        case "NULLSTRPTR":
          def.nullStrPtr = {};
          if (value === "NULL") {
            def.nullStrPtr.type = "NULL";
          } else if (value === "STRICT") {
            def.nullStrPtr.type = "STRICT";
          } else if (value === "SYSNULL") {
            def.nullStrPtr.type = "SYSNULL";
          } else {
            invalidOption();
          }
          break;

        case "ORDINAL":
          if (value === "MIN") {
            def.ordinal = { type: "MIN" };
          } else if (value === "MAX") {
            def.ordinal = { type: "MAX" };
          } else {
            invalidOption();
          }
          break;

        case "RETURNS":
          // Diagram specifies that no option inside the parenthesesis valid. Default is BYADDR.
          if (value === "" || value === "BYADDR") {
            def.returns = { type: "BYADDR" };
          } else if (value === "BYVALUE") {
            def.returns = { type: "BYVALUE" };
          } else {
            invalidOption();
          }
          break;

        case "SHORT":
          // Diagram specifies that no option inside the parentheses is valid. Default is HEXADEC.
          if (value === "" || value === "HEXADEC") {
            def.short = { format: "HEXADEC" };
          } else if (value === "IEEE") {
            def.short = { format: "IEEE" };
          } else {
            invalidOption();
          }
          break;

        default:
          invalidOption();
      }
    } else {
      throw new TranslationError(
        opt.token,
        `Invalid default option value: ${opt.value}`,
        1,
      );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [
    ["ALIGNED", "UNALIGNED"],
    ["IBM", "ANS"],
    ["EBCDIC", "ASCII"],
    ["ASSIGNABLE", "NONASSIGNABLE"],
    ["BIN1ARG", "NOBIN1ARG"],
    ["BYADDR", "BYVALUE"],
    ["CONNECTED", "NONCONNECTED"],
    ["DESCLIST", "DESCLOCATOR"],
    ["DESCRIPTOR", "NODESCRIPTOR"],
    ["EVENDEC", "NOEVENDEC"],
    ["HEXADEC", "IEEE"],
    ["INLINE", "NOINLINE"],
    ["LAXQUAL", "NOLAXQUAL"],
    ["LOWERINC", "UPPERINC"],
    ["NATIVE", "NONNATIVE"],
    ["NATIVEADDR", "NONATIVEADDR"],
    ["NULLSYS", "NULL370"],
    ["NULLSTRADDR", "NONULLSTRADDR"],
    ["ORDER", "REORDER"],
    ["OVERLAP", "NOOVERLAP"],
    ["PADDING", "NOPADDING"],
    ["PSEUDODUMMY", "NOPSEUDODUMMY"],
    ["RECURSIVE", "NORECURSIVE"],
    ["RETCODE", "NORETCODE"],
  ]);
});

/** {@link CompilerOptions.deprecate} */
/** {@link CompilerOptions.deprecateNext} */
translator.rule(["DEPRECATE", "DEPRECATENEXT"], (option, options) => {
  const items: CompilerOptions.DeprecateItem[] = [];
  for (const opt of option.values) {
    ensureType(opt, "option");
    const name = opt.name.toUpperCase();
    if (!["BUILTIN", "ENTRY", "INCLUDE", "STMT", "VARIABLE"].includes(name)) {
      throw new TranslationError(
        opt.token,
        `Invalid DEPRECATE option. Expected one of BUILTIN, ENTRY, INCLUDE, STMT or VARIABLE, but received '${opt.name}'`,
        1,
      );
    }
    ensureArguments(opt, 0, 1);
    const optionValue = opt.values[0];
    ensureType(optionValue, "plain");
    items.push({
      type: name as CompilerOptions.DeprecateItem["type"],
      value: optionValue.value,
    });
  }
  if (option.name === "DEPRECATE") {
    options.deprecate = { items };
  } else {
    options.deprecateNext = { items };
  }
});

/** {@link CompilerOptions.display} */
translator.rule(["DISPLAY"], (option, options) => {
  const display: CompilerOptions.Display = (options.display = {});
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  if (value.kind === SyntaxKind.CompilerOptionText) {
    const text = value.value.toUpperCase();
    if (text === "STD") {
      display.std = true;
    } else if (text === "WTO") {
      display.wto = true;
    } else {
      throw new TranslationError(
        value.token,
        `Invalid display value. Expected STD or WTO, but received '${value.value}'.`,
        1,
      );
    }
  } else if (value.kind === SyntaxKind.CompilerOption) {
    if (value.name.toUpperCase() !== "WTO") {
      throw new TranslationError(
        value.token,
        `Invalid display option. Expected WTO, but received '${value.name}'.`,
        1,
      );
    }
    display.wto = true;
    for (const opt of value.values) {
      ensureType(opt, "option");
      const parameters: string[] = [];
      for (const param of opt.values) {
        ensureType(param, "plain");
        parameters.push(param.value);
      }
      const name = opt.name.toUpperCase();
      if (name === "ROUTCDE") {
        display.routcde = parameters;
      } else if (name === "DESC") {
        display.desc = parameters;
      } else if (name === "REPLY") {
        display.reply = parameters;
      } else {
        throw new TranslationError(
          opt.token,
          `Invalid display option. Expected ROUTCDE, DESC or REPLY, but received '${opt.name}'.`,
          1,
        );
      }
    }
  } else {
    throw new TranslationError(
      value.token,
      `Invalid display value. Expected a text or an option.`,
      1,
    );
  }
});

/** {@link CompilerOptions.dll} */
translator.flag("dll", ["DLL"], ["NODLL"]);

/** {@link CompilerOptions.dllInit} */
translator.flag("dllInit", ["DLLINIT"], ["NODLLINIT"]);

/** {@link CompilerOptions.exit} */
translator.rule(
  ["EXIT"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    const value = option.values[0];
    if (value) {
      ensureType(value, "string");
      options.exit = {
        inparm: value.value,
      };
    } else {
      options.exit = {};
    }
  },
  ["NOEXIT"],
  (_, options) => {
    options.exit = false;
  },
);

/** {@link CompilerOptions.exportAll} */
translator.flag("exportAll", ["EXPORTALL"], ["NOEXPORTALL"]);

/** {@link CompilerOptions.extrn} */
translator.rule(
  ["EXTRN"],
  plainTranslate(
    (options, value) => {
      options.extrn = value.value as CompilerOptions.Length;
    },
    "FULL",
    "SHORT",
  ),
);

/** {@link CompilerOptions.fileRef} */
translator.rule(
  ["FILEREF"],
  plainTranslate(
    (options, value) => {
      options.fileRef = {
        hash: value.value === "HASH",
      };
    },
    "HASH",
    "NOHASH",
  ),
  ["NOFILEREF"],
  (_, options) => {
    options.fileRef = false;
  },
);

/** {@link CompilerOptions.flag} */
translator.rule(["FLAG", "F"], (option, options) => {
  ensureArguments(option, 0, 1);
  const value = option.values[0];
  if (value) {
    ensureType(value, "plain");
    const flag = value.value.toUpperCase();
    if (flag === "S" || flag === "E" || flag === "I" || flag === "W") {
      options.flag = flag;
    } else {
      throw new TranslationError(
        value.token,
        `Invalid flag value. Expected S, E, I or W, but received '${flag}'.`,
        1,
      );
    }
  }
});

/** {@link CompilerOptions.float} */
translator.rule(
  ["FLOAT"],
  plainTranslate(
    (options, value) => {
      options.float = {
        dfp: value.value === "DFP",
      };
    },
    "DFP",
    "NODFP",
  ),
);

/** {@link CompilerOptions.floatInMath} */
translator.rule(
  ["FLOATINMATH"],
  plainTranslate(
    (options, value) => {
      options.floatInMath = {
        type: value.value as CompilerOptions.FloatInMath["type"],
      };
    },
    "ASIS",
    "LONG",
    "EXTENDED",
  ),
);

/** {@link CompilerOptions.goff} */
translator.flag("goff", ["GOFF"], ["NOGOFF"]);

/** {@link CompilerOptions.goNumber} */
translator.rule(
  ["GONUMBER", "GN"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plain");
    if (!options.goNumber) {
      // TODO ssmifi: Replace with ensureToBeDefined after merging #381.
      options.goNumber = false;
    }
    options.goNumber = {
      separate: ensureFlag(
        value,
        CompilerOptionsCodes.GoNumber.InvalidParameter,
        ["SEPARATE", "NOSEPARATE"],
      ),
    };
  },
  ["NOGONUMBER", "NGN"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.goNumber = false;
  },
);

/** {@link CompilerOptions.graphic} */
translator.flag("graphic", ["GRAPHIC", "GR"], ["NOGRAPHIC", "NGR"]);

/** {@link CompilerOptions.header} */
translator.rule(["HEADER"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  const headValue = value.value.toUpperCase();
  if (["ALL", "FILE", "FIRST", "SOURCE"].includes(headValue)) {
    options.header = headValue as CompilerOptions.Header;
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Header.InvalidParameter,
      value.value,
    );
  }
});

/** {@link CompilerOptions.hgpr} */
translator.rule(["HGPR"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  const hgprValue = value.value.toUpperCase();
  if (["PRESERVE", "NOPRESERVE"].includes(hgprValue)) {
    options.hgpr = {
      preserve: hgprValue === "PRESERVE",
    };
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Hgpr.InvalidParameter,
      value.value,
    );
  }
});

/** {@link CompilerOptions.ignore} */
translator.rule(
  ["IGNORE"],
  (option, options, acceptor) => {
    ensureArguments(option, 1);
    options.ignore = {
      items: [],
    };
    for (const opt of option.values) {
      ensureType(opt, "plain");
      ensureToBeDefined(options.ignore.items);
      const ignoreValue = opt.value.toUpperCase();
      if (["ASSERT", "DISPLAY", "PUT"].includes(ignoreValue)) {
        options.ignore.items.push(ignoreValue as "ASSERT" | "DISPLAY" | "PUT");
      } else {
        throw TranslationError.fromCode(
          opt.token,
          CompilerOptionsCodes.Ignore.InvalidParameter,
          opt.value,
        );
      }
    }
    reportDuplicateSubOptions(option, acceptor);
  },
  ["NOIGNORE"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.ignore = false;
  },
);

/** {@link CompilerOptions.incAfter} */
translator.rule(["INCAFTER"], (option, options) => {
  ensureArguments(option, 0, 1);
  // INCAFTER; and INCAFTER(); are accepted by the mainframe and treated as INCAFTER(PROCESS("")).
  if (option.values.length === 0) {
    options.incAfter = { process: "", token: option.token };
    return;
  }
  const value = option.values[0];
  if (value.kind === SyntaxKind.CompilerOptionText) {
    if (value.value.length === 0) {
      options.incAfter = { process: "", token: option.token };
      return;
    }
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.IncAfter.InvalidParameter,
      value.token.image,
    );
  }

  ensureType(value, "option");
  if (value.name.toUpperCase() !== "PROCESS") {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.IncAfter.InvalidParameter,
      value.token.image,
    );
  }
  ensureType(value, "option");
  ensureArguments(value, 1, 1);
  const processValue = value.values[0];
  ensureType(processValue, "plainNotEmpty");
  options.incAfter = {
    process: processValue.token.image,
    token: processValue.token,
  };
});

/** {@link CompilerOptions.incDir} */
translator.rule(
  ["INCDIR"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    if (!options.incDir) {
      options.incDir = {
        directories: [],
      };
    }
    options.incDir.directories.push(value.value);
  },
  ["NOINCDIR"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.incDir = false;
  },
);

/** {@link CompilerOptions.include} */
translator.flag("include", ["INCLUDE"], ["NOINCLUDE"]);

/** {@link CompilerOptions.incPds} */
translator.rule(
  ["INCPDS"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    if (!options.incPds) {
      options.incPds = {
        pds: [],
      };
    }
    options.incPds.pds.push(value.value);
  },
  ["NOINCPDS"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.incPds = false;
  },
);

/** {@link CompilerOptions.initAuto} */
translator.rule(
  ["INITAUTO"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.initAuto = getDefaultCompilerOptions().initAuto;
    } else {
      ensureType(option.values[0], "plain");
      const value = option.values[0].value.toUpperCase();
      if (["SHORT", "FULL"].includes(value)) {
        options.initAuto = value as CompilerOptions.InitAuto;
      } else {
        throw TranslationError.fromCode(
          option.values[0].token,
          CompilerOptionsCodes.InitAuto.InvalidParameter,
          option.values[0].value,
        );
      }
    }
  },
  ["NOINITAUTO"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.initAuto = false;
  },
);

/** {@link CompilerOptions.initBased} */
translator.flag("initBased", ["INITBASED"], ["NOINITBASED"]);

/** {@link CompilerOptions.initCtl} */
translator.flag("initCtl", ["INITCTL"], ["NOINITCTL"]);

/** {@link CompilerOptions.initStatic} */
translator.flag("initStatic", ["INITSTATIC"], ["NOINITSTATIC"]);

/** {@link CompilerOptions.inSource} */
translator.rule(
  ["INSOURCE", "IS"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    options.inSource = {};
    if (option.values.length > 0) {
      ensureType(option.values[0], "plain");
      const value = option.values[0].value.toUpperCase();
      if (["FULL", "SHORT", "ALL", "FIRST"].includes(value)) {
        options.inSource.type = value as CompilerOptions.InSource["type"];
      } else {
        throw TranslationError.fromCode(
          option.values[0].token,
          CompilerOptionsCodes.InSource.InvalidParameter,
          option.values[0].value,
        );
      }
    }
  },
  ["NOINSOURCE", "NIS"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.inSource = false;
  },
);

/** {@link CompilerOptions.interrupt} */
translator.flag("interrupt", ["INTERRUPT", "INT"], ["NOINTERRUPT", "NINT"]);

/** {@link CompilerOptions.json} */
translator.rule(["JSON"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.json);
  for (const opt of option.values) {
    const name =
      opt.kind === SyntaxKind.CompilerOption
        ? opt.name.toUpperCase()
        : opt.value.toUpperCase();
    if (/^(NO)?TRIMR$/.test(name)) {
      ensureType(opt, "plain");
      options.json.trimr = !name.startsWith("NO");
    } else if (["CASE", "ENCODING", "GET", "PARSE"].includes(name)) {
      ensureType(opt, "option");
      ensureArguments(opt, 1, 1);
      const value = opt.values[0];
      ensureType(value, "plain");
      const valueName = value.value.toUpperCase();
      switch (name) {
        case "CASE":
          if (!["UPPER", "LOWER", "ASIS"].includes(valueName)) {
            throw TranslationError.fromCode(
              value.token,
              CompilerOptionsCodes.Json.InvalidCaseParameter,
              value.value,
            );
          }
          options.json.case = valueName as CompilerOptions.Json["case"];
          break;
        case "ENCODING":
          if (!["UTF8", "EBCDIC", "37", "1047"].includes(valueName)) {
            throw TranslationError.fromCode(
              value.token,
              CompilerOptionsCodes.Json.InvalidEncodingParameter,
              value.value,
            );
          }
          options.json.encoding = valueName as CompilerOptions.Json["encoding"];
          break;
        case "GET":
          if (!["HEEDCASE", "IGNORECASE"].includes(valueName)) {
            throw TranslationError.fromCode(
              value.token,
              CompilerOptionsCodes.Json.InvalidGetParameter,
              value.value,
            );
          }
          options.json.get = valueName as CompilerOptions.Json["get"];
          break;
        case "PARSE":
          if (!["V1", "V2"].includes(valueName)) {
            throw TranslationError.fromCode(
              value.token,
              CompilerOptionsCodes.Json.InvalidParseParameter,
              value.value,
            );
          }
          options.json.parse = valueName as CompilerOptions.Json["parse"];
          break;
      }
    } else {
      throw TranslationError.fromCode(
        opt.token,
        CompilerOptionsCodes.Json.InvalidParameter,
        name,
      );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [["TRIMR", "NOTRIMR"]]);
});

/** {@link CompilerOptions.langlvl} */
translator.rule(["LANGLVL"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  for (const value of option.values) {
    ensureType(value, "plain");
    const valueName = value.value.toUpperCase();
    if (["OS", "NOEXT"].includes(valueName)) {
      options.langlvl = valueName as CompilerOptions.LangLvl;
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.LangLvl.InvalidParameter,
        value.value,
      );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [["OS", "NOEXT"]]);
});

/** {@link CompilerOptions.limits} */
translator.rule(["LIMITS"], (option, options, acceptor) => {
  const optionNumberValue = (
    option: CompilerOption,
    index: number,
    min?: number,
    max?: number,
  ) => {
    const value = option.values[index];
    ensureType(value, "plainNotEmpty");
    return ensureNumberValue(value, min, max);
  };

  ensureArguments(option, 1);
  ensureToBeDefined(options.limits);
  for (const value of option.values) {
    ensureType(value, "option");
    const name = value.name.toUpperCase();
    if (["EXTNAME", "FIXEDBIN", "FIXEDDEC", "NAME", "STRING"].includes(name)) {
      switch (name) {
        case "EXTNAME":
          ensureArguments(value, 1, 1);
          options.limits.extname = optionNumberValue(value, 0, 7, 100);
          break;
        case "FIXEDBIN":
          ensureArguments(value, 1, 2);
          const minBin = optionNumberValue(value, 0);
          const maxBin =
            value.values.length > 1 ? optionNumberValue(value, 1) : 63;
          if (minBin !== 31 && minBin !== 63) {
            throw TranslationError.fromCode(
              value.values[0].token,
              CompilerOptionsCodes.Limits.InvalidFixedBinMinParameter,
              minBin.toString(),
            );
          }
          if (maxBin !== 63) {
            throw TranslationError.fromCode(
              value.values[1].token,
              CompilerOptionsCodes.Limits.InvalidFixedBinMaxParameter,
              maxBin.toString(),
            );
          }
          options.limits.fixedBin = {
            min: minBin,
            max: maxBin,
          };
          break;
        case "FIXEDDEC":
          ensureArguments(value, 1, 2);
          const minDec = optionNumberValue(value, 0);
          const maxDec =
            value.values.length > 1 ? optionNumberValue(value, 1) : minDec;
          if (minDec !== 15 && minDec !== 31) {
            throw TranslationError.fromCode(
              value.values[0].token,
              CompilerOptionsCodes.Limits.InvalidFixedDecMinParameter,
              minDec.toString(),
            );
          }
          if (maxDec !== 15 && maxDec !== 31) {
            throw TranslationError.fromCode(
              value.values[1].token,
              CompilerOptionsCodes.Limits.InvalidFixedDecMaxParameter,
              maxDec.toString(),
            );
          }
          if (minDec > maxDec) {
            throw TranslationError.fromCode(
              value.values[0].token,
              CompilerOptionsCodes.Limits.InvalidFixedDecRange,
            );
          }
          options.limits.fixedDec = {
            min: minDec,
            max: maxDec,
          };
          break;
        case "NAME":
          ensureArguments(value, 1, 1);
          options.limits.name = optionNumberValue(value, 0, 31, 100);
          break;
        case "STRING":
          ensureArguments(value, 1, 1);
          ensureType(value.values[0], "plainNotEmpty");
          const stringValue = ensureNumberValue(
            value.values[0],
            32 * $1K,
            128 * $1M,
          );
          if (
            [32 * $1K, 64 * $1K, 512 * $1K, 8 * $1M, 128 * $1M].includes(
              stringValue,
            )
          ) {
            options.limits.string = stringValue;
          } else {
            throw TranslationError.fromCode(
              value.values[0].token,
              CompilerOptionsCodes.Limits.InvalidStringParameter,
              stringValue,
            );
          }
          break;
      }
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Limits.InvalidParameter,
        name,
      );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
});

/** {@link CompilerOptions.lineCount} */
translator.rule(["LINECOUNT", "LC"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const lineCount = ensureNumberValue(value, 0, 65535);
  if (lineCount > 0 && lineCount < 10) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.LineCount.InvalidRange,
      value.value,
    );
  }
  options.lineCount = lineCount;
});

/** {@link CompilerOptions.lineDir} */
translator.flag("lineDir", ["LINEDIR"], ["NOLINEDIR"]);

/** {@link CompilerOptions.list} */
translator.flag("list", ["LIST"], ["NOLIST"]);

/** {@link CompilerOptions.listView} */
translator.rule(["LISTVIEW"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  for (const value of option.values) {
    ensureType(value, "plain");
    const valueName = value.value.toUpperCase();
    if (
      ["SOURCE", "AFTERALL", "AFTERCICS", "AFTERMACRO", "AFTERSQL"].includes(
        valueName,
      )
    ) {
      options.listView = valueName as CompilerOptions.ListView;
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.ListView.InvalidParameter,
        value.value,
      );
    }
  }
  reportMutexSubOptions(option, acceptor, [
    ["SOURCE", "AFTERALL", "AFTERCICS", "AFTERMACRO", "AFTERSQL"],
  ]);
});

/** {@link CompilerOptions.LP} */
translator.rule(["LP"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "plain");
  const value = option.values[0].value.toUpperCase();
  if (["32", "64"].includes(value)) {
    options.LP = value as "32" | "64";
  } else {
    throw TranslationError.fromCode(
      option.values[0].token,
      CompilerOptionsCodes.Lp.InvalidParameter,
      option.values[0].value,
    );
  }
});

/** {@link CompilerOptions.macro} */
translator.flag("macro", ["MACRO"], ["NOMACRO"]);

/** {@link CompilerOptions.map} */
translator.flag("map", ["MAP"], ["NOMAP"]);

/** {@link CompilerOptions.margini} */
translator.rule(
  ["MARGINI", "MI"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    if (value.value.length === 0) {
      // Empty string sets ' ' on the mainframe.
      options.margini = " ";
      return;
    } else if (value.value.length !== 1) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Margini.InvalidParameter,
        value.value,
      );
    }
    options.margini = value.value;
  },
  ["NOMARGINI", "NMI"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.margini = " ";
  },
);

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
    const nValue = ensureNumberValue(n, 1, 200);
    if (mValue >= nValue) {
      throw TranslationError.fromCode(
        m.token,
        CompilerOptionsCodes.Margins.InvalidMarginPosition,
      );
    }
    options.margins = {
      m: mValue,
      n: nValue,
    };
    if (option.values.length > 2) {
      const c = option.values[2];
      ensureType(c, "plainNotEmpty");
      const cValue = ensureNumberValue(c, 0, 200);
      if (cValue >= mValue && cValue <= nValue) {
        throw TranslationError.fromCode(
          c.token,
          CompilerOptionsCodes.Margins.InvalidAnsPosition,
        );
      }
      options.margins.c = cValue;
    }
  },
  ["NOMARGINS"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.margins = false;
  },
);

/** {@link CompilerOptions.maxbranch} */
translator.rule(["MAXBRANCH"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.maxbranch = ensureNumberValue(value, 0);
});

/** {@link CompilerOptions.maxinit} */
translator.rule(["MAXINIT"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.maxinit = ensureNumberValue(value, 0);
});

/** {@link CompilerOptions.maxgen} */
translator.rule(["MAXGEN"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.maxgen = ensureNumberValue(value, 0);
});

/** {@link CompilerOptions.maxmem} */
translator.rule(["MAXMEM", "MAXM"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.maxmem = ensureNumberValue(value, 1, 2097152);
});

/** {@link CompilerOptions.maxmsg} */
translator.rule(["MAXMSG"], (option, options, acceptor) => {
  // MAXMSG only recognizes the last letter or number, respectively.
  // The letter/number order does not matter.
  ensureArguments(option, 1);
  ensureToBeDefined(options.maxmsg);
  if (isEmptyParameterList(option)) {
    return;
  }
  for (const value of option.values) {
    ensureType(value, "plain");
    const valueName = value.value.toUpperCase();
    if (["I", "W", "E", "S"].includes(valueName)) {
      options.maxmsg.severity = valueName as CompilerOptions.Flag;
    } else {
      options.maxmsg.n = ensureNumberValue(value, 0, 32767);
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [["I", "W", "E", "S"]]);
});

/** {@link CompilerOptions.maxnest} */
translator.rule(["MAXNEST"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.maxnest);
  // Suboptions may override previously set values.
  for (const suboption of option.values) {
    ensureType(suboption, "option");
    const name = suboption.name.toLowerCase();
    if (["block", "do", "if"].includes(name)) {
      ensureArguments(suboption, 1, 1);
      const value = suboption.values[0];
      ensureType(value, "plainNotEmpty");
      options.maxnest[name as keyof CompilerOptions.MaxNest] =
        ensureNumberValue(value, 1, 50);
    } else {
      throw TranslationError.fromCode(
        suboption.token,
        CompilerOptionsCodes.MaxNest.InvalidParameter,
        suboption.name,
      );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
});

/** {@link CompilerOptions.maxRunOnIf} */
translator.rule(["MAXRUNONIF"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  // The spec does not specify the minimum and maximum values.
  // The mainframe testing suggests 2 - 1000.
  options.maxRunOnIf = ensureNumberValue(value, 2, 1000);
});

/** {@link CompilerOptions.maxStatic} */
translator.rule(["MAXSTATIC"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.maxStatic = ensureNumberValue(value, 1);
});

/** {@link CompilerOptions.maxStmt} */
translator.rule(["MAXSTMT"], (option, options) => {
  ensureArguments(option, 1, 2);
  const mValue = option.values[0];
  ensureType(mValue, "plainNotEmpty");
  const nValue = option.values.length > 1 ? option.values[1] : mValue;
  ensureType(nValue, "plainNotEmpty");
  const m = ensureNumberValue(mValue, 1);
  const n = ensureNumberValue(nValue, 1);
  if (m > n) {
    throw TranslationError.fromCode(
      mValue.token,
      CompilerOptionsCodes.MaxStmt.InvalidRange,
    );
  }
  options.maxStmt = {
    m,
    n,
  };
});

/** {@link CompilerOptions.maxTemp} */
translator.rule(["MAXTEMP"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.maxTemp = ensureNumberValue(value, 1);
});

/** {@link CompilerOptions.mDeck} */
translator.rule(
  ["MDECK", "MD"],
  (option, options, acceptor) => {
    ensureArguments(option, 1);
    // Only the last value takes effect.
    for (const value of option.values) {
      ensureType(value, "plain");
      const valueName = value.value.toUpperCase();
      if (["AFTERALL", "AFTERMACRO"].includes(valueName)) {
        options.mDeck = valueName as CompilerOptions.MDeck;
      } else {
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.MDeck.InvalidParameter,
          value.value,
        );
      }
    }
    reportDuplicateSubOptions(option, acceptor);
    reportMutexSubOptions(option, acceptor, [["AFTERALL", "AFTERMACRO"]]);
  },
  ["NOMDECK", "NMD"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.mDeck = false;
  },
);

/** {@link CompilerOptions.msgSummary} */
translator.rule(
  ["MSGSUMMARY"],
  (option, options) => {
    // Actually does not accept multiple or empty values.
    // *PROCESS MSGSUMMARY; is valid, but *PROCESS MSGSUMMARY(); is not.
    ensureArguments(option, 0, 1);
    let valueName = "NOXREF";
    if (option.values.length === 1) {
      const value = option.values[0];
      ensureType(value, "plainNotEmpty");
      valueName = value.value.toUpperCase();
    }
    if (["XREF", "NOXREF"].includes(valueName)) {
      options.msgSummary = valueName as CompilerOptions.MsgSummary;
    } else {
      // Can only be reached if the value is plain.
      throw TranslationError.fromCode(
        option.values[0].token,
        CompilerOptionsCodes.MsgSummary.InvalidParameter,
        (option.values[0] as CompilerOptionText).value,
      );
    }
  },
  ["NOMSGSUMMARY"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.msgSummary = false;
  },
);

/** {@link CompilerOptions.name} */
translator.rule(
  ["NAME", "N"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 1) {
      const value = option.values[0];
      ensureType(value, "plainOrString");
      if (
        value.kind === SyntaxKind.CompilerOptionText &&
        value.value.length === 0
      ) {
        // If it is just plain text, no text is not recognized.
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.ExpectedPlainNotEmpty,
          value.value,
        );
      }
      options.name = value.value;
    } else {
      options.name = true;
    }
  },
  ["NONAME"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.name = false;
  },
);

/** {@link CompilerOptions.names} */
translator.rule(["NAMES"], (option, options) => {
  const ensureSafeCharacters = (
    value: CompilerOptionText | CompilerOptionString,
  ) => {
    const seen = new Set<string>();
    for (const char of value.value) {
      // The character must not be from the character or set nor occur more than once.
      if (Options.PLI_CHARACTER_SET.has(char) || seen.has(char)) {
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.Names.CharacterAlreadyDefined,
          char,
          "NAMES",
        );
      }
      seen.add(char);
    }
  };

  ensureArguments(option, 1, 2);
  const firstValue = option.values[0];
  // TODO ssmifi: The mainframe accepts plain and string tokens.
  // However, the options parser does not support special characters in plain tokens currently.
  ensureType(firstValue, "plainOrString");
  ensureSafeCharacters(firstValue);
  options.names = {
    extralingChar: firstValue.value,
    uppExtralingChar: firstValue.value,
  };
  if (option.values.length > 1) {
    const secondValue = option.values[1];
    ensureType(secondValue, "plainOrString");
    ensureSafeCharacters(secondValue);
    if (firstValue.value.length !== secondValue.value.length) {
      throw TranslationError.fromCode(
        secondValue.token,
        CompilerOptionsCodes.Names.InvalidParameterLengths,
        "NAMES",
      );
    }
    options.names.uppExtralingChar = secondValue.value;
  }
});

/** {@link CompilerOptions.natlang} */
translator.rule(["NATLANG"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const lang = value.value.toUpperCase();
  if (["ENU", "UEN"].includes(lang)) {
    options.natlang = lang as CompilerOptions.NatLang;
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.NatLang.InvalidParameter,
      value.value,
    );
  }
});

/** {@link CompilerOptions.nest} */
translator.flag("nest", ["NEST"], ["NONEST"]);

/** {@link CompilerOptions.not} */
translator.rule(["NOT"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "string");
  if (value.value.length !== 1) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Not.InvalidParameterLength,
      value.value,
    );
  }
  if (
    value.value !== NOT_CHARACTER &&
    Options.PLI_CHARACTER_REGEX.test(value.value)
  ) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Not.InvalidParameterCharacter,
      value.value,
    );
  }
  options.not = value.value;
});

/** {@link CompilerOptions.nullDate} */
translator.flag("nullDate", ["NULLDATE"], ["NONULLDATE"]);

/** {@link CompilerOptions.object} */
translator.flag("object", ["OBJECT", "OBJ"], ["NOOBJECT", "NOBJ"]);

/** {@link CompilerOptions.offset} */
translator.flag("offset", ["OFFSET"], ["NOOFFSET"]);

/** {@link CompilerOptions.offsetSize} */
translator.rule(["OFFSETSIZE"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const offsetSize = ensureNumberValue(value);
  if (offsetSize !== 4 && offsetSize !== 8) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.OffsetSize.InvalidParameter,
      value.value,
    );
  }
  options.offsetSize = offsetSize;
});

/** {@link CompilerOptions.onSnap} */
translator.rule(
  ["ONSNAP"],
  (option, options, acceptor) => {
    ensureArguments(option, 1);
    if (!options.onSnap) {
      options.onSnap = {
        stringRange: false,
        stringSize: false,
      };
    }
    for (const value of option.values) {
      ensureType(value, "plain");
      if (value.value.length === 0) {
        continue;
      }
      const onSnapValue = value.value.toUpperCase();
      if (onSnapValue === "STRINGRANGE") {
        options.onSnap.stringRange = true;
      } else if (onSnapValue === "STRINGSIZE") {
        options.onSnap.stringSize = true;
      } else {
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.OnSnap.InvalidParameter,
          value.value,
        );
      }
    }
    if (!options.onSnap.stringRange && !options.onSnap.stringSize) {
      // Special case: If both stringRange and stringSize are false, the onSnap option is disabled.
      options.onSnap = false;
    }
    reportDuplicateSubOptions(option, acceptor);
  },
  ["NOONSNAP"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.onSnap = false;
  },
);

/** {@link CompilerOptions.optimize} */
translator.rule(
  ["OPTIMIZE", "OPT"],
  (option, options, acceptor) => {
    // Verified 0 and more than 1 argument. The last one takes effect.
    ensureArguments(option, 0);
    if (option.values.length === 0) {
      // *PROCESS OPTIMIZE; enables level 3, whereas *PROCESS OPTIMIZE(); toggles level 0.
      options.optimize = 3;
      return;
    }
    for (const value of option.values) {
      ensureType(value, "plain");
      const valueName = value.value.toUpperCase();
      if (valueName.length === 0 || valueName === "0") {
        options.optimize = 0;
      } else if (
        valueName === "2" ||
        valueName === "3" ||
        valueName === "TIME"
      ) {
        options.optimize = 3;
      } else {
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.Optimize.InvalidParameter,
          value.value,
        );
      }
    }
    reportDuplicateSubOptions(option, acceptor);
    reportMutexSubOptions(option, acceptor, [["0", "2", "3", "TIME"]]);
  },
  ["NOOPTIMIZE", "NOPT"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.optimize = 0;
  },
);

/** {@link CompilerOptions.options} */
translator.rule(
  ["OPTIONS", "OP"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.options = "DOC";
      return;
    }
    ensureType(option.values[0], "plainNotEmpty");
    const valueName = option.values[0].value.toUpperCase();
    if (["DOC", "ALL"].includes(valueName)) {
      options.options = valueName as CompilerOptions.Options;
    } else {
      throw TranslationError.fromCode(
        option.values[0].token,
        CompilerOptionsCodes.Options.InvalidParameter,
        valueName,
      );
    }
  },
  ["NOOPTIONS", "NOP"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.options = false;
  },
);

/** {@link CompilerOptions.or} */
translator.rule(["OR"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "string");
  if (value.value.length !== 1) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Or.InvalidParameterLength,
      value.value,
    );
  }
  if (value.value !== "|" && Options.PLI_CHARACTER_REGEX.test(value.value)) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Or.InvalidParameterCharacter,
      value.value,
    );
  }
  options.or = value.value;
});

/** {@link CompilerOptions.pp} */
translator.rule(
  ["PP"],
  (option, options) => {
    // 1 or more pre-processor options to collect
    ensureArguments(option, 1);
    ensureToBeDefined(options.pp);
    ensureToBeDefined(options.pp.items);

    for (const value of option.values) {
      const name = ensureArgument<CompilerOptions.PPItem["name"]>(
        value,
        CompilerOptionsCodes.PP.InvalidParameter,
        ["MACRO", "SQL", "CICS", "INCLUDE"],
      );
      if (value.kind === SyntaxKind.CompilerOptionText) {
        options.pp.items.push({ name });
      } else if (value.kind === SyntaxKind.CompilerOption) {
        if (value.values.length !== 1) {
          throw TranslationError.fromCode(
            value.token,
            CompilerOptionsCodes.PP.InvalidOptionParameter,
            value.token.image,
            value.values.length,
          );
        }
        ensureType(value.values[0], "string");
        options.pp.items.push({
          name,
          value: value.values[0].value,
          token: value.values[0].token,
        });

        if (name === "INCLUDE") {
          // set this as the effective INCLUDE PP option value, overriding any previous INCLUDE options
          const match = value.values[0].value.match(/ID\(([^\)]+)\)\s*$/);
          if (match && match.length > 0) {
            options.pp.ppInclude = {
              value: match[0].slice(3, -1).toUpperCase(),
            };
          }
        }
      } else {
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.PP.InvalidParameterType,
        );
      }
    }
  },
  ["NOPP"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.pp = { items: [] };
  },
);

/** {@link CompilerOptions.ppCics} */
translator.rule(
  ["PPCICS"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    options.ppCics = value.value;
  },
  ["NOPPCICS"],
  (option, options) => {
    options.ppCics = false;
    ensureArguments(option, 0, 0);
  },
);

/** {@link CompilerOptions.ppInclude} */
translator.rule(
  ["PPINCLUDE"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    options.ppInclude = value.value;
  },
  ["NOPPINCLUDE"],
  (option, options) => {
    options.ppInclude = false;
    ensureArguments(option, 0, 0);
  },
);

/** {@link CompilerOptions.ppList} */
translator.rule(
  ["PPLIST"],
  plainTranslate(
    (options, value) => {
      options.ppList = value.value as "KEEP" | "ERASE";
    },
    "KEEP",
    "ERASE",
  ),
);

/** {@link CompilerOptions.ppMacro} */
translator.rule(
  ["PPMACRO"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    options.ppMacro = {
      value: value.value,
      token: value.token,
    };
  },
  ["NOPPMACRO"],
  (option, options) => {
    options.ppMacro = false;
    ensureArguments(option, 0, 0);
  },
);

/** {@link CompilerOptions.ppSql} */
translator.rule(
  ["PPSQL"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    options.ppSql = value.value;
  },
  ["NOPPSQL"],
  (option, options) => {
    options.ppSql = false;
    ensureArguments(option, 0, 0);
  },
);

/** {@link CompilerOptions.ppTrace} */
translator.rule(
  ["PPTRACE"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.ppTrace = true;
  },
  ["NOPPTRACE"],
  (option, options) => {
    options.ppTrace = false;
    ensureArguments(option, 0, 0);
  },
);

/** {@link CompilerOptions.precType} */
translator.rule(["PRECTYPE"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.precType = ensureArgument(
    value,
    CompilerOptionsCodes.PrecType.InvalidParameter,
    ["ANS", "DECDIGIT", "DECRESULT"],
  );
});

/** {@link CompilerOptions.prefix} */
translator.rule(["PREFIX"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.prefix);
  for (const value of option.values) {
    ensureType(value, "plain");
    if (value.value.length === 0) {
      // Will only happen, if the arguments list is empty.
      return;
    }
    const valueName = value.value.toUpperCase();
    const setCondition = !valueName.startsWith("NO");
    const name = setCondition ? valueName : valueName.slice(2);
    const condition = CompilerConditions.PLI_CONDITIONS.find((c) =>
      (c.condition as readonly string[]).includes(name),
    ) as CompilerConditions.Condition | undefined;
    if (!condition) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Prefix.InvalidParameter,
        value.value,
      );
    }
    if (condition.alwaysEnabled) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Prefix.ConditionIsAlwaysEnabled,
        value.value,
      );
    }
    options.prefix[
      condition.condition[0].toLowerCase() as keyof CompilerConditions.ConditionOptions
    ] = setCondition;
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(
    option,
    acceptor,
    CompilerConditions.PLI_CONDITIONS.flatMap((c) =>
      c.condition.map((condition) => [condition, `NO${condition}`]),
    ),
  );
});

/** {@link CompilerOptions.proceed} */
translator.rule(
  ["PROCEED", "PRO"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.proceed = { noProceed: "S" };
  },
  ["NOPROCEED", "NPRO"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.proceed = { noProceed: "I" };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    const name = value.value.toUpperCase();
    if (["S", "E", "W"].includes(name)) {
      options.proceed = { noProceed: name as CompilerOptions.Flag };
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Proceed.InvalidParameter,
        name,
      );
    }
  },
);

/** {@link CompilerOptions.process} */
translator.rule(
  ["PROCESS"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.process = "DELETE";
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    const name = value.value.toUpperCase();
    if (["DELETE", "KEEP"].includes(name)) {
      options.process = name as CompilerOptions.Process;
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Process.InvalidParameter,
        name,
      );
    }
  },
  ["NOPROCESS"],
  (option, options) => {
    options.process = false;
    ensureArguments(option, 0, 0);
  },
);

/** {@link CompilerOptions.quote} */
translator.rule(["QUOTE"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  // TODO ssmifi: The directive does not allow to use " as string delimiter. It must be set via '.
  ensureType(value, "string");
  if (value.value.length !== 1) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Quote.InvalidParameterLength,
      value.value,
    );
  }
  if (value.value !== '"' && Options.PLI_CHARACTER_REGEX.test(value.value)) {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Quote.InvalidParameterCharacter,
      value.value,
    );
  }
  options.quote = value.value;
});

/** {@link CompilerOptions.reduce} */
translator.flag("reduce", ["REDUCE"], ["NOREDUCE"]);

/** {@link CompilerOptions.rent} */
translator.flag("rent", ["RENT"], ["NORENT"]);

/** {@link CompilerOptions.resExp} */
translator.flag("resExp", ["RESEXP"], ["NORESEXP"]);

/** {@link CompilerOptions.respect} */
translator.rule(["RESPECT"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  if (value.value.length === 0) {
    options.respect = { date: false };
    return;
  }
  if (value.value.toUpperCase() === "DATE") {
    options.respect = { date: true };
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Respect.InvalidParameter,
      value.value,
    );
  }
});

/** {@link CompilerOptions.rtCheck} */
translator.rule(["RTCHECK"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  if (value.value.length === 0) {
    options.rtCheck = getDefaultCompilerOptions().rtCheck;
    return;
  }
  const name = value.value.toUpperCase();
  if (["NONULLPTR", "NULLPTR", "NULL370"].includes(name)) {
    options.rtCheck = name as CompilerOptions.RtCheck;
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.RtCheck.InvalidParameter,
      value.value,
    );
  }
});

/** {@link CompilerOptions.rules} */
translator.rule(["RULES"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.rules);
  // Multiple RULES calls are accumulated.
  for (const value of option.values) {
    if (value.kind === SyntaxKind.CompilerOptionText) {
      if (value.value.length === 0) {
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.ExpectedPlainNotEmpty,
        );
      }
      const name = value.value.toUpperCase();
      // TODO ssmifi: Refactor non-null assertions after #388.
      switch (name) {
        case "IBM":
          options.rules.ibm = "IBM";
          break;
        case "ANS":
          options.rules.ibm = "ANS";
          break;
        case "BYNAME":
          options.rules.byName = true;
          break;
        case "NOBYNAME":
          options.rules.byName = false;
          break;
        case "COMPLEX":
          options.rules.complex = true;
          break;
        case "NOCOMPLEX":
          options.rules.complex = "ALL";
          break;
        case "CONTROLLED":
          options.rules.controlled = true;
          break;
        case "NOCONTROLLED":
          options.rules.controlled = false;
          break;
        case "DECSIZE":
          options.rules.decSize = true;
          break;
        case "NODECSIZE":
          options.rules.decSize = false;
          break;
        case "ELSEIF":
          options.rules.elseIf = true;
          break;
        case "NOELSEIF":
          options.rules.elseIf = false;
          break;
        case "EVENDEC":
          options.rules.evenDec = true;
          break;
        case "NOEVENDEC":
          options.rules.evenDec = false;
          break;
        case "GLOBAL":
          options.rules.global = true;
          break;
        case "NOGLOBAL":
          options.rules.global = "ALL";
          break;
        case "GLOBALDO":
          options.rules.globalDo = true;
          break;
        case "NOGLOBALDO":
          options.rules.globalDo = false;
          break;
        case "GOTO":
          options.rules.goto = true;
          break;
        case "NOGOTO":
          options.rules.goto = "STRICT";
          break;
        case "LAXBIF":
          options.rules.laxBIf = true;
          break;
        case "NOLAXBIF":
          options.rules.laxBIf = false;
          break;
        case "LAXCONV":
          options.rules.laxConv = true;
          break;
        case "NOLAXCONV":
          options.rules.laxConv = "ALL";
          break;
        case "LAXCTL":
          options.rules.laxCtl = true;
          break;
        case "NOLAXCTL":
          options.rules.laxCtl = false;
          break;
        case "LAXDCL":
          options.rules.laxDcl = true;
          break;
        case "NOLAXDCL":
          options.rules.laxDcl = false;
          break;
        case "LAXDEF":
          options.rules.laxDef = true;
          break;
        case "NOLAXDEF":
          options.rules.laxDef = false;
          break;
        case "LAXENTRY":
          options.rules.laxEntry = true;
          break;
        case "NOLAXENTRY":
          options.rules.laxEntry = "STRICT";
          break;
        case "LAXEXPORTS":
          options.rules.laxExports = true;
          break;
        case "NOLAXEXPORTS":
          options.rules.laxExports = false;
          break;
        case "LAXFIELDS":
          options.rules.laxFields = true;
          break;
        case "NOLAXFIELDS":
          options.rules.laxFields = false;
          break;
        case "LAXIF":
          options.rules.laxIf = true;
          break;
        case "NOLAXIF":
          options.rules.laxIf = false;
          break;
        case "LAXINOUT":
          options.rules.laxInOut = true;
          break;
        case "NOLAXINOUT":
          options.rules.laxInOut = { source: "ALL", strict: "STRICT" };
          break;
        case "LAXINTERFACE":
          options.rules.laxInterface = true;
          break;
        case "NOLAXINTERFACE":
          options.rules.laxInterface = false;
          break;
        case "LAXLINK":
          options.rules.laxLink = true;
          break;
        case "NOLAXLINK":
          options.rules.laxLink = false;
          break;
        case "LAXMARGINS":
          options.rules.laxMargins = true;
          break;
        case "NOLAXMARGINS":
          options.rules.laxMargins = "STRICT";
          break;
        case "LAXNESTED":
          options.rules.laxNested = true;
          break;
        case "NOLAXNESTED":
          options.rules.laxNested = "ALL";
          break;
        case "LAXOPTIONAL":
          options.rules.laxOptional = true;
          break;
        case "NOLAXOPTIONAL":
          options.rules.laxOptional = "ALL";
          break;
        case "LAXPACKAGE":
          options.rules.laxPackage = true;
          break;
        case "NOLAXPACKAGE":
          options.rules.laxPackage = false;
          break;
        case "LAXPARMS":
          options.rules.laxParms = true;
          break;
        case "NOLAXPARMS":
          options.rules.laxParms = "ALL";
          break;
        case "LAXPUNC":
          options.rules.laxPunc = true;
          break;
        case "NOLAXPUNC":
          options.rules.laxPunc = false;
          break;
        case "LAXQUAL":
          options.rules.laxQual = true;
          break;
        case "NOLAXQUAL":
          options.rules.laxQual = { source: "ALL", strict: "LOOSE" };
          break;
        case "LAXRETURN":
          options.rules.laxReturn = true;
          break;
        case "NOLAXRETURN":
          options.rules.laxReturn = false;
          break;
        case "LAXSCALE":
          options.rules.laxScale = true;
          break;
        case "NOLAXSCALE":
          options.rules.laxScale = { source: "ALL", strict: "LOOSE" };
          break;
        case "LAXSEMI":
          options.rules.laxSemi = true;
          break;
        case "NOLAXSEMI":
          options.rules.laxSemi = false;
          break;
        case "LAXSTG":
          options.rules.laxStg = true;
          break;
        case "NOLAXSTG":
          options.rules.laxStg = false;
          break;
        case "LAXSTMT":
          options.rules.laxStmt = true;
          break;
        case "NOLAXSTMT":
          options.rules.laxStmt = "ALL";
          break;
        case "LAXSTRZ":
          options.rules.laxStrz = true;
          break;
        case "NOLAXSTRZ":
          options.rules.laxStrz = false;
          break;
        case "MULTICLOSE":
          options.rules.multiClose = true;
          break;
        case "NOMULTICLOSE":
          options.rules.multiClose = false;
          break;
        case "MULTIENTRY":
          options.rules.multiEntry = true;
          break;
        case "NOMULTIENTRY":
          options.rules.multiEntry = "ALL";
          break;
        case "MULTIEXIT":
          options.rules.multiExit = true;
          break;
        case "NOMULTIEXIT":
          options.rules.multiExit = "ALL";
          break;
        case "MULTISEMI":
          options.rules.multiSemi = true;
          break;
        case "NOMULTISEMI":
          options.rules.multiSemi = "ALL";
          break;
        case "PADDING":
          options.rules.padding = true;
          break;
        case "NOPADDING":
          options.rules.padding = { source: "ALL", strict: "LOOSE" };
          break;
        case "PROCENDONLY":
          options.rules.procEndOnly = true;
          break;
        case "NOPROCENDONLY":
          options.rules.procEndOnly = "ALL";
          break;
        case "RECURSIVE":
          options.rules.recursive = true;
          break;
        case "NORECURSIVE":
          options.rules.recursive = false;
          break;
        case "SELFASSIGN":
          options.rules.selfAssign = true;
          break;
        case "NOSELFASSIGN":
          options.rules.selfAssign = false;
          break;
        case "UNREF":
          options.rules.unref = true;
          break;
        case "NOUNREF":
          options.rules.unref = "ALL";
          break;
        case "UNREFBASED":
          options.rules.unrefBased = true;
          break;
        case "NOUNREFBASED":
          options.rules.unrefBased = "ALL";
          break;
        case "UNREFCTL":
          options.rules.unrefCtl = true;
          break;
        case "NOUNREFCTL":
          options.rules.unrefCtl = "ALL";
          break;
        case "UNREFDEFINED":
          options.rules.unrefDefined = true;
          break;
        case "NOUNREFDEFINED":
          options.rules.unrefDefined = "ALL";
          break;
        case "UNREFENTRY":
          options.rules.unrefEntry = true;
          break;
        case "NOUNREFENTRY":
          options.rules.unrefEntry = "ALL";
          break;
        case "UNREFFILE":
          options.rules.unrefFile = true;
          break;
        case "NOUNREFFILE":
          options.rules.unrefFile = "ALL";
          break;
        case "UNREFSTATIC":
          options.rules.unrefStatic = true;
          break;
        case "NOUNREFSTATIC":
          options.rules.unrefStatic = "ALL";
          break;
        case "UNREFVALUE":
          options.rules.unrefValue = true;
          break;
        case "NOUNREFVALUE":
          options.rules.unrefValue = "ALL";
          break;
        case "UNSET":
          options.rules.unset = true;
          break;
        case "NOUNSET":
          options.rules.unset = false;
          break;
        case "YY":
          options.rules.yy = true;
          break;
        case "NOYY":
          options.rules.yy = false;
          break;
        default:
          throw TranslationError.fromCode(
            value.token,
            CompilerOptionsCodes.Rules.InvalidParameter,
            name,
          );
      }
    } else if (value.kind === SyntaxKind.CompilerOption) {
      const subOption = value.values[0];
      ensureType(subOption, "plainNotEmpty");
      const name = value.name.toUpperCase();
      switch (name) {
        case "NOCOMPLEX":
          options.rules.complex = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOGLOBAL":
          options.rules.global = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOGOTO":
          options.rules.goto = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.InvalidGotoParameter,
            ["STRICT", "LOOSE", "LOOSEFORWARD"],
          );
          break;
        case "NOLAXCONV":
          options.rules.laxConv = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOLAXENTRY":
          options.rules.laxEntry = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.InvalidLaxEntryParameter,
            ["STRICT", "LOOSE"],
          );
          break;
        case "NOLAXINOUT":
          options.rules.laxInOut = { source: "ALL", strict: "STRICT" };
          for (const sub of value.values) {
            ensureType(sub, "plainNotEmpty");
            const subName = sub.value.toUpperCase();
            if (["ALL", "SOURCE"].includes(subName)) {
              options.rules.laxInOut.source = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidLaxInOutParameter,
                ["ALL", "SOURCE"],
              );
            } else {
              options.rules.laxInOut.strict = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidLaxInOutParameter,
                ["STRICT", "LOOSE"],
              );
            }
          }
          break;
        case "NOLAXMARGINS":
          options.rules.laxMargins = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.InvalidLaxMarginsParameter,
            ["STRICT", "XNUMERIC"],
          );
          break;
        case "NOLAXNESTED":
          options.rules.laxNested = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOLAXOPTIONAL":
          options.rules.laxOptional = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOLAXPARMS":
          options.rules.laxParms = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOLAXQUAL":
          options.rules.laxQual = { source: "ALL", strict: "LOOSE" };
          for (const sub of value.values) {
            ensureType(sub, "plainNotEmpty");
            const subName = sub.value.toUpperCase();
            if (["ALL", "FORCE"].includes(subName)) {
              options.rules.laxQual.source = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidLaxQualParameter,
                ["ALL", "FORCE"],
              );
            } else {
              options.rules.laxQual.strict = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidLaxQualParameter,
                ["STRICT", "LOOSE", "FULL"],
              );
            }
          }
          break;
        case "NOLAXSCALE":
          options.rules.laxScale = { source: "ALL", strict: "STRICT" };
          for (const sub of value.values) {
            ensureType(sub, "plainNotEmpty");
            const subName = sub.value.toUpperCase();
            if (["ALL", "SOURCE"].includes(subName)) {
              options.rules.laxScale.source = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidLaxScaleParameter,
                ["ALL", "SOURCE"],
              );
            } else {
              options.rules.laxScale.strict = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidLaxScaleParameter,
                ["STRICT", "LOOSE"],
              );
            }
          }
          break;
        case "NOLAXSTMT":
          options.rules.laxStmt = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOMULTIENTRY":
          options.rules.multiEntry = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOMULTIEXIT":
          options.rules.multiExit = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOMULTISEMI":
          options.rules.multiSemi = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOPADDING":
          options.rules.padding = { source: "ALL", strict: "LOOSE" };
          for (const sub of value.values) {
            ensureType(sub, "plainNotEmpty");
            const subName = sub.value.toUpperCase();
            if (["ALL", "SOURCE"].includes(subName)) {
              options.rules.padding.source = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidPaddingParameter,
                ["ALL", "SOURCE"],
              );
            } else {
              options.rules.padding.strict = ensureArgument(
                sub,
                CompilerOptionsCodes.Rules.InvalidPaddingParameter,
                ["STRICT", "LOOSE"],
              );
            }
          }
          break;
        case "NOPROCENDONLY":
          options.rules.procEndOnly = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREF":
          options.rules.unref = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFBASED":
          options.rules.unrefBased = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFCTL":
          options.rules.unrefCtl = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFDEFINED":
          options.rules.unrefDefined = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFENTRY":
          options.rules.unrefEntry = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFFILE":
          options.rules.unrefFile = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFSTATIC":
          options.rules.unrefStatic = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        case "NOUNREFVALUE":
          options.rules.unrefValue = ensureArgument(
            subOption,
            CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
            ["ALL", "SOURCE"],
          );
          break;
        default:
          throw TranslationError.fromCode(
            value.token,
            CompilerOptionsCodes.Rules.InvalidParameter,
            name,
          );
      }
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [
    ["IBM", "ANS"],
    ["BYNAME", "NOBYNAME"],
    ["CONTROLLED", "NOCONTROLLED"],
    ["DECSIZE", "NODECSIZE"],
    ["ELSEIF", "NOELSEIF"],
    ["EVENDEC", "NOEVENDEC"],
    ["GLOBAL", "NOGLOBAL"],
    ["GLOBALDO", "NOGLOBALDO"],
    ["GOTO", "NOGOTO"],
    ["LAXBIF", "NOLAXBIF"],
    ["LAXCONV", "NOLAXCONV"],
    ["LAXCTL", "NOLAXCTL"],
    ["LAXDCL", "NOLAXDCL"],
    ["LAXDEF", "NOLAXDEF"],
    ["LAXENTRY", "NOLAXENTRY"],
    ["LAXEXPORTS", "NOLAXEXPORTS"],
    ["LAXFIELDS", "NOLAXFIELDS"],
    ["LAXIF", "NOLAXIF"],
    ["LAXINOUT", "NOLAXINOUT"],
    ["LAXINTERFACE", "NOLAXINTERFACE"],
    ["LAXLINK", "NOLAXLINK"],
    ["LAXMARGINS", "NOLAXMARGINS"],
    ["LAXNESTED", "NOLAXNESTED"],
    ["LAXOPTIONAL", "NOLAXOPTIONAL"],
    ["LAXPACKAGE", "NOLAXPACKAGE"],
    ["LAXPARMS", "NOLAXPARMS"],
    ["LAXPUNC", "NOLAXPUNC"],
    ["LAXQUAL", "NOLAXQUAL"],
    ["LAXRETURN", "NOLAXRETURN"],
    ["LAXSCALE", "NOLAXSCALE"],
    ["LAXSEMI", "NOLAXSEMI"],
    ["LAXSTG", "NOLAXSTG"],
    ["LAXSTMT", "NOLAXSTMT"],
    ["LAXSTRZ", "NOLAXSTRZ"],
    ["MULTICLOSE", "NOMULTICLOSE"],
    ["MULTIENTRY", "NOMULTIENTRY"],
    ["MULTIEXIT", "NOMULTIEXIT"],
    ["MULTISEMI", "NOMULTISEMI"],
    ["PADDING", "NOPADDING"],
    ["PROCENDONLY", "NOPROCENDONLY"],
    ["RECURSIVE", "NORECURSIVE"],
    ["SELFASSIGN", "NOSELFASSIGN"],
    ["UNREF", "NOUNREF"],
    ["UNREFBASED", "NOUNREFBASED"],
    ["UNREFCTL", "NOUNREFCTL"],
    ["UNREFDEFINED", "NOUNREFDEFINED"],
    ["UNREFENTRY", "NOUNREFENTRY"],
    ["UNREFFILE", "NOUNREFFILE"],
    ["UNREFSTATIC", "NOUNREFSTATIC"],
    ["UNREFVALUE", "NOUNREFVALUE"],
    ["UNSET", "NOUNSET"],
    ["YY", "NOYY"],
  ]);
});

/** {@link CompilerOptions.semantic} */
translator.rule(
  ["SEMANTIC", "SEM"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.semantic = { noSemantic: "S" };
  },
  ["NOSEMANTIC", "NSEM"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.semantic = { noSemantic: "I" };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    const name = value.value.toUpperCase();
    if (["S", "E", "W"].includes(name)) {
      options.semantic = { noSemantic: name as CompilerOptions.Flag };
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Semantic.InvalidParameter,
        name,
      );
    }
  },
);

/** {@link CompilerOptions.service} */
translator.rule(
  ["SERVICE", "SERV"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plainOrString");
    if (
      value.kind === SyntaxKind.CompilerOptionText &&
      value.value.length === 0
    ) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Service.InvalidEmptyPlainParameter,
        value.token.image,
      );
    }
    if (value.value.length > 64) {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Service.InvalidParameterLength,
        value.value.length,
      );
    }
    options.service = value.value;
  },
  ["NOSERVICE", "NOSERV"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.service = false;
  },
);

/** {@link CompilerOptions.source} */
translator.flag("source", ["SOURCE", "S"], ["NOSOURCE", "NS"]);

/** {@link CompilerOptions.spill} */
translator.rule(["SPILL", "SP"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "plainNotEmpty");
  options.spill = ensureNumberValue(option.values[0], 0, 3900);
});

/** {@link CompilerOptions.static} */
translator.rule(["STATIC"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const name = value.value.toUpperCase();
  if (["SHORT", "FULL"].includes(name)) {
    options.static = name as CompilerOptions.Length;
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Static.InvalidParameter,
      name,
    );
  }
});

/** {@link CompilerOptions.stdsys} */
translator.flag("stdsys", ["STDSYS"], ["NOSTDSYS"]);

/** {@link CompilerOptions.stmt} */
translator.flag("stmt", ["STMT"], ["NOSTMT"]);

/** {@link CompilerOptions.storage} */
translator.flag("storage", ["STORAGE", "STG"], ["NOSTORAGE", "NSTG"]);

/** {@link CompilerOptions.stringOfGraphic} */
translator.rule(["STRINGOFGRAPHIC", "CHAR", "G"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const name = value.value.toUpperCase();
  if (["CHARACTER", "GRAPHIC"].includes(name)) {
    options.stringOfGraphic = name as CompilerOptions.StringOfGraphic;
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.StringOfGraphic.InvalidParameter,
      name,
    );
  }
});

/** {@link CompilerOptions.syntax} */
translator.rule(
  ["SYNTAX", "SYN"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.syntax = { noSyntax: "S" };
  },
  ["NOSYNTAX", "NSYN"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.syntax = { noSyntax: "I" };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    const name = value.value.toUpperCase();
    if (["S", "E", "W"].includes(name)) {
      options.syntax = { noSyntax: name as CompilerOptions.Flag };
    } else {
      throw TranslationError.fromCode(
        value.token,
        CompilerOptionsCodes.Syntax.InvalidParameter,
        name,
      );
    }
  },
);

/** {@link CompilerOptions.sysParm} */
translator.rule(
  ["SYSPARM"],
  stringTranslate((options, text) => {
    if (text.value.length > 1023) {
      throw new TranslationError(
        text.token,
        `SYSPARM value exceeds maximum length of 1023 characters. Received '${text.value.slice(0, 10)}...'`,
        1,
      );
    }

    options.sysParm = text.value;
  }),
);
/** {@link CompilerOptions.system} */
translator.rule(
  ["SYSTEM"],
  plainTranslate(
    (options, text) => {
      options.system = text.value.toUpperCase() as CompilerOptions.System;
    },
    "MVS",
    "CICS",
    "IMS",
    "OS",
    "TSO",
  ),
);

/** {@link CompilerOptions.terminal} */
translator.flag("terminal", ["TERMINAL", "TERM"], ["NOTERMINAL", "NTERM"]);

/** {@link CompilerOptions.test} */
translator.rule(
  ["TEST"],
  (option, options, acceptor) => {
    // If there are multiple *PROCESS TEST directives,
    // the last one takes precedence and all suboptions that are not specified
    // are set to default.
    options.test = {
      level: "ALL",
      hook: true,
      separate: false,
      sepName: true,
      source: false,
      sym: true,
    };
    for (const value of option.values) {
      ensureType(value, "plain");
      const name = value.value.toUpperCase();
      switch (name) {
        case "ALL":
        case "BLOCK":
        case "NONE":
        case "PATH":
        case "STMT":
          options.test.level = name as CompilerOptions.TestLevel;
          break;
        case "HOOK":
          options.test.hook = true;
          break;
        case "NOHOOK":
          options.test.hook = false;
          break;
        case "SEPARATE":
          options.test.separate = true;
          break;
        case "NOSEPARATE":
          options.test.separate = false;
          break;
        case "SEPNAME":
          options.test.sepName = true;
          break;
        case "NOSEPNAME":
          options.test.sepName = false;
          break;
        case "SOURCE":
          options.test.source = true;
          break;
        case "NOSOURCE":
          options.test.source = false;
          break;
        case "SYM":
          options.test.sym = true;
          break;
        case "NOSYM":
          options.test.sym = false;
          break;
        default:
          throw TranslationError.fromCode(
            value.token,
            CompilerOptionsCodes.Test.InvalidParameter,
            name,
          );
      }
    }
    reportDuplicateSubOptions(option, acceptor);
    reportMutexSubOptions(option, acceptor, [
      ["ALL", "BLOCK", "NONE", "PATH", "STMT"],
      ["HOOK", "NOHOOK"],
      ["SEPARATE", "NOSEPARATE"],
      ["SEPNAME", "NOSEPNAME"],
      ["SOURCE", "NOSOURCE"],
      ["SYM", "NOSYM"],
    ]);
  },
  ["NOTEST"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.test = false;
  },
);

/** {@link CompilerOptions.unroll} */
translator.rule(["UNROLL"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const name = value.value.toUpperCase();
  if (["AUTO", "NO"].includes(name)) {
    options.unroll = name as CompilerOptions.Unroll;
  } else {
    throw TranslationError.fromCode(
      value.token,
      CompilerOptionsCodes.Unroll.InvalidParameter,
      name,
    );
  }
});

/** {@link CompilerOptions.usage} */
translator.rule(["USAGE"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.usage);
  ensureToBeDefined(options.usage.regex);
  for (const value of option.values) {
    ensureType(value, "option");
    const name = value.name.toUpperCase();
    ensureArguments(value, 1, 1);
    const argument = value.values[0];
    ensureType(argument, "plain");
    switch (name) {
      case "HEX":
        options.usage.hex = ensureArgument(
          argument,
          CompilerOptionsCodes.Usage.InvalidHexParameter,
          ["SIZE", "CURRENTSIZE"],
        );
        break;
      case "REGEX":
        options.usage.regex.reset = ensureFlag(
          argument,
          CompilerOptionsCodes.Usage.InvalidRegexParameter,
          ["RESET", "NORESET"],
        );
        break;
      case "ROUND":
        options.usage.round = ensureArgument(
          argument,
          CompilerOptionsCodes.Usage.InvalidRoundParameter,
          ["IBM", "ANS"],
        );
        break;
      case "SUBSTR":
        options.usage.substr = ensureArgument(
          argument,
          CompilerOptionsCodes.Usage.InvalidSubstrParameter,
          ["STRICT", "LOOSE"],
        );
        break;
      case "UNSPEC":
        options.usage.unspec = ensureArgument(
          argument,
          CompilerOptionsCodes.Usage.InvalidUnspecParameter,
          ["IBM", "ANS"],
        );
        break;
      case "UUID":
        options.usage.uuid = ensureArgument(
          argument,
          CompilerOptionsCodes.Usage.InvalidUuidParameter,
          ["UPPER", "LOWER"],
        );
        break;
      case "VALIDDATE":
        options.usage.validDate = ensureArgument(
          argument,
          CompilerOptionsCodes.Usage.InvalidValidDateParameter,
          ["LOOSE", "STRICT"],
        );
        break;
      default:
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.Usage.InvalidParameter,
          name,
        );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
});

/** {@link CompilerOptions.widechar} */
translator.rule(["WIDECHAR"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  options.widechar = ensureArgument(
    value,
    CompilerOptionsCodes.WideChar.InvalidParameter,
    ["BIGENDIAN", "LITTLEENDIAN"],
  );
});

/** {@link CompilerOptions.window} */
translator.rule(["WINDOW"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  // The spec does not define any boundaries.
  options.window = ensureNumberValue(value);
});

/** {@link CompilerOptions.writable} */
translator.rule(
  ["WRITABLE"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.writable = true;
  },
  ["NOWRITABLE"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.writable = { noWritable: "FWS" };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    options.writable = {
      noWritable: ensureArgument(
        value,
        CompilerOptionsCodes.Writable.InvalidParameter,
        ["FWS", "PRV"],
      ),
    };
  },
);

/** {@link CompilerOptions.xInfo} */
translator.rule(["XINFO"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.xInfo);
  for (const value of option.values) {
    if (value.kind === SyntaxKind.CompilerOption) {
      ensureArguments(value, 1, 1);
      const optionName = value.name.toUpperCase();
      if (optionName === "XML") {
        options.xInfo.xml = {
          hash: ensureFlag(
            value.values[0],
            CompilerOptionsCodes.XInfo.InvalidXmlParameter,
            ["HASH", "NOHASH"],
          ),
        };
        continue;
      }
    }
    ensureType(value, "plainNotEmpty");
    const name = value.value.toUpperCase();
    switch (name) {
      case "DEF":
      case "NODEF":
        options.xInfo.def = ensureFlag(
          value,
          CompilerOptionsCodes.XInfo.InvalidParameter,
          ["DEF", "NODEF"],
        );
        break;
      case "MSG":
      case "NOMSG":
        options.xInfo.msg = ensureFlag(
          value,
          CompilerOptionsCodes.XInfo.InvalidParameter,
          ["MSG", "NOMSG"],
        );
        break;
      case "SYM":
      case "NOSYM":
        options.xInfo.sym = ensureFlag(
          value,
          CompilerOptionsCodes.XInfo.InvalidParameter,
          ["SYM", "NOSYM"],
        );
        break;
      case "SYN":
      case "NOSYN":
        options.xInfo.syn = ensureFlag(
          value,
          CompilerOptionsCodes.XInfo.InvalidParameter,
          ["SYN", "NOSYN"],
        );
        break;
      case "XML":
        ensureType(value, "plain");
        options.xInfo.xml = { hash: false };
        break;
      case "NOXML":
        ensureType(value, "plain");
        options.xInfo.xml = false;
        break;
      default:
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.XInfo.InvalidParameter,
          value.value,
        );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
  reportMutexSubOptions(option, acceptor, [
    ["DEF", "NODEF"],
    ["MSG", "NOMSG"],
    ["SYM", "NOSYM"],
    ["SYN", "NOSYN"],
    ["XML", "NOXML"],
  ]);
});

/** {@link CompilerOptions.xml} */
translator.rule(["XML"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  ensureToBeDefined(options.xml);
  for (const value of option.values) {
    ensureType(value, "option");
    ensureArguments(value, 1, 1);
    switch (value.name.toUpperCase()) {
      case "CASE":
        options.xml.case = ensureArgument(
          value.values[0],
          CompilerOptionsCodes.Xml.InvalidCaseParameter,
          ["UPPER", "ASIS"],
        );
        break;
      case "XMLATTR":
        options.xml.xmlAttr = ensureArgument(
          value.values[0],
          CompilerOptionsCodes.Xml.InvalidXmlAttrParameter,
          ["APOSTROPHE", "QUOTE"],
        );
        break;
      default:
        throw TranslationError.fromCode(
          value.token,
          CompilerOptionsCodes.Xml.InvalidParameter,
          value.name,
        );
    }
  }
  reportDuplicateSubOptions(option, acceptor);
});

/** {@link CompilerOptions.xRef} */
translator.rule(
  ["XREF", "X"],
  (option, options, acceptor) => {
    // No arguments is ok.
    ensureArguments(option, 0);
    ensureToBeDefined(options.xRef);
    for (const value of option.values) {
      ensureType(value, "plain");
      if (value.value.length === 0) {
        continue;
      }
      switch (value.value.toUpperCase()) {
        case "FULL":
        case "SHORT":
          options.xRef = {
            ...options.xRef,
            length: ensureArgument(
              value,
              CompilerOptionsCodes.XRef.InvalidLengthParameter,
              ["FULL", "SHORT"],
            ),
          };
          break;
        case "IMPLICIT":
        case "EXPLICIT":
          options.xRef = {
            ...options.xRef,
            structure: ensureArgument(
              value,
              CompilerOptionsCodes.XRef.InvalidStructureParameter,
              ["IMPLICIT", "EXPLICIT"],
            ),
          };
          break;
        default:
          throw TranslationError.fromCode(
            value.token,
            CompilerOptionsCodes.XRef.InvalidParameter,
            value.value,
          );
      }
    }
    reportDuplicateSubOptions(option, acceptor);
    reportMutexSubOptions(option, acceptor, [
      ["FULL", "SHORT"],
      ["IMPLICIT", "EXPLICIT"],
    ]);
  },
  ["NOXREF", "NX"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.xRef = false;
  },
);

export function getTranslator(): Translator<CompilerOptions> {
  return translator;
}
