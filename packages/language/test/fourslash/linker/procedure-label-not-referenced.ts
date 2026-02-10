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

//// <|name2|>: procedure;
//// end <|name2>name2;
//// <|name1|>: procedure;
//// end;

linker.expectLinks();
verify.expectErrorCodesAt("name2", code.Warning.IBM1213I);
verify.expectErrorCodesAt("name1", code.Warning.IBM1213I);
