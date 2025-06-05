/// <reference path="../framework.ts" />

/**
 Repeated declaration of label is invalid (variable label first)
 */
// @wrap: main
//// DCL <|1:A|> CHAR(8) INIT("A");
//// A: PROCEDURE;
//// END A;

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1306I.fullCode);
