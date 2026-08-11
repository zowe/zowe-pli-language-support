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
  ensureEnum,
  ensureFlag,
  ensureNumberValue,
  ensureToBeDefined,
  ensureType,
  isEmptyParameterList,
  plainTranslate,
  plainTranslateEnum,
  reportDuplicateSubOptions,
  reportMutexSubOptions,
  stringTranslate,
  Translator,
} from "./translator";

const translator = new Translator<CompilerOptions>(() =>
  getDefaultCompilerOptions(),
);

const $1K = 1024;
const $1M = 1024 * 1024;

/** {@link CompilerOptions.aggregate} */
translator.rule(
  ["AGGREGATE", "AG"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      // Default is DECIMAL.
      options.aggregate = CompilerOptions.Aggregate.DECIMAL;
    } else {
      ensureType(option.values[0], "plainNotEmpty");
      options.aggregate = ensureEnum(
        option.values[0],
        CompilerOptionsCodes.Aggregate.InvalidParameter,
        CompilerOptions.Aggregate,
      );
    }
  },
  ["NOAGGREGATE", "NAG"],
  (_, options) => {
    ensureArguments(_, 0, 0);
    options.aggregate = false;
  },
);

/** {@link CompilerOptions.arch} */
translator.rule(["ARCH"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "plainNotEmpty");
  const value = ensureNumberValue(option.values[0], 0, 14);
  // All values between 0 and 10 are interpreted as 10.
  options.arch = value < 11 ? 10 : value;
});

/** {@link CompilerOptions.assert} */
translator.rule(
  ["ASSERT"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.assert =
        CompilerOptions.Assert[
          value.value as keyof typeof CompilerOptions.Assert
        ];
    },
    CompilerOptionsCodes.Assert.InvalidParameter,
    CompilerOptions.Assert,
  ),
);

/** {@link CompilerOptions.attributes} */
translator.rule(
  ["ATTRIBUTES", "A"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.attributes = CompilerOptions.Length.FULL;
    } else {
      ensureType(option.values[0], "plainNotEmpty");
      options.attributes = ensureEnum(
        option.values[0],
        CompilerOptionsCodes.Attributes.InvalidParameter,
        CompilerOptions.Length,
        [
          ["SHORT", "S"],
          ["FULL", "F"],
        ],
      );
    }
  },
  ["NOATTRIBUTES", "NA"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.attributes = false;
  },
);

/** {@link CompilerOptions.backreg} */
translator.rule(
  ["BACKREG"],
  plainTranslate(
    (options, value) => {
      options.backreg = Number(value.value);
    },
    CompilerOptionsCodes.BackReg.InvalidParameter,
    ["5", "11"],
  ),
);

/** {@link CompilerOptions.bifprec} */
translator.rule(
  ["BIFPREC"],
  plainTranslate(
    (options, value) => {
      options.bifprec = Number(value.value);
    },
    CompilerOptionsCodes.BiFPrec.InvalidParameter,
    ["31", "15"],
  ),
);

/** {@link CompilerOptions.blank} */
translator.rule(
  ["BLANK"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");

    if (value.value.length !== 1) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Blank.InvalidParameterLength,
        value.token,
        value.value,
      );
    }

    if (Options.PLI_CHARACTER_REGEX.test(value.value)) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Blank.InvalidParameter,
        value.token,
        value.value,
      );
    }

    options.blank = value.value;
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.blkoff} */
translator.flag("blkoff", ["BLKOFF"], ["NOBLKOFF"]);

/** {@link CompilerOptions.brackets} */
translator
  .rule(
    ["BRACKETS"],
    stringTranslate((options, value) => {
      const length = value.value.length;
      if (length !== 2) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Brackets.InvalidParameterLength,
          value.token,
          value.value,
        );
      }
      const start = value.value.charAt(0);
      const end = value.value.charAt(1);

      if (
        Options.PLI_CHARACTER_REGEX.test(start) ||
        Options.PLI_CHARACTER_REGEX.test(end)
      ) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Brackets.InvalidParameter,
          value.token,
          value.value,
        );
      }

      if (start === end) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Brackets.InvalidEqualCharacters,
          value.token,
          value.value,
        );
      }

      options.brackets = [start, end];
    }),
    undefined,
    undefined,
    { recompile: true },
  )
  .postProcess({
    // The two BRACKETS characters must not be characters used by other PL/I
    // options such as NAMES, NOT, or OR.
    id: "brackets.conflictsWithOtherOptions",
    run: (options, acceptor, getOwnToken) => {
      if (!options.brackets) {
        return;
      }

      const conflictsWith: { chars: string; option: string }[] = [];
      if (options.names?.extralingChar) {
        conflictsWith.push({
          chars: options.names.extralingChar,
          option: "NAMES",
        });
      }
      if (
        options.names?.uppExtralingChar &&
        options.names.uppExtralingChar !== options.names.extralingChar
      ) {
        conflictsWith.push({
          chars: options.names.uppExtralingChar,
          option: "NAMES",
        });
      }
      if (options.not) {
        conflictsWith.push({ chars: options.not, option: "NOT" });
      }
      if (options.or) {
        conflictsWith.push({ chars: options.or, option: "OR" });
      }

      for (const bracketChar of options.brackets) {
        for (const { chars, option } of conflictsWith) {
          if (chars.includes(bracketChar)) {
            acceptor(
              diagnosticFromCode(
                CompilerOptionsCodes.Brackets.ConflictWithOption,
                getOwnToken(),
                bracketChar,
                option,
              ),
            );
          }
        }
      }
    },
  });

/** {@link CompilerOptions.case} */
translator.rule(
  ["CASE"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    ensureType(option.values[0], "plainNotEmpty");
    options.case = ensureEnum(
      option.values[0],
      CompilerOptionsCodes.Case.InvalidParameter,
      CompilerOptions.Case,
    );
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.caserules} */
translator.rule(
  ["CASERULES"],
  (option, options, acceptor) => {
    ensureArguments(option, 1);
    for (const keyword of option.values) {
      ensureType(keyword, "option");
      if (keyword.name !== "KEYWORD") {
        throw diagnosticFromCode(
          CompilerOptionsCodes.CaseRules.InvalidParameter,
          keyword.token,
          keyword.token.image,
        );
      }
      ensureArguments(keyword, 1, 1);
      const keywordCase = keyword.values[0];
      ensureType(keywordCase, "plainNotEmpty");
      options.caserules = ensureEnum(
        keywordCase,
        CompilerOptionsCodes.CaseRules.InvalidKeywordParameter,
        CompilerOptions.CaseRules,
      );
      reportDuplicateSubOptions(option, acceptor);
    }
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.check} */
translator.rule(["CHECK"], (option, options, acceptor) => {
  ensureArguments(option, 1);
  for (const value of option.values) {
    ensureType(value, "plain");
    switch (value.value) {
      case "STORAGE":
      case "STG":
        options.check = { storage: CompilerOptions.CheckStorage.STORAGE };
        break;
      case "NOSTORAGE":
      case "NSTG":
        options.check = { storage: CompilerOptions.CheckStorage.NOSTORAGE };
        break;
      case "":
        // Ignore empty parameters.
        break;
      default:
        throw diagnosticFromCode(
          CompilerOptionsCodes.Check.InvalidParameter,
          value.token,
          value.token.image,
        );
    }
  }
  reportDuplicateSubOptions(option, acceptor, {
    STG: "STORAGE",
    NSTG: "NOSTORAGE",
  });
  reportMutexSubOptions(option, acceptor, [
    ["STORAGE", "NOSTORAGE"],
    ["STG", "NSTG"],
    ["STORAGE", "NSTG"],
    ["NOSTORAGE", "STG"],
  ]);
});

/** {@link CompilerOptions.cmpat} */
translator.rule(
  ["CMPAT", "CMP"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.cmpat =
        CompilerOptions.CMPat[
          value.value as keyof typeof CompilerOptions.CMPat
        ];
    },
    CompilerOptionsCodes.CmPat.InvalidParameter,
    CompilerOptions.CMPat,
  ),
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.codepage} */
translator.rule(
  ["CODEPAGE", "CP"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    ensureType(option.values[0], "plainNotEmpty");

    // The leading zero is not mandatory, but if the codepage is present without it, it should be stored with the leading zero.
    const value = option.values[0].value.startsWith("0")
      ? option.values[0].value
      : `0${option.values[0].value}`;

    if (!Options.PLI_CODEPAGE_SET.has(value)) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.CodePage.InvalidParameter,
        option.values[0].token,
        option.values[0].value,
      );
    }
    options.codepage = value;
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.common} */
translator
  .flag("common", ["COMMON"], ["NOCOMMON"])
  .postProcess({
    id: "common.conflictsWithRent",
    run: (options, acceptor, getOwnToken) => {
      if (!options.common) {
        return;
      }
      if (options.rent) {
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.Common.ConflictWithRent,
            getOwnToken(),
          ),
        );
      }
    },
  })
  .postProcess({
    id: "common.conflictsWithExtName",
    run: (options, acceptor, getOwnToken) => {
      if (!options.common) {
        return;
      }
      const extname = options.limits?.extname;
      if (extname !== undefined && extname > 7) {
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.Common.ConflictWithExtName,
            getOwnToken(),
            extname,
          ),
        );
      }
    },
  });

