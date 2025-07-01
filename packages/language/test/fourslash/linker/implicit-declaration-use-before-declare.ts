/// <reference path="../framework.ts" />

// @wrap: main
//// PUT(<|1><|2:A|>);
//// <|1:A|> = 123;

verify.expectExclusiveErrorCodesAt(2, code.Warning.IBM1085I.fullCode);
linker.expectLinks();
