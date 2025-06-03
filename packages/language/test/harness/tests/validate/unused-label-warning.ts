/// <reference path="../framework.ts" />

/**
 Unused label should warn
 */
// @wrap: main
//// <|1:OUTER|>: PROCEDURE;
//// END OUTER;

verify.expectExclusiveErrorCodesAt("1", code.Warning.IBM1213I.fullCode);
