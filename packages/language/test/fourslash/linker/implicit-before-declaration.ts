/// <reference path="../framework.ts" />

/**
 Must work before declaration
 */
// @wrap: main
//// PUT(<|a>A);
//// <|a>A = "A2";
//// DCL <|a:A|> CHAR(8) INIT("A");
//// PUT(<|a>A);

linker.expectLinks();
