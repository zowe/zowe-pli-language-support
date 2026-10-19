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

//// MAIN: PROC;
////   DECLARE 1 <|TEST1|>, 2 <|TEST2|> FIXED;
////   EXEC SQL SELECT * FROM employees WHERE department_id = :<|TEST1>TEST1.<|TEST2>TEST2;
//// END;

linker.expectLinks();
