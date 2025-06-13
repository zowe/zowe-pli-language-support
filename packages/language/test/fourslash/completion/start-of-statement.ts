/// <reference path="../framework.ts" />

//// DCL 1 A, 2 B, 3 C, 4 D char(10);
//// <|1>

completion.expectAt(1, {
  includes: [
    "A",
    "B",
    "C",
    "D",
    ...constants.CompletionKeywords.StatementStart.values().map(
      (keyword) => keyword.label,
    ),
    ...constants.CompletionKeywords.StatementStartPreprocessor.values().map(
      (keyword) => keyword.label,
    ),
  ],
});
