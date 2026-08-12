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

// A disallowed `SQL TYPE IS XML AS <type>` raises IBM3783I and the consumed clause is
// blanked (matching the old instruction-based interpreter, which emitted nothing for an
// unrecognized body), so the real PL/I parser never sees the `SQL TYPE IS XML AS` text
// itself. Only the *unconsumed* invalid type name is left behind (also matching the old
// interpreter - it only dropped what `sqlAttributeStatement` consumed), so the full
// diagnostic set is exactly: IBM3783I plus one parser diagnostic on that leftover name.

//// TEST: PROC;
////   DCL TEST_SQL1 SQL TYPE IS XML AS <|1:BLOB_LOCATOR|>;
////   DCL TEST_SQL2 SQL TYPE IS XML AS <|2:ROWID|>;
//// END;

verify.expectDiagnosticsAt(1, code.Severe.IBM3783I);
verify.expectDiagnosticsAt(2, code.Severe.IBM3783I);
verify.noDiagnosticsExcept([
  /IBM3783I/,
  // The leftover (never consumed) invalid type name - NOT the blanked clause: a
  // diagnostic mentioning "SQL"/"TYPE"/"IS"/"AS" here would mean the clause leaked
  // through to the real parser again.
  /Expected token ";", but received "BLOB_LOCATOR" instead/,
  /Expected token ";", but received "ROWID" instead/,
]);
