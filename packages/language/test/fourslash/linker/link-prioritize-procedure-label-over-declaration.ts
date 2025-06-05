/// <reference path="../framework.ts" />

/**
 * Must link to procedure label before declaration
 */

// @wrap: main
//// CALL <|1>OUTER;
////
//// <|1:OUTER|>: PROCEDURE;
////  PUT("INSIDE");
//// END <|1>OUTER;
////
//// CALL <|1>OUTER;

linker.expectLinks();
