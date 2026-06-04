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
//// DEFINE ALIAS llst_remover ENTRY(PTR INONLY) VARIABLE LIMITED;
//// DEFINE STRUCTURE
////   1 llst,
////     3 head PTR ,
////     3 remove_el TYPE llst_remover;
//// DEFINE STRUCTURE
////  1 llst_el,
////    3 next PTR ,
////    3 prev PTR ,
////    3 el_data PTR;
//// DCL (llst_p, el_p) PTR;
//// DCL el TYPE llst_el BASED(el_p);
//// DCL llst TYPE llst BASED (llst_p);
//// CALL llst.remove_el(el.el_data);

verify.noParserDiagnostics();
verify.noLinkingDiagnostics();
