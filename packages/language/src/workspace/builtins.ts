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

import { TextDocument } from "vscode-languageserver-textdocument";
import { UriUtils } from "../utils/uri";

export const KNOWN_BUILTINS = "/* Known Builtins */";

/**
 * For CTRL+F: pli-builtin:///builtins.pli
 */

export const BuiltinsUriSchema = "pli-builtin";

export const BuiltinsBoolean = `
 /* Boolean built-in constants */
 DECLARE TRUE  BIT(1) INITIAL(1);
 DECLARE FALSE BIT(1) INITIAL(0);

`;

export const BuiltinsFiles = `
 /* Built-in files */
 DECLARE SYSIN    EXTERNAL STREAM INPUT;
 DECLARE SYSPRINT EXTERNAL STREAM OUTPUT PRINT;

`;

export const BuiltinsSqlcaName = "SQLCA";
export const BuiltinsSqlcaFile = BuiltinsSqlcaName.toLowerCase() + ".pli";
export const BuiltinsSqlcaUri = `${BuiltinsUriSchema}:/${BuiltinsSqlcaFile}`;
export const BuiltinsSqlca = ` DECLARE 1 SQLCA,
    2 SQLCAID CHAR(8),
    2 SQLCABC FIXED(31) BINARY,
    2 SQLCODE FIXED(31) BINARY,
    2 SQLERRM CHAR(70) VAR,
    2 SQLERRP CHAR(8),
    2 SQLERRD(6) FIXED(31) BINARY,
    2 SQLWARN,
      3 SQLWARN0 CHAR(1),
      3 SQLWARN1 CHAR(1),
      3 SQLWARN2 CHAR(1),
      3 SQLWARN3 CHAR(1),
      3 SQLWARN4 CHAR(1),
      3 SQLWARN5 CHAR(1),
      3 SQLWARN6 CHAR(1),
      3 SQLWARN7 CHAR(1),
    2 SQLEXT,
      3 SQLWARN8 CHAR(1),
      3 SQLWARN9 CHAR(1),
      3 SQLWARNA CHAR(1),
      3 SQLSTATE CHAR(5);
`;

export const BuiltinsSqlcaDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsSqlcaUri).toString(),
  "pli",
  0,
  BuiltinsSqlca,
);

export const BuiltinsSqldaName = "SQLDA";
export const BuiltinsSqldaFile = BuiltinsSqldaName.toLowerCase() + ".pli";
export const BuiltinsSqldaUri = `${BuiltinsUriSchema}:/${BuiltinsSqldaFile}`;
export const BuiltinsSqlda = ` DECLARE
  1 SQLDA BASED(SQLDAPTR),
    2 SQLDAID CHAR(8),
    2 SQLDABC FIXED(31) BINARY,
    2 SQLN    FIXED(15) BINARY,
    2 SQLD    FIXED(15) BINARY,
    2 SQLVAR(SQLSIZE REFER(SQLN)),
      3 SQLTYPE  FIXED(15) BINARY,
      3 SQLLEN   FIXED(15) BINARY,
      3 SQLDATA  POINTER,
      3 SQLIND   POINTER,
      3 SQLNAME  CHAR(30)  VAR;
 /* */
 DECLARE
  1 SQLDA2 BASED(SQLDAPTR),
    2 SQLDAID2 CHAR(8),
    2 SQLDABC2 FIXED(31) BINARY,
    2 SQLN2    FIXED(15) BINARY,
    2 SQLD2    FIXED(15) BINARY,
    2 SQLVAR2(SQLSIZE REFER(SQLN2)),
      3 SQLBIGLEN,
        4 SQLLONGL FIXED(31) BINARY,
        4 SQLRSVDL FIXED(31) BINARY,
      3 SQLDATAL POINTER,
      3 SQLTNAME CHAR(30) VAR;
 /* */
 DECLARE SQLSIZE    FIXED(15) BINARY;
 DECLARE SQLDAPTR   POINTER;
 DECLARE SQLTRIPLED CHAR(1)   INITIAL('3');
 DECLARE SQLDOUBLED CHAR(1)   INITIAL('2');
 DECLARE SQLSINGLED CHAR(1)   INITIAL(' ');
`;

export const BuiltinsSqldaDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsSqldaUri).toString(),
  "pli",
  0,
  BuiltinsSqlda,
);

export const BuiltinsTypeFunctions = `
 BIND: PROC (t, p); END;
 CAST: PROC (t, x); END;
 FIRST: PROC (t); END;
 LAST: PROC (t); END;
 NEW: PROC (t); END;
 RESPEC: PROC (t, x); END;
 SIZE: PROC (t); END;
 VALUE: PROC (t); END;
`;

