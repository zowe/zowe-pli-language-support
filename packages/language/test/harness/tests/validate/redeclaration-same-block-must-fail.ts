/// <reference path="../framework.ts" />

/**
 Redeclaration within the same block must fail
 */
// @wrap: main
//// DCL A CHAR(8) INIT("A"), <|1:A|> CHAR(8) INIT("B");

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1306I.fullCode);
