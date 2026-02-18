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
////*PROCESS DEFAULT(DUMMY(<|1:ALIGNED|>));
////*PROCESS DEFAULT(E(<|1:HEXADEC|>));
////*PROCESS DEFAULT(LINKAGE(<|1:OPTLINK|>));
////*PROCESS DEFAULT(NULLSTRPTR(<|1:NULL|>));
////*PROCESS DEFAULT(ORDINAL(<|1:MIN|>));
////*PROCESS DEFAULT(RETURNS(<|1:BYADDR|>));
////*PROCESS DEFAULT(SHORT(<|1:HEXADEC|>));

verify.noDiagnostics(1);
verify.expectCompilerOptions({
  default: {
    dummy: { aligned: true },
    e: { format: constants.CompilerOptions.DefaultFormat.HEXADEC },
    linkage: { type: constants.CompilerOptions.DefaultLinkageType.OPTLINK },
    nullStrPtr: {
      type: constants.CompilerOptions.DefaultNullStrPtrType.NULL,
    },
    ordinal: { type: constants.CompilerOptions.DefaultOrdinalType.MIN },
    returns: { type: constants.CompilerOptions.DefaultReturnsType.BYADDR },
    short: { format: constants.CompilerOptions.DefaultFormat.HEXADEC },
  },
});
