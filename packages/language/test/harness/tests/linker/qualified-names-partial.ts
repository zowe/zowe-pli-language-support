/// <reference path="../framework.ts" />

/**
 Must infer partially qualified names
 */
// @wrap: main
//// DCL 1 A,
////        2 <|b1:B|>,
////          3 K, // Should be skipped in qualification
////            4 <|c:C|> CHAR(8) VALUE("C");
//// DCL 1 A2,
////        2 <|b2:B|>,
////          3 K, // Should be skipped in qualification
////            4 <|d:D|> CHAR(8) VALUE("D");
//// PUT (<|b1>B.<|c>C);
//// PUT (<|b2>B.<|d>D);

linker.expectLinks();
