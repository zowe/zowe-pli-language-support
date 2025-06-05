/// <reference path="../framework.ts" />

/**
 * This test verifies that the linker can handle nested procedures.
 */

// @wrap: main
// @filename: test.pli
//// <|1:OUTER|>: procedure options (main);
////    <|2:INNER|>: procedure;
////        call <|3>OUTER;
////        call <|2>INNER;
////
////        <|3:OUTER|>: procedure;
////            call <|3>OUTER;
////            call <|4>INNER;
////
////            <|4:INNER|>: procedure;
////                call <|3>OUTER;
////                call <|4>INNER;
////            END <|4>INNER;
////
////            call <|3>OUTER;
////            call <|4>INNER;
////        END <|3>OUTER;
////
////        call <|3>OUTER;
////        call <|2>INNER;
////    END <|2>INNER;
////
////    call <|1>OUTER;
////    call <|2>INNER;
//// end <|1>OUTER;
//// call <|1>OUTER;

linker.expectLinks();
