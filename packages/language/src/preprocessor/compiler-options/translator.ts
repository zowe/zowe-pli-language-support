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

import { IToken } from "chevrotain";
import {
  CompilerOptionIssue,
  CompilerOptionResult,
  CompilerOptions,
} from "./options";
import { AbstractCompilerOptions } from "./parser";
import { Severity, tokenToRange } from "../../language-server/types";
import {
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  CompilerOptionValue,
  SyntaxKind,
} from "../../syntax-tree/ast";
import { Warning as PLIWarning } from "../../validation/messages/pli-codes";

interface TranslatorRule {
  positive?: string[];
  negative?: string[];
  positiveTranslate?: Translate;
  negativeTranslate?: Translate;
}

type Translate = (option: CompilerOption, options: CompilerOptions) => void;

/**
 * Tracks how a rule is applied, either positively or negatively
 */
enum Applied {
  POSITIVE = 1,
  NEGATIVE = -1,
}

class Translator {
  options: CompilerOptions = {};
  issues: CompilerOptionIssue[] = [];

  /**
   * Translator rules that have been applied to the current options,
   * along w/ info on whether they were applied positively or negatively
   */
  appliedRules = new Map<TranslatorRule, Applied>();

  private rules: TranslatorRule[] = [];

  rule(
    positive: string[],
    positiveTranslate: Translate,
    negative?: string[],
    negativeTranslate?: Translate,
  ) {
    this.rules.push({
      positive,
      negative,
      positiveTranslate,
      negativeTranslate,
    });
  }

  flag(key: keyof CompilerOptions, positive: string[], negative: string[]) {
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

  /**
   * Indicates whether a translator rule has been applied to a given option on this run
   */
  isRuleApplied(rule: TranslatorRule): boolean {
    return this.appliedRules.get(rule) !== undefined;
  }

  /**
   * Assumes a rule has been applied, checks if it was applied positively
   */
  isRuleAppliedPositively(rule: TranslatorRule): boolean {
    return this.appliedRules.get(rule) === Applied.POSITIVE;
  }

  translate(option: CompilerOption) {
    const name = option.name.toUpperCase();
    let found = false;

    try {
      for (const rule of this.rules) {
        if (rule.positive && rule.positive.includes(name)) {
          found = true;
          rule.positiveTranslate?.(option, this.options);

          if (!this.isRuleApplied(rule)) {
            // new application
            this.appliedRules.set(rule, Applied.POSITIVE);
          } else if (this.isRuleAppliedPositively(rule)) {
            // duplicate application (pos)
            this.reportDupeOptIssue(option, name);
          } else {
            // mutex application
            this.reportMutexOptIssue(option, name);
          }
          return;
        }

        if (rule.negative && rule.negative.includes(name)) {
          found = true;
          rule.negativeTranslate?.(option, this.options);

          if (!this.isRuleApplied(rule)) {
            // new application
            this.appliedRules.set(rule, Applied.NEGATIVE);
          } else if (!this.isRuleAppliedPositively(rule)) {
            // duplicate application (neg)
            this.reportDupeOptIssue(option, name);
          } else {
            // mutex application
            this.reportMutexOptIssue(option, name);
          }

          return;
        }
      }
    } catch (err) {
      // We create a new diagnostic for the error
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
    }

    if (!found) {
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
      message: `Duplicate compiler option ${name}`,
      severity: Severity.W,
    });
  }

  /**
   * Adds a mutually exclusive compiler option issue to the list of issues.
   */
  reportMutexOptIssue(option: CompilerOption, name: string): void {
    this.issues.push({
      range: tokenToRange(option.token),
      message: `Mutually exclusive compiler options found for ${name}, only the last one will take effect.`,
      severity: Severity.W,
    });
  }
}

class TranslationError {
  token: IToken;
  message: string;
  severity: Severity;

  constructor(token: IToken, message: string, severity: Severity) {
    this.token = token;
    this.message = message;
    this.severity = severity;
  }
}

