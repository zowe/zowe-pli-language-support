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
//// <|1:A|>.<|2:B|> = 1;

verify.expectExclusiveDiagnosticsAt("1", {
  severity: constants.Severity.E,
  message: "Unknown identifier 'A'",
});

verify.expectExclusiveDiagnosticsAt("2", {
  severity: constants.Severity.E,
  message: "Unknown identifier 'B'",
});
