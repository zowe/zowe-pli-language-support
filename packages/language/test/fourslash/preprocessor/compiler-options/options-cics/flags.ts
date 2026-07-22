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
////*PROCESS PP(CICS("NODEBUG"));
////*PROCESS PP(CICS("NOEDF"));
////*PROCESS PP(CICS("NOLENGTH"));
////*PROCESS PP(CICS("NOOPTIONS"));
////*PROCESS PP(CICS("NOSOURCE"));
////*PROCESS PP(CICS("NOSPIE"));
////*PROCESS PP(CICS("XREF"));

verify.noDiagnostics();

verify.expectCompilerOptions({
  cicsOptions: {
    debug: false,
    edf: false,
    length: false,
    options: false,
    source: false,
    spie: false,
    vbref: true,
  },
});
