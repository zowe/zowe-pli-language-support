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

// @filename: pli-builtin:///xxx.pli
//// XXX: PROCEDURE (X, Y, Z) RETURNS(FIXED);
////   DCL <|X|>(*) FIXED VARARG;
////   DCL <|Y|>(*) FIXED <|YArgs:VARARG|>;
////   DCL Z(*) FIXED <|ZArgs:VARARG|>;
////   RETURN(12);
//// END;

verify.expectDiagnosticsAt("X", code.Internal.VariadicParameterNotLast);
verify.expectDiagnosticsAt("Y", code.Internal.VariadicParameterNotLast);
verify.expectDiagnosticsAt("YArgs", code.Internal.VariadicParameterMultiple);
verify.expectDiagnosticsAt("ZArgs", code.Internal.VariadicParameterMultiple);
