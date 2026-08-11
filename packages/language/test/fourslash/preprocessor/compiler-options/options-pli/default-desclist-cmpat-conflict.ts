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
////*PROCESS CMPAT(V2);
////*PROCESS <|1:DEFAULT|>(DESCLIST);

verify.expectDiagnosticsAt(1, {
  message:
    code.CompilerOptions.Default.DescListConflictsWithCmpat.message("V2"),
});

// DFT(DESCLOCATOR) is assumed instead of DFT(DESCLIST) as specified in the spec.
verify.expectCompilerOptions({
  cmpat: constants.CompilerOptions.CMPat.V2,
  default: {
    desc: constants.CompilerOptions.DefaultDesc.LOCATOR,
  },
});
