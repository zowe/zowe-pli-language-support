/// <reference path="../framework.ts" />

/**
 Must not link between PL/I and preprocessor variables
 */

// @wrap: main
//// %DECLARE <|1:PAYROLL|> CHARACTER;
//// %<|2:PAYROLL|> = 'PAY_ROLL';
//// DCL PAYROLL CHAR(8) VALUE("PAYROLL");
//// %DEACTIVATE <|3:PAYROLL|>;
//// PUT(<|1><|2><|3>PAYROLL);

linker.expectNoLinksAt("1");
linker.expectNoLinksAt("2");
linker.expectNoLinksAt("3");
