/// <reference path="../framework.ts" />

/**
 Redeclaration within nested sublevels must fail
 */
// @wrap: main
//// DCL 1 A,
////       2 B,
////         3 C CHAR(8) VALUE("C"),
////       2 <|1:B|>,
////         3 D CHAR(8) VALUE("D");

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1308I.fullCode);
