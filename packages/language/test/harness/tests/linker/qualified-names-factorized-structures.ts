/// <reference path="../framework.ts" />

/**
 Factorized names in structures are correctly unrolled
 */
// @wrap: main
//// DCL 1 A, 2 (B, C, <|1:D|>), 3 <|2:E|>;
//// PUT(A.<|1>D.<|2>E);
//// PUT(<|1>D.<|2>E);

linker.expectLinks();
