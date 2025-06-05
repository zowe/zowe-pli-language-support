/// <reference path="../framework.ts" />

/**
 * Must find declaration in SELECT/WHEN construct
 */

// @wrap: main
//// SELECT (123);
////    WHEN (123)
////    DO;
////        DCL <|1:BFSTRING|> CHAR(255);
////        PUT SKIP LIST(<|1>BFSTRING);
////    END;
//// END;

linker.expectLinks();
