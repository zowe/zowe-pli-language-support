/// <reference path="../framework.ts" />

// @wrap: main
//// <|1>C = 1;
//// PUT(<|1>C);
//// DCL <|1:C|> FIXED(15) INIT(0);

verify.noDiagnostics();
linker.expectLinks();
