/// <reference path="../framework.ts" />

//// DCL 1 A, 2 B, 3 C, 4 D char(10);
//// DCL X char(10);
//// X = <|1>A.<|2>B.<|3>C.<|4>D;

completion.expectExclusiveAt(1, ["A", "B", "C", "D", "X"]);
completion.expectExclusiveAt(2, ["B", "C", "D"]);
completion.expectExclusiveAt(3, ["C", "D"]);
completion.expectExclusiveAt(4, ["D"]);
