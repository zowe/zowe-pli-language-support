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

//// %TEST: PROC (I) RETURNS (FIXED);
////   DCL I FIXED;
////   SELECT (I);
////     WHEN (10) RETURN ("1");
////     WHEN (20) RETURN ("2");
////     OTHERWISE RETURN ("OTHER");
////   END;
//// %END;
//// %DCL X FIXED;
//// %X = TEST(20);
//// X

preprocessor.expectTokens("2");