/** {@link CompilerOptions.compile} */
translator.rule(
  ["COMPILE", "C"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    ensureToBeDefined(options.compile);
    // COMPILE is equivalent to NOCOMPILE(S).
    options.compile.noCompile = CompilerOptions.Flag.S;
  },
  ["NOCOMPILE", "NC"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    ensureToBeDefined(options.compile);
    if (option.values.length === 0) {
      options.compile.noCompile = true;
    } else {
      ensureType(option.values[0], "plainNotEmpty");
      options.compile.noCompile = ensureEnum(
        option.values[0],
        CompilerOptionsCodes.Compile.InvalidParameter,
        CompilerOptions.Flag,
      );
    }
  },
);

/** {@link CompilerOptions.copyright} */
translator.rule(
  ["COPYRIGHT"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const valueOption = option.values[0];
    ensureType(valueOption, "string");
    if (valueOption.value.length > 1000) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Copyright.InvalidParameterLength,
        valueOption.token,
        valueOption.value,
      );
    }
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
  plainTranslate(
    (options, value) => {
      options.csectcut = Number(value.value);
    },
    CompilerOptionsCodes.CSectCut.InvalidParameter,
    ["0", "1", "2", "3", "4", "5", "6", "7"],
  ),
);

/** {@link CompilerOptions.currency} */
translator.rule(["CURRENCY", "CURR"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainOrString");
  if (value.value.length !== 1) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.Currency.InvalidParameterLength,
      value.token,
      value.value,
    );
  }
  options.currency = value.value;
});

/** {@link CompilerOptions.dbcs} */
translator.flag("dbcs", ["DBCS"], ["NODBCS"]).postProcess({
  id: "dbcs.conflictsWithGraphic",
  run: (options, acceptor, getOwnToken) => {
    const token = getOwnToken();
    if (token === undefined || options.dbcs !== false || !options.graphic) {
      return;
    }
    acceptor(
      diagnosticFromCode(CompilerOptionsCodes.Dbcs.ConflictWithGraphic, token),
    );
  },
});

/** {@link CompilerOptions.dbrmlib} */
translator.rule(
  ["DBRMLIB"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.dbrmlib = false; // No param falls back to NODBRMLIB.
      return;
    }
    const dataSetName = option.values[0];
    ensureType(dataSetName, "plainOrString");
    if (dataSetName.value.length === 0) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.DBRMLib.InvalidEmptyParameter,
        dataSetName.token,
      );
    }
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.DD.InvalidParameter,
        value.token,
        value.token.image,
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.DDSQL.InvalidParameter,
        value.token,
      );
    }
  }
  options.ddsql = value.value;
});

/** {@link CompilerOptions.decimal} */
translator.rule(["DECIMAL", "DEC"], (option, options, acceptor) => {
  // DECIMAL() is valid, but does not reset previous settings.
  ensureArguments(option, 1);
  ensureToBeDefined(options.decimal);
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
      case "":
        break;
      default:
        throw diagnosticFromCode(
          CompilerOptionsCodes.Decimal.InvalidParameter,
          opt.token,
          value,
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
translator
  .rule(
    ["DEFAULT", "DFT"],
    (option, options, acceptor) => {
      ensureArguments(option, 1);
      ensureToBeDefined(options.default);
      const def = options.default;
      for (const opt of option.values) {
        if (opt.kind === SyntaxKind.CompilerOptionText) {
          const val = opt.value;
          switch (val) {
            case "ALIGNED":
            case "UNALIGNED":
              def.aligned = val === "ALIGNED";
              break;
            case "IBM":
            case "ANS":
              def.architecture = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultArchitecture,
              );
              break;
            case "EBCDIC":
            case "ASCII":
              def.encoding = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultEncoding,
              );
              break;
            case "ASGN":
            case "ASSIGNABLE":
            case "NONASGN":
            case "NONASSIGNABLE":
              def.assignable = val === "ASSIGNABLE" || val === "ASGN";
              break;
            case "BIN1ARG":
            case "NOBIN1ARG":
              def.bin1arg = val === "BIN1ARG";
              break;
            case "BYADDR":
            case "BYVALUE":
              def.allocator = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultAllocator,
              );
              break;
            case "CONN":
            case "CONNECTED":
            case "NONCONN":
            case "NONCONNECTED":
              def.connected = val === "CONNECTED" || val === "CONN";
              break;
            case "DESCLIST":
            case "DESCLOCATOR":
              def.desc = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultDesc,
                [
                  ["LIST", "DESCLIST"],
                  ["LOCATOR", "DESCLOCATOR"],
                ],
              );
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
              def.format = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultFormat,
              );
              break;
            case "INITFILL":
            case "NOINITFILL":
              // Initfill is actually valid without a parameter and falls back to 00 in that case.
              def.initfill = val === "INITFILL" ? "00" : false;
              break;
            case "INL":
            case "INLINE":
            case "NOINL":
            case "NOINLINE":
              def.inline = val === "INLINE" || val === "INL";
              break;
            case "LAXQUAL":
            case "NOLAXQUAL":
              def.laxqual = val === "LAXQUAL";
              break;
            case "LOWERINC":
            case "UPPERINC":
              def.inc = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultInc,
              );
              break;
            case "NATIVE":
            case "NONNATIVE":
              def.native = val === "NATIVE";
              break;
            case "NATIVEADDR":
            case "NONNATIVEADDR":
              def.nativeAddr = val === "NATIVEADDR";
              break;
            case "NULLSYS":
            case "NULL370":
              def.nullsys = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultNullSys,
              );
              break;
            case "NULLSTRADDR":
            case "NONULLSTRADDR":
              def.nullStrAddr = val === "NULLSTRADDR";
              break;
            case "ORDER":
            case "REORDER":
              def.order = ensureEnum(
                opt,
                CompilerOptionsCodes.Default.InvalidParameter,
                CompilerOptions.DefaultOrder,
              );
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
            case "NONRECURSIVE":
              def.recursive = val === "RECURSIVE";
              break;
            case "RETCODE":
            case "NORETCODE":
              def.retcode = val === "RETCODE";
              break;
            case "":
              // Empty is valid.
              break;
            case "DUMMY":
            case "E":
            case "LINKAGE":
            case "NULLINIT":
            case "NULLSTRPTR":
            case "ORDINAL":
            case "RETURNS":
            case "SHORT":
              // All option values should report an expected option error.
              throw diagnosticFromCode(
                CompilerOptionsCodes.ExpectedOption,
                opt.token,
              );
            default:
              throw diagnosticFromCode(
                CompilerOptionsCodes.Default.InvalidParameter,
                opt.token,
                val,
              );
          }
        } else if (opt.kind === SyntaxKind.CompilerOption) {
          ensureArguments(opt, 1, 1);
          ensureType(opt.values[0], "plainNotEmpty");
          const value = opt.values[0].value;

          const invalidOption = () => {
            throw diagnosticFromCode(
              CompilerOptionsCodes.Default.InvalidParameter,
              opt.values[0].token,
              value,
            );
          };

          switch (opt.name) {
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
                def.e.format = CompilerOptions.DefaultFormat.HEXADEC;
              } else if (value === "IEEE") {
                def.e.format = CompilerOptions.DefaultFormat.IEEE;
              } else {
                invalidOption();
              }
              break;

            case "INITFILL":
              // TODO ssmifi: INITFILL can also accept a string value in which case the hex value should not have an X suffix.
              if (/[0-9a-fA-F]{2}x/i.test(value)) {
                def.initfill = value;
              } else {
                throw diagnosticFromCode(
                  CompilerOptionsCodes.Default.InvalidInitFillParameter,
                  opt.values[0].token,
                  value,
                );
              }
              break;

            case "LINKAGE":
              def.linkage = {};
              if (value === "OPTLINK" || value === "") {
                def.linkage.type = CompilerOptions.DefaultLinkageType.OPTLINK;
              } else if (value === "SYSTEM") {
                def.linkage.type = CompilerOptions.DefaultLinkageType.SYSTEM;
              } else {
                invalidOption();
              }
              break;

            case "NULLINIT":
              def.nullinit = {};
              if (value === "NULL" || value === "") {
                def.nullinit.type = CompilerOptions.DefaultNullInitType.NULL;
              } else if (value === "SYSNULL") {
                def.nullinit.type = CompilerOptions.DefaultNullInitType.SYSNULL;
              } else {
                invalidOption();
              }
              break;

            case "NULLSTRPTR":
              def.nullStrPtr = {};
              if (value === "NULL") {
                def.nullStrPtr.type =
                  CompilerOptions.DefaultNullStrPtrType.NULL;
              } else if (value === "STRICT") {
                def.nullStrPtr.type =
                  CompilerOptions.DefaultNullStrPtrType.STRICT;
              } else if (value === "SYSNULL") {
                def.nullStrPtr.type =
                  CompilerOptions.DefaultNullStrPtrType.SYSNULL;
              } else {
                invalidOption();
              }
              break;

            case "ORDINAL":
              if (value === "MIN") {
                def.ordinal = { type: CompilerOptions.DefaultOrdinalType.MIN };
              } else if (value === "MAX") {
                def.ordinal = { type: CompilerOptions.DefaultOrdinalType.MAX };
              } else {
                invalidOption();
              }
              break;

            case "RETURNS":
              // Diagram specifies that no option inside the parenthesesis valid. Default is BYADDR.
              if (value === "" || value === "BYADDR") {
                def.returns = {
                  type: CompilerOptions.DefaultReturnsType.BYADDR,
                };
              } else if (value === "BYVALUE") {
                def.returns = {
                  type: CompilerOptions.DefaultReturnsType.BYVALUE,
                };
              } else {
                invalidOption();
              }
              break;

            case "SHORT":
              // Diagram specifies that no option inside the parentheses is valid. Default is HEXADEC.
              if (value === "" || value === "HEXADEC") {
                def.short = { format: CompilerOptions.DefaultFormat.HEXADEC };
              } else if (value === "IEEE") {
                def.short = { format: CompilerOptions.DefaultFormat.IEEE };
              } else {
                invalidOption();
              }
              break;

            default:
              invalidOption();
          }
        } else {
          throw diagnosticFromCode(
            CompilerOptionsCodes.Default.InvalidParameter,
            opt.token,
            opt.value,
          );
        }
      }
      reportDuplicateSubOptions(option, acceptor, {
        ASGN: "ASSIGNABLE",
        NONASGN: "NONASSIGNABLE",
        CONN: "CONNECTED",
        NONCONN: "NONCONNECTED",
        INL: "INLINE",
        NOINL: "NOINLINE",
      });
      reportMutexSubOptions(option, acceptor, [
        ["ALIGNED", "UNALIGNED"],
        ["IBM", "ANS"],
        ["EBCDIC", "ASCII"],
        ["ASSIGNABLE", "NONASSIGNABLE"],
        ["ASSIGNABLE", "NONASGN"],
        ["ASGN", "NONASSIGNABLE"],
        ["ASGN", "NONASGN"],
        ["BIN1ARG", "NOBIN1ARG"],
        ["BYADDR", "BYVALUE"],
        ["CONNECTED", "NONCONNECTED"],
        ["CONNECTED", "NONCONN"],
        ["CONN", "NONCONNECTED"],
        ["CONN", "NONCONN"],
        ["DESCLIST", "DESCLOCATOR"],
        ["DESCRIPTOR", "NODESCRIPTOR"],
        ["EVENDEC", "NOEVENDEC"],
        ["HEXADEC", "IEEE"],
        ["INLINE", "NOINLINE"],
        ["INLINE", "NOINL"],
        ["INL", "NOINLINE"],
        ["INL", "NOINL"],
        ["LAXQUAL", "NOLAXQUAL"],
        ["LOWERINC", "UPPERINC"],
        ["NATIVE", "NONNATIVE"],
        ["NATIVEADDR", "NONNATIVEADDR"],
        ["NULLSYS", "NULL370"],
        ["NULLSTRADDR", "NONULLSTRADDR"],
        ["ORDER", "REORDER"],
        ["OVERLAP", "NOOVERLAP"],
        ["PADDING", "NOPADDING"],
        ["PSEUDODUMMY", "NOPSEUDODUMMY"],
        ["RECURSIVE", "NORECURSIVE"],
        ["RETCODE", "NORETCODE"],
      ]);
    },
    undefined,
    undefined,
    { recompile: true },
  )
  .postProcess({
    id: "default.desclistConflictsWithCmpat",
    run: (options, acceptor, getOwnToken) => {
      if (
        options.default?.desc !== CompilerOptions.DefaultDesc.LIST ||
        options.cmpat === undefined ||
        options.cmpat === CompilerOptions.CMPat.LE
      ) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Default.DescListConflictsWithCmpat,
          getOwnToken(),
          CompilerOptions.CMPat[options.cmpat],
        ),
      );
      options.default.desc = CompilerOptions.DefaultDesc.LOCATOR;
    },
  });

