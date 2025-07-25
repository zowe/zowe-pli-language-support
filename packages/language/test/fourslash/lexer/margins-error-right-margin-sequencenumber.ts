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

/// <reference path="../framework.ts" />

// @filename: main.pli
////*PROCESS MARGINS(2,38)
//// RGT005: PACKAGE EXPORTS(RGT005);
////   DCL SYSNULL BUILTIN;
////   RGT005: PROCEDURE(Z) OPTIONS(MAIN); <|1:CAL00080|>
////     DCL  Z      CHAR(32);
////     DCL  X      CHAR(32);
////     X = Z;
////     PUT SKIP LIST(X);
////   END RGT005;
//// END RGT005;

verify.noDiagnostics(1);
