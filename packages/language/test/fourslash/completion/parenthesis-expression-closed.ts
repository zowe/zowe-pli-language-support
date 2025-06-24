/// <reference path="../framework.ts" />

//// DCL 1 A, 2 B;
//// PUT(<|1>)

completion.expectAt(1, { includes: ["A", "B"] });
