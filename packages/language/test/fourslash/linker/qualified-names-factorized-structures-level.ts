/// <reference path="../framework.ts" />

/**
 Factorized names in structures are correctly unrolled with level embedded
 */
// @wrap: main
//// DCL 1 A, (2 <|1:B|>);
//// PUT(A.<|1>B);

linker.expectLinks();
