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

//TODO @tag(#issue-656) Remove this file once all builtin procedures signatures are setup

// @filename: pli-builtin:///xxx.pli
//// DCL X(*) FIXED <|VARARG|>;

verify.expectDiagnosticsAt(
  "VARARG",
  code.LSP.BuiltinAttributes.VariadicParameter.IsNotAParameter,
);
