/// <reference path="../framework.ts" />

/**
 Declaration must override implicit qualification
 */
// @wrap: main
//// DCL 1 <|1:A|>,
////     2 <|2:B|> CHAR(8) VALUE("B");
//// DCL <|3:B|> CHAR(8) VALUE("B2");
//// PUT(<|3>B);
//// PUT(<|1>A.<|2>B);

linker.expectLinks();
