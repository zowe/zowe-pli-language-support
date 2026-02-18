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
////*PROCESS DEFAULT(EBCDIC);
////*PROCESS DEFAULT(ASSIGNABLE);
////*PROCESS DEFAULT(BIN1ARG);
////*PROCESS DEFAULT(EVENDEC);
////*PROCESS DEFAULT(BYADDR);
////*PROCESS DEFAULT(NONCONNECTED);
////*PROCESS DEFAULT(DESCLOCATOR);
////*PROCESS DEFAULT(DESCRIPTOR);
////*PROCESS DEFAULT(HEXADEC);
////*PROCESS DEFAULT(NOINLINE);
////*PROCESS DEFAULT(NOLAXQUAL);
////*PROCESS DEFAULT(LOWERINC);
////*PROCESS DEFAULT(NATIVE);
////*PROCESS DEFAULT(NATIVEADDR);
////*PROCESS DEFAULT(NULL370);
////*PROCESS DEFAULT(NULLSTRADDR);
////*PROCESS DEFAULT(REORDER);
////*PROCESS DEFAULT(NOOVERLAP);
////*PROCESS DEFAULT(NOPADDING);
////*PROCESS DEFAULT(PSEUDODUMMY);
////*PROCESS DEFAULT(NORECURSIVE);
////*PROCESS DEFAULT(NORETCODE);
////*PROCESS DEFAULT(NOINITFILL);

verify.expectCompilerOptions({
  default: {
    encoding: constants.CompilerOptions.DefaultEncoding.EBCDIC,
    assignable: true,
    bin1arg: true,
    evendec: true,
    allocator: constants.CompilerOptions.DefaultAllocator.BYADDR,
    connected: false,
    desc: constants.CompilerOptions.DefaultDesc.LOCATOR,
    descriptor: true,
    format: constants.CompilerOptions.DefaultFormat.HEXADEC,
    initfill: false,
    inline: false,
    laxqual: false,
    inc: constants.CompilerOptions.DefaultInc.LOWERINC,
    native: true,
    nativeAddr: true,
    nullsys: constants.CompilerOptions.DefaultNullSys.NULL370,
    nullStrAddr: true,
    order: constants.CompilerOptions.DefaultOrder.REORDER,
    overlap: false,
    padding: false,
    pseudodummy: true,
    recursive: false,
    retcode: false,
  },
});
