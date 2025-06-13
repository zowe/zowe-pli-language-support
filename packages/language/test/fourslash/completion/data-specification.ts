/// <reference path="../framework.ts" />

//// DCL A <|1>
//// DCL B;

completion.expectAt(1, {
  includes: [
    ...constants.CompletionKeywords.DataSpecification.values().map(
      (keyword) => keyword.label,
    ),
  ],
});
