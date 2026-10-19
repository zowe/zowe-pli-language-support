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

//// MAIN: PROC OPTIONS(MAIN);
////   PUT("HELLO WORLD"); <|comment:// single line comment|>
////   <|comment:/* multi line comment start|>
////<|comment: multi line comment content|>
////<|comment: multi line comment end */|>
////   PUT("GOODBYE WORLD");
//// END MAIN;
//// <|comment:// another single line comment at EOF|>

semanticTokens.expectAt("comment");
