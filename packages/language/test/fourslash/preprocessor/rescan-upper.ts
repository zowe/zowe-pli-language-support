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

// Example from pg, p. 120.

////*PROCESS PP(MACRO('RESCAN(UPPER)'));
////
//// %dcl eins char ext;
//// %dcl text char ext;
////
//// %eins = 'zwei';
//// %text = 'EINS';
//// display( text );
////
//// %text = 'eins';
//// display( text );

preprocessor.expectTokens(`
  display( zwei );
  display( zwei );
`);
