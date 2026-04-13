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

//// %DCL A CHARACTER;
//// %A = TRIM<|0>(<|1>"  hallo ", <|2>" ");

signatureHelp.expectParameterIndexAt("0", 0);
signatureHelp.expectParameterIndexAt("1", 0);
signatureHelp.expectParameterIndexAt("2", 1);
