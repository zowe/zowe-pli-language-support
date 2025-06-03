/// <reference path="../framework.ts" />

/**
 Must qualify implicitly in structure
 */
// @wrap: main
//// DCL 1 <|1:A|>,
////     2 <|2:B|> CHAR(8) VALUE("B");
//// PUT(<|2>B);
//// PUT(<|1>A.<|2>B);

linker.expectLinks();
