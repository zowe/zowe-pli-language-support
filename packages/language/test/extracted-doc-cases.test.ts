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

/**
 * Auto-extracted cases from the:
 * - PL/I Language Reference v6.1
 * - PL/I Programming Guide v6.1
 *
 * Each case is tagged with a bit of auto-extracted context + a comment referencing the sourcing doc & page number
 *
 * All cases have been run through the PL/I compiler and passed, and are now being run through the Langium parser to ensure they pass here as well
 */

// import { beforeAll, expect, test } from "vitest";
// import { EmptyFileSystem, type LangiumDocument } from "langium";
// import { parseHelper } from "langium/test";
// import { createPliServices, PliProgram } from "../src";

// let services: ReturnType<typeof createPliServices>;
// let parse: ReturnType<typeof parseHelper<PliProgram>>;
// let parseStmts: ReturnType<typeof parseHelper<PliProgram>>;

// beforeAll(async () => {
//   services = createPliServices(EmptyFileSystem);
//   parse = parseHelper<PliProgram>(services.pli);

//   /**
//    * Helper function to parse a string of PL/I statements,
//    * wrapping them in a procedure to ensure they are valid
//    */
//   parseStmts = (input: string) => {
//     return parse(` STARTPR: PROCEDURE OPTIONS (MAIN);
// ${input}
//  end STARTPR;`);
//   };

//   // activate the following if your linking test requires elements from a built-in library, for example
//   await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
// });

