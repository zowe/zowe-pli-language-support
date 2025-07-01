/// <reference path="../framework.ts" />

// @wrap: main
//// <|1:A|> = 123;
//// PUT(<|1>A);
//// PUT(<|1>A);

verify.expectExclusiveErrorCodesAt(1, code.Error.IBM1373I.fullCode);
linker.expectLinks();
