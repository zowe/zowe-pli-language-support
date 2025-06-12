/// <reference path="../framework.ts" />

//// DCL 1 A, 2 B, 3 C, 4 D char(10);
//// <|1>

completion.expectAt(1, {
  includes: [
    ...constants.StatementStartCompletionKeywords.values().map(
      (keyword) => keyword.label,
    ),
    ...constants.StatementStartPreprocessorCompletionKeywords.values().map(
      (keyword) => keyword.label,
    ),
  ],
});
