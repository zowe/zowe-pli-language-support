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

// @wrap: main
//// %DCL ANYTHING <|1:CHARACTER|>(123);

// In the preprocessor a dimension is not allowed on CHARACTER, so this should be an error
verify.expectDiagnosticsAt("1", code.Error.IBM3552I);
