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

/// <reference path="../../framework.ts" />

// PPSQL(...) is a one-time setting. It must not be re-applied to the SQL sub-translator
// every time a later.

////*PROCESS PPSQL('CCSID0');
////*PROCESS PP(MACRO SQL);

verify.noDiagnostics();
verify.expectCompilerOptions({
  sqlOptions: {
    ccsid0: true,
  },
});
