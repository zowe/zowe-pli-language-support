/// <reference path="../framework.ts" />

/**
 * Must handle use before declaration
 */

// @wrap: main
//// DCL <|1:A|> CHAR(8) INIT("A");
//// PUT(<|1>A); // -> "A"
////
//// LABL: PROCEDURE;
////   PUT(<|2>A); // -> "A2"
////   DCL <|2:A|> CHAR(8) INIT("A2");
////   PUT(<|2>A); // -> "A2"
//// END LABL;
////
//// PUT(<|1>A); // -> "A"
//// CALL LABL;
//// PUT(<|1>A); // -> "A"

linker.expectLinks();
