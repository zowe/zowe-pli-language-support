/// <reference path="../framework.ts" />

/**
 Variable must be partially qualified
 */
// @wrap: main
//// DCL 1 <|a:A|>,
////     2 <|a_b:B|> CHAR(8) VALUE("B");
//// DCL 1 A2,
////     2 <|a2_c:C|>,
////       3 <|a2_c_b:B|> CHAR(8) VALUE("B2");
//// PUT (<|a2_c>C.<|a2_c_b>B);
//// PUT (<|a>A.<|a_b>B);

linker.expectLinks();
