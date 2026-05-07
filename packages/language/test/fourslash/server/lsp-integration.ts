/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

/// <reference path="../framework.ts" />

//// TESTPROC: PROC (A, B) OPTIONS(MAIN);
////   DCL <|1:X|> FIXED BIN(31);
////   DCL <|2:Y|> CHAR(10);
////   DCL <|3>A FIXED BIN(31);
////   DCL B CHAR(20);
////
////   /* Hover test: X should show declaration */
////   PUT(<|hover>X);
////
////   /* Completion test: should complete variable names */
////   PUT(<|complete>);
////
////   /* Definition test: link from X to its declaration */
////   <|defLink>X = 42;
////
////   /* Signature help test */
////   CALL SUBSTR(<|sig>);
////
//// END TESTPROC;

// Test 1: Diagnostics via textDocument/publishDiagnostics
await server.verify.noDiagnostics();

// Test 2: Hover via textDocument/hover
const expectedHoverMarkdown = hover.codeBlock(
  "DCL X FIXED BINARY PRECISION(31);",
);
await server.hover.expectMarkdownAt("hover", expectedHoverMarkdown);

// Test 3: Completion via textDocument/completion
await server.completion.expectAt("complete", {
  includes: ["X", "Y", "A", "B"],
});

// Test 4: Definition links via textDocument/definition
await server.linker.expectLinks();

// Test 5: Semantic tokens via textDocument/semanticTokens/full
await server.semanticTokens.expectAt("1", "variable");

// Test 6: Signature help via textDocument/signatureHelp
const expectedSignatureDoc = `SUBSTR returns a substring, specified by \`y\` and \`z\`, of
\`x\`.

The STRINGRANGE condition is raised if \`z\` is negative or if
the values of \`y\` and \`z\` are such that the substring does
not lie entirely within the current length of \`x\`. It is not
raised when \`y\` = LENGTH(\`x\`)+1 and \`z\` = 0. For an
example of the SUBSTR built-in function, see SEARCH.
`;
await server.signatureHelp.expectMarkdownSignatureAt(
  "sig",
  expectedSignatureDoc,
);
