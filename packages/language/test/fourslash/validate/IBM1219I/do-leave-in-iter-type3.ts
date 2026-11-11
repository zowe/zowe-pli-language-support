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

/// <reference path="../../framework.ts" />

/**
 * LEAVE inside iterative DO (TO/BY) – should NOT trigger IBM1219I
 */

// @wrap: main
//// DCL I FIXED BIN(31);
//// DO I = 1 TO 10;
////   <|1:LEAVE|>;
//// END;

verify.noDiagnostics(1);
