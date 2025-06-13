/// <reference path="../framework.ts" />

//// DCL firstCompletionValue;
//// DCL secondCompletionValue;
//// PUT(firstCompletionValue, <|1>);

completion.expectAt(1, { includes: ["secondCompletionValue"] });
