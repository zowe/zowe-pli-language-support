/// <reference path="../framework.ts" />

/**
 Full qualification should take precedence over partial qualification
 */
// @wrap: main
//// DCL 1 A,
////        2 B,
////          3 C,
////        2 <|1:C|>;
//// PUT(A.<|1>C);

linker.expectLinks();
