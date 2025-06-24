/// <reference path="../framework.ts" />

/**
 * Must handle scoping in procedures
 */

// @wrap: main
//// DCL <|1:ABC|>;
//// CALL <|1>ABC;
////
//// OUTER: PROCEDURE;
////  DCL <|2:ABC|>;
////  CALL <|2>ABC;
//// END OUTER;
////
//// DCL ABC;
//// CALL <|1>ABC;

linker.expectLinks();