/** {@link CompilerOptions.deprecate} */
/** {@link CompilerOptions.deprecateNext} */
translator.rule(
  ["DEPRECATE", "DEPRECATENEXT"],
  (option, options, acceptor) => {
    ensureArguments(option, 1);
    let deprecateOptions =
      option.name === "DEPRECATE" ? options.deprecate : options.deprecateNext;
    if (!deprecateOptions) {
      if (option.name === "DEPRECATE") {
        options.deprecate = {
          BUILTIN: new Set<string>(),
          ENTRY: new Set<string>(),
          INCLUDE: new Set<string>(),
          STMT: new Set<string>(),
          VARIABLE: new Set<string>(),
        };
        deprecateOptions = options.deprecate;
      } else {
        options.deprecateNext = {
          BUILTIN: new Set<string>(),
          ENTRY: new Set<string>(),
          INCLUDE: new Set<string>(),
          STMT: new Set<string>(),
          VARIABLE: new Set<string>(),
        };
        deprecateOptions = options.deprecateNext;
      }
    }

    for (const opt of option.values) {
      ensureType(opt, "option");
      const type = ensureEnum(
        opt,
        CompilerOptionsCodes.Deprecate.InvalidParameter,
        CompilerOptions.DeprecateItemType,
      );

      const typeKey = CompilerOptions.DeprecateItemType[
        type
      ] as keyof CompilerOptions.Deprecate;
      deprecateOptions[typeKey].clear();
      for (const optionValue of opt.values) {
        ensureType(optionValue, "plain");
        if (optionValue.value.length === 0) {
          // Just clear the list if the parameter is empty.
          continue;
        }
        const value =
          type === CompilerOptions.DeprecateItemType.STMT
            ? ensureArgument(
                optionValue,
                CompilerOptionsCodes.Deprecate.InvalidStatementParameter,
                Options.PLI_STATEMENT_NAMES,
              )
            : optionValue.value;

        deprecateOptions[typeKey].add(value);
      }
    }
    reportDuplicateSubOptions(option, acceptor);
  },
  undefined,
  undefined,
  { allowDuplicates: true },
);

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
      throw diagnosticFromCode(
        CompilerOptionsCodes.Display.InvalidSTDParameter,
        value.token,
        value.value,
      );
    }
  } else if (value.kind === SyntaxKind.CompilerOption) {
    if (value.name.toUpperCase() !== "WTO") {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Display.InvalidWTOParameter,
        value.token,
        value.name,
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
        throw diagnosticFromCode(
          CompilerOptionsCodes.Display.InvalidRoutCDEParameter,
          opt.token,
          opt.name,
        );
      }
    }
  } else {
    throw diagnosticFromCode(
      CompilerOptionsCodes.Display.InvalidParameter,
      value.token,
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
    if (option.values.length === 0) {
      options.exit = false; // No param falls back to NOEXIT.
      return;
    }
    const inparam = option.values[0];
    ensureType(inparam, "plainOrString");
    if (inparam.value.length === 0) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Exit.InvalidEmptyParameter,
        inparam.token,
      );
    }
    if (inparam.value.length > 1023) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Exit.InvalidParameterLength,
        inparam.token,
        inparam.value,
      );
    }
    options.exit = inparam.value;
  },
  ["NOEXIT"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.exit = false;
  },
);

/** {@link CompilerOptions.exportAll} */
translator.flag("exportAll", ["EXPORTALL"], ["NOEXPORTALL"]);

/** {@link CompilerOptions.extrn} */
translator.rule(
  ["EXTRN"],
  plainTranslateEnum(
    (options, value) => {
      options.extrn =
        CompilerOptions.Length[
          value.value as keyof typeof CompilerOptions.Length
        ];
    },
    CompilerOptionsCodes.Extrn.InvalidParameter,
    CompilerOptions.Length,
    [
      ["FULL", "F"],
      ["SHORT", "S"],
    ],
  ),
);

/** {@link CompilerOptions.fileRef} */
translator.rule(
  ["FILEREF"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.fileRef = { hash: false }; // No param falls back to NOHASH.
      return;
    }
    ensureType(option.values[0], "plainNotEmpty");
    options.fileRef = {
      hash: ensureFlag(
        option.values[0],
        CompilerOptionsCodes.FileRef.InvalidParameter,
        ["HASH", "NOHASH"],
      ),
    };
  },
  ["NOFILEREF"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.fileRef = false;
  },
);

