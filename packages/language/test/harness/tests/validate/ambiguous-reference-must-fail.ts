/// <reference path="../framework.ts" />

/**
 * Ambiguous reference must fail
 */

// @wrap: main
//// DCL 1 A1,
////     2 B CHAR(8) VALUE("B1");
//// DCL 1 A2,
////     2 B CHAR(8) VALUE("B2");
//// PUT(<|1:B|>);

verify.expectExclusiveErrorCodesAt("1", code.Severe.IBM1881I.fullCode);
