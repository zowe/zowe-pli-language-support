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

////*PROCESS <|1>;
////*PROCESS AGGREGATE <|2>;
////*PROCESS MAR<|3>;
////*PROCESS AGGREGATE,<|4>;

// ';' is offered as a directive terminator when no partial name is being
// typed and there is no dangling comma.
completion.expectAt(1, { includes: [";"] });
completion.expectAt(2, { includes: [";"] });

// ';' is NOT offered while a partial option name is being typed.
completion.expectAt(3, { excludes: [";"] });

// ';' is NOT offered right after a trailing comma.
completion.expectAt(4, { excludes: [";"] });