/** {@link CompilerOptions.flag} */
translator.rule(["FLAG", "F"], (option, options) => {
  ensureArguments(option, 0, 1);
  const value = option.values[0];
  if (value) {
    ensureType(value, "plain");
    options.flag = ensureEnum(
      value,
      CompilerOptionsCodes.Flag.InvalidParameter,
      CompilerOptions.Flag,
    );
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
    CompilerOptionsCodes.Float.InvalidParameter,
    ["DFP", "NODFP"],
  ),
);

/** {@link CompilerOptions.floatInMath} */
translator.rule(
  ["FLOATINMATH"],
  plainTranslateEnum<CompilerOptions>(
    (options, value) => {
      options.floatInMath = {
        type: CompilerOptions.FloatInMathType[
          value.value as keyof typeof CompilerOptions.FloatInMathType
        ],
      };
    },
    CompilerOptionsCodes.FloatInMath.InvalidParameter,
    CompilerOptions.FloatInMathType,
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
translator.flag("graphic", ["GRAPHIC", "GR"], ["NOGRAPHIC", "NGR"], undefined, {
  recompile: true,
});

/** {@link CompilerOptions.header} */
translator.rule(["HEADER"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plain");
  options.header = ensureEnum(
    value,
    CompilerOptionsCodes.Header.InvalidParameter,
    CompilerOptions.Header,
  );
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
    throw diagnosticFromCode(
      CompilerOptionsCodes.Hgpr.InvalidParameter,
      value.token,
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
      const ignoreValue = ensureEnum(
        opt,
        CompilerOptionsCodes.Ignore.InvalidParameter,
        CompilerOptions.IgnoreItem,
      );
      options.ignore.items.push(ignoreValue);
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
translator.rule(
  ["INCAFTER"],
  (option, options) => {
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.IncAfter.InvalidParameter,
        value.token,
        value.token.image,
      );
    }

    ensureType(value, "option");
    if (value.name.toUpperCase() !== "PROCESS") {
      throw diagnosticFromCode(
        CompilerOptionsCodes.IncAfter.InvalidParameter,
        value.token,
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
  },
  undefined,
  undefined,
  { recompile: true },
);

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
  { recompile: true },
);

/** {@link CompilerOptions.include} */
translator.flag("include", ["INCLUDE"], ["NOINCLUDE"], undefined, {
  recompile: true,
});

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
      options.initAuto = ensureEnum(
        option.values[0],
        CompilerOptionsCodes.InitAuto.InvalidParameter,
        CompilerOptions.InitAuto,
        [
          ["FULL", "F"],
          ["SHORT", "S"],
        ],
      );
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
      options.inSource.type = ensureEnum(
        option.values[0],
        CompilerOptionsCodes.InSource.InvalidParameter,
        CompilerOptions.InSourceType,
      );
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
    if (opt.kind === SyntaxKind.CompilerOptionText) {
      const name = opt.value.toUpperCase();
      if (/^(NO)?TRIMR$/.test(name)) {
        options.json.trimr = !name.startsWith("NO");
      } else {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Json.InvalidParameter,
          opt.token,
          name,
        );
      }
    } else if (opt.kind === SyntaxKind.CompilerOption) {
      const name = opt.name.toUpperCase();
      if (["CASE", "ENCODING", "GET", "PARSE"].includes(name)) {
        ensureType(opt, "option");
        ensureArguments(opt, 1, 1);
        const value = opt.values[0];
        ensureType(value, "plain");
        switch (name) {
          case "CASE":
            options.json.case = ensureEnum(
              value,
              CompilerOptionsCodes.Json.InvalidCaseParameter,
              CompilerOptions.JsonCase,
            );
            break;
          case "ENCODING":
            options.json.encoding = ensureEnum(
              value,
              CompilerOptionsCodes.Json.InvalidEncodingParameter,
              CompilerOptions.JsonEncoding,
            );
            break;
          case "GET":
            options.json.get = ensureEnum(
              value,
              CompilerOptionsCodes.Json.InvalidGetParameter,
              CompilerOptions.JsonGet,
            );
            break;
          case "PARSE":
            options.json.parse = ensureEnum(
              value,
              CompilerOptionsCodes.Json.InvalidParseParameter,
              CompilerOptions.JsonParse,
            );
            break;
        }
      } else {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Json.InvalidParameter,
          opt.token,
          name,
        );
      }
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
    options.langlvl = ensureEnum(
      value,
      CompilerOptionsCodes.LangLvl.InvalidParameter,
      CompilerOptions.LangLvl,
    );
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
            throw diagnosticFromCode(
              CompilerOptionsCodes.Limits.InvalidFixedBinMinParameter,
              value.values[0].token,
              minBin.toString(),
            );
          }
          if (maxBin !== 63) {
            throw diagnosticFromCode(
              CompilerOptionsCodes.Limits.InvalidFixedBinMaxParameter,
              value.values[1].token,
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
            throw diagnosticFromCode(
              CompilerOptionsCodes.Limits.InvalidFixedDecMinParameter,
              value.values[0].token,
              minDec.toString(),
            );
          }
          if (maxDec !== 15 && maxDec !== 31) {
            throw diagnosticFromCode(
              CompilerOptionsCodes.Limits.InvalidFixedDecMaxParameter,
              value.values[1].token,
              maxDec.toString(),
            );
          }
          if (minDec > maxDec) {
            throw diagnosticFromCode(
              CompilerOptionsCodes.Limits.InvalidFixedDecRange,
              value.values[0].token,
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
            throw diagnosticFromCode(
              CompilerOptionsCodes.Limits.InvalidStringParameter,
              value.values[0].token,
              stringValue.toString(),
            );
          }
          break;
      }
    } else {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Limits.InvalidParameter,
        value.token,
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
    throw diagnosticFromCode(
      CompilerOptionsCodes.LineCount.InvalidRange,
      value.token,
      value.value,
    );
  }
  options.lineCount = lineCount;
});

/** {@link CompilerOptions.lineDir} */
translator.flag("lineDir", ["LINEDIR"], ["NOLINEDIR"]);

/** {@link CompilerOptions.list} */
translator.flag("list", ["LIST"], ["NOLIST"]).postProcess({
  id: "list.ignoredWithNoObject",
  run: (options, acceptor, getOwnToken) => {
    if (!options.list || options.object !== false) {
      return;
    }
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.Object.IgnoredOption,
        getOwnToken(),
        "LIST",
      ),
    );
  },
});

/** {@link CompilerOptions.listView} */
translator
  .rule(["LISTVIEW"], (option, options, acceptor) => {
    ensureArguments(option, 1);
    for (const value of option.values) {
      ensureType(value, "plain");
      options.listView = ensureEnum(
        value,
        CompilerOptionsCodes.ListView.InvalidParameter,
        CompilerOptions.ListView,
      );
    }
    reportMutexSubOptions(option, acceptor, [
      ["SOURCE", "AFTERALL", "AFTERCICS", "AFTERMACRO", "AFTERSQL"],
    ]);
  })
  .postProcess({
    id: "listView.ignoredWithNoSource",
    run: (options, acceptor, getOwnToken) => {
      if (options.listView === undefined || options.source) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.ListView.IgnoredWithNoSource,
          getOwnToken(),
        ),
      );
    },
  });

/** {@link CompilerOptions.LP} */
translator.rule(["LP"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "plain");
  options.LP = ensureEnum(
    option.values[0],
    CompilerOptionsCodes.Lp.InvalidParameter,
    CompilerOptions.LP,
    [
      ["LP32", "32"],
      ["LP64", "64"],
    ],
  );
});

/** {@link CompilerOptions.macro} */
translator.flag("macro", ["MACRO", "M"], ["NOMACRO", "NM"]);

