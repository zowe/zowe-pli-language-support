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

//// DCL <|array:ANYTHING|>(<|num:20.51234|>) FIXED BIN;

verify.noDiagnostics('num');
types.expectTypeAt("array", {
    base: types.bases.Binary,
    scale: types.scales.Fixed,
    dimension: [{
        upperBound: {
            value: 20,
        },
        lowerBound: {
            /**
             * @see https://www.ibm.com/docs/en/epfz/6.2.0?topic=arrays-dimension-attribute
             * If only the upper bound is given, the lower bound defaults to 1.
             */
            value: 1,
        },
    }],
});