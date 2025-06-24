/// <reference path="../framework.ts" />

/**
 Fully qualified name precedes star name
 */
// @wrap: main
//// DCL 1 A,
////        2 *,
////          3 B CHAR(8) VALUE("B"),
////        2 <|b:B|> CHAR(8) VALUE("B2");
//// PUT(A.<|b>B);

linker.expectLinks();