/** {@link CompilerOptions.map} */
translator.flag("map", ["MAP"], ["NOMAP"]).postProcess({
  id: "map.ignoredWithNoObject",
  run: (options, acceptor, getOwnToken) => {
    if (!options.map || options.object !== false) {
      return;
    }
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.Object.IgnoredOption,
        getOwnToken(),
        "MAP",
      ),
    );
  },
});

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
      throw diagnosticFromCode(
        CompilerOptionsCodes.Margini.InvalidParameter,
        value.token,
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
  { recompile: true },
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.Margins.InvalidMarginPosition,
        m.token,
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
        throw diagnosticFromCode(
          CompilerOptionsCodes.Margins.InvalidAnsPosition,
          c.token,
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
  { recompile: true },
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
      options.maxmsg.severity = ensureEnum(
        value,
        CompilerOptionsCodes.ExpectedPlainTranslate,
        CompilerOptions.Flag,
      );
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.MaxNest.InvalidParameter,
        suboption.token,
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
    throw diagnosticFromCode(
      CompilerOptionsCodes.MaxStmt.InvalidRange,
      mValue.token,
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
        options.mDeck = ensureEnum(
          value,
          CompilerOptionsCodes.MDeck.InvalidParameter,
          CompilerOptions.MDeck,
        );
      } else {
        throw diagnosticFromCode(
          CompilerOptionsCodes.MDeck.InvalidParameter,
          value.token,
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
    if (option.values.length === 0) {
      options.msgSummary = CompilerOptions.MsgSummary.NOXREF;
    } else {
      const value = option.values[0];
      ensureType(value, "plainNotEmpty");
      options.msgSummary = ensureEnum(
        value,
        CompilerOptionsCodes.MsgSummary.InvalidParameter,
        CompilerOptions.MsgSummary,
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
translator
  .rule(
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
          throw diagnosticFromCode(
            CompilerOptionsCodes.ExpectedPlainNotEmpty,
            value.token,
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
  )
  .postProcess({
    id: "name.tooLongForExtName",
    run: (options, acceptor, getOwnToken) => {
      const extname = options.limits?.extname;
      if (
        typeof options.name !== "string" ||
        options.name.length <= 8 ||
        extname === undefined ||
        extname > 8
      ) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Name.TooLongForExtName,
          getOwnToken(),
          options.name,
          extname,
        ),
      );
    },
  });

/** {@link CompilerOptions.names} */
translator.rule(
  ["NAMES"],
  (option, options) => {
    const ensureSafeCharacters = (
      value: CompilerOptionText | CompilerOptionString,
    ) => {
      const seen = new Set<string>();
      for (const char of value.value) {
        // The character must not be from the character or set nor occur more than once.
        if (Options.PLI_CHARACTER_SET.has(char) || seen.has(char)) {
          throw diagnosticFromCode(
            CompilerOptionsCodes.Names.CharacterAlreadyDefined,
            value.token,
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
        throw diagnosticFromCode(
          CompilerOptionsCodes.Names.InvalidParameterLengths,
          secondValue.token,
          "NAMES",
        );
      }
      options.names.uppExtralingChar = secondValue.value;
    }
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.natlang} */
translator.rule(["NATLANG"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const lang = value.value.toUpperCase();
  if (["ENU", "UEN"].includes(lang)) {
    options.natlang = ensureEnum(
      value,
      CompilerOptionsCodes.NatLang.InvalidParameter,
      CompilerOptions.NatLang,
    );
  } else {
    throw diagnosticFromCode(
      CompilerOptionsCodes.NatLang.InvalidParameter,
      value.token,
      value.value,
    );
  }
});

/** {@link CompilerOptions.nest} */
translator.flag("nest", ["NEST"], ["NONEST"]);

/** {@link CompilerOptions.not} */
translator.rule(
  ["NOT"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    if (value.value.length > 7) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Not.InvalidParameterLength,
        value.token,
        value.value.length,
      );
    }
    for (const char of value.value) {
      if (char !== NOT_CHARACTER && Options.PLI_CHARACTER_SET.has(char)) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Not.InvalidParameterCharacter,
          value.token,
          char,
        );
      }
    }
    options.not = value.value;
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.nullDate} */
translator.flag("nullDate", ["NULLDATE"], ["NONULLDATE"]);

/** {@link CompilerOptions.object} */
translator.flag("object", ["OBJECT", "OBJ"], ["NOOBJECT", "NOBJ"]);

/** {@link CompilerOptions.offset} */
translator.flag("offset", ["OFFSET", "OF"], ["NOOFFSET", "NOF"]).postProcess({
  id: "offset.ignoredWithNoObject",
  run: (options, acceptor, getOwnToken) => {
    if (!options.offset || options.object !== false) {
      return;
    }
    acceptor(
      diagnosticFromCode(
        CompilerOptionsCodes.Object.IgnoredOption,
        getOwnToken(),
        "OFFSET",
      ),
    );
  },
});

/** {@link CompilerOptions.offsetSize} */
translator
  .rule(["OFFSETSIZE"], (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    const offsetSize = ensureNumberValue(value);
    if (offsetSize !== 4 && offsetSize !== 8) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.OffsetSize.InvalidParameter,
        value.token,
        value.value,
      );
    }
    options.offsetSize = offsetSize;
  })
  .postProcess({
    id: "offsetSize.ignoredWithLp32",
    run: (options, acceptor, getOwnToken) => {
      const token = getOwnToken();
      if (token === undefined || options.LP !== CompilerOptions.LP.LP32) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.OffsetSize.IgnoredWithLp32,
          token,
        ),
      );
    },
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
        throw diagnosticFromCode(
          CompilerOptionsCodes.OnSnap.InvalidParameter,
          value.token,
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
        throw diagnosticFromCode(
          CompilerOptionsCodes.Optimize.InvalidParameter,
          value.token,
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
      options.options = CompilerOptions.Options.DOC;
      return;
    }
    ensureType(option.values[0], "plainNotEmpty");
    options.options = ensureEnum(
      option.values[0],
      CompilerOptionsCodes.Options.InvalidParameter,
      CompilerOptions.Options,
    );
  },
  ["NOOPTIONS", "NOP"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.options = false;
  },
);

/** {@link CompilerOptions.or} */
translator.rule(
  ["OR"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    if (value.value.length > 7) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Or.InvalidParameterLength,
        value.token,
        value.value.length,
      );
    }
    for (const char of value.value) {
      if (char !== "|" && Options.PLI_CHARACTER_SET.has(char)) {
        throw diagnosticFromCode(
          CompilerOptionsCodes.Or.InvalidParameterCharacter,
          value.token,
          char,
        );
      }
    }
    options.or = value.value;
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.pp} */
translator
  .rule(["PP"], (option, options) => {
    // 1 or more pre-processor options to collect
    ensureArguments(option, 1);
    ensureToBeDefined(options.pp);
    ensureToBeDefined(options.pp.items);

    for (const value of option.values) {
      if (value.kind === SyntaxKind.CompilerOptionText) {
        const name = ensureEnum(
          value,
          CompilerOptionsCodes.PP.InvalidParameter,
          CompilerOptions.PPItemName,
        );
        options.pp.items.push({ name, token: value.token });
      } else if (value.kind === SyntaxKind.CompilerOption) {
        const name = ensureEnum(
          {
            kind: SyntaxKind.CompilerOptionText,
            value: value.name,
            token: value.token,
          } as CompilerOptionText,
          CompilerOptionsCodes.PP.InvalidParameter,
          CompilerOptions.PPItemName,
        );
        if (value.values.length !== 1) {
          throw diagnosticFromCode(
            CompilerOptionsCodes.PP.InvalidOptionParameter,
            value.token,
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

        if (name === CompilerOptions.PPItemName.INCLUDE) {
          // set this as the effective INCLUDE PP option value, overriding any previous INCLUDE options
          const match = value.values[0].value.match(/ID\(([^\)]+)\)\s*$/);
          if (match && match.length > 0) {
            options.pp.ppInclude = {
              value: match[0].slice(3, -1).toUpperCase(),
            };
          }
        }
      } else {
        throw diagnosticFromCode(
          CompilerOptionsCodes.PP.InvalidParameterType,
          value.token,
        );
      }
    }
  })
  .negative(["NOPP"], (option, options) => {
    ensureArguments(option, 0, 0);
    options.pp = { items: [] };
  })
  .settings({ allowDuplicates: true, recompile: true })
  .postProcess({
    // If the MACRO option is specified along with the PP option, the MACRO preprocessor is
    // added to the beginning of the final, fully accumulated list of preprocessors in the
    // PP option, unless it is already first in that list.
    id: "pp.macroImplicit",
    run: (options, acceptor) => {
      if (!options.macro) {
        return;
      }
      const items = options.pp?.items;
      const first = items?.[0];
      if (items && first?.name !== CompilerOptions.PPItemName.MACRO) {
        items.unshift({ name: CompilerOptions.PPItemName.MACRO });
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.PP.MacroImplicitlyAdded,
            first?.token,
          ),
        );
      }
    },
  })
  .postProcess({
    // Validates pp.items array against the documented PP invocation limits:
    // a maximum of 31 preprocessor steps in total, the CICS preprocessor invoked at most once,
    // and the SQL preprocessor invoked no more than twice (and only twice if the first SQL
    // invocation specifies INCONLY as its option).
    id: "pp.limits",
    dependsOn: ["pp.macroImplicit"],
    run: (options, acceptor) => {
      const items = options.pp?.items;
      if (!items) {
        return;
      }

      if (items.length > 31) {
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.PP.TooManyPreprocessorSteps,
            items[31]?.token,
            items.length,
          ),
        );
      }

      let cicsCount = 0;
      let sqlCount = 0;
      let firstSqlHasIncOnly = false;

      for (const item of items) {
        if (item.name === CompilerOptions.PPItemName.CICS) {
          cicsCount++;
          if (cicsCount > 1) {
            acceptor(
              diagnosticFromCode(
                CompilerOptionsCodes.PP.CicsInvokedMoreThanOnce,
                item.token,
              ),
            );
          }
        } else if (item.name === CompilerOptions.PPItemName.SQL) {
          sqlCount++;
          if (sqlCount === 1) {
            firstSqlHasIncOnly =
              typeof item.value === "string" && /\bINCONLY\b/i.test(item.value);
          } else if (sqlCount === 2) {
            if (!firstSqlHasIncOnly) {
              acceptor(
                diagnosticFromCode(
                  CompilerOptionsCodes.PP.SqlSecondInvocationRequiresIncOnly,
                  item.token,
                ),
              );
            }
          } else if (sqlCount > 2) {
            acceptor(
              diagnosticFromCode(
                CompilerOptionsCodes.PP.SqlInvokedTooManyTimes,
                item.token,
              ),
            );
          }
        }
      }
    },
  });

/** {@link CompilerOptions.ppCics} */
translator.rule(
  ["PPCICS"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    options.ppCics = {
      value: value.value,
      token: value.token,
    };
  },
  ["NOPPCICS"],
  (option, options) => {
    options.ppCics = false;
    ensureArguments(option, 0, 0);
  },
  { recompile: true },
);

