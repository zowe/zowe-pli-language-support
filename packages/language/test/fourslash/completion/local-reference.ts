/// <reference path="../framework.ts" />

//// DCL A char(10);
//// DCL B char(10);
//// DCL C char(10);
//// A = <|1>123;

completion.expectAt(1, { includes: ["A", "B", "C"] });