export const BuiltinsFile = "builtins.pli";
export const BuiltinsUri = `${BuiltinsUriSchema}:/${BuiltinsFile}`;
export const Builtins =
  `
 /**
  * \`ABS\` returns the absolute value of \`value\`. It is the positive
  * value of \`value\`.
  * The mode of the result is \`REAL\`. The result has the base, scale,
  * and precision of \`value\`, except when \`value\` is
  * \`COMPLEX FIXED(p,q)\`. In the latter case, the result is 
  * \`REAL FIXED(min(n,p+1),q)\` where \`n\` is \`N\` for \`DECIMAL\`
  * and \`M\` for \`BINARY\`.
  * @param {ANY<NUMBER>} value Expression.
  * @returns {ANY<NUMBER>} absolute value of \`value\`
  */
 ABS: PROC (value) RETURNS (ANY<NUMBER>);
   DECLARE value ANY<NUMBER>;
 END;

 /**
  * \`CEIL\` determines the smallest integer value greater than or
  * equal to \`value\`, and assigns this value to the result.
  * 
  * The result has the mode, base, scale, and precision of \`value\`,
  * except when \`value\` is fixed-point with precision \`(p,q)\`.
  * The precision of the result is then given by: 
  * 
  * \`(min(N,max(p-q+1,1)),0)\`
  * 
  * where \`N\` is the maximum number of digits allowed.
  * If the expression \`value\` has the form \`(y/z)\` where \`y\` is 
  * an unscaled \`FIXED BIN\` expression and \`z\` is an unscaled
  * \`FIXED\` expression, then \`CEIL(value)\` will be evaluated by
  * computing the integral quotient and then rounding it up by one if
  * the following conditions are met: The quotient is non negative.
  * The remainder of \`(y/z)\` is not zero.
  * If the expression \`value\` has the attributes \`FIXED BIN(p,q)\`
  * but does not have the form above, then \`q\` must be positive.
  * 
  * @param {ANY<NUMBER>} value Real expression.
  * @returns {ANY<NUMBER>} smallest integer value greater than or
  *   equal to \`value\`.
  */
 CEIL: PROC (value) RETURNS (ANY<NUMBER>);
   DECLARE value ANY<NUMBER>;
 END;

 /**
  * COMPLEX returns the complex value \`x\` + \`y\`.
  *
  * Abbreviation: CPLX
  *
  * If fixed-point, the precision of the result is given by the
  * following:
  * 
  * \`\`\`
  *   (min(N,max(p1-q1,p2-q2)+max(q1,q2)),max(q1,q2))
  * \`\`\`
  * 
  * In this example, (p1,q1) and (p2,q2) are the precisions of \`x\`
  * and \`y\`, respectively, and N is the maximum number of digits
  * allowed.
  *
  * After any necessary conversions have been performed, if the
  * arguments are floating-point, the result has the precision of
  * the longer argument.
  *
  * @param {ANY<NUMBER>} x Real expressions.
  *
  *   If \`x\` and \`y\` differ in base, the decimal argument is
  *   converted to binary. If they differ in scale, the fixed-point
  *   argument is converted to floating-point. The result has the
  *   common base and scale.
  * 
  * @param {ANY<NUMBER>} y Real expressions.
  *
  *   If \`x\` and \`y\` differ in base, the decimal argument is
  *   converted to binary. If they differ in scale, the fixed-point
  *   argument is converted to floating-point. The result has the
  *   common base and scale.
  * 
  * @returns {ANY<NUMBER>} complex value \`x\` + \`y\` * \`i\`
  */
 COMPLEX: CPLX:  PROC (x, y) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE y ANY<NUMBER>;
 END;

 /**
  * CONJG returns the conjugate of \`x\`, that is, the value of the
  * expression with the sign of the imaginary part reversed.
  *
  * @param {ANY<NUMBER>} x Expression.
  *
  *   If \`x\` is real, it is converted to complex. The result has
  *   the base, scale, mode, and precision of \`x\`.
  * 
  * @returns {ANY<NUMBER>} conjugate of \`x\`
  */
 CONJG: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
 END;

 /**
  * FLOOR returns the largest integer value less than or equal to
  * \`x\`.
  *
  * The mode, base, scale, and precision of the result match the
  * argument. Except when \`x\` is fixed-point with precision
  * (\`p,q\`), the precision of the result is given by:
  * 
  * \`\`\`
  *   (min(n,max(p-q+1,1)),0)
  * \`\`\`
  *
  * where n is the maximum number of digits allowed and is N for
  * FIXED DECIMAL or M for FIXED BINARY.
  *
  * If the expression \`x\` has the form (\`y\`/\`z\`) where \`y\`
  * is an unscaled FIXED BIN expression and \`z\` is an unscaled
  * FIXED expression, then FLOOR(\`x\`) will be evaluated by
  * computing the integral quotient and then rounding it down by one
  * if the following conditions are met:
  * 
  * - The quotient is not positive.
  * - The remainder of (\`y\`/\`z\`) is not zero.
  *
  * If the expression \`x\` has the form (\`y\`/\`z\`) where \`y\`
  * is an unscaled FIXED BIN expression and \`z\` is an unscaled
  * FIXED expression, then TRUNC(\`x\`) will be evaluated by
  * computing the integral quotient and then rounding it according
  * to the following conditions:
  * 
  * Round it down if both conditions are met: 
  *   - The quotient is nonnegative.
  *   - The remainder of (\`y\`/\`z\`) is not zero.
  * 
  * Round it up if both conditions are met: 
  *   - The quotient is not positive.
  *   - The remainder of (\`y\`/\`z\`) is not zero.
  *
  * If the expression \`x\` has the attributes FIXED BIN(\`p,q\`)
  * but does not have the form above, then \`q\` must be positive.
  *
  * @param {ANY<NUMBER>} x Real expression.
  * 
  * @returns {ANY<NUMBER>} largest integer value less than or equal to
  * \`x\`
  */
 FLOOR: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
 END;

 /**
  * IMAG returns the imaginary part of \`x\`. The mode of the result
  * is real and has the base, scale, and precision of \`x\`.
  *
  * @param {ANY<NUMBER>} x Expression. If \`x\` is real, it is
  *   converted to complex, and an appropriate zero value is returned.
  * 
  * @returns {ANY<NUMBER>} imaginary part of \`x\`
  */
 IMAG: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
 END;

 /**
  * MAX returns the largest value from a set of two or more
  * expressions.
  *
  * All the arguments must be real. The result is real, with the
  * common base and scale of the arguments.
  *
  * If the arguments are fixed-point with precisions:
  * 
  * \`\`\`
  *   (p1,q1),(p2,q2),...,(pn,qn)
  * \`\`\`
  * 
  * then the precision of the result is given by:
  * 
  * \`\`\`
  *   (min(N,max(p1-q1,p2-q2,...,pn-qn)
  *    + max(q1,q2,...,qn)),max(q1,q2,...,qn))
  * \`\`\`
  * 
  * where N is the maximum number of digits allowed.
  *
  * If the arguments are floating-point with precisions:
  * 
  * \`\`\`
  *   p1,p2,p3,...pn
  * \`\`\`
  * 
  * then the precision of the result is given by:
  * 
  * \`\`\`
  *   max(p1,p2,p3,...pn)
  * \`\`\`
  *
  * The maximum number of arguments allowed is 64.
  *
  * If all the arguments are UNSIGNED FIXED BIN, then the result is
  * UNSIGNED FIXED BIN.
  *
  * @param {ANY<NUMBER>} x Expression.
  * @param {ANY<NUMBER> LIST} y Expression.
  * @returns {ANY<NUMBER>} largest value from a set of two or more
  *   expressions
  */
 MAX: PROC (x, y) RETURNS (ANY<NUMBER>);
    DECLARE x ANY<NUMBER>;
    DECLARE y ANY<NUMBER> LIST;
 END;

 /**
  * MAXVAL returns the maximum value that its numeric operand could
  * assume.
  *
  * MAXVAL(x) >= x and MINVAL(x) <= x are always true.
  *
  * The following table shows the relations among MAXVAL(x),
  * MINVAL(x) and HUGE(x), when x is FLOAT.
  * 
  * | Built-in functions | Same as |
  * | --- | --- |
  * | MAXVAL(x) | HUGE(x) |
  * | MINVAL(x) | -HUGE(x) |
  * 
  * For more information, see HUGE and TINY.
  *
  * MAXVAL(x) is a constant and can be used in restricted
  * expressions.
  *
  * @param {ANY<NUMBER> REAL} x An expression. \`x\` must have the REAL
  *   attribute.
  * @returns {ANY<NUMBER>} maximum value that its numeric operand could
  *   assume.
  */
 MAXVAL: PROC (x) RETURNS (ANY<NUMBER>);
   DCL x ANY<NUMBER> REAL;
 END;

 /**
  * MIN returns the smallest value from a set of one or more
  * expressions.
  *
  * All the arguments must be real. The result is real with the
  * common base and scale of the arguments.
  *
  * The precision of the result is the same as that described in
  * MAX.
  *
  * The maximum number of arguments allowed is 64.
  *
  * If all the arguments are UNSIGNED FIXED BIN, then the result is
  * UNSIGNED FIXED BIN.
  *
  * @param {ANY<NUMBER>} x Expression.
  * @param {ANY<NUMBER>} y Expression.
  * @returns {ANY<NUMBER>} smallest value from a set of one or more
  *   expressions
  */
 MIN: PROC (x, y) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE y ANY<NUMBER> LIST;
 END;

 /**
  * MINVAL returns the minimum value that its numeric operand could
  * assume.
  *
  * MAXVAL(x) >= x and MINVAL(x) <= x are always true.
  *
  * The following table shows the relations among MAXVAL(x),
  * MINVAL(x) and HUGE(x), when x is FLOAT.
  * 
  * | Built-in functions | Same as |
  * | --- | --- |
  * | MAXVAL(x) | HUGE(x) |
  * | MINVAL(x) | -HUGE(x) |
  * 
  * For more information, see HUGE and TINY.
  *
  * MINVAL(x) is a constant and can be used in restricted
  * expressions.
  *
  * @param {ANY<NUMBER> REAL} x An expression. \`x\` must have the REAL
  *   attribute.
  * @returns {ANY<NUMBER>} minimum value that its numeric operand could
  *   assume.
  */
 MINVAL: PROC (x) RETURNS (ANY<NUMBER>);
   DCL x ANY<NUMBER> REAL;
 END;

 /**
  * MOD returns the modular equivalent of the remainder of one value
  * divided by another.
  *
  * MOD returns the smallest nonnegative value, R, such that (x -
  * R)/y = n.
  *
  * In this example, the value for \`n\` is an integer value. That
  * is, R is the smallest nonnegative value that must be subtracted
  * from \`x\` to make it divisible by \`y\`.
  *
  * The result, R, is real with the common base and scale of the
  * arguments. If the result is floating-point, the precision is the
  * greater of those of \`x\` and \`y\`. If the result is
  * fixed-point, the precision is given by the following:
  * 
  * \`\`\`
  *   (min(n,p2-q2+max(q1,q2)),max(q1,q2))
  * \`\`\`
  *
  * In this example, (p1,q1) and (p2,q2) are the precisions of \`x\`
  * and \`y\`, respectively, and n is N for FIXED DECIMAL or M for
  * FIXED BINARY.
  *
  * If \`x\` and \`y\` are fixed-point with different scaling
  * factors, the argument with the smaller scaling factor is
  * converted to the larger scaling factor before R is calculated.
  * If the conversion fails, the result is unpredictable.
  *
  * If the result has the attributes FIXED BIN and all of the
  * operands have the attributes UNSIGNED FIXED BIN, then the result
  * has the UNSIGNED attribute. If only some of the operands are
  * UNSIGNED, then each UNSIGNED operand is converted to SIGNED. If
  * the operand is too large, the conversion would:
  * 
  * - Raise the SIZE condition if SIZE is enabled.
  * - Produce a negative value if SIZE is not enabled.
  *
  * **Example**
  * 
  * The following example contrasts the MOD and REM built-in
  * functions.
  * 
  * \`\`\`
  *   rem( +10, +8 ) = 2
  *   mod( +10, +8 ) = 2
  * 
  *   rem( +10, -8 ) = 2
  *   mod( +10, -8 ) = 2
  * 
  *   rem( -10, +8 ) = -2
  *   mod( -10, +8 ) = 6
  * 
  *   rem( -10, -8 ) = -2
  *   mod( -10, -8 ) = 6
  * \`\`\`
  *
  * @param {ANY<NUMBER>} x Real expression.
  * @param {ANY<NUMBER>} y Real expression. If \`y\` = 0,
  *   the ZERODIVIDE condition is raised.
  * @returns {ANY<NUMBER>} modular equivalent of the remainder of one 
  *   value
  */
 MOD: PROC (x, y) RETURNS (ANY<NUMBER>);
    DECLARE x ANY<NUMBER>;
    DECLARE y ANY<NUMBER>;
 END;

 /**
  * RANDOM returns a FLOAT BINARY(53) random number generated using
  * \`x\` as the given seed. If \`x\` is omitted, the random number
  * generated is based on the seed provided by the last RANDOM
  * invocation with a seed, or on a default initial seed of 1 if
  * RANDOM has not previously been invoked with a seed.
  *
  * The values generated by RANDOM are uniformly distributed between
  * 0 and 1, with 0 < random(x) < 1. They are generated as follows
  * using the multiplicative congruential method:
  * 
  * \`\`\`
  *   seed(x) = mod(950706376 * seed(x - 1), 2147483647)
  *   random(x) = seed(x) / 2147483647
  * \`\`\`
  * 
  * The seed is maintained at the program level and not within each
  * thread in a multithreading application.
  *
  * @param {ANY<NUMBER>} [x] Expression. \`x\` must have a computational type
  *   and should have an arithmetic type. If \`x\` is numeric, it
  *   must be real. If \`x\` is not specified FIXED BINARY(31,0), it
  *   is converted.
  *
  *   Unless 0 < \`x\` < 2,147,483,646, the ERROR condition is
  *   raised.
  * @returns {ANY<NUMBER>} random number generated using \`x\` as the
  *   given seed
  */
 RANDOM: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER> OPTIONAL;
 END;

 /**
  * REAL returns the real part of \`x\`. The result has the base,
  * scale, and precision of \`x\`.
  *
  * @param {ANY<NUMBER>} x Expression. If \`x\` is real, it is converted to
  *   complex.
  * @returns {ANY<NUMBER>} real part of \`x\`
  */
 REAL: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
 END;

 /**
  * REM returns the remainder of \`x\` divided by \`y\`.
  *
  * This can be calculated by:
  * 
  * \`\`\`
  *   x - y * trunc(x/y)
  * \`\`\`
  *
  * For examples that contrast the REM and MOD built-in functions,
  * refer to MOD.
  *
  * @param {ANY<NUMBER>} x Expression. \`x\` must be computational and
  *   can be arithmetic.
  * @param {ANY<NUMBER>} y Expression. \`y\` must be computational and
  *   can be arithmetic.
  * @returns {ANY<NUMBER>} remainder of \`x\` divided by \`y\`
  */
 REM: PROC (x, y) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE y ANY<NUMBER>;
 END;

 /**
  * ROUND returns the value of \`x\` rounded at a digit specified by
  * \`n\`. The result has the mode, base, and scale of \`x\`.
  *
  * **ROUND of FIXED**
  * 
  * The precision of a FIXED result is:
  * 
  * \`\`\`
  *   (max(1,min(p-q+1+n,N)),n)
  * \`\`\`
  * 
  * Where (\`p,q\`) is the precision of \`x\`, and N is the maximum
  * number of digits allowed. Hence, \`n\` specifies the scaling
  * factor of the result.
  * 
  * \`n\` must conform to the limits of scaling-factors for FIXED
  * data. If \`n\` is greater than 0, rounding occurs at the
  * (\`n\`)th digit to the right of the point. If \`n\` is zero or
  * negative, rounding occurs at the (1-\`n\`)th digit to the left
  * of the point.
  * 
  * In ROUND(\`x\`,\`n\`), \`n\` must not specify a digit too far to
  * the right or too far to the left. To express this in
  * mathematical terms: \`n\` <= q and 0 <= (p - q) + n must be
  * true.
  * 
  * The value of the result is given by the following formula, where
  * b = 10 if \`x\` is DECIMAL:
  * 
  * \`\`\`
  * round(x,n) = sign(x)*(b-n)* floor(abs(x)* (bn) + 1/2)
  * \`\`\`
  * 
  * So, in the following example, the value 6.67 is output:
  * 
  * \`\`\`
  *     dcl X fixed dec(5,4) init(6.6666);
  * 
  *     put skip list( round(X,2) );
  * \`\`\`
  *
  * **ROUND of IEEE decimal floating point**
  * 
  * The precision of an IEEE DECIMAL FLOAT result is the same as
  * that of the source argument.
  * 
  * The value of the result is given by the following formula, where
  * where b = 10 (=radix(x)) and e = exponent(x):
  * 
  * \`\`\`
  * round(x,n) = sign(x)*(b(e-n))* floor(abs(x)* (b(n-e)) + 1/2)
  * \`\`\`
  * 
  * So, if the FLOAT(DFP) compiler option is in effect, these
  * successive roundings of 3.1415926d0 would produce the following
  * values:
  * 
  * \`\`\`
  *     dcl x float dec(16) init( 3.1415926d0 );
  * 
  *     display( round(x,1) );  // 3.000000000000000E+0000
  *     display( round(x,2) );  // 3.100000000000000E+0000
  *     display( round(x,3) );  // 3.140000000000000E+0000
  *     display( round(x,4) );  // 3.142000000000000E+0000
  *     display( round(x,5) );  // 3.141600000000000E+0000
  *     display( round(x,6) );  // 3.141590000000000E+0000
  * \`\`\`
  *
  * **ROUND of IEEE binary floating point**
  * 
  * The precision of an IEEE binary floating point result is the
  * same as that of the source argument.
  * 
  * Under the compiler option USAGE(ROUND(IBM)), the value of the
  * result is the same as the source except on z/OS where if the
  * source is not zero, then the result is obtained by turning on
  * the rightmost bit in the source.
  * 
  * Under the compiler option USAGE(ROUND(ANS)), the value of the
  * result is given by the following formula, where where b = 2
  * (=radix(x)) and e = exponent(x):
  * 
  * \`\`\`
  * round(x,n) = sign(x)*(b(e-n))* floor(abs(x)* (b(n-e)) + 1/2)
  * \`\`\`
  * 
  * Note that under USAGE(ROUND(ANS)), the rounding is a base 2
  * rounding, and the results may not be what a naive user expects.
  * For example, if compiled with USAGE(ROUND(ANS)) and IEEE binary
  * floating point instructions are used, these successive roundings
  * of 3.1415926d0 would produce the following values:
  * 
  * \`\`\`
  *     dcl x float bin(53) init( 3.1415926d0 );
  * 
  *     display( round(x,1) );  //  4.000000000000000E+0000
  *     display( round(x,2) );  //  3.000000000000000E+0000
  *     display( round(x,3) );  //  3.000000000000000E+0000
  *     display( round(x,4) );  //  3.250000000000000E+0000
  *     display( round(x,5) );  //  3.125000000000000E+0000
  *     display( round(x,6) );  //  3.125000000000000E+0000
  *     display( round(x,7) );  //  3.156250000000000E+0000
  * \`\`\`
  *
  * **ROUND of IBM hexadecimal floating point**
  * 
  * The precision of an IBM hexadecimal floating point result is the
  * same as that of the source argument.
  * 
  * Under the compiler option USAGE(ROUND(IBM)), the value of the
  * result is the same as the source except on z/OS where if the
  * source is not zero, then the result is obtained by turning on
  * the rightmost bit in the source.
  * 
  * Under the compiler option USAGE(ROUND(ANS)), the value of the
  * result is given by the following formula, where where b = 16
  * (=radix(x)) and e = exponent(x):
  * 
  * \`\`\`
  * round(x,n) = sign(x)*(b(e-n))* floor(abs(x)* (b(n-e)) + 1/2)
  * \`\`\`
  * 
  * Note that under USAGE(ROUND(ANS)), the rounding is a base 16
  * rounding, and the results may not be what a naive user expects.
  * For example, if compiled with USAGE(ROUND(ANS)) and IBM
  * hexadecimal floating point instructions are used, these
  * successive roundings of 3.1415926d0 would produce the following
  * values:
  * 
  * \`\`\`
  *     dcl x float bin(53) init( 3.1415926d0 );
  * 
  *     display( round(x,1) );  //  3.000000000000000E+00
  *     display( round(x,2) );  //  3.125000000000000E+00
  *     display( round(x,3) );  //  3.140625000000000E+00
  *     display( round(x,4) );  //  3.141601562500000E+00
  *     display( round(x,5) );  //  3.141586303710938E+00
  *     display( round(x,6) );  //  3.141592979431152E+00
  * \`\`\`
  *
  * @param {ANY<NUMBER>} x Real expression. If \`x\` is negative, the
  *   absolute value is rounded and the sign is restored.
  * @param {ANY<NUMBER>} n Optionally-signed integer. It specifies the
  *   digit at which rounding is to occur.
  * @returns {ANY<NUMBER>} value of \`x\` rounded at a digit specified 
  *   by \`n\`.
  */
 ROUND: PROC (x, n) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE n ANY<NUMBER>;
 END;

 /**
  * ROUNDAWAYFROMZERO returns the value of \`x\` rounded at a digit
  * specified by \`n\`, following the rule of round half away from
  * zero. The result has the mode, base, and scale of \`x\`.
  *
  * Note: The ROUNDAWAYFROMZERO built-in function used to be named
  * as ROUNDDEC.
  *
  * If \`x\` is FIXED DECIMAL or PICTURE FIXED DECIMAL,
  * ROUNDAWAYFROMZERO produces the same results as ROUND.
  *
  * If \`x\` is FLOAT DECIMAL or PICTURE FLOAT DECIMAL and the
  * FLOAT(DFP) compiler option is in effect, ROUNDAWAYFROMZERO
  * rounds \`x\` at the nth decimal place rather than at the nth
  * digit (as would the ROUND built-in function in accordance with
  * the ANSI definition). For example, these successive roundings of
  * 3141.592653589793d0 would produce the following values:
  * 
  * \`\`\`
  *     dcl x float dec(16) init( 3141.592653589793d0 );
  * 
  *     display( fixed(roundawayfromzero(x,1),15,7) );  // 3141.6000000
  *     display( fixed(roundawayfromzero(x,2),15,7) );  // 3141.5900000
  *     display( fixed(roundawayfromzero(x,3),15,7) );  // 3141.5930000
  *     display( fixed(roundawayfromzero(x,4),15,7) );  // 3141.5927000
  *     display( fixed(roundawayfromzero(x,5),15,7) );  // 3141.5926500
  *     display( fixed(roundawayfromzero(x,6),15,7) );  // 3141.5926540
  *     display( fixed(roundawayfromzero(x,7),15,7) );  // 3141.5926536
  * \`\`\`
  *
  * ROUNDAWAYFROMZERO complements the CEIL, FLOOR, and TRUNC
  * built-in functions.
  * 
  * - ROUNDAWAYFROMZERO(x,0) rounds away from zero.
  * - CEIL(x) rounds toward positive infinity.
  * - FLOOR(x) rounds toward negative infinity.
  * - TRUNC(x) rounds toward zero.
  *
  * @param {ANY<NUMBER>} x A real expression that is FIXED DECIMAL or 
  *   DFP FLOAT. If \`x\` is negative, the absolute value is rounded and
  *   the sign is restored.
  * @param {ANY<NUMBER>} n An optionally-signed integer that specifies
  *   the digit at which rounding is to occur.
  * @returns {ANY<NUMBER>} value of \`x\` rounded at a digit specified
  *   by \`n\`, following the rule of round half away from zero.
  */
 ROUNDAWAYFROMZERO: ROUNDDEC: PROC (x, n) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE n ANY<NUMBER>;
 END;

 /**
  * ROUNDTOEVEN returns the value of \`x\` rounded at a digit
  * specified by \`n\` following the rounding rule of round half to
  * even.
  *
  * The ROUNDTOEVEN built-in function is basically same as the
  * ROUNDAWAYFROMZERO built-in function except that the
  * ROUNDAWAYFROMZERO function rounds ties away from the zero. For
  * example, under the ROUNDAWAYFROMZERO function, 24.5 gets rounded
  * to 25 and -24.5 gets rounded to -25. However, under the
  * ROUNDTOEVEN function, both 23.5 and 24.5 get rounded to 24 and
  * both -23.5 and -24.5 get rounded to -24.
  *
  * @param {ANY<NUMBER>} x A real expression that is FIXED DECIMAL or
  *   DFP FLOAT. If \`x\` is negative, the nearest even value is rounded
  *   and the sign is restored.
  * @param {ANY<NUMBER>} n An optionally-signed integer that specifies
  *   the digit at which rounding is to occur.
  * @return {ANY<NUMBER>} value of \`x\` rounded at a digit specified by
  *   \`n\` following the rounding rule of round half to even.
  */
 ROUNDTOEVEN: PROC (x, n) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE n ANY<NUMBER>;
 END;

 /**
  * SIGN returns an unscaled REAL FIXED BINARY value that indicates
  * whether \`x\` is positive, zero, or negative.
  *
  * The returned value is given by:
  *
  * | Value of x | Value Returned |
  * | --- | --- |
  * | x > 0 | +1 |
  * | x = 0 | 0 |
  * | x < 0 | -1 |
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * @param {ANY<NUMBER>} x Real expression.
  * @returns {FIXED BINARY} unscaled REAL FIXED BINARY value that 
  *   indicates whether \`x\` is positive, zero, or negative.
  */
 SIGN: PROC (x) RETURNS (FIXED BINARY);
   DECLARE x ANY<NUMBER>;
 END;

 /**
  * TRUNC returns an integer value that is the truncated value of
  * \`x\`. If \`x\` is positive or 0, this is the largest integer
  * value less than or equal to \`x\`. If \`x\` is negative, this is
  * the smallest integer value greater than or equal to \`x\`.
  *
  * The base, mode, scale, and precision of the result match those
  * of \`x\`. Except when x is fixed-point with precision (\`p,q\`),
  * the precision of the result is given by:
  * 
  * \`\`\`
  *   (min(N,max(p-q+1,1)),0)
  * \`\`\`
  *
  * where N is the maximum number of digits allowed.
  *
  * If the expression \`x\` has the attributes FIXED BIN(\`p,q\`)
  * but does not have the form above, then \`q\` must be positive.
  *
  * @param {ANY<NUMBER>} x Real expression.
  * @return {ANY<NUMBER>} integer value that is the truncated value of
  *  \`x\`
  */
 TRUNC: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
 END;

 /* Array handling functions */
 /**
  * ALL returns a bit string in which each bit is 1 if the
  * corresponding bit in each element of \`x\` exists and is 1. The
  * length of the result is equal to that of the longest element.
  *
  * @param {ANY(*)} x Computational array expression. If \`x\` is not
  *   a bit string array, then \`x\` is converted to a bit string
  *   array.
  * @return {BIT(*)} bit string in which each bit is 1 if the
  *   corresponding bit in each element of \`x\` exists and is 1
  */
 ALL: PROC (x) RETURNS (BIT(*));
   DCL x ANY(*);
 END;

 /**
  * ANY returns a bit string in which each bit is 1 if the
  * corresponding bit in any element of \`x\` exists and is 1. The
  * length of the result is equal to that of the longest element.
  *
  * @param {ANY(*)} x Computational array expression. If \`x\` is not
  *   a bit string array, then \`x\` is converted to a bit string
  *   array.
  * @return {BIT(*)} bit string in which each bit is 1 if the
  *   corresponding bit in any element of \`x\` exists and is 1
  */
 ANY: PROC (x) RETURNS (BIT(*));
   DCL x ANY(*);
 END;

 /**
  * DIMENSION returns a FIXED BINARY value that specifies the
  * current extent of dimension \`y\` of \`x\`.
  *
  * Abbreviation: DIM
  *
  * If \`y\` exceeds the number of dimensions of \`x\`, the
  * DIMENSION function returns an undefined value.
  *
  * Under the CMPAT(V3) compiler option, DIMENSION returns a FIXED
  * BIN(63) value. Under the CMPAT(V2) and CMPAT(LE) compiler
  * options, DIMENSION returns a FIXED BIN(31) value.
  *
  * Using LBOUND and HBOUND instead of DIMENSION is recommended.
  *
  * @param {ANY(*)} x Array reference. \`x\` must not have less than
  *   \`y\` dimensions.
  * @param {ANY<NUMBER>} [y] Expression specifying a particular dimension of
  *   \`x\`. If necessary, \`y\` is converted to a FIXED
  *   BINARY(31,0). \`y\` must be greater than or equal to 1. If
  *   \`y\` is not supplied, it defaults to 1.
  *
  *   \`y\` can be omitted only if the array is one-dimensional.
  * 
  * @returns {FIXED BINARY} value that specifies the current
  *   extent of dimension \`y\` of \`x\`
  */
 DIMENSION: DIM: PROC (x, y) RETURNS (FIXED BINARY);
   DCL x ANY(*);
   DCL y ANY<NUMBER> OPTIONAL;
 END;

 /**
  * HBOUND returns a FIXED BINARY value that specifies the current
  * upper bound of dimension \`y\` of \`x\`.
  *
  * Under the CMPAT(V3) compiler option, HBOUND returns a FIXED
  * BIN(63) value. Under the CMPAT(V2) and CMPAT(LE) compiler
  * options, HBOUND returns a FIXED BIN(31) value.
  *
  * @param {ANY(*)} x Array reference. \`x\` must not have less than
  *   \`y\` dimensions.
  * @param {ANY<NUMBER>} [y] Expression specifying a particular dimension of
  *   \`x\`. If necessary, \`y\` is converted to FIXED BINARY(31,0).
  *   \`y\` must be greater than or equal to 1. If \`y\` is not
  *   supplied, it defaults to 1.
  *
  *   \`y\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED BINARY} FIXED BINARY value that specifies the current
  *  upper bound of dimension \`y\` of \`x\`
  */
 HBOUND: PROC (x, y) RETURNS (FIXED BINARY);
   DCL x ANY(*);
   DCL y ANY<NUMBER> OPTIONAL;
 END;

 /**
  * HBOUNDACROSS returns a FIXED BINARY value that specifies the
  * current upper bound of a DIMACROSS reference \`x\`.
  *
  * Under the CMPAT(V3) compiler option, HBOUNDACROSS returns a
  * FIXED BIN(63) value. Under the CMPAT(V2) and CMPAT(LE) compiler
  * options, HBOUNDACROSS returns a FIXED BIN(31) value.
  *
  * **Example**
  * 
  * The following example shows the use of HBOUNDACROSS:
  * 
  * \`\`\`
  *      dcl jx fixed bin(31);
  * 
  *      dcl
  *        1 a,                            
  *          2 b fixed bin,                
  *          2 c fixed bin;                
  *      dcl 1 xa( 100 ) like a dimacross; 
  *     
  *      ... 
  * 
  *      do jx = 1 to hboundacross(xa);  
  *        a = xa, by dimacross(jx);     
  *        ...                           
  *      end;                            
  * \`\`\`
  *
  * @param {ANY(*) DIMACROSS} x DIMACROSS reference
  * @returns {FIXED BINARY} value that specifies the current upper
  *   bound of a DIMACROSS reference \`x\`
  */
 HBOUNDACROSS: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY(*) DIMACROSS;
 END;

 /**
  * INARRAY returns a BIT(1) value that indicates whether an
  * expression is equal to any of the elements of an array.
  *
  * @param {ANY} x Scalar expression. x must have a type that is
  *   comparable with the type of the elements of y.
  * @param {ANY(*)} y Array expression.
  *
  *   When y is a reference to a one-dimensional STATIC
  *   NONASSIGNABLE array with a simple INITIAL list, the compiler
  *   assumes the elements of y are constant and processes INARRAY(
  *   x, y ) as if it were INLIST( x, ... ) where ... denotes the
  *   elements of y.
  *
  *   For example, given
  *
  *   \`\`\`
  *   dcl countryCode char(2);
  *   dcl ccs(3) char(2) static nonasgn init( 'AT', 'DE', 'CH' );
  *   \`\`\`
  *
  *   then
  *
  *   \`\`\`
  *   INARRAY( countryCode, ccs )
  *   \`\`\`
  *
  *   is the same as
  *
  *   \`\`\`
  *   INLIST( countryCode, 'AT', 'DE', 'CH' )
  *   \`\`\`
  * @returns {BIT(1)} value that indicates whether an expression is
  *   equal to any of the elements of an array.
  */
 INARRAY: PROC (x, y) RETURNS (BIT(1));
   DCL x ANY;
   DCL y ANY(*);
 END;

 /**
  * LBOUND returns a FIXED BINARY value that specifies the current
  * lower bound of dimension \`y\` of \`x\`.
  *
  * Under the CMPAT(V3) compiler option, LBOUND returns a FIXED
  * BIN(63) value. Under the CMPAT(V2) and CMPAT(LE) compiler
  * options, LBOUND returns a FIXED BIN(31) value.
  *
  * @param {ANY(*)} x Array reference. \`x\` must not have less than
  *   \`y\` dimensions.
  * @param {ANY<NUMBER>} [y] Expression specifying a particular
  *   dimension of \`x\`. If necessary, \`y\` is converted to
  *   FIXED BINARY(31,0).
  *   The value for \`y\` must be greater than or equal to 1. and if
  *   \`y\` is not supplied, it defaults to 1.
  *
  *   The value for \`y\` can be omitted only if the array is
  *   one-dimensional.
  * @returns {FIXED BINARY} value that specifies the current
  *   lower bound of dimension \`y\` of \`x\`
  */
 LBOUND: PROC (x, y) RETURNS (FIXED BINARY);
   DCL x ANY(*);
   DCL y ANY<NUMBER> OPTIONAL;
 END;

 /**
  * LBOUNDACROSS returns a FIXED BINARY value that specifies the
  * current lower bound of a DIMACROSS reference \`x\`.
  *
  * Under the CMPAT(V3) compiler option, LBOUNDACROSS returns a
  * FIXED BIN(63) value. Under the CMPAT(V2) and CMPAT(LE) compiler
  * options, LBOUNDACROSS returns a FIXED BIN(31) value.
  *
  * @param {ANY(*) DIMACROSS} x DIMACROSS reference
  * @returns {FIXED BINARY} value that specifies the current lower
  *   bound of a DIMACROSS reference \`x\`
  */
 LBOUNDACROSS: PROC (x) RETURNS (FIXED BINARY);
   DCL x ANY(*) DIMACROSS;
 END;

 /**
  * POLY returns a floating-point value that is an approximation of
  * a polynomial formed from an one-dimensional array expressions x.
  * The returned value has the same attributes as the first
  * argument.
  *
  * x must be REAL FLOAT and y is converted to the attributes of x,
  * if necessary.
  *
  * If x has lower bound 0 and upper bound n, the result is a
  * classic polynomial of degree n in y with coefficients given by
  * x, i.e. the result is
  * 
  * \`\`\`
  *       x(0) + x(1)*y + x(2)*y**2 + ... + x(n)*y**n
  * \`\`\`
  *
  * In the general case, where x has lower bound m and upper bound
  * n, the result is the polynomial
  * 
  * \`\`\`
  *       x(m) + x(m+1)*y + x(m+2)*y**2 + ... + x(n)*y**(n-m)
  * \`\`\`
  *
  * @param {ANY(*)} x An array expression.
  * @param {ANY} y An element expression.
  * @return {FLOAT} floating-point value that is an approximation of a
  *   polynomial formed from an one-dimensional array expressions x.
  */
 POLY: PROC (x, y) RETURNS (FLOAT);
   DCL x ANY(*);
   DCL y ANY;
 END;

 /**
  * PROD returns the product of all the elements in \`x\`.
  *
  * The result has the precision of \`x\`, except that the result
  * for fixed-point integer values and strings is fixed-point with
  * precision (n,0), where \`n\` is the maximum number of digits
  * allowed. The base and mode match the converted argument \`x\`.
  *
  * @param {ANY(*)} x Array expression. If the elements of \`x\` are
  *   strings, they are converted to fixed-point integer values.
  *
  *   If the elements of \`x\` are not fixed-point integer values or
  *   strings, they are converted to floating-point and the result
  *   is floating-point.
  * @returns {ANY<NUMBER>} product of all the elements in \`x\`
  */
 PROD: PROC (x) RETURNS (ANY<NUMBER>);
   DCL x ANY(*);
 END;

 /**
  * QUICKSORT performs a quick-sort of an array by using a simple
  * compare.
  *
  * The sorted array elements are stored in increasing order, in
  * accordance with the result of a simple compare. If two elements
  * are equal, their order in the sorted array is unspecified.
  *
  * QUICKSORT overwrites the contents of x with the sorted elements.
  * When the quick-sort is finished, for elements j and k:
  * 
  * - if j < k, then x(j) < = x(k)
  *
  * @param {ANY(*)} x An array expression. x must be a one-dimensional
  *   array of scalars. If x is an array of NONVARYING BIT, it must
  *   be aligned.
  *
  *   The elements of the array x must satisfy one of the following:
  *
  *   - They must be computational and not COMPLEX
  *   - They must be POINTERs
  *   - They must be HANDLEs
  *   - They must be ORDINALs
  * @param {ANY<NUMBER>} [n] An expression that specifies the index of 
  *   the first array element to be examined. It defaults to LBOUND(x).
  * @param {ANY<NUMBER>} [m] An expression that specifies the number of
  *   to-be-examined array elements. The counting starts with the
  *   nth and defaults to HBOUND(x) – n + 1.
  */
 QUICKSORT: PROC (x, n, m);
   DCL x ANY(*);
   DCL n ANY<NUMBER> OPTIONAL;
   DCL m ANY<NUMBER> OPTIONAL;
 END;

 /**
  * QUICKSORTX performs a quick-sort of an array by using a
  * specified compare function.
  *
  * The function f must have the OPTLINK linkage and it is passed 2
  * POINTER BYVALUE arguments that hold the addresses of two
  * elements from the array x.
  *
  * The function f must have the attributes RETURNS( BYVALUE FIXED
  * BINARY(31) ), and it must return one of the values -1, 0 or +1:
  * 
  * - If the value of the first array element is less than the value
  * of the second array element, then the returned value must be -1.
  * - If the value of the first array element is equal to the value
  * of the second array element, then the returned value must be 0.
  * - If the value of the first array element is greater than the
  * value of the second array element, then the returned value must
  * be +1.
  *
  * The sorted array elements are stored in increasing order, in
  * accordance with the result of the comparison function.
  *
  * You can sort in reverse order by reversing the greater than and
  * less than logic in the comparison function. If two elements are
  * equal, their order in the sorted array is unspecified.
  *
  * QUICKSORTX overwrites the contents of x with the sorted
  * elements. When the quick-sort is finished, for elements j and k:
  * 
  * - if j < k, thenf( addr(x(j)), addr(x(k)) ) < = 0
  *
  * @param {ANY(*)} x An array expression. x must be a one-dimensional
  *   array. If x is an array of NONVARYING BIT, it must be aligned.
  * @param {ANY<ENTRY>} f Expression. Specifies the function that will be
  *   invoked to perform all the required comparisons.
  * @param {ANY<NUMBER>} [n] An expression that specifies the index of the
  *   first array element to be examined. It defaults to LBOUND(x).
  * @param {ANY<NUMBER>} [m] An expression that specifies the number of
  *   to-be-examined array elements. The counting starts with the
  *   nth and defaults to HBOUND(x) – n + 1.
  */
 QUICKSORTX: PROC (x, f, n, m);
   DCL x ANY(*);
   DCL f ANY<ENTRY>;
   DCL n ANY<NUMBER> OPTIONAL;
   DCL m ANY<NUMBER> OPTIONAL;
 END;

 /**
  * SUM returns the sum of all the elements in \`x\`. The base,
  * mode, and scale of the result match those of \`x\`.
  *
  * @param {ANY(*)} x Array expression. If the elements of \`x\` are
  *   strings, they are converted to fixed-point integer values.
  *
  *   If the elements of \`x\` are fixed-point, the precision of the
  *   result is (\`N,q\`), where N is the maximum number of digits
  *   allowed, and \`q\` is the scaling factor of \`x\`.
  *
  *   If the elements of \`x\` are floating-point, the precision of
  *   the result matches \`x\`.
  * @returns {ANY<NUMBER>} sum of all the elements in \`x\`
  */
 SUM: PROC (x) RETURNS (ANY<NUMBER>);
   DCL x ANY(*);
 END;

 /* Buffer management functions */
  /**
  * COMPARE compares the z bytes of two buffers at the addresses x
  * and y.
  *
  * COMPARE returns a FIXED BINARY(31,0) value. It can be any of the
  * following values:
  *
  * **Zero**: The z bytes at the addresses x and y are identical.
  * **Negative**: The z bytes at x are less than those at y.
  * **Positive**: The z bytes at x are greater than those at y.
  *
  * If the two buffers are different, the COMPARE built-in function
  * does not indicate where that difference is. If you want to know
  * where they differ, use the WHEREDIFF built-in function instead.
  *
  * **Example**
  * 
  * \`\`\`
  *   dcl Result fixed bin;
  *   dcl 1 Str1,
  *         2 B fixed bin(31),
  *         2 C pointer,
  *         2 * union,
  *           3 D char(4),
  *           3 E fixed bin(31),
  *           3 *,
  *             4 * char(3),
  *             4 F fixed bin(8) unsigned,
  *         2 * char(0);
  *   dcl 1 Template nonasgn static,
  *         2 * fixed bin(31) init(16),     // ''X 
  *         2 * pointer init(sysnull()),
  *         2 * char(4) init(''),
  *         2 * char(0);
  * 
  *   call plimove(addr(Str1), addr(Template), stg(Str1));
  *   Result = compare(addr(Str1), addr(Template), stg(Str1));   //  0
  *   D = 'DSA ';
  *   Result = compare(addr(Str1), addr(Template), stg(Str1));   //  1
  *   B = 15;      // '00000F00'X
  *   D = 'DSA ';
  *   Result = compare(addr(Str1), addr(Template), stg(Str1));   // -1
  * \`\`\`
  *
  * @param {ANY(*)} x Expression. Both must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param {ANY(*)} y Expression. Both must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param {ANY} z Expression. It is converted to size_t 1.
  * @returns {FIXED BINARY(31,0)} value that indicates the relationship
  *   of the z bytes at the addresses x and y
  */
 COMPARE: PROC (x, y, z) RETURNS ();
   DCL x ANY(*);
   DCL y ANY(*);
   DCL z ANY;
 END;

  /**
  * HEXENCODE encodes a source buffer into a buffer holding its base
  * 16 value in the character set specified by the ASCII or EBCDIC
  * suboption of the DEFAULT compiler option. It returns a size_t
  * value that indicates the number of bytes that are written into
  * the target buffer.
  *
  * The returned value depends on the address of the target buffer
  * or the size of the target buffer:
  * 
  * - If the address of the target buffer p is zero, the number of
  * bytes that would be written is returned.
  * - If the target buffer is not large enough, a value of -1 is
  * returned.
  * - If the target buffer is large enough, the number of bytes that
  * are written to the buffer is returned.
  *
  * Note: Some arguments or return values are of type size_t. If the
  * LP(32) compiler option is in effect, size_t is FIXED BIN(31); if
  * the LP(64) compiler option is in effect, size_t is FIXED
  * BIN(63).
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes that
  *   are written into the target buffer, or -1 if the target buffer is
  *   not large enough, or the number of bytes that would be written if
  *   the address of the target buffer is zero.
  */
 HEXENCODE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * HEXENCODE8 encodes the source buffer into base 16 that is
  * encoded as UTF-8. It returns a size_t 1 value that indicates the
  * number of bytes that are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes that
  *   are written into the target buffer, or -1 if the target buffer is
  *   not large enough, or the number of bytes that would be written if
  *   the address of the target buffer is zero.
  */
 HEXENCODE8: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * HEXIMAGE returns a character string that is the hexadecimal
  * representation of the storage at a specified location.
  *
  * HEXIMAGE(p,n) returns a character string that is the hexadecimal
  * representation of \`n\` bytes of storage at location \`p\`. Its
  * length is 2 * n.
  *
  * HEXIMAGE(p,n,z) returns a character string that is the
  * hexadecimal representation of \`n\` bytes of storage at location
  * \`p\` with character \`z\` inserted between every set of eight
  * characters in the output string. Its length is (2 * n) + ((n -
  * 1)/4).
  *
  * If the number of bytes to be converted to hex is not known at
  * compile time, then no more than 32767 bytes will be converted.
  *
  * For examples of the HEXIMAGE built-in function, see HEX.
  *
  * @param {ANY<LOCATOR>} p Restricted expression that must have a 
  *   locator type (POINTER or OFFSET). If \`p\` is OFFSET, it must 
  *   have the AREA attribute.
  * @param {ANY<NUMBER>} n Expression. \`n\` must have a computational
  *   type and is converted to FIXED BINARY(31,0).
  * @param {CHARACTER(1) NONVARYING} [z] If specified, \`z\` must have
  *   the type CHARACTER(1) NONVARYING.
  * @returns {CHARACTER(*)} character string that is the hexadecimal
  *   representation of the storage at a specified location.
  */
 HEXIMAGE: PROC (p, n, z) RETURNS (CHARACTER(*));
   DCL p ANY<LOCATOR>;
   DCL n ANY<NUMBER>;
   DCL z CHARACTER(1) NONVARYING OPTIONAL;
 END;

  /**
  * HEXIMAGE8 returns a character string that is the UTF-8
  * hexadecimal representation of the storage at a specified
  * location.
  *
  * HEXIMAGE8(p,n) returns a character string that is the
  * hexadecimal representation of \`n\` bytes of storage at location
  * \`p\`. Its length is 2 * n.
  *
  * HEXIMAGE8(p,n,z) returns a character string that is the
  * hexadecimal representation of \`n\` bytes of storage at location
  * \`p\` with character \`z\` inserted between every set of eight
  * characters in the output string. Its length is (2 * n) + ((n -
  * 1)/4).
  *
  * If the number of bytes to be converted to hex is not known at
  * compile time, then no more than 32767 bytes will be converted.
  *
  * For examples of the HEXIMAGE8 built-in function, see HEX8.
  *
  * @param {ANY<LOCATOR>} p A restricted expression that must have a
  *   locator type (POINTER or OFFSET). If \`p\` is OFFSET, it must have
  *   the AREA attribute.
  * @param {ANY<NUMBER>} n An expression. \`n\` must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  * @param {CHARACTER(1) NONVARYING} [z] An expression. If specified,
  *   \`z\` must have the type CHARACTER(1) NONVARYING and must be a
  *   valid 1-byte UTF-8 character.
  */
 HEXIMAGE8: PROC (p, n, z) RETURNS (CHARACTER(*));
   DCL p ANY<LOCATOR>;
   DCL n ANY<NUMBER>;
   DCL z CHARACTER(1) NONVARYING OPTIONAL;
 END;

 /**
  * MEMCONVERT converts the data in a source buffer from the
  * specified source codepage to a specified target codepage, stores
  * the result in a target buffer, and returns a size_t 1 value that
  * indicates the number of bytes that are written to the target
  * buffer. It will also take an optional parameter t that specifies
  * the technique to use in the conversion.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If either buffer length is zero, the result is zero.
  *
  * The code page must have a computational type and is converted to
  * type FIXED BINARY (31,0). The code page must specify a valid,
  * supported code page.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY} c Target code page.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @param {ANY} d Source code page.
  * @param {ANY} [t] A character string or variable that names the
  *   technique to use in the conversion. t is of length 8 or less.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer.
  */
 MEMCONVERT: PROC (p, n, c, q, m, d, t) RETURNS (ANY<NUMBER>);
   DCL p ANY<LOCATOR>;
   DCL n ANY<NUMBER>;
   DCL c ANY;
   DCL q ANY<LOCATOR>;
   DCL m ANY<NUMBER>;
   DCL d ANY;
   DCL t ANY CHARACTER(8) OPTIONAL;
 END;

 /**
  * MEMCOLLAPSE fills a target buffer with the contents of a source
  * buffer with all multiple occurrences of a specified character
  * replaced by one, while the leading and trailing instances of
  * that character are also trimmed. It returns a size_t value that
  * indicates the number of bytes written to the target buffer.
  *
  * The returned value depends on the address of the target buffer
  * or the size of the target buffer:
  * 
  * - If the address of the target buffer is zero (null), the number
  * of bytes that would be written is returned.
  * - If the target buffer is not large enough, a value of -1 is
  * returned.
  * - If the target buffer is large enough, the number of bytes that
  * are written to the buffer is returned.
  * - The target buffer will include all the characters in the
  * source buffer before the ith character (without any collapsing)
  * and then all characters from the nth position onwards, squeezed
  * and trimmed as appropriate.
  *
  * **Example**
  * 
  * \`\`\`
  * dcl s  char(20);
  * dcl t  char(20);
  * dcl cx fixed bin(31);
  *  
  * s  = '...abc....def...gh..';
  * cx = memcollapse(sysnull(), 0, addr(s), stg(s), '.');
  *        // cx = 10
  * cx = memcollapse(addr(t), stg(t), addr(s), stg(s), '.');
  *        // cx = 10
  *        // t = 'abc.def.gh'
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t. It must be non-negative.
  * @param {CHARACTER(1) NONVARYING} z An expression that must have the type
  *   CHARACTER(1) NONVARYING.
  * @param {ANY<NUMBER>} [i] An optional expression that must be
  *   computational and will be converted to size_t as necessary. If
  *   not specified, the default value for i is 1. If i < 1, default
  *   value of 1 is used.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes that
  *   are written to the target buffer, or -1 if the target buffer is
  *   not large enough, or the number of bytes that would be written if
  *   the address of the target buffer is zero.
  */
 MEMCOLLAPSE: PROC (p, m, q, n, z, i) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL z CHARACTER(1) NONVARYING;
    DCL i ANY<NUMBER> OPTIONAL;
 END;

 /**
  * MEMCU12 converts the data in a source buffer from UTF-8 to
  * UTF-16, stores the result in a target buffer, and returns a
  * size_t 1 value that indicates the number of bytes that are
  * written to the target buffer.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If the target buffer is too small or if the source UTF-8 is
  * invalid, a value of -1 is returned.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer, or -1 if the target buffer
  *   is not large enough or if the source UTF-8 is invalid.
  */
 MEMCU12: PROC (p, n, q, m) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
 END;

 /**
  * MEMCU14 converts the data in a source buffer from UTF-8 to
  * UTF-32, stores the result in a target buffer, and returns a
  * size_t 1 value that indicates the number of bytes that are
  * written to the target buffer.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If the target buffer is too small or if the source UTF-8 is
  * invalid, a value of -1 is returned.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @return {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer, or -1 if the target buffer
  *   is not large enough or if the source UTF-8 is invalid.
  */
 MEMCU14: PROC (p, n, q, m) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
 END;

 /**
  * MEMCU21 converts the data in a source buffer from UTF-16 to
  * UTF-8, stores the result in a target buffer, and returns a
  * size_t 1 value that indicates the number of bytes that are
  * written to the target buffer.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If the target buffer is too small, a value of -1 is returned.
  * The source must contain valid UTF-16, and the behavior of this
  * function when it does not is unspecified.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer, or -1 if the target buffer
  *   is not large enough or if the source UTF-16 is invalid.
  */
 MEMCU21: PROC (p, n, q, m) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
 END;

 /**
  * MEMCU24 converts the data in a source buffer from UTF-16 to
  * UTF-32, stores the result in a target buffer, and returns a
  * size_t 1 value that indicates the number of bytes that are
  * written to the target buffer.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If the target buffer is too small, a value of -1 is returned.
  * The source must contain valid UTF-16, and the behavior of this
  * function when it does not is unspecified.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer, or -1 if the target buffer
  *   is not large enough or if the source UTF-16 is invalid.
  */
 MEMCU24: PROC (p, n, q, m) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
 END;

 /**
  * MEMCU41 converts the data in a source buffer from UTF-32 to
  * UTF-8, stores the result in a target buffer, and returns a
  * size_t 1 value that indicates the number of bytes that are
  * written to the target buffer.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If the target buffer is too small or if the source UTF-32 is
  * invalid, a value of -1 is returned.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer, or -1 if the target buffer
  *   is not large enough or if the source UTF-32 is invalid.
  */
 MEMCU41: PROC (p, n, q, m) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
 END;

 /**
  * MEMCU42 converts the data in a source buffer from UTF-32 to
  * UTF-16, stores the result in a target buffer, and returns a
  * size_t 1 value that indicates the number of bytes that are
  * written to the target buffer.
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * If the target buffer is too small or if the source UTF-32 is
  * invalid, a value of -1 is returned.
  *
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @param {ANY<LOCATOR>} q Address of the source buffer.
  * @param {ANY<NUMBER>} m Length of the source buffer.
  * @returns {ANY<NUMBER>} value that indicates the number of bytes
  *   that are written to the target buffer, or -1 if the target buffer
  *   is not large enough or if the source UTF-32 is invalid.
  */
 MEMCU42: PROC (p, n, q, m) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
 END;

  /**
  * MEMINDEX returns a size_t 1 value that indicates the starting
  * position within a buffer of a specified substring.
  *
  * With three arguments, the function's syntax is as follows:
  *
  * With four arguments, the function's syntax is as follows:
  *
  * The buffer lengths must be nonnegative and must have a
  * computational type. The buffer lengths are converted to type
  * size_t.
  *
  * With three arguments, the target string-expression must have
  * type CHARACTER (including PICTURE), GRAPHIC, UCHAR, or WIDECHAR.
  * The buffer length is interpreted as the number of units of that
  * string type.
  *
  * With four arguments, the buffer lengths specify a number of
  * bytes and the search performed is a character search.
  *
  * For a VARYING, VARYING4, or VARYINGZ string \`X\` and string
  * \`Y\`, the function MEMINDEX(ADDRDATA(X), LENGTH(X), Y) will
  * return the same value as INDEX(X, Y).
  *
  * **Example**
  * 
  * \`\`\`
  *   dcl cb(128*1024) char(1);
  *   dcl wb(128*1024) widechar(1);
  *   dcl pos fixed bin(31);
  *   // 128K bytes searched for the character string 'test'
  *   pos = memindex( addr(cb), stg(cb), 'test' );
  *   // 256K bytes searched for the string 'test' as widechar
  *   pos = memindex( addr(wb), stg(wb), wchar('test') );
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Address of buffer to be searched.
  * @param {ANY<NUMBER>} n Length of buffer to be searched.
  * @param {ANY<STRING>} x String-expression to use as the target of the
  *   search.
  * @param {ANY<LOCATOR>} p Address of first buffer to be searched.
  * @param {ANY<NUMBER>} n Length of first buffer to be searched.
  * @param {ANY<LOCATOR>} q Address of second buffer to use as the
  *   target of the search.
  * @param {ANY<NUMBER>} m Length of second buffer to use as the target
  *   of the search.
  * @returns {ANY<NUMBER>} value that indicates the starting position
  *   within the buffer of a specified substring, or zero if the
  *   substring is not found.
  */
 //TODO has overloads
 MEMINDEX: PROC () RETURNS ();
 END;

 /**
  * MEMREPLACE fills a target buffer with the contents of a source
  * buffer with one or more occurrences of a specified third buffer
  * replaced by a fourth buffer, and returns a size_t value that
  * indicates the number of bytes that are written to the target
  * buffer.
  *
  * The returned value depends on the address of the target buffer
  * or the size of the target buffer:
  *
  * - If the address of the target buffer is zero (null), the number
  * of bytes that would be written is returned.
  * - If the target buffer is not large enough, a value of -1 is
  * returned.
  * - If the target buffer is large enough, the number of bytes that
  * are written to the buffer is returned.
  *
  * \`\`\`
  * dcl ein char(50) var value('reserved from #date# till #date#.');
  * dcl aus char(80) var;
  * dcl cx fixed bin(31);
  *
  * dcl f   char(6);
  * dcl t   char(10);
  *
  * f = '#date#';
  * t = '2018/05/01';
  *
  * cx = memreplace( addrdata(aus), maxlength(aus),
  *                  addrdata(ein), length(ein),
  *                  addrdata(f), length(f),
  *                  addrdata(t), length(t));
  *      // cx = 37
  *      // aus = 'reserved from 2018/05/01 till #date#.'
  * cx = memreplace( addrdata(aus), maxlength(aus),
  *                  addrdata(ein), length(ein),
  *                  addrdata(f), length(f),
  *                  addrdata(t), length(t),16,1);
  *      // cx = 37
  *      // aus = 'reserved from #date# till 2018/05/01.'
  * cx = memreplace( addrdata(aus), maxlength(aus),
  *                  addrdata(ein), length(ein),
  *                  addrdata(f), length(f),
  *                  addrdata(t), length(t),,0);
  *      // cx = 41
  *      // aus = 'reserved from 2018/05/01 till 2018/05/01.'
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target
  *   buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param {ANY<LOCATOR>} q Specifies the address of the source
  *   buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param {ANY<LOCATOR>} f Specifies the address of the buffer
  *   containing the bytes that will be replaced.
  * @param {ANY<NUMBER>} x Specifies the length in bytes of the
  *   buffer f. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param {ANY<LOCATOR>} t Specifies the address of the buffer
  *   containing the bytes that will be used to replace the bytes of
  *   the buffer f within the buffer p.
  * @param {ANY<NUMBER>} y Specifies the length in bytes of the
  *   buffer t. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param {ANY<NUMBER>} [s] An optional expression that specifies the
  *   location within the source buffer from where to start
  *   searching for the buffer defined by f and x. It must have a
  *   computational type and is converted to the size_t type. The
  *   default value for s is 1. If s is less than 1 or if s is
  *   greater than 1 + n, zero bytes will be written to the target
  *   buffer.
  * @param {ANY<NUMBER>} [i] An optional expression that specifies the
  *   maximum number of times f should be replaced by t. It must
  *   have a computational type and is converted to the size_t type.
  *   The default value of i is 1. i must be non-negative. If the
  *   value of i is 0, all occurrences of f in source buffer will be
  *   replaced by t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written to the target buffer.
  */
 MEMREPLACE: PROC (p, m, q, n, f, x, t, y, s, i) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL f ANY<LOCATOR>;
    DCL x ANY<NUMBER>;
    DCL t ANY<LOCATOR>;
    DCL y ANY<NUMBER>;
    DCL s ANY<NUMBER> OPTIONAL;
    DCL i ANY<NUMBER> OPTIONAL;
 END;

 /**
  * MEMSEARCH returns a size_t 1 value that specifies the first
  * position (from the left) in a buffer at which any character,
  * graphic, uchar, or widechar in a given string appears.
  *
  * The buffer length must be nonnegative and must have a
  * computational type. The buffer length is converted to type
  * size_t.
  *
  * The string-expression \`x\` must have type CHARACTER (including
  * PICTURE), GRAPHIC, UCHAR, or WIDECHAR. The buffer length is
  * interpreted as the number of units of that string type.
  *
  * The address \`p\` and the length \`n\` specify the "string" in
  * which to search for any character, graphic, uchar, or widechar
  * that appears in \`x\`.
  *
  * If either the buffer length \`n\` is zero or \`x\` is the null
  * string, the result is zero.
  *
  * If \`x\` does not occur in the buffer, the result is zero.
  *
  * \`\`\`
  *   dcl cb(128*1024) char(1);
  *   dcl wb(128*1024) widechar(1);
  *   dcl pos fixed bin(31);
  *
  *   // 128K bytes searched from the left for a numeric
  *   pos = memsearch( addr(cb), stg(cb), '012345789' );
  *
  *   // 256K bytes searched from the left for a widechar '0' or '1'
  *   pos = memsearch( addr(wb), stg(wb), '0030_0031'wx );
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Address of buffer to be searched
  * @param {ANY<NUMBER>} n Length of buffer to be searched
  * @param {ANY<CHARACTER>} x String-expression
  * @returns {ANY<NUMBER>} A size_t value specifying the first
  *   position in the buffer at which any element of x appears,
  *   or zero if not found.
  */
 MEMSEARCH: PROC (p, n, x) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL x ANY<CHARACTER>;
 END;

 /**
  * MEMSEARCHR returns a size_t 1 value that specifies the first
  * position (from the right) in a buffer at which any character,
  * graphic, uchar, or widechar in a given string appears.
  *
  * The buffer length must be nonnegative and must have a
  * computational type. The buffer length is converted to type
  * size_t.
  *
  * The string-expression \`x\` must have type CHARACTER (including
  * PICTURE), GRAPHIC, UCHAR, or WIDECHAR. The buffer length is
  * interpreted as the number of units of that string type.
  *
  * The address \`p\` and the length \`n\` specify the "string" in
  * which to search for any character, graphic, uchar, or widechar
  * that appears in \`x\`.
  *
  * If either the buffer length \`n\` is zero or \`x\` is the null
  * string, the result is zero.
  *
  * If \`x\` does not occur in the buffer, the result is zero.
  *
  * \`\`\`
  *   dcl cb(128*1024) char(1);
  *   dcl wb(128*1024) widechar(1);
  *   dcl pos fixed bin(31);
  *
  *   // 128K bytes searched from the right for a numeric
  *   pos = memsearchr( addr(cb), stg(cb), '012345789' );
  *
  *   // 256K bytes searched from the right for a widechar '0' or '1'
  *   pos = memsearchr( addr(wb), stg(wb), '0030_0031'wx );
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Address of buffer to be searched
  * @param {ANY<NUMBER>} n Length of buffer to be searched
  * @param {ANY<CHARACTER>} x String-expression
  * @returns {ANY<NUMBER>} A size_t value specifying the first
  *   position (from the right) in the buffer at which any element
  *   of x appears, or zero if not found.
  */
 MEMSEARCHR: PROC (p, n, x) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL x ANY<CHARACTER>;
 END;

 /**
  * MEMSQUEEZE fills a target buffer with the contents of a source
  * buffer with all multiple occurrences of a specified character
  * replaced by one. It returns a size_t value that indicates the
  * number of bytes written to the target buffer.
  *
  * The returned value depends on the address of the target buffer
  * or the size of the target buffer:
  *
  * - If the address of the target buffer is zero (null), the number
  * of bytes that would be written is returned.
  * - If the target buffer is not large enough, a value of -1 is
  * returned.
  * - If the target buffer is large enough, the number of bytes that
  * are written to the buffer is returned.
  * - The target buffer will include all the characters in the
  * source buffer before the ith character (without any collapsing)
  * and then all characters from the nth position onwards, squeezed
  * and trimmed as appropriate.
  *
  * \`\`\`
  * dcl s  char(20);
  * dcl t  char(20);
  * dcl cx fixed bin(31);
  *
  * s  = '...abc....def...gh..';
  * cx = memsqueeze(sysnull(), 0, addr(s), stg(s), '.');
  *       // cx = 12
  * cx = memsqueeze(addr(t), stg(t), addr(s), stg(s), '.');
  *       // cx = 12
  *       // t = '.abc.def.gh.'
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t. It must be non-negative.
  * @param {CHARACTER} z An expression that must have the type
  *   CHARACTER(1) NONVARYING.
  * @param {ANY<NUMBER>} [i] An optional expression that must be
  *   computational and will be converted to size_t as necessary. If
  *   not specified, the default value for i is 1. If i < 1, default
  *   value of 1 is used.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes written to the target buffer.
  */
 MEMSQUEEZE: PROC (p, m, q, n, z, i) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL z CHARACTER;
    DCL i ANY<NUMBER> OPTIONAL;
 END;

 /**
  * MEMVERIFY returns a size_t 1 value that specifies the position
  * in a buffer of the first (from the left) character, graphic,
  * uchar, or widechar that is \`not\` in a specified string.
  *
  * The buffer length must be nonnegative and must have a
  * computational type. The buffer length is converted to type
  * size_t.
  *
  * The string-expression \`x\` must have type CHARACTER (including
  * PICTURE), GRAPHIC, UCHAR, or WIDECHAR. The buffer length is
  * interpreted as the number of units of that string type.
  *
  * The address \`p\` and the length \`n\` specify the "string" in
  * which to search for any character, graphic, uchar, or widechar
  * that does not appear in \`x\`.
  *
  * If either the buffer length \`n\` is zero or \`x\` is the null
  * string, the result is zero.
  *
  * If all the characters, graphics, uchars, or widechars in the
  * buffer do appear in \`x\`, the result is zero.
  *
  * \`\`\`
  *    dcl cb(128*1024) char(1);
  *   dcl wb(128*1024) widechar(1);
  *   dcl pos fixed bin(31);
  *
  *   // 128K bytes searched from the left for a non-numeric
  *   pos = memverify( addr(cb), stg(cb), '012345789' );
  *
  *   // 256K bytes searched from the left for a non-blank widechar
  *   pos = memverify( addr(wb), stg(wb), '0020'wx );
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Address of buffer to be searched.
  * @param {ANY<NUMBER>} n Length of buffer to be searched.
  * @param {ANY<CHARACTER>} x String-expression.
  * @returns {ANY<NUMBER>} A size_t value specifying the position of
  *   the first non-matching element (from the left), or zero if all
  *   match.
  */
 MEMVERIFY: PROC (p, n, x) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL x ANY<CHARACTER>;
 END;

 /**
  * MEMVERIFYR returns a size_t 1 value that specifies the position
  * in a buffer of the first (from the right) character, graphic,
  * uchar, or widechar that is \`not\` in a specified string.
  *
  * The buffer length must be nonnegative and must have a
  * computational type. The buffer length is converted to type
  * size_t.
  *
  * The string-expression \`x\` must have type CHARACTER (including
  * PICTURE), GRAPHIC, UCHAR, or WIDECHAR. The buffer length is
  * interpreted as the number of units of that string type.
  *
  * The address \`p\` and the length \`n\` specify the "string" in
  * which to search for any character, graphic, uchar, or widechar
  * that does not appear in \`x\`.
  *
  * If either the buffer length \`n\` is zero or \`x\` is the null
  * string, the result is zero.
  *
  * If all the characters, graphics, uchars, or widechars in the
  * buffer do appear in \`x\`, the result is zero.
  *
  * \`\`\`
  *  dcl cb(128*1024) char(1);
  *   dcl wb(128*1024) widechar(1);
  *   dcl pos fixed bin(31);
  *
  *   // 128K bytes searched from the right for a non-numeric
  *   pos = memverify( addr(cb), stg(cb), '012345789' );
  *
  *   // 256K bytes searched from the right for a non-blank widechar
  *   pos = memverify( addr(wb), stg(wb), '0020'wx );
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} p Address of buffer to be searched.
  * @param {ANY<NUMBER>} n Length of buffer to be searched.
  * @param {ANY<CHARACTER>} x String-expression.
  * @returns {ANY<NUMBER>} A size_t value specifying the position of
  *   the first non-matching element (from the right), or zero if
  *   all match.
  */
 MEMVERIFYR: PROC (p, n, x) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
    DCL x ANY<CHARACTER>;
 END;

 /**
  * WHEREDIFF returns a size_t value that specifies the index of the
  * first byte that differs in two buffers or zero if all the bytes
  * are the same.
  *
  * If the two buffers are different, the WHEREDIFF built-in
  * function does not indicate if the first byte that differs is
  * greater or less than the corresponding byte in the second
  * buffer. If you want to know how the buffers differ, use the
  * COMPARE built-in function instead.
  *
  * @param {ANY<LOCATOR>} x Expression. It must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param {ANY<LOCATOR>} y Expression. It must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param {ANY<NUMBER>} z Expression. It is converted to size_t.
  * @returns {ANY<NUMBER>} A size_t value specifying the index of the
  *   first differing byte, or zero if all bytes are the same.
  */
 WHEREDIFF: PROC (x, y, z) RETURNS (ANY<NUMBER>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;

 /**
  * WSCOLLAPSE returns a size_t 1 value that indicates the number of
  * bytes that are written into the target buffer when it collapses
  * all the whitespace in the CHARACTER source buffer.
  *
  * WSCOLLAPSE collapses the whitespace by one of the following
  * means:
  *
  * - Replacing each character from \t\f\v\n\r with a blank.
  * - Trimming all leading and trailing blanks.
  * - Reducing multiple interior blanks to one blank.
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 WSCOLLAPSE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * WSCOLLAPSE16 collapses all the whitespace in a source buffer
  * encoded as UTF-16. It returns a size_t 1 value that indicates
  * the number of bytes that are written into the target buffer.
  * WHITESPACECOLLAPSE is a deprecated synonym for WSCOLLAPSE16.
  *
  * WSCOLLAPSE16 collapses the whitespace by one of the following
  * means:
  *
  * - Replacing each character from \t\f\v\n\r with a UTF-16 blank.
  * - Trimming all leading and trailing blanks.
  * - Reducing multiple interior blanks to one blank.
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * The source buffer must hold UTF-16 data.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 WSCOLLAPSE16: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * WSREPLACE replaces each character from \t, \f, \v, \n in a
  * source buffer encoded as CHARACTER by a blank. This function
  * returns a size_t 1 value that indicates the number of bytes that
  * are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 WSREPLACE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * WSREPLACE16 replaces all characters from \t, \f, \v, \n in a
  * source buffer encoded as UTF-16 by a blank. This function
  * returns a size_t 1 value that indicates the number of bytes that
  * are written into the target buffer. WHITESPACEREPLACE is a
  * deprecated synonym for WSREPLACE16.
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * The source buffer must hold UTF-16 data.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 WSREPLACE16: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * XMLCHAR dumps data from a structure as XML into a buffer. It
  * returns a size_t 1 value that indicates the number of bytes
  * written to the buffer. If the buffer is too small, the structure
  * data is truncated and the number of bytes needed for the buffer
  * to contain the structure is returned.
  *
  * When the XML output is created, it follows these rules:
  *
  * - When a variable has the XMLCONTENT attribute, the variable is
  * presented as tagless text
  * - When no variable has the XMLATTR attribute, each name in the
  * structure is written out, first enclosed in "<" and ">" and
  * later enclosed in "</" and ">".
  * - When a variable has the XMLATTR attribute, the field is
  * presented as an attribute of its containing structure.
  * - When a variable has the XMLOMIT attribute, the field is
  * omitted if it has a null value.
  * - Numeric and bit data is converted to character.
  * - Leading and trailing blanks are trimmed wherever possible.
  *
  * Note: By default the names of the variables in the generated XML
  * output are all in upper case. The CASE(ASIS) suboption of the
  * XML compiler option can be used to specify that the names appear
  * in the case in which they were declared.
  *
  * **Example of using XMLCHAR**
  *
  * This example is based on the following code fragment:
  *
  * \`\`\`
  *     dcl buffer   char(800);
  *     dcl written  fixed bin(31);
  *     dcl next     pointer;
  *     dcl left     fixed bin(31);
  *     dcl
  *       1 a,
  *        2 a1,
  *          3 b1 char(8),
  *          3 b2 char(8),
  *        2 a2,
  *          3 c1 fixed bin,
  *          3 c2 fixed dec(5,1);
  *
  *     b1 = ' t1';
  *     b2 = 't2';
  *     c1 = 17;
  *     c2 = -29;
  *     next = addr(buffer);
  *     left = stg(buffer);
  *     written = xmlchar( a, next, left );
  *     next += written;
  *     left -= written;
  * \`\`\`
  *
  * The following bytes would be written to the buffer, and written
  * would be set equal to 72.
  *
  * \`\`\`
  * <A><A1><B1>t1</B1><B2>t2</B2></A1><A2><C1>17</C1><C2>-29.0</C2>
  * </A2></A>
  * \`\`\`
  *
  * @param {ANY<STRUCTURE>} x Reference to a structure or DEFINE
  *   STRUCTURE type.
  *
  *   The reference \`x\` must conform to the following rules:
  *
  *   - It must contain only computational data, that is, only
  *   string and numeric data. However, it must not contain any
  *   GRAPHIC, UCHAR, WIDECHAR, or WIDEPIC elements.
  *   - It may contain arrays, but if it is an array itself, it must
  *   be completely subscripted.
  *   - It may contain substructures, but any contained substructure
  *   must not use an asterisk (*) in place of a name. However, an
  *   asterisk may be used as the name of a base element, but in
  *   that case, the unnamed element will not be written to the
  *   target buffer.
  *   - If \`x\` is a reference to a structure, it must not contain
  *   any DEFINE STRUCTURE types.
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written, or the needed size if the buffer is too small.
  */
 XMLCHAR: PROC (x, p, n) RETURNS (ANY<NUMBER>);
    DCL x ANY<STRUCTURE>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * XMLSCRUB scrubs the CHARACTER source buffer. It returns a
  * size_t1 value that indicates the number of bytes that are
  * written into the target buffer.
  *
  * XMLSCRUB cleans the CHARACTER source buffer by:
  *
  * - Replacing each character less than a blank except for \t, \n,
  * \r with a blank.
  * - Replacing carriage returns with .
  * - Replacing the following characters with corresponding strings
  * as follows: | Characters | Strings |
  * | --- | --- |
  * | " | " |
  * | ' | ' |
  * | & | &amp; |
  * | < | < |
  * | > | > |
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 XMLSCRUB: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * XMLSCRUB16 scrubs the UTF-16 source buffer. It returns a size_t
  * 1 value that indicates the number of bytes that are written into
  * the target buffer. XMLCLEAN is a deprecated synonym for
  * XMLSCRUB16.
  *
  * XMLSCRUB16 cleans the UTF-16 source buffer by:
  *
  * - Replacing each invalid UTF-16 with a UTF-16 blank.
  * - Replacing carriage returns with .
  * - Replacing the following characters with corresponding strings
  * as follows: | Characters | Strings |
  * | --- | --- |
  * | " | " |
  * | ' | ' |
  * | & | &amp; |
  * | < | < |
  * | > | > |
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * The source buffer must hold UTF-16 data.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 XMLSCRUB16: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * XMLUCHAR dumps data from a structure as XML into a buffer as
  * UTF-8. It returns a size_t 1 value that indicates the number of
  * bytes written to the buffer. If the buffer is too small, the
  * structure data is truncated and the number of bytes needed for
  * the buffer to contain the structure is returned.
  *
  * When the XML output is created, XMLUCHAR follows the same rules
  * as XMLCHAR.
  *
  * @param {ANY<STRUCTURE>} x Reference to a structure or DEFINE
  *   STRUCTURE type.
  *
  *   The reference \`x\` must conform to the same rules as XMLCHAR
  *   except that it can contain UCHAR elements.
  * @param {ANY<LOCATOR>} p Address of the target buffer.
  * @param {ANY<NUMBER>} n Length of the target buffer.
  * @returns {ANY<NUMBER>} A size_t value indicating the number of
  *   bytes written, or the needed size if the buffer is too small.
  */
 XMLUCHAR: PROC (x, p, n) RETURNS (ANY<NUMBER>);
    DCL x ANY<STRUCTURE>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /* Condition handling builtins */
 /**
  * DATAFIELD is in context in a NAME condition ON-unit (or any of
  * its dynamic descendants). It returns a character string whose
  * value is the contents of the field that raised the condition. It
  * is also in context in an ON-unit (or any of its dynamic
  * descendants) for an ERROR or FINISH condition raised as part of
  * the implicit action for the NAME condition.
  *
  * If the string that raised the condition contains DBCS
  * identifiers, GRAPHIC data, or mixed character data, DATAFIELD
  * returns a mixed character string.
  *
  * If DATAFIELD is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} Contents of the field that raised the
  *   NAME condition, or a null string if out of context.
  */
 DATAFIELD: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONACTUAL returns a nonvarying character string whose value is
  * the "actual" value of an ASSERT COMPARE statement that raised
  * the ASSERTION condition. If the expression has GRAPHIC or
  * WIDECHAR type, a null string is returned.
  *
  * It is in context in an ON-unit for the ASSERTION condition, or
  * for the ERROR or FINISH condition raised as the implicit action
  * for an ASSERTION condition.
  *
  * If it is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The "actual" value from the ASSERT
  *   COMPARE statement, or a null string if out of context.
  */
 ONACTUAL: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONAREA returns a character string whose value is the name of the
  * AREA reference for which an AREA condition is raised. If the
  * reference includes DBCS names, the string returned is a mixed
  * character string. It is in context in an ON-unit (or any of its
  * dynamic descendants) for the AREA condition, or for the ERROR or
  * FINISH condition raised as the implicit action for an AREA
  * condition.
  *
  * If the ONAREA built-in function is used out of context, a null
  * string is returned.
  *
  * If the AREA reference is excessively long or complicated, a null
  * string is returned.
  * @returns {ANY<CHARACTER>} Name of the AREA reference, or a null
  *   string if out of context.
  */
 ONAREA: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONCHAR returns a character(1) string containing the character
  * that caused the CONVERSION condition to be raised. It is in
  * context in an ON-unit (or any of its dynamic descendants) for
  * the CONVERSION condition or for the ERROR or FINISH condition
  * raised as the implicit action for the CONVERSION condition.
  *
  * If the ONCHAR built-in function is used out of context, a blank
  * is returned.
  * @returns {CHARACTER} The character that caused the CONVERSION
  *   condition, or a blank if out of context.
  */
 ONCHAR: PROC () RETURNS (CHARACTER);
 END;
 /**
  * ONEXPECTED returns a nonvarying character string whose value is
  * the "expected" value of an ASSERT COMPARE statement that raised
  * the ASSERTION condition. If the expression has GRAPHIC or
  * WIDECHAR type, a null string is returned.
  *
  * It is in context in an ON-unit for the ASSERTION condition, or
  * for the ERROR or FINISH condition raised as the implicit action
  * for an ASSERTION condition.
  *
  * If it is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The "expected" value from the ASSERT
  *   COMPARE statement, or a null string if out of context.
  */
 ONEXPECTED: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * The ONCODE built-in function provides a fixed-point binary value
  * that depends on the cause of the last condition.
  *
  * ONCODE can be used to distinguish between the various
  * circumstances that raise a particular condition—for instance,
  * the ERROR condition. For codes corresponding to the conditions
  * and errors detected, refer to the specific condition.
  *
  * ONCODE returns a real fixed-point binary value that is the
  * condition code. It is in context in any ON-unit or its dynamic
  * descendant. All condition codes are defined in Messages and
  * Codes.
  *
  * If ONCODE is used out of context, zero is returned.
  * @returns {FIXED BINARY} The condition code, or zero if out of
  *   context.
  */
 ONCODE: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONCONDCOND returns a nonvarying character string whose value is
  * the name of the condition for which a CONDITION condition is
  * raised.
  *
  * If the name is a DBCS name, it will be returned as a mixed
  * character string. It is in context in the following
  * circumstances:
  *
  * - In a CONDITION ON-unit, or any of its dynamic descendants
  * - In an ANYCONDITION ON-unit that traps a CONDITION condition,
  * or any dynamic descendants of such an ON-unit.
  *
  * If ONCONDCOND is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} Name of the raised CONDITION condition,
  *   or a null string if out of context.
  */
 ONCONDCOND: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONCONDID (short for ON-condition identifier) returns a FIXED
  * BINARY(31,0) value that identifies the condition being handled
  * by an ON-unit. It is in context in any ON-unit or one of its
  * dynamic descendants.
  *
  * The values returned by ONCONDID are given in the following
  * DECLARE statement:
  *
  * \`\`\`
  *   declare (   condid_area               value(1),
  *               condid_attention          value(2),
  *               condid_condition          value(3),
  *               condid_conversion         value(4),
  *               condid_endfile            value(5),
  *               condid_endpage            value(6),
  *               condid_error              value(7),
  *               condid_finish             value(8),
  *               condid_fixedoverflow      value(9),
  *               condid_invalidop          value(10),
  *               condid_key                value(11),
  *               condid_name               value(12),
  *               condid_overflow           value(13),
  *               condid_record             value(14),
  *               condid_size               value(15),
  *               condid_storage            value(16),
  *               condid_stringrange        value(17),
  *               condid_stringsize         value(18),
  *               condid_subscriptrange     value(19),
  *               condid_transmit           value(20),
  *               condid_undefinedfile      value(21),
  *               condid_underflow          value(22),
  *               condid_zerodivide         value(23),
  *               condid_assertion          value(24),
  *           ) fixed bin(31);
  * \`\`\`
  *
  * If ONCONDID is used out of context, a value of zero is returned.
  * @returns {FIXED BINARY} Identifier of the condition being
  *   handled, or zero if out of context.
  */
 ONCONDID: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONCOUNT returns an unscaled REAL FIXED BINARY value specifying
  * the number of conditions that remain to be handled when an
  * ON-unit is entered.
  *
  * It is in context in any ON-unit, or any dynamic descendant of an
  * ON-unit. (See Multiple conditions.)
  *
  * If ONCOUNT is used out of context, zero is returned.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  * @returns {FIXED BINARY} Number of remaining conditions to handle,
  *   or zero if out of context.
  */
 ONCOUNT: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONFILE returns a character string whose value is the name of the
  * file for which an input or output condition is raised.
  *
  * If the name is a DBCS name, it is returned as a mixed character
  * string. It is in context in an ON-unit (or any of its dynamic
  * descendants) for an input or output condition, or for the ERROR
  * or FINISH condition raised as the implicit action for an input
  * or output condition.
  *
  * If ONFILE is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} Name of the file that raised the I/O
  *   condition, or a null string if out of context.
  */
 ONFILE: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONGSOURCE returns a graphic string containing the DBCS character
  * that caused the CONVERSION condition to be raised.
  *
  * It is in context in an ON-unit (or any of its dynamic
  * descendants) for the CONVERSION condition or for the ERROR or
  * FINISH condition raised as the implicit action for a CONVERSION
  * condition.
  *
  * If the ONGSOURCE built-in function is used out of context, a
  * null GRAPHIC string is returned.
  * @returns {ANY<CHARACTER>} The DBCS character that caused the
  *   CONVERSION condition, or a null GRAPHIC string if out of
  *   context.
  */
 ONGSOURCE: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONHBOUND returns a REAL FIXED BIN(63) value that specifies the
  * upper bound of an array for which SUBSCRIPTRANGE has been
  * raised.
  *
  * If ONHBOUND is used out of context, zero is returned.
  *
  * If the following code is run, then ONHBOUND would return 4.
  *
  * \`\`\`
  *           dcl a(3,2:4) fixed bin(31) init( (*) 0 );
  *           dcl jx       fixed bin(31);
  *           dcl value    fixed bin(31);
  *
  *           jx = 5;
  *           (subrg): value = a(1,jx);
  * \`\`\`
  * @returns {FIXED BINARY} The upper bound of the array that raised
  *   SUBSCRIPTRANGE, or zero if out of context.
  */
 ONHBOUND: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONJSONNAME returns a nonvarying character string containing the
  * name for which no match was found in a JSONGETMEMBER or
  * JSONGETVALUE call.
  *
  * It is in context in an ON-unit for the CONFORMANCE condition
  * raised when a mismatched name is found in a JSONGETMEMBER or
  * JSONGETVALUE call, or for the ERROR or FINISH condition raised
  * as the implicit action for such a CONFORMANCE condition.
  *
  * If it is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The unmatched name from the JSON call,
  *   or a null string if out of context.
  */
 ONJSONNAME: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONKEY returns a character string whose value is the key of the
  * record that raised an input/output condition.
  *
  * For indexed files, if the key is GRAPHIC, the string is returned
  * as a mixed character string. ONKEY is in context for the
  * following:
  *
  * - An ON-unit, or any of its dynamic descendants
  * - Any input/output condition, except ENDFILE
  * - The ERROR or FINISH condition raised as implicit action for an
  * input/output condition.
  *
  * ONKEY is always set for operations on a KEYED file, even if the
  * statement that raised the condition does not specified the KEY,
  * KEYTO, or KEYFROM options.
  *
  * The result of specifying ONKEY is:
  *
  * - For any input/output condition (other than ENDFILE), or for
  * the ERROR or FINISH condition raised as implicit action for
  * these conditions, the result is the value of the recorded key
  * from the I/O statement causing the error.
  * - For relative data sets, the result is a character string
  * representation of the relative record number. If the key was
  * incorrectly specified, the result is the last 8 characters of
  * the source key. If the source key is less than 8 characters, it
  * is padded on the right with blanks to make it 8 characters. If
  * the key was correctly specified, the character string consists
  * of the relative record number in character form padded on the
  * left with blanks, if necessary.
  * - For a REWRITE statement that attempts to write an updated
  * record on to an indexed data set when the key of the updated
  * record differs from that of the input record, the result is the
  * value of the embedded key of the input record.
  *
  * If ONKEY is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The key of the record that raised the
  *   I/O condition, or a null string if out of context.
  */
 ONKEY: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONLBOUND returns a REAL FIXED BIN(63) value that specifies the
  * lower bound of an array for which SUBSCRIPTRANGE has been
  * raised.
  *
  * If ONLBOUND is used out of context, zero is returned.
  *
  * If the following code is run, then ONLBOUND would return 2.
  *
  * \`\`\`
  *           dcl a(3,2:4) fixed bin(31) init( (*) 0 );
  *           dcl jx       fixed bin(31);
  *           dcl value    fixed bin(31);
  *
  *           jx = 5;
  *           (subrg): value = a(1,jx);
  * \`\`\`
  * @returns {FIXED BINARY} The lower bound of the array that raised
  *   SUBSCRIPTRANGE, or zero if out of context.
  */
 ONLBOUND: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONLINE returns a FIXED BIN(31) value which is the line number in
  * the source in which a condition was raised.
  *
  * The source program must have been compiled with the GONUMBER
  * option, and on Windows it must also have been linked with the
  * /debug option.
  *
  * If ONLINE is used out of context, a value of zero is returned.
  * @returns {FIXED BINARY} The line number where the condition was
  *   raised, or zero if out of context.
  */
 ONLINE: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONLOC is a synonym for ONPROC.
  *
  * If ONLOC is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The name of the procedure in which the
  *   condition was raised, or a null string if out of context.
  */
 ONLOC: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONOFFSET returns a FIXED BIN(31) value which is the offset from
  * the start of the user procedure (or BEGIN block) in which a
  * condition was raised.
  *
  * If ONOFFSET is used out of context, a value of zero is returned.
  * @returns {FIXED BINARY} The offset from the start of the
  *   procedure where the condition was raised, or zero if out of
  *   context.
  */
 ONOFFSET: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONOPERATOR returns a CHAR(2) string whose value is the operator
  * in an ASSERT COMPARE statement that raised an ASSERTION
  * condition.
  *
  * The ONOPERATOR built-in function is in context in an ON-unit for
  * the ASSERTION condition when raised by an ASSERT COMPARE
  * statement, or for the ERROR or FINISH condition raised as the
  * implicit action for an ASSERTION condition.
  *
  * If an ASSERT COMPARE statement raises the ASSERTION condition,
  * but does not explicitly specify an operator in its COMPARE
  * clause, then the ONOPERATOR built-in function will return the
  * implicit operator value 'EQ'.
  *
  * If the ONOPERATOR built-in function is used out of context, a
  * null string is returned.
  * @returns {CHARACTER} The operator from the ASSERT COMPARE
  *   statement, or a null string if out of context.
  */
 ONOPERATOR: PROC () RETURNS (CHARACTER);
 END;
 /**
  * ONPACKAGE returns a nonvarying character string containing the
  * name of the package where the ASSERT statement that raised the
  * ASSERTION condition is invoked.
  *
  * It is in context in an ON-unit for the ASSERTION condition, or
  * for the ERROR or FINISH condition raised as the implicit action
  * for an ASSERTION condition.
  *
  * If it is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} Name of the package containing the
  *   ASSERT statement, or a null string if out of context.
  */
 ONPACKAGE: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONPROCEDURE returns the name of a procedure in which a condition
  * is raised.
  *
  * Abbreviation: ONPROC
  *
  * ONPROCEDURE always returns the leftmost name of a multiple label
  * specification, regardless of which name appears in the CALL or
  * GOTO statement. If the name is a DBCS name, it is returned as a
  * mixed-character string. It is in context in any ON-unit, or in
  * any of its dynamic descendants.
  *
  * If ONPROCEDURE is used out of context, a null string is
  * returned.
  * @returns {ANY<CHARACTER>} Name of the procedure where the
  *   condition was raised, or a null string if out of context.
  */
 ONPROCEDURE: ONPROC: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONSOURCE returns a character string whose value is the contents
  * of the field that was being processed when the CONVERSION
  * condition was raised.
  *
  * It is in context in an ON-unit (or any of its dynamic
  * descendants) for the CONVERSION condition or for the ERROR or
  * FINISH condition raised as the implicit action for a CONVERSION
  * condition.
  *
  * If ONSOURCE is used out of context, a null string is returned.
  *
  * If the source in a failed conversion is a COMPLEX value, then
  * ONSOURCE() will show only the REAL or IMAG half of that value.
  * @returns {ANY<CHARACTER>} Contents of the field being converted
  *   when CONVERSION was raised, or a null string if out of context.
  */
 ONSOURCE: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONSUBSCRIPT returns a REAL FIXED BIN(63) value that specifies
  * the invalid array index which caused SUBSCRIPTRANGE to be
  * raised.
  *
  * If ONSUBSCRIPT is used out of context, zero is returned.
  *
  * If the following code is run, then ONSUBSCRIPT would return 5.
  *
  * \`\`\`
  *           dcl a(3,2:4) fixed bin(31) init( (*) 0 );
  *           dcl jx       fixed bin(31);
  *           dcl value    fixed bin(31);
  *
  *           jx = 5;
  *           (subrg): value = a(1,jx);
  * \`\`\`
  * @returns {FIXED BINARY} The invalid array index that caused
  *   SUBSCRIPTRANGE, or zero if out of context.
  */
 ONSUBSCRIPT: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONTEXT returns a nonvarying character string containing the
  * value of the TEXT clause of the ASSERT statement that raised the
  * ASSERTION condition. If the ASSERT statement had no TEXT clause,
  * a null string is returned.
  *
  * It is in context in an ON-unit for the ASSERTION condition, or
  * for the ERROR or FINISH condition raised as the implicit action
  * for an ASSERTION condition.
  *
  * If it is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The TEXT clause value from the ASSERT
  *   statement, or a null string if out of context.
  */
 ONTEXT: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONUCHAR returns a UCHAR(1) string containing the UTF-8 data that
  * caused a CONVERSION condition. It is in context in an ON-unit
  * (or any of its dynamic descendants) for the CONVERSION condition
  * or for the ERROR or FINISH condition raised as the implicit
  * action for the CONVERSION condition.
  *
  * If the ONUCHAR built-in function is used out of context, a UTF-8
  * blank is returned.
  * @returns {CHARACTER} The UTF-8 character that caused the
  *   CONVERSION condition, or a UTF-8 blank if out of context.
  */
 ONUCHAR: PROC () RETURNS (CHARACTER);
 END;
 /**
  * ONUSOURCE returns a UCHAR string whose value is the contents of
  * the field that was being processed when a CONVERSION condition
  * was raised. It is in context in an ON-unit (or any of its
  * dynamic descendants) for the CONVERSION condition or for the
  * ERROR or FINISH condition raised as the implicit action for a
  * CONVERSION condition.
  *
  * If the ONUSOURCE built-in function is used out of context, a
  * null string is returned.
  * @returns {ANY<CHARACTER>} The UTF-8 field contents when
  *   CONVERSION was raised, or a null string if out of context.
  */
 ONUSOURCE: PROC () RETURNS (ANY<CHARACTER>);
 END;
 /**
  * ONWCHAR returns a widechar(1) string containing the widechar
  * that caused the CONVERSION condition to be raised.
  *
  * It is in context in an ON-unit (or any of its dynamic
  * descendants) for the CONVERSION condition or for the ERROR or
  * FINISH condition raised as the implicit action for the
  * CONVERSION condition.
  *
  * If the ONWCHAR built-in function is used out of context, a
  * widechar blank is returned.
  * @returns {CHARACTER} The widechar that caused the CONVERSION
  *   condition, or a widechar blank if out of context.
  */
 ONWCHAR: PROC () RETURNS (CHARACTER);
 END;
 /**
  * ONWSOURCE returns a WIDECHAR string whose value is the contents
  * of the field that was being processed when the CONVERSION
  * condition was raised.
  *
  * It is in context in an ON-unit (or any of its dynamic
  * descendants) for the CONVERSION condition or for the ERROR or
  * FINISH condition raised as the implicit action for a CONVERSION
  * condition.
  *
  * If ONWSOURCE is used out of context, a null string is returned.
  * @returns {ANY<CHARACTER>} The widechar field contents when
  *   CONVERSION was raised, or a null string if out of context.
  */
 ONWSOURCE: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /* Date and time functions */
 /**
  * DATE returns a nonvarying character(6) string containing the
  * date in the format, YYMMDD.
  * @returns {CHARACTER} A nonvarying character(6) string containing
  *   the current date in YYMMDD format.
  */
 DATE: PROC () RETURNS (CHARACTER);
 END;

 /**
  * DATETIME returns a character string timestamp of today's date in
  * either the default format or a user-specified format.
  *
  * See DAYS for an example of using DATETIME.
  *
  * @param {ANY<CHARACTER>} [y] Expression
  *
  *   If present, it specifies the date/time pattern in which the
  *   date is returned. If \`y\` is missing, it is assumed to be the
  *   default date/time pattern 'YYYYMMDDHHMISS999'.
  *
  *   See Table 2 for the allowed patterns.
  *
  *   \`y\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @returns {ANY<CHARACTER>} A character string timestamp of today's
  *   date in the specified or default format.
  */
 DATETIME: PROC (y) RETURNS (ANY<CHARACTER>);
    DCL y ANY<CHARACTER> OPTIONAL;
 END;

 /**
  * DAYS returns a FIXED BINARY(31,0) value that is the number of
  * days (in Lilian format) corresponding to the date \`d\`.
  *
  * \`\`\`
  *   dcl Date_format value ('MMDDYYYY') char;
  *   dcl Todays_date char(length(Date_format));
  *   dcl Sep2_1993 char(length(Date_format));
  *   dcl Days_of_July4_1993 fixed bin(31);
  *   dcl Msg char(100) varying;
  *   dcl Date_due char(length(Date_format));
  *
  *   Todays_date = datetime(date_format); // e.g. 06161993
  *
  *   Days_of_July4_1993 = days('07041993','MMDDYYYY');
  *   Sep2_1993 = daystodate(days_of_July4_1993 + 60, Date_format);
  *                //  09021993
  *
  *   Date_due = daystodate(days() + 60, Date_format);
  *           // assuming today is July 4, 1993, this would be
  *           // Sept. 2, 1993
  *
  *   Msg = 'Please pay amount due on or before ' ||
  *            substr(Date_due, 1, 2) || '/' ||
  *            substr(Date_due, 3,2)  || '/' ||
  *            substr(Date_due, 5);
  * \`\`\`
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of the Lilian format, see Date/time built-in functions.
  *
  * @param {ANY<CHARACTER>} [d] String expression representing a date. If
  *   omitted, it is assumed to be the value returned by DATETIME().
  *
  *   The value for \`d\` must have computational type and should
  *   have character type. If not, \`d\` is converted to character.
  * @param {ANY<CHARACTER>} [p] One of the supported date/time patterns. If
  *   omitted, it is assumed to be the value 'YYYYMMDDHHMISS999'.
  *
  *   \`p\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<NUMBER>} [w] An integer expression that defines a century
  *   window to be used to handle any two-digit year formats.
  *
  *   - If the value is positive, such as 1950, it is treated as a
  *   year.
  *   - If negative or zero, the value specifies an offset to be
  *   subtracted from the current, system-supplied year.
  *   - If omitted, \`w\` defaults to the value specified in the
  *   WINDOW compile-time option.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   number of days in Lilian format corresponding to date d.
  */
 DAYS: PROC (d, p, w) RETURNS (FIXED BINARY);
    DCL d ANY<CHARACTER> OPTIONAL;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * DAYSTODATE returns a nonvarying character string containing the
  * date in the form \`p\` that corresponds to \`d\` days (in Lilian
  * format).
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of the Lilian format, see Date/time built-in functions.
  *
  * See DAYS for an example of using DAYSTODATE.
  *
  * @param {ANY<NUMBER>} d The number of days (in Lilian format). \`d\`
  *   must have a computational type and is converted to FIXED
  *   BINARY(31,0) if necessary.
  * @param {ANY<CHARACTER>} [p] One of the supported date/time patterns.
  *
  *   If omitted, \`p\` is assumed to be the default date/time
  *   pattern 'YYYYMMDDHHMISS999' (same as the default format
  *   returned by DATETIME).
  * @param {ANY<NUMBER>} [w] An integer expression that defines a century
  *   window to be used to handle any two-digit year formats.
  *
  *   - If the value is positive, such as 1950, it is treated as a
  *   year.
  *   - If negative or zero, the value specifies an offset to be
  *   subtracted from the current, system-supplied year.
  *   - If omitted, \`w\` defaults to the value specified in the
  *   WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} A nonvarying character string containing
  *   the date in the form p corresponding to d Lilian days.
  */
 DAYSTODATE: PROC (d, p, w) RETURNS (ANY<CHARACTER>);
    DCL d ANY<NUMBER>;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * DAYSTOMICROSECS returns a FIXED BINARY(63) value that is the
  * number of microseconds that corresponds to the number of days.
  *
  * DAYSTOMICROSECS(x) is the same as \`x\`*(24*60*60*1_000_000).
  *
  * @param {ANY<NUMBER>} x An expression that specifies the number of
  *   days.
  *
  *   \`x\` must have a computational type and will be converted to
  *   FIXED BINARY(31) if necessary.
  * @returns {FIXED BINARY} A FIXED BINARY(63) value that is the
  *   number of microseconds corresponding to x days.
  */
 DAYSTOMICROSECS: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;

 /**
  * DAYSTOSECS returns a FLOAT BINARY(53) value that is the number
  * of seconds corresponding to the number of days.
  *
  * DAYSTOSECS(x) is the same as \`x\`*(24*60*60).
  *
  * @param {ANY<NUMBER>} x An expression that specifies the number of
  *   days.
  *
  *   \`x\` must have a computational type and is converted to FIXED
  *   BINARY(31,0) if necessary.
  * @returns {FLOAT BINARY} A FLOAT BINARY(53) value that is the
  *   number of seconds corresponding to x days.
  */
 DAYSTOSECS: PROC (x) RETURNS (FLOAT BINARY);
    DCL x ANY<NUMBER>;
 END;

 /**
  * JULIANTOSMF returns a CHAR(4) value that holds a date in the SMF
  * format.
  *
  * @param {CHARACTER} d A CHAR(7) variable that holds a date in the
  *   Julian format YYYYDDD
  * @returns {CHARACTER} A CHAR(4) value that holds the date in SMF
  *   format.
  */
 JULIANTOSMF: PROC (d) RETURNS (CHARACTER);
    DCL d CHARACTER;
 END;

 /**
  * MAXDATE returns a character string containing the latest
  * date/time value corresponding to a specified date/time pattern.
  *
  * MAXDATE('YYYY-MM-DD-HH.MI.SS.999999') returns the value
  * '9999-12-31-23.59.59.999999'.
  *
  * The allowed date/time patterns are listed in Table 2.
  *
  * @param {ANY<CHARACTER>} p Specifies one of the supported date/time
  *   patterns.
  * @returns {ANY<CHARACTER>} A character string containing the latest
  *   date/time value corresponding to p.
  */
 MAXDATE: PROC (p) RETURNS (ANY<CHARACTER>);
    DCL p ANY<CHARACTER>;
 END;

 /**
  * MICROSECS returns a FIXED BINARY(63) value that is the number of
  * microseconds corresponding to the date \`d\`.
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * @param {ANY<CHARACTER>} [d] Specifies a string expression
  *   representing a date. If present, \`d\` specifies the input date
  *   as a character string representing the date/time specified in
  *   the pattern \`p\`. If \`d\` is omitted, it is assumed to be the
  *   value returned by TIMESTAMP().
  *
  *   \`d\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<CHARACTER>} [p] Specifies one of the supported date/time
  *   patterns. If \`p\` is omitted, it is assumed to be the
  *   TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  *
  *   \`p\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {FIXED BINARY} A FIXED BINARY(63) value that is the
  *   number of microseconds corresponding to the date \`d\`.
  */
 MICROSECS: PROC (d, p, w) RETURNS (FIXED BINARY);
    DCL d ANY<CHARACTER> OPTIONAL;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * MICROSECSTODATE returns a NONVARYING character string, which
  * contains the date in a specified date/time pattern. The
  * specified date/time pattern corresponds to the number of
  * microseconds.
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * @param {ANY<NUMBER>} m Specifies the number of microseconds (in
  *   Lilian format). \`m\` must have a computational type and is
  *   converted to FIXED BIN(63) if necessary.
  * @param {ANY<CHARACTER>} [p] Specifies one of the supported date/time
  *   patterns. If \`p\` is omitted, it is assumed to be the
  *   TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} A NONVARYING character string
  *   containing the date in the specified date/time pattern.
  */
 MICROSECSTODATE: PROC (m, p, w) RETURNS (ANY<CHARACTER>);
    DCL m ANY<NUMBER>;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * MICROSECSTODAYS returns a FIXED BINARY(31) value that represents
  * the number of microseconds x converted to days, ignoring
  * incomplete days.
  *
  * MICROSECSTODAYS(x) is the same as \`x\`/(24*60*60*1_000_000).
  *
  * For an example, see SECS.
  *
  * @param {ANY<NUMBER>} x An expression that specifies the number of
  *   microseconds. The value for \`x\` must have computational type
  *   and will be converted to FIXED BINARY(63) if necessary.
  * @returns {FIXED BINARY} A FIXED BINARY(31) value that represents
  *   the number of microseconds x converted to days, ignoring
  *   incomplete days.
  */
 MICROSECSTODAYS: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;

 /**
  * MINDATE returns a character string containing the earliest
  * date/time value corresponding to a specified date/time pattern.
  *
  * MINDATE('YYYY-MM-DD-HH.MI.SS.999999') returns the value
  * '1582-10-14-00.00.00.000000' under the NONULLDATE compiler
  * option and '0001-01-01-00.00.00.000000' under the NULLDATE
  * compiler option.
  *
  * The allowed date/time patterns are listed in Table 2.
  *
  * @param {ANY<CHARACTER>} p Specifies one of the supported date/time
  *   patterns.
  * @returns {ANY<CHARACTER>} A character string containing the
  *   earliest date/time value corresponding to p.
  */
 MINDATE: PROC (p) RETURNS (ANY<CHARACTER>);
    DCL p ANY<CHARACTER>;
 END;

 /**
  * REPATTERN takes a value holding a date in one pattern and
  * returns that value converted to a date in a second pattern.
  *
  * The returned value has the attributes CHAR(m) NONVARYING where
  * \`m\` is the length of the target pattern \`p\`.
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * The REPATTERN built-in function will perform the specified
  * conversion in-line when both of the following are true:
  *
  * - the source and target patterns do not use the DDD element.
  * - the source pattern has as much date information as the target,
  * i.e. if the target has a year, month or day, then the source
  * must have the corresponding information and there must also be
  * at least as many digits in the source year as in the target.
  *
  * So, for example,
  *
  * - YYYYMMDD to DD.MM.YY will be inlined
  * - MM/DD/YYYY to YYMM will be inlined
  * - MMYY to YYYYMMDD will not be inlined
  *
  * The following are some examples of how to use REPATTERN to
  * convert between 2-digit-year and 4-digit-year date patterns. But
  * you can use this built-in function to convert a date from any
  * supported pattern to any other supported pattern even if the
  * patterns use the same number of digits to hold the year value.
  *
  * REPATTERN('990101','YYYYMMDD','YYMMDD', 1950) returns '19990101'
  * REPATTERN('000101','YYYYMMDD','YYMMDD', 1950) returns '20000101'
  * REPATTERN('19990101','YYMMDD','YYYYMMDD', 1950) returns '990101'
  * REPATTERN('20000101','YYMMDD','YYYYMMDD', 1950) returns '000101'
  * REPATTERN('19490101','YYMMDD','YYYYMMDD', 1950) raises ERROR
  *
  * @param {ANY<CHARACTER>} d A string expression representing a
  *   date. The length of \`d\` must be at least as large as the
  *   length of the source pattern \`q\`. If \`d\` is larger, any
  *   excess characters must be formed by leading blanks.
  *
  *   \`d\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<CHARACTER>} p The target pattern; must be one of the
  *   supported date/time patterns.
  * @param {ANY<CHARACTER>} [q] The source pattern; must be one
  *   of the supported date/time patterns. If omitted, then the
  *   first argument must be NONVARYING CHAR with length 17, 20,
  *   or 26; in this case, the source pattern will be assumed
  *   based on the following criteria:
  *
  *   | Pattern | Length of the first argument |
  *   | --- | --- |
  *   | YYYYMMDDHHMISS999 | 17 |
  *   | YYYYMMDDHHMISS999999 | 20 |
  *   | YYYY-MM-DD-HH.MI.SS.999999 | 26 |
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} The value converted to a date in a
  *   second pattern.
  */
 REPATTERN: PROC (d, p, q, w) RETURNS (ANY<CHARACTER>);
    DCL d ANY<CHARACTER>;
    DCL p ANY<CHARACTER>;
    DCL q ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * SECS returns a FLOAT BINARY(53) value that is the number of
  * seconds (based on Lilian format) corresponding to the date
  * \`d\`.
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Dayname (7) char(9) var
  * static nonasgn init( 'Sunday',
  *                      'Monday',
  *                      'Tuesday',
  *                      'Wednesday',
  *                      'Thursday',
  *                      'Friday',
  *                      'Saturday');
  *   dcl Jul4_1776_Secs float bin(53);
  *   dcl Age_Tot_Secs pic 'Z,ZZZ,ZZZ,ZZZ,ZZ9';
  *
  *   Jul4_1776_Secs = secs('17760704','YYYYMMDD');     // seconds
  *   Age_Tot_Secs   = secs() - Jul4_1776_Secs;   // seconds since
  *   display ('USA became independent on ' ||
  *             dayname(weekday(secstodays(Jul4_1776_Secs))) ||
  *            ', July 4, 1776 and at this very moment it has been ' ||
  *            Age_Tot_Secs, ||     ' seconds.');
  * \`\`\`
  *
  * @param {ANY<CHARACTER>} [d] A string expression representing a
  *   date. If present, \`d\` specifies the input date as a character
  *   string representing the date/time specified in the pattern
  *   \`p\`. If \`d\` is missing, it is assumed to be DATETIME().
  *
  *   \`d\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<CHARACTER>} [p] One of the supported date/time
  *   patterns. If \`p\` is omitted, it is assumed to be the default
  *   date/time pattern 'YYYYMMDDHHMISS999'.
  *
  *   \`p\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {FLOAT BINARY} A FLOAT BINARY(53) value that is the
  *   number of seconds (based on Lilian format) corresponding to
  *   the date \`d\`.
  */
 SECS: PROC (d, p, w) RETURNS (FLOAT BINARY);
    DCL d ANY<CHARACTER> OPTIONAL;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * SECSTODATE returns a nonvarying character string containing the
  * date in the date/time pattern specified by \`p\` that
  * corresponds to \`d\` seconds (based on Lilian format).
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * @param {ANY<NUMBER>} d The number of seconds (in Lilian format).
  *   \`d\` must have a computational type and is converted to FLOAT
  *   BIN(53) if necessary.
  * @param {ANY<CHARACTER>} [p] One of the supported date/time
  *   patterns. If omitted, \`p\` is assumed to be the default
  *   date/time pattern 'YYYYMMDDHHMISS999' (the default format
  *   returned by DATETIME).
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} A nonvarying character string
  *   containing the date in the date/time pattern specified by \`p\`
  *   that corresponds to \`d\` seconds (based on Lilian format).
  */
 SECSTODATE: PROC (d, p, w) RETURNS (ANY<CHARACTER>);
    DCL d ANY<NUMBER>;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * SECSTODAYS returns a FIXED BINARY(31,0) value that represents
  * the number of seconds \`x\` converted to days, ignoring
  * incomplete days.
  *
  * SECSTODAYS(x) is the same as \`x\`/(24*60*60).
  *
  * For an example, see SECS.
  *
  * @param {ANY<NUMBER>} x Expression. The value for \`x\` must have
  *   computational type and should be FLOAT BINARY(53). If not, it
  *   is converted to FLOAT BINARY(53).
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that
  *   represents the number of seconds \`x\` converted to days,
  *   ignoring incomplete days.
  */
 SECSTODAYS: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;

 /**
  * SMFTOJULIAN returns a CHAR(7) value that holds the date in the
  * Julian format YYYYDDD.
  *
  * @param {ANY<CHARACTER>} d A CHAR(4) variable that holds a date
  *   in the SMF format.
  * @returns {ANY<CHARACTER>} A CHAR(7) value that holds the date in
  *   the Julian format YYYYDDD.
  */
 SMFTOJULIAN: PROC (d) RETURNS (ANY<CHARACTER>);
    DCL d ANY<CHARACTER>;
 END;

 /**
  * STCKETODATE returns a character string that contains a date/time
  * value corresponding to a STCKE value (set by PLISTCKE).
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * @param {ANY<CHARACTER>} x A CHAR(16) value holding a STCKE
  *   value.
  * @param {ANY<CHARACTER>} [p] Specifies one of the supported
  *   date/time patterns. If \`p\` is omitted, it is assumed to be
  *   the TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  * @returns {ANY<CHARACTER>} A character string that contains a
  *   date/time value corresponding to a STCKE value (set by
  *   PLISTCKE).
  */
 STCKETODATE: PROC (x, p) RETURNS (ANY<CHARACTER>);
    DCL x ANY<CHARACTER>;
    DCL p ANY<CHARACTER> OPTIONAL;
 END;

 /**
  * STCKTODATE returns a character string that contains a date/time
  * value corresponding to a STCK value (set by PLISTCK).
  *
  * The allowed patterns are listed in Table 2. For an explanation
  * of Lilian format, see Date/time built-in functions.
  *
  * @param {ANY<NUMBER>} x An UNSIGNED FIXED BIN(64) value holding
  *   a STCK value.
  * @param {ANY<CHARACTER>} [p] Specifies one of the supported
  *   date/time patterns. If \`p\` is omitted, it is assumed to be
  *   the TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  * @returns {ANY<CHARACTER>} A character string that contains a
  *   date/time value corresponding to a STCK value (set by
  *   PLISTCK).
  */
 STCKTODATE: PROC (x, p) RETURNS (ANY<CHARACTER>);
    DCL x ANY<NUMBER>;
    DCL p ANY<CHARACTER> OPTIONAL;
 END;

 /**
  * TIME returns a character string timestamp in the format
  * HHMISS999.
  * @returns {ANY<CHARACTER>} A character string timestamp in the
  *   format HHMISS999.
  */
 TIME: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /**
  * TIMESTAMP returns a CHAR(26) character string that gives the
  * current date and time in the format YYYY-MM-DD-HH.MI.SS.999999.
  * @returns {ANY<CHARACTER>} A CHAR(26) character string that gives
  *   the current date and time in the format
  *   YYYY-MM-DD-HH.MI.SS.999999.
  */
 TIMESTAMP: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /**
  * UTCDATETIME returns a character string that gives the current
  * Coordinated Universal Time (UTC) in the pattern
  * YYYYMMDDHHMISS999.
  * @returns {ANY<CHARACTER>} A character string that gives the
  *   current Coordinated Universal Time (UTC) in the pattern
  *   YYYYMMDDHHMISS999.
  */
 UTCDATETIME: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /**
  * UTCMICROSECS returns a FIXED BINARY(63) value that gives the
  * current UTC time in microseconds.
  * @returns {FIXED BINARY} A FIXED BINARY(63) value that gives the
  *   current UTC time in microseconds.
  */
 UTCMICROSECS: PROC () RETURNS (FIXED BINARY);
 END;

 /**
  * UTCSECS returns a FLOAT BIN(53) value that gives the current
  * Coordinated Universal Time (UTC) in seconds in the Lilian
  * format.
  *
  * If you define a variable to hold a number of quarter-hours as
  *
  * \`\`\`
  * dcl qh fixed dec(5,2);
  * \`\`\`
  *
  * then
  *
  * \`\`\`
  * qh = 15*round(fixeddec((secs()-utcsecs())/900,7,2),0);
  * \`\`\`
  *
  * will set it to the UTC offset as a number of quarter-hours, and
  * the expression
  *
  * \`\`\`
  * edit((qh/60),'S99') || ':' || edit(rem(qh,60),'99')
  * \`\`\`
  *
  * will be a char(6) string holding the UTC offset in the usual
  * format. For example, as -08:00 for California and +05:45 for
  * Nepal.
  * @returns {FLOAT BINARY} A FLOAT BIN(53) value that gives the
  *   current Coordinated Universal Time (UTC) in seconds in the
  *   Lilian format.
  */
 UTCSECS: PROC () RETURNS (FLOAT BINARY);
 END;

 /**
  * VALIDDATE returns '1'B if the string d holds a date/time value
  * that matches the pattern p.
  *
  * Allowable patterns are listed in Table 2. For an explanation of
  * Lilian format, see Date/time built-in functions.
  *
  * If the pattern contains punctuation characters, VALIDDATE checks
  * that the input string contains matching characters. For example,
  * for the pattern YYYY-MM-DD, VALIDDATE accepts 2019-03-14 but not
  * 2019.03.14.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl duedate   char(8);
  *   dcl (b1,b2)   bit(1);
  *
  *   duedate = '20190228';
  *   b1 = validdate( duedate, 'YYYYMMDD' ); // b1 = '1'b
  *
  *   duedate = '02302019';
  *   b2 = validdate( duedate, 'DDMMYYYY' ); // b2 = '0'b
  * \`\`\`
  *
  * @param {ANY<CHARACTER>} d A string expression representing a date.
  *
  *   \`d\` specifies the input date as a character string
  *   representing date/time according to the pattern \`p\`.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, \`d\` is converted to character.
  * @param {ANY<CHARACTER>} [p] One of the supported date/time patterns.
  *
  *   If present, it specifies the date/time pattern of \`d\`. If
  *   \`p\` is missing, it is assumed to be the default date/time
  *   pattern of 'YYYYMMDDHHMISS999'.
  *
  *   \`p\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {BIT} '1'B if the string d holds a date/time value
  *   that matches the pattern p.
  */
 VALIDDATE: PROC (d, p, w) RETURNS (BIT);
    DCL d ANY<CHARACTER>;
    DCL p ANY<CHARACTER> OPTIONAL;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * WEEKDAY returns a FIXED BINARY(31,0) value that is the number of
  * days \`x\` converted to the day of the week, where 1=Sunday,
  * 2=Monday, . . . 7=Saturday. If \`x\` is missing, it is assumed
  * to be DAYS for today.
  *
  * For an example of WEEKDAY, see SECS.
  *
  * @param {ANY<NUMBER>} [x] Expression. If present, \`x\` specifies
  *   the input date as days. If missing, \`x\` is assumed to be
  *   DAYS().
  *
  *   If \`x\` is missing and today's date is not available from the
  *   system, a result of zero is returned.
  *
  *   \`x\` must have computational type and will be converted to
  *   FIXED BINARY(31,0), if necessary.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   number of days \`x\` converted to the day of the week, where
  *   1=Sunday, 2=Monday, . . . 7=Saturday. If \`x\` is missing, it
  *   is assumed to be DAYS for today.
  */
 WEEKDAY: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER> OPTIONAL;
 END;

 /**
  * Y4DATE takes a date value with the pattern 'YYMMDD' and returns
  * the date value with the two-digit year widened to a four-digit
  * year.
  *
  * The returned value has the attributes CHAR(8) NONVARYING and is
  * calculated as follows:
  *
  * \`\`\`
  *   dcl y2 pic'99';
  *   dcl y4 pic'9999';
  *   dcl cc pic'99';
  *
  *   y2 = substr(d,1,2);
  *   cc = w/100;
  *
  *   if y2 < mod(w,100) then
  *     y4 = 100*cc + 100 + y2;
  *   else
  *     y4 = 100*cc + y2;
  *
  *   return( y4 || substr(d,3) );
  * \`\`\`
  *
  * Y4DATE('990101',1950) returns '19990101' Y4DATE('000101',1950)
  * returns '20000101'
  *
  * @param {ANY<CHARACTER>} d A string expression representing a date.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, \`d\` is converted to character.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} The date value with the two-digit year
  *   widened to a four-digit year (CHAR(8) NONVARYING).
  */
 Y4DATE: PROC (d, w) RETURNS (ANY<CHARACTER>);
    DCL d ANY<CHARACTER>;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * Y4JULIAN takes a date value with the pattern 'YYDDD' and returns
  * the date value with the two-digit year widened to a four-digit
  * year.
  *
  * The returned value has the attributes CHAR(7) NONVARYING and is
  * calculated as follows:
  *
  * \`\`\`
  *   dcl y2 pic'99';
  *   dcl y4 pic'9999';
  *   dcl c  pic'99';
  *
  *   y2 = substr(d,1,2);
  *   cc = w/100;
  *
  *   if y2 < mod(w,100) then
  *     y4 = 100*cc + 100 + y2;
  *   else
  *     y4 = 100*cc + y2;
  *
  *   return( y4 || substr(d,3) );
  * \`\`\`
  *
  * Y4JULIAN('99001',1950) returns '1999001' Y4JULIAN('00001',1950)
  * returns '2000001'.
  *
  * @param {ANY<CHARACTER>} d A string expression representing a date.
  *   The length of \`d\` must be at least 5. If it is larger than 5,
  *   excess characters must be formed by leading blanks.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} The date value with the two-digit year
  *   widened to a four-digit year (CHAR(7) NONVARYING).
  */
 Y4JULIAN: PROC (d, w) RETURNS (ANY<CHARACTER>);
    DCL d ANY<CHARACTER>;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /**
  * Y4YEAR takes a date value with the pattern 'YY' and returns the
  * date value with the two-digit year widened to a four-digit year.
  *
  * The returned value has the attributes CHAR(4) NONVARYING and is
  * calculated as follows:
  *
  * \`\`\`
  *   dcl y2 pic'99';
  *   dcl y4 pic'9999';
  *   dcl c  pic'99';
  *
  *   y2 = d;
  *   cc = w/100;
  *
  *   if y2 < mod(w,100) then
  *     y4 = 100*cc + 100 + y2;
  *   else
  *     y4 = 100*cc + y2;
  *
  *   return( y4 );
  * \`\`\`
  *
  * Y4YEAR('99',1950) returns '1999' Y4YEAR('00',1950) returns
  * '2000'
  *
  * @param {ANY<CHARACTER>} d A string expression representing a date.
  *   The length of \`d\` must be at least 2. If it is larger than 2,
  *   excess characters must be formed by leading blanks.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, \`d\` is converted to character.
  * @param {ANY<NUMBER>} [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns {ANY<CHARACTER>} The date value with the two-digit year
  *   widened to a four-digit year (CHAR(4) NONVARYING).
  */
 Y4YEAR: PROC (d, w) RETURNS (ANY<CHARACTER>);
    DCL d ANY<CHARACTER>;
    DCL w ANY<NUMBER> OPTIONAL;
 END;

 /* Encoding and hashing functions */
 /**
  * BASE64DECODE decodes a source buffer from base 64 that is
  * encoded in the character set specified by the ASCII or EBCDIC
  * suboption of the DEFAULT compiler option. It returns a size_t
  * value that indicates the number of bytes that are written into
  * the target buffer.
  *
  * Note: Some arguments or return values are of type size_t. If the
  * LP(32) compiler option is in effect, size_t is FIXED BIN(31); if
  * the LP(64) compiler option is in effect, size_t is FIXED
  * BIN(63).
  *
  * The returned value depends on the address of the target buffer
  * or the size of the target buffer:
  *
  * - If the address of the target buffer p is zero, the number of
  * bytes that would be written is returned.
  * - If the target buffer is not large enough, a value of -1 is
  * returned.
  * - If the target buffer is large enough, the number of bytes that
  * are written to the buffer is returned.
  *
  * This built-in function is the reverse of the built-in function
  * BASE64ENCODE and expects that the base 64 source was encoded by
  * using the same convention that the BASE64ENCODE built-in
  * function uses. See Convention for encoding a source buffer into
  * base 64 as EBCDIC for details. If other conventions were used,
  * the results are unpredictable.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 BASE64DECODE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * BASE64DECODE8 decodes the source buffer from base 64 that is
  * encoded as UTF-8. It returns a size_t 1 value that indicates the
  * number of bytes that are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * This function is the reverse of the function BASE64ENCODE8 and
  * expects that the base 64 source was encoded by using the same
  * convention that the BASE64ENCODE8 function uses. See Convention
  * for encoding a source buffer into base 64 as UTF-8 for details.
  * If other conventions were used, the results are unpredictable.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 BASE64DECODE8: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * BASE64DECODE16 decodes the source buffer from base 64 that is
  * encoded as UTF-16. It returns a size_t 1 value that indicates
  * the number of bytes that are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * This function is the reverse of the function BASE64ENCODE16 and
  * expects that the base 64 source was encoded by using the same
  * convention that the BASE64ENCODE16 function uses. See Convention
  * for encoding a source buffer into base 64 as UTF-16 for details.
  * If other conventions were used, the results are unpredictable.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 BASE64DECODE16: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * BASE64ENCODE encodes a source buffer into a buffer holding its
  * base 64 value in the character set specified by the ASCII or
  * EBCDIC suboption of the DEFAULT compiler option. It returns a
  * size_t value that indicates the number of bytes that are written
  * into the target buffer.
  *
  * The returned value depends on the address of the target buffer
  * or the size of the target buffer:
  *
  * - If the address of the target buffer p is zero, the number of
  * bytes that would be written is returned.
  * - If the target buffer is not large enough, a value of -1 is
  * returned.
  * - If the target buffer is large enough, the number of bytes that
  * are written to the buffer is returned.
  *
  * Note: Some arguments or return values are of type size_t. If the
  * LP(32) compiler option is in effect, size_t is FIXED BIN(31); if
  * the LP(64) compiler option is in effect, size_t is FIXED
  * BIN(63).
  *
  * **Convention for encoding a source buffer into base 64 as
  * EBCDIC**
  *
  * This encoding uses the following set of base 64 "digits":
  *
  * \`\`\`
  * ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
  * \`\`\`
  *
  * Each 6 bits of the source is converted to the corresponding
  * EBCDIC "digit" in this base 64 string. If the source length in
  * bits is not a multiple of 6, the result concludes with one or
  * two '='e symbols as needed.
  *
  * Because the source buffer is treated as a bit string, the result
  * in the target buffer varies with the code page of the source.
  *
  * The following table shows the example of the sources and the
  * corresponding results when converting source buffer into base 64
  * that is encoded as EBCDIC by using BASE64ENCODE:
  *
  * | Source length | Source value | Result length | Result value |
  * | --- | --- | --- | --- |
  * | 6 | 'please'A | 8 | cGxlYXNl |
  * | 5 | 'pleas'A | 8 | cGxlYXM= |
  * | 4 | 'plea'A | 8 | cGxlYQ== |
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 BASE64ENCODE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * BASE64ENCODE8 encodes the source buffer into base 64 that is
  * encoded as UTF-8. It returns a size_t 1 value that indicates the
  * number of bytes that are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * **Convention for encoding a source buffer into base 64 as
  * UTF-8**
  *
  * This encoding uses the following set of base 64 "digits":
  *
  * \`\`\`
  * ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
  * \`\`\`
  *
  * Each 6 bits of the source is converted to the corresponding
  * UTF-8 "digit" in this base 64 string. If the source length in
  * bits is not a multiple of 6, the result concludes with one or
  * two = symbols as needed, and the = symbol is UTF-8.
  *
  * The source buffer is treated as a bit string, so the result in
  * the target buffer varies with the code page of the source. In
  * particular, when the source is in EBCDIC, the result differs
  * when the source is in ASCII.
  *
  * The following table shows the example of the sources and the
  * corresponding results when converting source buffer into base 64
  * that is encoded as UTF-8 by using BASE64ENCODE8:
  *
  * | Source length | Source value | Result length | Result value |
  * | --- | --- | --- | --- |
  * | 6 | 'please'A | 8 | UTF8('cGxlYXNl') |
  * | 5 | 'pleas'A | 8 | UTF8('cGxlYXM=') |
  * | 4 | 'plea'A | 8 | UTF8('cGxlYQ==') |
  * | 6 | 'please'E | 8 | UTF8('l5OFgaKF') |
  * | 5 | 'pleas'E | 8 | UTF8('l5OFgaI=') |
  * | 4 | 'plea'E | 8 | UTF8('l5OFgQ==) |
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 BASE64ENCODE8: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * BASE64ENCODE16 encodes the source buffer into base 64 that is
  * encoded as UTF-16. It returns a size_t 1 value that indicates
  * the number of bytes that are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * **Convention for encoding a source buffer into base 64 as
  * UTF-16**
  *
  * This encoding uses the following set of base 64 "digits":
  *
  * \`\`\`
  * ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
  * \`\`\`
  *
  * Each 6 bits of the source is converted to the corresponding
  * UTF-16 "digit" in the base 64 string. If the source length in
  * bits is not a multiple of 6, the result concludes with one or
  * two = symbols as needed, and the = symbol is UTF-16.
  *
  * The source buffer is treated as a bit string, so the result in
  * the target buffer varies with the code page of the source. In
  * particular, when the source is in EBCDIC, the result differs
  * when the source is in ASCII.
  *
  * The following table shows examples of the sources and the
  * corresponding results when converting the source buffer into
  * base 64 that is encoded as UTF-16 by using BASE64ENCODE16.
  *
  * | Source length | Source value | Result length | Result value |
  * | --- | --- | --- | --- |
  * | 6 | 'please'A | 16 | WCHAR('cGxlYXNl') |
  * | 5 | 'pleas'A | 16 | WCHAR('cGxlYXM=') |
  * | 4 | 'plea'A | 16 | WCHAR('cGxlYQ==') |
  * | 6 | 'please'E | 16 | WCHAR('l5OFgaKF') |
  * | 5 | 'pleas'E | 16 | WCHAR('l5OFgaI=') |
  * | 4 | 'plea'E | 16 | WCHAR('l5OFgQ==') |
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 BASE64ENCODE16: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * CHECKSUM returns an UNSIGNED FIXED BIN(32) value that is the
  * checksum value for a specified buffer.
  *
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.1
  * @returns {ANY<NUMBER>} An UNSIGNED FIXED BIN(32) value that is
  *   the checksum value for a specified buffer.
  */
 CHECKSUM: PROC (q, n) RETURNS (ANY<NUMBER>);
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * HEXDECODE decodes a source buffer from base 16 that is encoded
  * in the character set specified by the ASCII/EBCDIC suboption of
  * the DEFAULT compiler option. This function returns a size_t 1
  * value that indicates the number of bytes that are written into
  * the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * If the source contains characters other than hexadecimal digits,
  * the CONVERSION condition is raised.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 HEXDECODE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * HEXDECODE8 decodes a source buffer from base 16 that is encoded
  * in UTF-8. This function returns a size_t 1 value that indicates
  * the number of bytes that are written into the target buffer.
  *
  * If the address of the target buffer is zero, the number of bytes
  * that would be written is returned. If the target buffer is not
  * large enough, a value of -1 is returned. If the target buffer is
  * large enough, the number of bytes that is written to the buffer
  * is returned.
  *
  * If the source contains characters other than hexadecimal digits,
  * the CONVERSION condition is raised.
  *
  * @param {ANY<LOCATOR>} p Specifies the address of the target buffer.
  * @param {ANY<NUMBER>} m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param {ANY<LOCATOR>} q Specifies the address of the source buffer.
  * @param {ANY<NUMBER>} n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns {ANY<NUMBER>} A size_t value that indicates the number
  *   of bytes that are written into the target buffer.
  */
 HEXDECODE8: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Performs a SHA-1 hash of the text specified by an address and
  * length and returns a CHAR(20) string with that hash value.
  *
  * SHA1DIGEST returns a CHAR(20) value.
  *
  * This function generates code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a SHA-1 hash of the text in a
  * CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(20);
  *
  *         encoded = sha1digest(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR(20) string with the SHA-1 hash
  *   value.
  */
 SHA1DIGEST: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Uses a token initialized by the corresponding SHA1INIT function
  * to complete a SHA-1 hash of a series of texts and returns a
  * CHAR(20) string with that hash value.
  *
  * SHA1FINAL returns a CHAR(20) value.
  *
  * This function generates code that executes the KIMD and KLMD
  * assembler instructions.
  *
  * **Examples**
  *
  * The following example performs a SHA-1 hash of a file that is
  * read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(20);
  *         token = sha1init();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha1update(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha1final(token, sysnull(), 0);
  * \`\`\`
  *
  * In the example, all the SHA function calls are in the same block
  * of code. This is not necessary: the calls can occur in a set of
  * routines as long as they all use the same token created by the
  * SHA1INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA1INIT or SHA1UPDATE.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR(20) string with the SHA-1 hash
  *   value.
  */
 SHA1FINAL: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Returns a token (of type POINTER) that can be used with the
  * corresponding SHA1UPDATE and SHA1FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA1FINAL function for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA1UPDATE and SHA1FINAL.
  */
 SHA1INIT: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Uses a token initialized by the corresponding SHA1INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * This function returns a token (of type POINTER) that can be used
  * with further SHA1UPDATE function and the concluding SHA1FINAL
  * function.
  *
  * See the description of the SHA1FINAL function for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA1INIT or SHA1UPDATE.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA1UPDATE and SHA1FINAL.
  */
 SHA1UPDATE: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-2 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-2 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(64);
  *
  *         encoded = sha2digest512(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2DIGEST224: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-2 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-2 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(64);
  *
  *         encoded = sha2digest512(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2DIGEST256: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-2 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-2 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(64);
  *
  *         encoded = sha2digest512(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2DIGEST384: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-2 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-2 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(64);
  *
  *         encoded = sha2digest512(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2DIGEST512: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to complete a SHA-2 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2FINAL256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KIMD and KLMD
  * assembler instructions.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-2 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(32);
  *         token = sha2init256();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha2update256(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha2final256(token, sysnull(), 0);
  * \`\`\`
  *
  * In the example, all the SHA function calls are in the same block
  * of code. This is not necessary: the calls can occur in a set of
  * routines as long as they all use the same token created by the
  * SHA2INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2FINAL224: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to complete a SHA-2 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2FINAL256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KIMD and KLMD
  * assembler instructions.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-2 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(32);
  *         token = sha2init256();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha2update256(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha2final256(token, sysnull(), 0);
  * \`\`\`
  *
  * In the example, all the SHA function calls are in the same block
  * of code. This is not necessary: the calls can occur in a set of
  * routines as long as they all use the same token created by the
  * SHA2INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2FINAL256: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to complete a SHA-2 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2FINAL256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KIMD and KLMD
  * assembler instructions.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-2 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(32);
  *         token = sha2init256();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha2update256(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha2final256(token, sysnull(), 0);
  * \`\`\`
  *
  * In the example, all the SHA function calls are in the same block
  * of code. This is not necessary: the calls can occur in a set of
  * routines as long as they all use the same token created by the
  * SHA2INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2FINAL384: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to complete a SHA-2 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA2FINAL256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KIMD and KLMD
  * assembler instructions.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-2 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(32);
  *         token = sha2init256();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha2update256(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha2final256(token, sysnull(), 0);
  * \`\`\`
  *
  * In the example, all the SHA function calls are in the same block
  * of code. This is not necessary: the calls can occur in a set of
  * routines as long as they all use the same token created by the
  * SHA2INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-2 hash value.
  */
 SHA2FINAL512: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA2UPDATE and SHA2FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA2FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA2UPDATE and SHA2FINAL.
  */
 SHA2INIT224: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA2UPDATE and SHA2FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA2FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA2UPDATE and SHA2FINAL.
  */
 SHA2INIT256: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA2UPDATE and SHA2FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA2FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA2UPDATE and SHA2FINAL.
  */
 SHA2INIT384: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA2UPDATE and SHA2FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA2FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA2UPDATE and SHA2FINAL.
  */
 SHA2INIT512: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA2UPDATE functions and the concluding
  * SHA2FINAL function.
  *
  * See the description of the SHA2FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA2UPDATE and SHA2FINAL.
  */
 SHA2UPDATE224: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA2UPDATE functions and the concluding
  * SHA2FINAL function.
  *
  * See the description of the SHA2FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA2UPDATE and SHA2FINAL.
  */
 SHA2UPDATE256: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA2UPDATE functions and the concluding
  * SHA2FINAL function.
  *
  * See the description of the SHA2FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA2UPDATE and SHA2FINAL.
  */
 SHA2UPDATE384: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA2INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA2UPDATE functions and the concluding
  * SHA2FINAL function.
  *
  * See the description of the SHA2FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA2UPDATE and SHA2FINAL.
  */
 SHA2UPDATE512: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-3 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA3DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-3 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(32);
  *
  *         encoded = sha3digest256(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3DIGEST224: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-3 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA3DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-3 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(32);
  *
  *         encoded = sha3digest256(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3DIGEST256: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-3 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA3DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-3 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(32);
  *
  *         encoded = sha3digest256(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3DIGEST384: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Perform a SHA-3 hash of the text specified by an address and
  * length and return a CHAR string with that hash value.
  *
  * The length returned is one eighth of the bit length in the
  * function name, so, for example, SHA3DIGEST256 returns a CHAR(32)
  * value.
  *
  * These functions generate code that executes the KLMD assembler
  * instruction.
  *
  * **Examples**
  *
  * The following example performs a 256-bit SHA-3 hash of the text
  * in a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl encoded   char(32);
  *
  *         encoded = sha3digest256(addrdata(c), length(c));
  * \`\`\`
  *
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3DIGEST512: PROC (p, n) RETURNS (ANY<CHARACTER>);
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to complete a SHA-3 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-3 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(64);
  *         token = sha3init512();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha3update512(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha3final512(token, sysnull(), 0);
  * \`\`\`
  *
  * In above example, all the SHA function calls are in the same
  * block of code. This is not necessary: the calls can occur in a
  * set of routines as long as they all use the same token created
  * by the SHA3INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3FINAL224: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to complete a SHA-3 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-3 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(64);
  *         token = sha3init512();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha3update512(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha3final512(token, sysnull(), 0);
  * \`\`\`
  *
  * In above example, all the SHA function calls are in the same
  * block of code. This is not necessary: the calls can occur in a
  * set of routines as long as they all use the same token created
  * by the SHA3INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3FINAL256: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to complete a SHA-3 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-3 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(64);
  *         token = sha3init512();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha3update512(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha3final512(token, sysnull(), 0);
  * \`\`\`
  *
  * In above example, all the SHA function calls are in the same
  * block of code. This is not necessary: the calls can occur in a
  * set of routines as long as they all use the same token created
  * by the SHA3INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3FINAL384: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to complete a SHA-3 hash of a series of texts and return a CHAR
  * string with that hash value.
  *
  * **Examples**
  *
  * The following example performs a 512-bit SHA-3 hash of a file
  * that is read one line at a time into a CHARACTER variable c.
  *
  * \`\`\`
  *         dcl token     pointer;
  *         dcl encoded   char(64);
  *         token = sha3init512();
  *         on endfile(input);
  *         do loop;
  *           read file(input) into(c);
  *           if endfile(input) then leave;
  *           token = sha3update512(token, addrdata(c), length(c));
  *         end;
  *         encoded = sha3final512(token, sysnull(), 0);
  * \`\`\`
  *
  * In above example, all the SHA function calls are in the same
  * block of code. This is not necessary: the calls can occur in a
  * set of routines as long as they all use the same token created
  * by the SHA3INIT call.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns {ANY<CHARACTER>} A CHAR string with the SHA-3 hash value.
  */
 SHA3FINAL512: PROC (t, p, n) RETURNS (ANY<CHARACTER>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA3UPDATE and SHA3FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA3FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA3UPDATE and SHA3FINAL.
  */
 SHA3INIT224: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA3UPDATE and SHA3FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA3FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA3UPDATE and SHA3FINAL.
  */
 SHA3INIT256: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA3UPDATE and SHA3FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA3FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA3UPDATE and SHA3FINAL.
  */
 SHA3INIT384: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Return a token (of type POINTER) that can be used with the
  * corresponding SHA3UPDATE and SHA3FINAL functions to hash a
  * series of texts.
  *
  * See the description of the SHA3FINAL functions for an example.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with SHA3UPDATE and SHA3FINAL.
  */
 SHA3INIT512: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA3UPDATE functions and the concluding
  * SHA3FINAL function.
  *
  * See the description of the SHA3FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA3UPDATE and SHA3FINAL.
  */
 SHA3UPDATE224: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA3UPDATE functions and the concluding
  * SHA3FINAL function.
  *
  * See the description of the SHA3FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA3UPDATE and SHA3FINAL.
  */
 SHA3UPDATE256: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA3UPDATE functions and the concluding
  * SHA3FINAL function.
  *
  * See the description of the SHA3FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA3UPDATE and SHA3FINAL.
  */
 SHA3UPDATE384: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * Use a token initialized by the corresponding SHA3INIT function
  * to perform an intermediate hash of an element in a series of
  * texts.
  *
  * These functions return a token (of type POINTER) that can be
  * used with further SHA3UPDATE functions and the concluding
  * SHA3FINAL function.
  *
  * See the description of the SHA3FINAL functions for an example.
  *
  * @param {ANY<LOCATOR>} t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param {ANY<LOCATOR>} \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param {ANY<NUMBER>} \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns {ANY<LOCATOR>} A token (of type POINTER) that can be
  *   used with further SHA3UPDATE and SHA3FINAL.
  */
 SHA3UPDATE512: PROC (t, p, n) RETURNS (ANY<LOCATOR>);
    DCL t ANY<LOCATOR>;
    DCL p ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /* Floating point inquiry functions */
 /**
  * EPSILON returns a floating-point value that is the spacing
  * between \`x\` and the next positive number when \`x\` is 1. It
  * has the base, mode, and precision of \`x\`.
  *
  * EPSILON(x) is a constant and can be used in restricted
  * expressions.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT expression.
  * @returns {ANY<NUMBER>} A floating-point value that is the spacing
  *   between \`x\` and the next positive number when \`x\` is 1.
  */
 EPSILON: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
 END;
 /**
  * HUGE returns a floating-point value that is the largest positive
  * value \`x\` can assume. It has the base, mode, and precision of
  * \`x\`.
  *
  * HUGE(x) is a constant and can be used in restricted expressions.
  *
  * @param {ANY<NUMBER>} x Expression. \`x\` must have the attributes
  *   REAL FLOAT.
  * @returns {ANY<NUMBER>} A floating-point value that is the largest
  *   positive value \`x\` can assume.
  */
 HUGE: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ISFINITE returns a '1'B if if the argument with which it is
  * invoked is not a NAN and not positive or negative infinity.
  * Otherwise it returns a '0'B.
  *
  * The FLOAT(DFP) compiler option must be in effect.
  *
  * No floating-point exceptions will be raised no matter what the
  * format of the argument.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT DECIMAL expression.
  * @returns {BIT} '1'B if the argument is not a NAN and not
  *   positive or negative infinity; '0'B otherwise.
  */
 ISFINITE: PROC (x) RETURNS (BIT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ISINF returns a '1'B if if the argument with which it is invoked
  * is an infinity. Otherwise it returns a '0'B.
  *
  * The FLOAT(DFP) compiler option must be in effect.
  *
  * No floating-point exceptions will be raised no matter what the
  * format of the argument.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT DECIMAL expression.
  * @returns {BIT} '1'B if the argument is an infinity; '0'B
  *   otherwise.
  */
 ISINF: PROC (x) RETURNS (BIT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ISNAN returns a '1'B if if the argument with which it is invoked
  * is a NAN. Otherwise it returns a '0'B.
  *
  * The FLOAT(DFP) compiler option must be in effect.
  *
  * No floating-point exceptions will be raised no matter what the
  * format of the argument.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT DECIMAL expression.
  * @returns {BIT} '1'B if the argument is a NAN; '0'B otherwise.
  */
 ISNAN: PROC (x) RETURNS (BIT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ISNORMAL returns a '1'B if if the argument with which it is
  * invoked is not a zero, subnormal, infinity or NaN. Otherwise it
  * returns a '0'B.
  *
  * The FLOAT(DFP) compiler option must be in effect.
  *
  * No floating-point exceptions will be raised no matter what the
  * format of the argument.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT DECIMAL expression.
  * @returns {BIT} '1'B if the argument is not a zero, subnormal,
  *   infinity or NaN; '0'B otherwise.
  */
 ISNORMAL: PROC (x) RETURNS (BIT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ISZERO returns a '1'B if if the argument with which it is
  * invoked is a zero. Otherwise it returns a '0'B.
  *
  * The FLOAT(DFP) compiler option must be in effect.
  *
  * No floating-point exceptions will be raised no matter what the
  * format of the argument.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT DECIMAL expression.
  * @returns {BIT} '1'B if the argument is a zero; '0'B otherwise.
  */
 ISZERO: PROC (x) RETURNS (BIT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * MAXEXP returns a FIXED BINARY(31,0) value that is the maximum
  * value that EXPONENT(x) can assume.
  *
  * MAXEXP(x) is a constant and can be used in restricted
  * expressions.
  *
  * **Example (Intel values)**
  *
  * \`\`\`
  *   maxexp(x) = 128      for x float bin(p), p <= 21
  *   maxexp(x) = 1024      for x float bin(p), 21 < p <= 53
  *   maxexp(x) = 16384      for x float bin(p), 53 < p
  *
  *   maxexp(x) = 128      for x float dec(p), p <= 6
  *   maxexp(x) = 1024      for x float dec(p), 6 < p <= 16
  *   maxexp(x) = 16384      for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (AIX values)**
  *
  * \`\`\`
  *   maxexp(x) = 128      for x float bin(p), p <= 21
  *   maxexp(x) = 1024      for x float bin(p), 21 < p <= 53
  *   maxexp(x) = 1024      for x float bin(p), 53 < p
  *
  *   maxexp(x) = 128      for x float dec(p), p <= 6
  *   maxexp(x) = 1024      for x float dec(p), 6 < p <= 16
  *   maxexp(x) = 1024      for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS hexadecimal values)**
  *
  * \`\`\`
  *   maxexp(x) = 63      for x float bin(p), p <= 21
  *   maxexp(x) = 63      for x float bin(p), 21 < p <= 53
  *   maxexp(x) = 63      for x float bin(p), 53 < p
  *
  *   maxexp(x) = 63      for x float dec(p), p <= 6
  *   maxexp(x) = 63      for x float dec(p), 6 < p <= 16
  *   maxexp(x) = 63      for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS IEEE Binary Floating Point values)**
  *
  * \`\`\`
  *   maxexp(x) = 128     for x float bin(p), p <= 21
  *   maxexp(x) = 1024    for x float bin(p), 21 < p <= 53
  *   maxexp(x) = 16384   for x float bin(p), 53 < p
  *
  *   maxexp(x) = 128     for x float dec(p), p <= 6
  *   maxexp(x) = 1024    for x float dec(p), 6 < p <= 16
  *   maxexp(x) = 16384   for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS IEEE Decimal Floating Point Values)**
  *
  * \`\`\`
  *   maxexp(x) = 97      for x float dec(p), p <= 7
  *   maxexp(x) = 385     for x float dec(p), 7 < p <= 16
  *   maxexp(x) = 6145    for x float dec(p), 16 < p
  * \`\`\`
  *
  * @param {ANY<NUMBER>} x Expression. \`x\` must have the REAL and
  *   FLOAT attributes.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   maximum value that EXPONENT(x) can assume.
  */
 MAXEXP: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * MINEXP returns a FIXED BINARY(31,0) value that is the minimum
  * value that EXPONENT(x) can assume.
  *
  * MINEXP(x) is a constant and can be used in restricted
  * expressions.
  *
  * **Example (Intel values)**
  *
  * \`\`\`
  *   minexp(x) = -125    for x float bin(p), p <= 21
  *   minexp(x) = -1021    for x float bin(p), 21 < p <= 53
  *   minexp(x) = -16831    for x float bin(p), 53 < p
  *
  *   minexp(x) = -125    for x float dec(p), p <= 6
  *   minexp(x) = -1021    for x float dec(p), 6 < p <= 16
  *   minexp(x) = -16831    for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (AIX values)**
  *
  * \`\`\`
  *   minexp(x) = -125     for x float bin(p), p <= 21
  *   minexp(x) = -1021     for x float bin(p), 21 < p <= 53
  *   minexp(x) = -968     for x float bin(p), 53 < p
  *
  *   minexp(x) = -125     for x float dec(p), p <= 6
  *   minexp(x) = -1021     for x float dec(p), 6 < p <= 16
  *   minexp(x) = -968     for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS Hexadecimal values)**
  *
  * \`\`\`
  *   minexp(x) = -64    for x float bin(p), p <= 21
  *   minexp(x) = -64    for x float bin(p), 21 < p <= 53
  *   minexp(x) = -50    for x float bin(p), 53 < p
  *
  *   minexp(x) = -64    for x float dec(p), p <= 6
  *   minexp(x) = -64    for x float dec(p), 6 < p <= 16
  *   minexp(x) = -50    for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS IEEE Binary Floating Point values)**
  *
  * \`\`\`
  *   minexp(x) = -125    for x float bin(p), p <= 21
  *   minexp(x) = -1021   for x float bin(p), 21 < p <= 53
  *   minexp(x) = -16381  for x float bin(p), 53 < p
  *
  *   minexp(x) = -125    for x float dec(p), p <= 6
  *   minexp(x) = -1021   for x float dec(p), 6 < p <= 16
  *   minexp(x) = -16381  for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS IEEE Decimal Floating Point values)**
  *
  * \`\`\`
  *   minexp(x) = -94       for x float dec(p), p <= 7
  *   minexp(x) = -382      for x float dec(p), 7 < p <= 16
  *   minexp(x) = -6142     for x float dec(p), 16 < p
  * \`\`\`
  *
  * @param {ANY<NUMBER>} x Expression. \`x\` must have the REAL and
  *   FLOAT attributes.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   minimum value that EXPONENT(x) can assume.
  */
 MINEXP: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * PLACES returns a FIXED BINARY(31,0) value that is the
  * model-precision used to represent the floating-point expression
  * \`x\`.
  *
  * PLACES(x) is a constant and can be used in restricted
  * expressions.
  *
  * **Example (Intel values)**
  *
  * \`\`\`
  *   places(x) = 24        for x float bin(p), p <= 21
  *   places(x) = 53        for x float bin(p), 21 < p <= 53
  *   places(x) = 64        for x float bin(p), 53 < p
  *
  *   places(x) = 24        for x float dec(p), p <= 6
  *   places(x) = 53        for x float dec(p), 6 < p <= 16
  *   places(x) = 64        for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (AIX values)**
  *
  * \`\`\`
  *   places(x) = 024        for x float bin(p), p <= 21
  *   places(x) = 053        for x float bin(p), 21 < p <= 53
  *   places(x) = 106        for x float bin(p), 53 < p
  *
  *   places(x) = 024        for x float dec(p), p <= 6
  *   places(x) = 053        for x float dec(p), 6 < p <= 16
  *   places(x) = 106        for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS Hexadecimal values)**
  *
  * \`\`\`
  *   places(x) = 6         for x float bin(p), p <= 21
  *   places(x) = 14        for x float bin(p), 21 < p <= 53
  *   places(x) = 28        for x float bin(p), 53 < p
  *
  *   places(x) = 6         for x float dec(p), p <= 6
  *   places(x) = 14        for x float dec(p), 6 < p <= 16
  *   places(x) = 28        for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS IEEE Binary Floating Point values)**
  *
  * \`\`\`
  *   places(x) = 24        for x float bin(p), p <= 21
  *   places(x) = 53        for x float bin(p), 21 < p <= 53
  *   places(x) = 113       for x float bin(p), 53 < p
  *
  *   places(x) = 24        for x float dec(p), p <= 6
  *   places(x) = 53        for x float dec(p), 6 < p <= 16
  *   places(x) = 113       for x float dec(p), 16 < p
  * \`\`\`
  *
  * **Example (z/OS IEEE Decimal Floating Point values)**
  *
  * \`\`\`
  *   places(x) = 7         for x float dec(p), p <= 7
  *   places(x) = 16        for x float dec(p), 7 < p <= 16
  *   places(x) = 34        for x float dec(p), 16 < p
  * \`\`\`
  *
  * @param {ANY<NUMBER>} x Expression. \`x\` must be declared REAL
  *   FLOAT.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   model-precision used to represent \`x\`.
  */
 PLACES: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * RADIX returns a FIXED BINARY(31,0) value that is the model-base
  * used to represent the floating-point expression \`x\`.
  *
  * RADIX(x) depends on the floating-point format used to represent
  * \`x\`. It is:
  *
  * - 2 if \`x\` is held in IEEE binary floating point format
  * - 10 if \`x\` is held in IEEE decimal floating point format
  * - 16 if \`x\` is held in z/OS hexadecimal format
  *
  * RADIX(x) can be used in restricted expressions.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT expression.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   model-base used to represent \`x\`.
  */
 RADIX: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * TINY returns a floating-point value that is the smallest
  * positive value \`x\` can assume. It has the base, mode, and
  * precision, of \`x\`.
  *
  * TINY(x) is a constant and can be used in restricted expressions.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT expression.
  * @returns {ANY<NUMBER>} A floating-point value that is the
  *   smallest positive value \`x\` can assume.
  */
 TINY: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
 END;
 /**
  * EXPONENT returns a FIXED BINARY(31,0) value that is the exponent
  * part of x.
  *
  * EXPONENT(x) is not the mathematical exponent of \`x\`. If \`x\`
  * = 0, EXPONENT(x) = 0. For other values of \`x\`, EXPONENT(x) is
  * the unique number \`e\` such that:
  *
  * \`\`\`
  *        (e-1)                      e
  * radix(x)      <= abs(x) < radix(x)
  * \`\`\`
  *
  * Consequently, EXPONENT(1e0) equals 1 and not 0.
  *
  * @param {ANY<NUMBER>} x Expression. \`x\` must be declared as REAL
  *   FLOAT.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that is the
  *   exponent part of x.
  */
 EXPONENT: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * PRED returns a floating-point value that is the biggest
  * representable number smaller than \`x\`. It has the base, mode,
  * and precision of x. OVERFLOW will be raised if there is no such
  * number.
  *
  * PRED(TINY(X)) will return zero and will not raise UNDERFLOW.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT expression.
  * @returns {ANY<NUMBER>} A floating-point value that is the biggest
  *   representable number smaller than \`x\`.
  */
 PRED: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
 END;
 /**
  * SCALE multiplies a floating-point number by an integral power of
  * the radix.
  *
  * SCALE returns a floating-point value based on the following
  * formula:
  *
  * \`\`\`
  *                n
  *   x*(radix(x) )
  * \`\`\`
  *
  * The result has the base, mode, and precision of \`x\`.
  *
  * @param {ANY<NUMBER>} x REAL FLOAT expression.
  * @param {ANY<NUMBER>} n Expression. It must have a computational
  *   type and is converted to FIXED BINARY(31,0).
  * @returns {ANY<NUMBER>} A floating-point value equal to
  *   x*(radix(x)^n).
  */
 SCALE: PROC (x, n) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * SUCC returns a floating-point value that is the smallest
  * representable number larger than \`x\`. It is the base, mode,
  * and precision of \`x\`. The OVERFLOW condition is raised if
  * there is no such number.
  *
  * SUCC satisfies the following relationships:
  *
  * \`\`\`
  *   pred(succ(x)) = x
  *   succ(pred(x)) = x
  *   succ(x)       = -pred(-x)
  *   succ(0d0)     = tiny(0d0)
  * \`\`\`
  *
  * @param {ANY<NUMBER>} x REAL FLOAT expression.
  * @returns {ANY<NUMBER>} A floating-point value that is the
  *   smallest representable number larger than \`x\`.
  */
 SUCC: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
 END;

 /* INPUT/OUTPUT functions */
 /**
  * COUNT returns an unscaled REAL FIXED BINARY value specifying
  * the number of data items transmitted during the last GET or
  * PUT operation on \`x\`.
  *
  * The count of transmitted items for a GET or PUT operation on
  * \`x\` is initialized to zero before the first data item is
  * transmitted, and is incremented by one after the transmission
  * of each data item in the list. If \`x\` is not open in the
  * current program, a value of zero is returned.
  *
  * If an ON-unit or procedure is entered during a GET or PUT
  * operation, and within that ON-unit or procedure, a GET or PUT
  * operation is executed for \`x\`, the value of COUNT is reset
  * for the new operation. It is restored when the original GET
  * or PUT is continued.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * @param {ANY<FILE>} x File-reference. The file must be open
  *   and have the STREAM attribute.
  * @returns {FIXED BINARY} An unscaled REAL FIXED BINARY value
  *   specifying the number of data items transmitted during the
  *   last GET or PUT operation on \`x\`.
  */
 COUNT: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
 END;
 /**
  * ENDFILE returns a '1'B when the end of the file is reached;
  * '0'B if the end is not reached. If the file is not open, the
  * ERROR condition is raised.
  *
  * ENDFILE can be used to detect the end-of-file condition for
  * bytestream files; for example, files that require the use of
  * the FILEREAD built-in function.
  *
  * @param {ANY<FILE>} x File reference.
  * @returns {BIT} A '1'B when the end of the file is reached;
  *   '0'B if the end is not reached.
  */
 ENDFILE: PROC (x) RETURNS (BIT);
    DCL x ANY<FILE>;
 END;
 /**
  * FILEDDINT returns a size_t value that is the value of
  * attribute \`c\` for file \`x\`.
  *
  * When using FILEDDINT, the following are valid values for \`c\`:
  *
  * | blksize bufsize delay filesize | keylen keyloc recsize retry |
  * | --- | --- |
  *
  * The ERROR condition with oncode 1010 is raised when the file
  * is not open or the attribute is invalid for the file being
  * queried.
  *
  * FILEDDINT(x,'BLKSIZE') is valid only on z/OS.
  * FILEDDINT(x,'BLKSIZE') will return the blocksize for a
  * CONSECUTIVE file. It will return 0 for an zFS file and will
  * return 0 for a VSAM file.
  *
  * FILEDDINT(x,'FILESIZE') will, on z/OS, return a value of 0
  * except for zFS files.
  *
  * FILEDDINT(x,'KEYLOC') and FILEDDINT(x,'KEYLEN') are valid
  * only for VSAM KSDS files.
  *
  * @param {ANY<FILE>} x File reference.
  * @param {ANY<CHARACTER>} c Character string that holds the
  *   attribute to be queried.
  * @returns {FIXED BINARY} A size_t value that is the value of
  *   attribute \`c\` for file \`x\`.
  */
 FILEDDINT: PROC (x, c) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
    DCL c ANY<CHARACTER>;
 END;
 /**
  * FILEDDTEST returns a FIXED BIN(31) value that holds the value
  * 1 if the attribute \`c\` applies to file \`x\`. Otherwise, a
  * value of 0 is returned.
  *
  * When using FILEDDTEST, the following are valid values for \`c\`:
  *
  * | append bkwd ctlasa delimit descendkey genkey | graphic lrmskip
  * print prompt scalarvarying skip0 |
  * | --- | --- |
  *
  * The ERROR condition with oncode 1010 is raised when the file
  * is not open or the attribute is invalid for the file being
  * queried.
  *
  * @param {ANY<FILE>} x File reference.
  * @param {ANY<CHARACTER>} c Character string that holds the
  *   attribute to be queried.
  * @returns {FIXED BINARY} A FIXED BIN(31) value that holds the
  *   value 1 if the attribute \`c\` applies to file \`x\`.
  *   Otherwise, a value of 0 is returned.
  */
 FILEDDTEST: PROC (x, c) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
    DCL c ANY<CHARACTER>;
 END;
 /**
  * FILEDDWORD returns a character string that is the value of
  * the attribute \`c\` for the file \`x\`.
  *
  * When using FILEDDWORD, the following options are valid for
  * \`c\`:
  *
  * | ACCESS AMTHD ACTION CHARSET DSORG FILENAME | ORGANIZATION
  * PUTPAGE RECFM SHARE TYPE TYPEF |
  * | --- | --- |
  *
  * These options return the following values:
  *
  * - ACCESS returns SEQUENTIAL or DIRECT.
  * - ACTION returns INPUT, OUTPUT, or UPDATE.
  * - AMTHD returns VSAM KSDS, VSAM ESDS or VSAM RRDS on the z/OS
  * platform and FILESYS, DDM, BTRIEVE or ISAM on the Windows or AIX
  * platforms.
  * - CHARSET returns ASCII or EBCDIC.
  * - DSORG returns the data set organization of the file reference.
  * This option is only valid on the z/OS platform. Currently the
  * following data set organizations are available:
  *   - PS (Physical sequential data set)
  *   - PSU (Physical sequential data set that contains
  *   location-dependent information)
  *   - DA (Direct access data set)
  *   - DAU (Direct access data set that contains location-dependent
  *   information)
  *   - PO (Partitioned data set (PDS or PDSE))
  *   - POU (Partitioned data set (PDS) that contains
  *   location-dependent information)
  *   - GS (Graphic data control block)
  *   - zFS (UNIX system file)
  *   - VSAM (Virtual Storage Access Method data set) If the file
  *   organization is not supported, the FILEDDWORD for DSORG will
  *   return a blank value.
  * - On the z/OS platform, FILENAME returns the fully qualified
  * path name for zFS files and the MVS data set name for all other
  * files except it returns the value 'NULLFILE' for files specified
  * with either DSN=NULLFILE and DD DUMMY. For a MVS data set that
  * is a member of a PDS or PDSE, the name returned includes the
  * member name. On the Windows and AIX platforms, it returns the
  * fully qualified path name of the file .
  * - ORGANIZATION returns CONSECUTIVE, RELATIVE, REGIONAL(1) or
  * INDEXED.
  * - RECFM returns the appropriate record format setting for the
  * file, and U for VSAM files. This option is only valid on z/OS.
  * - SHARE returns NONE, READ or ALL.
  * - TYPE returns RECORD or STREAM.
  * - TYPEF returns the type of the native file.
  *
  * The ERROR condition with oncode 1010 is raised when the file is
  * not open or the attribute is invalid for the file being queried.
  *
  * @param {ANY<FILE>} x File reference.
  * @param {ANY<CHARACTER>} c Character string that holds the
  *   attribute to be queried.
  * @returns {CHARACTER} A character string that is the value of
  *   the attribute \`c\` for the file \`x\`.
  */
 FILEDDWORD: PROC (x, c) RETURNS (CHARACTER);
    DCL x ANY<FILE>;
    DCL c ANY<CHARACTER>;
 END;
 /**
  * FILEID returns a size_t 1 value that is the system token for
  * a PL/I file constant or variable.
  *
  * This token should not be used for any purpose that could be
  * accomplished by a PL/I statement.
  *
  * On z/OS, the token holds the address of the DCB associated
  * with a RECORD or STREAM file or of the ACB associated with a
  * VSAM RECORD file. The token is not valid for other files.
  *
  * Note: The DCB or ACB address is provided so that applications
  * can read the DCB or ACB. The DCB and ACB must not be altered.
  *
  * The ERROR condition with oncode 1010 is raised when the file
  * is not open.
  *
  * @param {ANY<FILE>} x File reference
  * @returns {FIXED BINARY} A size_t 1 value that is the system
  *   token for a PL/I file constant or variable.
  */
 FILEID: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
 END;
 /**
  * FILENEW returns a FILE variable that points to a new file
  * constant in automatic storage.
  *
  * The new file variable has default file attributes unless an
  * argument is specified. If x has been specified, the attributes
  * in the declaration of that file are used. The new file remains
  * valid and usable only until the termination of the block in
  * which the FILENEW function is invoked.
  *
  * @param {ANY<FILE>} [x] Restricted expression. x must be a
  *   file constant or an initialized file variable.
  * @returns {ANY<FILE>} A FILE variable that points to a new
  *   file constant in automatic storage.
  */
 FILENEW: PROC (x) RETURNS (ANY<FILE>);
    DCL x ANY<FILE> OPTIONAL;
 END;
 /**
  * FILEOPEN returns '1'B if the file \`x\` is open and '0'B if
  * the file is not open.
  *
  * @param {ANY<FILE>} x File reference.
  * @returns {BIT} '1'B if the file \`x\` is open and '0'B if the
  *   file is not open.
  */
 FILEOPEN: PROC (x) RETURNS (BIT);
    DCL x ANY<FILE>;
 END;
 /**
  * FILEREAD attempts to read \`z\` storage units (bytes) from
  * file \`x\` into location \`y\`. It returns the number of
  * storage units actually read.
  *
  * FILEREAD can read only zFS TYPE(U) files.
  *
  * @param {ANY<FILE>} x File reference
  * @param {ANY<LOCATOR>} y Expression with type POINTER or
  *   OFFSET. If the type is OFFSET, the expression must be an
  *   OFFSET variable declared with the AREA attribute.
  * @param {ANY<NUMBER>} z Expression. It must have a
  *   computational type and is converted to type size_t.1
  * @returns {FIXED BINARY} The number of storage units actually
  *   read.
  */
 FILEREAD: PROC (x, y, z) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * FILESEEK changes the current file position associated with
  * file x to a new location within the file. The next operation
  * on the file takes place at the new location. FILESEEK is
  * equivalent to the fseek function in C.
  *
  * FILESEEK returns a FIXED BIN(31) value. The value is 0 if
  * the change in file position is successful; it is nonzero
  * otherwise.
  *
  * FILESEEK can be used only on zFS TYPE(U) files.
  *
  * @param {ANY<FILE>} x File reference.
  * @param {ANY<NUMBER>} y A size_t value that indicates the
  *   number of positions the file pointer is to be moved
  *   relative to \`z\`.
  * @param {ANY<NUMBER>} z A FIXED BINARY(31) value that
  *   indicates the origin from which the file pointer is to be
  *   moved. The following values are valid:
  *
  *   **-1**: Beginning of the file
  *   **0**: Current position of the file pointer
  *   **1**: End of the file
  * @returns {FIXED BINARY} A FIXED BIN(31) value. The value is
  *   0 if the change in file position is successful; it is
  *   nonzero otherwise.
  */
 FILESEEK: PROC (x, y, z) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
    DCL y ANY<NUMBER>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * FILETELL returns a size_t 1 value that indicates the current
  * position of the file x. The return value is an offset
  * relative to the beginning of the file. FILETELL is equivalent
  * to the ftell function in C.
  *
  * FILETELL can be used only on zFS TYPE(U) files.
  *
  * @param {ANY<FILE>} x File reference
  * @returns {FIXED BINARY} A size_t 1 value that indicates the
  *   current position of the file x.
  */
 FILETELL: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
 END;
 /**
  * FILEWRITE attempts to write \`z\` storage units (bytes) to
  * file \`x\` from location \`y\` It returns the number of
  * storage units actually written.
  *
  * FILEWRITE can write only to zFS TYPE(U) files.
  *
  * @param {ANY<FILE>} x File reference.
  * @param {ANY<LOCATOR>} y Expression with type POINTER or
  *   OFFSET. If the type is OFFSET, the expression must be an
  *   OFFSET variable declared with the AREA attribute.
  * @param {ANY<NUMBER>} z Expression. It must have a
  *   computational type and is converted to type size_t.1
  * @returns {FIXED BINARY} The number of storage units actually
  *   written.
  */
 FILEWRITE: PROC (x, y, z) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * LINENO returns an unscaled REAL FIXED BINARY specifying the
  * current line number of \`x\`.
  *
  * The file must be open and have the PRINT attribute. If the
  * file is not open or does not have the PRINT attribute, 0 is
  * returned.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * @param {ANY<FILE>} x File-reference.
  * @returns {FIXED BINARY} An unscaled REAL FIXED BINARY
  *   specifying the current line number of \`x\`.
  */
 LINENO: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
 END;
 /**
  * ONSUBCODE returns a FIXED BINARY(31,0) value that gives more
  * information about an I/O, JSON, or conversion error that
  * occurred.
  *
  * For an I/O error, ONSUBCODE corresponds to the SUBCODE1
  * values documented for messages IBM0236I and IBM0265I. The
  * SUBCODE1 values are defined in Messages and Codes.
  *
  * For JSON built-in functions, when the ERROR condition is
  * raised, ONSUBCODE returns the index of the invalid character.
  *
  * If a JSON or Unicode CONVERSION condition is raised,
  * ONSUBCODE returns the index of the invalid character.
  * @returns {FIXED BINARY} A FIXED BINARY(31,0) value that gives
  *   more information about an I/O, JSON, or conversion error
  *   that occurred.
  */
 ONSUBCODE: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONSUBCODE2 returns a FIXED BIN(31) value that gives more
  * information about an I/O error that has occurred.
  *
  * ONSUBCODE2 corresponds to the SUBCODE2 values documented for
  * messages IBM0236I and IBM0265I. These SUBCODE2 values are
  * defined in Messages and Codes.
  *
  * A SUBCODE2 value consists of eight hexadecimal digits
  * xxxxyyyy, where xxxx is Register 15 and yyyy is the reason
  * code. The return and reason codes are documented in VSAM
  * Macro Instructions.
  * @returns {FIXED BINARY} A FIXED BIN(31) value that gives more
  *   information about an I/O error that has occurred.
  */
 ONSUBCODE2: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * PAGENO returns an unscaled REAL FIXED BIN(31) value that is
  * the current page number associated with file \`x\`.
  *
  * If the file is not a PRINT file, the ERROR condition is
  * raised.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * @param {ANY<FILE>} x File reference. The file must be open
  *   and have the PRINT attribute.
  * @returns {FIXED BINARY} An unscaled REAL FIXED BIN(31) value
  *   that is the current page number associated with file \`x\`.
  */
 PAGENO: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<FILE>;
 END;
 /**
  * SAMEKEY returns a bit string of length 1 indicating whether
  * a record that has been accessed is followed by another with
  * the same key.
  *
  * Upon successful completion of an input/output operation on
  * file \`x\`, or immediately before the RECORD condition is
  * raised, the value accessed by SAMEKEY is set to '1'B if the
  * record processed is followed by another record with the same
  * key, and set to '0'B if it is not.
  *
  * The value accessed by SAMEKEY is also set to '0'B if:
  *
  * - An input/output operation that raises a condition other
  * than RECORD also causes file positioning to be changed or
  * lost
  * - The file is not open
  * - No current cursor position exists in the file.
  *
  * @param {ANY<FILE>} x File reference. The file must have the
  *   RECORD attribute.
  * @returns {BIT} A bit string of length 1 indicating whether a
  *   record that has been accessed is followed by another with
  *   the same key.
  */
 SAMEKEY: PROC (x) RETURNS (BIT);
    DCL x ANY<FILE>;
 END;

 /* Integer manipulation built-in functions */
 IAND: PROC (value) RETURNS (); END;
 ICLZ: PROC (value) RETURNS (); END;
 IEOR: PROC (value) RETURNS (); END;
 INOT: PROC (value) RETURNS (); END;
 IOR: PROC (value) RETURNS (); END;
 ISIGNED: PROC (value) RETURNS (); END;
 ISLL: PROC (value) RETURNS (); END;
 ISRL: PROC (value) RETURNS (); END;
 IUNSIGNED: PROC (value) RETURNS (); END;
 LOWER2: PROC (value) RETURNS (); END;
 RAISE2: PROC (value) RETURNS (); END;

 /* JSON built-in functions */
 JSONGETARRAYEND: PROC (value) RETURNS (); END;
 JSONGETARRAYSTART: PROC (value) RETURNS (); END;
 JSONGETCOLON: PROC (value) RETURNS (); END;
 JSONGETCOMMA: PROC (value) RETURNS (); END;
 JSONGETMEMBER: PROC (value) RETURNS (); END;
 JSONGETOBJECTEND: PROC (value) RETURNS (); END;
 JSONGETOBJECTSTART: PROC (value) RETURNS (); END;
 JSONGETVALUE: PROC (value) RETURNS (); END;
 JSONPUTARRAYEND: PROC (value) RETURNS (); END;
 JSONPUTARRAYSTART: PROC (value) RETURNS (); END;
 JSONPUTCOLON: PROC (value) RETURNS (); END;
 JSONPUTCOMMA: PROC (value) RETURNS (); END;
 JSONPUTMEMBER: PROC (value) RETURNS (); END;
 JSONPUTOBJECTEND: PROC (value) RETURNS (); END;
 JSONPUTOBJECTSTART: PROC (value) RETURNS (); END;
 JSONPUTVALUE: PROC (value) RETURNS (); END;
 JSONVALID: PROC (value) RETURNS (); END;

 /* Mathematical built-in functions */
 ACOS: PROC (value) RETURNS (); END;
 ASIN: PROC (value) RETURNS (); END;
 ATAN: PROC (value) RETURNS (); END;
 ATAND: PROC (value) RETURNS (); END;
 ATANH: PROC (value) RETURNS (); END;
 COS: PROC (value) RETURNS (); END;
 COSD: PROC (value) RETURNS (); END;
 COSH: PROC (value) RETURNS (); END;
 ERF: PROC (value) RETURNS (); END;
 ERFC: PROC (value) RETURNS (); END;
 EXP: PROC (value) RETURNS (); END;
 GAMMA: PROC (value) RETURNS (); END;
 LOG: PROC (value) RETURNS (); END;
 LOG10: PROC (value) RETURNS (); END;
 LOG2: PROC (value) RETURNS (); END;
 LOGGAMMA: PROC (value) RETURNS (); END;
 SIN: PROC (value) RETURNS (); END;
 SIND: PROC (value) RETURNS (); END;
 SINH: PROC (value) RETURNS (); END;
 SQRT: PROC (value) RETURNS (); END;
 SQRTF: PROC (value) RETURNS (); END;
 TAN: PROC (value) RETURNS (); END;
 TAND: PROC (value) RETURNS (); END;
 TANH: PROC (value) RETURNS (); END;

 /* Miscellaneous built-in functions */
 ALLCOMPARE: PROC (value) RETURNS (); END;
 BETWEEN: PROC (value) RETURNS (); END;
 BETWEENEXCLUSIVE: PROC (value) RETURNS (); END;
 BETWEENLEFTEXCLUSIVE: PROC (value) RETURNS (); END;
 BETWEENRIGHTEXCLUSIVE: PROC (value) RETURNS (); END;
 BINSEARCH: PROC (value) RETURNS (); END;
 BINSEARCHX: PROC (value) RETURNS (); END;
 BYTELENGTH: PROC (value) RETURNS (); END;
 CDS: PROC (value) RETURNS (); END;
 // BYTE is a synonym for CHARVAL
 CHARVAL: BYTE: PROC (value) RETURNS (); END;
 CODEPAGE: PROC (value) RETURNS (); END;
 COLLATE: PROC (value) RETURNS (); END;
 CS: PROC (value) RETURNS (); END;
 FOLDEDFULLMATCH: PROC (value) RETURNS (); END;
 FOLDEDSIMPLEMATCH: PROC (value) RETURNS (); END;
 GETENV: PROC (value) RETURNS (); END;
 GETJCLSYMBOL: PROC (value) RETURNS (); END;
 GETSYSINT: PROC (value) RETURNS (); END;
 GETSYSWORD: PROC (value) RETURNS (); END;
 GTCA: PROC (value) RETURNS (); END;
 HEX: PROC (value) RETURNS (); END;
 HEX8: PROC (value) RETURNS (); END;
 IFTHENELSE: PROC (value) RETURNS (); END;
 INDICATORS: PROC (value) RETURNS (); END;
 INLIST: PROC (value) RETURNS (); END;
 ISJCLSYMBOL: PROC (value) RETURNS (); END;
 ISMAIN: PROC (value) RETURNS (); END;
 MAINNAME: PROC (value) RETURNS (); END;
 OMITTED: PROC (value) RETURNS (); END;
 PACKAGENAME: PROC (value) RETURNS (); END;
 PLIRETV: PROC (value) RETURNS (); END;
 POPCNT: PROC (value) RETURNS (); END;
 PRESENT: PROC (value) RETURNS (); END;
 PROCEDURENAME: PROCNAME: PROC (value) RETURNS (); END;
 PUTENV: PROC (value) RETURNS (); END;
 RANK: PROC (value) RETURNS (); END;
 SOURCEFILE: PROC (value) RETURNS (); END;
 SOURCELINE: PROC (value) RETURNS (); END;
 STACKADDR: PROC (value) RETURNS (); END;
 STRING: PROC (value) RETURNS (); END;
 SYSTEM: PROC () RETURNS (); END;
 SYSPARM: PROC () RETURNS (); END;
 THREADID: PROC (value) RETURNS (); END;
 UNHEX: PROC (value) RETURNS (); END;
 UNSPEC: PROC (value) RETURNS (); END;
 UUID: PROC (value) RETURNS (); END;
 UUID4: PROC (value) RETURNS (); END;
 VALID: PROC (value) RETURNS (); END;
 VALIDVALUE: PROC (value) RETURNS (); END;
 WCHARVAL: PROC (value) RETURNS (); END;

 /* Ordinal-handling built-in functions */
 ORDINALNAME: PROC (value) RETURNS (); END;
 ORDINALPRED: PROC (value) RETURNS (); END;
 ORDINALSUCC: PROC (value) RETURNS (); END;

 /* Precision-handling built-in functions */
 ADD: PROC (value) RETURNS (); END;
 BINARY: PROC (value) RETURNS (); END;
 BIN: PROC (value) RETURNS (); END;
 DECIMAL: DEC: PROC (value) RETURNS (); END;
 DIVIDE: PROC (value) RETURNS (); END;
 FIXED: PROC (value) RETURNS (); END;
 FIXEDBIN: PROC (value) RETURNS (); END;
 FIXEDDEC: PROC (value) RETURNS (); END;
 FLOAT: PROC (value) RETURNS (); END;
 FLOATBIN: PROC (value) RETURNS (); END;
 FLOATDEC: PROC (value) RETURNS (); END;
 MULTIPLY: PROC (value) RETURNS (); END;
 PRECVAL: PROC (value) RETURNS (); END;
 PRECISION: PREC: PROC (value) RETURNS (); END;
 SCALEVAL: PROC (value) RETURNS (); END;
 SIGNED: PROC (value) RETURNS (); END;
 SUBTRACT: PROC (value) RETURNS (); END;
 UNSIGNED: PROC (value) RETURNS (); END;

 /* Pseudovariables: THESE ARE ALREADY DEFINED IN OTHER PLACES */
 /* ENTRYADDR: PROC (value) RETURNS (); END;
 IMAG: PROC (value) RETURNS (); END;
 ONCHAR: PROC (value) RETURNS (); END;
 ONGSOURCE: PROC (value) RETURNS (); END;
 ONSOURCE: PROC (value) RETURNS (); END;
 REAL: PROC (value) RETURNS (); END;
 STRING: PROC (value) RETURNS (); END;
 SUBSTR: PROC (value) RETURNS (); END;
 SUBTO: PROC (value) RETURNS (); END;
 ONUCHAR: PROC (value) RETURNS (); END;
 ONUSOURCE: PROC (value) RETURNS (); END;
 ONWCHAR: PROC (value) RETURNS (); END;
 ONWSOURCE: PROC (value) RETURNS (); END;
 TYPE: PROC (value) RETURNS (); END;
 UNSPEC: PROC (value) RETURNS (); END; */

 /* Storage control built-in functions */
 ADDR: PROC (value) RETURNS (); END;
 ADDRDATA: PROC (value) RETURNS (); END;
 ALLOC31: PROC (value) RETURNS (); END;
 ALLOCATE: PROC (value) RETURNS (); END;
 ALLOC: PROC (value) RETURNS (); END;
 ALLOCATION: PROC (value) RETURNS (); END;
 ALLOCN: PROC (value) RETURNS (); END;
 ALLOCNEXT: PROC (value) RETURNS (); END;
 ALLOCSIZE: PROC (value) RETURNS (); END;
 AUTOMATIC: PROC (value) RETURNS (); END;
 AUTO: PROC (value) RETURNS (); END;
 AVAILABLEAREA: PROC (value) RETURNS (); END;
 BINARYVALUE: PROC (value) RETURNS (); END;
 BINVALUE: PROC (value) RETURNS (); END;
 BITLOCATION: PROC (value) RETURNS (); END;
 BITLOC: PROC (value) RETURNS (); END;
 CHECKSTG: PROC (value) RETURNS (); END;
 CURRENTSIZE: PROC (value) RETURNS (); END;
 CURRENTSTORAGE: CSTG:  PROC (value) RETURNS (); END;
 CSTG: PROC (value) RETURNS (); END;
 EMPTY: PROC (value) RETURNS (); END;
 ENTRYADDR: PROC (value) RETURNS (); END;
 HANDLE: PROC (value) RETURNS (); END;
 LOCATION: LOC: PROC (value) RETURNS (); END;
 LOCSTG: PROC (value) RETURNS (); END;
 LOCVAL: PROC (value) RETURNS (); END;
 NULL: PROC (value) RETURNS (); END;
 NULLENTRY: PROC (value) RETURNS (); END;
 OFFSET: PROC (value) RETURNS (); END;
 OFFSETADD: PROC (value) RETURNS (); END;
 OFFSETDIFF: PROC (value) RETURNS (); END;
 OFFSETSUBTRACT: PROC (value) RETURNS (); END;
 OFFSETVALUE: PROC (value) RETURNS (); END;
 POINTER: PTR: PROC (value) RETURNS (); END;
 POINTERADD: PTRADD: PROC (value) RETURNS (); END;
 POINTERDIFF: PTRDIFF: PROC (value) RETURNS (); END;
 POINTERSUBTRACT: PTRSUBTRACT: PROC (value) RETURNS (); END;
 POINTERVALUE: PTRVALUE: PROC (value) RETURNS (); END;
 SIZE: PROC (value) RETURNS (); END;
 STORAGE: STG: PROC (value) RETURNS (); END;
 SYSNULL: PROC (value) RETURNS (); END; 
 TYPE: PROC (value) RETURNS (); END;
 UNALLOCATED: PROC (value) RETURNS (); END;
 VARGLIST: PROC (value) RETURNS (); END;
 VARGSIZE: PROC (value) RETURNS (); END;

 /* String-handling built-in functions */
 BIT: PROC (value) RETURNS (); END;
 BOOL: PROC (value) RETURNS (); END;
 CENTERLEFT: CENTRELEFT: CENTER: PROC (value) RETURNS (); END;
 CENTERRIGHT: CENTRERIGHT:  PROC (value) RETURNS (); END;
 CHARACTER: CHAR: PROC (value) RETURNS (); END;
 CHARGRAPHIC: CHARG: PROC (value) RETURNS (); END;
 COLLAPSE: PROC (value) RETURNS (); END;
 COPY: PROC (value) RETURNS (); END;
 EDIT: PROC (value) RETURNS (); END;
 GRAPHIC: PROC (value) RETURNS (); END;
 HIGH: PROC (value) RETURNS (); END;
 INDEX: PROC (value) RETURNS (); END;
 INDEXR: PROC (value) RETURNS (); END;
 LEFT: PROC (value) RETURNS (); END;
 LENGTH: PROC (value) RETURNS (); END;
 LOW: PROC (value) RETURNS (); END;
 LOWERASCII: PROC (value) RETURNS (); END;
 LOWERCASE: PROC (value) RETURNS (); END;
 LOWERLATIN1: PROC (value) RETURNS (); END;
 MAXLENGTH: PROC (value) RETURNS (); END;
 MPSTR: PROC (value) RETURNS (); END;
 PICSPEC: PROC (value) RETURNS (); END;
 REGEX: PROC (value) RETURNS (); END;
 REPEAT: PROC (value) RETURNS (); END;
 REPLACE: PROC (value) RETURNS (); END;
 REPLACEBY2: PROC (value) RETURNS (); END;
 REVERSE: PROC (value) RETURNS (); END;
 RIGHT: PROC (value) RETURNS (); END;
 SCRUBOUT: PROC (value) RETURNS (); END;
 SEARCH: PROC (value) RETURNS (); END;
 SEARCHR: PROC (value) RETURNS (); END;
 SQUEEZE: PROC (value) RETURNS (); END;
 SUBSTR: PROC (value) RETURNS (); END;
 SUBTO: PROC (value) RETURNS (); END;
 TALLY: PROC (value) RETURNS (); END;
 TRANSLATE: PROC (value) RETURNS (); END;
 TRIM: PROC (value) RETURNS (); END;
 UHIGH: PROC (value) RETURNS (); END;
 ULENGTH: PROC (value) RETURNS (); END;
 ULENGTH8: PROC (value) RETURNS (); END;
 ULENGTH16: PROC (value) RETURNS (); END;
 ULOW: PROC (value) RETURNS (); END;
 UPOS: PROC (value) RETURNS (); END;
 UPPERASCII: PROC (value) RETURNS (); END;
 UPPERCASE: PROC (value) RETURNS (); END;
 UPPERLATIN1: PROC (value) RETURNS (); END;
 USUBSTR: PROC (value) RETURNS (); END;
 USUPPLEMENTARY: PROC (value) RETURNS (); END;
 UTF8: PROC (value) RETURNS (); END;
 UTF8STG: PROC (value) RETURNS (); END;
 UTF8TOCHAR: PROC (value) RETURNS (); END;
 UTF8TOWCHAR: PROC (value) RETURNS (); END;
 UVALID: PROC (value) RETURNS (); END;
 UWIDTH: PROC (value) RETURNS (); END;
 VERIFY: PROC (value) RETURNS (); END;
 VERIFYR: PROC (value) RETURNS (); END;
 WHIGH: PROC (value) RETURNS (); END;
 WIDECHAR: WCHAR: PROC (value) RETURNS (); END;
 WLOW: PROC (value) RETURNS (); END;

 /* Subroutines */
 LOCNEWSPACE: PROC (value) RETURNS (); END;
 LOCNEWVALUE: PROC (value) RETURNS (); END;
 PLIASCII: PROC (value) RETURNS (); END;
 PLIATTN: PROC (value) RETURNS (); END;
 PLICANC: PROC (value) RETURNS (); END;
 PLICKPT: PROC (value) RETURNS (); END;
 PLIDELETE: PROC (value) RETURNS (); END;
 PLIDUMP: PROC (value) RETURNS (); END;
 PLIEBCDIC: PROC (value) RETURNS (); END;
 PLIFILL: PROC (value) RETURNS (); END;
 PLIFREE: PROC (value) RETURNS (); END;
 PLIMOVE: PROC (value) RETURNS (); END;
 PLIOVER: PROC (value) RETURNS (); END;
 PLIPARSE: PROC (value) RETURNS (); END;
 PLIREST: PROC (value) RETURNS (); END;
 PLIRETC: PROC (value) RETURNS (); END;
 PLISAXA: PROC (value) RETURNS (); END;
 PLISAXB: PROC (value) RETURNS (); END;
 PLISAXC: PROC (value) RETURNS (); END;
 PLISAXD: PROC (value) RETURNS (); END;
 PLISRTA: PROC (value) RETURNS (); END;
 PLISRTB: PROC (value) RETURNS (); END;
 PLISRTC: PROC (value) RETURNS (); END;
 PLISRTD: PROC (value) RETURNS (); END;
 PLISTCK: PROC (value) RETURNS (); END;
 PLISTCKE: PROC (value) RETURNS (); END;
 PLISTCKF: PROC (value) RETURNS (); END;
 PLISTCKLOCAL: PROC (value) RETURNS (); END;
 PLISTCKELOCAL: PROC (value) RETURNS (); END;
 PLISTCKP: PROC (value) RETURNS (); END;
 PLISTCKPLOCAL: PROC (value) RETURNS (); END;
 PLISTCKPUTC: PROC (value) RETURNS (); END;
 PLISTCKUTC: PROC (value) RETURNS (); END;
 PLISTCKEUTC: PROC (value) RETURNS (); END;
 PLITRANxy: PROC (value) RETURNS (); END;

 ${KNOWN_BUILTINS}

 define alias __SIGNED_INT signed fixed bin(31,0);
 define alias __UNSIGNED_INT unsigned fixed bin(32,0);
 ` +
  BuiltinsBoolean +
  BuiltinsFiles +
  BuiltinsTypeFunctions;

