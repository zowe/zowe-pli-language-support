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

export const pliPrograms = [
  // 0. Empty program
  ``,

  // 1. Hello World Program
  `
 AVERAGE: PROCEDURE OPTIONS (MAIN);
   /* Test characters: ^[] € */
   /* AVERAGE_GRADE = SUM / 5; */
   PUT LIST ('PROGRAM TO COMPUTE AVERAGE');
 END AVERAGE;`,

  // 2. Simple procedure
  `
    P1: procedure;
    end P1;`,

  // 3. Procedure w/ alternate entry point
  `
    P1: procedure;
    B: entry; // secondary entry point into this procedure
    end P1;`,

  // 4. Procedure with call
  `
 Control: procedure options(main);
  call A('ok'); // invoke the 'A' subroutine
 end Control;
 A: procedure (VAR1);
 declare VAR1 char(3);
 put skip list(VAR1);
 end A;`,

  // 5. Simple recursive procedure w/ recursive stated before returns
  `
 Fact: proc (Input) recursive returns (fixed bin(31));
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*Fact(Input-1) );
 end Fact;`,

  // 6. Simple recursive procedure w/ recursive stated after returns
  `
 Fact: proc (Input) returns (fixed bin(31)) recursive;
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*Fact(Input-1) );
 end Fact;`,

  // 7. Procedures w/ Order & Reorder options
  `
 P1: proc Options(Order);
 end P1;
 P2: proc Options( Reorder );
 end P2;
 call P1;
 call P2;`,

  // 8. Procedure w/ Reorder option & Returns
  `
 Double: proc (Input) Options(Reorder) returns(fixed bin(31));
  declare Input fixed bin(15);
  return( Input * 2);
 end Double;
 declare X fixed bin(31);
 X = Double(5);`,

  // 9. Complex recursive procedure
  `
 START: procedure options (main);
 dcl I fixed bin(15);
 I=1; call A;
 A: proc recursive;
   declare Ev entry variable static;
   if I=1 then
 do; I=2;
 Ev=B;
 call A; end;
 else call Ev;
 B: proc;
   go to Out;
 end B;
 Out: end A;
 end Start;`,

  // 10. Package with main routine
  `
 Package_Demo: Package exports (T);
 T: PROCEDURE OPTIONS (MAIN);
 END T;
 end Package_Demo;`,

  // 11. Basic branching example
  `
 dcl A bit(4),
    D bit(5);
 A=1;
 D=1;
 if A=1 then go to Y;
       else go to X;
 X:;
 Y:;`,

  // 12. Simple PUT example
  ` put skip list('Hello ' || 'World');`,

  // 13. Simple GET example
  `
 dcl VAR fixed bin(15);
 get list(var);`,

  // 14. Fetch example
  `
 dcl A entry;
 fetch A title('X');
 fetch A;

 declare ProgA entry;

 // fetch & release storage occupied by ProgA
 fetch ProgA;
 call ProgA;
 release ProgA;`,

  // 15. BEGIN block example
  `
 B: begin;
 declare A fixed bin(15);
 end B;`,

  // 16. Subscripted entry invocation
  `
 declare (A,B,C,D,E) entry;
 declare F(5) entry variable initial (A,B,C,D,E);
 declare I fixed bin(15),
    X fixed bin(15),
    Y fixed bin(15),
    Z fixed bin(15);
 do I = 1 to 5;
  call F(I) (X,Y,Z); // each entry call gets args x,y,z
 end;`,

  // 17. Optional args example
  `
 dcl Vrtn entry (
    fixed bin,
    ptr optional,
    float,
    * optional);

 // valid calls for this entry point
 dcl x ptr;
 call Vrtn(10, *, 15.5, 'abcd');
 call Vrtn(10, *, 15.5, *);
 call Vrtn(10, addr(x), 15.5, *);
 call Vrtn(10, *, 15.5);
 call Vrtn(10, addr(x), 15.5);`,

  // 18. Block 27 example
  `
    /* Enterprise PL/I for z/OS Language Reference v6.1, pg.59 */
    A = '/* This is a constant, not a comment */' ;`,

  // 19. Ordinal example
  `
      define ordinal day (
          Monday,
          Tuesday,
          Wednesday,
          Thursday,
          Friday,
          Saturday,
          Sunday
      ) prec(15);

      // should be able to parse return w/ ordinal correctly
      get_day: proc() returns(ordinal day byvalue);
          return( Friday );
      end get_day;`,

  // 20. External declaration example
  `
 dcl my_external ext('my_external')
        entry( 
            pointer byvalue,
            returns ( fixed byvalue bin(31) )
        )
        options ( nodescriptor );`,

  // 21. GET LIST with file example
  `
    H: PROC OPTIONS (MAIN);
    DECLARE N BINARY FIXED (31);
    GET LIST (N) FILE(SYSIN);
    END H;`,

  // 22. Procedures with aligned & unaligned attributes
  `
 P1: proc returns( bit(4) aligned );
 return(0);
 end P1;
 P2: proc returns( bit(4) unaligned );
 return(0);
 end P2;
 P3: proc returns( bit(4) aligned aligned );
 return(0);
 end P3;
 P4: proc returns( bit(4) unaligned unaligned );
 return(0);
 end P4;
 P5: proc returns( aligned bit(4) );
 return(0);
 end P5;
 P6: proc returns( unaligned bit(4) unaligned );
 return(0);
 end P6;`,

  // 23. GENERIC attribute example
  `
      declare Calc generic (
        Fxdcal when (fixed,fixed),
        Flocal when (float,float),
        Mixed when (float,fixed),
        Error otherwise
      );`,
];
