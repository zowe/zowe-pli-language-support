/// <reference path="../framework.ts" />

/**
 * Redeclaration of label must fail
 */

// @wrap: main
//// OUTER: PROCEDURE;
//// END OUTER;
//// <|1:OUTER|>: PROCEDURE;
//// END OUTER;
//// CALL OUTER;

verify.expectExclusiveErrorCodesAt(1, code.Severe.IBM1916I.fullCode);
