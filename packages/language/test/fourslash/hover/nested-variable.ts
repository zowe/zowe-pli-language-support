/// <reference path="../framework.ts" />

/**
 * Strip away irrelevant nested nodes in the hover response to show the structure of the declaration.
 */

//// DCL 1 A, 2 A2, 3 A3, 2 B, 3 B3, 2 C2, 3 C3;
//// PUT(<|1>C3);

hover.expectMarkdownAt(
  1,
  [hover.codeBlock("DCL 1 A, 2 C2, 3 C3;")].join("\n\n"),
);
