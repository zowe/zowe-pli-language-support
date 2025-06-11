/// <reference path="../framework.ts" />

/**
 * Must link on included files
 */

// @filename: include.pli
//// DCL <|1:X|> FIXED;

// @filename: include2.pli
//// DCL <|2:Y|> FIXED;

// @filename: main.pli
//// %INCLUDE "include.pli";
//// %INCLUDE "include2.pli";
//// <|1>X = 42;
//// <|2>Y = 43;

linker.expectLinks();
