/// <reference path="../framework.ts" />

//// DCL A;
//// X = <|1>

completion.expectAt(1, {
  includes: ["A"],
});
