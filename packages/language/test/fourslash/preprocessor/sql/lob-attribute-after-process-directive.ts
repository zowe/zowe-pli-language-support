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

// The SQL_LOB* block is inserted at offset 0 of the SQL phase's input - a file starting
// with a *PROCESS directive (consumed before the phases run) must not be disturbed by it.

////*PROCESS PP(SQL);
//// TEST: PROC;
////   DCL TEST_SQL SQL TYPE IS BLOB(10);
//// END;

verify.noDiagnostics();
preprocessor.containsTokens(["SQL_LOB10", "BASED", "LIKE"]);
