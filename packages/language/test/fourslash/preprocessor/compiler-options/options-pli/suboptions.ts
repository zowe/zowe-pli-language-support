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

/// <reference path="../../../framework.ts" />

// @wrap: process
////*PROCESS CHECK(STORAGE, <|1:NOSTORAGE|>, <|2:STORAGE|>);
////*PROCESS DECIMAL(CHECKFLOAT, <|3:NOCHECKFLOAT|>, <|4:CHECKFLOAT|>);
////*PROCESS DEFAULT(ALIGNED, <|5:UNALIGNED|>, <|6:ALIGNED|>);
////*PROCESS IGNORE(DISPLAY, <|8:DISPLAY|>);
////*PROCESS JSON(TRIMR, <|9:NOTRIMR|>, <|10:TRIMR|>);
////*PROCESS LANGLVL(OS, <|11:NOEXT|>, <|12:OS|>);
////*PROCESS LIMITS(STRING(32K), <|14:STRING|>(64K));
////*PROCESS LISTVIEW(SOURCE, <|15:AFTERALL|>);
////*PROCESS MAXMSG(W, <|17:I|>, <|18:W|>, 100);
////*PROCESS MAXNEST(BLOCK(17), <|20:BLOCK|>(17));
////*PROCESS MDECK(AFTERALL, <|21:AFTERMACRO|>, <|22:AFTERALL|>);
////*PROCESS ONSNAP(STRINGSIZE, <|23:STRINGSIZE|>);
////*PROCESS OPTIMIZE(0, <|25:3|>, <|26:0|>);
////*PROCESS PREFIX(CONFORMANCE, <|27:NOCONFORMANCE|>, <|28:CONFORMANCE|>);
////*PROCESS RULES(LAXDCL, <|29:NOLAXDCL|>, <|30:LAXDCL|>);
////*PROCESS TEST(SEPARATE, <|31:NOSEPARATE|>, <|32:SEPARATE|>);
////*PROCESS USAGE(HEX(SIZE), <|34:HEX|>(CURRENTSIZE));
////*PROCESS XINFO(DEF, <|35:NODEF|>, <|36:DEF|>);
////*PROCESS XML(CASE(UPPER), <|38:CASE|>(ASIS));
////*PROCESS X(IMPLICIT, <|39:EXPLICIT|>, <|40:IMPLICIT|>);

const mutexTests = [
  { index: 1, message: "CHECK(NOSTORAGE)" },
  { index: 3, message: "DECIMAL(NOCHECKFLOAT)" },
  { index: 5, message: "DEFAULT(UNALIGNED)" },
  { index: 9, message: "JSON(NOTRIMR)" },
  { index: 11, message: "LANGLVL(NOEXT)" },
  { index: 15, message: "LISTVIEW(AFTERALL)" },
  { index: 17, message: "MAXMSG(I)" },
  { index: 21, message: "MDECK(AFTERMACRO)" },
  { index: 25, message: "OPTIMIZE(3)" },
  { index: 27, message: "PREFIX(NOCONFORMANCE)" },
  { index: 29, message: "RULES(NOLAXDCL)" },
  { index: 31, message: "TEST(NOSEPARATE)" },
  { index: 35, message: "XINFO(NODEF)" },
  { index: 39, message: "X(EXPLICIT)" },
];

const dupeTests = [
  { index: 2, message: "CHECK(STORAGE)" },
  { index: 4, message: "DECIMAL(CHECKFLOAT)" },
  { index: 6, message: "DEFAULT(ALIGNED)" },
  { index: 8, message: "IGNORE(DISPLAY)" },
  { index: 10, message: "JSON(TRIMR)" },
  { index: 12, message: "LANGLVL(OS)" },
  { index: 14, message: "LIMITS(STRING)" },
  { index: 18, message: "MAXMSG(W)" },
  { index: 20, message: "MAXNEST(BLOCK)" },
  { index: 22, message: "MDECK(AFTERALL)" },
  { index: 23, message: "ONSNAP(STRINGSIZE)" },
  { index: 26, message: "OPTIMIZE(0)" },
  { index: 28, message: "PREFIX(CONFORMANCE)" },
  { index: 30, message: "RULES(LAXDCL)" },
  { index: 32, message: "TEST(SEPARATE)" },
  { index: 34, message: "USAGE(HEX)" },
  { index: 36, message: "XINFO(DEF)" },
  { index: 38, message: "XML(CASE)" },
  { index: 40, message: "X(IMPLICIT)" },
];

for (const test of mutexTests) {
  verify.expectDiagnosticsAt(test.index, {
    message: code.CompilerOptions.MutexOptionIssue.message(test.message),
  });
}
for (const test of dupeTests) {
  verify.expectDiagnosticsAt(test.index, {
    message: code.CompilerOptions.DupeOptionIssue.message(test.message),
  });
}
