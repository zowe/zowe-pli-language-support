/// <reference path="../framework.ts" />

//// DCL A char(10);
//// DCL B char(10);
//// DCL C char(10);
//// A = <|1>123;

completion.expectExclusiveAt(1, ["A", "B", "C"]);
