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

// The parser could think that the last parenthesis in the IF statement
// is the start of a repeated expression, but it is actually the end of the IF condition.
// This asserts that the parser completes without errors

// @wrap: main
//// IF F<1|F>32760|T<0|T>32760|(T<F&T>0) THEN DO; END;

verify.noParserDiagnostics();
