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

import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { parseHelper } from "langium/test";
import { createPliServices, PliProgram } from "../src";

let services: ReturnType<typeof createPliServices>;
let parse: ReturnType<typeof parseHelper<PliProgram>>;
let parseStmts: ReturnType<typeof parseHelper<PliProgram>>;

beforeAll(async () => {
    services = createPliServices(EmptyFileSystem);
    parse = parseHelper<PliProgram>(services.pli);

    /**
     * Helper function to parse a string of PL/I statements,
     * wrapping them in a procedure to ensure they are valid
     */
    parseStmts = (input: string) => {
        return parse(` STARTPR: PROCEDURE OPTIONS (MAIN);
${input}
 end STARTPR;`);
    }

    // activate the following if your linking test requires elements from a built-in library, for example
    await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('PL/I Parsing tests', () => {

    // // Handle as validation error
    // test.fails('empty program', async () => {
    //     const doc: LangiumDocument<PliProgram> = await parse(``);
    //     expect(doc.parseResult.lexerErrors).toHaveLength(0);
    //     expect(doc.parseResult.parserErrors).toHaveLength(0);
    // });

    test('empty program w/ null statement', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`;`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    // TODO @montymxb this should pass according to the docs, but doesn't work in practice
    // test('empty program w/ null %statement', async () => {
    //     const doc: LangiumDocument<PliProgram> = await parseStmts(`%;`);
    //     expect(doc.parseResult.lexerErrors).toHaveLength(0);
    //     expect(doc.parseResult.parserErrors).toHaveLength(0);
    // });

    test('Hello World Program', async () => {
        const doc = await parse(`
 AVERAGE: PROCEDURE OPTIONS (MAIN);
   /* Test characters: ^[] € */
   /* AVERAGE_GRADE = SUM / 5; */
   PUT LIST ('PROGRAM TO COMPUTE AVERAGE');
 END AVERAGE;`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    describe('Procedures', () => {
        test('Simple procedure', async () => {
            const doc: LangiumDocument<PliProgram> = await parse(`
    P1: procedure;
    end P1;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Procedure w/ alternate entry point', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
    P1: procedure;
    B: entry; // secondary entry point into this procedure
    end P1;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });
    
        test('Procedure with call', async () => {
            const doc: LangiumDocument<PliProgram> = await parse(`
 Control: procedure options(main);
  call A('ok!'); // invoke the 'A' subroutine
 end Control;
 A: procedure (VAR1);
 declare VAR1 char(3);
 put skip list(VAR1);
 end A;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Simple recursive procedure w/ recursive stated before returns', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 Fact: proc (Input) recursive returns (fixed bin(31));
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*Fact(Input-1) );
 end Fact;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Simple recursive procedure w/ recursive stated after returns', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 Fact: proc (Input) returns (fixed bin(31)) recursive;
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*Fact(Input-1) );
 end Fact;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Procedures w/ Order & Reorder options', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 P1: proc Options(Order);
 end P1;
 P2: proc Options( Reorder );
 end P2;
 call P1;
 call P2;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Procedure w/ Reorder option & Returns', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 Double: proc (Input) Options(Reorder) returns(fixed bin(31));
  declare Input fixed bin(15);
  return( Input * 2);
 end Double;
 declare X fixed bin(31);
 X = Double(5);`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Recursive - Returns - Options for a Procedure in various permutations', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 // returns - options - recursive
 F1: proc (Input) returns (fixed bin(31)) Options(Order) recursive;
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*F1(Input-1) );
 end F1;

 // options - returns - recursive
 F2: proc (Input) Options(Order) returns (fixed bin(31)) recursive;
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*F2(Input-1) );
 end F2;

 // options - recursive - returns
 F3: proc (Input) Options(Order) recursive returns (fixed bin(31));
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*F3(Input-1) );
 end F3;

 // returns - options - recursive
 F4: proc (Input) returns (fixed bin(31)) Options(Order) recursive;
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*F4(Input-1) );
 end F4;

 // returns - recursive - options
 F5: proc (Input) returns (fixed bin(31)) recursive Options(Order);
  dcl Input fixed bin(15);
  if Input <= 1 then
  return(1);
  else
  return( Input*F5(Input-1) );
 end F5;
 `);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Options Separate by Commas & Spaces', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
    P1: proc Options( Order, Reorder, Recursive );
    end P1;
    P2: proc Options( Order Reorder Recursive);
    end P2;
    P3: proc Options(Order Reorder, Recursive );
    end P3;
    P4: proc Options(Order, Reorder Recursive);
    end P4;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Complex recursive procedure', async () => {
            const doc: LangiumDocument<PliProgram> = await parse(`
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
 end Start;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });
    });

    // tests for labels
    describe('Label Tests', () => {

        test('empty label, null statement', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(` main:;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Declared label', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(` declare Label_x label;`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Label assignment', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare Label_x label;
 Label_a:;
 Label_x = Label_a; // label assignments
 go to Label_x; // jump to label
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

    });

    // tests fro declarations
    describe('Declaration tests', () => {

        test('simple char declarations', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare UserA character (15); // 15 character var
 declare UserB character (15) varying; // varying
 declare UserC character (15) varyingz; // varying w/ null termination
 declare A char(5) nonvarying init( ('abc' || '00'x) ); // nonvarying w/ init
 declare B char(3) varyingz init ( 'abc' ); // not equal to the one before by the way, null term is not used in varyingz for comparisons, even though it's there implicitly
 dcl Z char(3) nonvarying init('abc');
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('char declaration w/ overflow assignment', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare Subject char(10);
 Subject = 'Transformations'; // will truncate the last 5 chars, emitting a warning (but valid nonetheless)
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('arbitrary length char decl', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl VAL char(*) value('Some text that runs on and on');
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('nested quotes char decl', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare User1 character (30) init('Shakespeare''s "Hamlet"');
 declare User2 character (30) init("Shakespeare's ""Hamlet""");
 declare User3 character (30) init('/* blah */');
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Bit declarations', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare S bit (64); // 64 bit var
 declare Code bit(10);
 Code = '110011'B;
 Code = '1100110000'B;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Format constants', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 Prntexe: format
    ( column(20),A(15), column(40),A(15), column(60),A(15) );
 Prntstf: format
    ( column(20),A(10), column(35),A(10), column(50),A(10) );
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Attribute declarations', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare Account1 file variable, // file var
 Account2 file automatic, // file var too
 File1 file, // file constant
 File2 file; // file constant
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Value List declaration', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl cmonth char(3)
            valuelist( 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' );
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('value list from declaration', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl 1 a,
    2 b fixed bin value(31),
    2 c fixed bin value(28),
    2 d fixed bin value(30);
 dcl x fixed bin valuelistfrom a;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        // Handle as validation error
//         test.fails('fails with duplicate value in value list', async () => {
//             const doc: LangiumDocument<PliProgram> = await parseStmts(`
//  dcl 1 a,
//     2 b fixed bin value(31),
//     2 d fixed bin value(31);
//  dcl x fixed bin valuelistfrom a;
// `);
//             expect(doc.parseResult.lexerErrors).toHaveLength(0);
//             expect(doc.parseResult.parserErrors).toHaveLength(0);
//         });

        test.fails('value list is too long to handle in compiler correctly', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl 1 a, 2 b fixed bin value(31), 2 c fixed bin value(28), 2 d fixed bin value(31);
 dcl x fixed bin valuelistfrom a;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('value range declaration', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 define alias numeric_month fixed bin(7) valuerange(1,12);
 dcl imonth type numeric_month; // must hold a val between 1 & 12 inclusive
 dcl cmonth char(3) // must be one of the 12 months listed
          valuelist( 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' );
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('multi-declaration', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
    declare Result bit(3),
        A fixed decimal(1),
        B fixed binary (15), // precison lower than 15 will trigger a compiler warning, less than storage allows
        C character(2), D bit(4);
    `);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });
    });

    test('pseduovariables', async () => {
        // assigns into a sub-section of A from a sub-string of B
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare A character(10),
        B character(30);
 substr(A,6,5) = substr(B,20,5);
`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test('assignment from multi-declaration', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare Result bit(4),
    A fixed decimal(1),
    B fixed binary (15),
    C character(4), D bit(4);
    A = 1.0;
    B = 2;
    C = 'ABCD';
    D = 1;
 Result = A + B < C & D;
`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    describe('Expressions', () => {

        test('Assorted restricted expressions', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 // from pg. 73
 dcl Max_names fixed bin value (1000),
    Name_size fixed bin value (30),
    Addr_size fixed bin value (20),
    Addr_lines fixed bin value (4);
 dcl 1 Name_addr(Max_names),
      2 Name char(Name_size),
      2 * union,
        3 Address char(Addr_lines*Addr_size), /* address    */
        3 addr(Addr_lines) char(Addr_size),
      2 * char(0);
 dcl One_Name_addr char(size(Name_addr(1)));   /* 1 name/addr*/
 dcl Two_Name_addr char(length(One_Name_addr)
                       *2);                /* 2 name/addrs  */
 dcl Name_or_addr char(max(Name_size,Addr_size)) based;
 dcl Ar(10) pointer;
 dcl Ex     entry( dim(lbound(Ar):hbound(Ar)) pointer);
 dcl Identical_to_Ar( lbound(Ar):hbound(Ar) ) pointer;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Simple arithmetic expressions', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl A fixed bin(15), B fixed bin(15), C fixed bin(15);
 A = 5;
 B = 10;
 C = A + B;
 C = A - B;
 C = A * B;
 C = A / B;
 C = A ** B;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

        test('Function invocation', async () => {
            const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl A fixed bin(15), B fixed bin(15), Y fixed bin(15), X fixed bin(15);
 A = 5;
 B = 10;
 // will warn about dummy args being gend for ADD, but it's valid
 Y = ADD(A,B);
 X = Y**3+ADD(A,B);
 ADD: procedure (v1,v2) returns(byvalue);
    dcl (v1,v2) bin float(32);
    return(v1+v2);
 end ADD;
`);
            expect(doc.parseResult.lexerErrors).toHaveLength(0);
            expect(doc.parseResult.parserErrors).toHaveLength(0);
        });

    });

    test('Basic branching', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl A bit(4),
    D bit(5);
 A=1;
 D=1;
 if A=1 then go to Y;
       else go to X;
 X:;
 Y:;
`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    describe('Packages', () => {

        test('Package with main routine', async () => {
            const doc: LangiumDocument<PliProgram> = await parse(`
 Package_Demo: Package exports (T);
 T: PROCEDURE OPTIONS (MAIN);
 END T;
 end Package_Demo;
`);
                        expect(doc.parseResult.lexerErrors).toHaveLength(0);
                        expect(doc.parseResult.parserErrors).toHaveLength(0);
        });
    });

    test('simple PUT', async () => {
        // output a string to the stdout
        const doc: LangiumDocument<PliProgram> = await parseStmts(` put skip list('Hello ' || 'World');`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test('simple GET', async () => {
        // read a string into a variable 'var'
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl VAR fixed bin(15);
 get list(var);
`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test('fetch', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 dcl A entry;
 fetch A title('X');
 fetch A;

 declare ProgA entry;

 // fetch & release storage occupied by ProgA
 fetch ProgA;
 call ProgA;
 release ProgA;`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test('BEGIN block', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 B: begin;
 declare A fixed bin(15);
 end B;`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test.skip('Subscripted entry invocation', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
 declare (A,B,C,D,E) entry;
 declare F(5) entry variable initial (A,B,C,D,E);
 declare I fixed bin(15),
    X fixed bin(15),
    Y fixed bin(15),
    Z fixed bin(15);
 do I = 1 to 5;
  call F(I) (X,Y,Z); // each entry call gets args x,y,z
 end;`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test('Optional args', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
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
 call Vrtn(10, addr(x), 15.5);
`);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });
    
    test('Block 27', async () => {
        const doc: LangiumDocument<PliProgram> = await parseStmts(`
    /* Enterprise PL/I for z/OS Language Reference v6.1, pg.59 */
    A = '/* This is a constant, not a comment */' ;
    `);
        expect(doc.parseResult.lexerErrors).toHaveLength(0);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });
});
