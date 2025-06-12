/// <reference path="../framework.ts" />

//// %<|1>

completion.expectAt(1, {
  includes: constants.PreprocessorCompletionKeywords.values().map(
    (keyword) => keyword.label,
  ),
});