function ensureArguments(option: CompilerOption, min: number, max: number) {
  if (option.values.length < min || option.values.length > max) {
    let message: string;
    if (min === max) {
      message = `Expected ${min} arguments, but received ${option.values.length}.`;
    } else {
      message = `Expected between ${min} and ${max} arguments, but received ${option.values.length}.`;
    }
    throw new TranslationError(option.token, message, 1);
  }
}

function ensureType(
  value: CompilerOptionValue,
  type: "plain",
): asserts value is CompilerOptionText;
function ensureType(
  value: CompilerOptionValue,
  type: "string",
): asserts value is CompilerOptionString;
function ensureType(
  value: CompilerOptionValue,
  type: "plainOrString",
): asserts value is CompilerOptionString | CompilerOptionText;
function ensureType(
  value: CompilerOptionValue,
  type: "option",
): asserts value is CompilerOption;
function ensureType(
  value: CompilerOptionValue,
  type: "option" | "plainOrString" | "string" | "plain",
): void {
  if (type === "option") {
    if (value.kind !== SyntaxKind.CompilerOption) {
      throw new TranslationError(
        value.token,
        `Expected a compiler option with arguments.`,
        1,
      );
    }
  } else if (type === "plain") {
    if (value.kind !== SyntaxKind.CompilerOptionText) {
      throw new TranslationError(
        value.token,
        `Expected a plain text value.`,
        1,
      );
    }
  } else if (type === "string") {
    if (value.kind !== SyntaxKind.CompilerOptionString) {
      throw new TranslationError(value.token, `Expected a string value.`, 1);
    }
  } else if (type === "plainOrString") {
    if (
      value.kind !== SyntaxKind.CompilerOptionText &&
      value.kind !== SyntaxKind.CompilerOptionString
    ) {
      throw new TranslationError(
        value.token,
        `Expected a plain text or string value.`,
        1,
      );
    }
  }
}

const translator = new Translator();

function stringTranslate(
  callback: (options: CompilerOptions, value: CompilerOptionString) => void,
): Translate {
  return (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "string");
    callback(options, value);
  };
}

function plainTranslate(
  callback: (options: CompilerOptions, value: CompilerOptionText) => void,
  ...values: string[]
): Translate {
  return (option, options) => {
    ensureArguments(option, 1, 1);
    const value = option.values[0];
    ensureType(value, "plain");
    if (values.length > 0 && !values.includes(value.value)) {
      throw new TranslationError(
        value.token,
        `Expected one of '${values.join("', '")}', but received '${value.value}'.`,
        1,
      );
    }
    callback(options, value);
  };
}

