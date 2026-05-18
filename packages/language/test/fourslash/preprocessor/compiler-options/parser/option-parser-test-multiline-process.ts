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

////*PROCESS MARGINS(2,72,1),INCLUDE,LIST
////,AG,A(F),MAP,NEST,OF,NOPT,STG,X(F),
//// INITAUTO(F);
//// pgm: PROC;
////  DCL   a            FIXED BIN(31);
//// END;

verify.expectCompilerOptions({
  margins: {
    m: 2,
    n: 72,
    c: 1,
  },
  include: true,
  list: true,
  aggregate: constants.CompilerOptions.Aggregate.DECIMAL,
  attributes: constants.CompilerOptions.Length.FULL,
  map: true,
  nest: true,
  offset: true,
  optimize: 0,
  storage: true,
  xRef: {
    length: constants.CompilerOptions.Length.FULL,
  },
  initAuto: constants.CompilerOptions.InitAuto.FULL,
});
