/// <reference path="../framework.ts" />

// @wrap: main
//// <|1:A|>, <|2:B|> = 123;
//// PUT(<|1>A);
//// PUT(<|2>B);

verify.noDiagnostics();
linker.expectLinks();
