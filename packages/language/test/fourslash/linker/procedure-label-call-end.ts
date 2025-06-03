/// <reference path="../framework.ts" />

/**
 * Must find declared procedure label in CALL/END
 */

// @wrap: main
//// Control: procedure options(main);
////  call <|1>A('ok!'); // invoke the 'A' subroutine
//// end Control;
//// <|1:A|>: procedure (VAR1);
//// declare <|2:VAR1|> char(3);
//// put skip list(V<|2>AR1);
//// end <|1>A;

linker.expectLinks();
