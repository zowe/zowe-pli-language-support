/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../../../framework.ts" />

// @wrap: process
////*PROCESS PP(MACRO("<|1:ID|>"));
////*PROCESS PP(MACRO("ID(<|2:)|>"));
////*PROCESS PP(MACRO("ID(<|3:OLD1|>)"));
////*PROCESS PP(MACRO("ID(<|4:'++INCLUDE'|>)"));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1, 1),
});
verify.expectDiagnosticsAt([2, 3], {
  message: code.CompilerOptions.ExpectedString.message(),
});
verify.noDiagnostics(4);

verify.expectCompilerOptions({
  macroOptions: {
    id: "++INCLUDE",
  },
});