/** {@link CompilerOptions.aggregate} */
translator.rule(
  ["AGGREGATE", "AG"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    const value = option.values[0];
    if (value) {
      ensureType(value, "plain");
      const text = value.value;
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
  ["ATTRIBUTES", "A", "NOATTRIBUTES", "NA"],
  (option, options) => {
    ensureArguments(option, 0, 1);
    const include = option.name.startsWith("A");
    let identifiers: "FULL" | "SHORT" | undefined = undefined;
    const value = option.values[0];
    if (value) {
      ensureType(value, "plain");
      const text = value.value;
      if (text === "F" || text === "FULL") {
        identifiers = "FULL";
      } else if (text === "S" || text === "SHORT") {
        identifiers = "SHORT";
      } else {
        throw new TranslationError(
          value.token,
          "Invalid attribute value. Expected FULL or SHORT.",
          1,
        );
      }
    }
    options.attributes = {
      include,
      identifiers,
    };
  },
);

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
translator.rule(
  ["BLANK"],
  stringTranslate((options, value) => {
    options.blank = value.value;
  }),
);

/** {@link CompilerOptions.blkoff} */
translator.flag("blkoff", ["BLKOFF"], ["NOBLKOFF"]);

/** {@link CompilerOptions.brackets} */
translator.rule(
  ["BRACKETS"],
  stringTranslate((options, value) => {
    const length = value.value.length;
    if (length !== 2) {
      throw new TranslationError(value.token, "Expected two characters.", 1);
    }
    const start = value.value.charAt(0);
    const end = value.value.charAt(1);
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
translator.rule(["CASERULES"], (option, options) => {
  ensureArguments(option, 1, 1);
  const keyword = option.values[0];
  ensureType(keyword, "option");
  if (keyword.name !== "KEYWORD") {
    throw new TranslationError(
      keyword.token,
      `Expected "KEYWORD" as compiler option value.`,
      1,
    );
  }
  ensureArguments(keyword, 1, 1);
  const keywordCase = keyword.values[0];
  ensureType(keywordCase, "plain");
  plainTranslate(
    (options, value) => {
      options.caserules = value.value as CompilerOptions.CaseRules;
    },
    "MIXED",
    "UPPER",
    "LOWER",
    "START",
  )(keyword, options);
});

/** {@link CompilerOptions.check} */
translator.rule(
  ["CHECK"],
  plainTranslate(
    (options, value) => {
      let text = value.value;
      if (text === "STG") {
        text = "STORAGE";
      } else if (text === "NSTG") {
        text = "NOSTORAGE";
      }
      options.check = {
        storage: text as "STORAGE" | "NOSTORAGE",
      };
    },
    "STORAGE",
    "STG",
    "NOSTORAGE",
    "NSTG",
  ),
);

/** {@link CompilerOptions.cmpat} */
translator.rule(
  ["CMPAT", "CMP"],
  plainTranslate(
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
translator.rule(
  ["CODEPAGE", "CP"],
  plainTranslate((options, value) => {
    options.codepage = value.value;
  }),
);

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
      const value = severity.value;
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
  (_, options) => {
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
  options.ddsql = value.value;
});

/** {@link CompilerOptions.decimal} */
translator.rule(["DECIMAL", "DEC"], (option, options) => {
  options.decimal = {};
  for (const opt of option.values) {
    ensureType(opt, "plain");
    const value = opt.value;
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
});

/** {@link CompilerOptions.decomp} */
translator.flag("decomp", ["DECOMP"], ["NODECOMP"]);

/** {@link CompilerOptions.default} */
translator.rule(["DEFAULT", "DFT"], (option, options) => {
  const def: CompilerOptions.Default = (options.default = {});
  for (const opt of option.values) {
    if (opt.kind === SyntaxKind.CompilerOptionText) {
      const val = opt.value;
      switch (val) {
        case "ALIGNED":
          def.aligned = true;
          break;
        case "UNALIGNED":
          def.aligned = false;
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
          def.assignable = true;
          break;
        case "NONASSIGNABLE":
          def.assignable = false;
          break;
        case "BIN1ARG":
          def.bin1arg = true;
          break;
        case "NOBIN1ARG":
          def.bin1arg = false;
          break;
        case "BYADDR":
        case "BYVALUE":
          def.allocator = val;
          break;
        case "CONNECTED":
          def.connected = true;
          break;
        case "NONCONNECTED":
          def.connected = false;
          break;
        case "DESCLIST":
          def.desc = "LIST";
          break;
        case "DESCLOCATOR":
          def.desc = "LOCATOR";
          break;
        case "DESCRIPTOR":
          def.descriptor = true;
          break;
        case "NODESCRIPTOR":
          def.descriptor = false;
          break;
        case "EVENDEC":
          def.evendec = true;
          break;
        case "NOEVENDEC":
          def.evendec = false;
          break;
        case "HEXADEC":
        case "IEEE":
          def.format = val;
          break;
        case "INLINE":
          def.inline = true;
          break;
        case "NOINLINE":
          def.inline = false;
          break;
        case "LAXQUAL":
          def.laxqual = true;
          break;
        case "NOLAXQUAL":
          def.laxqual = false;
          break;
        case "LOWERINC":
        case "UPPERINC":
          def.inc = val;
          break;
        case "NATIVE":
          def.native = true;
          break;
        case "NONNATIVE":
          def.native = false;
          break;
        case "NATIVEADDR":
          def.nativeAddr = true;
          break;
        case "NONNATIVEADDR":
          def.nativeAddr = false;
          break;
        case "NULLSYS":
        case "NULL370":
          def.nullsys = val;
          break;
        case "NULLSTRADDR":
          def.nullStrAddr = true;
          break;
        case "NONULLSTRADDR":
          def.nullStrAddr = false;
          break;
        case "ORDER":
        case "REORDER":
          def.order = val;
          break;
        case "OVERLAP":
          def.overlap = true;
          break;
        case "NOOVERLAP":
          def.overlap = false;
          break;
        case "PADDING":
          def.padding = true;
          break;
        case "NOPADDING":
          def.padding = false;
          break;
        case "PSEUDODUMMY":
          def.pseudodummy = true;
          break;
        case "NOPSEUDODUMMY":
          def.pseudodummy = false;
          break;
        case "RECURSIVE":
          def.recursive = true;
          break;
        case "NORECURSIVE":
          def.recursive = false;
          break;
        case "RETCODE":
          def.retcode = true;
          break;
        case "NORETCODE":
          def.retcode = false;
          break;
        default:
          throw new TranslationError(
            opt.token,
            `Invalid default option value: ${val}`,
            1,
          );
      }
    }
  }
});

/** {@link CompilerOptions.deprecate} */
/** {@link CompilerOptions.deprecateNext} */
translator.rule(["DEPRECATE", "DEPRECATENEXT"], (option, options) => {
  const items: CompilerOptions.DeprecateItem[] = [];
  for (const opt of option.values) {
    ensureType(opt, "option");
    if (
      !["BUILTIN", "ENTRY", "INCLUDE", "STMT", "VARIABLE"].includes(opt.name)
    ) {
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
      type: opt.name as CompilerOptions.DeprecateItem["type"],
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
    if (value.value === "STD") {
      display.std = true;
    } else if (value.value === "WTO") {
      display.wto = true;
    } else {
      throw new TranslationError(
        value.token,
        `Invalid display value. Expected STD or WTO, but received '${value.value}'.`,
        1,
      );
    }
  } else if (value.kind === SyntaxKind.CompilerOption) {
    if (value.name !== "WTO") {
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
      if (opt.name === "ROUTCDE") {
        display.routcde = parameters;
      } else if (opt.name === "DESC") {
        display.desc = parameters;
      } else if (opt.name === "REPLY") {
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
    const flag = value.value;
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
/** {@link CompilerOptions.graphic} */
/** {@link CompilerOptions.header} */
/** {@link CompilerOptions.hgpr} */
/** {@link CompilerOptions.ignore} */
/** {@link CompilerOptions.incAfter} */
/** {@link CompilerOptions.incDir} */
/** {@link CompilerOptions.include} */
/** {@link CompilerOptions.incPds} */
/** {@link CompilerOptions.initAuto} */
/** {@link CompilerOptions.initBased} */
/** {@link CompilerOptions.initCtl} */
/** {@link CompilerOptions.initStatic} */
/** {@link CompilerOptions.inSource} */
/** {@link CompilerOptions.interrupt} */
/** {@link CompilerOptions.json} */
/** {@link CompilerOptions.langlvl} */
/** {@link CompilerOptions.limits} */
/** {@link CompilerOptions.lineCount} */
/** {@link CompilerOptions.lineDir} */
/** {@link CompilerOptions.list} */
translator.flag("list", ["LIST"], ["NOLIST"]);
/** {@link CompilerOptions.listView} */
/** {@link CompilerOptions.LP} */
/** {@link CompilerOptions.macro} */
/** {@link CompilerOptions.map} */
/** {@link CompilerOptions.margini} */

/** {@link CompilerOptions.margins} */
translator.rule(
  ["MARGINS", "MAR"],
  (option, options) => {
    ensureArguments(option, 2, 3);
    const m = option.values[0];
    const n = option.values[1];
    const c = option.values[2];
    ensureType(m, "plain");
    ensureType(n, "plain");
    let cValue: string | undefined = undefined;
    if (c) {
      ensureType(c, "plain");
      cValue = c.value;
    }
    const start = m.value ? Number(m.value) : NaN;
    const end = n.value ? Number(n.value) : NaN;
    options.margins = {
      m: start,
      n: end,
      c: cValue,
    };
  },
  ["NOMARGINS"],
  (_, options) => {
    options.margins = false;
  },
);

/** {@link CompilerOptions.maxbranch} */
/** {@link CompilerOptions.maxinit} */
/** {@link CompilerOptions.maxgen} */
/** {@link CompilerOptions.maxmem} */
/** {@link CompilerOptions.maxmsg} */
/** {@link CompilerOptions.maxnest} */
/** {@link CompilerOptions.maxRunOnIf} */
/** {@link CompilerOptions.maxStatic} */
/** {@link CompilerOptions.maxStmt} */
/** {@link CompilerOptions.maxTemp} */
/** {@link CompilerOptions.mDeck} */
/** {@link CompilerOptions.msgSummary} */
/** {@link CompilerOptions.name} */
/** {@link CompilerOptions.names} */
/** {@link CompilerOptions.natlang} */
/** {@link CompilerOptions.nest} */

/** {@link CompilerOptions.not} */
translator.rule(
  ["NOT"],
  stringTranslate((options, value) => {
    options.not = value.value;
  }),
);

/** {@link CompilerOptions.nullDate} */
/** {@link CompilerOptions.object} */
/** {@link CompilerOptions.offset} */
/** {@link CompilerOptions.offsetSize} */
/** {@link CompilerOptions.onSnap} */
/** {@link CompilerOptions.optimize} */
/** {@link CompilerOptions.options} */

/** {@link CompilerOptions.or} */
translator.rule(
  ["OR"],
  stringTranslate((options, value) => {
    options.or = value.value;
  }),
);

/** {@link CompilerOptions.pp} */
/** {@link CompilerOptions.ppCics} */
/** {@link CompilerOptions.ppInclude} */
/** {@link CompilerOptions.ppList} */
/** {@link CompilerOptions.ppMacro} */
/** {@link CompilerOptions.ppSql} */
/** {@link CompilerOptions.ppTrace} */
/** {@link CompilerOptions.precType} */
/** {@link CompilerOptions.prefix} */
/** {@link CompilerOptions.proceed} */
/** {@link CompilerOptions.process} */
/** {@link CompilerOptions.quote} */
/** {@link CompilerOptions.reduce} */
/** {@link CompilerOptions.rent} */
/** {@link CompilerOptions.resExp} */
/** {@link CompilerOptions.respect} */
/** {@link CompilerOptions.rtCheck} */
/** {@link CompilerOptions.rules} */
/** {@link CompilerOptions.semantic} */
/** {@link CompilerOptions.service} */
/** {@link CompilerOptions.source} */
/** {@link CompilerOptions.spill} */
/** {@link CompilerOptions.static} */
/** {@link CompilerOptions.stdsys} */
/** {@link CompilerOptions.stmt} */
/** {@link CompilerOptions.storage} */
/** {@link CompilerOptions.stringOfGraphic} */
/** {@link CompilerOptions.syntax} */
/** {@link CompilerOptions.sysParm} */
/** {@link CompilerOptions.system} */
/** {@link CompilerOptions.terminal} */
/** {@link CompilerOptions.test} */
/** {@link CompilerOptions.unroll} */
/** {@link CompilerOptions.usage} */
/** {@link CompilerOptions.widechar} */
/** {@link CompilerOptions.window} */
/** {@link CompilerOptions.writable} */
/** {@link CompilerOptions.xInfo} */
/** {@link CompilerOptions.xml} */
/** {@link CompilerOptions.xRef} */

export function translateCompilerOptions(
  input: AbstractCompilerOptions,
): CompilerOptionResult {
  translator.options = {};
  translator.appliedRules.clear();
  translator.issues = [...input.issues];
  for (const option of input.options) {
    translator.translate(option);
  }
  return {
    options: translator.options,
    tokens: input.tokens,
    issues: translator.issues,
  };
}
