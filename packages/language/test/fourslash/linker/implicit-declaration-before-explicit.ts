/// <reference path="../framework.ts" />

// @wrap: main
//// <|1>C = 1;
//// DCL <|1:C|> FIXED(15) INIT(0);
//// PUT(<|1>C);

verify.noDiagnostics();
linker.expectLinks();