/** {@link CompilerOptions.ppInclude} */
translator
  .rule(["PPINCLUDE"], (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    if (value.value.length > 1000) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.PPInclude.InvalidParameterLength,
        value.token,
        value.value,
      );
    }
    options.ppInclude = { value: value.value, token: value.token };
  })
  .negative(["NOPPINCLUDE"], (option, options) => {
    ensureArguments(option, 0, 0);

    // Clear both the base value and any override previously set via
    // PP(INCLUDE('ID(...)')).
    options.ppInclude = false;
    if (options.pp) {
      options.pp.ppInclude = undefined;
    }
  })
  .settings({ recompile: true })
  .postProcess({
    // PPINCLUDE has no effect unless PP(INCLUDE) is also enabled, and is
    // overridden by an explicit PP(INCLUDE('ID(...)')) alt-keyword.
    id: "ppInclude.usage",
    dependsOn: ["pp.macroImplicit"],
    run: (options, acceptor) => {
      const ppIncludeBase = options.ppInclude;
      if (!ppIncludeBase) {
        return;
      }
      const includeActive = options.pp?.items.some(
        (item) => item.name === CompilerOptions.PPItemName.INCLUDE,
      );
      if (!includeActive) {
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.PPInclude.NoEffectWithoutPPInclude,
            ppIncludeBase.token,
          ),
        );
      } else if (options.pp?.ppInclude?.value) {
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.PPInclude.OverriddenByPPInclude,
            ppIncludeBase.token,
          ),
        );
      }
    },
  });

/** {@link CompilerOptions.ppList} */
translator.rule(
  ["PPLIST"],
  plainTranslate<CompilerOptions>(
    (options, value) => {
      options.ppList = value.value as unknown as CompilerOptions.PPList;
    },
    CompilerOptionsCodes.ExpectedPlainTranslate,
    ["KEEP", "ERASE"],
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
  { recompile: true },
);

/** {@link CompilerOptions.ppSql} */
translator.rule(
  ["PPSQL"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    options.ppSql = {
      value: value.value,
      token: value.token,
    };
  },
  ["NOPPSQL"],
  (option, options) => {
    options.ppSql = false;
    ensureArguments(option, 0, 0);
  },
  { recompile: true },
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
  options.precType = ensureEnum(
    value,
    CompilerOptionsCodes.PrecType.InvalidParameter,
    CompilerOptions.PrecType,
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.Prefix.InvalidParameter,
        value.token,
        value.value,
      );
    }
    if (condition.alwaysEnabled) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Prefix.ConditionIsAlwaysEnabled,
        value.token,
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
    options.proceed = { noProceed: CompilerOptions.Flag.S };
  },
  ["NOPROCEED", "NPRO"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.proceed = { noProceed: CompilerOptions.Flag.I };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    options.proceed = {
      noProceed: ensureEnum(
        value,
        CompilerOptionsCodes.Proceed.InvalidParameter,
        CompilerOptions.Flag,
      ),
    };
  },
);

/** {@link CompilerOptions.process} */
translator.rule(
  ["PROCESS"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.process = CompilerOptions.Process.DELETE;
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    options.process = ensureEnum(
      value,
      CompilerOptionsCodes.Process.InvalidParameter,
      CompilerOptions.Process,
    );
  },
  ["NOPROCESS"],
  (option, options) => {
    options.process = false;
    ensureArguments(option, 0, 0);
  },
  { recompile: true },
);

/** {@link CompilerOptions.quote} */
translator
  .rule(["QUOTE"], (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    // TODO ssmifi: The directive does not allow to use " as string delimiter. It must be set via '.
    ensureType(value, "string");
    if (value.value.length !== 1) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Quote.InvalidParameterLength,
        value.token,
        value.value,
      );
    }
    if (value.value !== '"' && Options.PLI_CHARACTER_REGEX.test(value.value)) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Quote.InvalidParameterCharacter,
        value.token,
        value.value,
      );
    }
    options.quote = value.value;
  })
  .postProcess({
    id: "quote.ignoredWithGraphic",
    run: (options, acceptor, getOwnToken) => {
      const token = getOwnToken();
      if (token === undefined || !options.graphic) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Quote.IgnoredWithGraphic,
          token,
        ),
      );
    },
  });

/** {@link CompilerOptions.reduce} */
translator.flag("reduce", ["REDUCE"], ["NOREDUCE"]);

/** {@link CompilerOptions.rent} */
translator.flag("rent", ["RENT"], ["NORENT"]).postProcess({
  id: "rent.ignoredWithLp64",
  run: (options, acceptor, getOwnToken) => {
    const token = getOwnToken();
    if (
      token === undefined ||
      !options.rent ||
      options.LP !== CompilerOptions.LP.LP64
    ) {
      return;
    }
    acceptor(
      diagnosticFromCode(CompilerOptionsCodes.Rent.IgnoredWithLp64, token),
    );
  },
});

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
    throw diagnosticFromCode(
      CompilerOptionsCodes.Respect.InvalidParameter,
      value.token,
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
    options.rtCheck = ensureEnum(
      value,
      CompilerOptionsCodes.RtCheck.InvalidParameter,
      CompilerOptions.RtCheck,
    );
  } else {
    throw diagnosticFromCode(
      CompilerOptionsCodes.RtCheck.InvalidParameter,
      value.token,
      value.value,
    );
  }
});

