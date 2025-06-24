/// <reference path="../framework.ts" />

// @filename: file:///include.pli
//// DCL <|1:Y|> FIXED;

// @filename: file:///main.pli
//// %INCLUDE "./include.pli";
//// <|1>Y = 42;

linker.expectLinks();
