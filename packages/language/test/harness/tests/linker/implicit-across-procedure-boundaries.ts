/// <reference path="../framework.ts" />

/**
 Must work across procedure boundaries
 */
// @wrap: main
//// PUT(<|a>A);
////
//// LABL: PROCEDURE;
////   PUT(<|a>A);
//// END LABL;
////
//// PUT(<|a>A);
//// CALL LABL;
////
//// DCL <|a:A|> CHAR(8) INIT("A");

linker.expectLinks();
