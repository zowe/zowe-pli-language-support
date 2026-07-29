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

/**
 * Completion metadata for PLI compiler options
 *
 * This file is intentionally kept separate from translator-pli.ts so that
 * completion behaviour can be declared without touching the translation logic.
 * A future refactoring could derive these entries automatically from the
 * translator rule definitions.
 */
export interface CompilerOptionCompletion {
  /** Canonical option name (uppercase). */
  name: string;
  /**
   * Mandatory number of parameters this option requires.
   * `0`: no parentheses inserted (plain name).
   * `>0`: a snippet with parentheses is offered: `NAME(${1:...})`.
   */
  mandatoryParams: number;
  /**
   * Candidate value(s) for the (typically single) parameter:
   * - One entry: used as the snippet tab-stop default, e.g. `["2, 72"]` is
   *   inserted as `MARGINS(${1:2, 72})`. May contain a single `<|>`
   *   marker to indicate where the cursor should land after completion.
   * - Multiple entries: rendered as an LSP snippet "choice", e.g.
   *   `["DECIMAL", "HEXADEC"]` inserted as `AGGREGATE(${1|DECIMAL,HEXADEC|})`,
   *   letting the user tab into the parentheses and cycle through the
   *   offered values. These are also offered as completions when typing
   *   inside the parentheses directly.
   */
  params?: readonly string[];
}

export const CURSOR_MARKER = "<|>";

export function getValueAlternatives(
  meta: CompilerOptionCompletion,
): readonly string[] | undefined {
  const values = meta.params?.filter((value) => !value.includes(CURSOR_MARKER));
  return values && values.length > 0 ? values : undefined;
}

function completion(
  name: string,
  mandatoryParams: number,
  params?: string | readonly string[],
): CompilerOptionCompletion {
  if (params === undefined) {
    return { name, mandatoryParams };
  }
  return {
    name,
    mandatoryParams,
    params: Array.isArray(params) ? params : [params],
  };
}