/** {@link CompilerOptions.rules} */
translator.rule(
  ["RULES"],
  (option, options, acceptor) => {
    ensureArguments(option, 1);
    ensureToBeDefined(options.rules);
    // Multiple RULES calls are accumulated.
    for (const value of option.values) {
      if (value.kind === SyntaxKind.CompilerOptionText) {
        if (value.value.length === 0) {
          throw diagnosticFromCode(
            CompilerOptionsCodes.ExpectedPlainNotEmpty,
            value.token,
          );
        }
        const name = value.value.toUpperCase();
        // TODO ssmifi: Refactor non-null assertions after #388.
        switch (name) {
          case "IBM":
            options.rules.ibm = CompilerOptions.RulesIBM.IBM;
            break;
          case "ANS":
            options.rules.ibm = CompilerOptions.RulesIBM.ANS;
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
            options.rules.complex = CompilerOptions.RulesSource.ALL;
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
            options.rules.global = CompilerOptions.RulesSource.ALL;
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
            options.rules.goto = CompilerOptions.RulesGoto.STRICT;
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
            options.rules.laxConv = CompilerOptions.RulesSource.ALL;
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
            options.rules.laxEntry = CompilerOptions.RulesEntry.STRICT;
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
            options.rules.laxInOut = {
              source: CompilerOptions.RulesSource.ALL,
              strict: CompilerOptions.RulesStrict.STRICT,
            };
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
            options.rules.laxMargins = CompilerOptions.RulesMargins.STRICT;
            break;
          case "LAXNESTED":
            options.rules.laxNested = true;
            break;
          case "NOLAXNESTED":
            options.rules.laxNested = CompilerOptions.RulesSource.ALL;
            break;
          case "LAXOPTIONAL":
            options.rules.laxOptional = true;
            break;
          case "NOLAXOPTIONAL":
            options.rules.laxOptional = CompilerOptions.RulesSource.ALL;
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
            options.rules.laxParms = CompilerOptions.RulesSource.ALL;
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
            options.rules.laxQual = {
              source: CompilerOptions.RulesQualSource.ALL,
              strict: CompilerOptions.RulesQualStrict.LOOSE,
            };
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
            options.rules.laxScale = {
              source: CompilerOptions.RulesSource.ALL,
              strict: CompilerOptions.RulesStrict.LOOSE,
            };
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
            options.rules.laxStmt = CompilerOptions.RulesSource.ALL;
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
            options.rules.multiEntry = CompilerOptions.RulesSource.ALL;
            break;
          case "MULTIEXIT":
            options.rules.multiExit = true;
            break;
          case "NOMULTIEXIT":
            options.rules.multiExit = CompilerOptions.RulesSource.ALL;
            break;
          case "MULTISEMI":
            options.rules.multiSemi = true;
            break;
          case "NOMULTISEMI":
            options.rules.multiSemi = CompilerOptions.RulesSource.ALL;
            break;
          case "PADDING":
            options.rules.padding = true;
            break;
          case "NOPADDING":
            options.rules.padding = {
              source: CompilerOptions.RulesSource.ALL,
              strict: CompilerOptions.RulesStrict.LOOSE,
            };
            break;
          case "PROCENDONLY":
            options.rules.procEndOnly = true;
            break;
          case "NOPROCENDONLY":
            options.rules.procEndOnly = CompilerOptions.RulesSource.ALL;
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
            options.rules.unref = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFBASED":
            options.rules.unrefBased = true;
            break;
          case "NOUNREFBASED":
            options.rules.unrefBased = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFCTL":
            options.rules.unrefCtl = true;
            break;
          case "NOUNREFCTL":
            options.rules.unrefCtl = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFDEFINED":
            options.rules.unrefDefined = true;
            break;
          case "NOUNREFDEFINED":
            options.rules.unrefDefined = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFENTRY":
            options.rules.unrefEntry = true;
            break;
          case "NOUNREFENTRY":
            options.rules.unrefEntry = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFDEFFILE":
            options.rules.unrefDefFile = true;
            break;
          case "NOUNREFDEFFILE":
            options.rules.unrefDefFile = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFSTATIC":
            options.rules.unrefStatic = true;
            break;
          case "NOUNREFSTATIC":
            options.rules.unrefStatic = CompilerOptions.RulesSource.ALL;
            break;
          case "UNREFVALUE":
            options.rules.unrefValue = true;
            break;
          case "NOUNREFVALUE":
            options.rules.unrefValue = CompilerOptions.RulesSource.ALL;
            break;
          case "UNSET":
            options.rules.unset = true;
            break;
          case "NOUNSET":
            options.rules.unset = CompilerOptions.RulesSource.ALL;
            break;
          case "YY":
            options.rules.yy = true;
            break;
          case "NOYY":
            options.rules.yy = false;
            break;
          default:
            throw diagnosticFromCode(
              CompilerOptionsCodes.Rules.InvalidParameter,
              value.token,
              name,
            );
        }
      } else if (value.kind === SyntaxKind.CompilerOption) {
        const subOption = value.values[0];

        const ensureOnlyOneSubOption = () => {
          for (let i = 1; i < value.values.length; i++) {
            const invalidOption = value.values[i];
            throw diagnosticFromCode(
              CompilerOptionsCodes.Rules.InvalidSubParameter,
              invalidOption.token,
              invalidOption.token.image,
            );
          }
        };

        ensureType(subOption, "plainNotEmpty");
        const name = value.name.toUpperCase();
        switch (name) {
          case "NOCOMPLEX":
            ensureOnlyOneSubOption();
            options.rules.complex = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOGLOBAL":
            ensureOnlyOneSubOption();
            options.rules.global = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOGOTO":
            ensureOnlyOneSubOption();
            options.rules.goto = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.InvalidGotoParameter,
              CompilerOptions.RulesGoto,
            );
            break;
          case "NOLAXCONV":
            ensureOnlyOneSubOption();
            options.rules.laxConv = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOLAXENTRY":
            ensureOnlyOneSubOption();
            options.rules.laxEntry = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.InvalidLaxEntryParameter,
              CompilerOptions.RulesEntry,
            );
            break;
          case "NOLAXINOUT":
            options.rules.laxInOut = {
              source: CompilerOptions.RulesSource.ALL,
              strict: CompilerOptions.RulesStrict.STRICT,
            };
            for (const sub of value.values) {
              ensureType(sub, "plainNotEmpty");
              const subName = sub.value.toUpperCase();
              if (["ALL", "SOURCE"].includes(subName)) {
                options.rules.laxInOut.source = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidLaxInOutParameter,
                  CompilerOptions.RulesSource,
                );
              } else {
                options.rules.laxInOut.strict = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidLaxInOutParameter,
                  CompilerOptions.RulesStrict,
                );
              }
            }
            reportDuplicateSubOptions(value, acceptor);
            reportMutexSubOptions(value, acceptor, [
              ["ALL", "SOURCE"],
              ["STRICT", "LOOSE"],
            ]);
            break;
          case "NOLAXMARGINS":
            ensureOnlyOneSubOption();
            options.rules.laxMargins = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.InvalidLaxMarginsParameter,
              CompilerOptions.RulesMargins,
            );
            break;
          case "NOLAXNESTED":
            ensureOnlyOneSubOption();
            options.rules.laxNested = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOLAXOPTIONAL":
            ensureOnlyOneSubOption();
            options.rules.laxOptional = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOLAXPARMS":
            ensureOnlyOneSubOption();
            options.rules.laxParms = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOLAXQUAL":
            options.rules.laxQual = {
              source: CompilerOptions.RulesQualSource.ALL,
              strict: CompilerOptions.RulesQualStrict.LOOSE,
            };
            for (const sub of value.values) {
              ensureType(sub, "plainNotEmpty");
              const subName = sub.value.toUpperCase();
              if (["ALL", "FORCE"].includes(subName)) {
                options.rules.laxQual.source = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidLaxQualParameter,
                  CompilerOptions.RulesQualSource,
                );
              } else {
                options.rules.laxQual.strict = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidLaxQualParameter,
                  CompilerOptions.RulesQualStrict,
                );
              }
            }
            reportDuplicateSubOptions(value, acceptor);
            reportMutexSubOptions(value, acceptor, [
              ["ALL", "FORCE"],
              ["STRICT", "LOOSE", "FULL"],
            ]);
            break;
          case "NOLAXSCALE":
            options.rules.laxScale = {
              source: CompilerOptions.RulesSource.ALL,
              strict: CompilerOptions.RulesStrict.STRICT,
            };
            for (const sub of value.values) {
              ensureType(sub, "plainNotEmpty");
              const subName = sub.value.toUpperCase();
              if (["ALL", "SOURCE"].includes(subName)) {
                options.rules.laxScale.source = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidLaxScaleParameter,
                  CompilerOptions.RulesSource,
                );
              } else {
                options.rules.laxScale.strict = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidLaxScaleParameter,
                  CompilerOptions.RulesStrict,
                );
              }
            }
            reportDuplicateSubOptions(value, acceptor);
            reportMutexSubOptions(value, acceptor, [
              ["ALL", "SOURCE"],
              ["STRICT", "LOOSE"],
            ]);
            break;
          case "NOLAXSTMT":
            ensureOnlyOneSubOption();
            options.rules.laxStmt = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOMULTIENTRY":
            ensureOnlyOneSubOption();
            options.rules.multiEntry = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOMULTIEXIT":
            ensureOnlyOneSubOption();
            options.rules.multiExit = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOMULTISEMI":
            ensureOnlyOneSubOption();
            options.rules.multiSemi = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOPADDING":
            options.rules.padding = {
              source: CompilerOptions.RulesSource.ALL,
              strict: CompilerOptions.RulesStrict.LOOSE,
            };
            for (const sub of value.values) {
              ensureType(sub, "plainNotEmpty");
              const subName = sub.value.toUpperCase();
              if (["ALL", "SOURCE"].includes(subName)) {
                options.rules.padding.source = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidPaddingParameter,
                  CompilerOptions.RulesSource,
                );
              } else {
                options.rules.padding.strict = ensureEnum(
                  sub,
                  CompilerOptionsCodes.Rules.InvalidPaddingParameter,
                  CompilerOptions.RulesStrict,
                );
              }
            }
            reportDuplicateSubOptions(value, acceptor);
            reportMutexSubOptions(value, acceptor, [
              ["ALL", "SOURCE"],
              ["STRICT", "LOOSE"],
            ]);
            break;
          case "NOPROCENDONLY":
            ensureOnlyOneSubOption();
            options.rules.procEndOnly = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREF":
            ensureOnlyOneSubOption();
            options.rules.unref = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFBASED":
            ensureOnlyOneSubOption();
            options.rules.unrefBased = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFCTL":
            ensureOnlyOneSubOption();
            options.rules.unrefCtl = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFDEFINED":
            ensureOnlyOneSubOption();
            options.rules.unrefDefined = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFENTRY":
            ensureOnlyOneSubOption();
            options.rules.unrefEntry = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFDEFFILE":
            ensureOnlyOneSubOption();
            options.rules.unrefDefFile = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFSTATIC":
            ensureOnlyOneSubOption();
            options.rules.unrefStatic = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNREFVALUE":
            ensureOnlyOneSubOption();
            options.rules.unrefValue = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          case "NOUNSET":
            ensureOnlyOneSubOption();
            options.rules.unset = ensureEnum(
              subOption,
              CompilerOptionsCodes.Rules.ExpectAllSourceParameter,
              CompilerOptions.RulesSource,
            );
            break;
          default:
            throw diagnosticFromCode(
              CompilerOptionsCodes.Rules.InvalidParameter,
              value.token,
              name,
            );
        }
      }
    }
    reportDuplicateSubOptions(option, acceptor);
    reportMutexSubOptions(option, acceptor, [
      ["IBM", "ANS"],
      ["BYNAME", "NOBYNAME"],
      ["COMPLEX", "NOCOMPLEX"],
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
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.semantic} */
translator.rule(
  ["SEMANTIC", "SEM"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.semantic = { noSemantic: CompilerOptions.Flag.S };
  },
  ["NOSEMANTIC", "NSEM"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.semantic = { noSemantic: CompilerOptions.Flag.I };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    options.semantic = {
      noSemantic: ensureEnum(
        value,
        CompilerOptionsCodes.Semantic.InvalidParameter,
        CompilerOptions.Flag,
      ),
    };
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
      throw diagnosticFromCode(
        CompilerOptionsCodes.Service.InvalidEmptyPlainParameter,
        value.token,
      );
    }
    if (value.value.length > 64) {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Service.InvalidParameterLength,
        value.token,
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
  options.static = ensureEnum(
    value,
    CompilerOptionsCodes.Static.InvalidParameter,
    CompilerOptions.Length,
    [
      ["FULL", "F"],
      ["SHORT", "S"],
    ],
  );
});

/** {@link CompilerOptions.stdsys} */
translator.flag("stdsys", ["STDSYS"], ["NOSTDSYS"]);

/** {@link CompilerOptions.stmt} */
translator.flag("stmt", ["STMT"], ["NOSTMT"]);

/** {@link CompilerOptions.storage} */
translator
  .flag("storage", ["STORAGE", "STG"], ["NOSTORAGE", "NSTG"])
  .postProcess({
    id: "storage.ignoredWithNoObject",
    run: (options, acceptor, getOwnToken) => {
      if (!options.storage || options.object !== false) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Object.IgnoredOption,
          getOwnToken(),
          "STORAGE",
        ),
      );
    },
  });

