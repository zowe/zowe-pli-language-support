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

////*PROCESS <|1>;
////*PROCESS OPT<|2>;

completion.expectAt(1, {
  includes: ["AGGREGATE", "NOAGGREGATE", "OPTIMIZE", "LIST"],
  excludes: ["AG"], // short alias not in canonical list
});

completion.expectAt(2, {
  includes: ["OPTIMIZE"],
  excludes: ["AGGREGATE"],
});
