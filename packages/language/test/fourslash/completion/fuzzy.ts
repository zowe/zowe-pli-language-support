/// <reference path="../framework.ts" />

//// DCL 1 ROOT, 2 firstCompletionValue;
//// PUT(ROOT.fcv<|1>); // should propose "firstCompletionValue"

completion.expectAt(1, { includes: ["firstCompletionValue"] });
