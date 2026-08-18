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
////*PROCESS CMPAT(LE); // CMPAT(LE) does not conflict with DFT(DESCLIST).
////*PROCESS <|0:DEFAULT|>;
////*PROCESS <|d1:DEFAULT|>(<|1:)|>;
////*PROCESS <|d2:DEFAULT|>(<|2:INVALID|>);
////*PROCESS <|d3:DEFAULT|>(IBM, <|3:ALIGNED|>);
////*PROCESS <|d4:DEFAULT|>(ANS <|4:UNALIGNED|>);
////*PROCESS <|d5:DEFAULT|>(ASCII);
////*PROCESS <|d6:DEFAULT|>(NONASSIGNABLE);
////*PROCESS <|d7:DEFAULT|>(NOBIN1ARG);
////*PROCESS <|d8:DEFAULT|>(NOEVENDEC);
////*PROCESS <|d9:DEFAULT|>(BYVALUE);
////*PROCESS <|d10:DEFAULT|>(CONNECTED);
////*PROCESS <|d11:DEFAULT|>(DESCLIST);
////*PROCESS <|d12:DEFAULT|>(NODESCRIPTOR);
////*PROCESS <|d13:DEFAULT|>(NOEVENDEC);
////*PROCESS <|d14:DEFAULT|>(IEEE);
////*PROCESS <|d15:DEFAULT|>(INLINE);
////*PROCESS <|d16:DEFAULT|>(LAXQUAL);
////*PROCESS <|d17:DEFAULT|>(UPPERINC);
////*PROCESS <|d18:DEFAULT|>(NONNATIVE);
////*PROCESS <|d19:DEFAULT|>(NONNATIVEADDR);
////*PROCESS <|d20:DEFAULT|>(NULLSYS);
////*PROCESS <|d21:DEFAULT|>(NONULLSTRADDR);
////*PROCESS <|d22:DEFAULT|>(ORDER);
////*PROCESS <|d23:DEFAULT|>(OVERLAP);
////*PROCESS <|d24:DEFAULT|>(PADDING);
////*PROCESS <|d25:DEFAULT|>(NOPSEUDODUMMY);
////*PROCESS <|d26:DEFAULT|>(RECURSIVE);
////*PROCESS <|d27:DEFAULT|>(NONRECURSIVE);
////*PROCESS <|d28:DFT|>(RETCODE);

verify.expectDiagnosticsAt(0, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(
  Array.from({ length: 26 }, (_, i) => `d${i + 1}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("DEFAULT"),
  },
);
verify.expectDiagnosticsAt("d28", {
  message: code.CompilerOptions.DupeOptionIssue.message("DFT"),
});
verify.noDiagnostics(1);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.Default.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics([3, 4]);
verify.expectCompilerOptions({
  default: {
    aligned: false,
    architecture: constants.CompilerOptions.DefaultArchitecture.ANS,
    encoding: constants.CompilerOptions.DefaultEncoding.ASCII,
    assignable: false,
    bin1arg: false,
    allocator: constants.CompilerOptions.DefaultAllocator.BYVALUE,
    connected: true,
    desc: constants.CompilerOptions.DefaultDesc.LIST,
    descriptor: false,
    evendec: false,
    format: constants.CompilerOptions.DefaultFormat.IEEE,
    inline: true,
    laxqual: true,
    inc: constants.CompilerOptions.DefaultInc.UPPERINC,
    native: false,
    nativeAddr: false,
    nullsys: constants.CompilerOptions.DefaultNullSys.NULLSYS,
    nullStrAddr: false,
    order: constants.CompilerOptions.DefaultOrder.ORDER,
    overlap: true,
    padding: true,
    pseudodummy: false,
    recursive: false,
    retcode: true,
  },
});
