/// <reference path="../framework.ts" />

//// DCL A;
//// DCL B;
//// X = A + <|1>

completion.expectAt(1, {
  includes: ["A", "B"],
});
