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
 * Each case is tagged with a comment referencing the sourcing doc & page number
 */

export const pliDocPrograms = [
  // 0. RESIGNAL statement example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.398 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 RESIGNAL;
 END MAINTP;`,

  // 1. AREA attribute example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.459 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Uarea area(1000);
   dcl Pz ptr;
   dcl C99z char(99) varyingz based(Pz);
   dcl (SizeBefore, SizeAfter) fixed bin(31);
   SizeBefore = availablearea(Uarea);         /* returns 1000    */
   Alloc C99z in(Uarea);
   SizeAfter = availablearea(Uarea);          /* returns 896     */
   dcl C9 char(896) based(Pz);
   Alloc C9 in(Uarea);
 END MAINTP;`,

  // 2. File variable example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.331 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl F file,
       G file variable;
       G=F;
   L1:  on endfile(G);
   L2:  on endfile(F);
 END MAINTP;`,

  // 3. Entry declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.232 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 dcl func entry( 1, 2 char(20) var, 2 char(10) var, 2 char(30) var );
 END MAINTP;`,

  // 4. Structure declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.670 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DECLARE 1 PAYROLL,
           2 NAME,
             3 LAST   CHARACTER (30) VARYING,
             3 FIRST  CHARACTER (15) VARYING,
             3 MIDDLE CHARACTER (3) VARYING,
           2 CURR,
             3 (REGLAR, OVERTIME) FIXED DECIMAL (8,2),
           2 YTD LIKE CURR;
 END MAINTP;`,

  // 5. NOPRINT directive example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.278 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 %NOPRINT;
 END MAINTP;`,

  // 6. Picture attribute example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.386 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Price picture '$99V.99';
   Price = 12.45;
 END MAINTP;`,

  // 7. Character initialization example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.603 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Scids   char(17)         init('See you at SCIDS!') static;
   dcl Vscids  char(20) varying init('See you at SCIDS!') static;
   dcl Stg fixed bin(31);
   Stg = storage   (Scids);           /* 17 bytes */
   Stg = currentsize (Scids);         /* 17 bytes */
   Stg = size (Vscids);               /* 22 bytes */
   Stg = currentsize (Vscids);        /* 19 bytes */
   Stg = size (Stg);                  /* 4  bytes */
   Stg = currentsize (Stg);           /* 4  bytes */
 END MAINTP;`,

  // 8. Ordinal type example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.270 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   define ordinal Color ( Red value (1),
                          Orange,
                          Yellow,
                          Green,
                          Blue,
                          Indigo,
                          Violet);
 END MAINTP;`,

  // 9. Default attributes example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.222 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DFT RANGE(*) FIXED BINARY VALUE(FIXED BINARY(31));
 END MAINTP;`,

  // 10. RETURN statement example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.175 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 RETURN;
 END MAINTP;`,

  // 11. Character code page example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.684 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 dcl lower_00813 char
   value( (
              '6162636465666768'x
           || '696A6B6C6D6E6F70'x
           || '7172737475767778'x
           || '797ADCDDDEDFE1E2'x
           || 'E3E4E5E6E7E8E9EA'x
           || 'EBECEDEEEFF0F1F3'x
           || 'F4F5F6F7F8F9FAFB'x
           || 'FCFDFE'x
        ) );
 dcl upper_00813 char
   value( (
              '4142434445464748'x
           || '494A4B4C4D4E4F50'x
           || '5152535455565758'x
           || '595AB6B8B9BAC1C2'x
           || 'C3C4C5C6C7C8C9CA'x
           || 'CBCCCDCECFD0D1D3'x
           || 'D4D5D6D7D8D9DADB'x
           || 'BCBEBF'x
        ) );
 dcl lower_00819 char
   value( (
              '6162636465666768'x
           || '696A6B6C6D6E6F70'x
           || '7172737475767778'x
           || '797AE0E1E2E3E4E5'x
           || 'E6E7E8E9EAEBECED'x
           || 'EEEFF0F1F2F3F4F5'x
           || 'F6F8F9FAFBFCFDFE'x
        ) );
 dcl upper_00819 char
   value( (
              '4142434445464748'x
           || '494A4B4C4D4E4F50'x
           || '5152535455565758'x
           || '595AC0C1C2C3C4C5'x
           || 'C6C7C8C9CACBCCCD'x
           || 'CECFD0D1D2D3D4D5'x
           || 'D6D8D9DADBDCDDDE'x
        ) );
 dcl lower_00850 char
   value( (
              '6162636465666768'x
           || '696A6B6C6D6E6F70'x
           || '7172737475767778'x
           || '797A818283848586'x
           || '8788898A8B8C8D91'x
           || '93949596979BA0A1'x
           || 'A2A3A4C6D0E4E7EC'x
        ) );
 dcl upper_00850 char
   value( (
              '4142434445464748'x
           || '494A4B4C4D4E4F50'x
           || '5152535455565758'x
           || '595A9A90B68EB78F'x
           || '80D2D3D4D8D7DE92'x
           || 'E299E3EAEB9DB5D6'x
           || 'E0E9A5C7D1E5E8ED'x
        ) );
 dcl lower_00858 char
   value( (
              '6162636465666768'x
           || '696A6B6C6D6E6F70'x
           || '7172737475767778'x
           || '797A818283848586'x
           || '8788898A8B8C8D91'x
           || '93949596979BA0A1'x
           || 'A2A3A4C6D0E4E7EC'x
        ) );
 dcl upper_00858 char
   value( (
              '4142434445464748'x
           || '494A4B4C4D4E4F50'x
           || '5152535455565758'x
           || '595A9A90B68EB78F'x
           || '80D2D3D4D8D7DE92'x
           || 'E299E3EAEB9DB5D6'x
           || 'E0E9A5C7D1E5E8ED'x
        ) );
 dcl lower_00871 char
   value( (
              '8182838485868788'x
           || '8991929394959697'x
           || '9899A2A3A4A5A6A7'x
           || 'A8A9424344454647'x
           || '4849515253545556'x
           || '575870798DA1C0CB'x
           || 'CDCECFD0DBDCDDDE'x
        ) );
 dcl upper_00871 char
   value( (
              'C1C2C3C4C5C6C7C8'x
           || 'C9D1D2D3D4D5D6D7'x
           || 'D8D9E2E3E4E5E6E7'x
           || 'E8E9626364656667'x
           || '6869717273747576'x
           || '7778807CAD5F4AEB'x
           || 'EDEEEF5AFBFCFDFE'x
        ) );
 END MAINTP;`,

  // 12. Fixed decimal to binary conversion example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.127 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl A fixed dec(3,2) init(1.23);
   dcl B fixed bin(15,5);
   B = A;
 END MAINTP;`,

  // 13. Structure with handles example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.192 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
    define structure 1 child;
    define structure
     1 parent,
       2 first_child   handle child,
       2 parent_data   fixed bin(31);
    define structure
     1 child,
       2 parent        handle parent,
       2 next_child    handle child,
       2 child_data    fixed bin(31);
 END MAINTP;`,

  // 14. Binary float declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.78 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare S binary float (16);
 END MAINTP;`,

  // 15. Decimal fixed declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.78 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare D decimal fixed real(3,2);
 END MAINTP;`,

  // 16. INITACROSS and DIMACROSS example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.322 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl
     1 a(*)   dimacross
              initacross(  ( 'DE', 'Germany' )
                          ,( 'FE', 'France' )
                          ,( 'SP', 'Spain' )
                        )
       ,2 b     char(2)
       ,2 c     char(40) var
     ;
 END MAINTP;`,

  // 17. Structure declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.234 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl 1 a, 2 b char(8), 2 c fixed dec(5,0);
 END MAINTP;`,

  // 18. Typed structure example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.195 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 dcl 1 A,
 2 B fixed bin,
 2 C fixed bin;
 define structure
 1 X,
 2 Y fixed bin,
 2 Z fixed bin;
 dcl S type X;
 END MAINTP;`,

  // 19. Array declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.225 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare Table (4,2) fixed dec (3);
 END MAINTP;`,

  // 20. Ordinal type with FIRST function example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.642 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   define ordinal Color ( Red,
                          Orange,
                          Yellow,
                          Green,
                          Blue,
                          Indigo,
                          Violet );
   display (ordinalname( first(Color) ));  /* RED */
 END MAINTP;`,

  // 21. DEFINE and POSITION example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.318 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DCL A(20) CHAR(10),
     B(10) CHAR(5) DEF (A) POSITION(1);
 END MAINTP;`,

  // 22. Picture and DEFINE example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.318 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DCL E PIC'99V.999',
     Z1(6) CHAR(1) DEF (E),
     Z2 CHAR(3) DEF (E) POS(4),
     Z3(4) CHAR(1) DEF (E) POS(2);
 END MAINTP;`,

  // 23. DEFAULT DESCRIPTORS example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.220 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DEFAULT DESCRIPTORS BINARY;
 DCL X ENTRY (FIXED, FLOAT);
 END MAINTP;`,

  // 24. Secondary entry point example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.145 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   Name: procedure;
   B: entry;
   end Name;
 END MAINTP;`,

  // 25. MEMSEARCHR example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.541 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl cb(128*1024) char(1);
   dcl wb(128*1024) widechar(1);
   dcl pos fixed bin(31);
   /* 128K bytes searched from the right for a numeric */
   pos = memsearchr( addr(cb), stg(cb), '012345789' );
   /* 256K bytes searched from the right for a widechar '0' or '1' */
   pos = memsearchr( addr(wb), stg(wb), '0030_0031'wx );
 END MAINTP;`,

  // 26. MEMSQUEEZE example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.542 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 dcl s  char(20);
 dcl t  char(20);
 dcl cx fixed bin(31);
  
 s  = '...abc....def...gh..';
 cx = memsqueeze(sysnull(), 0, addr(s), stg(s), '.');
       /* cx = 12         */
 cx = memsqueeze(addr(t), stg(t), addr(s), stg(s), '.');
       /* cx = 12         */
       /* t = '.abc.def.gh.' */
  
 END MAINTP;`,

  // 27. VARYINGZ vs NONVARYING example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.83 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Z char(3) nonvarying init('abc');
   dcl C char(3) varyingz init('abc');
 END MAINTP;`,

  // 28. Complex structure with arrays example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.237 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   Declare 1 Year(1901:2100),
             3 Month(12),
               5 Temperature,
                 7 High decimal fixed(4,1),
                 7 Low decimal fixed(4,1),
               5 Wind_velocity,
                 7 High decimal fixed(3),
                 7 Low decimal fixed(3),
              5 Precipitation,
                7 Total decimal fixed(3,1),
                7 Average decimal fixed(3,1),
            3 * char(0);
 END MAINTP;`,

  // 29. Nested array structure example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.237 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
    declare
      1 A (2,2),
        2 B (2),
          3 C fixed bin,
          3 D fixed bin,
        2 E fixed bin;   
 END MAINTP;`,

  // 30. EXIT statement example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.272 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 EXIT;
 END MAINTP;`,

  // 31. Dynamic allocation example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.294 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 dcl Y char(*) ctl,
 N fixed bin;
 N=20;
 allocate Y char(N);
 allocate Y;
 END MAINTP;`,

  // 32. Payroll structure example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.228 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare 1 Payroll,                     /*  major structure name */
             2 Name,                      /*  minor structure name */
               3 Last char(20),           /*  elementary name      */
               3 First char(15),
             2 Hours,
               3 Regular fixed dec(5,2),
               3 Overtime fixed dec(5,2),
             2 Rate,
               3 Regular fixed dec(3,2),
               3 Overtime fixed dec(3,2);
 END MAINTP;`,

  // 33. Automatic storage example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.288 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl X fixed binary(31,0) automatic;
 END MAINTP;`,

  // 34. Fixed decimal initialization example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.70 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare Pi fixed decimal(5,4) initial(3.1416);
 END MAINTP;`,

  // 35. Pointer array initialization example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.321 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
    dcl pdays(7) static ptr init to(varyingz)
                   ('Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'  );
 END MAINTP;`,

  // 36. Typed structure with arrays example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.196 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   define structure
     1 t,
       2 b(4) fixed bin,
       2 c(5) fixed bin;
   dcl x(3) type t;
 END MAINTP;`,

  // 37. Array of structures example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.196 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl 1 a(3),
         2 b(4) fixed bin,
         2 c(5) fixed bin;
 END MAINTP;`,

  // 38. Date comparison example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.93 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
     dcl a   pic'(6)9' date;
     dcl b   pic'(6)9' def(a);
     dcl c   pic'(6)9' date;
     dcl d   pic'(6)9' def(c);
     b = '670101';
     d = '010101';
     display( b || ' < ' || d || ' ?' );
     display( a < c );
 END MAINTP;`,

  // 39. XMLCHAR example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.634 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
     dcl buffer   char(800);
     dcl written  fixed bin(31);
     dcl next     pointer;
     dcl left     fixed bin(31);
     dcl
       1 a,
         2 a1,
           3 b1 char(8),
           3 b2 char(8),
         2 a2,
           3 c1 fixed bin,
           3 c2 fixed dec(5,1);
     b1 = ' t1';
     b2 = 't2';
     c1 = 17;
     c2 = -29;
     next = addr(buffer);
     left = stg(buffer);
     written = xmlchar( a, next, left );
     next += written;
     left -= written;
 END MAINTP;`,

  // 40. Bit and pointer declarations example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.276 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
     dcl A   bit(1);
     dcl B   bit(1);
     dcl C   bit(2);
     dcl D   bit(2);
     dcl P   pointer;
     dcl BX  based fixed bin(31);
 END MAINTP;`,

  // 41. HEX and HEXIMAGE example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.500 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Sweet char(5) init('Sweet');
   dcl Sixteen fixed bin(31) init(16) littleendian;
   dcl XSweet char(size(Sweet)*2+(size(Sweet)-1)/4);
   dcl XSixteen char(size(Sixteen)*2+(size(Sixteen)-1)/4);
   XSweet = hex(Sweet,'-');
              /* '53776565-74' */
   XSweet = heximage(addr(Sweet),length(Sweet),'-');
              /* '53776565-74' */
   XSixteen = hex(Sixteen,'-');
              /* '00000010' - bytes reversed */
   XSixteen = heximage(addr(Sixteen),stg(Sixteen),'-');
              /* '10000000' - bytes NOT reversed */
 END MAINTP;`,

  // 42. File variable declarations example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.331 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare Account file variable,
     Acct1 file,
     Acc2 file;
 END MAINTP;`,

  // 43. Picture specification example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.381 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl digit picture'9',
       Count picture'999',
       XYZ picture '(10)9';
 END MAINTP;`,

  // 44. DEFAULT statement example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.222 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DFT RANGE(*) VALUE(FIXED BINARY(31));
 END MAINTP;`,

  // 45. DIMACROSS example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.257 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
    dcl
      1 x,
         2 a fixed bin(31),
         2 b fixed bin(31),
         2 c fixed bin(31),
         2 d fixed bin(31);
    dcl 1 xa(17) dimacross like x;
    dcl jx fixed bin;
    x = 0;
    do jx = lboundacross( xa ) to hboundacross( xa );
       x = x + xa, by dimacross( jx );
    end;                             
 END MAINTP;`,

  // 46. LIKE attribute example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.233 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl 1 aa(30)                           
      ,5 aa1               char( 5)       
      ,5 aa2               fixed bin(31)  
      ,5 aa3_array(30)                    
        ,7 aa3_1           fixed dec(15,2)
        ,7 aa3_2           fixed dec(15,2)
        ,7 aa3_3           fixed dec(11,4)
        ,7 aa3_4           fixed dec(7,3) 
     ;  
   dcl bb                  like aa;          
   dcl cc                  like aa3_array;                                                                           
 END MAINTP;`,

  // 47. LIKE attribute with nested structures example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.232 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
    dcl 1 a, 2 a1 fixed bin; 
    dcl 1 b, 2 b1 like a;    
    dcl 1 c, 2 c1 like b;    
                              
    dcl 1 d, 2 d1 fixed bin; 
    dcl 1 e  like d;         
 END MAINTP;`,

  // 48. Fixed decimal initialization example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.324 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Pi fixed dec(5,4) init(3.1416);
 END MAINTP;`,

  // 49. Character initialization example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.324 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl Name char(10) init('John Doe');
 END MAINTP;`,

  // 50. %PAGE directive example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.279 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 %PAGE
 ;
 END MAINTP;`,

  // 51. External entry declaration example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.206 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl X entry external ('koala');
 END MAINTP;`,

  // 52. Picture specification for numeric data example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.91 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare Price picture '999V99';
 END MAINTP;`,

  // 53. Picture specification with editing characters example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.91 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   declare Price picture '$99V.99',
           Cost character (6),
           Amount fixed decimal (6,2);
   Price = 12.28;
   Cost = '$12.28';
 END MAINTP;`,

  // 54. Graphic to character conversion example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.472 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
   dcl X graphic(6);
   dcl A char (12);
   A = char(X,11);
 END MAINTP;`,

  // 55. Preprocessor example
  `/* Enterprise PL/I for z/OS Language Reference v6.1, pg.676 */
 MAINTP: PROCEDURE OPTIONS (MAIN);
 DECLARE (Z(10),Q) FIXED;
 Q = 6+Z(       3);
 END MAINTP;`,
];