/** {@link CompilerOptions.stringOfGraphic} */
translator.rule(["STRINGOFGRAPHIC", "CHAR", "G"], (option, options) => {
  ensureArguments(option, 1, 1);
  const value = option.values[0];
  ensureType(value, "plainNotEmpty");
  const name = value.value.toUpperCase();
  if (["CHARACTER", "GRAPHIC"].includes(name)) {
    options.stringOfGraphic = ensureEnum(
      value,
      CompilerOptionsCodes.StringOfGraphic.InvalidParameter,
      CompilerOptions.StringOfGraphic,
    );
  } else {
    throw diagnosticFromCode(
      CompilerOptionsCodes.StringOfGraphic.InvalidParameter,
      value.token,
      name,
    );
  }
});

/** {@link CompilerOptions.syntax} */
translator.rule(
  ["SYNTAX", "SYN"],
  (option, options) => {
    ensureArguments(option, 0, 0);
    options.syntax = { noSyntax: CompilerOptions.Flag.S };
  },
  ["NOSYNTAX", "NSYN"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    if (option.values.length === 0) {
      options.syntax = { noSyntax: CompilerOptions.Flag.I };
      return;
    }
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    options.syntax = {
      noSyntax: ensureEnum(
        value,
        CompilerOptionsCodes.Syntax.InvalidParameter,
        CompilerOptions.Flag,
      ),
    };
  },
);

/** {@link CompilerOptions.sysParm} */
translator.rule(["SYSPARM"], (option, options) => {
  ensureArguments(option, 1, 1);
  ensureType(option.values[0], "plainOrString");
  if (
    option.values[0].kind === SyntaxKind.CompilerOptionText &&
    option.values[0].value.length === 0
  ) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.ExpectedPlainNotEmpty,
      option.values[0].token,
    );
  }
  if (option.values[0].value.length > 1023) {
    throw diagnosticFromCode(
      CompilerOptionsCodes.SysParm.InvalidParameterLength,
      option.values[0].token,
      option.values[0].value,
    );
  }

  options.sysParm = option.values[0].value;
});

/** {@link CompilerOptions.system} */
translator.rule(
  ["SYSTEM"],
  (option, options) => {
    ensureArguments(option, 1, 1);
    ensureType(option.values[0], "plain");
    if (option.values[0].value.length === 0) {
      options.system = CompilerOptions.System.MVS; // No parameter defaults to MVS.
      return;
    }
    options.system = ensureEnum(
      option.values[0],
      CompilerOptionsCodes.System.InvalidParameter,
      CompilerOptions.System,
    );
  },
  undefined,
  undefined,
  { recompile: true },
);

/** {@link CompilerOptions.terminal} */
translator.flag("terminal", ["TERMINAL", "TERM"], ["NOTERMINAL", "NTERM"]);

/** {@link CompilerOptions.test} */
translator
  .rule(
    ["TEST"],
    (option, options, acceptor) => {
      // If there are multiple *PROCESS TEST directives,
      // the last one takes precedence and all suboptions that are not specified
      // are set to default.
      options.test = {
        level: CompilerOptions.TestLevel.ALL,
        hook: true,
        separate: false,
        sepName: true,
        source: false,
        sym: true,
      };
      let sepNameToken: CompilerOption["token"] | undefined;
      for (const value of option.values) {
        ensureType(value, "plain");
        const name = value.value.toUpperCase();
        switch (name) {
          case "ALL":
          case "BLOCK":
          case "NONE":
          case "PATH":
          case "STMT":
            options.test.level = ensureEnum(
              value,
              CompilerOptionsCodes.Test.InvalidParameter,
              CompilerOptions.TestLevel,
            );
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
            sepNameToken = value.token;
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
            throw diagnosticFromCode(
              CompilerOptionsCodes.Test.InvalidParameter,
              value.token,
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
      // SEPNAME is ignored if SEPARATE is not in effect.
      if (sepNameToken && !options.test.separate) {
        acceptor(
          diagnosticFromCode(
            CompilerOptionsCodes.Test.SepNameIgnoredWithoutSeparate,
            sepNameToken,
          ),
        );
      }
    },
    ["NOTEST"],
    (option, options) => {
      ensureArguments(option, 0, 0);
      options.test = false;
    },
  )
  .postProcess({
    id: "test.conflictsWithLineDir",
    run: (options, acceptor, getOwnToken) => {
      if (!options.lineDir || !options.test || !options.test.separate) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Test.ConflictWithLineDir,
          getOwnToken(),
        ),
      );
    },
  });

/** {@link CompilerOptions.unroll} */
translator
  .rule(["UNROLL"], (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plainNotEmpty");
    const name = value.value.toUpperCase();
    if (["AUTO", "NO"].includes(name)) {
      options.unroll = ensureEnum(
        value,
        CompilerOptionsCodes.Unroll.InvalidParameter,
        CompilerOptions.Unroll,
      );
    } else {
      throw diagnosticFromCode(
        CompilerOptionsCodes.Unroll.InvalidParameter,
        value.token,
        name,
      );
    }
  })
  .postProcess({
    id: "unroll.ignoredWithNoOptimize",
    run: (options, acceptor, getOwnToken) => {
      const token = getOwnToken();
      if (token === undefined || options.optimize !== 0) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Unroll.IgnoredWithNoOptimize,
          token,
        ),
      );
    },
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
        options.usage.hex = ensureEnum(
          argument,
          CompilerOptionsCodes.Usage.InvalidHexParameter,
          CompilerOptions.UsageHex,
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
        options.usage.round = ensureEnum(
          argument,
          CompilerOptionsCodes.Usage.InvalidRoundParameter,
          CompilerOptions.UsageRound,
        );
        break;
      case "SUBSTR":
        options.usage.substr = ensureEnum(
          argument,
          CompilerOptionsCodes.Usage.InvalidSubstrParameter,
          CompilerOptions.UsageSubstr,
        );
        break;
      case "UNSPEC":
        options.usage.unspec = ensureEnum(
          argument,
          CompilerOptionsCodes.Usage.InvalidUnspecParameter,
          CompilerOptions.UsageUnspec,
        );
        break;
      case "UUID":
        options.usage.uuid = ensureEnum(
          argument,
          CompilerOptionsCodes.Usage.InvalidUuidParameter,
          CompilerOptions.UsageUuid,
        );
        break;
      case "VALIDDATE":
        options.usage.validDate = ensureEnum(
          argument,
          CompilerOptionsCodes.Usage.InvalidValidDateParameter,
          CompilerOptions.UsageValidDate,
        );
        break;
      default:
        throw diagnosticFromCode(
          CompilerOptionsCodes.Usage.InvalidParameter,
          value.token,
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
  options.widechar = ensureEnum(
    value,
    CompilerOptionsCodes.WideChar.InvalidParameter,
    CompilerOptions.WideChar,
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
translator
  .rule(
    ["WRITABLE"],
    (option, options) => {
      ensureArguments(option, 0, 0);
      options.writable = true;
    },
    ["NOWRITABLE"],
    (option, options) => {
      ensureArguments(option, 0, 1);
      if (option.values.length === 0) {
        options.writable = {
          noWritable: CompilerOptions.WritableNoWritable.FWS,
        };
        return;
      }
      const value = option.values[0];
      ensureType(value, "plainNotEmpty");
      options.writable = {
        noWritable: ensureEnum(
          value,
          CompilerOptionsCodes.Writable.InvalidParameter,
          CompilerOptions.WritableNoWritable,
        ),
      };
    },
  )
  .postProcess({
    id: "writable.ignoredWithLp64",
    run: (options, acceptor, getOwnToken) => {
      const token = getOwnToken();
      if (
        token === undefined ||
        options.writable !== true ||
        options.LP !== CompilerOptions.LP.LP64
      ) {
        return;
      }
      acceptor(
        diagnosticFromCode(
          CompilerOptionsCodes.Writable.IgnoredWithLp64,
          token,
        ),
      );
    },
  });

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
        throw diagnosticFromCode(
          CompilerOptionsCodes.XInfo.InvalidParameter,
          value.token,
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
        options.xml.case = ensureEnum(
          value.values[0],
          CompilerOptionsCodes.Xml.InvalidCaseParameter,
          CompilerOptions.XMLCase,
        );
        break;
      case "XMLATTR":
        options.xml.xmlAttr = ensureEnum(
          value.values[0],
          CompilerOptionsCodes.Xml.InvalidXmlAttrParameter,
          CompilerOptions.XMLAttr,
        );
        break;
      default:
        throw diagnosticFromCode(
          CompilerOptionsCodes.Xml.InvalidParameter,
          value.token,
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
        case "F":
        case "FULL":
        case "S":
        case "SHORT":
          options.xRef = {
            ...options.xRef,
            length: ensureEnum(
              value,
              CompilerOptionsCodes.XRef.InvalidLengthParameter,
              CompilerOptions.Length,
              [
                ["FULL", "F"],
                ["SHORT", "S"],
              ],
            ),
          };
          break;
        case "IMPLICIT":
        case "EXPLICIT":
          options.xRef = {
            ...options.xRef,
            structure: ensureEnum(
              value,
              CompilerOptionsCodes.XRef.InvalidStructureParameter,
              CompilerOptions.XRefStructure,
            ),
          };
          break;
        default:
          throw diagnosticFromCode(
            CompilerOptionsCodes.XRef.InvalidParameter,
            value.token,
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
