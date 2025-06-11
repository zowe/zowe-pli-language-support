/// <reference path="../framework.ts" />

//// DCL 1 A, 2 B, 3 C, 4 D char(10);
//// DCL X char(10);
//// X = <|1>C.<|2>D;

completion.expectAt(1, ["A", "B", "C", "D", "X"]);
completion.expectAt(2, ["D"]);
