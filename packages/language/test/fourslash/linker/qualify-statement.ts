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

// Names declared in a QUALIFY block are qualified by the block label.

// @wrap: main
//// <|PAINT|>: QUALIFY;
////   DEFINE ORDINAL <|COLOR|> (<|RED|>, ORANGE);
////   <|DEPTH|>: QUALIFY;
////     DEFINE ORDINAL <|INTENSITY|> (<|HIGH|>, LOW);
////   END <|DEPTH>DEPTH;
//// END <|PAINT>PAINT;
//// DCL A TYPE <|PAINT>PAINT.<|COLOR>COLOR;
//// DCL B TYPE <|PAINT>PAINT.<|DEPTH>DEPTH.<|INTENSITY>INTENSITY;
//// A = <|PAINT>PAINT.<|RED>RED;
//// B = <|PAINT>PAINT.<|DEPTH>DEPTH.<|HIGH>HIGH;

linker.expectLinks();
verify.noDiagnostics();
