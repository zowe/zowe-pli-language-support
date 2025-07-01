/// <reference path="../framework.ts" />

// @filename: cpy/include.pli
//// DCL <|1:A|> FIXED;

// @filename: cpy/include2.pli
//// A = 123;

// @wrap: main
//// %INCLUDE "include.pli";
//// %INCLUDE "include2.pli";
//// <|1>A = 123;
//// PUT(<|1>A);

verify.noDiagnostics();
linker.expectLinks();
