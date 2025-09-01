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

/**
 * DO with single assignment and no iteration spec – should trigger IBM2615I
 */
// @wrap: main
//// <|1:DO|> I = 5;
////   CALL F;
//// END;

verify.expectExclusiveErrorCodesAt(1, code.Warning.IBM2615I.fullCode);