// test("Block block-492.pli", async () => {
//   // Context:
//   //
//   // control. It allows multiple ON-units to get control for the same condition.
//   // The processing continues as if the ON-unit executing the RESIGNAL did not exist and was never given
//   // condition to get control.
//   // The RESIGNAL statement terminates the current ON-unit and allows another ON-unit for the same
//   // RESIGNAL statement
//   // attribute.
//   // Is any condition described in Chapter 16, “Conditions,” on page 349 or defined with the CONDITION
//   // condition
//   // If the specified condition is disabled, the SIGNAL statement becomes equivalent to a null statement.
//   // the condition. The established action is taken unless the condition is disabled.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.398 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  RESIGNAL
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-508.pli", async () => {
//   // Context:
//   //
//   // Example
//   // A reference with the AREA attribute
//   // x
//   // 407
//   // Chapter 18. Built-in functions, pseudovariables, and subroutines
//   // ATAND
//   // .
//   // x
//   // obtained from the area
//   //  value that indicates the size of the largest single allocation that can be
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.459 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Uarea area(1000);
//    dcl Pz ptr;
//    dcl C99z char(99) varyingz based(Pz);
//    dcl (SizeBefore, SizeAfter) fixed bin(31);
//    SizeBefore = availablearea(Uarea);         /* returns 1000    */
//    Alloc C99z in(Uarea);
//    SizeAfter = availablearea(Uarea);          /* returns 896     */
//    dcl C9 char(896) based(Pz);
//    Alloc C9 in(Uarea);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-400.pli", async () => {
//   // Context:
//   //
//   // both specify null ON-units for the same file.
//   // L2
//   //  and
//   // L1
//   // “ON-units for file variables” on page 345). In the following example, the statements labelled
//   // On-units can be established for a file constant through a file variable that represents its value (see
//   // • As the expression in a RETURN statement.
//   // • To qualify an input/output condition for ON, SIGNAL, and REVERT statements
//   // • As an argument to be passed to a function or subroutine
//   // • In a FILE or COPY option
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.331 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl F file,
//        G file variable;
//        G=F;
//    L1:  on endfile(G);
//    L2:  on endfile(F);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-204.pli", async () => {
//   // Context:
//   //
//   // "would be the same as this longer declare:
//   // func
//   // The declare for the entry "
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 180
//   // Assignments to UNIONs
//   // description, the member names are not copied. For example, the following declares are valid:
//   // The LIKE attribute is supported in ENTRY descriptions and in parameter declarations. If used in an ENTRY
//   // name with the LIKE attribute.
//   // follows the object variable in the LIKE attribute must be equal to or less than the level-number of the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.232 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl func entry( 1, 2 char(20) var, 2 char(10) var, 2 char(30) var );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-658.pli", async () => {
//   // Context:
//   //
//   // which is a structure declaration:
//   // For example, assume that PAYRL is a member of the data set SYSLIB and contains the following text,
//   // compile-time option.)
//   // %INCLUDE, execution of the preprocessor can be omitted. (This necessitates the use of the INCLUDE
//   // If the preprocessor input and the included text contain no preprocessor statements other than
//   // portion of the preprocessor input.
//   // For example, it is not allowable to have half of a %IF statement in an included text and half in another
//   // Preprocessor statements, DO-groups, SELECT-groups and procedures in included text must be complete.
//   // target label in the %GOTO statement must not precede the %GOTO.
//   // A %GO TO statement in included text can transfer control only to a point within the same include file. The
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.670 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DECLARE 1 PAYROLL,
//            2 NAME,
//              3 LAST   CHARACTER (30) VARYING,
//              3 FIRST  CHARACTER (15) VARYING,
//              3 MIDDLE CHARACTER (3) VARYING,
//            2 CURR,
//              3 (REGLAR, OVERTIME) FIXED DECIMAL (8,2),
//            2 YTD LIKE CURR;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-297.pli", async () => {
//   // Context:
//   //
//   // is encountered or until a %POP directive that restores the previous %PRINT directive is encountered.
//   // The %NOPRINT directive causes printing of the source listings to be suspended until a %PRINT directive
//   // %NOPRINT directive
//   // oriented data transmission,” on page 289.
//   // For details about the LOCATE statement, see “LOCATE statement” on page 291 in Chapter 11, “Record-
//   // BUFFERED file for locate mode processing.
//   // to the location of the next record. The LOCATE statement can be used only with an OUTPUT SEQUENTIAL
//   // The LOCATE statement allocates storage within an output buffer for a based variable and sets a pointer
//   // LOCATE statement
//   // The %LINE directive is invalid unless the LINEDIR compiler option is in effect.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.278 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  %NOPRINT
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-477.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // Specifies the currency symbol.
//   // currency symbol
//   // type of sign character can appear in each field.
//   // currency symbol) specifies a currency symbol in the character value of numeric character data. Only one
//   // The picture characters S, +, and – specify signs in numeric character data. The picture character $ (or the
//   // Using signs and currency symbols
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 334
//   // Currency symbols
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.386 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Price picture '$99V.99';
//    Price = 12.45;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-610.pli", async () => {
//   // Context:
//   //
//   // Example
//   // 551
//   // Chapter 18. Built-in functions, pseudovariables, and subroutines
//   // SINH
//   //  have the UNALIGNED attribute.
//   // x
//   // • All other elements in
//   //  with the NONVARYING and BIT attributes have the ALIGNED attribute.
//   // x
//   // • Elements in
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.603 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Scids   char(17)         init('See you at SCIDS!') static;
//    dcl Vscids  char(20) varying init('See you at SCIDS!') static;
//    dcl Stg fixed bin(31);
//    Stg = storage   (Scids);           /* 17 bytes */
//    Stg = currentsize (Scids);         /* 17 bytes */
//    Stg = size (Vscids);               /* 22 bytes */
//    Stg = currentsize (Vscids);        /* 19 bytes */
//    Stg = size (Stg);                  /* 4  bytes */
//    Stg = currentsize (Stg);           /* 4  bytes */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-278.pli", async () => {
//   // Context:
//   //
//   // UPTHRU and DOWNTHRU are particularly useful with ordinals. Consider the following example:
//   // Similarly, the following loop avoids the problem of decrementing an unsigned value equal to zero:
//   // FIXEDOVERFLOW condition would not be raised by the following loop:
//   // updated; this can be very useful when there is no value after the terminating value. For instance, the
//   // When the UPTHRU option is used, the reference is compared to the terminating value before being
//   //  has the value 5:
//   // i
//   // In the following example, the do-group executes 5 times and at the end of the loop
//   // terminating value.
//   // The UPTHRU and DOWNTHRU options make successive executions of the do-group dependent upon the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.270 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    define ordinal Color ( Red value (1),
//                           Orange,
//                           Yellow,
//                           Green,
//                           Blue,
//                           Indigo,
//                           Violet);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-184.pli", async () => {
//   // Context:
//   //
//   // precision:
//   // However, the following statement specifies both the FIXED BINARY attribute as a default and the
//   // BINARY:
//   // For example, the following statement specifies precision for identifiers already known to be FIXED
//   // precision for FIXED DECIMAL names is to be (8,3).
//   //  influenced by the default statement, because this statement specifies only that the default
//   // not
//   // It is
//   // If it is not declared explicitly, I is given the language-specified default attributes FIXED BINARY(15,0).
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.222 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DFT RANGE(*) FIXED BINARY VALUE(FIXED BINARY(31));
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-129.pli", async () => {
//   // Context:
//   //
//   // To return from a subroutine, the RETURN statement syntax is as follows:
//   // Return from a subroutine
//   // of course).
//   // A procedure with the RETURNS option must contains at least one RETURN statement (with an expression,
//   // option.
//   // Conversely, a RETURN statement with an expression is not valid in a procedure without the RETURNS
//   // A RETURN statement without an expression is not valid in a procedure with the RETURNS option.
//   // The RETURN statement with an expression should not be used within a procedure with OPTIONS(MAIN).
//   // immediately following the invocation reference.
//   // the RETURN statement and returns control to the invoking procedure. Control is returned to the point
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.175 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  RETURN
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-689.pli", async () => {
//   // Context:
//   //
//   // Upper limits
//   // Lower limits
//   // (continued)
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 632
//   // Limits
//   // Upper limits
//   // Lower limits
//   // (continued)
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.684 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl lower_00813 char
//    value( (
//               '6162636465666768'x
//            || '696A6B6C6D6E6F70'x
//            || '7172737475767778'x
//            || '797ADCDDDEDFE1E2'x
//            || 'E3E4E5E6E7E8E9EA'x
//            || 'EBECEDEEEFF0F1F3'x
//            || 'F4F5F6F7F8F9FAFB'x
//            || 'FCFDFE'x
//         ) );
//  dcl upper_00813 char
//    value( (
//               '4142434445464748'x
//            || '494A4B4C4D4E4F50'x
//            || '5152535455565758'x
//            || '595AB6B8B9BAC1C2'x
//            || 'C3C4C5C6C7C8C9CA'x
//            || 'CBCCCDCECFD0D1D3'x
//            || 'D4D5D6D7D8D9DADB'x
//            || 'BCBEBF'x
//         ) );
//  dcl lower_00819 char
//    value( (
//               '6162636465666768'x
//            || '696A6B6C6D6E6F70'x
//            || '7172737475767778'x
//            || '797AE0E1E2E3E4E5'x
//            || 'E6E7E8E9EAEBECED'x
//            || 'EEEFF0F1F2F3F4F5'x
//            || 'F6F8F9FAFBFCFDFE'x
//         ) );
//  dcl upper_00819 char
//    value( (
//               '4142434445464748'x
//            || '494A4B4C4D4E4F50'x
//            || '5152535455565758'x
//            || '595AC0C1C2C3C4C5'x
//            || 'C6C7C8C9CACBCCCD'x
//            || 'CECFD0D1D2D3D4D5'x
//            || 'D6D8D9DADBDCDDDE'x
//         ) );
//  dcl lower_00850 char
//    value( (
//               '6162636465666768'x
//            || '696A6B6C6D6E6F70'x
//            || '7172737475767778'x
//            || '797A818283848586'x
//            || '8788898A8B8C8D91'x
//            || '93949596979BA0A1'x
//            || 'A2A3A4C6D0E4E7EC'x
//         ) );
//  dcl upper_00850 char
//    value( (
//               '4142434445464748'x
//            || '494A4B4C4D4E4F50'x
//            || '5152535455565758'x
//            || '595A9A90B68EB78F'x
//            || '80D2D3D4D8D7DE92'x
//            || 'E299E3EAEB9DB5D6'x
//            || 'E0E9A5C7D1E5E8ED'x
//         ) );
//  dcl lower_00858 char
//    value( (
//               '6162636465666768'x
//            || '696A6B6C6D6E6F70'x
//            || '7172737475767778'x
//            || '797A818283848586'x
//            || '8788898A8B8C8D91'x
//            || '93949596979BA0A1'x
//            || 'A2A3A4C6D0E4E7EC'x
//         ) );
//  dcl upper_00858 char
//    value( (
//               '4142434445464748'x
//            || '494A4B4C4D4E4F50'x
//            || '5152535455565758'x
//            || '595A9A90B68EB78F'x
//            || '80D2D3D4D8D7DE92'x
//            || 'E299E3EAEB9DB5D6'x
//            || 'E0E9A5C7D1E5E8ED'x
//         ) );
//  dcl lower_00871 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '575870798DA1C0CB'x
//            || 'CDCECFD0DBDCDDDE'x
//         ) );
//  dcl upper_00871 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '7778807CAD5F4AEB'x
//            || 'EDEEEF5AFBFCFDFE'x
//         ) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-688.pli", async () => {
//   // Context:
//   //
//   // Upper limits
//   // Lower limits
//   // (continued)
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   // 631
//   // Appendix A. Limits
//   // Limits
//   // Upper limits
//   // Lower limits
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.683 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl lower_00280 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424345464749'x
//            || '52535556575A6A70'x
//            || '798C8D8E9CA1C0CB'x
//            || 'CCCECFD0DBDCDEE0'x
//         ) );
//  dcl upper_00280 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626365666769'x
//            || '727375767771ED80'x
//            || 'FDACADAE9E7864EB'x
//            || 'ECEEEF74FBFCFE68'x
//         ) );
//  dcl lower_00284 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4851525354555657'x
//            || '586A708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_00284 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6871727374757677'x
//            || '787B80ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_00285 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_00285 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_00297 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424345464749'x
//            || '5253555657586A70'x
//            || '7C8C8D8E9CC0CBCC'x
//            || 'CDCECFD0DBDCDEE0'x
//         ) );
//  dcl upper_00297 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626365666769'x
//            || '727375767778FD80'x
//            || '64ACADAE9E71EBEC'x
//            || 'EDEEEF74FBFCFE68'x
//         ) );
//  dcl lower_00500 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_00500 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-68.pli", async () => {
//   // Context:
//   //
//   // them separately. Consider the following example:
//   // necessarily go through more than one. To understand the conversion rules, it is convenient to consider
//   // More than one conversion might be required for a particular operation. The implementation does not
//   // LIMITS(FIXEDDEC(N1,N2)).
//   //  is the maximum precision for FIXED DECIMAL. This is the value N2 from the compiler option
//   //  N
//   // •
//   // LIMITS(FIXEDBIN(M1,M2)).
//   //  is the maximum precision for FIXED BINARY. This is the value M2 from the compiler option
//   //  M
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.127 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl A fixed dec(3,2) init(1.23);
//    dcl B fixed bin(15,5);
//    B = A;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-142.pli", async () => {
//   // Context:
//   //
//   // the parent structure.
//   // parent structure contains a handle to the child structure, but the child structure also contains a handle to
//   // structure that also contains a handle to the first structure. For instance, in the following example, the
//   // Unspecified structure definitions are useful when a structure definition contains a handle to a second
//   // specify its members.
//   // • An unspecified structure can also be the subject of a later DEFINE STRUCTURE statement that does
//   // course, cannot be dereferenced either.
//   // • An unspecified structure cannot be dereferenced, but it can be used to declare a HANDLE which, of
//   // its members defines an "unspecified structure".
//   // A DEFINE STRUCTURE statement that merely names the structure to be defined without specifying any of
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.192 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     define structure 1 child;
//     define structure
//      1 parent,
//        2 first_child   handle child,
//        2 parent_data   fixed bin(31);
//     define structure
//      1 child,
//        2 parent        handle parent,
//        2 next_child    handle child,
//        2 child_data    fixed bin(31);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-21.pli", async () => {
//   // Context:
//   //
//   // of 16 binary digits.
//   //  represents binary floating-point data with a precision
//   // S
//   // For example, in the following DECLARE statement,
//   // The data attributes for declaring binary floating-point variables are BINARY and FLOAT.
//   // Binary floating-point data
//   // (4,4)
//   // .0012
//   // (4,0)
//   // 5280
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.78 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare S binary float (16);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-20.pli", async () => {
//   // Context:
//   //
//   //  represents fixed-point data of 3 digits, 2 of which are fractional.
//   // D
//   // The following example specifies that
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 26
//   // XN (hex) binary constant
//   // range -9999999*100 - 9999999*100, in increments of 100.
//   //  holds 7 digits in the
//   // C
//   //  has a scaling factor of -2. This means that
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.78 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare D decimal fixed real(3,2);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-389.pli", async () => {
//   // Context:
//   //
//   // Combined with DIMACROSS, it can become even easier to add elements to this declaration:
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 270
//   // DEFINED and POSITION
//   // Using INITACROSS, you can simplify this declare by writing it as:
//   // For example, consider the declaration:
//   // set of initial values for a structure element in the array.
//   // attribute specifies a series of comma lists of expressions where each comma list in turn specifies the
//   // members are scalars in a way that makes it easy to add or delete elements to those arrays. The
//   // The INITACROSS attribute helps initialize one-dimensional arrays of structures where all the structure
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.322 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//               dcl
//                 1 a(*)   dimacross
//                          initacross(  ( 'DE', 'Germany' )
//                                      ,( 'FE', 'France' )
//                                      ,( 'SP', 'Spain' )
//                                    )
//                   ,2 b     char(2)
//                   ,2 c     char(40) var
//                 ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-212.pli", async () => {
//   // Context:
//   //
//   // This example is based on the following declaration:
//   // This example illustrates the difference between the INDFOR attribute and the LIKE attribute.
//   // Example
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 182
//   // Assignments to UNIONs
//   // the INDFOR attribute is expanded only after all INDFOR attributes have been resolved.
//   // UNALIGNED attributes are applied to the contained elements of the INDFOR object variable. However,
//   // The INDFOR attribute is expanded before the defaults are applied and before the ALIGNED and
//   // attributes are expanded.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.234 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//                  dcl 1 a, 2 b char(8), 2 c fixed dec(5,0);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-149.pli", async () => {
//   // Context:
//   //
//   //  is not.
//   // Y
//   //  is a valid reference, but
//   // B
//   // For example, given the following declares and definitions,
//   // cannot be referenced by themselves.
//   // names in a typical untyped structure, the names in a typed structure form their own “name space” and
//   // You reference a member of a typed structure using the . operator or a handle with the => operator. Unlike
//   // Typed structure qualification
//   // Example
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.195 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl 1 A,
//  2 B fixed bin,
//  2 C fixed bin;
//  define structure
//  1 X,
//  2 Y fixed bin,
//  2 Z fixed bin;
//  dcl S type X;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-192.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   //  has bounds of 1 and 8, and its extent is 8.
//   // List
//   // three digits. The one dimension of
//   //  is declared as a one-dimensional array of eight elements, each one a fixed-point decimal element of
//   // List
//   // Consider the following declaration:
//   // These examples help you understand declarations of arrays and array dimensions.
//   // Examples of arrays
//   // Declaration 2
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.225 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Table (4,2) fixed dec (3);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-633.pli", async () => {
//   // Context:
//   //
//   // Example
//   // Name of an ordinal type
//   // t
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 590
//   // BIND
//   // .
//   // t
//   // FIRST returns the first value in the ordinal set
//   // FIRST
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.642 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    define ordinal Color ( Red,
//                           Orange,
//                           Yellow,
//                           Green,
//                           Blue,
//                           Indigo,
//                           Violet );
//    display (ordinalname( first(Color) ));  /* RED */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-383.pli", async () => {
//   // Context:
//   //
//   // consists of the elements '9.99' of the picture E.
//   // character string that consists of the elements '999' of the picture E. Z3 is a character-string array that
//   // Z1 is a character string array that consists of all the elements of the decimal numeric picture E. Z2 is a
//   // X is a bit string that consists of 40 elements of C, starting at the 20th element.
//   // Examples
//   // The base variable must refer to data in connected storage.
//   // and the base variable must not be subscripted.
//   // When the defined variable is a bit class aggregate, the POSITION attribute can contain only an integer,
//   // If the POSITION attribute is omitted, POSITION(1) is the default.
//   // The expression is evaluated and converted to an integer value at each reference to the defined item.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.318 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL A(20) CHAR(10),
//      B(10) CHAR(5) DEF (A) POSITION(1);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-382.pli", async () => {
//   // Context:
//   //
//   // X is a bit string that consists of 40 elements of C, starting at the 20th element.
//   // Examples
//   // The base variable must refer to data in connected storage.
//   // and the base variable must not be subscripted.
//   // When the defined variable is a bit class aggregate, the POSITION attribute can contain only an integer,
//   // If the POSITION attribute is omitted, POSITION(1) is the default.
//   // The expression is evaluated and converted to an integer value at each reference to the defined item.
//   // is the number of characters, bits, graphics, uchars, or widechars in the defined variable.
//   // where N(b) is the number of characters, bits, graphics, uchars, or widechars in the base variable, and N(d)
//   //  is defined as follows:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.318 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL E PIC'99V.999',
//      Z1(6) CHAR(1) DEF (E),
//      Z2 CHAR(3) DEF (E) POS(4),
//      Z3(4) CHAR(1) DEF (E) POS(2);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-177.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // null descriptors).
//   // • At least one attribute is already present. (The DESCRIPTORS default attributes are not applied to
//   // same class.
//   // • The inclusion of any such attributes is not prohibited by the presence of alternative attributes of the
//   // an explicit entry declaration, if the following conditions are true:
//   // Specifies that the attributes are included in any parameter descriptors in a parameter descriptor list of
//   // DESCRIPTORS
//   // This statement specifies default attributes REAL PICTURE '99999' for all names.
//   // Specifies all names in the scope of the DEFAULT statement. Consider the following example:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.220 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DEFAULT DESCRIPTORS BINARY;
//  DCL X ENTRY (FIXED, FLOAT);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-87.pli", async () => {
//   // Context:
//   //
//   // The ENTRY statement can define a secondary entry point to a procedure. Consider the following example:
//   //  of the procedure.
//   // entry point
//   //  and represents the
//   // Name
//   // example, the name of the procedure is
//   // An application must have exactly one external procedure that has OPTIONS(MAIN). In the following
//   // statement. A procedure can be a main procedure, a subroutine, or a function.
//   // A procedure is a sequence of statements delimited by a PROCEDURE statement and a corresponding END
//   // Procedures
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.145 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    Name: procedure;
//    B: entry;
//    end Name;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-562.pli", async () => {
//   // Context:
//   //
//   // Example
//   //  does not occur in the buffer, the result is zero.
//   // x
//   // If
//   //  is the null string, the result is zero.
//   // x
//   //  is zero or
//   // n
//   // If either the buffer length
//   // .
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.541 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl cb(128*1024) char(1);
//    dcl wb(128*1024) widechar(1);
//    dcl pos fixed bin(31);
//    /* 128K bytes searched from the right for a numeric */
//    pos = memsearchr( addr(cb), stg(cb), '012345789' );
//    /* 256K bytes searched from the right for a widechar '0' or '1' */
//    pos = memsearchr( addr(wb), stg(wb), '0030_0031'wx );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-563.pli", async () => {
//   // Context:
//   //
//   // Example
//   // appropriate.
//   // th position onwards, squeezed and trimmed as
//   // n
//   // any collapsing) and then all characters from the
//   // th character (without
//   // i
//   // • The target buffer will include all the characters in the source buffer before the
//   // • If the target buffer is large enough, the number of bytes that are written to the buffer is returned.
//   // • If the target buffer is not large enough, a value of -1 is returned.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.542 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl s  char(20);
//  dcl t  char(20);
//  dcl cx fixed bin(31);
  
//  s  = '...abc....def...gh..';
//  cx = memsqueeze(sysnull(), 0, addr(s), stg(s), '.');
//        /* cx = 12         */
//  cx = memsqueeze(addr(t), stg(t), addr(s), stg(s), '.');
//        /* cx = 12         */
//        /* t = '.abc.def.gh.' */
  
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-27.pli", async () => {
//   // Context:
//   //
//   //  in this example do compare as equal:
//   // C
//   //  and
//   // Z
//   // To the contrary,
//   //  compare as being equal:
//   // not
//   // the same internal hex representation, they do
//   // determine the length of the string. Consequently, although the strings in the following declarations have
//   // The null terminator held in a VARYINGZ string is not used in comparisons or assignments, other than to
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.83 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Z char(3) nonvarying init('abc');
//    dcl C char(3) varyingz init('abc');
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-692.pli", async () => {
//   // Context:
//   //
//   // Upper limits
//   // Lower limits
//   // (continued)
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   // 635
//   // Appendix A. Limits
//   // Limits
//   // Upper limits
//   // Lower limits
//   // (continued)
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.687 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl lower_01149 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '575870798DA1C0CB'x
//            || 'CDCECFD0DBDCDDDE'x
//         ) );
//  dcl upper_01149 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '7778807CAD5F4AEB'x
//            || 'EDEEEF5AFBFCFDFE'x
//         ) );
//  dcl lower_01155 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4951525354555657'x
//            || '586A709CA1C0CBCD'x
//            || 'CECFD0DBDDDEE0'x
//         ) );
//  dcl upper_01155 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6971727374757677'x
//            || '787C809E7B4AEBED'x
//            || 'EEEF5AFBFDFE7F'x
//         ) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-214.pli", async () => {
//   // Context:
//   //
//   // twentieth and the twenty-first centuries, it might be declared as follows:
//   // For example, if a structure is used to hold meteorological data for each month of the year for the
//   // levels, and members.
//   // , respectively. The elements of such an array are structures or unions having identical names,
//   // of unions
//   // array
//   //  or an
//   // array of structures
//   // Specifying the dimension attribute on a structure or union results in an
//   // Combinations of arrays, structures, and unions
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.237 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    Declare 1 Year(1901:2100),
//              3 Month(12),
//                5 Temperature,
//                  7 High decimal fixed(4,1),
//                  7 Low decimal fixed(4,1),
//                5 Wind_velocity,
//                  7 High decimal fixed(3),
//                  7 Low decimal fixed(3),
//               5 Precipitation,
//                 7 Total decimal fixed(3,1),
//                 7 Average decimal fixed(3,1),
//             3 * char(0);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-215.pli", async () => {
//   // Context:
//   //
//   //  are structures:
//   // B
//   //  and
//   // A
//   // contains members that are arrays. In the following example, both
//   // The need for subscripted qualified references becomes apparent when an array of structures or unions
//   // qualified reference.
//   // , which refers to the high temperature in March 1991, is a subscripted
//   // Temperature.High(1991,3)
//   // 1991.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.237 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     declare
//       1 A (2,2),
//         2 B (2),
//           3 C fixed bin,
//           3 D fixed bin,
//         2 E fixed bin;   
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-286.pli", async () => {
//   // Context:
//   //
//   // The EXIT statement stops the current thread.
//   // EXIT statement
//   // For details about the ENTRY statement, see “ENTRY statement” on page 96.
//   // The ENTRY statement specifies a secondary entry point of a procedure.
//   // ENTRY statement
//   // Normal termination of a program occurs when control reaches the END statement of the main procedure.
//   // If control reaches an END statement for a procedure, it is treated as a RETURN statement.
//   // “Procedures” on page 94 and “Begin-blocks” on page 112 for more details.)
//   // the only way to terminate a block's execution, even though each block must have an END statement. (See
//   // Execution of a block terminates when control reaches the END statement for the block. However, it is not
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.272 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  EXIT
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-329.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // The asterisk notation can also be used in a DECLARE statement, but has a different meaning there.
//   //  are all character strings of length 5.
//   // X
//   // elements of each generation of
//   //  has bounds (10,20); the second and third generations have bounds (10,10). The
//   // X
//   // The first generation of
//   // Consider the following example:
//   // dimension of the array, not just one of them.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.294 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl Y char(*) ctl,
//  N fixed bin;
//  N=20;
//  allocate Y char(N);
//  allocate Y;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-194.pli", async () => {
//   // Context:
//   //
//   // its associated name. For example, the items of a payroll record could be declared as follows:
//   // names are declared with level-numbers greater than 1. A delimiter must separate the level-number and
//   // A major structure name is declared with the level-number 1. Minor structures, unions, and elementary
//   // associated names. Level-numbers must be integers.
//   // A structure is described in a DECLARE statement through the use of level-numbers preceding the
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 176
//   // Cross sections of arrays
//   // represent an elementary variable or an array variable.
//   //  names, which can
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.228 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare 1 Payroll,                     /*  major structure name */
//              2 Name,                      /*  minor structure name */
//                3 Last char(20),           /*  elementary name      */
//                3 First char(15),
//              2 Hours,
//                3 Regular fixed dec(5,2),
//                3 Overtime fixed dec(5,2),
//              2 Rate,
//                3 Regular fixed dec(3,2),
//                3 Overtime fixed dec(3,2);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-317.pli", async () => {
//   // Context:
//   //
//   // interpreted as fixed-point binary.
//   //  is a reference to a piece of storage that contains a value to be
//   // X
//   // In the following example, a reference to
//   // required and how it is interpreted.
//   // All variables require storage. The attributes specified for a variable describe the amount of storage
//   // Chapter 9. Storage control
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 236
//   // XPROCEDURE
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.288 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X fixed binary(31,0) automatic;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-12.pli", async () => {
//   // Context:
//   //
//   // DECIMAL with a PRECISION of five digits, four to the right of the decimal point:
//   //  has the programmer-defined data attributes of FIXED and
//   // Pi
//   // In the following example, the variable
//   // 1E0 (a decimal floating-point constant).
//   // fixed-point constant), '1'B (a bit constant), '1' (a character constant), 1B (binary fixed-point constant), or
//   // The constant 1.0 (a decimal fixed-point constant) is different from the constants 1 (another decimal
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 18
//   // Nondata attributes
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.70 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Pi fixed decimal(5,4) initial(3.1416);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-385.pli", async () => {
//   // Context:
//   //
//   // containing the names of the weekdays.
//   //  strings
//   // varyingz
//   //  is initialized with the addresses of character
//   // pdays
//   // In the following example,
//   // indicated by the TO keyword.
//   // the address of the string specified in the INITIAL LIST. Also specifies that the string has the attributes
//   // Use only with static native pointers. Specifies that the pointer (or array of pointers) is initialized with
//   // INITIAL TO
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.321 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     dcl pdays(7) static ptr init to(varyingz)
//                    ('Sunday',
//                     'Monday',
//                     'Tuesday',
//                     'Wednesday',
//                     'Thursday',
//                     'Friday',
//                     'Saturday'  );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-153.pli", async () => {
//   // Context:
//   //
//   //  is valid.
//   // x(1).b(2)
//   // However, given the following typed structure, only
//   // Example 2
//   //  have the same meaning.
//   // a(1,2).b
//   // , and
//   // a.b(1,2)
//   // ,
//   // a(1).b(2)
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.196 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    define structure
//      1 t,
//        2 b(4) fixed bin,
//        2 c(5) fixed bin;
//    dcl x(3) type t;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-152.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // Example 1
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 144
//   // Typed structure qualification
//   // For details, see “Combinations of arrays, structures, and unions” on page 186.
//   // structures or unions that have identical names, levels, and members.
//   // You can specify the dimension attribute on typed structures or unions. The resulting arrays contain
//   // Combinations of arrays and typed structures or unions
//   // attribute” on page 142, the following code obtains the system date and displays the time:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.196 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl 1 a(3),
//          2 b(4) fixed bin,
//          2 c(5) fixed bin;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-31.pli", async () => {
//   // Context:
//   //
//   // false. However, if the window started at 1950, the comparison would return true.
//   // statement is 'windowed'. This means that if the window started at 1900, the comparison would return
//   // In the following code fragment, if the DATE attribute is honored, the comparison in the second display
//   // WINDOW compile-time option.
//   //  you specify in the
//   // window
//   // comparable representation. This process converts 2-digit years using the
//   // Implicit commoning means that the compiler generates code to convert the dates to a common,
//   // which are discussed later.
//   // comparand is generally treated as if it had the same DATE attribute, although some exceptions apply
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.93 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//      dcl a   pic'(6)9' date;
//      dcl b   pic'(6)9' def(a);
//      dcl c   pic'(6)9' date;
//      dcl d   pic'(6)9' def(c);
//      b = '670101';
//      d = '010101';
//      display( b || ' < ' || d || ' ?' );
//      display( a < c );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-629.pli", async () => {
//   // Context:
//   //
//   // This example is based on the following code fragment:
//   // Example of using XMLCHAR
//   // case in which they were declared.
//   // CASE(ASIS) suboption of the XML compiler option can be used to specify that the names appear in the
//   // By default the names of the variables in the generated XML output are all in upper case. The
//   // Note:
//   // • Leading and trailing blanks are trimmed wherever possible.
//   // • Numeric and bit data is converted to character.
//   // • When a variable has the XMLOMIT attribute, the field is omitted if it has a null value.
//   // structure.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.634 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//      dcl buffer   char(800);
//      dcl written  fixed bin(31);
//      dcl next     pointer;
//      dcl left     fixed bin(31);
//      dcl
//        1 a,
//         2 a1,
//           3 b1 char(8),
//           3 b2 char(8),
//         2 a2,
//           3 c1 fixed bin,
//           3 c2 fixed dec(5,1);
//      b1 = ' t1';
//      b2 = 't2';
//      c1 = 17;
//      c2 = -29;
//      next = addr(buffer);
//      left = stg(buffer);
//      written = xmlchar( a, next, left );
//      next += written;
//      left -= written;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-291.pli", async () => {
//   // Context:
//   //
//   // This example is based on the following declarations.
//   // Example
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 224
//   // IF
//   // AND or OR infix operators will also be short-circuited.
//   // Naturally, an expression formed (possibly recursively) from the above and the NOT prefix operator and the
//   // – VALIDDATE
//   // – VALID
//   // – UNALLOCATED
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.276 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//      dcl A   bit(1);
//      dcl B   bit(1);
//      dcl C   bit(2);
//      dcl D   bit(2);
//      dcl P   pointer;
//      dcl BX  based fixed bin(31);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-530.pli", async () => {
//   // Context:
//   //
//   // Example 1
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 448
//   // HBOUNDACROSS
//   // HEXIMAGE built-in function.
//   //  in storage. If an exact image is required, use the
//   // x
//   // This function does not return an exact image of
//   // Note:
//   // bytes will be converted.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.500 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Sweet char(5) init('Sweet');
//    dcl Sixteen fixed bin(31) init(16) littleendian;
//    dcl XSweet char(size(Sweet)*2+(size(Sweet)-1)/4);
//    dcl XSixteen char(size(Sixteen)*2+(size(Sixteen)-1)/4);
//    XSweet = hex(Sweet,'-');
//               /* '53776565-74' */
//    XSweet = heximage(addr(Sweet),length(Sweet),'-');
//               /* '53776565-74' */
//    XSixteen = hex(Sixteen,'-');
//               /* '00000010' - bytes reversed */
//    XSixteen = heximage(addr(Sixteen),stg(Sixteen),'-');
//               /* '10000000' - bytes NOT reversed */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-399.pli", async () => {
//   // Context:
//   //
//   // file constants. The file constants can subsequently be assigned to the file variable.
//   //  are declared as
//   // Acct2
//   //  and
//   // Acct1
//   //  is declared as a file variable, and
//   // Account
//   // In the following declaration,
//   // 46.
//   // The VARIABLE attribute is implied under the circumstances described in “VARIABLE attribute” on page
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.331 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Account file variable,
//      Acct1 file,
//      Acc2 file;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-471.pli", async () => {
//   // Context:
//   //
//   // 329
//   // Chapter 14. Picture specification characters
//   // Digits and decimal points
//   // each of which is a digit (0 through 9). See the following example:
//   // A string of n 9 picture characters specifies that the item is a nonvarying character-string of length n,
//   // character data because the corresponding character cannot be a blank for character data.)
//   // 9 picture specification character for numeric character data is different from the specification for
//   // Specifies that the associated position in the data item contains a decimal digit. (Note that the
//   // 9
//   // decimal values.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.381 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl digit picture'9',
//        Count picture'999',
//        XYZ picture '(10)9';
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-183.pli", async () => {
//   // Context:
//   //
//   // BINARY:
//   // For example, the following statement specifies precision for identifiers already known to be FIXED
//   // precision for FIXED DECIMAL names is to be (8,3).
//   //  influenced by the default statement, because this statement specifies only that the default
//   // not
//   // It is
//   // If it is not declared explicitly, I is given the language-specified default attributes FIXED BINARY(15,0).
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 170
//   // DEFAULT
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.222 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DFT RANGE(*) VALUE(FIXED BINARY(31));
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-236.pli", async () => {
//   // Context:
//   //
//   // This code sums up all the row elements:
//   // Example 1
//   // These examples illustrate the structure assignment using the BY DIMACROSS option.
//   // Example of assigning a structure using BY DIMACROSS
//   // The second assignment statement is the same as the following statement:
//   //  2
//   // The first assignment statement is the same as the following statements:
//   //  1
//   //  2
//   //  1
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.257 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     dcl
//       1 x,
//          2 a fixed bin(31),
//          2 b fixed bin(31),
//          2 c fixed bin(31),
//          2 d fixed bin(31);
//     dcl 1 xa(17) dimacross like x;
//     dcl jx fixed bin;
//     x = 0;
//     do jx = lboundacross( xa ) to hboundacross( xa );
//        x = x + xa, by dimacross( jx );
//     end;                             
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-209.pli", async () => {
//   // Context:
//   //
//   //  would be ambiguous:
//   // aa3_array
//   // resolved, otherwise the reference
//   // The following example is valid, but only because the LIKE references are expanded after they are all
//   // 181
//   // Chapter 7. Data declarations
//   // Assignments to UNIONs
//   // :
//   // F
//   //  is declared before
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.233 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl 1 aa(30)                           
//       ,5 aa1               char( 5)       
//       ,5 aa2               fixed bin(31)  
//       ,5 aa3_array(30)                    
//         ,7 aa3_1           fixed dec(15,2)
//         ,7 aa3_2           fixed dec(15,2)
//         ,7 aa3_3           fixed dec(11,4)
//         ,7 aa3_4           fixed dec(7,3) 
//      ;  
//    dcl bb                  like aa;          
//    dcl cc                  like 
//  aa3_array;                                                                           
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-208.pli", async () => {
//   // Context:
//   //
//   // :
//   // F
//   //  is declared before
//   // E
//   //  and
//   // C
//   //  is declared before
//   // B
//   // The following declarations are valid, but only because
//   //  have the results shown in the following example:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.232 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     dcl 1 a, 2 a1 fixed bin; 
//     dcl 1 b, 2 b1 like a;    
//     dcl 1 c, 2 c1 like b;    
                              
//     dcl 1 d, 2 d1 fixed bin; 
//     dcl 1 e  like d;         
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-393.pli", async () => {
//   // Context:
//   //
//   // .
//   // 3.1416
//   //  is allocated, it is initialized to the value
//   // Pi
//   // In the following example, when
//   // (padded on the right to 10 characters) is assigned to it.
//   // 'John Doe'
//   // , the character constant
//   // Name
//   // In the following example, when storage is allocated for
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.324 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Pi fixed dec(5,4) init(3.1416);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-392.pli", async () => {
//   // Context:
//   //
//   // (padded on the right to 10 characters) is assigned to it.
//   // 'John Doe'
//   // , the character constant
//   // Name
//   // In the following example, when storage is allocated for
//   // These examples illustrate how variables are initialized upon allocation.
//   // Examples
//   // the initial values are not assigned; for area variables, the area is not implicitly initialized to EMPTY.
//   // When storage for based variables is allocated through the ALLOCATE or the AUTOMATIC built-in functions,
//   // LOCATE statements for based variables), any specified initial value is assigned with each allocation.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.324 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Name char(10) init('John Doe');
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-300.pli", async () => {
//   // Context:
//   //
//   // The %PAGE directive allows you to start a new page in the compiler source listings.
//   // %PAGE directive
//   // organization,” on page 89.
//   // For details about the PACKAGE statement, see “Packages” on page 91 in Chapter 5, “Program
//   // declarations and procedures contained in the package, unless the names are declared again.
//   // The PACKAGE statement defines a package. A package forms a name scope that is shared by all
//   // PACKAGE statement
//   // For details about the OTHERWISE statement, see “SELECT statement” on page 232.
//   // preceding WHEN statements fails.
//   // In a select-group, the OTHERWISE statement specifies the unit to be executed when every test of the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.279 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  %PAGE
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-166.pli", async () => {
//   // Context:
//   //
//   // See the following example:
//   // to uppercase.
//   // The environment name must be a character string constant, and is used as is without any translation
//   // the compilation unit. The environment name is known instead.
//   // When so specified, the name being declared effectively becomes internal and is not known outside of
//   // Specifies the name by which the procedure or variable is known outside of the compilation unit.
//   // environment-name
//   // : INT for INTERNAL, EXT for EXTERNAL
//   // Abbreviations
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.206 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X entry external ('koala');
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-28.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // converted to an arithmetic value.
//   // Numeric picture specification describes a character string that can be assigned only data that can be
//   // fixed-point or floating-point value.
//   // attribute with a numeric picture specification. The data item is the character representation of a decimal
//   // A numeric character data item is the value of a variable that has been declared with the PICTURE
//   // Numeric character data
//   // • The use of WX can limit the portability of a program.
//   // '0031'wx (and not as '3100'wx).
//   // format). So, for example, the widechar value for the character '1' should always be specified as
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.91 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Price picture '999V99';
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-29.pli", async () => {
//   // Context:
//   //
//   // digits, signs, and the location of the assumed decimal point are assigned. Consider the following example:
//   // arithmetic variable, the editing characters are not included in the assignment operation—only the actual
//   // assignment operation. However, if a numeric character item is assigned to another numeric character or
//   // when the item is printed or treated as a character string, the editing characters are included in the
//   // numeric character data item, and such characters are actually stored within the data item. Consequently,
//   // arithmetic items or character strings are processed. Editing characters can be specified for insertion into a
//   // on the decimal point like coded arithmetic data, it is processed differently from the way either coded
//   // Although numeric character data is in character form, like character strings, and although it is aligned
//   // automatically, but they require extra processing time.
//   // be converted either to decimal fixed-point or to decimal floating-point format. Such conversions are done
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.91 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Price picture '$99V.99',
//            Cost character (6),
//            Amount fixed decimal (6,2);
//    Price = 12.28;
//    Cost = '$12.28';
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-516.pli", async () => {
//   // Context:
//   //
//   //  is too short to contain the result.
//   // y
//   // This example shows a conversion from graphic to character. However,
//   // Example 2
//   // .A.B.C.D.E.F
//   // .A.B.C.D.E.F
//   // .A.B.C.D.E.F
//   // A is assigned
//   // Intermediate Result
//   // For X with value
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.472 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X graphic(6);
//    dcl A char (12);
//    A = char(X,11);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-679.pli", async () => {
//   // Context:
//   //
//   // preprocessor output generated is as follows:
//   // value replaces the function reference and the result is inserted into the preprocessor output. Thus, the
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 624
//   // Preprocessor examples
//   // and returns the concatenated value, that is, the string Z (3), to the point of invocation. The returned
//   // corresponding parameter. VALUE then performs a concatenation of these arguments and the parentheses
//   // in a previous assignment statement), and 3 is converted to fixed-point to conform to the attribute of its
//   // However, before the arguments A and 3 are passed to VALUE, A is replaced by its value Z (assigned to A
//   // name.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.676 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DECLARE (Z(10),Q) FIXED;
//  Q = 6+Z(       3);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-191.pli", async () => {
//   // Context:
//   //
//   // Consider the following declaration:
//   // These examples help you understand declarations of arrays and array dimensions.
//   // Examples of arrays
//   // Declaration 2
//   // Declaration 1
//   // As an example, the following declarations are equivalent:
//   // built-in functions.
//   // an array in a BY DIMACROSS assignment or as an argument to the LBOUNDACROSS or HBOUNDACROSS
//   // attribute is not an array. The children of the variable are arrays. However, the variable might be used as
//   // Unlike a variable declared with the DIMENSION attribute, a variable declared with the DIMACROSS
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.225 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare List fixed decimal(3) dimension(8);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-380.pli", async () => {
//   // Context:
//   //
//   // V is a two-dimensional array that consists of all the elements in the character string A.
//   // Examples
//   // Aggregates of fixed-length widechar variables
//   // Fixed-length widechar variables
//   // • The widechar class, which consists of the following variables:
//   // Aggregates of fixed-length uchar variables
//   // Fixed-length uchar variables
//   // • The uchar class, which consists of the following variables:
//   // Aggregates of fixed-length graphic variables
//   // Fixed-length graphic variables
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.317 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL B(10) CHAR(1),
//      W CHAR(10) DEF B;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-528.pli", async () => {
//   // Context:
//   //
//   // contain the result.
//   // This example shows a conversion from CHARACTER to GRAPHIC. However, the target is too short to
//   // Example 2
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 446
//   // GRAPHIC
//   // b is a DBCS blank.
//   // .
//   // where
//   // A is assigned
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.498 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X char (10) varying;
//    dcl A graphic (8);
//    A = graphic(X);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-486.pli", async () => {
//   // Context:
//   //
//   // Example 1
//   // variable when the ON-unit is established.
//   // An ON statement that specifies a file variable refers to the file constant that is the current value of the
//   // ON-units for file variables
//   // situation, use the following technique:
//   // to be exceeded, a message is printed and the application is terminated. To avoid a loop caused by this
//   // raising the ERROR condition again. In any situation where a loop can cause the maximum nesting level
//   // A loop can occur if an ERROR condition raised in an ERROR ON-unit executes the same ERROR ON-unit,
//   // environment of the ON-unit in which the condition was raised.
//   // descendent ON-unit. A normal return from a dynamically descendent ON-unit reestablishes the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.396 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl  F file,
//       G file variable;
//       G = F;
//  L1:  on endfile(G);
//  L2:  on endfile(F);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-22.pli", async () => {
//   // Context:
//   //
//   // Consider this example:
//   // The data attributes for declaring decimal floating-point variables are DECIMAL and FLOAT.
//   // Decimal floating-point data
//   // )
//   // z/OS
//   //  (
//   // (109)
//   // 1Q0b
//   // )
//   // AIX
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.79 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Light_years decimal float(5);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-23.pli", async () => {
//   // Context:
//   //
//   // 15:
//   //  as a variable that can represent character data with a length of
//   // User
//   // The following statement declares
//   // Examples
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 30
//   // BIT, CHARACTER, GRAPHIC, UCHAR and WIDECHAR
//   // See “REFER option (self-defining data)” on page 251 for the description of the REFER option.
//   // REFER
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.82 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare User character (15);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-115.pli", async () => {
//   // Context:
//   //
//   // applied only for the second parameter.
//   // Defaults are not applied if an asterisk is specified. For example, in the following declaration, defaults are
//   // order.
//   // parameter, but the structuring must be identical. The attributes for a particular level can appear in any
//   // For a structure-union descriptor, the descriptor level-numbers need not be the same as those of the
//   // structure-union-descr (structure-union-descriptor)
//   // See “OPTIONAL attribute” on page 117.
//   // OPTIONAL
//   // No conversions are done.
//   // • OPTIONAL
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.167 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X entry(* optional, aligned); /* defaults applied for 2nd parm */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-548.pli", async () => {
//   // Context:
//   //
//   // Example
//   //  must have the type CHARACTER(1) NONVARYING type.
//   // z
//   // Expression. If specified,
//   // z
//   // the attributes FIXED BINARY(31,0), it is converted to them.
//   //  does not have
//   // n
//   //  must have a computational type and should have a character type. If
//   // n
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.525 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Source char value('One Hundred SCIDS Marks');
//    dcl Target char(30);
//    Target = left (Source, length(Target), '*');
//               /* 'One Hundred SCIDS Marks*******'               */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-549.pli", async () => {
//   // Context:
//   //
//   // Example
//   // options, it returns a FIXED BIN(31) value.
//   // Under the CMPAT(V3) compiler option, LOCATION returns a FIXED BIN(63) value. Under all other CMPAT
//   //  that must have a constant value.
//   // y
//   // • The value of a variable
//   //  that must have constant extents.
//   // y
//   // • The extent of a variable
//   //  if LOC(x) is used to set either of the following:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.526 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl 1 Table static,
//          2 Tab2loc fixed bin(15) nonasgn init(loc(Tab2)),
//                      /* location is 0; gets initialized to 8  */
//          2 Tab3loc fixed bin(15) nonasgn init(loc(Tab3)),
//                      /* location is 2; gets initialized to 808 */
//          2 Length fixed bin nonasgn init(loc(End)),
//                      /* location is 4 */
//          2 * fixed bin,
//          2 Tab2(20,20)    fixed bin,
//                      /* location is 8 */
//          2 Tab3(20,20)    fixed bin,
//                      /* location is 808 */
//          2 F2_loc fixed bin nonasgn init(loc(F2)),
//                      /* location is 1608; gets initialized to  1612 */
//          2 F2_bitloc fixed bin nonasgn init(bitloc(F2)),
//                      /* location is 1610; gets initialized to 1 */
//          2 Flags,        /* location is 1612 */
//            3 F1 bit(1),
//            3 F2 bit(1),  /* bitlocation is 1 */
//            3 F3 bit(1),
//          2 Bits(16) bit, /* location is 1613 */
//          2 End char(0);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-436.pli", async () => {
//   // Context:
//   //
//   // list. Consider the following example:
//   // The variable referenced in the STRING option should not be referenced by name or by alias in the data
//   // .
//   // Outprt
//   // write the record into the file
//   //  are assigned. The WRITE statement specifies that record transmission is used to
//   // Hours*Rate
//   // expression
//   //  and of the
//   // Pay#
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.354 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare S char(8) init('YYMMDD');
//    put string (S) edit
//        (substr (S, 3, 2), '/',
//        substr (S, 5, 2), '/',
//        substr (S, 1, 2))
//        (A);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-305.pli", async () => {
//   // Context:
//   //
//   // A common use of %PUSH and %POP directives is in included files and macros.
//   // first-out basis, by using the %POP directive.
//   // a “push down” stack on a last-in, first-out basis. You can restore this saved status later, also on a last-in,
//   // The %PUSH directive allows you to save the current status of the %PRINT and %NOPRINT directives in
//   // %PUSH directive
//   // The %PROCINC directive is used to override compiler options.
//   // “%PROCINC directive” on page 229
//   // Related information
//   // The *PROCINC directive is a synonym for the %PROCINC directive.
//   // *PROCINC directive
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.281 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  %PUSH
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-239.pli", async () => {
//   // Context:
//   //
//   // :
//   // xa
//   // This code exchanges the entries in the first and seventeenth columns of
//   // Example 2
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 206
//   // Multiple assignments
//   // The assignment inside the loop is equivalent to the following statements:
//   // This code sums up all the row elements:
//   // Example 1
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.258 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     dcl
//       1 x,
//          2 a fixed bin(31),
//          2 b fixed bin(31),
//          2 c fixed bin(31),
//          2 d fixed bin(31);
//     dcl 1 xa(17) dimacross like x;
//     dcl y like x;
//     x = xa, by dimacross( 1  );
//     y = xa, by dimacross( 17 );
//     xa = y, by dimacross( 1  );
//     xa = x, by dimacross( 17 );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-403.pli", async () => {
//   // Context:
//   //
//   // This example illustrates attribute merging for an explicit opening of a file by using a file variable.
//   // Example of file variable
//   // PRINT, OUTPUT, and EXTERNAL.
//   // after implication are STREAM, PRINT, and OUTPUT. Attributes after default application are STREAM,
//   // Attributes after merge caused by execution of the OPEN statement are STREAM and PRINT. Attributes
//   // constant.
//   // This example illustrates attribute merging for an explicit opening of a file that is specified by a file
//   // Example of file constant
//   // RECORD
//   // KEYED
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.336 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Account file variable,
//            (Acct1,Acct2)  file
//            output;
//    Account = Acct1;
//    open file(Account) print;
//    Account = Acct2;
//    open file(Account) record unbuf;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-402.pli", async () => {
//   // Context:
//   //
//   // constant.
//   // This example illustrates attribute merging for an explicit opening of a file that is specified by a file
//   // Example of file constant
//   // RECORD
//   // KEYED
//   // OUTPUT, STREAM
//   // PRINT
//   // RECORD, KEYED
//   // DIRECT
//   // RECORD
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.336 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Listing file stream;
//    open file(Listing) print;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-379.pli", async () => {
//   // Context:
//   //
//   // Examples
//   // Aggregates of fixed-length widechar variables
//   // Fixed-length widechar variables
//   // • The widechar class, which consists of the following variables:
//   // Aggregates of fixed-length uchar variables
//   // Fixed-length uchar variables
//   // • The uchar class, which consists of the following variables:
//   // Aggregates of fixed-length graphic variables
//   // Fixed-length graphic variables
//   // • The graphic class, which consists of the following variables:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.317 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL A CHAR(100),
//      V(10,10) CHAR(1) DEF A;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-475.pli", async () => {
//   // Context:
//   //
//   // .
//   // 7.6200
//   // , but its arithmetic value is
//   // '762.00'
//   // printed, it appears as
//   //  is
//   // Rate
//   // In the following example, decimal point alignment during assignment occurs on the character V. If
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 332
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.384 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Rate picture '9V99.99';
//    Rate = 7.62;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-613.pli", async () => {
//   // Context:
//   //
//   // The following are invalid STRING targets:
//   // The following are valid STRING targets:
//   // STRINGOFGRAPHIC compiler options specifies that it should be CHARACTER.
//   // • If any of the base elements have the GRAPHIC type, then the type returned is GRAPHIC unless the
//   // • If any of the base elements are PICTUREs, then the type returned has CHARACTER type.
//   // The type of string returned has the same type as one of these base elements with these exceptions:
//   // • If applied to an array, all elements in the array are subject to the restrictions as described previously.
//   // – All widechar strings
//   // – All uchar strings
//   // – All graphic strings
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.606 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl
//      1 A,
//        2 B  bit(8) aligned,
//        2 C  bit(2),
//        2 D  bit(8) aligned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-181.pli", async () => {
//   // Context:
//   //
//   // These statements are equivalent to the following declaration:
//   // Consider the following example:
//   // integer, and can include the REFER option or can be specified as an asterisk.
//   // The size of AREA data, or length of BIT, CHARACTER, or GRAPHIC data can be an expression or an
//   // default of 15).
//   // attributes of FIXED BINART, but the precision 31 from the VALUE option (rather than the system
//   //  will receive the system default
//   // I
//   // I; and DEFAULT RANGE(*) VALUE( FIXED BIN(31) );, the variable
//   // attributes, but before the system defaults for size, length and precision. So, for example, given DCL
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.221 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DECLARE B FIXED DECIMAL(10),
//          C FLOAT DECIMAL(14),
//          A AREA(2000);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-180.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // integer, and can include the REFER option or can be specified as an asterisk.
//   // The size of AREA data, or length of BIT, CHARACTER, or GRAPHIC data can be an expression or an
//   // default of 15).
//   // attributes of FIXED BINART, but the precision 31 from the VALUE option (rather than the system
//   //  will receive the system default
//   // I
//   // I; and DEFAULT RANGE(*) VALUE( FIXED BIN(31) );, the variable
//   // attributes, but before the system defaults for size, length and precision. So, for example, given DCL
//   // These size, length and precision specifications in a VALUE clause are applied after the system default
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.221 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DEFAULT RANGE(A:C)
//          VALUE (FIXED DEC(10),
//                FLOAT DEC(14),
//                AREA(2000));
//  DECLARE B FIXED DECIMAL,
//          C FLOAT DECIMAL,
//          A AREA;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-375.pli", async () => {
//   // Context:
//   //
//   // Y is a character string that consists of the first 5 characters of B.
//   // element identified by the subscript expressions L, M, and N.
//   // A. X2 is a two-dimensional array that consists of the fifth plane of A. X3 is an element that consists of the
//   // X1 is a three-dimensional array that consists of the first two elements of each row, column and plane of
//   // Examples
//   // defined variable is a varying string of the same maximum length.
//   // A base variable can be, or can contain, a varying string, provided that the corresponding part of the
//   // In simple defining of an area, the size of the defined area must be equal to the size of the base area.
//   // the base string.
//   // In simple defining of a string, the length of the defined string must be less than or equal to the length of
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.316 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL C AREA(500),
//      Z AREA(500) DEF C;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-374.pli", async () => {
//   // Context:
//   //
//   // element identified by the subscript expressions L, M, and N.
//   // A. X2 is a two-dimensional array that consists of the fifth plane of A. X3 is an element that consists of the
//   // X1 is a three-dimensional array that consists of the first two elements of each row, column and plane of
//   // Examples
//   // defined variable is a varying string of the same maximum length.
//   // A base variable can be, or can contain, a varying string, provided that the corresponding part of the
//   // In simple defining of an area, the size of the defined area must be equal to the size of the base area.
//   // the base string.
//   // In simple defining of a string, the length of the defined string must be less than or equal to the length of
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.316 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL B CHAR(10),
//      Y CHAR(5) DEF B;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-506.pli", async () => {
//   // Context:
//   //
//   // The following example is not a multiple declaration:
//   // scopes.
//   // The abbreviations for built-in functions have separate declarations (explicit or contextual) and name
//   // • Any other qualifications on using the function or pseudovariable
//   // • A description of any arguments
//   // • A description of the value returned or, for a pseudovariable, the value set
//   // • A heading showing the syntax of the reference
//   // In general, each description has the following format:
//   // detailed descriptions for each function, subroutine, and pseudovariable.
//   // This section lists the built-in functions, subroutines, and pseudovariables in alphabetic order and provides
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.452 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl (Dim, Dimension) builtin;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-594.pli", async () => {
//   // Context:
//   //
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 538
//   // ROUND
//   // values:
//   // point instructions are used, these successive roundings of 3.1415926d0 would produce the following
//   // what a naive user expects. For example, if compiled with USAGE(ROUND(ANS)) and IEEE binary floating
//   // Note that under USAGE(ROUND(ANS)), the rounding is a base 2 rounding, and the results may not be
//   // where where b = 2 (=radix(x)) and e = exponent(x):
//   // Under the compiler option USAGE(ROUND(ANS)), the value of the result is given by the following formula,
//   // source.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.590 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//      dcl x float bin(53) init( 3.1415926d0 );
//      display( round(x,1) );  /* 4.000000000000000E+0000 */
//      display( round(x,2) );  /* 3.000000000000000E+0000 */
//      display( round(x,3) );  /* 3.000000000000000E+0000 */
//      display( round(x,4) );  /* 3.250000000000000E+0000 */
//      display( round(x,5) );  /* 3.125000000000000E+0000 */
//      display( round(x,6) );  /* 3.125000000000000E+0000 */
//      display( round(x,7) );  /* 3.156250000000000E+0000 */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-479.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // represents negative values. The T can appear anywhere a '9' picture specification character occurs.
//   // 337
//   // Chapter 14. Picture specification characters
//   // Credit, debit, overpunched and zero replacement
//   // the input data represents positive values, and one of the characters } through R if the input data
//   // On output, T specifies that the associated position contains one of the characters { through I if
//   // values, and that the characters } through R represent negative values.
//   // On input, T specifies that the characters { through I and the digits 0 through 9 represent positive
//   // T
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.389 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Credit picture 'ZZV9T';
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-478.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // character (-). The rules are identical to those for the currency symbol.
//   // Specifies the plus sign character (+) if the data value is >=0; otherwise, it specifies the minus sign
//   // S
//   // symbols” on page 333.
//   // For information about specifying a character as a currency symbol, refer to “Defining currency
//   // .
//   // 12.45
//   // . Its arithmetic value is
//   // '$12.45'
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.386 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Root picture 'S999';
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-94.pli", async () => {
//   // Context:
//   //
//   // entry variable that is used in a procedure reference, as in the following example:
//   // ) can also be assigned to an
//   // Readin
//   // . The entry constant (
//   // statement-3
//   //  and execution begins with
//   // Errt
//   // 99
//   // Chapter 5. Program organization
//   // Procedure activation
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.151 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Readin entry,
//            Ent1 entry variable;
//    Ent1 = Readin;
//    call Ent1;
//    call Readin;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-299.pli", async () => {
//   // Context:
//   //
//   // OTHERWISE statements.
//   // execution. It is often used to denote null action for THEN and ELSE clauses and for WHEN and
//   // The null statement causes no operation to be performed and does not modify sequential statement
//   // null statement
//   // 227
//   // Chapter 8. Statements and directives
//   // %NOPRINT
//   // the setting of various compiler options.
//   // Generated messages of severity S, E, or W might cause termination of compilation, depending upon
//   // Generated messages of severity U cause immediate termination of preprocessing and compilation.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.279 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-302.pli", async () => {
//   // Context:
//   //
//   // The %PRINT directive causes printing of the source listings to be resumed.
//   // %PRINT directive
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 228
//   // null
//   // For an example, see “%PUSH directive” on page 230.
//   // The most common use of the %PUSH and %POP directives is in included files and macros.
//   // the most recent %PUSH directive.
//   // The %POP directive allows you to restore the status of the %PRINT and %NOPRINT directives saved by
//   // %POP directive
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.280 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  %PRINT
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-165.pli", async () => {
//   // Context:
//   //
//   // .
//   // X
//   // procedure
//   // , as declared in
//   // 1
//   //  is
//   // B
//   // . The output for
//   // 2
//   // , which is
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.204 */


//    X: proc options(main);
//      dcl (A,B) char(1) init('1');
//      call Y;
//      return;
//      Y: proc;
//        dcl 1 C,
//            3 A char(1) init('2');
//        put data(A,B);
//        return;
//      end Y;
//    end X;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-150.pli", async () => {
//   // Context:
//   //
//   // a type as a variable name as well.
//   // Type names are also in a separate name space from declared names. Therefore, you can use the name of
//   //  is not.
//   // Y
//   //  is a valid reference, but
//   // B
//   // For example, given the following declares and definitions,
//   // cannot be referenced by themselves.
//   // names in a typical untyped structure, the names in a typed structure form their own “name space” and
//   // You reference a member of a typed structure using the . operator or a handle with the => operator. Unlike
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.195 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    define alias Hps pointer;
//    declare Hps type Hps;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-309.pli", async () => {
//   // Context:
//   //
//   // Qualify blocks can also be nested. For example, you can nest a qualify block inside the block above:
//   // PAINT.RED, PAINT.ORANGE, and so on. The name of the qualify block must be unique to its block.
//   // means you can declare a variable as having type PAINT.COLOR and that you can refer to the constants
//   // The names inside a qualify block must be unique to that block, but not to their containing blocks. This
//   // etc.
//   // define PAINT as a qualifier to the ORDINAL type COLOR and as a qualifier to the values RED, ORANGE,
//   // For example, the statements:
//   // DECLARE statements in it must specify scalars with the VALUE attribute.
//   // A qualify block can contain only DECLARE, DEFINE, and QUALIFY statements, and the only valid
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.282 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//      paint: qualify;
//      define ordinal color ( red, orange, yellow );
//      depth: qualify;
//      define ordinal intensity ( high, medium, low );
//      end depth;
//      end paint;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-532.pli", async () => {
//   // Context:
//   //
//   // Example 1
//   // HEXIMAGE8 built-in function.
//   //  in storage. If an exact image is required, use the
//   // x
//   // This function does not return an exact image of
//   // Note:
//   // 449
//   // Chapter 18. Built-in functions, pseudovariables, and subroutines
//   // HEX8
//   // bytes will be converted.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.501 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Sweet char(5) init('Sweet');
//    dcl Sixteen fixed bin(31) init(16) littleendian;
//    dcl XSweet char(size(Sweet)*2+(size(Sweet)-1)/4);
//    dcl XSixteen char(size(Sixteen)*2+(size(Sixteen)-1)/4);
//    XSweet = hex8(Sweet,'-');
//               /* '53776565-74'a */
//    XSweet = heximage8(addr(Sweet),length(Sweet),'-');
//               /* '53776565-74'a */
//    XSixteen = hex8(Sixteen,'-');
//               /* '00000010' - bytes reversed */
//    XSixteen = heximage8(addr(Sixteen),stg(Sixteen),'-');
//               /* '10000000' - bytes NOT reversed */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-473.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // The V character cannot appear more than once in a picture specification.
//   // specification. This can cause the assigned value to be truncated, if necessary, to an integer.
//   // of a picture specification of a floating-point decimal value), a V is assumed at the right end of the field
//   // If no V character appears in the picture specification of a fixed-point decimal value (or in the first field
//   // condition is raised if enabled.)
//   // at either end. (If significant digits are truncated on the left, the result is undefined and the SIZE
//   // aligned on the V character. Therefore, an assigned value can be truncated or extended with zero digits
//   // fractional value of the assigned value, after modification by the optional scaling factor F(±x), are
//   // does not specify that an actual decimal point or decimal comma is inserted. The integer value and
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.381 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Value picture 'Z9V999';
//    Value = 12.345;
//    dcl Cvalue char(5);
//    Cvalue = Value;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-687.pli", async () => {
//   // Context:
//   //
//   // Upper limits
//   // Lower limits
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   // code page that will be uppercased or lowercased.
//   //  denotes the
//   // c
//   // .
//   // c
//   //  for the supported values of
//   // upperc
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.682 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl lower_00037 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_00037 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_00273 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424445464748'x
//            || '4951525354555657'x
//            || '586A708C8D8E9CC0'x
//            || 'CBCDCECFD0DBDDDE'x
//         ) );
//  dcl upper_00273 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626465666768'x
//            || '6971727374757677'x
//            || '78E080ACADAE9E4A'x
//            || 'EBEDEEEF5AFBFDFE'x
//         ) );
//  dcl lower_00277 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454648'x
//            || '4951525354555657'x
//            || '586A8C8D8EA1C0CB'x
//            || 'CCCDCECFD0DBDDDE'x
//         ) );
//  dcl upper_00277 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656668'x
//            || '6971727374757677'x
//            || '787CACADAEFC7BEB'x
//            || 'ECEDEEEF5BFBFDFE'x
//         ) );
//  dcl lower_00278 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424445464849'x
//            || '525354555657586A'x
//            || '70798C8D8E9CA1C0'x
//            || 'CBCDCECFD0DBDDDE'x
//         ) );
//  dcl upper_00278 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626465666869'x
//            || '727374757677787C'x
//            || '80E0ACADAE9EFC7B'x
//            || 'EBEDEEEF5BFBFDFE'x
//         ) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-222.pli", async () => {
//   // Context:
//   //
//   // Example: The usage of the ASSERT COMPARE statement
//   // that are used in this example.
//   // The following example shows the usage of the ASSERT COMPARE statement. You must code the routines
//   // 197
//   // Chapter 8. Statements and directives
//   // statements. You must code the routines that are used in this example.
//   // The following example shows the usage of the ASSERT TRUE, ASSERT FALSE and ASSERT UNREACHABLE
//   // Example: The usage of the ASSERT TRUE, ASSERT FALSE and ASSERT UNREACHABLE statements
//   // • Any other type, then the strings will be null strings.
//   // • ORDINALs, then the strings will be their ORDINALNAME values.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parse(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.249 */


//  asserts: package;                                                             
                                                                                 
//     main: proc options(main);                                                    
                                                                                 
//       dcl n fixed bin;                                                           
                                                                                 
//       n = 1;                                                                     
//       assert compare(n,1);                                                       
//       assert compare(n,2) text("n not equal to 2");                                
//       assert unreachable;                                                        
//     end;                                                                         
                                                                                 
//     ibmpasc:                                                                     
//      proc( packagename_ptr, procname_ptr, assert_sourceline,                     
//      actual_addr, actual_length,                                                 
//      expected_addr, expected_length,                                             
//      text_addr, text_length )                                                    
//      ext( '_IBMPASC')                                                            
//      options( byvalue linkage(optlink) );                                        
                                                                                 
//      dcl packagename_ptr   pointer;                                              
//      dcl procname_ptr      pointer;                                              
//      dcl assert_sourceline fixed BINARY(31);                                        
//      dcl actual_addr       pointer;                                              
//      dcl actual_length     fixed BINARY(31);                                        
//      dcl expected_addr     pointer;                                              
//      dcl expected_length   fixed BINARY(31);                                        
//      dcl text_addr         pointer;                                              
//      dcl text_length       fixed BINARY(31);                                        
                                                                                 
//      dcl assert_packagename char(100) var based(packagename_ptr);                
//      dcl assert_procname char(100) var based(procname_ptr);                      
//      dcl assert_text char(text_length) based(text_addr);                         
//      dcl actual_text char(actual_length) based(actual_addr);                     
//      dcl expected_text char(expected_length)                                     
//                                          based(expected_addr);                   
                                                                                 
//      put skip edit( 'compare code hit on line ',                                 
//                     trim(assert_sourceline),                                     
//                     ' in ',                                                      
//                     assert_packagename,                                          
//                     ':', assert_procname )                                       
//                ( a );                                                            
                                                                                 
//      if text_length = 0 then;                                                    
//      else                                                                        
//         put skip list( assert_text );                                            
                                                                                 
//      if actual_length = 0 then;                                                  
//      else                                                                        
//         put skip list( actual_text );                                            
                                                                                 
//      if expected_length = 0 then;                                                
//      else                                                                        
//         put skip list( expected_text );                                          
                                                                                 
//    end;          
//    end;          
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-450.pli", async () => {
//   // Context:
//   //
//   // Example 2
//   // Output stream:
//   // Input stream:
//   // The following example shows data-directed transmission (both input and output).
//   // Example 1
//   // quotation mark contained within the character string is represented by two successive quotation marks.
//   // For character data, the contents of the character string are written out enclosed in quotation marks. Each
//   // expression.
//   // numeric character variable does not represent a valid optionally signed arithmetic constant or a complex
//   // Data-directed output is not valid for subsequent data-directed input when the character-string value of a
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.358 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl 1 A,
//          2 B FIXED,
//          2 C,
//            3 D FIXED;
//    A.B = 2;
//    A.D = 17;
//    put data (A);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-637.pli", async () => {
//   // Context:
//   //
//   // The preprocessor would produce the output text:
//   // replacement text and regular text. For example, suppose that the input text is as follows:
//   // . Such a null statement can be used to concatenate
//   // %;
//   // statement when it is specified in the form
//   // Preprocessor statements should be on separate lines from normal text. The one exception is the null
//   // delimiters.
//   // Replacement values must not contain % symbols, unmatched quotation marks, or unmatched comment
//   // been made.
//   // insertion of a value into the preprocessor output takes place only after all possible replacements have
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.647 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl BC fixed bin(31);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-196.pli", async () => {
//   // Context:
//   //
//   // and variant parts. For example, records in a client file can be declared as follows:
//   // Unions can be used to declare variant records that would typically contain a common part, a selector part,
//   // A union, like a structure, is declared through the use of level-numbers preceding the associated names.
//   // programmer determines which member is used.
//   // to the storage required by the largest member. Normally, only one member is used at any time and the
//   // level are members of the union and occupy the same storage. The storage occupied by the union is equal
//   // Like a structure, a union can be at any level including level 1. All elements of a union at the next deeper
//   // 177
//   // Chapter 7. Data declarations
//   // Unions
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.229 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    Declare 1 Client,
//              2 Number pic '999999',
//              2 Type bit(1),
//              2 * bit(7),
//              2 Name union,
//                3 Individual,
//                  5 Last_Name char(20),
//                  5 First_Name union,
//                    7 First   char(15),
//                    7 Initial char(1),
//                3 Company char(35),
//              2 * char(0);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-67.pli", async () => {
//   // Context:
//   //
//   // Examples
//   // • Type functions: BIND, CAST, FIRST, LAST, RESPEC, SIZE, and VALUE
//   // PROCEDURENAME, RANK, SOURCEFILE, SOURCELINE, and WCHARVAL
//   // – Miscellaneous functions: BYTE, CHARVAL, COLLATE, INDICATORS, PACKAGENAME, POPCNT,
//   // STORAGE, and SYSNULL
//   // – Storage-control functions: BINARYVALUE, LENGTH, NULL, OFFSETVALUE, POINTERVALUE, SIZE,
//   // LBOUNDACROSS
//   // – Array-handling functions: DIMACROSS, DIMENSION, HBOUND, HBOUNDACROSS, LBOUND, and
//   // – Precision-handling
//   // – Integer manipulation
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.124 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl Max_names fixed bin value (1000),
//        Name_size fixed bin value (30),
//        Addr_size fixed bin value (20),
//        Addr_lines fixed bin value (4);
//    dcl 1 Name_addr(Max_names),
//          2 Name char(Name_size),
//          2 * union,
//            3 Address char(Addr_lines*Addr_size), /* address    */
//            3 addr(Addr_lines) char(Addr_size),
//          2 * char(0);
//    dcl One_Name_addr char(size(Name_addr(1)));   /* 1 name/addr*/
//    dcl Two_Name_addr char(length(One_Name_addr)
//                           *2);                /* 2 name/addrs  */
//    dcl Name_or_addr char(max(Name_size,Addr_size)) based;
//    dcl Ar(10) pointer;
//    dcl Ex     entry( dim(lbound(Ar):hbound(Ar)) pointer);
//    dcl Identical_to_Ar( lbound(Ar):hbound(Ar) ) pointer;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-315.pli", async () => {
//   // Context:
//   //
//   // The STOP statement stops the current application.
//   // STOP statement
//   // %PAGE directive is executed in place of the %SKIP directive.
//   //  is greater than the number of lines remaining on the page, the equivalent of a
//   // n
//   // the default is 1. If
//   //  is omitted,
//   // n
//   // Specifies the number of lines to be skipped. It must be an integer in the range 1 - 999. If
//   // n
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.285 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  STOP
//  ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-172.pli", async () => {
//   // Context:
//   //
//   // declaration:
//   // specified for the corresponding parameter in the invoked procedure. For example, consider the following
//   // If no description list is given in an ENTRY declaration, the attributes for the argument must match those
//   // alignment attributes are shown in Table 8 on page 21 and Table 7 on page 19.
//   // precision as indicated in Table 40 on page 168. The language-specified defaults for scope, storage and
//   // If a precision is not specified in an arithmetic declaration, the DEFAULT compiler option determines the
//   // with the attributes FIXED BINARY(p,q).
//   // attributes. Therefore, a declaration with the attributes BINARY(p,q) is always equivalent to a declaration
//   // If a scaling factor is specified in the precision attribute, the attribute FIXED is applied before any other
//   // • If DEFAULT(ANS) is in effect, all variables are given the attributes REAL FIXED BINARY(31,0).
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.218 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X entry;
//    call X( 1 );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-387.pli", async () => {
//   // Context:
//   //
//   // For example, consider the declaration:
//   // set of initial values for a structure element in the array.
//   // attribute specifies a series of comma lists of expressions where each comma list in turn specifies the
//   // members are scalars in a way that makes it easy to add or delete elements to those arrays. The
//   // The INITACROSS attribute helps initialize one-dimensional arrays of structures where all the structure
//   // INITACROSS
//   //  in the preceding example, the following assignment is illegal:
//   // pdays
//   // in read-only storage and an attempt to change it could result in a protection exception. Given the array
//   // You should not change a value identified by a pointer initialized with INITIAL TO. The value can be placed
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.321 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//               dcl
//                 1 a(3)
//                   ,2 b     char(2)
//                                    init( 'DE', 'FR', 'SP' )
//                   ,2 c     char(40) var
//                                    init( 'Germany', 'France', 'Spain' )
//                 ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-25.pli", async () => {
//   // Context:
//   //
//   // .
//   // Zuser
//   //  and 16 bytes for
//   // User
//   // bytes for
//   //  is null-terminated. The storage allocated is 17
//   // Zuser
//   // ,
//   // User
//   // a maximum length of 15. However, unlike
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.82 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare User character (15) varying;
//    declare Zuser character (15) varyingz;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-480.pli", async () => {
//   // Context:
//   //
//   // the following example:
//   // input data represents negative values; otherwise, it contains one of the digits 0 through 9. Consider
//   // On output, R specifies that the associated position contains one of the characters } through R if the
//   // through 9 represent positive values.
//   // On input, R specifies that the characters } through R represent negative values and the digits 0
//   // R
//   // input data represents positive values; otherwise, it contains one of the digits, 0 through 9.
//   // On output, I specifies that the associated position contains one of the characters { through I if the
//   // values.
//   // On input, I specifies that the characters { through I and the digits 0 through 9 represent positive
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.389 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl X fixed decimal(3);
//    get edit (x) (P'R99');
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-24.pli", async () => {
//   // Context:
//   //
//   // The following example shows the declaration of a bit variable:
//   // 15:
//   //  as a variable that can represent character data with a length of
//   // User
//   // The following statement declares
//   // Examples
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 30
//   // BIT, CHARACTER, GRAPHIC, UCHAR and WIDECHAR
//   // See “REFER option (self-defining data)” on page 251 for the description of the REFER option.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.82 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare Symptoms bit (64);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-589.pli", async () => {
//   // Context:
//   //
//   // substring f in the string x will be replaced by the substring t.
//   // BINARY(31,0). The default value for i is 1. i must be non-negative. If i is 0, all occurrences of the
//   // be replaced by the substring t. i must have a computational type and is converted to FIXED
//   // An optional expression that specifies the maximum number of times that the substring f should
//   // i
//   // STRINGRANGE condition will be raised if enabled, and the result will be a null character string.
//   // BINARY(31,0). The default value for n is 1. If n is less than 1 or greater than the length(x), the
//   // begins searching for the substring f. n must have a computational type and is converted to FIXED
//   // An optional expression that specifies a location within the string x, from where the compiler
//   // n
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.587 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl ein char(50) var init( 'reserved from #date# till #date#.' );          
//  dcl aus char(80) var;                                                       
                                                                             
//  dcl f   char(6);                                                            
//  dcl t   char(10);                                                           
                                                                             
//  f = '#date#';                                                               
//  t = '2018/05/01';                                                           
                                                                             
//  aus = replace( ein, f, t );                                                 
//        /* 'reserved from 2018/05/01 till #date#.' */                         
//  aus = replace( ein, f, t, 16 );                                             
//        /* 'reserved from #date# till 2018/05/01.' */                         
//  aus = replace( ein, f, t, 1, 2 );                                            
//        /* 'reserved from 2018/05/01 till 2018/05/01.' */                     
//  aus = replace( ein, f, t, 16, 1 );                                          
//        /* 'reserved from #date# till 2018/05/01.' */                         
//  aus = replace( ein, f, t, 1, 0 );                                           
//        /* 'reserved from 2018/05/01 till 2018/05/01.' */      
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-147.pli", async () => {
//   // Context:
//   //
//   // that gets a handle to this typed structure:
//   // ), and declares the C function
//   // tm
//   // The following example defines several named types, a structure type (
//   // Example 2
//   // previous DEFINE ALIAS statement. See the following example:
//   // The TYPE attribute can be used in a DEFINE ALIAS statement to specify an alias for a type defined in a
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 142
//   // HANDLE attribute
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.194 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//     define alias int     fixed bin(31);
//     define alias time_t  fixed bin(31);
//     define structure
//       1 tm
//        ,2 tm_sec   type int    /* seconds after the minute (0-61)     */
//        ,2 tm_min   type int    /* minutes after the hour (0-59)       */
//        ,2 tm_hour  type int    /* hours since midnight (0-23)         */
//        ,2 tm_mday  type int    /* day of the month (1-31)             */
//        ,2 tm_mon   type int    /* months since January (0-11)         */
//        ,2 tm_year  type int    /* years since 1900                    */
//        ,2 tm_wday  type int    /* days since Sunday (0-6)             */
//        ,2 tm_yday  type int    /* days since January 1 (0-365)        */
//        ,2 tm_isdst type int    /* Daylight Saving Time flag           */
//        ;
//     dcl localtime    ext('localtime')
//                 entry( nonasgn byaddr type time_t )
//                 returns( byvalue handle tm );
//     dcl time    ext('time')
//                 entry( byvalue pointer )
//                 returns( byvalue type time_t );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-321.pli", async () => {
//   // Context:
//   //
//   // . PL/I does not resolve this type of declaration dependency.
//   // Str2
//   // , but not for
//   // Str1
//   // allocated is correct for
//   // either to a restricted expression or to an initialized static variable. In the following example, the length
//   //  be initialized
//   // N
//   // If the declare statements are located in the same block, PL/I requires that the variable
//   //  is invoked.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.290 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl N fixed bin (15) init(10),
//      M fixed bin (15) init(N),
//      Str1 char(N),
//      Str2 char(M);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-146.pli", async () => {
//   // Context:
//   //
//   // previous DEFINE ALIAS statement. See the following example:
//   // The TYPE attribute can be used in a DEFINE ALIAS statement to specify an alias for a type defined in a
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 142
//   // HANDLE attribute
//   // Consider the following code:
//   // Example 1
//   // Specifies the name of a QUALIFY block.
//   // y
//   // Specifies the name of a previously defined alias, defined structure, or ordinal type.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.194 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    define alias Word fixed bin(31);
//    define alias Short type word;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-52.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // A pseudovariable represents a target field.
//   // Pseudovariables
//   // 53
//   // Chapter 3. Expressions and references
//   // Order of evaluation
//   // and record I/O statements.
//   // assignment symbol (in this case A). Assignment to variables can also occur in stream I/O, DO, DISPLAY,
//   // , the target is the variable on the left of the
//   // A = B;
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.105 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    declare A character(10),
//            B character(30);
//    substr(A,6,5) = substr(B,20,5);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-690.pli", async () => {
//   // Context:
//   //
//   // Upper limits
//   // Lower limits
//   // (continued)
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   // 633
//   // Appendix A. Limits
//   // Limits
//   // Upper limits
//   // Lower limits
//   // (continued)
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.685 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl lower_00920 char
//    value( (
//               '6162636465666768'x
//            || '696A6B6C6D6E6F70'x
//            || '7172737475767778'x
//            || '797AE0E1E2E3E4E5'x
//            || 'E6E7E8E9EAEBECED'x
//            || 'EEEFF0F1F2F3F4F5'x
//            || 'F6F8F9FAFBFCFE'x
//         ) );
//  dcl upper_00920 char
//    value( (
//               '4142434445464748'x
//            || '494A4B4C4D4E4F50'x
//            || '5152535455565758'x
//            || '595AC0C1C2C3C4C5'x
//            || 'C6C7C8C9CACBCCCD'x
//            || 'CECFD0D1D2D3D4D5'x
//            || 'D6D8D9DADBDCDE'x
//         ) );
//  dcl lower_01026 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4951525354555657'x
//            || '586A709CA1C0CBCD'x
//            || 'CECFD0DBDDDEE0'x
//         ) );
//  dcl upper_01026 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6971727374757677'x
//            || '787C809E7B4AEBED'x
//            || 'EEEF5AFBFDFE7F'x
//         ) );
//  dcl lower_01047 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_01047 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACBAAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_01140 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_01140 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_01141 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424445464748'x
//            || '4951525354555657'x
//            || '586A708C8D8E9CC0'x
//            || 'CBCDCECFD0DBDDDE'x
//         ) );
//  dcl upper_01141 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626465666768'x
//            || '6971727374757677'x
//            || '78E080ACADAE9E4A'x
//            || 'EBEDEEEF5AFBFDFE'x
//         ) );
//  dcl lower_01142 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454648'x
//            || '4951525354555657'x
//            || '586A8C8D8EA1C0CB'x
//            || 'CCCDCECFD0DBDDDE'x
//         ) );
//  dcl upper_01142 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656668'x
//            || '6971727374757677'x
//            || '787CACADAEFC7BEB'x
//            || 'ECEDEEEF5BFBFDFE'x
//         ) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-691.pli", async () => {
//   // Context:
//   //
//   // Upper limits
//   // Lower limits
//   // (continued)
//   // Table 88. Supported code page values for LOWERCASE built-in function and UPPERCASE built-in function
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Language Reference
//   // 634
//   // Limits
//   // Upper limits
//   // Lower limits
//   // (continued)
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.686 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl lower_01143 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424445464849'x
//            || '525354555657586A'x
//            || '70798C8D8E9CA1C0'x
//            || 'CBCDCECFD0DBDDDE'x
//         ) );
//  dcl upper_01143 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626465666869'x
//            || '727374757677787C'x
//            || '80E0ACADAE9EFC7B'x
//            || 'EBEDEEEF5BFBFDFE'x
//         ) );
//  dcl lower_01144 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424345464749'x
//            || '52535556575A6A70'x
//            || '798C8D8E9CA1C0CB'x
//            || 'CCCECFD0DBDCDEE0'x
//         ) );
//  dcl upper_01144 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626365666769'x
//            || '727375767771ED80'x
//            || 'FDACADAE9E7864EB'x
//            || 'ECEEEF74FBFCFE68'x
//         ) );
//  dcl lower_01145 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4851525354555657'x
//            || '586A708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_01145 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6871727374757677'x
//            || '787B80ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_01146 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_01146 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  dcl lower_01147 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424345464749'x
//            || '5253555657586A70'x
//            || '7C8C8D8E9CC0CBCC'x
//            || 'CDCECFD0DBDCDEE0'x
//         ) );
//  dcl upper_01147 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626365666769'x
//            || '727375767778FD80'x
//            || '64ACADAE9E71EBEC'x
//            || 'EDEEEF74FBFCFE68'x
//         ) );
//  dcl lower_01148 char
//    value( (
//               '8182838485868788'x
//            || '8991929394959697'x
//            || '9899A2A3A4A5A6A7'x
//            || 'A8A9424344454647'x
//            || '4849515253545556'x
//            || '5758708C8D8E9CCB'x
//            || 'CCCDCECFDBDCDDDE'x
//         ) );
//  dcl upper_01148 char
//    value( (
//               'C1C2C3C4C5C6C7C8'x
//            || 'C9D1D2D3D4D5D6D7'x
//            || 'D8D9E2E3E4E5E6E7'x
//            || 'E8E9626364656667'x
//            || '6869717273747576'x
//            || '777880ACADAE9EEB'x
//            || 'ECEDEEEFFBFCFDFE'x
//         ) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-216.pli", async () => {
//   // Context:
//   //
//   // Consider the following union:
//   // member.
//   // the members requires different alignment and therefore different padding before the beginning of the
//   // that the first storage locations for each of the members of a union do not overlay each other if each of
//   // Each of the members, if not a union, is mapped as if it were a member of a structure. This means
//   // Individual members of a union are mapped the same way as members of the structure.
//   // Structure and union mapping
//   // • Storage control and those built-in functions and subroutines that allow structures.
//   // • Parameters and arguments
//   // But references to unions or structures that contain unions are limited to the following contexts:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.238 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl
//      1 A union,
//        2 B,
//          3 C char(1),
//          3 D fixed bin(31),
//        2 E,
//          3 F char(2),
//          3 G fixed bin(31),
//           2 H char(8);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-179.pli", async () => {
//   // Context:
//   //
//   // an attribute specification. Consider the following example:
//   // Attributes that conflict, when applied to a data item, do not necessarily conflict when they appear in
//   // The INITIAL attribute can be specified.
//   // the dimension attribute can be applied by default only to explicitly declared names.
//   // declared explicitly, a subscripted name is contextually declared with the attribute BUILTIN. Therefore,
//   // Although the DEFAULT statement can specify the dimension attribute for names that have not been
//   // following example:
//   // can be specified as an arithmetic constant or an expression and can include the REFER option. See the
//   // The dimension attribute is allowed, but only as the first item in an attribute specification. The bounds
//   // 169
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.221 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DEFAULT RANGE(S) BINARY VARYING;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-178.pli", async () => {
//   // Context:
//   //
//   // following example:
//   // can be specified as an arithmetic constant or an expression and can include the REFER option. See the
//   // The dimension attribute is allowed, but only as the first item in an attribute specification. The bounds
//   // 169
//   // Chapter 7. Data declarations
//   // DEFAULT
//   // If FILE is used, it implies the attributes VARIABLE and INTERNAL.
//   // list of attributes.
//   // Only those attributes that are necessary to complete the declaration of a data item are taken from the
//   // range. Attributes in the list can appear in any order and must be separated by blanks.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Language Reference v6.1, pg.221 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DFT RANGE(J) (5);
//  DFT RANGE(J) (5,5) FIXED;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-271.pli", async () => {
//   // Context:
//   //
//   // The following example shows a procedure-specific message filter control block:
//   // information back to the compiler indicating how a particular message should be handled.
//   // The procedure-specific control block contains information about the messages. It is used to pass
//   //  (severity code 4) messages.
//   // WARNING
//   // (severity code 8) or
//   // ERROR
//   // You can increase the severity of any of the messages but you can decrease the severity only of
//   // messages.
//   // The message filtering procedure permits you to either suppress messages or alter the severity of
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.518 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  Dcl 1 Uex_MFX native based,
//        2 Uex_MFX_Length   fixed bin(31),
//        2 Uex_MFX_Facility_Id  char(3),        /* of component writing
//                                                  message             */
//        2 *                    char(1),
//        2 Uex_MFX_Message_no   fixed bin(31),
//        2 Uex_MFX_Severity     fixed bin(15),
//        2 Uex_MFX_New_Severity fixed bin(15),  /* set by exit proc    */
//        2 Uex_MFX_Inserts                fixed bin(15),
//        2 Uex_MFX_Inserts_Data( 6 refer(Uex_MFX_Inserts) ),
//          3 Uex_MFX_Ins_Type             fixed bin(7),
//          3 Uex_MFX_Ins_Type_Data union unaligned,
//            4 *                          char(8),
//            4 Uex_MFX_Ins_Bin8           fixed bin(63),
//            4 Uex_MFX_Ins_Bin            fixed bin(31),
//            4 Uex_MFX_Ins_Str,
//              5 Uex_MFX_Ins_Str_Len      fixed bin(15),
//              5 Uex_MFX_Ins_Str_Addr     pointer(32),
//            4 Uex_MFX_Ins_Series,
//              5 Uex_MFX_Ins_Series_Sep   char(1),
//              5 Uex_MFX_Ins_Series_Addr  pointer(32);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-169.pli", async () => {
//   // Context:
//   //
//   // Table 94. PL/I equivalent for a C file
//   // What is needed is a pointer (or token) for a file, so this translation can be finessed as follows:
//   // Table 93. Start of the C declaration for its FILE type
//   // A C file declaration depends on the platform, but it often starts as follows:
//   // File type equivalence
//   // Table 92. Sample enum type equivalence
//   // .
//   // stdio.h
//   //  from the C header file
//   // __device_t
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.400 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//       define struct    1 file;
//       define alias     file_Handle  handle file;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-48.pli", async () => {
//   // Context:
//   //
//   // positions.
//   // This declaration gives the standard page size, line size, and tabulating
//   // Table 32. Declaration of PLITABS.
//   // NONASGN attribute can also be specified when compiling with NORENT.
//   // recommended that PLITABS should always be declared with the NONASGN attribute, because the
//   // If compiling with the RENT option, PLITABS must be declared with the NONASGN attribute. It is
//   // tabs set by the structure, and the Enterprise PL/I library code will not work correctly if this is not true.
//   // structure must are all valid. This field is supposed to hold the offset to the field specifying the number of
//   // If your code contains a declare for PLITABS, ensure that the values and the first field in the PLITABS
//   // information about overriding the tab table, see “Overriding the tab control table” on page 241.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.223 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL 1 PLITABS STATIC EXTERNAL NONASGN,
//    ( 2   OFFSET INIT (14),
//      2    PAGESIZE INIT (60),
//      2    LINESIZE INIT (120),
//      2    PAGELENGTH INIT (64),
//      2    FILL1 INIT (0),
//      2    FILL2 INIT (0),
//      2    FILL3 INIT (0),
//      2    NUMBER_OF_TABS INIT (5),
//      2    TAB1 INIT (25),
//      2    TAB2 INIT (49),
//      2    TAB3 INIT (73),
//      2    TAB4 INIT (97),
//      2    TAB5 INIT (121)) FIXED BIN (15,0);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-187.pli", async () => {
//   // Context:
//   //
//   // Table 113. Incorrect declaration of qsort
//   // be declared simply as follows:
//   //  function must not
//   // qsort
//   // But because C function pointers are not the same as PL/I ENTRY variables, the C
//   // Table 112. Sample code to use C qsort function
//   // following code fragment:
//   //  function could be used with this compare routine to sort an array of integers, as in the
//   // qsort
//   // And the C
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.405 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl qsort    ext('qsort')
//                 entry( pointer,
//                        fixed bin(31),
//                        fixed bin(31),
//                        entry returns( byvalue fixed bin(31) )
//                      )
//                 options( byvalue nodescriptor );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-2.pli", async () => {
//   // Context:
//   //
//   // Consider the following example:
//   // unprototyped function to a 2-byte FIXED BIN temporary and pass that temporary instead.
//   // But under NOBIN1ARG, the compiler assigns any 1-byte REAL FIXED BIN argument passed to an
//   // 25
//   // Chapter 1. Using compiler options and facilities
//   // Under BIN1ARG, the compiler passes a FIXED BIN argument as is to an unprototyped function.
//   // unprototyped function.
//   // This suboption controls how the compiler handles 1-byte REAL FIXED BIN arguments passed to an
//   // BIN1ARG | NOBIN1ARG
//   // attribute from a parent.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.81 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl f1 ext entry;
//  dcl f2 ext entry( fixed bin(15) );
//  call f1( 1b );
//  call f2( 1b );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-267.pli", async () => {
//   // Context:
//   //
//   // must execute the statement:
//   // The rules for the restart are the same as for a restart after a system failure. To request the restart, you
//   // You can request a restart at any point in your program.
//   // Automatic restart within a program
//   // automatic step restart without checkpoint processing if another system failure occurs.
//   // by specifying RD=RNC in the EXEC or JOB statement. By specifying RD=RNC, you are requesting an
//   // After a system failure occurs, you can still force automatic restart from the beginning of the job step
//   // of the job step, can still occur if you have specified RD=R in the EXEC or JOB statement.
//   // If a system failure occurs before any checkpoint has been taken, an automatic restart, from the beginning
//   // checkpoint if you have specified RD=R (or omitted the RD parameter) in the EXEC or JOB statement.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.512 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  CALL PLIREST;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-283.pli", async () => {
//   // Context:
//   //
//   // The declare for a CMPAT(V3) array descriptor is as follows:
//   // 469
//   // Chapter 26. PL/I descriptors
//   // The declare for a CMPAT(V2) array descriptor is as follows:
//   // The declare for a CMPAT(V1) array descriptor is as follows:
//   // that the actual upper bound will always match the number of dimensions in the array it describes.
//   // In the following declares, the upper bound for the arrays is declared as 15, but it should be understood
//   // Array descriptors
//   // The possible values for the codepage encoding are defined as follows:
//   // The declare for a string descriptor under CMPAT(V3) is as follows:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.525 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare
//    1 dso_v3  based,
//      2 dso_v3_rvo      fixed bin(63),    /* relative virtual origin */
//      2 dso_v3_data(1:15),
//        3 dso_v3_stride fixed bin(63),    /*   multiplier            */
//        3 dso_v3_hbound fixed bin(63),    /*   hbound                */
//        3 dso_v3_lbound fixed bin(63);    /*   lbound                */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-137.pli", async () => {
//   // Context:
//   //
//   // string:
//   //  is an input-only CHAR VARYINGZ
//   // getenv
//   // In the following declaration, for instance, the first parameter to
//   // (input-only parameters that can be passed in registers are best declared as BYVALUE).
//   // This practice is particularly useful for strings and other parameters that cannot be passed in registers
//   // pass the address of that static area.
//   // later called with a constant for that parameter, the compiler can put that constant in static storage and
//   // as NONASSIGNABLE (rather than letting it get the default attribute of ASSIGNABLE). If that procedure is
//   // If a procedure has a BYADDR parameter that it uses as input only, it is best to declare that parameter
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.369 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl getenv     entry( char(*) varyingz nonasgn byaddr,
//                        pointer byaddr )
//                 returns( native fixed bin(31) optional )
//                 options( nodescriptor );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-102.pli", async () => {
//   // Context:
//   //
//   // preceded by a PUT statement as follows:
//   // system prompt by ending your own prompt with a colon. For example, the GET statement could be
//   // If you include output statements that prompt you for input in your program, you can inhibit the initial
//   // your program until you enter two or more lines.
//   // By adding a hyphen to the end of any line that is to continue, you can delay transmission of the data to
//   // GET statement, a further prompt, which is a plus sign followed by a colon (+:), is displayed.
//   // enter the required data. If you enter a line that does not contain enough data to complete execution of the
//   // is executed in the program. The GET statement causes the system to go to the next line. You can then
//   // You are prompted for input to stream files by a colon (:). You will see the colon each time a GET statement
//   // to the terminal.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.298 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  PUT SKIP LIST('ENTER NEXT ITEM:');
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-8.pli", async () => {
//   // Context:
//   //
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 74
//   // But this code would still be valid under NOLAXCTL:
//   // The following code is illegal under NOLAXCTL:
//   // with a varying extent, that extent must be specified as an asterisk or as a non-constant expression.
//   // allocated with a differing extent. NOLAXCTL requires that if a CONTROLLED variable is to be allocated
//   // Specifying LAXCTL allows a CONTROLLED variable to be declared with a constant extent and yet to be
//   // LAXCTL | NOLAXCTL
//   // The default is RULES(LAXCONV). When you specify RULES(NOLAXCONV), the default is ALL.
//   // Under SOURCE, only those violations that occur in the primary source file are flagged.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.130 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//      dcl b bit(n) ctl;
//      dcl n fixed bin(31) init(8);
//      alloc b;
//      alloc b bit(16);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-289.pli", async () => {
//   // Context:
//   //
//   // Table 144. Record types encoded as an ordinal value
//   // 473
//   //  Copyright IBM Corp. 1999, 2022
//   // Possible record types are encoded as an ordinal value as shown in Table 144 on page 474.
//   // • Whether the record is continued onto the next record
//   // • Record type
//   // The header also has some fields that vary from record to record:
//   // the number 4.
//   // A number representing the level of SYSADATA that this file format represents. For this product, it is
//   // SYSADATA level
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.529 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//   Define ordinal xin_Rect
//    (Xin_Rect_Msg       value(50),   /*  Message record                */
//     Xin_Rect_Fil       value(57),   /*  File record                   */
//     Xin_Rect_Opt       value(60),   /*  Options record                */
//     Xin_Rect_Sum       value(61),   /*  Summary record                */
//     Xin_Rect_Rep       value(62),   /*  Replace record                */
//     Xin_Rect_Src       value(63),   /*  Source record                 */
//     Xin_Rect_Tok       value(64),   /*  Token record                  */
//     Xin_Rect_Sym       value(66),   /*  Symbol record                 */
//     Xin_Rect_Lit       value(67),   /*  Literal record                */
//     Xin_Rect_Syn       value(69),   /*  Syntax record                 */
//     Xin_Rect_Ord_Type  value(80),   /*  Ordinal type record           */
//     Xin_Rect_Ord_Elem  value(81),   /*  Ordinal element record        */
//     Xin_Rect_Ctr       value(82) )  /*  Counter record                */
//                        prec(15);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-55.pli", async () => {
//   // Context:
//   //
//   // Here is the sample of the PL/I fetched MAIN program:
//   // Examples
//   // with DEFAULT(LINKAGE(SYSTEM)).
//   // OPTIONS(LINKAGE(SYSTEM)) in its ENTRY declaration for the fetched MAIN routine, or be compiled
//   // • If no parameters are passed to the fetched MAIN program, the fetching program should either specify
//   // passed char varying string is not parsed for the runtime options.
//   // messages regarding invalid runtime options. If NOEXECOPS is specified in the fetched MAIN routine, the
//   // • Avoid passing runtime options because attempts to parse them might produce LE informational
//   // fetched MAIN routine in the fetching program.
//   // • You must not specify OPTIONS(ASM) or OPTIONS(NODESCRIPTOR) in the ENTRY declaration for the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.231 */


//     FMAIN: proc(parm) options(main,noexecops );
//       DCL parm char(*) var;
//       DCL SYSPRINT print;
//       DCL PLIXOPT CHAR(11) VAR INIT('RPTOPTS(ON)')
//           STATIC EXTERNAL;
//       Put skip list("FMAIN parm: "|| parm);
//       Put skip list("FMAIN finished ");
//     End FMAIN;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-285.pli", async () => {
//   // Context:
//   //
//   // These are possible values for the dsc_Type field:
//   // The declare for a descriptor header is as follows:
//   // type.
//   // structure, or union). The remaining three bytes are zero unless they are set by the particular descriptor
//   // Every LE descriptor starts with a 4-byte field. The first byte specifies the descriptor type (scalar, array,
//   // CMPAT(LE) descriptors
//   // The declare for a CMPAT(V3) array descriptor is as follows:
//   // 469
//   // Chapter 26. PL/I descriptors
//   // The declare for a CMPAT(V2) array descriptor is as follows:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.525 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare
//    dsc_Type_Unset                fixed bin(8) value(0),
//    dsc_Type_Element              fixed bin(8) value(2),
//    dsc_Type_Array                fixed bin(8) value(3),
//    dsc_Type_Structure            fixed bin(8) value(4),
//    dsc_Type_Union                fixed bin(8) value(4);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-284.pli", async () => {
//   // Context:
//   //
//   // The declare for a descriptor header is as follows:
//   // type.
//   // structure, or union). The remaining three bytes are zero unless they are set by the particular descriptor
//   // Every LE descriptor starts with a 4-byte field. The first byte specifies the descriptor type (scalar, array,
//   // CMPAT(LE) descriptors
//   // The declare for a CMPAT(V3) array descriptor is as follows:
//   // 469
//   // Chapter 26. PL/I descriptors
//   // The declare for a CMPAT(V2) array descriptor is as follows:
//   // The declare for a CMPAT(V1) array descriptor is as follows:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.525 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare
//    1 dsc_Header based( sysnull() ),
//      2 dsc_Type          fixed bin(8) unsigned,
//      2 dsc_Datatype      fixed bin(8) unsigned,
//      2 *                 fixed bin(8) unsigned,
//      2 *                 fixed bin(8) unsigned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-131.pli", async () => {
//   // Context:
//   //
//   // For instance, under RULES(LAXCTL), you can declare a structure as follows:
//   // that you use the RULES(NOLAXCTL) option to disallow such practice.
//   // with different extents. However, this coding practice severely impacts performance. It is recommended
//   // Under RULES(LAXCTL), a CONTROLLED variable can be declared with constant extents and yet allocated
//   // (NO)LAXCTL
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 308
//   // Improving performance
//   // Specifying RULES(NOGLOBALDO) will cause the compile to flag any code where this is not true.
//   // It is best that JX be declared in the same PROCEDURE that contains this loop.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.364 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl
//      1 a controlled,
//        2 b char(17),
//        2 c char(29);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-11.pli", async () => {
//   // Context:
//   //
//   // members that are not level 1 and are not dot qualified. Consider the following example:
//   // Specifying RULES(NOLAXQUAL(LOOSE)) causes the compiler to flag any reference to structure
//   // LOOSE
//   // excluded from the NOLAXQUAL checking.
//   // not level 1. References which names start with 'CEE', 'DFH', 'DSN', 'EYU', 'IBM', 'PLI', and 'SQL' are
//   // Specifying NOLAXQUAL causes the compiler to flag any reference to structure members that are
//   // LAXQUAL | NOLAXQUAL
//   // The default is RULES(LAXPUNC).
//   // flagged with an E-level message; otherwise, it will be flagged with a W-level message.
//   // parenthesis is meant before the semicolon. Under RULES(NOLAXPUNC), this statement will be
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.133 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl
//    1 a,
//      2 b,
//        3 b fixed bin,
//        3 c fixed bin;
//  c   = 11;   /* would be flagged */
//  b.c = 13;   /* would not be flagged */
//  a.c = 17;   /* would not be flagged */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-276.pli", async () => {
//   // Context:
//   //
//   //  is declared as follows:
//   // sample
//   // For example, suppose that the routine
//   // address of the string and then the string descriptor itself.
//   // is still such a pair of pointers. But under the other CMPAT options, the locator/descriptor consists of the
//   // the second pointer is the address of the descriptor. For strings, under CMPAT(LE), the locator/descriptor
//   // Except for strings, the locator/descriptor is a pair of pointers. The first pointer is the address of the data;
//   // descriptor, the address of a locator/descriptor for the argument is passed instead.
//   // When arguments and their descriptors are passed by locator/descriptor, whenever an argument requires a
//   // Argument passing by locator/descriptor
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.523 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare sample entry( fixed bin(31), varying char(*) )
//                 options( byaddr descriptor );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-249.pli", async () => {
//   // Context:
//   //
//   //  OSRIN is an zFS file, use the following JCL statement instead:
//   // ddname
//   // If the associated
//   // To run a program by using an OSR in a PDS, you can specify the following DD statement in the JCL:
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 430
//   // file into the buffer:
//   // If the inbound schema file were in an zFS file instead, you could use the following code to read the OSR
//   // you can increase the initial size of the OSR buffer accordingly.
//   // following example is in a PDS. The initial size of the OSR buffer is set to 4096. If you have a larger OSR file,
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.486 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  //OSRIN DD DSN=HLQ.XML.OSR(STOCK),DISP=SHR
//  //OSRIN DD PATH=&ldquo;/u/HLQ/xml/stock.osr&rdquo;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-94.pli", async () => {
//   // Context:
//   //
//   // Table 43. Creating a library member in a PL/I program
//   // page 228. It copies all the records of the original member except those that contain only blanks.
//   // The program shown in Table 44 on page 229 updates the member created by the program in Table 43 on
//   // both can be associated with the same DD statement.
//   // originally occupied by the member cannot be used again. You must use two files in your PL/I program, but
//   // the entire member in another part of the library. This is rarely an economic proposition because the space
//   // To use a PL/I program to add or delete one or more records within a member of a library, you must rewrite
//   // Example: Updating a library member
//   // Table 42. Placing a load module in an existing library
//   // load module in the existing library HPU8.CCLM.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.283 */


//   //OPT10#3  JOB
//   //TREX  EXEC IBMZCBG
//   //PLI.SYSIN      DD *
//     NMEM:  PROC OPTIONS(MAIN);
//        DCL IN FILE RECORD SEQUENTIAL INPUT,
//            OUT FILE RECORD SEQUENTIAL OUTPUT,
//            P POINTER,
//            IOFIELD CHAR(80) BASED(P),
//            EOF BIT(1) INIT('0'B);
//        OPEN FILE(IN),FILE (OUT);
//        ON ENDFILE(IN) EOF='1'B;
//        READ FILE(IN) SET(P);
//        DO WHILE (¬EOF);
//        PUT FILE(SYSPRINT) SKIP EDIT (IOFIELD) (A);
//        WRITE FILE(OUT) FROM(IOFIELD);
//        READ FILE(IN) SET(P);
//        END;
//        CLOSE FILE(IN),FILE(OUT);
//     END NMEM;
//   /*
//   //GO.OUT   DD  UNIT=SYSDA,DSNAME=HPU8.ALIB(NMEM),
//   //     DISP=(NEW,CATLG),SPACE=(TRK,(1,1,1)),
//   //     DCB=(RECFM=FB,BLKSIZE=3600,LRECL=80)
//   //GO.IN DD */
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-309.pli", async () => {
//   // Context:
//   //
//   // Table 162. Declare for the expression kind
//   // • A prefix op, such as a minus for a negation, will have a child node that describes its operand.
//   // (and the sibling node of that operand will describe the righthand operator).
//   // • An infix op, such as a minus for a subtraction, will have a child node that describes its lefthand operand
//   // expression. Some of these records will have nonzero child nodes; for example:
//   // The ordinal xin_Exp_Kind identifies the type of an expression for a syntax record that describes an
//   // • A lexeme record (for the semicolon)
//   // • A keyword record (for the END keyword)
//   // The records for the END statement consists of 2 records:
//   // • A lexeme record (for the semicolon)
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.542 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//   Define
//    ordinal
//      xin_Exp_Kind
//        (  xin_Exp_Kind_Unset
//          ,xin_Exp_Kind_Bit_String
//          ,xin_Exp_Kind_Char_String
//          ,xin_Exp_Kind_Graphic_String
//          ,xin_Exp_Kind_Number
//          ,xin_Exp_Kind_Infix_Op
//          ,xin_Exp_Kind_Prefix_Op
//          ,xin_Exp_Kind_Builtin_Rfrnc
//          ,xin_Exp_Kind_Entry_Rfrnc
//          ,xin_Exp_Kind_Qualified_Rfrnc
//          ,xin_Exp_Kind_Unsub_Rfrnc
//          ,xin_Exp_Kind_Subscripted_Rfrnc
//          ,xin_Exp_Kind_Type_Func
//          ,xin_Exp_Kind_Widechar_String
//                                     )  prec(8) unsigned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-303.pli", async () => {
//   // Context:
//   //
//   // Table 157. Declare for the token record kind
//   // The ordinal xin_Tok_Kind identifies the type of the token record.
//   // Table 156. Declare for a token record
//   // on which it started and ended.
//   // recognized by the PL/I compiler. The record also identifies the type of the token plus the column and line
//   // Each token record assigns a number, called a token index, that is used by later records to refer to a token
//   // Token records
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 482
//   // Table 155. Declare for a source record
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.538 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//   Define
//    ordinal
//      xin_Tok_Kind
//        (  xin_Tok_Kind_Unset
//          ,xin_Tok_Kind_Lexeme
//          ,xin_Tok_Kind_Comment
//          ,xin_Tok_Kind_Literal
//          ,xin_Tok_Kind_Identifier
//          ,xin_Tok_Kind_Keyword
//                                     )  prec(8) unsigned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-298.pli", async () => {
//   // Context:
//   //
//   // Consider the following structure:
//   // • The first child, if any
//   // • The parent, if any
//   // • The first sibling, if any
//   // following:
//   // If the identifier is part of a structure or union, the symbol record contains a symbol index for each of the
//   // file and line in which the symbol was declared.
//   // is indicated by a literal index. Each symbol record contains the file index and source line number for the
//   // For example, the index can be used as the name of a user variable or constant. The name of the identifier
//   // refer to the symbol described by this record.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.534 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//         dcl
//           1 a
//             , 3 b     fixed bin
//             , 3 c     fixed bin
//             , 3 d
//               , 5 e   fixed bin
//               , 5 f   fixed bin
//         ;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-299.pli", async () => {
//   // Context:
//   //
//   // Table 154. Data type of a variable
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 480
//   // The variable's data type is specified by the ordinal shown in Table 154 on page 481.
//   // specified.
//   // the symbol index of that variable is specified here. If its position attribute is constant, it is also
//   // If the variable is declared as defined on another mapped variable that is not an element of an array,
//   // Defined variables
//   // symbol index of that variable is specified.
//   // If the variable is declared as based on another mapped variable that is not an element of an array, the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.536 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  define
//    ordinal
//      xin_Data_Kind
//        (  xin_Data_Kind_Unset
//          ,xin_Data_Kind_Character
//          ,xin_Data_Kind_Bit
//          ,xin_Data_Kind_Graphic
//          ,xin_Data_Kind_Fixed
//          ,xin_Data_Kind_Float
//          ,xin_Data_Kind_Picture
//          ,xin_Data_Kind_Pointer
//          ,xin_Data_Kind_Offset
//          ,xin_Data_Kind_Entry
//          ,xin_Data_Kind_File
//          ,xin_Data_Kind_Label
//          ,xin_Data_Kind_Format
//          ,xin_Data_Kind_Area
//          ,xin_Data_Kind_Task
//          ,xin_Data_Kind_Event
//          ,xin_Data_Kind_Condition
//          ,xin_Data_Kind_Structure
//          ,xin_Data_Kind_Union
//          ,xin_Data_Kind_Descriptor
//          ,xin_Data_Kind_Ordinal
//          ,xin_Data_Kind_Handle
//          ,xin_Data_Kind_Type
//          ,xin_Data_Kind_Builtin
//          ,xin_Data_Kind_Generic
//          ,xin_Data_Kind_Widechar
//                                     )  prec(8) unsigned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-101.pli", async () => {
//   // Context:
//   //
//   // Table 49. PL/I structure PLITABS for modifying the preset tab settings
//   // not be omitted.
//   // the left margin. The first item in the structure is the offset to the NO_OF_TABS field. The FILL fields must
//   // TAB1 identifies the position of the second item printed on a line; the first item on a line always starts at
//   // three tab settings, in positions 30, 60, and 90, and uses the defaults for page size and line size. Note that
//   // procedure. An example of the PL/I structure is shown in Table 49 on page 242. This example creates
//   // you must declare to be STATIC EXTERNAL in your MAIN procedure or in a program linked with your MAIN
//   // To supply this tab table, include a PL/I structure in your source program with the name PLITABS, which
//   // NONASGN attribute can also be specified when compiling with NORENT.
//   // recommended that PLITABS should always be declared with the NONASGN attribute, because the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.297 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL 1 PLITABS STATIC EXT NONASGN,
//      2 (OFFSET INIT(14),
//        PAGESIZE INIT(60),
//        LINESIZE INIT(120),
//        PAGELENGTH INIT(0),
//        FILL1 INIT(0),
//        FILL2 INIT(0),
//        FILL3 INIT(0),
//        NO_OF_TABS INIT(3),
//        TAB1 INIT(30),
//        TAB2 INIT(60),
//        TAB3 INIT(90)) FIXED BIN(15,0);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-21.pli", async () => {
//   // Context:
//   //
//   //  declared as follows:
//   // A
//   // where it would seem to start. For example, consider the AUTOMATIC structure
//   // The mapping rules of the PL/I language might require that a structure be offset by up to 8 bytes from
//   // • An "automatic map" that lists, for each block, all AUTOMATIC variables but sorted by hex offset
//   // • A "static map" that lists all STATIC variables but sorted by hex offset
//   // However, specifying the MAP option also causes the compiler to produce the following maps:
//   // This storage offset listing is sorted by block and by variable name, and it also includes only user variables.
//   // variable.
//   // The fourth column in the Storage Offset Listing is unlabeled and tells how to find the location of the
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.163 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//           dcl
//             1 A,
//               2 B char(2),
//               2 C fixed bin(31);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-311.pli", async () => {
//   // Context:
//   //
//   // Table 164. Declare for the lexeme kind
//   // for instance, as the "concatenate" symbol.
//   // • In these ordinal names, "dbl" means "double", so that dbl_Vrule is a doubled vertical rule that is used,
//   // • In these ordinal names, "vrule" means "vertical rule", which is used, for instance, as the "or" symbol.
//   // The ordinal xin_Lex_Kind identifies the type of a lexeme for a syntax record that describes a lexical unit.
//   // Table 163. Declare for the number kind
//   // The ordinal xin_Number_Kind identifies the type of a number for a syntax record that describes a number.
//   // 487
//   // Appendix A. SYSADATA message information
//   // Table 162. Declare for the expression kind
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.543 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//   Define
//    ordinal
//      xin_Lex_Kind
//        (  xin_Lex_Undefined
//          ,xin_Lex_Period
//          ,xin_Lex_Colon
//          ,xin_Lex_Semicolon
//          ,xin_Lex_Lparen
//          ,xin_Lex_Rparen
//          ,xin_Lex_Comma
//          ,xin_Lex_Equals
//          ,xin_Lex_Gt
//          ,xin_Lex_Ge
//          ,xin_Lex_Lt
//          ,xin_Lex_Le
//          ,xin_Lex_Ne
//          ,xin_Lex_Lctr
//          ,xin_Lex_Star
//          ,xin_Lex_Dbl_Colon
//          ,xin_Lex_Not
//          ,xin_Lex_Vrule
//          ,xin_Lex_Dbl_Vrule
//          ,xin_Lex_And
//          ,xin_Lex_Dbl_Star
//          ,xin_Lex_Plus
//          ,xin_Lex_Minus
//          ,xin_Lex_Slash
//          ,xin_Lex_Equals_Gt
//          ,xin_Lex_Lparen_Colon
//          ,xin_Lex_Colon_Rparen
//          ,xin_Lex_Plus_Equals
//          ,xin_Lex_Minus_Equals
//          ,xin_Lex_Star_Equals
//          ,xin_Lex_Slash_Equals
//          ,xin_Lex_Vrule_Equals
//          ,xin_Lex_And_Equals
//          ,xin_Lex_Dbl_Star_Equals
//          ,xin_Lex_Dbl_Vrule_Equals
//          ,xin_Lex_Dbl_Slash
//        ) unsigned prec(16);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-310.pli", async () => {
//   // Context:
//   //
//   // Table 163. Declare for the number kind
//   // The ordinal xin_Number_Kind identifies the type of a number for a syntax record that describes a number.
//   // 487
//   // Appendix A. SYSADATA message information
//   // Table 162. Declare for the expression kind
//   // • A prefix op, such as a minus for a negation, will have a child node that describes its operand.
//   // (and the sibling node of that operand will describe the righthand operator).
//   // • An infix op, such as a minus for a subtraction, will have a child node that describes its lefthand operand
//   // expression. Some of these records will have nonzero child nodes; for example:
//   // The ordinal xin_Exp_Kind identifies the type of an expression for a syntax record that describes an
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.543 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//   Define
//    ordinal
//      xin_Number_Kind
//        (  xin_Number_Kind_Unset
//          ,xin_Number_Kind_Real_Fixed_Bin
//          ,xin_Number_Kind_Real_Fixed_Dec
//          ,xin_Number_Kind_Real_Float_Bin
//          ,xin_Number_Kind_Real_Float_Dec
//          ,xin_Number_Kind_Cplx_Fixed_Bin
//          ,xin_Number_Kind_Cplx_Fixed_Dec
//          ,xin_Number_Kind_Cplx_Float_Bin
//          ,xin_Number_Kind_Cplx_Float_Dec
//                                     )  prec(8) unsigned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-56.pli", async () => {
//   // Context:
//   //
//   // Here is the sample of the PL/I MAIN program that fetches another PL/I MAIN program:
//   // Here is the sample of the PL/I fetched MAIN program:
//   // Examples
//   // with DEFAULT(LINKAGE(SYSTEM)).
//   // OPTIONS(LINKAGE(SYSTEM)) in its ENTRY declaration for the fetched MAIN routine, or be compiled
//   // • If no parameters are passed to the fetched MAIN program, the fetching program should either specify
//   // passed char varying string is not parsed for the runtime options.
//   // messages regarding invalid runtime options. If NOEXECOPS is specified in the fetched MAIN routine, the
//   // • Avoid passing runtime options because attempts to parse them might produce LE informational
//   // fetched MAIN routine in the fetching program.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.231 */


//     MainFet: Proc Options(main);
//         Dcl Parm char(1000) var;
//         Dcl SYSPRINT print;
//         Dcl Fmain entry(char(*) var) ;
//         Put skip list("MainFet: start ");
//         Parm = 'local-parm';
//         Put skip list("MainFet parm: "|| Parm);
//         Fetch Fmain;
//         Call Fmain(Parm);
//         Release Fmain;
//         Put skip list("MainFet:testcase finished ");
//     End;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-143.pli", async () => {
//   // Context:
//   //
//   // compiler generates more optimal code for the pair in the union.
//   // , but the
//   // b2
//   //  and
//   // b1
//   //  perform the same function as
//   // b4
//   //  and
//   // b3
//   // In the following example, the pair of variables
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.372 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl b1 bit(32);
//  dcl b2 bit(16) def b1;
//  dcl
//    1 * union,
//      2 b3 bit(32),
//      2 b4 bit(16);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-281.pli", async () => {
//   // Context:
//   //
//   // The declare for a CMPAT(V1) array descriptor is as follows:
//   // that the actual upper bound will always match the number of dimensions in the array it describes.
//   // In the following declares, the upper bound for the arrays is declared as 15, but it should be understood
//   // Array descriptors
//   // The possible values for the codepage encoding are defined as follows:
//   // The declare for a string descriptor under CMPAT(V3) is as follows:
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 468
//   // The declare for a string descriptor under CMPAT(V1) and CMPAT(V2) is as follows:
//   // In a string descriptor for a CHARACTER string, the fourth byte encodes the compiler CODEPAGE option.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.524 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare
//    1 dso_v1  based,
//      2 dso_v1_rvo      fixed bin(31),    /* relative virtual origin */
//      2 dso_v1_data(1:15),
//        3 dso_v1_stride fixed bin(31),    /*   multiplier            */
//        3 dso_v1_hbound fixed bin(15),    /*   hbound                */
//        3 dso_v1_lbound fixed bin(15);    /*   lbound                */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-280.pli", async () => {
//   // Context:
//   //
//   // The possible values for the codepage encoding are defined as follows:
//   // The declare for a string descriptor under CMPAT(V3) is as follows:
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 468
//   // The declare for a string descriptor under CMPAT(V1) and CMPAT(V2) is as follows:
//   // In a string descriptor for a CHARACTER string, the fourth byte encodes the compiler CODEPAGE option.
//   // In a string descriptor for a nonvarying bit string, the fourth byte gives the bit offset.
//   // bigendian format).
//   // is held in littleendian or bigendian format or if the data in a WIDECHAR string is held in littleendian or
//   // The third byte contains various flags (to indicate, for example, if the string length in a VARYING string
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.524 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  define ordinal
//    ccs_Codepage_Enum
//      ( ccs_Codepage_01047  value(1)
//       ,ccs_Codepage_01140
//       ,ccs_Codepage_01141
//       ,ccs_Codepage_01142
//       ,ccs_Codepage_01143
//       ,ccs_Codepage_01144
//       ,ccs_Codepage_01145
//       ,ccs_Codepage_01146
//       ,ccs_Codepage_01147
//       ,ccs_Codepage_01148
//       ,ccs_Codepage_01149
//       ,ccs_Codepage_00819
//       ,ccs_Codepage_00813
//       ,ccs_Codepage_00920
//       ,ccs_Codepage_00037
//       ,ccs_Codepage_00273
//       ,ccs_Codepage_00277
//       ,ccs_Codepage_00278
//       ,ccs_Codepage_00280
//       ,ccs_Codepage_00284
//       ,ccs_Codepage_00285
//       ,ccs_Codepage_00297
//       ,ccs_Codepage_00500
//       ,ccs_Codepage_00871
//       ,ccs_Codepage_01026
//       ,ccs_Codepage_01155
//      ) unsigned prec(8);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-135.pli", async () => {
//   // Context:
//   //
//   // For example, under the DEFAULT( NOOVERLAP ) option, the assignment in this example is invalid:
//   // However, if you use this option, you must ensure that the source and target in assignment do not overlap.
//   // do not overlap, and it can therefore generate smaller and faster code.
//   // The DEFAULT(NOOVERALP) option lets the compiler assume that the source and target in an assignment
//   // NOOVERLAP
//   // Consequently, if your program logic allows, use DEFAULT(REORDER) to generate superior code.
//   // their latest values. This effectively prohibits almost all optimization on such variables.
//   // variables in that block referenced in ON-units (or blocks dynamically descendant from ON-units) have
//   // The DEFAULT(ORDER) option indicates that the ORDER option is applied to every block, meaning that
//   // (RE)ORDER
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.367 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl c char(20);
//    substr(c,2,5) = substr(c,1,5);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-307.pli", async () => {
//   // Context:
//   //
//   // Table 160. Declare for the syntax record kind
//   // 485
//   // Appendix A. SYSADATA message information
//   // The ordinal xin_Syn_Kind identifies the type of the syntax record.
//   // Table 159. Declare for a syntax record (continued)
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 484
//   // Table 159. Declare for a syntax record
//   // Table 158. Node indices assigned to the blocks in a program
//   // The node indices are assigned to the blocks of the preceding program as follows:
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.541 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  Define
//    ordinal
//      xin_Syn_Kind
//        (  xin_Syn_Kind_Unset
//          ,xin_Syn_Kind_Lexeme
//          ,xin_Syn_Kind_Asterisk
//          ,xin_Syn_Kind_Int
//          ,xin_Syn_Kind_Name
//          ,xin_Syn_Kind_Expression
//          ,xin_Syn_Kind_Parenthesized_Expr
//          ,xin_Syn_Kind_Argument_List
//          ,xin_Syn_Kind_Keyword
//          ,xin_Syn_Kind_Proc_Stmt
//          ,xin_Syn_Kind_Begin_Stmt
//          ,xin_Syn_Kind_Stmt
//          ,xin_Syn_Kind_Substmt
//          ,xin_Syn_Kind_Label
//          ,xin_Syn_Kind_Invoke_Begin
//          ,xin_Syn_Kind_Assignment
//          ,xin_Syn_Kind_Assignment_Byname
//          ,xin_Syn_Kind_Do_Fragment
//          ,xin_Syn_Kind_Keyed_List
//          ,xin_Syn_Kind_Iteration_Factor
//          ,xin_Syn_Kind_If_Clause
//          ,xin_Syn_Kind_Else_Clause
//          ,xin_Syn_Kind_Do_Stmt
//          ,xin_Syn_Kind_Select_Stmt
//          ,xin_Syn_Kind_When_Stmt
//          ,xin_Syn_Kind_Otherwise_Stmt
//          ,xin_Syn_Kind_Procedure
//          ,xin_Syn_Kind_Package
//          ,xin_Syn_Kind_Begin_Block
//          ,xin_Syn_Kind_Picture
//          ,xin_Syn_Kind_Raw_Rfrnc
//          ,xin_Syn_Kind_Generic_Desc
//                                     )  prec(8) unsigned;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-128.pli", async () => {
//   // Context:
//   //
//   // .
//   // field12
//   //  and
//   // field11
//   // For instance, in the following structure, there is one byte of padding between
//   // 307
//   //  Copyright IBM Corp. 1999, 2022
//   // Improving performance
//   // However, padding bytes might be zeroed out.
//   // structure, and that will usually mean your compilation will be quicker and your code will run much faster.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.363 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl
//     1 sample ext,
//       5  field10          bin fixed(31),
//       5  field11          dec fixed(13),
//       5  field12          bin fixed(31),
//       5  field13          bin fixed(31),
//       5  field14          bit(32),
//       5  field15          bin fixed(31),
//       5  field16          bit(32),
//       5  field17          bin fixed(31);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-273.pli", async () => {
//   // Context:
//   //
//   // Code the termination procedure-specific control block as follows:
//   // message filter procedures and the initialization procedures.
//   // might also want to write out final statistical reports based on information collected during the error
//   // You should use the termination procedure to perform any cleanup required, such as closing files. You
//   // Writing the termination procedure
//   // Abort compilation
//   // 16/n
//   // Reserved for future use
//   // 8/n
//   // Reserved for future use
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.520 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  Dcl 1 Uex_ISA native based,
//      2 Uex_ISA_Length_fixed bin(31); /* storage(Uex_ISA)       */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-272.pli", async () => {
//   // Context:
//   //
//   // 463
//   // Chapter 25. Using user exits
//   // Uex_MFX_Ins_Series_Addr points to this structure:
//   // The following example shows a procedure-specific message filter control block:
//   // information back to the compiler indicating how a particular message should be handled.
//   // The procedure-specific control block contains information about the messages. It is used to pass
//   //  (severity code 4) messages.
//   // WARNING
//   // (severity code 8) or
//   // ERROR
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.519 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//         dcl
//           1 series based,
//             2 series_count                              fixed bin(31),
//             2 series_string( 1 refer(series_Count )  )  pointer(32);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-74.pli", async () => {
//   // Context:
//   //
//   // how a DD statement should be associated with the value of a file variable:
//   //  be the same as the value of the file reference. The following example illustrates
//   // must
//   // DD statement name
//   // If the file reference in the statement that explicitly or implicitly opens the file is not a file constant, the
//   //  //DETAIL DD ...
//   // 3.
//   //  //OLDSAMPL DD ...
//   // 2.
//   //  //SAMPLE DD ...
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.250 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  DCL PRICES FILE VARIABLE,
//      RPRICE FILE;
//        PRICES = RPRICE;
//        OPEN FILE(PRICES);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-91.pli", async () => {
//   // Context:
//   //
//   // For example, you can use redirection in the following program:
//   // You can redirect standard input, standard output, and standard error devices to a file.
//   // Redirecting standard input, output, and error devices under z/OS UNIX
//   // home directory.
//   //  in the user's
//   // .profile
//   // . To set them for a specific user only, add them to the file
//   // /etc/profile
//   // the file
//   // 223
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.279 */


//  Hello2: proc options(main);
//    put list('Hello!');
//  end;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-300.pli", async () => {
//   // Context:
//   //
//   // The type of the extent is encoded by the values:
//   // The type and value of the extent is specified in addition to the symbol index of the returns description.
//   // String and area variables
//   // The symbol index of the underlying type is specified.
//   // Typed variables and handles
//   // The ordinal type index is specified.
//   // Ordinal variables
//   // If the variable has the returns attribute, the symbol index of the returns description is specified.
//   // Entry variables
//   // The literal index of the picture specification is specified.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.536 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare
//    (  xin_Extent_Constant     value(01)
//      ,xin_Extent_Star         value(02)
//      ,xin_Extent_Nonconstant  value(04)
//      ,xin_Extent_Refer        value(08)
//      ,xin_Extent_In_Error     value(16)
//    )
//    fixed bin;
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-274.pli", async () => {
//   // Context:
//   //
//   //  is declared as follows:
//   // sample
//   // For example, suppose the routine
//   // the descriptor list is set to the address of that argument's descriptor.
//   // descriptor list is set to SYSNULL. For arguments that do require a descriptor, the corresponding pointer in
//   // of arguments passed. For arguments that do not require a descriptor, the corresponding pointer in the
//   // This extra argument is a pointer to a list of pointers. The number of entries in this list equals the number
//   // whenever at least one argument needs a descriptor.
//   // When arguments and their descriptors are passed with a descriptor list, an extra argument is passed
//   // Argument passing by descriptor list
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.522 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare sample entry( fixed bin(31), varying char(*) )
//                 options( byaddr descriptor );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-188.pli", async () => {
//   // Context:
//   //
//   // Table 114. Correct declaration of qsort
//   // function could be declared as follows:
//   // qsort
//   // However, a C function pointer is equivalent to the PL/I type LIMITED ENTRY. Therefore, the C
//   // only, and so a PL/I ENTRY variable and a C function pointer do not even use the amount of storage.
//   // as well as an entry point address). But a C function pointer is limited in pointing to a non-nested function
//   // Recall that a PL/I ENTRY variable might point to a nested function (and thus requires a backchain address
//   // Table 113. Incorrect declaration of qsort
//   // be declared simply as follows:
//   //  function must not
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.405 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    dcl qsort    ext('qsort')
//                 entry( pointer,
//                        fixed bin(31),
//                        fixed bin(31),
//                        limited entry
//                        returns( byvalue fixed bin(31) )
//                      )
//                 options( byvalue nodescriptor );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-220.pli", async () => {
//   // Context:
//   //
//   // as follows:
//   // For example, to pass a pointer to a singly-linked list of integers, the structure for that list must be declared
//   // storage.
//   // • It is recommended to use the RELEASE function to release the fetched routine and its associated
//   // POINTERs and HANDLEs must have the attributes POINTER(32) and HANDLE(32).
//   // • If a parameter is a POINTER, HANDLE, or an aggregate containing POINTERs or HANDLEs, then those
//   // (not array or structure expressions).
//   // • All array and structure arguments passed to an ENTRY with OPTIONS(AMODE31) must be references
//   // • Any GOTO statement in one AMODE must not cross over any routines in the opposite AMODE.
//   // • Any exception that occurs in one AMODE must be handled in that AMODE.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.433 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//        dcl
//          1 list_element   based,
//            2 list_next    pointer(32),
//            2 list_int     fixed bin(31);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-171.pli", async () => {
//   // Context:
//   //
//   // Table 96. Declarations for filedump program
//   //  are obvious:
//   // filedump
//   // Most of the declarations in the INCLUDE file
//   // Table 95. Sample code to use fopen and fread to dump a file
//   // 345
//   // Chapter 17. ILC with C
//   // The code for this program is straightforward:
//   // .
//   // fread
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.401 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//       define struct      1 file;
//       define alias       file_Handle  handle file;
//       define alias       size_t unsigned fixed bin(32);
//       define alias       int signed fixed bin(31);
//       dcl file           type(file_Handle);
//       dcl read_In        fixed bin(31);
//       dcl buffer         char(16);
//       dcl unprintable    char(32) value( substr(collate(),1,32) );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-287.pli", async () => {
//   // Context:
//   //
//   // These are the possible values for the dsc_String_Type field:
//   //   Enterprise PL/I for z/OS: Enterprise PL/I for z/OS Programming Guide
//   // 470
//   // The declare for a string descriptor is as follows:
//   // EBCDIC.
//   // In a string descriptor for a character string, the fourth byte also has a bit indicating if the string data is in
//   // nonnative format.
//   // In a string descriptor for a varying string, the fourth byte has a bit indicating if the string length is held in
//   // CODEPAGE option.
//   // In a string descriptor for a CHARACTER string, the third byte of the header encodes the compiler
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.526 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  declare
//      dsc_datatype_unset                  fixed bin(7) value(0),
//      dsc_datatype_char_nonvarying        fixed bin(7) value(2),
//      dsc_datatype_char_varyingz          fixed bin(7) value(3),
//      dsc_datatype_char_varying2          fixed bin(7) value(4),
//      dsc_datatype_char_varying4          fixed bin(7) value(5),
//      dsc_datatype_bit_nonvarying         fixed bin(7) value(6),
//      dsc_datatype_bit_varying2           fixed bin(7) value(7),
//      dsc_datatype_bit_varying4           fixed bin(7) value(8),
//      dsc_datatype_graphic_nonvarying     fixed bin(7) value(9),
//      dsc_datatype_graphic_varyingz       fixed bin(7) value(10),
//      dsc_datatype_graphic_varying2       fixed bin(7) value(11),
//      dsc_datatype_graphic_varying4       fixed bin(7) value(12),
//      dsc_datatype_widechar_nonvarying    fixed bin(7) value(13),
//      dsc_datatype_widechar_varyingz      fixed bin(7) value(14),
//      dsc_datatype_widechar_varying2      fixed bin(7) value(15),
//      dsc_datatype_widechar_varying4      fixed bin(7) value(16),
//      dsc_datatype_uchar_nonvarying       fixed bin(7) value(17),
//      dsc_datatype_uchar_varyingz         fixed bin(7) value(18),
//      dsc_datatype_uchar_varying2         fixed bin(7) value(19),
//      dsc_datatype_uchar_varying4         fixed bin(7) value(20);
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-215.pli", async () => {
//   // Context:
//   //
//   // PLIXOPT variable as follows:
//   //  runtime option. You can declare the
//   // XPLINK=ON
//   // but you must use the PLIXOPT variable to specify the
//   // are linked with XPLINK and the PL/I modules are not. PL/I can still link to and call XPLINK libraries
//   // Because this PL/I sample program calls Java, the program must link to the Java library. The Java libraries
//   // This section applies to 31-bit only.
//   // Note:
//   // Linking the PL/I program with the Java library
//   //  include files are provided in the PL/I SIBMZSAM data set.
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.424 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//    Dcl PLIXOPT     Char(40) Varying Ext Static Init( 'XPLINK(ON)'e );
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });

