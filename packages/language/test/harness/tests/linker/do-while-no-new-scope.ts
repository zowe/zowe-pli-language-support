/// <reference path="../framework.ts" />

/**
 * DO WHILE does not create a new scope
 */
// @wrap: main
//// PUT(<|a>A);
//// DO WHILE (<|a>A < 5);
////  PUT(<|a>A);
////  DCL <|a:A|> BIN FIXED(15) INIT(0);
////  <|proc:MYPROC|>: PROCEDURE;
////  END <|proc>MYPROC;
//// END;
//// PUT(<|a>A);
//// CALL <|proc>MYPROC;

linker.expectLinks();
