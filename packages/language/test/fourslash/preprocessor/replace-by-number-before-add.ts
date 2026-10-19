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

/// <reference path="../framework.ts" />

//// %REPLACE A BY 67;
//// %REPLACE B BY 34;
//// %NOTE('A+B = ', (A+B));

preprocessor.expectTokens("");
verify.noDiagnostics(undefined, code.LSP.UnknownIdentifier);