// test("Block block-12.pli", async () => {
//   // Context:
//   //
//   // members that do not include the level-1 name. Consider the following example:
//   // Specifying RULES(NOLAXQUAL(STRICT)) causes the compiler to flag any reference to structure
//   // STRICT
//   // members that are not level 1 and are not dot qualified. Consider the following example:
//   // Specifying RULES(NOLAXQUAL(LOOSE)) causes the compiler to flag any reference to structure
//   // LOOSE
//   // excluded from the NOLAXQUAL checking.
//   // not level 1. References which names start with 'CEE', 'DFH', 'DSN', 'EYU', 'IBM', 'PLI', and 'SQL' are
//   // Specifying NOLAXQUAL causes the compiler to flag any reference to structure members that are
//   // LAXQUAL | NOLAXQUAL
//   //

//   const doc: LangiumDocument<PliProgram> =
//     await parseStmts(` /* Enterprise PL/I for z/OS Programming Guide v6.1, pg.133 */

//  MAINTP: PROCEDURE OPTIONS (MAIN);

//  dcl
//    1 a,
//      2 b,
//        3 b fixed bin,
//        3 c fixed bin;
//  c   = 11;   /* would be flagged */
//  b.c = 13;   /* would be flagged */
//  a.c = 17;   /* would not be flagged */
//  END MAINTP;
// `);
//   expect(doc.parseResult.lexerErrors).toHaveLength(0);
//   expect(doc.parseResult.parserErrors).toHaveLength(0);
// });
