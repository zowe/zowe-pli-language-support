/// <reference path="../framework.ts" />

/**
 * DO TYPE 3 links to proper var
 */

// @wrap: main
//// DCL <|I:I> FIXED;
//// DO <|I>I = 0 TO 10;
////   PUT(<|I>I);
//// END;

linker.expectLinks();
