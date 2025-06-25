/// <reference path="../framework.ts" />

//// %<|1>

completion.expectAt(1, {
  includes:
    constants.CompletionKeywords.StatementStartPreprocessor.values().map(
      (keyword) => keyword.label,
    ),
});
