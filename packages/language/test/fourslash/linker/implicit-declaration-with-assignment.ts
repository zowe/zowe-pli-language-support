/// <reference path="../framework.ts" />

// @wrap: main
//// DCL 1 A, 2 C BIN FIXED(15) INIT(0);
//// A.C, <|1:B|> = 1;
//// PUT(<|1>B);

verify.noDiagnostics();
linker.expectLinks();
