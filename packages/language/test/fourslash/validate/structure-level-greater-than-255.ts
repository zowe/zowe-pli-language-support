/// <reference path="../framework.ts" />

/**
 Structure level greater than 255 is invalid
 */
// @wrap: main
//// DCL 1 A,
////       <|a:256|> B;

verify.expectExclusiveErrorCodesAt("a", code.Error.IBM1363I.fullCode);
