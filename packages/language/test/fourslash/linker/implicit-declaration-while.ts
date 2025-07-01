/// <reference path="../framework.ts" />

// @wrap: main
//// DO <|i:I|> = 1 TO 300 BY 100;
////   PUT(<|i><|i_usage:I|>);
//// END;

verify.expectExclusiveErrorCodesAt("i", code.Error.IBM1373I.fullCode);
verify.noDiagnostics("i_usage");
linker.expectLinks();
