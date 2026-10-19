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

//// DEFINE ORDINAL COLOR (RED, GREEN, BLUE);
//// DCL <|1>BACKGROUND ORDINAL COLOR;

//TODO make ordinals work by presenting members of the enum
hover.expectMarkdownAt(1, hover.codeBlock("DCL BACKGROUND ORDINAL COLOR;"));
