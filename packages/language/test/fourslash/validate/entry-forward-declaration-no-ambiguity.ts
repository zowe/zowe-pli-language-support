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

/// <reference path="../framework.ts" />

// @wrap: main
//// DCL TEST_PROC ENTRY();
//// TEST_PROC: PROC;
////   PUT("HELLO WORLD");
//// END TEST_PROC;
//// CALL <|TEST_PROC|>();

// This file contains the `TEST_PROC` definition twice.
// Once as a forward declaration with the ENTRY attribute, and once as a procedure definition.
// The validator should not produce an ambiguity error when resolving the TEST_PROC reference.
verify.noDiagnostics(["TEST_PROC"], code.Severe.IBM1881I);
