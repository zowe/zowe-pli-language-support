/// <reference path="../framework.ts" />

/**
 Repeated declaration of label is invalid (procedure label first)
 */
// @wrap: main
//// A: PROCEDURE;
//// END A;
//// DCL <|1:A|> CHAR(8) INIT("A");

verify.expectExclusiveErrorCodesAt("1", code.Error.IBM1306I.fullCode);
