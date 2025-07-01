/// <reference path="../framework.ts" />

/**
 * DO TYPE 3 links to proper var
 */

// @wrap: main
//// DCL <|1:I|> FIXED;
//// DO <|1>I = 0 TO 10;
////   PUT(<|1>I);
//// END;

linker.expectLinks();
