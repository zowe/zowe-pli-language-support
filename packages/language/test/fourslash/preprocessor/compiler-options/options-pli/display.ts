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

/// <reference path="../../../framework.ts" />

// @wrap: process
////*PROCESS DISPLAY(<|1:INVALID|>);
////*PROCESS <|DISPLAY|>(<|OK:STD|>);
////*PROCESS <|DISPLAY|>(<|OK:WTO(DESC(4,5))|>);
////*PROCESS <|DISPLAY|>(<|OK:WTO(REPLY(6))|>);
////*PROCESS <|DISPLAY|>(<|OK:WTO(ROUTCDE(1,2,3))|>);
////*PROCESS <|DISPLAY|>(<|OK:WTO(ROUTCDE(1,2),DESC(7,8),REPLY(9))|>);

verify.expectDiagnosticsAt(["DISPLAY"], {
  message: code.CompilerOptions.DupeOptionIssue.message("DISPLAY"),
});
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.Display.InvalidSTDParameter.message("INVALID"),
});
verify.noDiagnostics(["OK"]);
verify.expectCompilerOptions({
  display: {
    wto: true,
    routcde: ["1", "2"],
    desc: ["7", "8"],
    reply: ["9"],
  },
});
