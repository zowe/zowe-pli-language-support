/// <reference path="../framework.ts" />

/**
 * Must ignore redeclarations
 */

// @wrap: main
//// DCL <|1:ABC|>;
//// CALL <|1>ABC;
//// DCL ABC;
//// CALL <|1>ABC;

linker.expectLinks();
