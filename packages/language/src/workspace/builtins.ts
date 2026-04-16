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
   DCL f ANY(ENTRY);
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
    DCL p ANY(LOCATOR);
    DCL m ANY<NUMBER>;
    DCL q ANY(LOCATOR);
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
    DCL p ANY(LOCATOR);
    DCL m ANY<NUMBER>;
    DCL q ANY(LOCATOR);
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
   DCL p ANY(LOCATOR);
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
   DCL p ANY(LOCATOR);
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
   DCL p ANY(LOCATOR);
   DCL n ANY<NUMBER>;
   DCL c ANY;
   DCL q ANY(LOCATOR);
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
    DCL p ANY(LOCATOR);
    DCL m ANY<NUMBER>;
    DCL q ANY(LOCATOR);
    DCL n ANY<NUMBER>;
    DCL z CHARACTER(1) NONVARYING;
    DCL i ANY<NUMBER> OPTIONAL;
 END;

 MEMCU12: PROC (buffer, target) RETURNS ();
 END;

 MEMCU14: PROC (buffer, target) RETURNS ();
 END;

 MEMCU21: PROC (buffer, target) RETURNS ();
 END;

 MEMCU24: PROC (buffer, target) RETURNS ();
 END;

 MEMCU41: PROC (buffer, target) RETURNS ();
 END;

 MEMCU42: PROC (buffer, target) RETURNS ();
 END;

 MEMINDEX: PROC (buffer, value) RETURNS ();
 END;

 MEMREPLACE: PROC (buffer, value, replacement) RETURNS ();
 END;

 MEMSEARCH: PROC (buffer, value) RETURNS ();
 END;

 MEMSEARCHR: PROC (buffer, value) RETURNS ();
 END;

 MEMSQUEEZE: PROC (buffer, target, replacement) RETURNS ();
 END;

 /** 
  * Searches for the first nonoccurrence of any one of the elements of 
  * a string within a buffer. 
  */
 MEMVERIFY: PROC (buffer, value) RETURNS ();
 END;

 MEMVERIFYR: PROC (buffer, value) RETURNS ();
 END;

 WHEREDIFF: PROC (buffer1, buffer2) RETURNS ();
 END;

 WSCOLLAPSE: PROC (buffer, target) RETURNS ();
 END;

 WSCOLLAPSE16: PROC (buffer, target) RETURNS ();
 END;

 WSREPLACE: PROC (buffer, target) RETURNS ();
 END;

 WSREPLACE16: PROC (buffer, target) RETURNS ();
 END;

 XMLCHAR: PROC (buffer) RETURNS ();
 END;

 XMLSCRUB: PROC (buffer) RETURNS ();
 END;

 XMLSCRUB16: PROC (buffer) RETURNS ();
 END;

 XMLUCHAR: PROC (buffer) RETURNS ();
 END;

 /* Condition handling builtins */
 DATAFIELD: PROC () RETURNS ();
 END;
 ONACTUAL: PROC () RETURNS ();
 END;
 ONAREA: PROC () RETURNS ();
 END;
 ONCHAR: PROC () RETURNS ();
 END;
 ONEXPECTED: PROC () RETURNS ();
 END;
 ONCODE: PROC () RETURNS ();
 END;
 ONCONDCOND: PROC () RETURNS ();
 END;
 ONCONDID: PROC () RETURNS ();
 END;
 ONCOUNT: PROC () RETURNS ();
 END;
 ONFILE: PROC () RETURNS ();
 END;
 ONGSOURCE: PROC () RETURNS ();
 END;
 ONHBOUND: PROC () RETURNS ();
 END;
 ONJSONNAME: PROC () RETURNS ();
 END;
 ONKEY: PROC () RETURNS ();
 END;
 ONLBOUND: PROC () RETURNS ();
 END;
 ONLINE: PROC () RETURNS ();
 END;
 ONLOC: PROC () RETURNS ();
 END;
 ONOFFSET: PROC () RETURNS ();
 END;
 ONOPERATOR: PROC () RETURNS ();
 END;
 ONPACKAGE: PROC () RETURNS ();
 END;
 ONPROCEDURE: ONPROC: PROC () RETURNS ();
 END;
 ONSOURCE: PROC () RETURNS ();
 END;
 ONSUBSCRIPT: PROC () RETURNS ();
 END;
 ONTEXT: PROC () RETURNS ();
 END;
 ONUCHAR: PROC () RETURNS ();
 END;
 ONUSOURCE: PROC () RETURNS ();
 END;
 ONWCHAR: PROC () RETURNS ();
 END;
 ONWSOURCE: PROC () RETURNS ();
 END;

 /* Date and time functions */
 DATE: PROC () RETURNS ();
 END;

 DATETIME: PROC () RETURNS ();
 END;

 DAYS: PROC () RETURNS ();
 END;

 DAYSTODATE: PROC (days) RETURNS ();
 END;

 DAYSTOMICROSECS: PROC (days) RETURNS ();
 END;

 DAYSTOSECS: PROC (days) RETURNS ();
 END;

 JULIANTOSMF: PROC (julian) RETURNS ();
 END;

 MAXDATE: PROC () RETURNS ();
 END;

 MICROSECS: PROC () RETURNS ();
 END;

 MICROSECSTODATE: PROC (microsecs) RETURNS ();
 END;

 MICROSECSTODAYS: PROC (microsecs) RETURNS ();
 END;

 MINDATE: PROC () RETURNS ();
 END;

 REPATTERN: PROC () RETURNS ();
 END;

 SECS: PROC () RETURNS ();
 END;

 SECSTODATE: PROC (secs) RETURNS ();
 END;

 SECSTODAYS: PROC (secs) RETURNS ();
 END;

 SMFTOJULIAN: PROC (smf) RETURNS ();
 END;

 STCKETODATE: PROC (stck) RETURNS ();
 END;

 STCKTODATE: PROC (stck) RETURNS ();
 END;

 TIME: PROC () RETURNS ();
 END;

 TIMESTAMP: PROC () RETURNS ();
 END;

 UTCDATETIME: PROC () RETURNS ();
 END;

 UTCMICROSECS: PROC () RETURNS ();
 END;

 UTCSECS: PROC () RETURNS ();
 END;

 VALIDDATE: PROC (date) RETURNS ();
 END;

 WEEKDAY: PROC (date) RETURNS ();
 END;

 Y4DATE: PROC (date) RETURNS ();
 END;

 Y4JULIAN: PROC (julian) RETURNS ();
 END;

 Y4YEAR: PROC (date) RETURNS ();
 END;

 /* Encoding and hashing functions */
 BASE64DECODE: PROC (buffer) RETURNS ();
 END;
 BASE64DECODE8: PROC (buffer) RETURNS ();
 END;
 BASE64DECODE16: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE8: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE16: PROC (buffer) RETURNS ();
 END;
 CHECKSUM: PROC (buffer) RETURNS ();
 END;
 HEXDECODE: PROC (buffer) RETURNS ();
 END;
 HEXDECODE8: PROC (buffer) RETURNS ();
 END;
 SHA1DIGEST: PROC (buffer) RETURNS ();
 END;
 SHA1FINAL: PROC (buffer) RETURNS ();
 END;
 SHA1INIT: PROC (buffer) RETURNS ();
 END;
 SHA1UPDATE: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST224: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST256: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST384: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST512: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL224: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL256: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL384: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL512: PROC (buffer) RETURNS ();
 END;
 SHA2INIT224: PROC (buffer) RETURNS ();
 END;
 SHA2INIT256: PROC (buffer) RETURNS ();
 END;
 SHA2INIT384: PROC (buffer) RETURNS ();
 END;
 SHA2INIT512: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE224: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE256: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE384: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE512: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST224: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST256: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST384: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST512: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL224: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL256: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL384: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL512: PROC (buffer) RETURNS ();
 END;
 SHA3INIT224: PROC (buffer) RETURNS ();
 END;
 SHA3INIT256: PROC (buffer) RETURNS ();
 END;
 SHA3INIT384: PROC (buffer) RETURNS ();
 END;
 SHA3INIT512: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE224: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE256: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE384: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE512: PROC (buffer) RETURNS ();
 END;

 /* Floating point inquiry functions */
 EPSILON: PROC () RETURNS ();
 END;
 HUGE: PROC () RETURNS ();
 END;
 ISFINITE: PROC (value) RETURNS ();
 END;
 ISINF: PROC (value) RETURNS ();
 END;
 ISNAN: PROC (value) RETURNS ();
 END;
 ISNORMAL: PROC (value) RETURNS ();
 END;
 ISZERO: PROC (value) RETURNS ();
 END;
 MAXEXP: PROC () RETURNS ();
 END;
 MINEXP: PROC () RETURNS ();
 END;
 PLACES: PROC (value) RETURNS ();
 END;
 RADIX: PROC (value) RETURNS ();
 END;
 TINY: PROC () RETURNS ();
 END;
 EXPONENT: PROC (value) RETURNS ();
 END;
 PRED: PROC (value) RETURNS ();
 END;
 SCALE: PROC (value, radix) RETURNS ();
 END;
 SUCC: PROC (value) RETURNS ();
 END;

 /* INPUT/OUTPUT functions */
 COUNT: PROC (value) RETURNS (); END;
 ENDFILE: PROC (value) RETURNS (); END;
 FILEDDINT: PROC (value) RETURNS (); END;
 FILEDDTEST: PROC (value) RETURNS (); END;
 FILEDDWORD: PROC (value) RETURNS (); END;
 FILEID: PROC (value) RETURNS (); END;
 FILENEW: PROC (value) RETURNS (); END;
 FILEOPEN: PROC (value) RETURNS (); END;
 FILEREAD: PROC (value) RETURNS (); END;
 FILESEEK: PROC (value) RETURNS (); END;
 FILETELL: PROC (value) RETURNS (); END;
 FILEWRITE: PROC (value) RETURNS (); END;
 LINENO: PROC (value) RETURNS (); END;
 ONSUBCODE: PROC (value) RETURNS (); END;
 ONSUBCODE2: PROC (value) RETURNS (); END;
 PAGENO: PROC (value) RETURNS (); END;
 SAMEKEY: PROC (value) RETURNS (); END;

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
