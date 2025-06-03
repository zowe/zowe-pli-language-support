/// <reference path="../framework.ts" />

/**
 Star name in structure should result in partial qualification
 */
// @wrap: main
//// DCL 1 A,
////       2 *,
////         3 <|b:B|> CHAR(8) VALUE("B");
//// PUT(A.<|b>B);

linker.expectLinks();
