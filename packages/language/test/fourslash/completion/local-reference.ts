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

/// <reference path="../framework.ts" />

//// DCL A char(10);
//// DCL B char(10);
//// DCL C char(10);
//// A = <|1>123;

completion.expectAt(1, { includes: ["A", "B", "C"] });
