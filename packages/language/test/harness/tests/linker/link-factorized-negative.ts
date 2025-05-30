/// <reference path="../framework.ts" />

// @wrap: main
//// DCL 1 A, 2 (B, C, D), 3 <|def3:E|>;
//// PUT(A.B.<|1>E);
//// PUT(A.C.<|2>E);
//// PUT(A.D.<|def3>E);

linker.expectLinks();
linker.expectNoLinksAt("1");
linker.expectNoLinksAt("2");
