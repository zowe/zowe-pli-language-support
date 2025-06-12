/// <reference path="../framework.ts" />

//// DCL 1 A, 2 B, 3 C, 4 D char(10);
//// <|1>

completion.expectAt(1, [
  ...constants.CompletionKeywords.values().map((keyword) => keyword.label),
  ...constants.PreprocessorCompletionKeywords.values().map(
    (keyword) => keyword.label,
  ),
]);
