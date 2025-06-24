/// <reference path="../framework.ts" />

/**
 * Must handle use before declaration (variant)
 */

// @wrap: main
//// PUT(<|1>A);
//// DCL <|1:A|> CHAR(8) INIT("A");
//// PUT(<|1>A);

linker.expectLinks();
