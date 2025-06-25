/// <reference path="../framework.ts" />

// @wrap: main
//// <|1:A|> = 123;
//// PUT(<|1>A);

verify.noDiagnostics();
linker.expectLinks();
