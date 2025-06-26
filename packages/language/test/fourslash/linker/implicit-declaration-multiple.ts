/// <reference path="../framework.ts" />

// @wrap: main
//// <|1:A|>, <|2:B|> = 123;
//// PUT(<|1>A);
//// PUT(<|2>B);

verify.expectExclusiveErrorCodesAt(1, code.Error.IBM1373I.fullCode);
verify.expectExclusiveErrorCodesAt(2, code.Error.IBM1373I.fullCode);
linker.expectLinks();
