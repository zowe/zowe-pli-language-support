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

/**
 Must work in structured declaration
 */
// @wrap: main
//// DCL ARRAY_ENTRY;
//// DCL TWO_DIM_TABLE_ENTRY;
//// DCL TYPE#;
//// DCL 1  <|1:TWO_DIM_TABLE|>,
////        2  <|2:TWO_DIM_TABLE_ENTRY|>          CHAR(32);
//// DCL 1  TABLE_WITH_ARRAY,
////        2  ARRAY_ENTRY(0:1000),
////           3  NAME                          CHAR(32) VARYING,
////           3  <|3:TYPE#|>                     CHAR(8),
////        2  NON_ARRAY_ENTRY,
////           3  NAME                          CHAR(32) VARYING,
////           3  <|4:TYPE#|>                     CHAR(8);
//// DCL ARRAY_ENTRY;
//// DCL TWO_DIM_TABLE_ENTRY;
//// DCL TYPE#;
//// PUT (<|1>TWO_DIM_TABLE);
//// PUT (TWO_DIM_TABLE.<|2>TWO_DIM_TABLE_ENTRY);
//// PUT (TABLE_WITH_ARRAY.ARRAY_ENTRY(0).<|3>TYPE#);
//// PUT (TABLE_WITH_ARRAY.NON_ARRAY_ENTRY.<|4>TYPE#);

linker.expectLinks();
