/// <reference path="../framework.ts" />

/**
 * A nested assignment should not be handled as an implicit declaration if there are explicit declarations in the scope.
 */

// @wrap: main
//// DCL 1 <|1:A|> CHAR(10) VALUE("123");
//// MY_PROC: PROC;
////   <|1>A = 123;
////   PUT(<|1>A);
//// END MY_PROC;
//// CALL MY_PROC; // Avoid unused label warning
//// PUT(<|1>A);

verify.noDiagnostics();
linker.expectLinks();
