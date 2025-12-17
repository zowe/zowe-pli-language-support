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
////%PROCESS F(I) AG A(F); /* XX */
////*PROCESS MARGINS(2,75);
////%PROCESS F(I) AG A(F);

verify.expectCompilerOptions({
  aggregate: constants.CompilerOptions.Aggregate.DECIMAL,
  attributes: constants.CompilerOptions.Length.FULL,
  flag: constants.CompilerOptions.Flag.I,
  margins: {
    m: 2,
    n: 75,
  },
});
