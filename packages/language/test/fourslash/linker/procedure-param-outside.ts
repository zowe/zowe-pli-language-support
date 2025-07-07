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

//// DECLARE PARAM VARYING CHAR(100);
//// PLEA: PROCEDURE(<|1><|2:PARAM|>);
////   PUT(<|2>PARAM);
//// END PLEA;

linker.expectLinks();
linker.expectNoLinksAt(1);
