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

//// DCL 1 A, 2 B, 3 C, 4 D char(10);
//// DCL X char(10);
//// X = <|1>A.<|2>B.<|3>C.<|4>D;

completion.expectAt(1, { includes: ["A", "B", "C", "D", "X"] });
completion.expectAt(2, { includes: ["B", "C", "D"] });
completion.expectAt(3, { includes: ["C", "D"] });
completion.expectAt(4, { includes: ["D"] });