export const BuiltinsTextDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsUri).toString(),
  "pli",
  0,
  Builtins,
);

export const BuiltinsMacroFile = "builtins-macro.pli";
export const BuiltinsMacroUri = `${BuiltinsUriSchema}:/${BuiltinsMacroFile}`;
export const BuiltinsMacro = ` /* Preprocessor built-ins */
 /**
  * \`COLLATE\` returns a \`CHARACTER\` string of length 256 comprising
  * the 256 possible character values one time each in the collating
  * order.
  * @returns {CHARACTER} string of length 256 comprising the
  *   256 possible character values one time each in the collating 
  *   order
  */
 COLLATE: PROC RETURNS(CHARACTER); END;

 /**
  * \`COMMENT\` converts a \`CHARACTER\` expression into a comment.
  * @param {CHARACTER} text Expression that is to be converted to a
  *   comment. \`text\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @returns {CHARACTER} \`text\` is enclosed with a &#47;* and an 
  *   *&#47; If \`text\` contains &#47;* or *&#47; composite symbols,
  *   they are replaced by &#47;> and <&#47;, respectively.
  */
 COMMENT: PROC(text) RETURNS(CHARACTER);
   DECLARE text CHARACTER;
 END;

 /**
  * \`COMPILEDATE\` returns a \`CHARACTER\` string of length 17
  * containing the date and the time of the compilation.
  * The format of the string returned by \`COMPILEDATE\` is as follows:
  * | Format | Meaning |
  * |--------|---------|
  * | yyyy | current year |
  * | mm | current month |
  * | dd | current day |
  * | hh | current hour |
  * | mm | current minute |
  * | ss | current second |
  * | ttt | current millisecond |
  * 
  * A leading zero in the day of the month field is replaced by a
  * blank; no other leading zeros are suppressed.
  * 
  * If no timing facility is available, the last 8 characters of the
  * returned string are set to 00.00.00.
  * @returns {CHARACTER} string of length 17 containing the date and
  * the time of the compilation.
  */
 COMPILEDATE: PROC RETURNS(CHARACTER); END;

 /**
  * \`COMPILETIME\` returns a \`CHARACTER\` string of length 18
  * containing the date and the time of compilation.
  * 
  * The format of the string returned by \`COMPILETIME\` is as follows:
  * | Format | Meaning |
  * |--------|---------|
  * | DD | Day of the month |
  * | . | Period |
  * | MMM | Month in the form JAN, FEB, MAR, and so on |
  * | . | Period |
  * | YY | Year |
  * | b | Blank |
  * | HH | Hour |
  * | . | Period |
  * | MM | Minute |
  * | . | Period |
  * | SS | Second |
  * 
  * @returns {CHARACTER} string of length 18 containing the date and
  *   the time of compilation.
  */
 COMPILETIME: PROC RETURNS(CHARACTER); END;

 /**
  * \`COPY\` returns a \`CHARACTER\` string consisting of
  * \`n\` concatenated copies of the string \`string\`.
  * @param {CHARACTER} string Expression. \`string\` should have 
  *   \`CHARACTER\` type, and if not, it is converted thereto.
  * @param {FIXED} n Expression that specifies the number of 
  *   repetitions.
  * 
  *   \`n\` should have \`FIXED\` type, and if not, it is converted
  *   thereto.
  * 
  *   \`n\` must be nonnegative.
  * 
  *   If \`n\` is zero, the result is a null string.
  * @returns {CHARACTER} string consisting of \`n\` concatenated copies
  *   of the string \`string\`.
  */
 COPY: PROC(string, n) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE n FIXED;
 END;

 /**
  * \`COUNTER\` returns a \`CHARACTER\` string of length 5 containing a
  * decimal number. The returned number is 00001 for the first
  * invocation, and increments by one on each successive invocation.
  * 
  * If \`COUNTER\` is invoked 99999 times, the next time it is invoked,
  * a diagnostic message is issued and 00000 is returned. The next
  * invocation after that is treated as the first.
  * 
  * The \`COUNTER\` built-in function can be used to generate unique
  * names, or for counting purposes.
  * @returns {CHARACTER} string of length 5 containing a decimal number
  */
 COUNTER: PROC RETURNS(CHARACTER); END;

 /**
  * \`DIMENSION\` returns a \`FIXED\` value specifying current extent
  * of dimension \`d\` of \`array\`.
  * @param {ANY(*)} array Array reference.
  *   \`array\` must not have less than \`d\` dimensions.
  * @param {FIXED} [d] Expression specifying a particular dimension 
  *   of \`array\`.
  * 
  *   \`d\` should have \`FIXED\` type, and if not, it will be
  *   converted thereto.
  * 
  *   \`d\` must be greater than or equal to 1.
  * 
  *   If \`d\` is not supplied, the default is 1.
  * 
  *   \`d\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED} value specifying current extent of dimension
  *   \`d\` of \`array\`.
  */
 DIMENSION: DIM: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`HBOUND\` returns a \`FIXED\` value specifying current upper bound
  * of dimension \`d\` of \`array\`.
  * @param {ANY(*)} array Array reference. \`array\` must not have less
  *   than \`d\` dimensions.
  * @param {FIXED} [d] Expression specifying a particular dimension
  *   of \`array\`.
  * 
  *   \`d\` should have \`FIXED\` type, and if not, it will be
  *   converted thereto.
  * 
  *   \`d\` must be greater than or equal to 1.
  * 
  *   If \`d\` is not supplied, the default is 1.
  * 
  *   \`d\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED} value specifying current upper bound of
  *   dimension \`d\` of \`array\`.
  */
 HBOUND: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`INDEX\` returns a \`FIXED\` value indicating the starting position
  * within \`haystack\` of a substring identical to \`needle\`. You can
  * also specify the location within \`haystack\` where processing
  * begins.
  * 
  * If \`needle\` does not occur in \`haystack\`, or if either
  * \`haystack\` or \`needle\` have zero length, the value zero is
  * returned.
  * 
  * \`offset\` must be greater than \`0\` and no greater than
  * \`1 + LENGTH(\`haystack\`)\`.
  * 
  * If \`\`offset\` = LENGTH(\`haystack\`) + 1\`, the result is zero.
  * @param {CHARACTER} haystack Expression to be searched.
  *   \`haystack\` should have \`CHARACTER\` type, and if not, it will
  *   be converted thereto.
  * @param {CHARACTER} needle Target expression of the search.
  *   \`needle\` should have \`CHARACTER\` type, and if not, it will
  *   be converted thereto.
  * @param {FIXED} [offset] \`offset\` specifies the location within
  *   \`haystack\` at which to begin processing.
  * 
  *   \`offset\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns {FIXED} value indicating the starting position within
  *   \`haystack\` of a substring identical to \`needle\`
  */
 INDEX: PROC(haystack, needle, offset) RETURNS(FIXED);
   DECLARE haystack CHARACTER;
   DECLARE needle CHARACTER;
   DECLARE offset FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`LBOUND\` returns a \`FIXED\` value specifying current lower bound
  * of dimension \`d\` of \`array\`.
  * @param {ANY(*)} array Array reference. \`array\` must not have less
  *   than \`d\` dimensions.
  * @param {FIXED} [d] Expression specifying a particular dimension
  *   of \`array\`.
  * 
  *   \`d\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * 
  *   \`d\` must be greater than or equal to 1.
  * 
  *   If \`d\` is not supplied, the default is 1.
  * 
  *   \`d\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED} value specifying current lower bound of
  *   dimension \`d\` of \`array\`.
  */
 LBOUND: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`LENGTH\` returns a \`FIXED\` value specifying the current length
  * of a given character expression.
  * @param {CHARACTER} string Expression. \`string\` should have
  *   \`CHARACTER\` type, and if not, it will be converted thereto.
  * @returns {FIXED} value specifying the current length of the
  *   character expression
  */
 LENGTH: PROC(string) RETURNS(FIXED);
   DECLARE string CHARACTER;
 END;

 /**
  * \`LOWERCASE\` returns a character string with all characters
  * converted to their lowercase equivalent.
  * 
  * \`LOWERCASE(string)\` is equivalent to
  * \`TRANSLATE(string, 'a...z', 'A...Z')\` and
  * \`LOWERCASE(string, codes)\` is equivalent to
  * \`TRANSLATE(string, lowerc, upperc)\`.
  * 
  * The values of \`lowerc\` and \`upperc\` are determined by the value
  * of the code page \`codes\`.
  * 
  * Specifying \`LOWERCASE(string, codes)\` will not only translate
  * alphabetic characters 'A...Z' to 'a...z', but also translate
  * characters such as uppercase Ä-umlaut('4a'x) to
  * lowercase ä-umlaut('c0'x).
  * @param {CHARACTER} string Expression. \`string\` should have
  *   \`CHARACTER\` type, and if not, it will be converted thereto.
  * @param {FIXED} [codes] Expression. Specifies the code page that
  *   will be lowercased.
  * @returns {CHARACTER} character string with all characters 
  *   converted to their lowercase equivalent
  */
 LOWERCASE: PROC(string, codes) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE codes FIXED OPTIONAL;
 END;

 /**
  * \`MACCOL\` returns a \`FIXED\` value that represents the column
  * where the outermost macro invocation starts in the source text that
  * contains the macro invocation.
  * @returns {FIXED} The value returned is not affected by nested
  *   macro invocations.
  */
 MACCOL: PROC RETURNS(FIXED); END;

 /**
  * \`MACLMAR\` returns a \`FIXED\` value that represents the column
  * number of the left source margin in \`MARGINS\` compiler option.
  * 
  * See the information about the \`MARGINS\` option in the
  * Programming Guide.
  * @returns {FIXED} column number of the left source margin in
  *   \`MARGINS\` compiler option
  */
 MACLMAR: PROC RETURNS(FIXED); END;

 /**
  * \`MACNAME\` returns the name of the preprocessor procedure within
  * which it is invoked.
  * 
  * It is invalid to invoke \`MACNAME\` outside of a preprocessor
  * procedure.
  * @returns {CHARACTER} name of the preprocessor procedure
  */
 MACNAME: PROC RETURNS(CHARACTER); END;

 /**
  * \`MACRMAR\` returns a \`FIXED\` value that represents the column
  * number of the right source margin in \`MARGINS\` compiler option.
  * 
  * See the information about the \`MARGINS\` option in the
  * Programming Guide.
  * @returns {FIXED} column number of the right source margin in
  *   \`MARGINS\` compiler option
  */
 MACRMAR: PROC RETURNS(FIXED); END;

 /**
  * \`MAX\` returns the largest value from a set of two or more
  * expressions.
  * @param {FIXED} value1 First expression. \`value1\` should have
  *   \`FIXED\` type, and if not, it will be converted thereto.
  * @param {FIXED} valueN Second and subsequent expressions.
  *   Each \`valueN\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns {FIXED} largest value from a set of two or more
  *   expressions
  */
 MAX: PROC(value1, valueN) RETURNS(FIXED);
   DECLARE value1 FIXED;
   DECLARE valueN FIXED LIST;
 END;

 /**
  * \`MIN\` returns the smallest value from a set of two or more
  * expressions.
  * @param {FIXED} value1 First expression. \`value1\` should have
  *   \`FIXED\` type, and if not, it will be converted thereto.
  * @param {FIXED} valueN Second and subsequent expressions.
  *   Each \`valueN\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns {FIXED} smallest value from a set of two or
  *   more expressions
  */
 MIN: PROC(value1, valueN) RETURNS(FIXED);
   DECLARE value1 FIXED;
   DECLARE valueN FIXED LIST;
 END;

 /**
  * \`PARMSET\` returns a \`BIT\` value indicating if a specified
  * parameter was set on invocation of the procedure.
  * 
  * The \`PARMSET\` built-in function can be used only within a
  * preprocessor procedure.
  * 
  * \`PARMSET\` returns a bit value of \`'1'B\` if the parameter
  * \`parameter\` was explicitly set by the function reference that
  * invoked the procedure, and a bit value of \`'0'B\` if it was
  * not—that is, if the corresponding argument was omitted from the
  * function reference in a preprocessor expression, or was the null
  * string in a function reference from input text.
  * 
  * \`PARMSET\` can return \`'0'B\`, even if a matching argument does
  * appear in the reference, but the reference is in another
  * preprocessor procedure, as follows:
  * 
  * - If the argument is not itself a parameter of the invoking
  *   procedure, \`PARMSET\` returns the value \`'1'B\`.
  * - If the argument is a parameter of the invoking procedure,
  *   \`PARMSET\` returns the value for the specified parameter when
  *   the invoking procedure was itself invoked.
  * @param {ANY} parameter Must be a parameter of the preprocessor
  *   procedure.
  * @returns {FIXED} bit value indicating if a specified parameter
  *   was set on invocation of the procedure
  */
 PARMSET: PROC(parameter) RETURNS(FIXED);
   DECLARE parameter ANY;
 END;

 /**
  * \`QUOTE\` returns a \`CHARACTER\` string that represents x as a
  * valid quoted string.
  * 
  * If \`string\` contains single quotation marks, each is replaced by
  * two consecutive single quotation marks.
  * @param {CHARACTER} string Expression that is converted to a
  *   quoted string.
  * 
  *   \`string\` should have CHARACTER type, and if not, it is
  *   converted thereto.
  * @returns {CHARACTER} A valid quoted string.
  */
 QUOTE: PROC(string) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
 END;

 /**
  * \`REPEAT\` returns a \`CHARACTER\` string consisting of
  * \`(n + 1)\` concatenated copies of the string \`string\`.
  * @param {CHARACTER} string Expression.
  * 
  *   \`string\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @param {FIXED} n Expression that specifies the number of
  *   repetitions.
  * 
  *   \`n\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * 
  *   \`n\` must be nonnegative.
  * 
  *   If \`n\` is zero, the result is \`string\`
  *   (converted to character as necessary).
  * @returns {CHARACTER} A string consisting of
  *   \`(n + 1)\` concatenated copies of the string \`string\`.
  */
 REPEAT: PROC(string, n) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE n FIXED;
 END;

 /**
  * \`SUBSTR\` returns a substring, specified by \`offset\` and
  * \`length\`, of \`string\`.
  * 
  * \`length\` must be nonnegative, and the values of \`offset\` and
  * \`length\` must be such that the substring lies entirely within
  * the current length of \`string\`.
  * 
  * If \`offset = LENGTH(string)+1\` and \`length = 0\`, the null
  * string is returned.
  * @param {CHARACTER} string Expression specifies the string from
  *   which the substring is extracted.
  * 
  *   \`string\` should have \`CHARACTER\` type, and if not, it is
  *   converted thereto.
  * @param {FIXED} offset Expression that specifies the starting
  *   position of the substring in \`string\`.
  * 
  *   \`offset\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * @param {FIXED} length Expression that specifies the length of the
  *   substring in \`string\`.
  * 
  *   \`length\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * @returns {CHARACTER} substring specified by \`offset\` and
  *   \`length\` of \`string\`
  */
 SUBSTR: PROC(string, offset, length) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE offset FIXED;
   DECLARE length FIXED OPTIONAL;
 END;

 /**
  * \`SYSDIMSIZE\` returns a \`FIXED\` value that indicates the maximum
  * number of bytes that is needed to hold an index for an array
  * permitted under the compiler \`CMPAT\` option.
  * 
  * The possible return values are as follows:
  * - \`4\` under \`CMPAT(V2)\` and \`CMPAT(LE)\`
  * - \`8\` under \`CMPAT(V3)\`
  * @returns {FIXED} value that indicates the maximum number of bytes
  *   that is needed to hold an index for an array permitted under the
  *   compiler \`CMPAT\` option
  */
 SYSDIMSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSOFFSETSIZE\` returns a \`FIXED\` value that indicates the
  * number of bytes needed to hold an \`OFFSET\`.
  * 
  * Currently, \`SYSOFFSETSIZE\` returns 4.
  * @returns {FIXED} value that indicates the number of bytes needed
  *   to hold an \`OFFSET\`
  */
 SYSOFFSETSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSPARM\` returns the \`CHARACTER\` string value of the
  * \`SYSPARM\` compiler option.
  * 
  * The value returned is not translated to uppercase; the exact value
  * as specified in the compiler option is returned. See the
  * information about the \`SYSPARM\` compiler option in the
  * Programming Guide.
  * 
  * \`SYSPARM\` allows information external to the program to be
  * accessed without modifying the source program.
  * @returns {CHARACTER} string value of the \`SYSPARM\`
  *   compiler option
  */
 SYSPARM: PROC RETURNS(CHARACTER); END;

 /**
  * \`SYSPOINTERSIZE\` returns a \`FIXED\` value that indicates the
  * number of bytes needed to hold a \`POINTER\`.
  * 
  * Currently, \`SYSPOINTERSIZE\` returns 4. But under the
  * \`LP(64)\` option, the \`SYSPOINTERSIZE\` returns 8.
  * @returns {FIXED} value that indicates the number of bytes needed
  *   to hold a \`POINTER\`
  */
 SYSPOINTERSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSTEM\` returns a \`CHARACTER\` string that contains the
  * value of the \`SYSTEM\` compiler option that is in effect.
  * 
  * The value returned might contain leading and trailing blanks.
  * You can apply the \`TRIM\` built-in function to that value to make
  * it easier to test.
  * 
  * See the information about the \`SYSTEM\` compiler option in the
  * Programming Guide.
  * @returns {CHARACTER} string value of the \`SYSTEM\` compiler option
  */
 SYSTEM: PROC RETURNS(CHARACTER); END;

 /**
  * \`SYSVERSION\` returns a \`CHARACTER\` string containing the
  * product name as well as the version, release, and
  * modification level.
  * 
  * The result that \`SYSVERSION\` returns is a string of
  * length 22 in one of the following formats. Each string is
  * padded with blanks on the right to make it 22 in length.
  * @returns {CHARACTER} string containing the product name as well 
  *   as the version, release, and modification level
  */
 SYSVERSION: PROC RETURNS(CHARACTER); END;

 /**
  * \`TRANSLATE\` returns a \`CHARACTER\` string of the same length
  * as \`input\`, but with selected characters translated.
  * 
  * \`TRANSLATE\` operates on each character of \`input\` as follows:
  * 
  * If a character in \`input\` is found in \`search\`, the character
  * in \`replacement\` that corresponds to that in \`search\` is copied
  * to the result; otherwise, the character in \`input\` is copied
  * directly to the result. If \`search\` contains duplicates, the
  * leftmost occurrence is used.
  * 
  * \`replacement\` is padded with blanks, or truncated, on the
  * right to match the length of \`search\`.
  * @param {CHARACTER} input Expression to be searched for possible 
  *   translation of its characters.
  * 
  *   \`input\` should have \`CHARACTER\` type, and if not, it is
  *   converted thereto.
  * @param {CHARACTER} replacement Expression containing the
  *   translation values of characters.
  * 
  *   \`replacement\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @param {CHARACTER} [search] Expression containing the characters
  *   that are to be translated. If \`search\` is omitted, the default
  *   is \`COLLATE\`.
  * 
  *   \`search\` should have \`CHARACTER\` type, and if not, it
  *   is converted thereto.
  * @returns {CHARACTER} string of the same length as \`input\`,
  *   but with selected characters translated
  */
 TRANSLATE: PROC(input, replacement, search) RETURNS(CHARACTER);
   DECLARE input CHARACTER;
   DECLARE replacement CHARACTER;
   DECLARE search CHARACTER OPTIONAL;
 END;

 /**
  * \`TRIM\` returns a \`CHARACTER\` string with characters trimmed
  * from one or both ends of an input string.
  * @param {CHARACTER} input is a \`CHARACTER\` string expression
  * @param {CHARACTER} [left] is a \`CHARACTER\` string expression,
  *   that should be trimmed from the left end of \`input\`.
  *   If \`left\` is omitted, the default is a single blank character.
  * @param {CHARACTER} [right] is a \`CHARACTER\` string expression,
  *   that should be trimmed from the right end of \`input\`.
  *   If \`right\` is omitted, the default is a single blank character.
  * @returns {CHARACTER} string with characters trimmed from one or
  *   both ends of an input string
  */
 TRIM: PROC(input, left, right) RETURNS(CHARACTER);
   DECLARE input CHARACTER;
   DECLARE left CHARACTER OPTIONAL INITIAL(' ');
   DECLARE right CHARACTER OPTIONAL INITIAL(' ');
 END;

 /**
  * UPPERCASE returns a character string with all characters converted
  * to their uppercase equivalent.
  * @param {CHARACTER} string Expression. If necessary, \`string\
  *   is converted to character.
  * @param {FIXED} [codes] Expression. Specifies the code page that
  *   will be uppercased.
  * @returns {CHARACTER} character string with all characters
  *   converted to their uppercase equivalent
  */
 UPPERCASE: PROC(string, codes) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE codes FIXED OPTIONAL;
 END;

 /**
  * \`VERIFY\` returns a \`FIXED\` value indicating the position
  * in \`input\` of the leftmost character that is not in \`compare\`.
  * It also allows you to specify the location within \`input\` at
  * which to begin processing.
  * 
  * If all the characters in \`input\` do appear in \`compare\`,
  * a value of zero is returned. If \`input\` is a null string,
  * a value of zero is returned. If \`input\` is not a null string
  * and \`compare\` is a null string, the value of \`offset\` is
  * returned. The default value for \`offset\` is one.
  * 
  * \`offset\` must be greater than \`0\` and no greater
  * than \`1 + LENGTH(input)\`.
  * 
  * If \`offset = LENGTH(input) + 1\`, the result is zero.
  * @param {CHARACTER} input Expression. The string to be searched.
  * @param {CHARACTER} compare Expression. The string containing the
  *   characters to be verified against.
  * @param {FIXED} [offset] Expression. Specifies the position
  *   within \`input\` at which to begin processing.
  * @returns {FIXED} position in \`input\` of the leftmost character
  *   that is not in \`compare\`
  */
 VERIFY: PROC(input, compare, offset) RETURNS(FIXED);
   DECLARE input CHARACTER;
   DECLARE compare CHARACTER;
   DECLARE offset FIXED OPTIONAL;
 END;
`;

export const BuiltinsMacroTextDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsMacroUri).toString(),
  "pli",
  0,
  BuiltinsMacro,
);
