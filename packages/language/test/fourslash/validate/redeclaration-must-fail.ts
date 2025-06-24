/// <reference path="../framework.ts" />

/**
 Redeclaration must fail
 */
// @wrap: main
//// DCL A CHAR(8) INIT("A");
//// DCL <|1:A|> CHAR(8) INIT("A2");

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1306I.fullCode);
