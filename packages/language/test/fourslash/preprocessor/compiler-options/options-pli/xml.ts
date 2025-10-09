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
////*PROCESS <|1:XML|>;
////*PROCESS <|d2:XML|>();
////*PROCESS <|d3:XML|>(<|2:INVALID|>);
////*PROCESS <|d3:XML|>(<|3:INVALID|>());
////*PROCESS <|d4:XML|>(CASE(<|4:INVALID|>));
////*PROCESS <|d5:XML|>(XMLATTR(<|5:INVALID|>));
////*PROCESS <|d6:XML|>(CASE(ASIS) XMLATTR(QUOTE));

verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(
  Array.from({ length: 5 }, (_, i) => `d${i + 2}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("XML"),
  },
);
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.ExpectedOption.message(),
});
verify.expectDiagnosticsAt(3, {
  message: code.CompilerOptions.Xml.InvalidParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(4, {
  message: code.CompilerOptions.Xml.InvalidCaseParameter.message("INVALID"),
});
verify.expectDiagnosticsAt(5, {
  message: code.CompilerOptions.Xml.InvalidXmlAttrParameter.message("INVALID"),
});
verify.expectCompilerOptions({
  xml: {
    case: "ASIS",
    xmlAttr: "QUOTE",
  },
});
