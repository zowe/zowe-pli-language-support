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

// @wrap: main
//// declare a fixed;
//// declare b(100) bit (1) aligned;
//// declare c bit (1) static initial ('0'b);
//// declare (d, e) fixed binary;
//// declare f character (200) varying;
//// declare (g, h) fixed (30);
//// declare i builtin;
//// declare j pointer;
//// declare k bin fixed(31) init(42);
//// declare l (8) bit(01) based(k);
//// declare (m,n,o) Bin Fixed(31) Init(0);
//// declare p complex float;
//// declare q fixed binary(31);
//// declare r(10) float initial (9, 4, 7, 3, 8, 11, 0, 5, 15, 6);
//// declare s OUTPUT SD(,,,4000);
//// declare t PIC'999-';
//// declare u UNSIGNED FIXED BIN(32) INIT(0);
//// declare 01 w,
////           03 x FIXED BIN(15),
////           03 y,
////              05 z CHAR(4),
////              05 * CHAR(1),
////              05 a2 CHAR(5),
////              05 * CHAR(90);
//// declare b2 POINTER INIT(SYSNULL());
//// declare c2 (*, *) controlled bit (24) aligned;
//// declare d2 ENTRY();
//// declare e2 ptr inOnly nonAsgn byValue;
//// declare f2 char(80) inOnly nonAsgn byAddr;
//// declare g2 ptr inOnly nonAsgn byValue;
//// declare h2 type g2 outOnly asgn byAddr;
//// declare (i2, j2, k2) FIXED BINARY (15),
////         l2 FIXED BINARY (31),
////         (m2, n2) UNSIGNED FIXED BINARY(8);

verify.noDiagnostics(undefined, ...code.TypeSystem);
