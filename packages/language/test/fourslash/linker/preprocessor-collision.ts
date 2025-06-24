/// <reference path="../framework.ts" />

/**
 Must link correctly when collision with preprocessor variables
 */
// @wrap: main
//// %DECLARE ABC CHARACTER;
//// %ABC = 'PAY_ROLL';
//// %DEACTIVATE ABC;
//// DCL <|1:ABC|> CHAR(8) VALUE("PAYROLL");
//// PUT(<|1>ABC);

linker.expectLinks();
