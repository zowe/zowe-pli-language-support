/// <reference path="../framework.ts" />

//// DCL 1 A, 2 firstCompletionValue;
//// PUT(f<|1>);

completion.expectAt(1, { includes: ["firstCompletionValue"] });