const COMPLETIONS: CompilerOptionCompletion[] = [
  completion("AGGREGATE", 0, ["DECIMAL", "HEXADEC"]),
  completion("NOAGGREGATE", 0),
  completion("ARCH", 1, ["10", "11", "12", "13", "14"]),
  completion("ASSERT", 1, ["ENTRY", "CONDITION"]),
  completion("ATTRIBUTES", 0, ["FULL", "SHORT"]),
  completion("NOATTRIBUTES", 0),

  completion("BACKREG", 1, ["5", "11"]),
  completion("BIFPREC", 1, ["31", "15"]),
  completion("BLANK", 1),
  completion("BLKOFF", 0),
  completion("NOBLKOFF", 0),
  completion("BRACKETS", 1),

  completion("CASE", 1, ["ASIS", "UPPER"]),
  completion("CASERULES", 1, [
    "KEYWORD(MIXED)",
    "KEYWORD(UPPER)",
    "KEYWORD(LOWER)",
    "KEYWORD(START)",
  ]),
  completion("CHECK", 1, ["NOSTORAGE", "STORAGE"]),
  completion("CMPAT", 1, ["V2", "LE", "V1", "V3"]),

  completion("CODEPAGE", 1, [
    "01140",
    "01047",
    "01141",
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
  ]),
  completion("COMMON", 0),
  completion("NOCOMMON", 0),
  completion("COMPILE", 0),
  completion("NOCOMPILE", 0, ["S", "W", "E"]),
  completion("COPYRIGHT", 1),
  completion("NOCOPYRIGHT", 0),
  completion("CSECT", 0),
  completion("NOCSECT", 0),
  completion("CSECTCUT", 1, ["4", "0", "1", "2", "3", "5", "6", "7"]),
  completion("CURRENCY", 1, "$"),

  completion("DBCS", 0),
  completion("NODBCS", 0),
  completion("DBRMLIB", 0),
  completion("NODBRMLIB", 0),
  completion("DD", 0),
  completion("DDSQL", 1),
  completion("DECIMAL", 1),
  completion("DECOMP", 0),
  completion("NODECOMP", 0),
  completion("DEFAULT", 1),
  completion("DEPRECATE", 1),
  completion("DEPRECATENEXT", 1),
  completion("DISPLAY", 1),
  completion("DLL", 0),
  completion("NODLL", 0),
  completion("DLLINIT", 0),
  completion("NODLLINIT", 0),

  completion("EXIT", 0),
  completion("NOEXIT", 0),
  completion("EXPORTALL", 0),
  completion("NOEXPORTALL", 0),
  completion("EXTRN", 1, ["FULL", "SHORT"]),

  completion("FILEREF", 0, ["HASH", "NOHASH"]),
  completion("NOFILEREF", 0),
  completion("FLAG", 0, ["W", "I", "E", "S"]),
  completion("FLOAT", 1, ["NODFP", "DFP"]),
  completion("FLOATINMATH", 1, ["ASIS", "LONG", "EXTENDED"]),

  completion("GOFF", 0),
  completion("NOGOFF", 0),
  completion("GONUMBER", 1, ["NOSEPARATE", "SEPARATE"]),
  completion("NOGONUMBER", 0),
  completion("GRAPHIC", 0),
  completion("NOGRAPHIC", 0),

  completion("HEADER", 1, ["ALL", "FILE", "FIRST", "SOURCE"]),
  completion("HGPR", 1, ["NOPRESERVE", "PRESERVE"]),

  completion("IGNORE", 1),
  completion("NOIGNORE", 0),
  completion("INCAFTER", 1, "PROCESS(<|>)"),
  completion("INCDIR", 1),
  completion("INCLUDE", 0),
  completion("NOINCLUDE", 0),
  completion("INCPDS", 1),
  completion("NOINCPDS", 0),
  completion("INITAUTO", 0, ["FULL", "SHORT"]),
  completion("NOINITAUTO", 0),
  completion("INITBASED", 0),
  completion("NOINITBASED", 0),
  completion("INITCTL", 0),
  completion("NOINITCTL", 0),
  completion("INITSTATIC", 0),
  completion("NOINITSTATIC", 0),
  completion("INSOURCE", 0),
  completion("NOINSOURCE", 0),
  completion("INTERRUPT", 0),
  completion("NOINTERRUPT", 0),

  completion("JSON", 1, ""),

  completion("LANGLVL", 1, ["OS", "NOEXT"]),
  completion("LIMITS", 1),
  completion("LINECOUNT", 1, "31415"),
  completion("LINEDIR", 0),
  completion("NOLINEDIR", 0),
  completion("LIST", 0),
  completion("NOLIST", 0),
  completion("LISTVIEW", 1, [
    "SOURCE",
    "AFTERALL",
    "AFTERCICS",
    "AFTERMACRO",
    "AFTERSQL",
  ]),
  completion("LP", 1, ["32", "64"]),

  completion("MACRO", 0),
  completion("NOMACRO", 0),
  completion("MAP", 0),
  completion("NOMAP", 0),
  completion("MARGINI", 1),
  completion("NOMARGINI", 0),
  completion("MARGINS", 2, "2, 72"),
  completion("NOMARGINS", 0),
  completion("MAXBRANCH", 1, "2000"),
  completion("MAXINIT", 1, "64k"),
  completion("MAXGEN", 1, "100000"),
  completion("MAXMEM", 1, "1048576"),
  completion("MAXMSG", 1),
  completion("MAXNEST", 1),
  completion("MAXRUNONIF", 1, "10"),
  completion("MAXSTATIC", 1, "1M"),
  completion("MAXSTMT", 1, "4096"),
  completion("MAXTEMP", 1, "50000"),
  completion("MDECK", 1, ["AFTERALL", "AFTERMACRO"]),
  completion("NOMDECK", 0),
  completion("MSGSUMMARY", 0, ["NOXREF", "XREF"]),
  completion("NOMSGSUMMARY", 0),

  completion("NAME", 0),
  completion("NONAME", 0),
  completion("NAMES", 1),
  completion("NATLANG", 1, ["ENU", "UEN"]),
  completion("NEST", 0),
  completion("NONEST", 0),
  completion("NOT", 1),
  completion("NULLDATE", 0),
  completion("NONULLDATE", 0),

  completion("OBJECT", 0),
  completion("NOOBJECT", 0),
  completion("OFFSET", 0),
  completion("NOOFFSET", 0),
  completion("OFFSETSIZE", 1, ["4", "8"]),
  completion("ONSNAP", 1, ["STRINGRANGE", "STRINGSIZE"]),
  completion("NOONSNAP", 0),
  completion("OPTIMIZE", 0, ["0", "TIME", "2", "3"]),
  completion("NOOPTIMIZE", 0),
  completion("OPTIONS", 0, ["DOC", "ALL"]),
  completion("NOOPTIONS", 0),
  completion("OR", 1),

  completion("PP", 1, "MACRO, SQL, CICS"),
  completion("NOPP", 0),
  completion("PPCICS", 1),
  completion("NOPPCICS", 0),
  completion("PPINCLUDE", 1),
  completion("NOPPINCLUDE", 0),
  completion("PPLIST", 1, ["KEEP", "ERASE"]),
  completion("PPMACRO", 1),
  completion("NOPPMACRO", 0),
  completion("PPSQL", 1),
  completion("NOPPSQL", 0),
  completion("PPTRACE", 0),
  completion("NOPPTRACE", 0),
  completion("PRECTYPE", 1, ["ANS", "DECDIGIT", "DECRESULT"]),
  completion("PREFIX", 1),
  completion("PROCEED", 0),
  completion("NOPROCEED", 0, ["S", "W", "E"]),
  completion("PROCESS", 0, ["DELETE", "KEEP"]),
  completion("NOPROCESS", 0),

  completion("QUOTE", 1),

  completion("REDUCE", 0),
  completion("NOREDUCE", 0),
  completion("RENT", 0),
  completion("NORENT", 0),
  completion("RESEXP", 0),
  completion("NORESEXP", 0),
  completion("RESPECT", 1),
  completion("RTCHECK", 1, ["NONULLPTR", "NULLPTR", "NULL370"]),
  completion("RULES", 1),

  completion("SEMANTIC", 0),
  completion("NOSEMANTIC", 0, ["S", "W", "E"]),
  completion("SERVICE", 1),
  completion("NOSERVICE", 0),
  completion("SOURCE", 0),
  completion("NOSOURCE", 0),
  completion("SPILL", 1, "2048"),
  completion("STATIC", 1, ["FULL", "SHORT"]),
  completion("STDSYS", 0),
  completion("NOSTDSYS", 0),
  completion("STMT", 0),
  completion("NOSTMT", 0),
  completion("STORAGE", 0),
  completion("NOSTORAGE", 0),
  completion("STRINGOFGRAPHIC", 1, ["GRAPHIC", "CHARACTER"]),
  completion("SYNTAX", 0),
  completion("NOSYNTAX", 0, ["S", "W", "E"]),
  completion("SYSPARM", 1),
  completion("SYSTEM", 1, ["MVS", "CICS", "IMS", "OS", "TSO"]),

  completion("TERMINAL", 0),
  completion("NOTERMINAL", 0),
  completion("TEST", 0),
  completion("NOTEST", 0),

  completion("UNROLL", 1, ["AUTO", "NO"]),
  completion("USAGE", 1),

  completion("WIDECHAR", 1, ["BIGENDIAN", "LITTLEENDIAN"]),
  completion("WINDOW", 1, "1950"),
  completion("WRITABLE", 0),
  completion("NOWRITABLE", 0, ["FWS", "PRV"]),

  completion("XINFO", 1),
  completion("XML", 1),
  completion("XREF", 0),
  completion("NOXREF", 0),
];

export const PLI_OPTION_NAMES: readonly string[] = COMPLETIONS.map(
  (c) => c.name,
);

const COMPLETION_MAP = new Map<string, CompilerOptionCompletion>(
  COMPLETIONS.map((c) => [c.name, c]),
);

export function getOptionCompletion(
  name: string,
): CompilerOptionCompletion | undefined {
  return COMPLETION_MAP.get(name.toUpperCase());
}
