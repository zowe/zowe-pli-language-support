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

// @filename: pli-builtin:///xxx.pli
//// /**
////  * XXX Description
////  */
//// %XXX: PROC(A, B);
////   DECLARE A CHARACTER;
////   DECLARE B CHARACTER;
//// %END;
//// /**
////  * YYY Description
////  */
//// %YYY: PROC(A, B);
////   DECLARE A CHARACTER;
////   DECLARE B CHARACTER;
//// %END;
//// %YYY: PROC;
////   CALL XXX(<|x0>"hallo", <|x1>YYY(<|y0>"abc", <|y1>1));
//// %END;

signatureHelp.expectMarkdownSignatureAt("x0", `XXX Description`);
signatureHelp.expectParameterIndexAt("x0", 0);
signatureHelp.expectParameterIndexAt("x1", 1);

signatureHelp.expectMarkdownSignatureAt("y0", `YYY Description`);
signatureHelp.expectParameterIndexAt("y0", 0);
signatureHelp.expectParameterIndexAt("y1", 1);
