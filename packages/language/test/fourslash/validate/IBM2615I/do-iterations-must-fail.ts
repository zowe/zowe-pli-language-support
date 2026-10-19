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

/**
 * DO iteration with single assignment spec should trigger IBM2615I
 */

// @wrap: main
//// <|1:DO|>
////   X = 3;
////   Y = 4;
//// END;

verify.expectExclusiveErrorCodesAt(1, code.Warning.IBM2615I);
