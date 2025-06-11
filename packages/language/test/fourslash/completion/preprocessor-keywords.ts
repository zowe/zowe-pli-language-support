/// <reference path="../framework.ts" />

//// %<|1>

completion.expectAt(
  1,
  constants.PreprocessorCompletionKeywords.values().map(
    (keyword) => `%${keyword}`,
  ),
);
