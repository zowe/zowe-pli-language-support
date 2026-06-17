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
import { BuiltinsUriSchema } from "./builtins-constants";
import { CompilerOptions } from "../preprocessor/compiler-options/options-pli";

export const KNOWN_BUILTINS = "/* Known Builtins */";
export { BuiltinsUriSchema };

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
 /**
  * \`BIND\` converts the pointer \`p\` to a handle for the structure
  * type \`t\`.
  * The \`BIND\` function can be used as a locator for a member of a
  * typed structure.
  * 
  * @param t Name of a structure type
  * @param p Pointer expression
  * @returns a handle for the structure type \`t\`
  */
 BIND: PROC (t, p) RETURNS(ANY);
   DCL t ANY;
   DCL p ANY;
 END;
 /**
  * \`CAST\` converts the expression \`x\` to the type \`t\` using C
  * conversion rules.
  * 
  * These are supported "C types":
  * - \`REAL FIXED BIN(p,0)\`
  * - \`REAL FIXED DEC(p,q)\` where p >= q and q>= 0.
  * - \`NATIVE FLOAT\`
  * - \`ORDINAL\`
  * - \`POINTER\` or \`HANDLE\`
  * - \`LIMITED ENTRY\`
  * 
  * If \`x\` is \`FLOAT\` or \`FIXED DEC\`, \`t\` must be \`FLOAT\`,
  * \`FIXED\` or \`ORDINAL\`, and if \`t\` is \`FLOAT\` or
  * \`FIXED DEC\`, \`x\` must be \`FLOAT\`, \`FIXED\` or \`ORDINAL\`.
  * 
  * Any conversions that are needed follow the ANSI C rules. This
  * means, for instance, that \`SIZE\` will not be raised by \`CAST\`
  * and that if negative values are cast to \`UNSIGNED\`, the result
  * will be a large positive number.
  * 
  * IEEE DFP is not supported by \`CAST\`.
  * 
  * @param t Name of a scalar "C type"
  * @param x A scalar expression also having "C type"
  * @returns the value of x converted to type \`t\`
  */
 CAST: PROC (t, x) RETURNS(ANY);
   DCL t ANY;
   DCL x ANY;
 END;
 /**
  * FIRST returns the first value in the ordinal set t.
  * @param t Name of an ordinal type
  * @returns first value in the ordinal set t
  */
 FIRST: PROC (t) RETURNS (ANY<ORDINAL>);
   DCL t ANY;
 END;
 /**
  * \`LAST\` returns the last value in the ordinal set \`t\`.
  * @param t Name of an ordinal type
  * @returns last value in the ordinal set \`t\`
  */
 LAST: PROC (t) RETURNS (ANY<ORDINAL>);
   DCL t ANY;
 END;
 /**
  * \`NEW\` acquires heap storage for structure type \`t\` and returns a handle
  * to the acquired storage.
  * 
  * \`NEW(:t:)\` is equivalent to \`BIND(: t, ALLOC( SIZE(:t:) ) :)\`.
  * 
  * @param t Name of a structure type
  * @returns a handle to the acquired storage
  */
 NEW: PROC (t) RETURNS(ANY);
   DCL t ANY;
 END;
 /**
  * \`RESPEC\` changes the attributes of the expression \`x\` to the
  * type \`t\` without changing the bit value of the expression.
  * 
  * \`x\` must have the same size as \`t\`, and if either \`x\`
  * or \`t\` is \`UNALIGNED BIT\`, both must be \`UNALIGNED BIT\`
  * (in which case the function is somewhat uninteresting because it
  * would do nothing).
  * 
  * As an example, if \`t\` is a type with the attributes
  * \`LIMITED ENTRY\`, \`RESPEC( t, sysnull() )\` would return a
  * "null" function pointer.
  *
  * @param t Name of a scalar type
  * @param x A scalar expression
  */
 RESPEC: PROC (t, x);
   DCL t ANY;
   DCL x ANY;
 END;
 /**
  * \`SIZE\` returns the amount of storage needed for a variable
  * declared with the type \`t\`.
  * 
  * @param t Name of a structure or union type
  * @returns amount of storage needed for a variable declared with 
  *   the type \`t\`
  */
 SIZE: PROC (t) RETURNS (ANY<NUMBER>);
   DCL t ANY;
 END;
 /**
  * \`VALUE\` type function initializes or assigns to a variable that
  * has the corresponding structure type.
  * 
  * If the \`VALUE\` function is used with a structure type that is
  * partially initialized, uninitialized bytes and bits are set to zero.
  * 
  * The \`VALUE\` function cannot be used with a structure type 
  * containing no elements with the INITIAL attribute.
  * 
  * You can use the \`VALUE\` function with the \`INIT\` form of the 
  * \`INITIAL\` attribute on the elements of a \`DEFINE STRUCTURE\`
  * statement. However, you cannot use \`INIT CALL\` and \`INIT TO\`
  * with the \`VALUE\` function on
  * the elements of a \`DEFINE STRUCTURE\` statement.
  * 
  * The following example shows how to use the \`VALUE\` function:
  * 
  * \`\`\`
  *   define struct
  *     1 b,
  *        2 b1 fixed bin init(17),
  *        2 b2 fixed bin init(19);
  *
  *   define struct
  *     1 c,
  *       2 c1 type b init( value(: b :) ),
  *       2 c2 fixed bin init(23);
  *
  *   dcl x type c static init( value(: c :) );
  *   dcl y type c;
  *
  *   y = value(: c :);  
  * \`\`\`
  * 
  * @param t Name of a typed structure. The \`VALUE\` function returns
  *   an instance of the typed structure \`t\` with its initial values.
  * @returns an instance of the typed structure \`t\` with its
  *   initial values
  */
 VALUE: PROC (t) RETURNS (ANY);
   DCL t ANY;
 END;
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
  * @param value Expression.
  * @returns absolute value of \`value\`
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
  * @param value Real expression.
  * @returns smallest integer value greater than or
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
  * @param x Real expressions.
  *
  *   If \`x\` and \`y\` differ in base, the decimal argument is
  *   converted to binary. If they differ in scale, the fixed-point
  *   argument is converted to floating-point. The result has the
  *   common base and scale.
  * 
  * @param y Real expressions.
  *
  *   If \`x\` and \`y\` differ in base, the decimal argument is
  *   converted to binary. If they differ in scale, the fixed-point
  *   argument is converted to floating-point. The result has the
  *   common base and scale.
  * 
  * @returns complex value \`x\` + \`y\` * \`i\`
  */
 COMPLEX: CPLX:  PROC (x, y) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
   DECLARE y ANY<NUMBER>;
 END;

 /**
  * CONJG returns the conjugate of \`x\`, that is, the value of the
  * expression with the sign of the imaginary part reversed.
  *
  * @param x Expression.
  *
  *   If \`x\` is real, it is converted to complex. The result has
  *   the base, scale, mode, and precision of \`x\`.
  * 
  * @returns conjugate of \`x\`
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
  * @param x Real expression.
  * 
  * @returns largest integer value less than or equal to
  * \`x\`
  */
 FLOOR: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER>;
 END;

 /**
  * IMAG returns the imaginary part of \`x\`. The mode of the result
  * is real and has the base, scale, and precision of \`x\`.
  *
  * @param x Expression. If \`x\` is real, it is
  *   converted to complex, and an appropriate zero value is returned.
  * 
  * @returns imaginary part of \`x\`
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
  * @param x Expression.
  * @param y Expression.
  * @returns largest value from a set of two or more
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
  * @param x An expression. \`x\` must have the REAL
  *   attribute.
  * @returns maximum value that its numeric operand could
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
  * @param x Expression.
  * @param y Expression.
  * @returns smallest value from a set of one or more
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
  * @param x An expression. \`x\` must have the REAL
  *   attribute.
  * @returns minimum value that its numeric operand could
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
  * @param x Real expression.
  * @param y Real expression. If \`y\` = 0,
  *   the ZERODIVIDE condition is raised.
  * @returns modular equivalent of the remainder of one 
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
  * @param [x] Expression. \`x\` must have a computational
  *   type and should have an arithmetic type. If \`x\` is numeric, it
  *   must be real. If \`x\` is not specified FIXED BINARY(31,0), it
  *   is converted.
  *
  *   Unless 0 < \`x\` < 2,147,483,646, the ERROR condition is
  *   raised.
  * @returns random number generated using \`x\` as the
  *   given seed
  */
 RANDOM: PROC (x) RETURNS (ANY<NUMBER>);
   DECLARE x ANY<NUMBER> OPTIONAL;
 END;

 /**
  * REAL returns the real part of \`x\`. The result has the base,
  * scale, and precision of \`x\`.
  *
  * @param x Expression. If \`x\` is real, it is converted
  *   to complex.
  * @returns real part of \`x\`
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
  * @param x Expression. \`x\` must be computational and
  *   can be arithmetic.
  * @param y Expression. \`y\` must be computational and
  *   can be arithmetic.
  * @returns remainder of \`x\` divided by \`y\`
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
  * @param x Real expression. If \`x\` is negative, the
  *   absolute value is rounded and the sign is restored.
  * @param n Optionally-signed integer. It specifies the
  *   digit at which rounding is to occur.
  * @returns value of \`x\` rounded at a digit specified 
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
  * @param x A real expression that is FIXED DECIMAL or 
  *   DFP FLOAT. If \`x\` is negative, the absolute value is rounded and
  *   the sign is restored.
  * @param n An optionally-signed integer that specifies
  *   the digit at which rounding is to occur.
  * @returns value of \`x\` rounded at a digit specified
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
  * @param x A real expression that is FIXED DECIMAL or
  *   DFP FLOAT. If \`x\` is negative, the nearest even value is rounded
  *   and the sign is restored.
  * @param n An optionally-signed integer that specifies
  *   the digit at which rounding is to occur.
  * @returns value of \`x\` rounded at a digit specified
  *   by \`n\` following the rounding rule of round half to even.
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
  * @param x Real expression.
  * @returns unscaled REAL FIXED BINARY value that 
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
  * @param x Real expression.
  * @returns integer value that is the truncated value of
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
  * @param x Computational array expression. If \`x\` is not
  *   a bit string array, then \`x\` is converted to a bit string
  *   array.
  * @returns bit string in which each bit is 1 if the
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
  * @param x Computational array expression. If \`x\` is not
  *   a bit string array, then \`x\` is converted to a bit string
  *   array.
  * @returns bit string in which each bit is 1 if the
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
  * @param x Array reference. \`x\` must not have less than
  *   \`y\` dimensions.
  * @param [y] Expression specifying a particular
  *   dimension of \`x\`. If necessary, \`y\` is converted to a FIXED
  *   BINARY(31,0). \`y\` must be greater than or equal to 1. If
  *   \`y\` is not supplied, it defaults to 1.
  *
  *   \`y\` can be omitted only if the array is one-dimensional.
  * 
  * @returns value that specifies the current
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
  * @param x Array reference. \`x\` must not have less than
  *   \`y\` dimensions.
  * @param [y] Expression specifying a particular
  *   dimension of \`x\`. If necessary, \`y\` is converted to
  *   FIXED BINARY(31,0). \`y\` must be greater than or equal to 1.
  *   If \`y\` is not supplied, it defaults to 1.
  *
  *   \`y\` can be omitted only if the array is one-dimensional.
  * @returns FIXED BINARY value that specifies the
  *  current upper bound of dimension \`y\` of \`x\`
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
  * @param x DIMACROSS reference
  * @returns value that specifies the current upper
  *   bound of a DIMACROSS reference \`x\`
  */
 HBOUNDACROSS: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY(*) DIMACROSS;
 END;

 /**
  * INARRAY returns a BIT(1) value that indicates whether an
  * expression is equal to any of the elements of an array.
  *
  * @param x Scalar expression. x must have a type that is
  *   comparable with the type of the elements of y.
  * @param y Array expression.
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
  * @returns value that indicates whether an expression is
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
  * @param x Array reference. \`x\` must not have less than
  *   \`y\` dimensions.
  * @param [y] Expression specifying a particular
  *   dimension of \`x\`. If necessary, \`y\` is converted to
  *   FIXED BINARY(31,0).
  *   The value for \`y\` must be greater than or equal to 1. and if
  *   \`y\` is not supplied, it defaults to 1.
  *
  *   The value for \`y\` can be omitted only if the array is
  *   one-dimensional.
  * @returns value that specifies the current
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
  * @param x DIMACROSS reference
  * @returns value that specifies the current lower
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
  * @param x An array expression.
  * @param y An element expression.
  * @returns floating-point value that is an approximation of a
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
  * @param x Array expression. If the elements of \`x\` are
  *   strings, they are converted to fixed-point integer values.
  *
  *   If the elements of \`x\` are not fixed-point integer values or
  *   strings, they are converted to floating-point and the result
  *   is floating-point.
  * @returns product of all the elements in \`x\`
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
  * @param x An array expression. x must be a one-dimensional
  *   array of scalars. If x is an array of NONVARYING BIT, it must
  *   be aligned.
  *
  *   The elements of the array x must satisfy one of the following:
  *
  *   - They must be computational and not COMPLEX
  *   - They must be POINTERs
  *   - They must be HANDLEs
  *   - They must be ORDINALs
  * @param [n] An expression that specifies the index of 
  *   the first array element to be examined. It defaults to LBOUND(x).
  * @param [m] An expression that specifies the number of
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
  * @param x An array expression. x must be a one-dimensional
  *   array. If x is an array of NONVARYING BIT, it must be aligned.
  * @param f Expression. Specifies the function that will
  *   be invoked to perform all the required comparisons.
  * @param [n] An expression that specifies the index of
  *   the first array element to be examined. It defaults to LBOUND(x).
  * @param [m] An expression that specifies the number of
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
  * @param x Array expression. If the elements of \`x\` are
  *   strings, they are converted to fixed-point integer values.
  *
  *   If the elements of \`x\` are fixed-point, the precision of the
  *   result is (\`N,q\`), where N is the maximum number of digits
  *   allowed, and \`q\` is the scaling factor of \`x\`.
  *
  *   If the elements of \`x\` are floating-point, the precision of
  *   the result matches \`x\`.
  * @returns sum of all the elements in \`x\`
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
  * @param x Expression. Both must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param y Expression. Both must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param z Expression. It is converted to size_t 1.
  * @returns value that indicates the relationship
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns value that indicates the number of bytes that
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns value that indicates the number of bytes that
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
  * @param p Restricted expression that must have a 
  *   locator type (POINTER or OFFSET). If \`p\` is OFFSET, it must 
  *   have the AREA attribute.
  * @param n Expression. \`n\` must have a computational
  *   type and is converted to FIXED BINARY(31,0).
  * @param [z] If specified, \`z\` must have
  *   the type CHARACTER(1) NONVARYING.
  * @returns character string that is the hexadecimal
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
  * @param p A restricted expression that must have a
  *   locator type (POINTER or OFFSET). If \`p\` is OFFSET, it must have
  *   the AREA attribute.
  * @param n An expression. \`n\` must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  * @param [z] An expression. If specified,
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param c Target code page.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @param d Source code page.
  * @param [t] A character string or variable that names the
  *   technique to use in the conversion. t is of length 8 or less.
  * @returns value that indicates the number of bytes
  *   that are written to the target buffer.
  */
 MEMCONVERT: PROC (p, n, c, q, m, d, t) RETURNS (ANY<NUMBER>);
   DCL p ANY<LOCATOR>;
   DCL n ANY<NUMBER>;
   DCL c ANY;
   DCL q ANY<LOCATOR>;
   DCL m ANY<NUMBER>;
   DCL d ANY;
   DCL t CHARACTER(8) OPTIONAL;
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t. It must be non-negative.
  * @param z An expression that must have the type
  *   CHARACTER(1) NONVARYING.
  * @param [i] An optional expression that must be
  *   computational and will be converted to size_t as necessary. If
  *   not specified, the default value for i is 1. If i < 1, default
  *   value of 1 is used.
  * @returns value that indicates the number of bytes that
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @returns value that indicates the number of bytes
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @returns value that indicates the number of bytes
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @returns value that indicates the number of bytes
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @returns value that indicates the number of bytes
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @returns value that indicates the number of bytes
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @param q Address of the source buffer.
  * @param m Length of the source buffer.
  * @returns value that indicates the number of bytes
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
  * @param p Address of buffer to be searched.
  * @param n Length of buffer to be searched.
  * @param x String-expression to use as the target of the
  *   search.
  * @param q Address of second buffer to use as the
  *   target of the search.
  * @param m Length of second buffer to use as the target
  *   of the search.
  * 
  * @param xqm
  *   x String-expression to use as the target of the search.
  * 
  *   q Address of second buffer to use as the target of the search.
  * 
  *   m Length of second buffer to use as the target of the search.
  * @returns value that indicates the starting position
  *   within the buffer of a specified substring, or zero if the
  *   substring is not found.
  *
  * @todo TODO has overloads
  */
 MEMINDEX: PROC (p, n, xqm) RETURNS (ANY<NUMBER>);
   DCL p ANY<LOCATOR>;
   DCL n ANY<NUMBER>;
   DCL xqm ANY LIST;
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
  * @param p Specifies the address of the target
  *   buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param q Specifies the address of the source
  *   buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param f Specifies the address of the buffer
  *   containing the bytes that will be replaced.
  * @param x Specifies the length in bytes of the
  *   buffer f. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param t Specifies the address of the buffer
  *   containing the bytes that will be used to replace the bytes of
  *   the buffer f within the buffer p.
  * @param y Specifies the length in bytes of the
  *   buffer t. The length must be non-negative. It must have a
  *   computational type and is converted to the size_t type.
  * @param [s] An optional expression that specifies the
  *   location within the source buffer from where to start
  *   searching for the buffer defined by f and x. It must have a
  *   computational type and is converted to the size_t type. The
  *   default value for s is 1. If s is less than 1 or if s is
  *   greater than 1 + n, zero bytes will be written to the target
  *   buffer.
  * @param [i] An optional expression that specifies the
  *   maximum number of times f should be replaced by t. It must
  *   have a computational type and is converted to the size_t type.
  *   The default value of i is 1. i must be non-negative. If the
  *   value of i is 0, all occurrences of f in source buffer will be
  *   replaced by t.
  * @returns A size_t value that indicates the number
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
  * @param p Address of buffer to be searched
  * @param n Length of buffer to be searched
  * @param x String-expression
  * @returns A size_t value specifying the first
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
  * @param p Address of buffer to be searched
  * @param n Length of buffer to be searched
  * @param x String-expression
  * @returns A size_t value specifying the first
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t. It must be non-negative.
  * @param z An expression that must have the type
  *   CHARACTER(1) NONVARYING.
  * @param [i] An optional expression that must be
  *   computational and will be converted to size_t as necessary. If
  *   not specified, the default value for i is 1. If i < 1, default
  *   value of 1 is used.
  * @returns A size_t value that indicates the number
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
  * @param p Address of buffer to be searched.
  * @param n Length of buffer to be searched.
  * @param x String-expression.
  * @returns A size_t value specifying the position of
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
  * @param p Address of buffer to be searched.
  * @param n Length of buffer to be searched.
  * @param x String-expression.
  * @returns A size_t value specifying the position of
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
  * @param x Expression. It must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param y Expression. It must have the POINTER or
  *   OFFSET type. If OFFSET, the expression must be declared with
  *   the AREA qualification.
  * @param z Expression. It is converted to size_t.
  * @returns A size_t value specifying the index of the
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
  * - Replacing each character from \\t\\f\\v\\n\\r with a blank.
  * - Trimming all leading and trailing blanks.
  * - Reducing multiple interior blanks to one blank.
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value indicating the number of
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
  * - Replacing each character from \\t\\f\\v\\n\\r with a UTF-16 blank.
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 WSCOLLAPSE16: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * WSREPLACE replaces each character from \\t, \\f, \\v, \\n in a
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value indicating the number of
  *   bytes written to the target buffer, or -1 if too small.
  */
 WSREPLACE: PROC (p, m, q, n) RETURNS (ANY<NUMBER>);
    DCL p ANY<LOCATOR>;
    DCL m ANY<NUMBER>;
    DCL q ANY<LOCATOR>;
    DCL n ANY<NUMBER>;
 END;

 /**
  * WSREPLACE16 replaces all characters from \\t, \\f, \\v, \\n in a
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value indicating the number of
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
  * @param x Reference to a structure or DEFINE
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
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @returns A size_t value indicating the number of
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
  * - Replacing each character less than a blank except for \\t, \\n,
  * \\r with a blank.
  * - Replacing carriage returns with .
  * - Replacing the following characters with corresponding strings
  * as follows:
  * 
  * | Characters | Strings |
  * | --- | --- |
  * | " | " |
  * | ' | ' |
  * | &amp; | &amp;amp; |
  * | &lt; | &lt; |
  * | &gt; | &gt; |
  * 
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value indicating the number of
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
  * as follows:
  * 
  * | Characters | Strings |
  * | --- | --- |
  * | " | " |
  * | ' | ' |
  * | &amp; | &amp;amp; |
  * | &lt; | &lt; |
  * | &gt; | &gt; |
  *
  * If the address of the target buffer is zero, the number of bytes
  * to be written is returned. If the target buffer is not large
  * enough, a value of -1 is returned. If the target buffer is large
  * enough, the number of bytes that is written to the buffer is
  * returned.
  *
  * The source buffer must hold UTF-16 data.
  *
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value indicating the number of
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
  * @param x Reference to a structure or DEFINE
  *   STRUCTURE type.
  *
  *   The reference \`x\` must conform to the same rules as XMLCHAR
  *   except that it can contain UCHAR elements.
  * @param p Address of the target buffer.
  * @param n Length of the target buffer.
  * @returns A size_t value indicating the number of
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
  * @returns Contents of the field that raised the
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
  * @returns The "actual" value from the ASSERT
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
  * @returns Name of the AREA reference, or a null
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
  * @returns The character that caused the CONVERSION
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
  * @returns The "expected" value from the ASSERT
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
  * @returns The condition code, or zero if out of
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
  * @returns Name of the raised CONDITION condition,
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
  * @returns Identifier of the condition being
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
  * @returns Number of remaining conditions to handle,
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
  * @returns Name of the file that raised the I/O
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
  * @returns The DBCS character that caused the
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
  * @returns The upper bound of the array that raised
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
  * @returns The unmatched name from the JSON call,
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
  * @returns The key of the record that raised the
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
  * @returns The lower bound of the array that raised
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
  * @returns The line number where the condition was
  *   raised, or zero if out of context.
  */
 ONLINE: PROC () RETURNS (FIXED BINARY);
 END;
 /**
  * ONLOC is a synonym for ONPROC.
  *
  * If ONLOC is used out of context, a null string is returned.
  * @returns The name of the procedure in which the
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
  * @returns The offset from the start of the
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
  * @returns The operator from the ASSERT COMPARE
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
  * @returns Name of the package containing the
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
  * @returns Name of the procedure where the
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
  * @returns Contents of the field being converted
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
  * @returns The invalid array index that caused
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
  * @returns The TEXT clause value from the ASSERT
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
  * @returns The UTF-8 character that caused the
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
  * @returns The UTF-8 field contents when
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
  * @returns The widechar that caused the CONVERSION
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
  * @returns The widechar field contents when
  *   CONVERSION was raised, or a null string if out of context.
  */
 ONWSOURCE: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /* Date and time functions */
 /**
  * DATE returns a nonvarying character(6) string containing the
  * date in the format, YYMMDD.
  * @returns A nonvarying character(6) string containing
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
  * @param [y] Expression
  *
  *   If present, it specifies the date/time pattern in which the
  *   date is returned. If \`y\` is missing, it is assumed to be the
  *   default date/time pattern 'YYYYMMDDHHMISS999'.
  *
  *   See Table 2 for the allowed patterns.
  *
  *   \`y\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @returns A character string timestamp of today's
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
  * @param [d] String expression representing a date. 
  *   If omitted, it is assumed to be the value returned by DATETIME().
  *
  *   The value for \`d\` must have computational type and should
  *   have character type. If not, \`d\` is converted to character.
  * @param [p] One of the supported date/time patterns.
  *   If omitted, it is assumed to be the value 'YYYYMMDDHHMISS999'.
  *
  *   \`p\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @param [w] An integer expression that defines a
  *   century window to be used to handle any two-digit year formats.
  *
  *   - If the value is positive, such as 1950, it is treated as a
  *   year.
  *   - If negative or zero, the value specifies an offset to be
  *   subtracted from the current, system-supplied year.
  *   - If omitted, \`w\` defaults to the value specified in the
  *   WINDOW compile-time option.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param d The number of days (in Lilian format). \`d\`
  *   must have a computational type and is converted to FIXED
  *   BINARY(31,0) if necessary.
  * @param [p] One of the supported date/time patterns.
  *
  *   If omitted, \`p\` is assumed to be the default date/time
  *   pattern 'YYYYMMDDHHMISS999' (same as the default format
  *   returned by DATETIME).
  * @param [w] An integer expression that defines a
  *   century window to be used to handle any two-digit year formats.
  *
  *   - If the value is positive, such as 1950, it is treated as a
  *   year.
  *   - If negative or zero, the value specifies an offset to be
  *   subtracted from the current, system-supplied year.
  *   - If omitted, \`w\` defaults to the value specified in the
  *   WINDOW compile-time option.
  * @returns A nonvarying character string containing
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
  * @param x An expression that specifies the number of
  *   days.
  *
  *   \`x\` must have a computational type and will be converted to
  *   FIXED BINARY(31) if necessary.
  * @returns A FIXED BINARY(63) value that is the
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
  * @param x An expression that specifies the number of
  *   days.
  *
  *   \`x\` must have a computational type and is converted to FIXED
  *   BINARY(31,0) if necessary.
  * @returns A FLOAT BINARY(53) value that is the
  *   number of seconds corresponding to x days.
  */
 DAYSTOSECS: PROC (x) RETURNS (FLOAT BINARY);
    DCL x ANY<NUMBER>;
 END;

 /**
  * JULIANTOSMF returns a CHAR(4) value that holds a date in the SMF
  * format.
  *
  * @param d A CHAR(7) variable that holds a date in the
  *   Julian format YYYYDDD
  * @returns A CHAR(4) value that holds the date in SMF
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
  * @param p Specifies one of the supported date/time
  *   patterns.
  * @returns A character string containing the latest
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
  * @param [d] Specifies a string expression
  *   representing a date. If present, \`d\` specifies the input date
  *   as a character string representing the date/time specified in
  *   the pattern \`p\`. If \`d\` is omitted, it is assumed to be the
  *   value returned by TIMESTAMP().
  *
  *   \`d\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param [p] Specifies one of the supported date/time
  *   patterns. If \`p\` is omitted, it is assumed to be the
  *   TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  *
  *   \`p\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns A FIXED BINARY(63) value that is the
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
  * @param m Specifies the number of microseconds (in
  *   Lilian format). \`m\` must have a computational type and is
  *   converted to FIXED BIN(63) if necessary.
  * @param [p] Specifies one of the supported date/time
  *   patterns. If \`p\` is omitted, it is assumed to be the
  *   TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns A NONVARYING character string
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
  * @param x An expression that specifies the number of
  *   microseconds. The value for \`x\` must have computational type
  *   and will be converted to FIXED BINARY(63) if necessary.
  * @returns A FIXED BINARY(31) value that represents
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
  * @param p Specifies one of the supported date/time
  *   patterns.
  * @returns A character string containing the
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
  * @param d A string expression representing a
  *   date. The length of \`d\` must be at least as large as the
  *   length of the source pattern \`q\`. If \`d\` is larger, any
  *   excess characters must be formed by leading blanks.
  *
  *   \`d\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param p The target pattern; must be one of the
  *   supported date/time patterns.
  * @param [q] The source pattern; must be one
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
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * 
  * @param pqw
  *   p The target pattern; must be one of the
  *   supported date/time patterns.
  * 
  *   q The source pattern; must be one
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
  * 
  *   w Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns The value converted to a date in a
  *   second pattern.
  * @todo TODO has overloads
  */
 REPATTERN: PROC (d, pqw) RETURNS (ANY<CHARACTER>);
    DCL d ANY<CHARACTER>;
    DCL pqw ANY LIST;
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
  * @param [d] A string expression representing a
  *   date. If present, \`d\` specifies the input date as a character
  *   string representing the date/time specified in the pattern
  *   \`p\`. If \`d\` is missing, it is assumed to be DATETIME().
  *
  *   \`d\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param [p] One of the supported date/time
  *   patterns. If \`p\` is omitted, it is assumed to be the default
  *   date/time pattern 'YYYYMMDDHHMISS999'.
  *
  *   \`p\` must have a computational type and should have character
  *   type. If not, it is converted to character.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns A FLOAT BINARY(53) value that is the
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
  * @param d The number of seconds (in Lilian format).
  *   \`d\` must have a computational type and is converted to FLOAT
  *   BIN(53) if necessary.
  * @param [p] One of the supported date/time
  *   patterns. If omitted, \`p\` is assumed to be the default
  *   date/time pattern 'YYYYMMDDHHMISS999' (the default format
  *   returned by DATETIME).
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns A nonvarying character string
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
  * @param x Expression. The value for \`x\` must have
  *   computational type and should be FLOAT BINARY(53). If not, it
  *   is converted to FLOAT BINARY(53).
  * @returns A FIXED BINARY(31,0) value that
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
  * @param d A CHAR(4) variable that holds a date
  *   in the SMF format.
  * @returns A CHAR(7) value that holds the date in
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
  * @param x A CHAR(16) value holding a STCKE
  *   value.
  * @param [p] Specifies one of the supported
  *   date/time patterns. If \`p\` is omitted, it is assumed to be
  *   the TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  * @returns A character string that contains a
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
  * @param x An UNSIGNED FIXED BIN(64) value holding
  *   a STCK value.
  * @param [p] Specifies one of the supported
  *   date/time patterns. If \`p\` is omitted, it is assumed to be
  *   the TIMESTAMP pattern, namely 'YYYY-MM-DD-HH.MI.SS.999999'.
  * @returns A character string that contains a
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
  * @returns A character string timestamp in the
  *   format HHMISS999.
  */
 TIME: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /**
  * TIMESTAMP returns a CHAR(26) character string that gives the
  * current date and time in the format YYYY-MM-DD-HH.MI.SS.999999.
  * @returns A CHAR(26) character string that gives
  *   the current date and time in the format
  *   YYYY-MM-DD-HH.MI.SS.999999.
  */
 TIMESTAMP: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /**
  * UTCDATETIME returns a character string that gives the current
  * Coordinated Universal Time (UTC) in the pattern
  * YYYYMMDDHHMISS999.
  * @returns A character string that gives the
  *   current Coordinated Universal Time (UTC) in the pattern
  *   YYYYMMDDHHMISS999.
  */
 UTCDATETIME: PROC () RETURNS (ANY<CHARACTER>);
 END;

 /**
  * UTCMICROSECS returns a FIXED BINARY(63) value that gives the
  * current UTC time in microseconds.
  * @returns A FIXED BINARY(63) value that gives the
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
  * @returns A FLOAT BIN(53) value that gives the
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
  * @param d A string expression representing a date.
  *
  *   \`d\` specifies the input date as a character string
  *   representing date/time according to the pattern \`p\`.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, \`d\` is converted to character.
  * @param [p] One of the supported date/time patterns.
  *
  *   If present, it specifies the date/time pattern of \`d\`. If
  *   \`p\` is missing, it is assumed to be the default date/time
  *   pattern of 'YYYYMMDDHHMISS999'.
  *
  *   \`p\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns '1'B if the string d holds a date/time value
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
  * @param [x] Expression. If present, \`x\` specifies
  *   the input date as days. If missing, \`x\` is assumed to be
  *   DAYS().
  *
  *   If \`x\` is missing and today's date is not available from the
  *   system, a result of zero is returned.
  *
  *   \`x\` must have computational type and will be converted to
  *   FIXED BINARY(31,0), if necessary.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param d A string expression representing a date.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, \`d\` is converted to character.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns The date value with the two-digit year
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
  * @param d A string expression representing a date.
  *   The length of \`d\` must be at least 5. If it is larger than 5,
  *   excess characters must be formed by leading blanks.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, it is converted to character.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns The date value with the two-digit year
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
  * @param d A string expression representing a date.
  *   The length of \`d\` must be at least 2. If it is larger than 2,
  *   excess characters must be formed by leading blanks.
  *
  *   \`d\` must have computational type and should have character
  *   type. If not, \`d\` is converted to character.
  * @param [w] Specifies an expression (such as 1950)
  *   that can be converted to an integer. If negative, it specifies
  *   an offset to be subtracted from the value of the year when the
  *   code runs. If omitted, \`w\` defaults to the value specified
  *   in the WINDOW compile-time option.
  * @returns The date value with the two-digit year
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.1
  * @returns An UNSIGNED FIXED BIN(32) value that is
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param p Specifies the address of the target buffer.
  * @param m Specifies the length in bytes of the target
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @param q Specifies the address of the source buffer.
  * @param n Specifies the length in bytes of the source
  *   buffer. It must have a computational type and is converted to
  *   type size_t.
  * @returns A size_t value that indicates the number
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR(20) string with the SHA-1 hash
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
  * @param t A token returned by a previous invocation
  *   of SHA1INIT or SHA1UPDATE.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR(20) string with the SHA-1 hash
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
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA1INIT or SHA1UPDATE.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-2 hash value.
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
  * @returns A token (of type POINTER) that can be
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
  * @returns A token (of type POINTER) that can be
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
  * @returns A token (of type POINTER) that can be
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
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA2INITx or SHA2UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be hashed.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  *
  *   The length returned is one eighth of the bit length in the
  *   function name, so, for example, SHA3FINAL256 returns a
  *   CHAR(32) value.
  *
  *   These functions generate code that executes the KIMD and KLMD
  *   assembler instructions.
  * @returns A CHAR string with the SHA-3 hash value.
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
  * @returns A token (of type POINTER) that can be
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
  * @returns A token (of type POINTER) that can be
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
  * @returns A token (of type POINTER) that can be
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
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param t A token returned by a previous invocation
  *   of SHA3INITx or SHA3UPDATEx.
  * @param \`p\` A pointer that specifies the address
  *   of a buffer to be added to the hash.
  * @param \`n\` An expression that specifies the length
  *   (in bytes) of that buffer. It must have a computational type
  *   and will be converted to type size_t.
  * @returns A token (of type POINTER) that can be
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
  * @param x REAL FLOAT expression.
  * @returns A floating-point value that is the spacing
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
  * @param x Expression. \`x\` must have the attributes
  *   REAL FLOAT.
  * @returns A floating-point value that is the largest
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
  * @param x REAL FLOAT DECIMAL expression.
  * @returns '1'B if the argument is not a NAN and not
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
  * @param x REAL FLOAT DECIMAL expression.
  * @returns '1'B if the argument is an infinity; '0'B
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
  * @param x REAL FLOAT DECIMAL expression.
  * @returns '1'B if the argument is a NAN; '0'B otherwise.
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
  * @param x REAL FLOAT DECIMAL expression.
  * @returns '1'B if the argument is not a zero, subnormal,
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
  * @param x REAL FLOAT DECIMAL expression.
  * @returns '1'B if the argument is a zero; '0'B otherwise.
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
  * @param x Expression. \`x\` must have the REAL and
  *   FLOAT attributes.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param x Expression. \`x\` must have the REAL and
  *   FLOAT attributes.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param x Expression. \`x\` must be declared REAL
  *   FLOAT.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param x REAL FLOAT expression.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param x REAL FLOAT expression.
  * @returns A floating-point value that is the
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
  * @param x Expression. \`x\` must be declared as REAL
  *   FLOAT.
  * @returns A FIXED BINARY(31,0) value that is the
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
  * @param x REAL FLOAT expression.
  * @returns A floating-point value that is the biggest
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
  * @param x REAL FLOAT expression.
  * @param n Expression. It must have a computational
  *   type and is converted to FIXED BINARY(31,0).
  * @returns A floating-point value equal to
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
  * @param x REAL FLOAT expression.
  * @returns A floating-point value that is the
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
  * @param x File-reference. The file must be open
  *   and have the STREAM attribute.
  * @returns An unscaled REAL FIXED BINARY value
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
  * @param x File reference.
  * @returns A '1'B when the end of the file is reached;
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
  * @param x File reference.
  * @param c Character string that holds the
  *   attribute to be queried.
  * @returns A size_t value that is the value of
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
  * @param x File reference.
  * @param c Character string that holds the
  *   attribute to be queried.
  * @returns A FIXED BIN(31) value that holds the
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
  * @param x File reference.
  * @param c Character string that holds the
  *   attribute to be queried.
  * @returns A character string that is the value of
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
  * @param x File reference
  * @returns A size_t 1 value that is the system
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
  * @param [x] Restricted expression. x must be a
  *   file constant or an initialized file variable.
  * @returns A FILE variable that points to a new
  *   file constant in automatic storage.
  */
 FILENEW: PROC (x) RETURNS (ANY<FILE>);
    DCL x ANY<FILE> OPTIONAL;
 END;
 /**
  * FILEOPEN returns '1'B if the file \`x\` is open and '0'B if
  * the file is not open.
  *
  * @param x File reference.
  * @returns '1'B if the file \`x\` is open and '0'B if the
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
  * @param x File reference
  * @param y Expression with type POINTER or
  *   OFFSET. If the type is OFFSET, the expression must be an
  *   OFFSET variable declared with the AREA attribute.
  * @param z Expression. It must have a
  *   computational type and is converted to type size_t.1
  * @returns The number of storage units actually
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
  * @param x File reference.
  * @param y A size_t value that indicates the
  *   number of positions the file pointer is to be moved
  *   relative to \`z\`.
  * @param z A FIXED BINARY(31) value that
  *   indicates the origin from which the file pointer is to be
  *   moved. The following values are valid:
  *
  *   **-1**: Beginning of the file
  *   **0**: Current position of the file pointer
  *   **1**: End of the file
  * @returns A FIXED BIN(31) value. The value is
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
  * @param x File reference
  * @returns A size_t 1 value that indicates the
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
  * @param x File reference.
  * @param y Expression with type POINTER or
  *   OFFSET. If the type is OFFSET, the expression must be an
  *   OFFSET variable declared with the AREA attribute.
  * @param z Expression. It must have a
  *   computational type and is converted to type size_t.1
  * @returns The number of storage units actually
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
  * @param x File-reference.
  * @returns An unscaled REAL FIXED BINARY
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
  * @returns A FIXED BINARY(31,0) value that gives
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
  * @returns A FIXED BIN(31) value that gives more
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
  * @param x File reference. The file must be open
  *   and have the PRINT attribute.
  * @returns An unscaled REAL FIXED BIN(31) value
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
  * @param x File reference. The file must have the
  *   RECORD attribute.
  * @returns A bit string of length 1 indicating whether a
  *   record that has been accessed is followed by another with
  *   the same key.
  */
 SAMEKEY: PROC (x) RETURNS (BIT);
    DCL x ANY<FILE>;
 END;

 /* Integer manipulation built-in functions */
 /**
  * IAND returns the logical AND of its arguments
  *
  * If any argument is not REAL FIXED BIN(p,0), then it is converted
  * to SIGNED REAL FIXED BIN(p,0).
  *
  * If any argument is SIGNED, then any UNSIGNED arguments are
  * converted to SIGNED.
  *
  * The result is REAL FIXED BIN( max(p1,p2,...), 0 ). It is
  * UNSIGNED if all the arguments are UNSIGNED.
  *
  * @param x Expression that must have a
  *   computational type.
  * @param y Expression that must have a
  *   computational type.
  * @returns The logical AND of its arguments.
  */
 IAND: PROC (x, y) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER> LIST;
 END;
 /**
  * ICLZ returns a FIXED BIN(31) value that indicates the number of
  * leading zeros in a FIXED BIN value.
  *
  * The value returned is relative to the number of bits that x
  * occupies.
  *
  * So, if x is SIGNED with precision p, then
  *
  * - when(p < 8), the value returned is between 0 and 8
  * - when(p < 16), the value returned is between 0 and 16
  * - when(p < 32), the value returned is between 0 and 32
  * - otherwise, the value returned is between 0 and 64
  *
  * And if x is UNSIGNED with precision p, then
  *
  * - when(p <= 8), the value returned is between 0 and 8
  * - when(p <= 16), the value returned is between 0 and 16
  * - when(p <= 32), the value returned is between 0 and 32
  * - otherwise, the value returned is between 0 and 64
  *
  * @param x Specifies a REAL FIXED BIN value with a
  *   scale factor of zero.
  * @returns The number of leading zeros in x.
  */
 ICLZ: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * IEOR returns the logical exclusive-OR of \`x\` and \`y\`. The
  * result is unsigned if all arguments are unsigned.
  *
  * If any argument is not REAL FIXED BIN(p,0), then it is converted
  * to SIGNED REAL FIXED BIN(p,0).
  *
  * If any argument is SIGNED, then any UNSIGNED arguments are
  * converted to SIGNED.
  *
  * The result is REAL FIXED BIN( max(p1,p2,...), 0 ). It is
  * UNSIGNED if all the arguments are UNSIGNED.
  *
  * @param x Expression that must have a
  *   computational type.
  * @param y Expression that must have a
  *   computational type.
  * @returns The logical exclusive-OR of \`x\` and \`y\`.
  */
 IEOR: PROC (x, y) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER>;
 END;
 /**
  * INOT returns the logical NOT of \`x\`.
  *
  * If \`x\` is REAL FIXED BIN(p,0), the result is REAL FIXED
  * BIN(p,0) and it is UNSIGNED if \`x\` is UNSIGNED. Otherwise,
  * \`x\` is converted to SIGNED REAL FIXED BIN(p,0) and the result
  * has the same attributes.
  *
  * Although INOT(x) has the opposite sign of \`x\`, INOT(x) is not
  * the same as \`-x\`.
  *
  * **Examples**
  *
  * \`\`\`
  *   inot(0)        //  produces -1
  *   inot(-1)       //  produces  0
  *   inot(+1)       //  produces -2
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @returns The logical NOT of \`x\`.
  */
 INOT: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * IOR returns the logical OR of its arguments.
  *
  * If any argument is not REAL FIXED BIN(p,0), then it is converted
  * to SIGNED REAL FIXED BIN(p,0).
  *
  * If any argument is SIGNED, then any UNSIGNED arguments are
  * converted to SIGNED.
  *
  * The result is REAL FIXED BIN( max(p1,p2,...), 0 ). It is
  * UNSIGNED if all the arguments are UNSIGNED.
  *
  * @param x Expression that must have a
  *   computational type.
  * @param y Expression that must have a
  *   computational type.
  * @returns The logical OR of its arguments.
  */
 IOR: PROC (x, y) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER> LIST;
 END;
 /**
  * ISIGNED(\`x\`) returns the result of casting \`x\` to a signed
  * integer value without changing its bit pattern.
  *
  * If \`x\` is not an integer, that is, if \`x\` is not REAL FIXED
  * BIN with zero scale factor, it is converted to REAL FIXED
  * BIN(p,0).
  *
  * ISIGNED( \`x\` ) returns, for integer \`x\`, a value with the
  * same bit pattern as \`x\` but with the attributes SIGNED FIXED
  * BIN(p).
  *
  * If \`x\` is UNSIGNED, p is given as follows:
  *
  * - If precision(\`x\`) = 8, 16, 32, or 64, p = precision(\`x\`) -
  * 1; otherwise, p = precision(\`x\`).
  * - If \`x\` is SIGNED, p = precision(\`x\`).
  *
  * **Example**
  *
  * \`\`\`
  *    ISIGNED('ff_ff_ff_ff'xu) equals the SIGNED FIXED BIN(31)
  *    value -1.
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @returns The result of casting \`x\` to a signed
  *   integer value without changing its bit pattern.
  */
 ISIGNED: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ISLL(\`x\`,\`n\`) returns the result of logically shifting \`x\`
  * to the left by \`n\` places, and padding on the right with
  * zeroes.
  *
  * If \`x\` is REAL FIXED BIN(p,0) and SIGNED, the result is SIGNED
  * REAL FIXED BIN(\`r\`,0) where if p <= M1, r = M1; if p > M1, r =
  * M2.
  *
  * If \`x\` is REAL FIXED BIN(p,0) and UNSIGNED, the result is
  * UNSIGNED REAL FIXED BIN(r+1,0) where if p <= (M1+1), r = (M1+1);
  * if p > (M1+1), r = (M2+1).
  *
  * Otherwise, \`x\` is converted to SIGNED REAL FIXED BIN(p,0) and
  * the result has the same attributes as above.
  *
  * If \`n\` is negative or if \`n\` is greater than r, the result
  * is undefined.
  *
  * Note: Unlike RAISE2(\`x\`,\`n\`), ISLL(\`x\`,\`n\`) can have a
  * different sign from that of \`x\`.
  *
  * **Examples**
  *
  * \`\`\`
  *   isll(+6,1)               //  produces 12
  *   isll(2147483645,1)       //  produces  -6
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @param n Expression. \`n\` must have a
  *   computational type.
  * @returns The result of logically shifting \`x\`
  *   to the left by \`n\` places.
  */
 ISLL: PROC (x, n) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * ISRL(\`x\`,\`n\`) returns the result of logically shifting \`x\`
  * to the right by \`n\` places, and padding on the left with
  * zeroes.
  *
  * The attributes of the result are determined as follows:
  *
  * - If \`x\` is REAL FIXED BIN(p,0) and SIGNED, the result is
  * SIGNED REAL FIXED BIN(p,0).
  * - If \`x\` is REAL FIXED BIN(p,0) and UNSIGNED, the result is
  * UNSIGNED REAL FIXED BIN(p,0).
  * - Otherwise, \`x\` is converted to SIGNED REAL FIXED BIN(p,0)
  * and the result has the same attributes.
  *
  * The result is undefined if \`n\` is negative or if \`n\` is
  * greater than M.
  *
  * If \`x\` is nonnegative, ISRL(x,n) is equivalent to LOWER2(x,n);
  * if \`x\` is negative, ISRL(x,n) is positive, unless \`n\`=0.
  *
  * **Examples**
  *
  * \`\`\`
  *   isrl(+6,1)            //  produces 3
  *   isrl(-6,1)            //  produces 2147483645
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @param n Expression. \`n\` must have a
  *   computational type.
  * @returns The result of logically shifting \`x\`
  *   to the right by \`n\` places.
  */
 ISRL: PROC (x, n) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * IUNSIGNED(\`x\`) returns the result of casting \`x\` to an
  * unsigned integer value without changing its bit pattern.
  *
  * If \`x\` is not an integer, that is, if \`x\` is not REAL FIXED
  * BIN with zero scale factor, it is converted to REAL FIXED
  * BIN(p,0).
  *
  * IUNSIGNED(\`x\`) returns, for integer \`x\`, a value with the
  * same bit pattern as \`x\` but with the attributes UNSIGNED FIXED
  * BIN(p).
  *
  * If \`x\` is SIGNED, p is given as follows:
  *
  * - If precision(\`x\`) = 7, 15, 31 or 63, p = precision(\`x\`) +
  * 1; otherwise, p = precision(\`x\`).
  * - If \`x\` is UNSIGNED, p = precision(\`x\`).
  *
  * **Example**
  *
  * \`\`\`
  *    IUNSIGNED('ff_ff_ff_ff'xn) equals the largest UNSIGNED
  *    FIXED BIN(32) value.
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @returns The result of casting \`x\` to an
  *   unsigned integer value without changing its bit pattern.
  */
 IUNSIGNED: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
 END;
 /**
  * LOWER2(\`x\`,\`n\`) returns the value:
  *
  * Note: LOWER2(\`x\`,\`n\`) is equivalent to the assembler
  * SRA(x,n).
  *
  * If \`x\` is SIGNED REAL FIXED BIN(p,0), then the result has the
  * same attributes. Otherwise, \`x\` is converted to SIGNED REAL
  * FIXED BIN(p,0) and the result has the same attributes.
  *
  * The result is undefined if \`n\` is negative or if \`n\` is
  * greater than M.
  *
  * **Examples**
  *
  * \`\`\`
  *   lower2 (+6,1)                       //  Produces 3
  *
  *   lower2 (-6,1)                       //  Produces -3
  *
  *   lower2 (-7,1)                       //  Produces -4
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @param n Expression. \`n\` must have a
  *   computational type.
  * @returns The result of arithmetic right-shifting
  *   \`x\` by \`n\` places.
  */
 LOWER2: PROC (x, n) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * RAISE2(\`x\`,\`n\`) returns the value x*(2**n).
  *
  * If \`x\` is REAL FIXED BIN(p,0) and SIGNED, the result is SIGNED
  * REAL FIXED BIN(r,0) where if p <= M1, r = M1; if p > M1, r = M2.
  *
  * If \`x\` is REAL FIXED BIN(p,0) and UNSIGNED, the result is
  * UNSIGNED REAL FIXED BIN(r+1,0) where if p <= (M1+1), r = (M1+1);
  * if p > (M1+1), r = (M2+1).
  *
  * Otherwise, \`x\` is converted to SIGNED REAL FIXED BIN(p,0) and
  * the result has the same attributes as above.
  *
  * If \`n\` is negative or if \`n\` is greater than r, the result
  * is undefined.
  *
  * Note: RAISE2(\`x\`,\`n\`) is equivalent to the assembler
  * SLA(\`x\`,\`n\`).
  *
  * **Example**
  *
  * \`\`\`
  *   raise2(6,1)                    //  produces 12
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type.
  * @param n Expression. \`n\` must have a
  *   computational type.
  * @returns The value x*(2**n).
  */
 RAISE2: PROC (x, n) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL n ANY<NUMBER>;
 END;

 /* JSON built-in functions */
 /**
  * JSONGETARRAYEND(p,n) checks whether the next character,
  * ignoring whitespace, in a piece of JSON text is a closing
  * bracket ]. This function returns a size_t 1 value that is
  * equal to the number of bytes read.
  *
  * If the number of available bytes n is greater than zero,
  * JSONGETARRAYEND(p,n) attempts to read a closing bracket ] from
  * the buffer.
  *
  * - When the first character after any whitespace is the desired
  * character ], the number of bytes read includes 1 byte for the
  * desired character plus any bytes of whitespace preceding it.
  * - When the first character after any whitespace is not the
  * desired character ], a value of zero is returned.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns The number of bytes read.
  */
 JSONGETARRAYEND: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONGETARRAYSTART(p,n) checks whether the next character,
  * ignoring whitespace, in a piece of JSON text is an opening
  * bracket [. This function returns a size_t 1 value that is
  * equal to the number of bytes read.
  *
  * If the number of available bytes n is greater than zero,
  * JSONGETARRAYSTART(p,n) attempts to read an opening bracket [
  * from the buffer.
  *
  * - When the first character after any whitespace is the desired
  * character [, the number of bytes read includes 1 byte for the
  * desired character plus any bytes of whitespace preceding it.
  * - When the first character after any whitespace is not the
  * desired character [, a value of zero is returned.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns The number of bytes read.
  */
 JSONGETARRAYSTART: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONGETCOLON(p,n) checks whether the next character, ignoring
  * whitespace, in a piece of JSON text is a colon. This function
  * returns a size_t 1 value that is equal to the number of bytes
  * read.
  *
  * If the number of available bytes n is greater than zero,
  * JSONGETCOLON(p,n) attempts to read a colon from the buffer.
  *
  * - When the first character after any whitespace is the desired
  * character, a colon, the number of bytes read includes 1 byte
  * for the desired character plus any bytes of whitespace
  * preceding it.
  * - When the first character after any whitespace is not the
  * desired character, a value of zero is returned.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns The number of bytes read.
  */
 JSONGETCOLON: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONGETCOMMA(p,n) checks whether the next character, ignoring
  * whitespace, in a piece of JSON text is a comma. This function
  * returns a size_t 1 value that is equal to the number of bytes
  * read.
  *
  * If the number of available bytes n is greater than zero,
  * JSONGETCOMMA(p,n) attempts to read a comma from the buffer.
  *
  * - When the first character after any whitespace is the desired
  * character, a comma, the number of bytes read includes 1 byte
  * for the desired character plus any bytes of whitespace
  * preceding it.
  * - When the first character after any whitespace is not the
  * desired character, a value of zero is returned.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns The number of bytes read.
  */
 JSONGETCOMMA: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONGETMEMBER reads a member (or name-value pair) from a piece
  * of JSON text. This function returns a size_t 1 value that
  * specifies the number of bytes read from the buffer.
  *
  * Whitespace is permitted anywhere in the JSON text, but is
  * ignored except for contributing to the total number of bytes
  * read.
  *
  * If the JSON text contains invalid JSON, the ERROR condition is
  * raised and the ONSUBCODE built-in function gives the index of
  * the invalid character.
  *
  * If the third argument of JSONGETMEMBER is omitted, the
  * name-value pair is simply read over.
  *
  * If any element in the target has the CHARACTER type, the
  * conversion from the UTF-8 source in the JSON text is based on
  * the CODEPAGE compiler option.
  *
  * Under the compiler option JSON(PARSE(V1)):
  *
  * - If the JSON source specifies more values for an array than in
  * the target declaration, then the ERROR condition will be raised
  * (reporting that a closing bracket ] was not found when
  * expected).
  * - If the third argument is a structure, then the names in the
  * JSON text must match those in the structure. If not, the ERROR
  * condition is raised.
  *
  * Note: It is not necessary to specify name-value pairs for all
  * the elements in the structure, but any names specified must be
  * in the same order as they are in the structure.
  *
  * Under the compiler option JSON(PARSE(V2)):
  *
  * - If the JSON source specifies more values for an array than in
  * the target declaration:
  *   - If SUBSCRIPTRANGE is enabled, then the SUBSCRIPTRANGE
  *   condition will be raised
  *   - Otherwise, the excess values will be ignored
  * - If the third argument is a structure and a name in the JSON
  * text does not match any name in the structure:
  *   - If CONFORMANCE is enabled, then the CONFORMANCE condition
  *   will be raised and the ONJSONNAME built-in function will
  *   return the unmatched name
  *   - Otherwise, the name and its JSON-value will be ignored
  *
  * Note: It is not necessary to specify name-value pairs for all
  * the elements in the structure, and it is not necessary that the
  * names are specified in the same order as they are in the
  * structure.
  *
  * The name-value pair must consist of the variable's name as a
  * JSON string followed by a colon and the variable's value.
  *
  * The value may be specified as null, in which case the target
  * variable is unchanged.
  *
  * **Examples**
  *
  * Suppose a buffer contains the following JSON text, and the
  * buffer address is in P and its length is in N.
  *
  * \`\`\`
  *    { "passes" : 3,
  *      "data" :
  *        [
  *             { "name" : "Mather",     "elevation" : 12100 }
  *           , { "name" : "Pinchot",    "elevation" : 12130 }
  *           , { "name" : "Glenn",      "elevation" : 11940 }
  *        ]
  *    }
  * \`\`\`
  *
  * When compiled with the option JSON(CASE(ASIS)), the following
  * code allocates an appropriately sized structure and then fills
  * it in. The JSON compiler option is needed so that the names are
  * accepted in lower case.
  *
  * \`\`\`
  *    dcl
  *      1 info based(q),
  *        2 count        fixed bin(31),
  *        2 data( passes refer(count) ),
  *          3 name       char(20) varying,
  *          3 elevation  fixed bin(31);
  *
  *    read = 0;
  *    read += jsonGetObjectStart(p+read,n-read);
  *    read += jsonGetMember(p+read,n-read,passes);
  *    allocate info;
  *    read += jsonGetComma(p+read,n-read);
  *    read += jsonGetValue(p+read,n-read);
  *    read += jsonGetColon(p+read,n-read);
  *    read += jsonGetValue(p+read,n-read,data);
  * \`\`\`
  *
  * Note that this code works equally well if the buffer contains
  * more data. See the following example:
  *
  * \`\`\`
  *  { "passes" : 5,
  *      "data" :
  *        [
  *             { "name" : "Muir",       "elevation" : 11980 }
  *           , { "name" : "Mather",     "elevation" : 12100 }
  *           , { "name" : "Pinchot",    "elevation" : 12130 }
  *           , { "name" : "Glenn",      "elevation" : 11940 }
  *           , { "name" : "Forester",   "elevation" : 13100 }
  *        ]
  *    }
  * \`\`\`
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @param [x] A variable reference whose name-value pair is
  *   to be read from the buffer. The variable reference must not
  *   contain any of these elements:
  *
  *   - UNIONs
  *   - Noncomputational elements
  *   - GRAPHIC elements
  *   - COMPLEX elements
  *   - FIXED(p,q) elements with q < 0 or q > p
  *   - Unnamed elements
  *
  *   x may have STRUCTURE type.
  * @returns The number of bytes read from the
  *   buffer.
  */
 JSONGETMEMBER: PROC (p, n, x) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
    DCL x ANY OPTIONAL;
 END;
 /**
  * JSONGETOBJECTEND(p,n) checks whether the next character,
  * ignoring whitespace, in a piece of JSON text is a closing brace
  * }. This function returns a size_t 1 value that is equal to the
  * number of bytes read.
  *
  * If the number of available bytes n is greater than zero,
  * JSONGETOBJECTEND(p,n) attempts to read a closing brace } from
  * the buffer.
  *
  * - When the first character after any whitespace is the desired
  * character }, the number of bytes read includes 1 byte for the
  * desired character plus any bytes of whitespace preceding it.
  * - When the first character after any whitespace is not the
  * desired character }, a value of zero is returned.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns The number of bytes read.
  */
 JSONGETOBJECTEND: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONGETOBJECTSTART(p,n) checks whether the next character,
  * ignoring whitespace, in a piece of JSON text is an opening brace
  * {. This function returns a size_t 1 value that is equal to the
  * number of bytes read.
  *
  * If the number of available bytes n is greater than zero,
  * JSONGETOBJECTSTART(p,n) attempts to read an opening brace { from
  * the buffer.
  *
  * - When the first character after any whitespace is the desired
  * character {, the number of bytes read includes 1 byte for the
  * desired character plus any bytes of whitespace preceding it.
  * - When the first character after any whitespace is not the
  * desired character {, a value of zero is returned.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns The number of bytes read.
  */
 JSONGETOBJECTSTART: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONGETVALUE reads a value from a piece of JSON text. This
  * function returns a size_t 1 value that specifies the number of
  * bytes read from the buffer.
  *
  * Whitespace is permitted anywhere in the JSON text, but is
  * ignored except for contributing to the total number of bytes
  * read.
  *
  * If the JSON text contains invalid JSON, the ERROR condition is
  * raised and the ONSUBCODE built-in function gives the index of
  * the invalid character.
  *
  * If the third argument of JSONGETVALUE is omitted, the value is
  * simply read over.
  *
  * If the third argument is an array, array values can be omitted,
  * in which case the corresponding elements of the target array are
  * unchanged.
  *
  * If any element in the target has the CHARACTER type, the
  * conversion from the UTF-8 source in the JSON text is based on
  * the CODEPAGE compiler option.
  *
  * Under the compiler option JSON(PARSE(V1)):
  *
  * - If the JSON source specifies more values for an array than in
  * the target declaration, then the ERROR condition will be raised
  * (reporting that a closing bracket ] was not found when expected)
  * - If the third argument is a structure, then the names in the
  * JSON text must match those in the structure. If not, the ERROR
  * condition is raised.
  *
  * Note: It is not necessary to specify name-value pairs for all
  * the elements in the structure, but any names specified must be
  * in the same order as they are in the structure.
  *
  * Under the compiler option JSON(PARSE(V2)):
  *
  * - If the JSON source specifies more values for an array than in
  * the target declaration:
  *   - If SUBSCRIPTRANGE is enabled, then the SUBSCRIPTRANGE
  *   condition will be raised
  *   - Otherwise, the excess values will be ignored
  * - If the third argument is a structure and a name in the JSON
  * text does not match any name in the structure:
  *   - If CONFORMANCE is enabled, then the CONFORMANCE condition
  *   will be raised and the ONJSONNAME built-in function will
  *   return the unmatched name
  *   - Otherwise, the name and its JSON-value will be ignored
  *
  * Note: It is not necessary to specify name-value pairs for all
  * the elements in the structure, and it is not necessary that the
  * names are specified in the same order as they are in the
  * structure.
  *
  * The value may be specified as null, in which case the target
  * variable is unchanged.
  *
  * **Example 1**
  *
  * The following code assigns the values 2, 3, and 5 to the array
  * B. The value returned would be 7 plus the count of whitespace
  * characters before the closing bracket, ].
  *
  * \`\`\`
  *   dcl b(3)    fixed bin;
  *   dcl buffer  char(1000) var;
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *
  *   buffer = utf8( ' [ 2, 3, 5 ]' );
  *   p = addrdata(buffer);
  *   n = length(buffer);
  *   read = jsonGetValue( p, n, b );
  * \`\`\`
  *
  * **Example 2**
  *
  * The following code assigns the values 2 to B(1), 3 to B(2), and
  * leaves B(3) unchanged. The value returned would be 5 plus the
  * count of whitespace characters before the closing bracket, ].
  *
  * \`\`\`
  *   dcl b(3)    fixed bin;
  *   dcl buffer  char(1000) var;
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *
  *   buffer = utf8( ' [ 2, 3 ]' );
  *   p = addrdata(buffer);
  *   n = length(buffer);
  *   read = jsonGetValue( p, n, b );
  * \`\`\`
  *
  * **Example 3**
  *
  * The following code assigns 2 to C.D and 3 to C.E. It returns a
  * value greater than or equal to 13.
  *
  * \`\`\`
  *   dcl 1 c, 2 d fixed bin, 2 e fixed bin;
  *   dcl buffer  char(1000) var;
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   buffer = utf8( ' { "D" : 2, "E" : 3 } ' );
  *   p = addrdata(buffer);
  *   n = length(buffer);
  *   read = jsonGetValue( p, n, c );
  * \`\`\`
  *
  * **Example 4**
  *
  * Suppose that a buffer contains the following JSON text, and that
  * the buffer address is P and its length is in N.
  *
  * \`\`\`
  *    { "PASSES" : 3,
  *      "DATA" :
  *        [
  *             { "NAME" : "Mather",  "ELEVATION" : 12100 }
  *           , { "NAME" : "Pinchot", "ELEVATION" : 12130 }
  *           , { "NAME" : "Glenn",   "ELEVATION" : 11940 }
  *        ]
  *    }
  * \`\`\`
  *
  * Then the single invocation of JSONGETVALUE in the following code
  * will fill in the entire structure.
  *
  * \`\`\`
  *    dcl
  *      1 info,
  *        2 passes       fixed bin(31),
  *        2 data(3),
  *          3 name       char(20) varying,
  *          3 elevation  fixed bin(31);
  *
  *    read = jsonGetValue( p, n, info );
  * \`\`\`
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be read
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer
  * @param [x] A variable reference whose value is to be
  *   read from the buffer
  *
  *   The variable reference must not contain any of these elements:
  *
  *   - UNIONs
  *   - Noncomputational elements
  *   - GRAPHIC elements
  *   - COMPLEX elements
  *   - FIXED(p,q) elements with q < 0 or q > p
  *   - Unnamed elements
  *
  *   x may have STRUCTURE type.
  * @returns The number of bytes read from the
  *   buffer.
  */
 JSONGETVALUE: PROC (p, n, x) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
    DCL x ANY OPTIONAL;
 END;
 /**
  * JSONPUTARRAYEND(p,n) writes a closing bracket ] to the buffer
  * if the number of available bytes n is greater than zero. The
  * function returns a size_t 1 value equal to 1.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns 1.
  */
 JSONPUTARRAYEND: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONPUTARRAYSTART(p,n) writes an opening bracket [ to the
  * buffer if the number of available bytes n is greater than zero.
  * The function returns a size_t 1 value equal to 1.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns 1.
  */
 JSONPUTARRAYSTART: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONPUTCOLON(p,n) writes a colon to the buffer if the number of
  * available bytes n is greater than zero. The function returns a
  * size_t 1 value equal to 1.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t value that specifies the
  *   number of available bytes in the buffer.
  * @returns 1.
  */
 JSONPUTCOLON: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONPUTCOMMA(p,n) writes a comma to the buffer if the number of
  * available bytes n is greater than zero. The function returns a
  * size_t 1 value equal to 1.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t that specifies the number of
  *   available bytes in the buffer.
  * @returns 1.
  */
 JSONPUTCOMMA: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONPUTMEMBER appends a member (or name-value pair), as UTF-8,
  * to the JSON text. This function returns a size_t 1 value that
  * specifies the number of bytes that are written to the buffer;
  * or if the specified buffer size is zero, it returns a size_t
  * value that specifies the number of bytes that would be needed
  * for all the JSON text to be written.
  *
  * **Example 1**
  *
  * \`\`\`
  *   dcl b(3)    fixed bin init(2,3,5);
  *   dcl buffer  char(1000);
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   p = addr(buffer);
  *   n = length(buffer);
  *   written = jsonPutMember( p, n, b );
  * \`\`\`
  *
  * The above code writes the following UTF-8 string to the buffer,
  * and assigns the value 11 to the variable written.
  *
  * \`\`\`
  * "B":[2,3,5]
  * \`\`\`
  *
  * **Example 2**
  *
  * \`\`\`
  *   dcl 1 c, 2 d fixed bin init(2), 2 e fixed bin init(3);
  *   dcl buffer  char(1000);
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   p = addr(buffer);
  *   n = length(buffer);
  *   written = jsonPutMember( p, n, c );
  * \`\`\`
  *
  * The above code writes the following UTF-8 string to the buffer,
  * and assigns the value 17 to the variable written.
  *
  * \`\`\`
  * "C":{"D":2,"E":3}
  * \`\`\`
  *
  * **Example 3**
  *
  * \`\`\`
  *   dcl 1 c(2), 2 d fixed bin init(2,3), 2 d fixed bin init(5,7);
  *   dcl buffer  char(1000);
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   p = addr(buffer);
  *   n = length(buffer);
  *   written = jsonPutMember( p, n, c );
  * \`\`\`
  *
  * The above code writes the following UTF-8 string to the buffer,
  * and assigns the value 33 to the variable written.
  *
  * \`\`\`
  * "C":[{"D":2,"E":5},{"D":3,"E":7}]
  * \`\`\`
  *
  * **Example 4**
  *
  * \`\`\`
  *   dcl x       fixed bin(31) init(11);
  *   dcl y       fixed bin(31) init(13);
  *   dcl buffer  char(1000);
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   p = addr(buffer);
  *   n = length(buffer);
  *   written = 0;
  *   written += jsonPutObjectStart( p+written, n-written );
  *   written += jsonPutMember( p+written, n-written, x );
  *   written += jsonPutComma( p+written, n-written );
  *   written += jsonPutMember( p+written, n-written, y );
  *   written += jsonPutObjectEnd( p+written, n-written );
  * \`\`\`
  *
  * The above code writes the following UTF-8 string to the buffer,
  * and assigns the value 15 to the variable written.
  *
  * \`\`\`
  * {"X":11,"Y":13}
  * \`\`\`
  *
  * Unlike the previous examples, this buffer contains complete,
  * valid JSON text.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t that specifies the number of
  *   available bytes in the buffer.
  * @param x A variable reference whose value is to be
  *   written to the buffer. The variable reference must not contain
  *   any of these elements:
  *
  *   - UNIONs
  *   - Noncomputational elements
  *   - GRAPHIC elements
  *   - COMPLEX elements
  *   - FIXED(p,q) elements with q < 0 or q > p
  *   - Unnamed elements
  *
  *   x may have STRUCTURE type.
  * @param [y] An optional parameter that
  *   specifies whether names should be written in lowercase,
  *   uppercase, or asis.
  *
  *   y must be a character constant with one of the values LOWER,
  *   UPPER, or ASIS. These values can themselves be specified in
  *   any case. If not specified, it will default to the value in
  *   JSON(CASE) option.
  * @returns The number of bytes written to the
  *   buffer, or the number of bytes needed if n is zero.
  */
 JSONPUTMEMBER: PROC (p, n, x, y) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
    DCL x ANY;
    DCL y ANY<CHARACTER> OPTIONAL;
 END;
 /**
  * JSONPUTOBJECTEND(p,n) writes a closing brace } to the buffer if
  * the number of available bytes n is greater than zero. The
  * function returns a size_t 1 value equal to 1.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t that specifies the number of
  *   available bytes in the buffer.
  * @returns 1.
  */
 JSONPUTOBJECTEND: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONPUTOBJECTSTART(p,n) writes an opening brace to the buffer if
  * the number of available bytes n is greater than zero. The
  * function returns a size_t 1 value equal to 1.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t that specifies the number of
  *   available bytes in the buffer.
  * @returns 1.
  */
 JSONPUTOBJECTSTART: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;
 /**
  * JSONPUTVALUE appends a value, as UTF-8, to the JSON text. This
  * function returns a size_t 1 value that specifies the number of
  * bytes that are written to the buffer; or if the specified buffer
  * size is zero, it returns a size_t value that specifies the
  * number of bytes that would be needed for all the JSON text to be
  * written.
  *
  * **Example 1**
  *
  * \`\`\`
  *   dcl b(3)    fixed bin init(2,3,5);
  *   dcl buffer  char(1000);
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   p = addr(buffer);
  *   n = length(buffer);
  *   written = jsonPutValue( p, n, b );
  * \`\`\`
  *
  * The above code writes the following UTF-8 string to the buffer,
  * and assigns the value 7 to the variable written.
  *
  * \`\`\`
  * [2,3,5]
  * \`\`\`
  *
  * **Example 2**
  *
  * \`\`\`
  *   dcl 1 c, 2 d fixed bin init(2), 2 e fixed bin init(3);
  *   dcl buffer  char(1000);
  *   dcl p       pointer;
  *   dcl n       fixed bin(31);
  *
  *   p = addr(buffer);
  *   n = length(buffer);
  *   written = jsonPutValue( p, n, c );
  * \`\`\`
  *
  * The above code writes the following UTF-8 string to the buffer,
  * and assigns the value 13 to the variable written.
  *
  * \`\`\`
  * {"D":2,"E":3}
  * \`\`\`
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be written.
  * @param n A size_t that specifies the number of
  *   available bytes in the buffer.
  * @param x A variable reference whose value is to be
  *   written to the buffer. The variable reference must not contain
  *   any of these elements:
  *
  *   - UNIONs
  *   - Noncomputational elements
  *   - GRAPHIC elements
  *   - COMPLEX elements
  *   - FIXED(p,q) elements with q < 0 or q > p
  *   - Unnamed elements
  *
  *   x may have STRUCTURE type.
  * @param [y] An optional parameter that
  *   specifies whether names should be written in lowercase,
  *   uppercase, or asis.
  *
  *   y must be a character constant with one of the values LOWER,
  *   UPPER, or ASIS. These values can themselves be specified in
  *   any case. If not specified, it will default to the value in
  *   JSON(CASE) option.
  * @returns The number of bytes written to the
  *   buffer, or the number of bytes needed if n is zero.
  */
 JSONPUTVALUE: PROC (p, n, x, y) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
    DCL x ANY;
    DCL y ANY<CHARACTER> OPTIONAL;
 END;
 /**
  * JSONVALID determines whether a buffer contains valid JSON text.
  * This function returns a size_t 1 value of zero if the JSON text
  * is valid; otherwise, it returns the index of the first invalid
  * byte.
  *
  * @param p A pointer that specifies the address of a
  *   buffer to be tested.
  * @param n A size_t value that specifies the
  *   number of bytes in the buffer.
  * @returns Zero if the JSON text is valid;
  *   otherwise, the index of the first invalid byte.
  */
 JSONVALID: PROC (p, n) RETURNS (FIXED BINARY);
    DCL p POINTER;
    DCL n FIXED BINARY;
 END;

 /* Mathematical built-in functions */
 /**
  * ACOS returns a real floating-point value that is an
  * approximation of the inverse (arc) cosine in radians of \`x\`.
  *
  * The result is in the range:
  *
  * \`\`\`
  *   0 ≤ ACOS(x) ≤ π
  * \`\`\`
  *
  * and has the base and precision of \`x\`.
  *
  * @param x Real expression, where ABS(x) <= 1.
  * @returns An approximation of the inverse (arc) cosine
  *   in radians of \`x\`.
  */
 ACOS: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ASIN returns a real floating-point value that is an
  * approximation of the inverse (arc) sine in radians of \`x\`.
  *
  * The result is in the range:
  *
  * \`\`\`
  *   -π/2 ≤ ASIN(x) ≤ π/2
  * \`\`\`
  *
  * The result has the base and precision of \`x\`.
  *
  * @param x Real expression, where ABS(x) <= 1.
  * @returns An approximation of the inverse (arc) sine
  *   in radians of \`x\`.
  */
 ASIN: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ATAN returns a floating-point value that is an approximation of
  * the inverse (arc) tangent in radians of \`x\` or of a ratio
  * \`x/y\`.
  *
  * @param x Expression.
  *
  *   If \`x\` alone is specified, the result has the base and
  *   precision of \`x\`, and is in the range:
  *
  *   \`\`\`
  *     -π/2 < ATAN(x) < π/2
  *   \`\`\`
  *
  *   If \`x\` and \`y\` are specified, each must be real. An error
  *   exists if \`x\` and \`y\` are both zero. The result for all
  *   other values of \`x\` and \`y\` has the precision of the
  *   longer argument, a base determined by the rules for
  *   expressions, and a value given by:
  *
  *   |  | ATAN(x/y) | for y>0 |
  *   | --- | --- | --- |
  *   |  | π/2 | for y=0 and x>0 |
  *   |  | -π/2 | for y=0 and x<0 |
  *   |  | π + ATAN(x/y) | for y<0 and x>=0 |
  *   |  | -π + ATAN(x/y) | for y<0 and x<0 |
  * @param [y] Expression.
  * @returns An approximation of the inverse (arc) tangent
  *   in radians of \`x\` or of \`x/y\`.
  */
 ATAN: PROC (x, y) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER> OPTIONAL;
 END;
 /**
  * ATAND returns a real floating-point value that is an
  * approximation of the inverse (arc) tangent in degrees of \`x\`
  * or of a ratio \`x/y\`.
  *
  * For argument requirements and attributes of the result, see
  * ATAN.
  *
  * @param x Expression.
  *
  *   If \`x\` alone is specified it must be real. The result has
  *   the base and precision of \`x\`, and is in the range:
  *
  *   \`\`\`
  *     -90 < ATAND(x) < 90
  *   \`\`\`
  *
  *   If \`x\` and \`y\` are specified, each must be real. The value
  *   of the result is given by:
  *
  *   \`\`\`
  *     (180/π) * ATAN(x,y)
  *   \`\`\`
  * @param [y] Expression.
  * @returns An approximation of the inverse (arc) tangent
  *   in degrees of \`x\` or of \`x/y\`.
  */
 ATAND: PROC (x, y) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER> OPTIONAL;
 END;
 /**
  * ATANH returns a floating-point value that has the base, mode,
  * and precision of \`x\`, and is an approximation of the inverse
  * (arc) hyperbolic tangent of \`x\`.
  *
  * The result has a value given by:
  *
  * \`\`\`
  *   LOG((1 + x)/(1 - x))/2
  * \`\`\`
  *
  * @param x Expression. ABS(x)<1.
  * @returns An approximation of the inverse (arc)
  *   hyperbolic tangent of \`x\`.
  */
 ATANH: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * COS returns a floating-point value that has the base, precision,
  * and mode of \`x\`, and is an approximation of the cosine of
  * \`x\`.
  *
  * @param x Expression with a value in radians.
  * @returns An approximation of the cosine of \`x\`.
  */
 COS: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * COSD returns a real floating-point value that has the base and
  * precision of \`x\`, and is an approximation of the cosine of
  * \`x\`.
  *
  * @param x Real expression with a value in degrees.
  * @returns An approximation of the cosine of \`x\`.
  */
 COSD: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * COSH returns a floating-point value that has the base,
  * precision, and mode of \`x\`, and is an approximation of the
  * hyperbolic cosine of \`x\`.
  *
  * @param x Expression.
  * @returns An approximation of the hyperbolic cosine
  *   of \`x\`.
  */
 COSH: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ERF returns a real floating-point value that is an approximation
  * of the error function of \`x\`.
  *
  * The result has the base and precision of \`x\`, and a value
  * given by:
  *
  * \`\`\`
  * (2/ √(π) ) ∫x0 EXP(-(t2 ))dt
  * \`\`\`
  *
  * @param x Real expression.
  * @returns An approximation of the error function of \`x\`.
  */
 ERF: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * ERFC returns a real floating-point value that is an
  * approximation of the complement of the error function of \`x\`.
  *
  * The result has the base and precision of \`x\`, and a value
  * given by:
  *
  * \`\`\`
  *   1 - ERF(x)
  * \`\`\`
  *
  * @param x Real expression.
  * @returns An approximation of the complement of the
  *   error function of \`x\`.
  */
 ERFC: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * EXP returns a floating-point value that is an approximation of
  * the base, e, of the natural logarithm system raised to the power
  * \`x\`.
  *
  * The result has the base, mode, and precision of \`x\`.
  *
  * @param x Expression.
  * @returns An approximation of e raised to the power \`x\`.
  */
 EXP: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * GAMMA returns a floating-point value that has the base, mode,
  * and precision of \`x\`.
  *
  * GAMMA is an approximation of the gamma of \`x\`, as given by the
  * following equation:
  *
  * \`\`\`
  * gamma(x) =  ∫∞0 (ux-1)(e-x)du
  * \`\`\`
  *
  * @param x Real expression. The value of \`x\` must
  *   be greater than zero.
  * @returns An approximation of the gamma of \`x\`.
  */
 GAMMA: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * LOG returns a floating-point value that is an approximation of
  * the natural logarithm (the logarithm to the base e) of \`x\`. It
  * has the base, mode, and precision of \`x\`.
  *
  * @param x Expression. \`x\` must be greater than
  *   zero.
  * @returns An approximation of the natural logarithm
  *   of \`x\`.
  */
 LOG: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * LOG10 returns a real floating-point value that is an
  * approximation of the common logarithm (the logarithm to the
  * base 10) of \`x\`. It has the base and precision of \`x\`.
  *
  * @param x Real expression. It must be greater than
  *   zero.
  * @returns An approximation of the common logarithm
  *   of \`x\`.
  */
 LOG10: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * LOG2 returns a real floating-point value that is an
  * approximation of the binary logarithm (the logarithm to the
  * base 2) of \`x\`. It has the base and precision of \`x\`.
  *
  * @param x Real expression. The value of \`x\` must
  *   be greater than zero.
  * @returns An approximation of the binary logarithm
  *   of \`x\`.
  */
 LOG2: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * LOGGAMMA returns a floating-point value that is an approximation
  * of the log of gamma of \`x\`.
  *
  * The gamma of \`x\` is given by the following equation:
  *
  * \`\`\`
  * gamma(x) =  ∫∞0 (ux-1)(e-x)du
  * \`\`\`
  *
  * LOGGAMMA has the base, mode, and precision of \`x\`.
  *
  * @param x Real expression. The value of \`x\` must
  *   be greater than 0.
  * @returns An approximation of the log of gamma of \`x\`.
  */
 LOGGAMMA: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * SIN returns a floating-point value that is an approximation of
  * the sine of \`x\`. It has the base, mode, and precision of
  * \`x\`.
  *
  * @param x Expression whose value is in radians.
  * @returns An approximation of the sine of \`x\`.
  */
 SIN: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * SIND returns a real floating-point value that is an
  * approximation of the sine of \`x\`. It has the base and
  * precision of \`x\`.
  *
  * @param x Real expression whose value is in
  *   degrees.
  * @returns An approximation of the sine of \`x\`.
  */
 SIND: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * SINH returns a floating-point value that represents an
  * approximation of the hyperbolic sine of \`x\`. It has the base,
  * mode, and precision of \`x\`.
  *
  * @param x Expression whose value is in radians.
  * @returns An approximation of the hyperbolic sine of
  *   \`x\`.
  */
 SINH: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * SQRT returns a floating-point value that is an approximation of
  * the positive square root of \`x\`. It has the base, mode, and
  * precision of \`x\`.
  *
  * @param x Expression. If \`x\` is real, it must not
  *   be less than zero.
  * @returns An approximation of the positive square root
  *   of \`x\`.
  */
 SQRT: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * SQRTF is the same as SQRT except for some differences.
  *
  * Differences between SQRTF and SQRT:
  *
  * - SQRTF calculates its result inline if hardware architecture
  * permits.
  * - The argument must be real.
  * - Invalid arguments will generate hardware exceptions.
  * - The accuracy of the result is set by the hardware.
  *
  * The SQRTF built-in function is not supported for DFP.
  *
  * For the definition and syntax, see SQRT.
  * @param x Real expression.
  * @returns An approximation of the positive square root
  *   of \`x\`.
  */
 SQRTF: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * TAN returns a floating-point value that is an approximation of
  * the tangent of \`x\`. It has the base, mode, and precision of
  * \`x\`.
  *
  * @param x Expression whose value is in radians.
  * @returns An approximation of the tangent of \`x\`.
  */
 TAN: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * TAND returns a real floating-point value that is an
  * approximation of the tangent of \`x\`. It has the base and
  * precision of \`x\`.
  *
  * @param x Real expression whose value is in
  *   degrees.
  * @returns An approximation of the tangent of \`x\`.
  */
 TAND: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;
 /**
  * TANH returns a floating-point value that is an approximation
  * of the hyperbolic tangent of \`x\`. It has the base, mode,
  * and precision of \`x\`.
  *
  * @param x Expression whose value is in radians.
  * @returns An approximation of the hyperbolic tangent
  *   of \`x\`.
  */
 TANH: PROC (x) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
 END;

 /* Miscellaneous built-in functions */
 /**
  * ALLCOMPARE(x, y, z) returns a BIT(1) value that indicates
  * the result of comparing all the elements of two structures.
  *
  * x and y must be similar structure references.
  *
  * The corresponding elements of x and y must be comparable.
  *
  * For example, ALLCOMPARE(x, y, 'lt') returns '1'B if every
  * leaf element of x is less than the corresponding leaf
  * element of y.
  *
  * @param x Structure reference.
  * @param y Structure reference.
  * @param [z] A CHAR(2) constant. When
  *   uppercased, the constant must have one of these values:
  *   EQ, LE, LT, GT, GE, or NE. If you do not specify z, EQ
  *   is the default value.
  *
  *   EQ Equal to LE Less than or equal to LT Less than GT
  *   Greater than GE Greater than or equal to NE Not equal to
  * @returns Result of comparing all elements of the
  *   two structures.
  */
 ALLCOMPARE: PROC (x, y, z) RETURNS (BIT(1));
    DCL x ANY<STRUCTURE>;
    DCL y ANY<STRUCTURE>;
    DCL z CHARACTER(2) OPTIONAL;
 END;
 /**
  * BETWEEN returns a bit(1) value that indicates whether x is
  * in the closed interval as defined by a and b.
  *
  * BETWEEN(x,a,b) is equivalent to the test (a <= x) &
  * (x <= b). Thus, if any of the arguments are numeric, they
  * must all be REAL.
  *
  * In BETWEEN(x,a,b), a <= b must be true, and if not, the
  * program is in error and its behavior is undefined.
  *
  * @param x Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param a Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param b Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @returns Whether x is in the closed interval
  *   defined by a and b.
  */
 BETWEEN: PROC (x, a, b) RETURNS (BIT(1));
    DCL x ANY;
    DCL a ANY;
    DCL b ANY;
 END;
 /**
  * BETWEENEXCLUSIVE returns a bit(1) value that indicates
  * whether the first argument x is in the open interval as
  * defined by the second argument a and the third argument b.
  *
  * BETWEENEXCLUSIVE(x,a,b) is equivalent to the test (a < x )
  * & (x < b). Therefore, if any of the arguments are numeric,
  * they must be REAL.
  *
  * In BETWEENEXCLUSIVE(x,a,b) , a < b must be true, and if
  * not, the program is in error and its behavior is undefined.
  *
  * @param x Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param a Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param b Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @returns Whether x is in the open interval defined
  *   by a and b.
  */
 BETWEENEXCLUSIVE: PROC (x, a, b) RETURNS (BIT(1));
    DCL x ANY;
    DCL a ANY;
    DCL b ANY;
 END;
 /**
  * BETWEENLEFTEXCLUSIVE returns a bit(1) value that indicates
  * whether the first argument x is in the left-open interval
  * as defined by the second argument a and the third argument
  * b.
  *
  * BETWEENLEFTEXCLUSIVE(x,a,b) is equivalent to the test
  * (a < x ) & (x <= b). Therefore, if any of the arguments
  * are numeric, they must be REAL.
  *
  * In BETWEENLEFTEXCLUSIVE(x,a,b) , a < b must be true, and
  * if not, the program is in error and its behavior is
  * undefined.
  *
  * @param x Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param a Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param b Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @returns Whether x is in the left-open interval
  *   defined by a and b.
  */
 BETWEENLEFTEXCLUSIVE: PROC (x, a, b) RETURNS (BIT(1));
    DCL x ANY;
    DCL a ANY;
    DCL b ANY;
 END;
 /**
  * The BETWEENRIGHTEXCLUSIVE built-in function returns a
  * bit(1) value that indicates whether the first argument x is
  * in the right-open interval as defined by the second
  * argument a and the third argument b.
  *
  * BETWEENRIGHTEXCLUSIVE(x,a,b) is equivalent to the test
  * (a <= x ) & (x < b). Therefore, if any of the arguments
  * are numeric, they must be REAL.
  *
  * In BETWEENRIGHTEXCLUSIVE(x,a,b) , a < b must be true, and
  * if not, the program is in error and its behavior is
  * undefined.
  *
  * @param x Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param a Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param b Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @returns Whether x is in the right-open interval
  *   defined by a and b.
  */
 BETWEENRIGHTEXCLUSIVE: PROC (x, a, b) RETURNS (BIT(1));
    DCL x ANY;
    DCL a ANY;
    DCL b ANY;
 END;
 /**
  * BINSEARCH performs a binary search of an array for a
  * specified key value by using a simple compare and returns a
  * size_t value.
  *
  * The elements of the array x and the key value must satisfy
  * one of the following:
  *
  * - Both must be computational and neither are COMPLEX
  * - Both must be POINTERs
  * - Both must be HANDLEs to the same structure type
  * - Both must be ORDINALs of the same type
  *
  * The returned value is the relative index of the key value
  * in this array. If the key value y is not found in the
  * array, the returned size_t value is zero.
  *
  * The relative index is the index if the array has a lower
  * bound of 1. Therefore, the true index would be calculated
  * as: the returned value + LBOUND(x) \u2013 1. For example:
  *
  * - If the array x has a lower bound of 0 and upper bound of
  * 11, then the returned value will range from 0 to 12
  * inclusive. If the returned value is non-zero, then the true
  * index of the found value is the returned value minus 1.
  * - If the array x has a lower bound of -12 and an upper
  * bound of 12, then the returned value will range from 0 to
  * 25 inclusive. If the returned value is non-zero, the true
  * index of the found value is the returned value minus 13.
  *
  * @param x An expression that specifies the target
  *   array that would be searched within. x must be a
  *   one-dimensional array of scalars and the elements of x
  *   must be in ascending order. If x is an array of
  *   NONVARYING BIT, it must be aligned.
  * @param y An expression that specifies the key value
  *   to be searched for.
  * @param [n] An expression that specifies the
  *   index of the first array element to be examined. It
  *   defaults to LBOUND(x).
  * @param [m] An expression that specifies the
  *   number of to-be-examined array elements. The counting
  *   starts with the nth and defaults to HBOUND(x) \u2013 n + 1.
  * @returns Relative index of the key value
  *   in the array, or zero if not found.
  */
 BINSEARCH: PROC (x, y, n, m) RETURNS (FIXED BINARY(31));
    DCL x ANY(*);
    DCL y ANY;
    DCL n ANY<NUMBER> OPTIONAL;
    DCL m ANY<NUMBER> OPTIONAL;
 END;
 /**
  * BINSEARCHX performs a binary search of an array for a
  * specified key value by using a specified compare function
  * and returns a size_t value.
  *
  * The function f must have the OPTLINK linkage and it is
  * passed 2 POINTER BYVALUE arguments:
  *
  * - The address of an array element.
  * - The address of the key value to be searched for (the
  * value of p).
  *
  * The function f must have the attributes RETURNS( BYVALUE
  * FIXED BINARY(31) ), and it must return one of the values
  * -1, 0 or +1:
  *
  * - If the value of the array element is less than the value
  * of the key element, then the returned value must be -1.
  * - If the value of the array element is equal to the value
  * of the key element, then the returned value must be 0.
  * - If the value of the array element is greater than the
  * value of the key element, then the returned value must be
  * +1.
  *
  * The value returned by the BINSEARCHX built-in function
  * itself is the relative index of the key value in this
  * array. If the key value y is not found in the array, the
  * returned size_t value is zero.
  *
  * The relative index is the index if the array has a lower
  * bound of 1. Therefore, the true index would be calculated
  * as: the returned value + LBOUND(x) \u2013 1. For example:
  *
  * - If the array x has a lower bound of 0 and upper bound of
  * 11, then the returned value will range from 0 to 12
  * inclusive. If the returned value is non-zero, then the true
  * index of the found value is the returned value minus 1.
  * - If the array x has a lower bound of -12 and an upper
  * bound of 12, then the returned value will range from 0 to
  * 25 inclusive. If the returned value is non-zero, the true
  * index of the found value is the returned value minus 13.
  *
  * @param x An expression that specifies the target
  *   array that would be searched within. x must be a
  *   one-dimensional array and the elements of x must be in
  *   ascending order. If x is an array of NONVARYING BIT, it
  *   must be aligned.
  * @param p An expression that specifies the address
  *   of the key value to be searched for.
  * @param f An expression that specifies the
  *   function that will be invoked to perform all the required
  *   comparisons.
  * @param [n] An expression that specifies the
  *   index of the first array element to be examined. It
  *   defaults to LBOUND(x).
  * @param [m] An expression that specifies the
  *   number of to-be-examined array elements. The counting
  *   starts with the nth and defaults to HBOUND(x) \u2013 n + 1.
  * @returns Relative index of the key value
  *   in the array, or zero if not found.
  */
 BINSEARCHX: PROC (x, p, f, n, m) RETURNS (FIXED BINARY(31));
    DCL x ANY(*);
    DCL p POINTER;
    DCL f ANY<ENTRY>;
    DCL n ANY<NUMBER> OPTIONAL;
    DCL m ANY<NUMBER> OPTIONAL;
 END;
 /**
  * BYTELENGTH returns a FIXED BINARY(31) value that is the
  * number of bytes used by a UCHAR string.
  *
  * If x has UCHAR VARYING or UCHAR VARYING4 type, the value
  * returned by BYTELENGTH(x) does not count the number of
  * prefix bytes. If x has UCHAR VARYINGZ type, the value
  * returned by BYTELENGTH(x) does not count the terminating
  * null byte.
  *
  * The value returned by BYTELENGTH(x) is always greater than
  * the value returned by LENGTH(x), but no greater than four
  * times the value returned by LENGTH(x).
  *
  * Example 1:
  *
  * Given DCL X UCHAR(1), then LENGTH(X) = 1 and STG(X) = 4,
  * but after:
  *
  * \`\`\`
  * 	X = 'A';
  * 	BYTELENGTH(X) = 1 (since X holds '41'ux )
  * 	X = '\u00c4';
  * 	BYTELENGTH(X) = 2 (since X holds  'C3_84'ux )
  * 	X = '\u20ac';
  * 	BYTELENGTH(x) = 3 (since X holds 'E2_82_AC'ux )
  * \`\`\`
  *
  * Example 2:
  *
  * Given DCL X UCHAR(6), then LENGTH(X) = 6 and STG(X) = 24,
  * but after:
  *
  * \`\`\`
  * 	X = 'Stra\u00dfe' ;
  * 	BYTELENGTH(X) = 7 (since X holds '53_74_72_C39F_61_65'ux )
  * \`\`\`
  *
  * Example 3:
  *
  * Given DCL X UCHAR(8) VARYING, then STG(X) = 34, but after:
  *
  * \`\`\`
  * 	X = 'Stra\u00dfe' ;
  * 	LENGTH(X) = 6
  * 	BYTELENGTH(X) = 7 (since X holds '53_74_72_C39F_61_65'ux )
  * 	CSTG(X) = 9
  * \`\`\`
  *
  * @param x Expression. x must have UCHAR
  *   type.
  * @returns Number of bytes used by the
  *   UCHAR string.
  */
 BYTELENGTH: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY<CHARACTER>;
 END;
 /**
  * CDS returns a FIXED BINARY(31) value that indicates if the
  * old and current values in a compare double and swap were
  * equal.
  *
  * CDS compares the "current" and "old" values. If they are
  * equal, the "new" value is copied over the "current", and a
  * value of 0 is returned. If they are unequal, the "current"
  * value is copied over the "old", and a value of 1 is
  * returned.
  *
  * On z/OS, the CDS built-in function implements the CDS
  * instruction. For a detailed description of this function,
  * read the appendices in the Principles of Operations manual.
  *
  * On Intel, the CDS built-in function uses the Intel
  * cmpxchg8 instruction in the same manner that the CS
  * built-in function uses the cmpxchg4 instruction.
  *
  * @param p Address of the old FIXED BINARY(63)
  *   value.
  * @param q Address of the current FIXED BINARY(63)
  *   value.
  * @param x The new FIXED BINARY(63) value.
  * @returns 0 if the old and current values
  *   were equal, 1 otherwise.
  */
 CDS: PROC (p, q, x) RETURNS (FIXED BINARY(31));
    DCL p POINTER;
    DCL q POINTER;
    DCL x FIXED BINARY(63);
 END;
 /**
  * CHARVAL returns the CHARACTER(1) value corresponding to an
  * integer.
  *
  * CHARVAL(n) has the same bit value as n (that is,
  * UNSPEC(CHARVAL(n)) is equal to UNSPEC(n)), but it has the
  * attributes CHARACTER(1).
  *
  * CHARVAL is the inverse of RANK (when applied to character).
  *
  * @param n Expression converted to UNSIGNED
  *   FIXED BIN(8) if necessary.
  * @returns CHARACTER(1) value corresponding
  *   to n.
  */
 // BYTE is a synonym for CHARVAL
 CHARVAL: BYTE: PROC (n) RETURNS (CHARACTER(1));
    DCL n ANY<NUMBER>;
 END;
 /**
  * CODEPAGE returns a FIXED BINARY(31) value that holds the
  * value of the CODEPAGE compiler option. It has no arguments
  * and is a restricted expression.
  *
  * @returns Value of the CODEPAGE compiler
  *   option.
  */
 CODEPAGE: PROC() RETURNS (FIXED BINARY(31));
 END;
 /**
  * COLLATE returns a CHARACTER(256) string comprising the 256
  * possible CHARACTER(1) values one time each in the collating
  * order.
  *
  * @returns All 256 CHARACTER(1) values in
  *   collating order.
  */
 COLLATE: PROC() RETURNS (CHARACTER(256));
 END;
 /**
  * CS returns a FIXED BINARY(31) value that indicates if the
  * old and current values in a compare and swap were equal.
  *
  * CS compares the "current" and "old" values. If they are
  * equal, the "new" value is copied over the "current", and a
  * value of 0 is returned. If they are unequal, the "current"
  * value is copied over the "old", and a value of 1 is
  * returned.
  *
  * So, CS could be implemented as the following PL/I function,
  * but then it would not be atomic at all. :
  *
  * \`\`\`
  *   cs: proc( old_Addr, current_Addr, new )
  *    returns( fixed bin(31) byvalue )
  *    options( byvalue );
  *
  *    dcl old_Addr     pointer;
  *    dcl current_Addr pointer;
  *    dcl new          fixed bin(31);
  *
  *    dcl old          fixed bin(31) based(old_addr);
  *    dcl current      fixed bin(31) based(current_addr);
  *
  *    if current = old then
  *      do;
  *        current = new;
  *        return( 0 );
  *      end;
  *    else
  *      do;
  *        old = current;
  *        return( 1 );
  *      end;
  *  end;
  * \`\`\`
  *
  * On z/OS, the CS built-in function implements the CS
  * instruction. For a detailed description of this function,
  * read the appendices in the Principles of Operations manual.
  *
  * On Intel, the CDS built-in function uses the Intel
  * cmpxchg4 instruction. The cmpxchg4 instruction takes the
  * address of a "current" value, a "new" value and an "old"
  * value. It returns the original "current" value and updates
  * it with the "new" value only if it equaled the "old" value.
  *
  * So, on Intel, the CS built-in function is implemented via
  * the following inline function:
  *
  * \`\`\`
  *   cs: proc( old_Addr, current_Addr, new )
  *    returns( fixed bin(31) byvalue )
  *    options( byvalue );
  *
  *    dcl old_Addr     pointer;
  *    dcl current_Addr pointer;
  *    dcl new          fixed bin(31);
  *
  *    dcl old          fixed bin(31) based(old_addr);
  *    dcl current      fixed bin(31) based(current_addr);
  *
  *    if cmpxchg4( current_Addr, new, old ) = old then
  *      do;
  *        return( 0 );
  *      end;
  *    else
  *      do;
  *        old = current;
  *        return( 1 );
  *      end;
  *  end;
  * \`\`\`
  *
  * @param p Address of the old FIXED BINARY(31)
  *   value.
  * @param q Address of the current FIXED BINARY(31)
  *   value.
  * @param x The new FIXED BINARY(31) value.
  * @returns 0 if the old and current values
  *   were equal, 1 otherwise.
  */
 CS: PROC (p, q, x) RETURNS (FIXED BINARY(31));
    DCL p POINTER;
    DCL q POINTER;
    DCL x FIXED BINARY(31);
 END;
 /**
  * FOLDEDFULLMATCH returns a FIXED BINARY(31) value that
  * indicates whether two strings are identical when folded to
  * lowercase according to the Unicode full case folding rules.
  * If two strings are identical, the return value is 0.
  * Otherwise, the returned value is non-zero.
  *
  * When you use the FOLDEDFULLMATCH built-in function, all
  * UTF-8 data items from all code blocks will be folded as
  * necessary.
  *
  * In full case folding, the lengths of x and y do not need to
  * be the same. For example, not only Haus and HAUS would
  * match, but Stra\u00dfe and STRASSE would also match.
  *
  * @param x Expression. x must have
  *   computational type and is converted to UCHAR type if
  *   necessary.
  * @param y Expression. y must have
  *   computational type and is converted to UCHAR type if
  *   necessary.
  * @returns 0 if strings are identical when
  *   folded, nonzero otherwise.
  */
 FOLDEDFULLMATCH: PROC (x, y) RETURNS (FIXED BINARY(31));
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
 END;
 /**
  * FOLDEDSIMPLEMATCH returns a FIXED BINARY(31) value that
  * indicates whether two strings are identical when folded to
  * lowercase according to the Unicode simple case folding
  * rules. If two strings are identical, the return value is 0.
  * Otherwise, the returned value is nonzero.
  *
  * When you use the FOLDEDSIMPLEMATCH built-in function, all
  * UTF-8 data items from all code blocks will be folded as
  * necessary.
  *
  * In simple case folding, the lengths of x and y must be
  * equal. For example, Haus and HAUS would match, but
  * Stra\u00dfe and STRASSE would not match.
  *
  * @param x Expression. x must have
  *   computational type and is converted to UCHAR type if
  *   necessary.
  * @param y Expression. y must have
  *   computational type and is converted to UCHAR type if
  *   necessary.
  * @returns 0 if strings are identical when
  *   folded, nonzero otherwise.
  */
 FOLDEDSIMPLEMATCH: PROC (x, y) RETURNS (FIXED BINARY(31));
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
 END;
 /**
  * GETENV returns a character value representing a specified
  * environment variable.
  *
  * @param x Expression naming an environment
  *   variable.
  * @returns Character value of the specified
  *   environment variable.
  */
 GETENV: PROC (x) RETURNS (CHARACTER(*));
    DCL x ANY<CHARACTER>;
 END;
 /**
  * GETJCLSYMBOL returns a CHARACTER string value that
  * represents the requested exported JCL symbol.
  *
  * If there is no JCL symbol with the same value as x, a null
  * string is returned.
  *
  * **Example**
  *
  * With the JCL statements shown below, specifying
  * GETJCLSYMBOL('S1') will return STEWART.
  *
  * \`\`\`
  * //EX1 EXPORT SYMLIST=(S1,L1)
  * //SET1 SET S1=STEWART,L1=LAGUARDIA
  * //EX2 EXEC PGM=GETSYM   // PLI program call GETJCLSYMBOL
  * \`\`\`
  *
  * .
  *
  * @param x Specifies the name of the
  *   exported JCL symbol.
  * @returns Character string value of the
  *   requested JCL symbol.
  */
 GETJCLSYMBOL: PROC (x) RETURNS (CHARACTER(*));
    DCL x ANY<CHARACTER>;
 END;
 /**
  * GETSYSINT returns a size_t value that is the value of the
  * requested system information.
  *
  * The MAXACTINFO keyword returns the number of job accounting
  * fields in the JOB accounting information as specified in
  * the jobcard. In combination with the ACTINFO of the
  * GETSYSWORD built-in function, you can obtain the individual
  * job accounting field information.
  *
  * @param x The requested system information.
  *   The following is the valid keyword for \`x\`:
  *
  *   - MAXACTINFO
  * @returns Value of the requested system
  *   information.
  */
 GETSYSINT: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY<CHARACTER>;
 END;
 /**
  * GETSYSWORD returns a CHARACTER string that is the value of
  * the requested system information.
  *
  * The ASID keyword returns the Address Space Identifier value
  * in hexadecimal of the program that calls the built-in
  * function.
  *
  * The ACTINFO keyword returns a comma-delimited string that
  * is the JOB accounting information specified in the jobcard.
  * In combination with the MAXACTINFO keyword of the GETSYSINT
  * built-in function, you can obtain the individual job
  * accounting field information. The returned account
  * information has a maximum length of 144 bytes. If the
  * subparameter is enclosed in apostrophes, the apostrophes
  * will not be included in the accounting information string.
  * For example, given the jobcard:
  *
  * \`\`\`
  * //JOB44  JOB  (D548-8686,'12/8/85',PGMBIN)
  * \`\`\`
  *
  * GETSYSWORD(ACTINFO) will return the string:
  *
  * \`\`\`
  * D548-8686,12/8/85,PGMBIN
  * \`\`\`
  *
  * For more information about the JOB accounting information
  * parameter, see the z/OS MVS JCL Reference.
  *
  * The JESNODE keyword returns the JES node name of the system
  * for the program that calls the built-in function.
  *
  * The JOBCLASS keyword returns the Job Class that is assigned
  * to the batch job for the program that calls the built-in
  * function.
  *
  * The JOBNAME keyword returns the JOB or TASK name that calls
  * the built-in function.
  *
  * The JOBNUMBER keyword returns the JES JOBID that is
  * assigned to the batch job for the program that calls the
  * built-in function.
  *
  * The MSGCLASS keyword returns the message class of the job
  * for the program that calls the built-in function.
  *
  * The PROCSTEP keyword returns the job step name that calls
  * the JCL procedure, which has the step that executes the
  * PL/I program. If it is not called from a JCL procedure, a
  * null string is returned.
  *
  * The SMFID keyword returns the SMFID (system identifier) of
  * the system for the program that calls the built-in
  * function.
  *
  * The STEPNAME keyword returns the step name that calls the
  * PL/I program.
  *
  * The SYSNAME keyword returns the LPAR name of the system
  * installation of the TSO/USS/Batch job that calls the
  * built-in function.
  *
  * The SYSNODE keyword returns the JES node name of the system
  * for the program that calls the built-in function. The
  * result is the same as using keyword JESNODE.
  *
  * The SYSPLEX keyword returns the SYSPLEX name of the system
  * installation of the TSO/USS/batch job that calls the
  * built-in function.
  *
  * If the GETSYSWORD built-in function is called from a CICS
  * transaction, the JOB or TASK name that starts the CICS
  * control region is returned for the JOBNAME, and the step
  * that initializes the CICS control region is returned for
  * the STEPNAME.
  *
  * @param x A character expression that
  *   specifies the requested system information. The following
  *   are valid keywords for \`x\`:
  *
  *   - ASID
  *   - ACTINFO
  *   - JESNODE
  *   - JOBCLASS
  *   - JOBNAME
  *   - JOBNUMBER
  *   - MSGCLASS
  *   - PROCSTEP
  *   - SMFID
  *   - STEPNAME
  *   - SYSNAME
  *   - SYSNODE
  *   - SYSPLEX
  * @returns Character string of the requested
  *   system information.
  */
 GETSYSWORD: PROC (x) RETURNS (CHARACTER(*));
    DCL x ANY<CHARACTER>;
 END;
 /**
  * GTCA returns a pointer to the LE control block.
  *
  * If the GTCA built-in function is used to change storage,
  * unpredictable results may occur.
  *
  * The GTCA built-in function is supported only on z/OS.
  *
  * @returns Pointer to the LE control block.
  */
 GTCA: PROC() RETURNS (POINTER);
 END;
 /**
  * HEX returns a character string that is the hexadecimal
  * representation of the storage that contains \`x\`.
  *
  * HEX(x) returns a character string of length 2 * size(x).
  *
  * HEX(x,z) returns a character string that contains \`x\`
  * with the character \`z\` inserted between every set of
  * eight characters in the output string. Its length is
  * 2 * size(x) + ((size(x) - 1)/4).
  *
  * Under the compiler option USAGE(HEX(CSTG)), the length
  * used in the above calculations is based, for VARYING,
  * VARYING4, and VARYINGZ strings, on cstg(x) rather than on
  * stg(x).
  *
  * Integer, offset and pointer values will be presented in
  * bigendian form.
  *
  * If the number of bytes to be converted to hex is not known
  * at compile time, then no more than 32767 bytes will be
  * converted.
  *
  * Note: This function does not return an exact image of \`x\`
  * in storage. If an exact image is required, use the
  * HEXIMAGE built-in function.
  *
  * **Example 1**
  *
  * \`\`\`
  *   dcl Sweet char(5) init('Sweet');
  *   dcl Sixteen fixed bin(31) init(16) littleendian;
  *   dcl XSweet char(size(Sweet)*2+(size(Sweet)-1)/4);
  *   dcl XSixteen char(size(Sixteen)*2+(size(Sixteen)-1)/4);
  *
  *   XSweet = hex(Sweet,'-');
  *              // '53776565-74'
  *
  *   XSweet = heximage(addr(Sweet),length(Sweet),'-');
  *              // '53776565-74'
  *
  *   XSixteen = hex(Sixteen,'-');
  *              // '00000010' - bytes reversed
  *
  *   XSixteen = heximage(addr(Sixteen),stg(Sixteen),'-');
  *              // '10000000' - bytes NOT reversed
  * \`\`\`
  *
  * **Example 2**
  *
  * \`\`\`
  *   dcl X fixed bin(15) littleendian;
  *   dcl Y fixed bin(15) bigendian;
  *
  *   X = 258;  // stored as '0201'B4
  *   Y = 258;  // stored as '0102'B4
  *
  *   display (hex(X));          // displays 0102
  *   display (hex(Y));          // displays 0102
  *
  *   display (heximage( addr(X), stg(X) ));  // displays 0201
  *   display (heximage( addr(Y), stg(Y) ));  // displays 0102
  * \`\`\`
  *
  * @param x Expression that represents any variable.
  *   The whole number of bytes that contain \`x\` is converted
  *   to hexadecimal.
  * @param [z] Expression. If specified, \`z\`
  *   must have the type CHARACTER(1) NONVARYING.
  * @returns Hexadecimal representation of the
  *   storage containing \`x\`.
  */
 HEX: PROC (x, z) RETURNS (CHARACTER(*));
    DCL x ANY;
    DCL z CHARACTER(1) OPTIONAL;
 END;
 /**
  * HEX8 returns a character string that is the UTF-8
  * hexadecimal representation of the storage that contains
  * \`x\`.
  *
  * HEX8(x) returns a character string of length 2 * size(x).
  *
  * HEX8(x,z) returns a character string that contains \`x\`
  * with the character \`z\` inserted between every set of
  * eight characters in the output string. Its length is
  * 2 * size(x) + ((size(x) - 1)/4).
  *
  * Under the compiler option USAGE(HEX(CSTG)), the length
  * used in the above calculations is based, for VARYING,
  * VARYING4, and VARYINGZ strings, on cstg(x) rather than on
  * stg(x).
  *
  * Integer, offset and pointer values will be presented in
  * big endian form.
  *
  * If the number of bytes to be converted to hex is not known
  * at compile time, then no more than 32767 bytes will be
  * converted.
  *
  * Note: This function does not return an exact image of \`x\`
  * in storage. If an exact image is required, use the
  * HEXIMAGE8 built-in function.
  *
  * **Example 1**
  *
  * \`\`\`
  *   dcl Sweet char(5) init('Sweet');
  *   dcl Sixteen fixed bin(31) init(16) littleendian;
  *   dcl XSweet char(size(Sweet)*2+(size(Sweet)-1)/4);
  *   dcl XSixteen char(size(Sixteen)*2+(size(Sixteen)-1)/4);
  *
  *   XSweet = hex8(Sweet,'-');
  *              // '53776565-74'a
  *
  *   XSweet = heximage8(addr(Sweet),length(Sweet),'-');
  *              // '53776565-74'a
  *
  *   XSixteen = hex8(Sixteen,'-');
  *              // '00000010' - bytes reversed
  *
  *   XSixteen = heximage8(addr(Sixteen),stg(Sixteen),'-');
  *              // '10000000' - bytes NOT reversed
  * \`\`\`
  *
  * **Example 2**
  *
  * \`\`\`
  *   dcl X fixed bin(15) littleendian;
  *   dcl Y fixed bin(15) bigendian;
  *
  *   X = 258;  // stored as '0201'B4
  *   Y = 258;  // stored as '0102'B4
  *
  *   display (hex8(X));          // displays 0102
  *   display (hex8(Y));          // displays 0102
  *
  *   display (heximage8( addr(X), stg(X) ));  // displays 0201
  *   display (heximage8( addr(Y), stg(Y) ));  // displays 0102
  * \`\`\`
  *
  * @param x An expression that represents any variable.
  *   The whole number of bytes that contain \`x\` is converted
  *   to hexadecimal.
  * @param [z] An expression. If specified, \`z\`
  *   must have the type CHARACTER(1) NONVARYING and must be a
  *   valid 1-byte UTF-8 character.
  * @returns UTF-8 hexadecimal representation of
  *   the storage containing \`x\`.
  */
 HEX8: PROC (x, z) RETURNS (CHARACTER(*));
    DCL x ANY;
    DCL z CHARACTER(1) OPTIONAL;
 END;
 /**
  * IFTHENELSE returns its second or third argument according
  * to the true or false value, respectively, of its first
  * argument. It provides an equivalent for the C conditional
  * expression (x?y:z).
  *
  * Given IFTHENELSE(x, y, z ), the following rules apply:
  *
  * - The first operand is evaluated, and its value determines
  * whether the second or third operand is evaluated:
  *   - If the value is true, the second operand is evaluated.
  *   - If the value is false, the third operand is evaluated.
  *   The result is the value of the second or third operand.
  * - If y and z are computational, the result type is the
  * common type of y and z.
  * - If either y or z is arithmetic, the result is arithmetic
  * with the same precision as MAX(y, z) and with the common
  * base, mode, and scale of y and z. Otherwise, the result is
  * string with the same type as for a concatenation of y and
  * z and with length equal to the maximum of the length of y
  * and z.
  * - If y and z are non-computational, the result type has
  * the same type.
  *
  * @param x An operand that can be converted to bit.
  *   x is true if any bit in the converted bit string has the
  *   value '1'b.
  * @param y Operand. Must be computational (and if a
  *   string, must be NONVARYING with a constant length), a
  *   pointer, an ordinal with the same type as z, or a handle
  *   to the same structure type as z.
  * @param z Operand. Must be computational (and if a
  *   string, must be NONVARYING with a constant length), a
  *   pointer, an ordinal with the same type as y, or a handle
  *   to the same structure type as y.
  * @returns Value of y if x is true, value of z if x is
  *   false.
  */
 IFTHENELSE: PROC (x, y, z) RETURNS (ANY);
    DCL x BIT(1);
    DCL y ANY;
    DCL z ANY;
 END;
 /**
  * INDICATORS returns a FIXED BIN value giving the number of
  * the elements at the next logical level in a structure \`x\`.
  *
  * INDICATORS(x) always forms a restricted expression.
  *
  * The INDICATORS built-in function is useful in declaring an
  * indicator array for use in SQL statements.
  *
  * @param x Expression. x must be a structure
  *   reference.
  * @returns Number of elements at the next
  *   logical level in the structure.
  */
 INDICATORS: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<STRUCTURE>;
 END;
 /**
  * INLIST returns a bit(1) value that indicates whether \`x\` is
  * equal to any of the remaining arguments.
  *
  * INLIST(x,y1,y2,y3,...,yn) is equivalent to (x=y1) | (x=y2)
  * | (x=y3) | ... | (x=yn), where n is in the range 2 to 511
  * inclusive.
  *
  * After the evaluation of the first argument \`x\`, the
  * evaluation of the remaining arguments must not change the
  * address or value of the first argument. This condition is
  * true when all but the first argument are constants. It is
  * also true if the second and subsequent arguments do not rely
  * on the invocation of any user functions that change storage
  * associated with the first argument.
  *
  * @param x Expression. Must be either all ORDINAL with
  *   the same type or all computational.
  * @param y Expressions. Must be either all ORDINAL with
  *   the same type or all computational.
  * @returns Whether x is equal to any of the
  *   remaining arguments.
  */
 INLIST: PROC (x, y) RETURNS (BIT(1));
    DCL x ANY;
    DCL y ANY LIST;
 END;
 /**
  * ISJCLSYMBOL returns '1'B if the argument is a valid
  * exported JCL symbol. Otherwise it returns '0'B.
  *
  * When GETJCLSYMBOL returns a null string, you can use the
  * ISJCLSYMBOL built-in function to determine whether it is
  * because the symbol is not an exported JCL symbol or because
  * the symbol has been set to a null string value.
  *
  * @param x Character expression. Specifies
  *   the symbol name to be tested.
  * @returns '1'B if x is a valid exported JCL
  *   symbol, '0'B otherwise.
  */
 ISJCLSYMBOL: PROC (x) RETURNS (BIT(1));
    DCL x ANY<CHARACTER>;
 END;
 /**
  * ISMAIN() returns a '1'B if the procedure in which it is
  * invoked has the OPTIONS(MAIN) attribute. Otherwise it
  * returns a '0'B.
  *
  * @returns '1'B if the containing procedure has
  *   OPTIONS(MAIN), '0'B otherwise.
  */
 ISMAIN: PROC() RETURNS (BIT(1));
 END;
 /**
  * MAINNAME returns a CHARACTER string that is the name of the
  * MAIN function on the current call stack.
  *
  * @returns Name of the MAIN function on the
  *   current call stack.
  */
 MAINNAME: PROC() RETURNS (CHARACTER(*));
 END;
 /**
  * OMITTED returns a BIT(1) value that is '1'B if the
  * parameter named \`x\` was omitted in the invocation to its
  * containing procedure.
  *
  * Note: This argument must be declared as OPTIONAL in the
  * corresponding ENTRY declaration in the calling code.
  *
  * @param x Level-1 unsubscripted parameter with the
  *   BYADDR attribute.
  * @returns '1'B if the parameter was omitted,
  *   '0'B otherwise.
  */
 OMITTED: PROC (x) RETURNS (BIT(1));
    DCL x ANY;
 END;
 /**
  * PACKAGENAME returns a nonvarying character string
  * containing the name of the package in which it is invoked.
  *
  * If there is no package in the current compilation unit,
  * PACKAGENAME returns the name of the outermost procedure.
  *
  * @returns Name of the package in which the
  *   function is invoked.
  */
 PACKAGENAME: PROC() RETURNS (CHARACTER(*));
 END;
 /**
  * PLIRETV returns a FIXED BINARY(31,0) value that is the
  * PL/I return code.
  *
  * The value of the PL/I return code is the most recent value
  * specified by a CALL PLIRETC statement.
  *
  * @returns The PL/I return code.
  */
 PLIRETV: PROC() RETURNS (FIXED BINARY(31));
 END;
 /**
  * POPCNT returns a FIXED BIN value holding in each byte the
  * number of bits equal to 1 in the corresponding byte of x.
  *
  * The result has the same precision as \`x\`.
  *
  * The result has the same (UN)SIGNED attribute as \`x\`.
  *
  * See the following examples of using POPCNT:
  *
  * - POPCNT( '01020304'xn ) returns '01010201'xn.
  * - POPCNT( '05060708'xn ) returns '02020301'xn.
  * - If \`x\` has the attributes FIXED BIN(31),
  * ISRL(POPCNT(x)*'01010101'xn,24) returns the number of bits
  * equal to 1 in x.
  *
  * On z/OS, the POPCNT(\`x\`) built-in function requires an
  * ARCH level of 9 or higher.
  *
  * @param x Expression. \`x\` must have the
  *   attributes REAL FIXED BIN with a scale factor of zero.
  * @returns FIXED BIN value with the bit count
  *   per byte; same precision as \`x\`.
  */
 POPCNT: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
 END;
 /**
  * PRESENT(x) returns a BIT(1) value that is '1'B if the
  * parameter \`x\` was present in the invocation of its
  * containing procedure.
  *
  * Note: This argument must be declared as OPTIONAL in the
  * corresponding ENTRY declaration in the calling code.
  *
  * @param x Level-1 unsubscripted BYADDR parameter.
  * @returns '1'B if the parameter was present,
  *   '0'B otherwise.
  */
 PRESENT: PROC (x) RETURNS (BIT(1));
    DCL x ANY;
 END;
 /**
  * PROCEDURENAME returns a nonvarying character string
  * containing the name of the procedure in which this
  * built-in function is invoked.
  *
  * Abbreviation: PROCNAME
  *
  * PROCEDURENAME always returns the leftmost name of a
  * multiple label specification, regardless of which name
  * appears in the CALL or GOTO statement.
  *
  * @returns Name of the current procedure.
  */
 PROCEDURENAME: PROCNAME: PROC() RETURNS (CHARACTER(*));
 END;
 /**
  * PUTENV adds new environment variables or modifies the
  * values of existing environment variables.
  *
  * PUTENV returns true ('1'B) if successful and false ('0'B)
  * otherwise.
  *
  * @param string A character string of the
  *   form \`envvarname=value\`.
  * @returns '1'B if successful, '0'B otherwise.
  */
 PUTENV: PROC (string) RETURNS (BIT(1));
    DCL string ANY<CHARACTER>;
 END;
 /**
  * RANK returns the integer value corresponding to a character
  * or widechar.
  *
  * If x is character, RANK(x) is defined as
  * index(collate(),x)-1, and RANK is the inverse of CHARVAL.
  *
  * If xx is widechar, RANK(x) is equal to UNSPEC(y) where y
  * is x stored in bigendian format.
  *
  * @param x Must have the attributes CHAR (1)
  *   NONVARYING or WCHAR (1) NONVARYING.
  * @returns Integer value corresponding to
  *   the character.
  */
 RANK: PROC (x) RETURNS (ANY<NUMBER>);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * SOURCEFILE returns a nonvarying character string containing
  * the name of the file that contains the statement where this
  * function is invoked.
  *
  * The SOURCEFILE built-in function can be used in restricted
  * expressions.
  *
  * The string returned is system dependent and should be used
  * for tracing and debugging purposes only.
  *
  * @returns Name of the source file containing
  *   the invoking statement.
  */
 SOURCEFILE: PROC() RETURNS (CHARACTER(*));
 END;
 /**
  * SOURCELINE returns a FIXED BINARY(31,0) value that is the
  * line number of the statement where this function is
  * invoked, within the file that contains that statement. If
  * the statement extends over several source lines, the number
  * returned is that of the line on which the statement starts.
  *
  * The SOURCELINE built-in function can be used in restricted
  * expressions.
  *
  * @returns Line number of the invoking
  *   statement.
  */
 SOURCELINE: PROC() RETURNS (FIXED BINARY(31));
 END;
 /**
  * STACKADDR returns the address of the dynamic save area
  * (DSA) for the procedure (or BEGIN block) in which it is
  * invoked.
  *
  * If the STACKADDR built-in function is used to change
  * storage, unpredictable results may occur.
  *
  * @returns Address of the DSA for the current
  *   procedure or BEGIN block.
  */
 STACKADDR: PROC() RETURNS (ANY<LOCATOR>);
 END;
 /**
  * STRING returns a string that is the concatenation of all
  * the elements of \`x\`.
  *
  * STRING is restricted as follows:
  *
  * - It cannot be applied to unions or structures containing
  * unions.
  * - If applied to a scalar, the scalar must be a bit string,
  * a character string, a pictured character string, a pictured
  * numeric string, a graphic string, a uchar string, or a
  * widechar string.
  * - If applied to a structure, the structure must contain no
  * padding bytes and the elements of the structure must be
  * either:
  *   - All unaligned bit strings
  *   - All character strings, each of which is either a
  *   character string, a pictured string, or a pictured
  *   numeric string
  *   - All graphic strings
  *   - All uchar strings
  *   - All widechar strings
  * - If applied to an array, all elements in the array are
  * subject to the restrictions as described previously.
  *
  * The type of string returned has the same type as one of
  * these base elements with these exceptions:
  *
  * - If any of the base elements are PICTUREs, then the type
  * returned has CHARACTER type.
  * - If any of the base elements have the GRAPHIC type, then
  * the type returned is GRAPHIC unless the
  * STRINGOFGRAPHIC compiler options specifies that it should
  * be CHARACTER.
  *
  * The following are valid STRING targets:
  *
  * \`\`\`
  *   dcl
  *     1 A,
  *       2 B  bit(8),
  *       2 C  bit(2),
  *       2 D  bit(8);
  *
  *   dcl
  *     1 W,
  *       2 X  char(2),
  *       2 Y  pic'aa',
  *       2 Z  char(6);
  *
  *   dcl
  *     1 W,
  *       2 X  char(2),
  *       2 Y  pic'99',
  *       2 Z char(6);
  * \`\`\`
  *
  * The following are invalid STRING targets:
  *
  * \`\`\`
  *   dcl
  *     1 A,
  *       2 B  bit(8) aligned,
  *       2 C  bit(2),
  *       2 D  bit(8) aligned;
  * \`\`\`
  *
  * @param x Aggregate or element reference.
  * @returns Concatenation of all elements
  *   of x.
  */
 STRING: PROC (x) RETURNS (ANY<CHARACTER>);
    DCL x ANY;
 END;
 /**
  * SYSTEM returns a FIXED BIN(31,0) value that is the return
  * value from the command processor when it is invoked with
  * the command contained in \`x\`.
  *
  * @param [x] Must have a computational type
  *   and should have character type. If not, \`x\` is converted
  *   to character.
  * @returns Return value from the command
  *   processor.
  */
 SYSTEM: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY<CHARACTER> OPTIONAL;
 END;
 SYSPARM: PROC() RETURNS (CHARACTER(*));
 END;
 /**
  * THREADID (short for thread identifier) returns a POINTER
  * value that is the address of the operating system thread
  * identifier for an attached thread.
  *
  * The value returned by this built-in function can be used to
  * invoke system functions, such as DosSetPriority, on
  * Windows, or posix functions on z/OS.
  *
  * To obtain the system thread identifier for the currently
  * executing thread, you must invoke the function appropriate
  * for the platform on which that thread is running. So, on
  * Windows, you should invoke GetCurrentThreadId, and on
  * z/OS, you should invoke pthread_self.
  *
  * @param x Task reference. The value of \`x\`
  *   should have been set previously in the THREAD option of
  *   the ATTACH statement.
  * @returns Address of the OS thread identifier for
  *   the attached thread.
  */
 THREADID: PROC (x) RETURNS (POINTER);
    DCL x ANY<TASK>;
 END;
 /**
  * UNHEX returns a character string that is the decoded value
  * of a hex input string.
  *
  * UNHEX(x) is the reverse of HEX(y), and UNHEX(x, c) is the
  * reverse of HEX(y, c).
  *
  * If x contains non-hex characters, the CONVERSION condition
  * will be raised.
  *
  * @param x An expression that must have
  *   CHARACTER type.
  * @param [c] An expression that must have
  *   CHARACTER(1) NONVARYING type. If specified, it is the
  *   character that separates every 8 characters in x.
  * @returns Decoded value of the hex input
  *   string.
  */
 UNHEX: PROC (x, c) RETURNS (CHARACTER(*));
    DCL x ANY<CHARACTER>;
    DCL c CHARACTER(1) OPTIONAL;
 END;
 /**
  * UNSPEC returns a bit string that is the internal coded form
  * of \`x\`.
  *
  * The UNSPEC built-in function is subject to the following
  * rules:
  *
  * - Under the compiler option USAGE( UNSPEC(IBM) ),
  *   - UNSPEC of structure references and expressions is not
  *   allowed.
  *   - UNSPEC of an array yields an array of BIT.
  * - Under the compiler option USAGE( UNSPEC(ANS) ),
  *   - For aggregates, UNSPEC is allowed only for those that
  *   contain no padding bytes or bits.
  *   - The result will always be BIT scalar. UNSPEC of an
  *   array does not yield an array of BIT.
  *
  * Note: Use of UNSPEC can affect the portability of your
  * program.
  *
  * The length of the returned bit string depends on the
  * attributes of \`x\`, as shown in Table 1.
  *
  * | Bit string length | Attribute of \`x\` |
  * | --- | --- |
  * | 8 | SIGNED FIXED BINARY(p,q), 1 <= p <= 7 UNSIGNED FIXED
  * BINARY(p,q), 1 <= p <= 8 ORDINAL SIGNED PRECISION(p), 1
  * <= p <= 7 ORDINAL UNSIGNED PRECISION(p), 1 <= p <= 8 |
  * | 16 | SIGNED FIXED BINARY(p,q), 8 <= p <= 15 UNSIGNED
  * FIXED BINARY(p,q), 9 <= p <= 16 ORDINAL SIGNED
  * PRECISION(p), 8 <= p <= 15 ORDINAL UNSIGNED PRECISION(p),
  * 9 <= p <= 16 |
  * | 32 | ENTRY LIMITED, under LP(32) SIGNED FIXED
  * BINARY(p,q), 16 <= p <= 31 UNSIGNED FIXED BINARY(p,q),
  * 17 <= p <= 32 ORDINAL SIGNED PRECISION(p), 16 <= p <= 31
  * ORDINAL UNSIGNED PRECISION(p), 17 <= p<= 32 FLOAT
  * BINARY(p), 1 <= p <= 21 FLOAT DECIMAL(p), 1 <= p <= 6 if
  * not DFP FLOAT DECIMAL(p), 1 <= p <= 7 if DFP OFFSET,
  * under OFFSETSIZE(4) FILE constant or variable, under
  * LP(32) POINTER(32) HANDLE(32) |
  * | 64 | ENTRY LIMITED, under LP(64) SIGNED FIXED BINARY(p),
  * 31 < p UNSIGNED FIXED BINARY(p), 32 < p FLOAT BINARY(p),
  * 21 < p < 53 FLOAT DECIMAL(p), 7 <= p <= 16 if not DFP
  * FLOAT DECIMAL(p), 8 <= p <= 16 if DFP OFFSET, under
  * OFFSETSIZE(8) FILE constant or variable, under LP(64)
  * LABEL constant or variable ENTRY constant or variable
  * POINTER(64) HANDLE (64) |
  * | 128 | FLOAT BINARY(p), 54 <= p FLOAT DECIMAL(p),
  * 17 <= p TASK |
  * | n | BIT(n) |
  * | 8*n | CHARACTER(n) PICTURE (with character-string-value
  * length of \`n\`) |
  * | 16*n | GRAPHIC(n) WIDECHAR(n) |
  * | 32*n | UCHAR(n) |
  * | 16+n | BIT(n) VARYING where \`n\` is the maximum length
  * of \`x\` |
  * | 32+n | BIT(n) VARYING4 where \`n\` is the maximum length
  * of \`x\` |
  * | 16+(8*n) | CHARACTER(n) VARYING where \`n\` is the
  * maximum length of \`x\` |
  * | 32+(8*n) | CHARACTER(n) VARYING4 where \`n\` is the
  * maximum length of \`x\` |
  * | 8+(8*n) | CHARACTER(n) VARYINGZ where \`n\` is the
  * maximum length of \`x\` |
  * | 16+(16*n) | GRAPHIC(n) VARYING where \`n\` is the maximum
  * length of \`x\` WIDECHAR(n) VARYING where \`n\` is the
  * maximum length of \`x\` |
  * | 32+(16*n) | GRAPHIC(n) VARYING4 where \`n\` is the
  * maximum length of \`x\` WIDECHAR(n) VARYING4 where n is
  * the maximum length of \`x\` |
  * | 8+(16*n) | GRAPHIC(n) VARYINGZ where \`n\` is the maximum
  * length of \`x\` WIDECHAR(n) VARYINGZ where \`n\` is the
  * maximum length of \`x\` |
  * | 16+(32*n) | UCHAR(n) VARYING where \`n\` is the maximum
  * length of \`x\` |
  * | 32+(32*n) | UCHAR(n) VARYING4 where \`n\` is the maximum
  * length of \`x\` |
  * | 8+(32*n) | UCHAR(n) VARYINGZ where \`n\` is the maximum
  * length of \`x\` |
  * | 8*(n+16) | AREA (n) under LP(32) |
  * | 8*(n+32) | AREA (n) under LP(64) |
  * | 8*FLOOR(n) | FIXED DECIMAL (p,q) where n = (p+2)/2 |
  *
  * Alignment and storage requirements for program-control
  * data can vary across supported systems.
  *
  * If \`x\` is a VARYING or VARYING4 string, its length prefix
  * is included in the returned bit string. If \`x\` is an
  * area, the returned value includes the control information.
  *
  * @param x Scalar, array, structure, or union
  *   expression.
  * @returns Internal coded form of \`x\`.
  */
 UNSPEC: PROC (x) RETURNS (BIT(*));
    DCL x ANY;
 END;
 /**
  * UUID returns a CHARACTER(36) string that is a universally
  * unique identifier that is in version 5 format.
  *
  * The UUID generated by PL/I is a version 5 format UUID per
  * RFC 4122.
  *
  * The name-space information used to construct the UUID
  * consists of:
  *
  * 1. System information:
  *   - CPU count
  *   - MVS name
  *   - storage size
  *   - model and serial
  * 2. Runtime 64 bit TOD value.
  * 3. Job name or, if possible, the PID.
  *
  * The UUID is a SHA1 hash of the above.
  *
  * If the USAGE(UUID(LOWER)) compiler option is in effect,
  * all alphabetic characters in the returned string will be
  * in lowercase. If the USAGE(UUID(UPPER)) compiler option is
  * in effect, all alphabetic characters in the returned
  * string will be in uppercase.
  *
  * @returns A version 5 universally unique
  *   identifier.
  */
 UUID: PROC() RETURNS (CHARACTER(36));
 END;
 /**
  * UUID4 returns a CHARACTER(36) string that is a version 4
  * universally unique identifier.
  *
  * The UUID4 generated by PL/I is a version 4 UUID per RFC
  * 4122. It is meant for generating UUIDs from truly-random
  * or pseudo-random numbers.
  *
  * If the USAGE(UUID(LOWER)) compiler option is in effect,
  * all alphabetic characters in the returned string will be
  * in lowercase. If the USAGE(UUID(UPPER)) compiler option is
  * in effect, all alphabetic characters in the returned
  * string will be in uppercase.
  *
  * @returns A version 4 universally unique
  *   identifier.
  */
 UUID4: PROC() RETURNS (CHARACTER(36));
 END;
 /**
  * VALID returns a BIT(1) value that indicates if the
  * contents of a reference are valid for its data type.
  *
  * VALID(x) returns '1'b if:
  *
  * - x is PICTURE or WIDEPIC and its contents are valid for
  * x's picture specification.
  * - x is FIXED DECIMAL and the data in x is valid packed
  * decimal data.
  * - x is ORDINAL and the data in x is one of the defined
  * values for that ordinal type.
  *
  * Otherwise it returns '0'b.
  *
  * @param x Reference with either PICTURE, FIXED DEC,
  *   or ORDINAL type.
  * @returns '1'b if the contents are valid for the
  *   data type, '0'b otherwise.
  */
 VALID: PROC (x) RETURNS (BIT(1));
    DCL x ANY;
 END;
 /**
  * VALIDVALUE returns a value that indicates whether the value
  * of an expression matches one of the elements in a
  * variable's value set.
  *
  * VALIDVALUE returns a BIT(1) value '1'B if:
  *
  * - x has the VALUELIST attribute and its contents are one
  * of the elements in that list.
  * - x has the VALUERANGE attribute and its contents are
  * within that range.
  *
  * Otherwise, it returns '0'B.
  *
  * If x has the VALUERANGE attribute , the VALIDVALUE test
  * includes the two endpoint values. For example given the
  * declare
  *
  * \`\`\`
  * dcl x  fixed dec(5) valuerange( 1900, 2100 );
  * \`\`\`
  *
  * the test
  *
  * \`\`\`
  * if validvalue( x ) then
  * \`\`\`
  *
  * is equivalent to
  *
  * \`\`\`
  * if (1900 <= x) & (x <= 2100) then
  * \`\`\`
  *
  * @param x A reference that must have the VALUELIST or
  *   VALUERANGE attribute.
  * @param [y] An expression that is to be tested
  *   against the value set for x. If x has a computational
  *   type, then y must also have a computational type and
  *   will be converted, if necessary, to the same type as x;
  *
  *   If x has an ordinal type, then y must have the same
  *   ordinal type.
  *
  *   If y is omitted, it defaults to x. VALIDVALUE(x) is
  *   equivalent to VALIDVALUE(x,x).
  * @returns '1'B if the value matches the value
  *   set, '0'B otherwise.
  */
 VALIDVALUE: PROC (x, y) RETURNS (BIT(1));
    DCL x ANY;
    DCL y ANY OPTIONAL;
 END;
 /**
  * WCHARVAL returns the WIDECHAR(1) value corresponding to an
  * integer.
  *
  * If n is in bigendian format, WCHARVAL(n) has the same bit
  * value as n (that is, UNSPEC(WCHARVAL(n)) is equal to
  * UNSPEC(n)), but it has the attributes WIDECHAR(1).
  *
  * WCHARVAL is the inverse of RANK (when applied to
  * widechar).
  *
  * @param n Expression converted to UNSIGNED
  *   FIXED BIN(16) if necessary.
  * @returns WIDECHAR(1) value corresponding
  *   to n.
  */
 WCHARVAL: PROC (n) RETURNS (WIDECHAR(1));
    DCL n ANY<NUMBER>;
 END;

 /* Ordinal-handling built-in functions */
 /**
  * ORDINALNAME returns a nonvarying character string that is
  * the member of the set associated with the ordinal \`x\`.
  *
  * ORDINALs cannot be used in computational expressions and
  * cannot be converted to character, but ORDINALNAME provides
  * a way to obtain a displayable value for an ORDINAL and can
  * be very useful in debugging.
  *
  * @param x Reference. It must have ordinal
  *   type.
  * @returns Name of the ordinal member
  *   associated with x.
  */
 ORDINALNAME: PROC (x) RETURNS (CHARACTER(*));
    DCL x ANY<ORDINAL>;
 END;
 /**
  * ORDINALPRED returns an ordinal that is the next lower
  * value that the ordinal \`x\` could assume.
  *
  * The returned ordinal has the same type as ordinal \`x\`.
  *
  * @param x Reference. It must have ordinal
  *   type.
  * @returns Next lower ordinal value of the
  *   same type as x.
  */
 ORDINALPRED: PROC (x) RETURNS (ANY<ORDINAL>);
    DCL x ANY<ORDINAL>;
 END;
 /**
  * ORDINALSUCC returns an ordinal that is the next higher
  * value the ordinal \`x\` could assume.
  *
  * The returned ordinal has the same type as ordinal \`x\`.
  *
  * @param x Reference. It must have ordinal
  *   type.
  * @returns Next higher ordinal value of the
  *   same type as x.
  */
 ORDINALSUCC: PROC (x) RETURNS (ANY<ORDINAL>);
    DCL x ANY<ORDINAL>;
 END;

 /* Precision-handling built-in functions */
 /**
  * ADD returns the sum of \`x\` and \`y\` with a precision
  * specified by \`p\` and \`q\`. If both operands are FIXED and
  * at least one is FIXED BIN, then the base, precision, and
  * scale are determined by the PRECTYPE compiler option.
  * Otherwise, the base, precision, and scale are determined
  * by the rules for expression evaluation. The mode is REAL
  * if both operands are REAL; otherwise, it is COMPLEX.
  *
  * ADD can be used for subtraction by prefixing a minus sign
  * to the operand to be subtracted.
  *
  * @param x Expression.
  * @param y Expression.
  * @param p Restricted expression. It specifies
  *   the number of digits to be maintained throughout the
  *   operation.
  * @param [q] Restricted expression specifying
  *   the scaling factor of the result. For a fixed-point
  *   result, if \`q\` is omitted, a scaling factor of zero is
  *   the default, and if not omitted, it must be nonnegative.
  *   For a floating-point result, \`q\` must be omitted.
  * @returns Sum of x and y with the specified
  *   precision.
  */
 ADD: PROC (x, y, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER>;
    DCL p ANY<NUMBER>;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * BINARY returns the binary value of \`x\`, with a precision
  * specified by \`p\` and \`q\`. The result has the mode and
  * scale of \`x\`.
  *
  * Abbreviation: BIN
  *
  * If both \`p\` and \`q\` are omitted, the precision of the
  * result is determined from the rules for base conversion.
  *
  * @param x Expression.
  * @param [p] Restricted expression. Specifies
  *   the number of digits to be maintained throughout the
  *   operation; it must not exceed the implementation limit.
  * @param [q] Restricted expression specifying
  *   the scaling factor of the result. For a fixed-point
  *   result, if \`q\` is omitted, a scaling factor of zero is
  *   the default, and if not omitted, it must be nonnegative.
  *   For a floating-point result, \`q\` must be omitted.
  * @returns Binary value of x with the
  *   specified precision.
  */
 BINARY: BIN: PROC (x, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * DECIMAL returns the decimal value of \`x\`, with a
  * precision specified by \`p\` and \`q\`. The result has the
  * mode and scale of \`x\`.
  *
  * Abbreviation: DEC
  *
  * If both \`p\` and \`q\` are omitted, the precision of the
  * result is determined from the rules for base conversion.
  *
  * @param x Reference.
  * @param [p] Restricted expression specifying
  *   the number of digits to be maintained throughout the
  *   operation.
  * @param [q] Restricted expression specifying
  *   the scaling factor of the result. For a fixed-point
  *   result, if \`q\` is omitted, a scaling factor of zero is
  *   the default, and if not omitted, it must be nonnegative.
  *   For a floating-point result, \`q\` must be omitted.
  * @returns Decimal value of x with the
  *   specified precision.
  */
 DECIMAL: DEC: PROC (x, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * DIVIDE returns the quotient of \`x/y\` with a precision
  * specified by \`p\` and \`q\`. If both operands are FIXED and
  * at least one is FIXED BIN, then the base, precision, and
  * scale are determined by the PRECTYPE compiler option.
  * Otherwise, the base, precision, and scale are determined
  * by the rules for expression evaluation. The mode is REAL
  * if both operands are REAL; otherwise, it is COMPLEX.
  *
  * @param x Expression.
  * @param y Expression. If \`y\` = 0, the
  *   ZERODIVIDE condition is raised.
  * @param p Restricted expression specifying
  *   the number of digits to be maintained throughout the
  *   operation.
  * @param [q] Restricted expression specifying
  *   the scaling factor of the result. For a fixed-point
  *   result, if \`q\` is omitted, a scaling factor of zero is
  *   the default, and if not omitted, it must be nonnegative.
  *   For a floating-point result, \`q\` must be omitted.
  * @returns Quotient of x/y with the specified
  *   precision.
  */
 DIVIDE: PROC (x, y, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER>;
    DCL p ANY<NUMBER>;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * FIXED returns the fixed-point value of \`x\`, with a
  * precision specified by \`p\` and \`q\`. The result has the
  * base and mode of \`x\`.
  *
  * If both p and q are omitted, the default values, (15,0)
  * for a binary result or (5,0) for a decimal result, are
  * used.
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the total number of digits in the result. It
  *   must not exceed the implementation limit.
  * @param [q] Restricted expression that
  *   specifies the scaling factor of the result. If \`q\` is
  *   omitted, a scaling factor of zero is assumed. If \`q\` is
  *   specified, it must be nonnegative.
  * @returns Fixed-point value of x with the
  *   specified precision.
  */
 FIXED: PROC (x, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * FIXEDBIN returns a FIXED BIN value with precision and
  * scale derived from the source unless explicitly specified
  * as parameters to the function.
  *
  * If both \`p\` and \`q\` are omitted, the precision of the
  * result is determined from the source according to this
  * table:
  *
  * | source | result |
  * | --- | --- |
  * | FIXED BIN(p,q) | FIXED BIN(p,q) |
  * | FIXED DEC(p,q) | FIXED BIN(r,s) where r =
  * min(M,1+CEIL(p*3.32)) and s = CEIL(ABS(q*3.32))*SIGN(q) |
  * | FLOAT BIN(p) | FIXED BIN(p,0) |
  * | FLOAT DEC(p) | FIXED BIN(r,0) where r =
  * min(M,CEIL(p*3.32)) |
  * | BIT | FIXED BIN(M,0) |
  * | CHAR, GRAPHIC, UCHAR, or WIDECHAR | FIXED BIN(r,0)
  * where r = min(M,1+CEIL(N*3.32)) |
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the total number of digits in the result. It
  *   must not exceed the implementation limit.
  * @param [q] Restricted expression that
  *   specifies the scaling factor of the result. If \`q\` is
  *   omitted, a scaling factor of zero is assumed. If \`q\` is
  *   specified, it must be nonnegative.
  * @returns FIXED BIN value of x with the
  *   specified precision and scale.
  */
 FIXEDBIN: PROC (x, p, q) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * FIXEDDEC returns a FIXED DEC value with precision and
  * scale derived from the source unless explicitly specified
  * as parameters to the function.
  *
  * If both \`p\` and \`q\` are omitted, the precision of the
  * result is determined from the source according to this
  * table:
  *
  * | source | result |
  * | --- | --- |
  * | FIXED BIN(p,q) | FIXED DEC(r,s) where r =
  * min(N,1+CEIL(p/3.32)) and s=CEIL(ABS(q/3.32))*SIGN(q) |
  * | FIXED DEC(p,q) | FIXED DEC(p,q) |
  * | FLOAT BIN(p) | FIXED DEC(r,0) where r =
  * min(N,CEIL(p/3.32) |
  * | FLOAT DEC(p) | FIXED DEC(p,0) |
  * | BIT | FIXED DEC(r,0) where where r =
  * min(N,1+CEIL(M/3.32)) |
  * | CHAR, GRAPHIC, UCHAR, or WIDECHAR | FIXED DEC(N,0) |
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the total number of digits in the result. It
  *   must not exceed the implementation limit.
  * @param [q] Restricted expression that
  *   specifies the scaling factor of the result. If \`q\` is
  *   omitted, a scaling factor of zero is assumed. If \`q\` is
  *   specified, it must be nonnegative.
  * @returns FIXED DEC value of x with the
  *   specified precision and scale.
  */
 FIXEDDEC: PROC (x, p, q) RETURNS (FIXED DECIMAL);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * FLOAT returns the approximate floating-point value of
  * \`x\`, with a precision specified by \`p\`. The result has
  * the base and mode of \`x\`.
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the minimum number of digits in the result.
  *
  *   If \`p\` is omitted, the precision of the result is
  *   determined from the rules for base conversion.
  *
  *   If \`p\` is omitted, the default value, 15 for a binary
  *   result or 5 for a decimal result, is used.
  * @returns Approximate floating-point value of x
  *   with the specified precision.
  */
 FLOAT: PROC (x, p) RETURNS (FLOAT);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
 END;
 /**
  * FLOATBIN returns a FLOAT BIN value with precision derived
  * from the source unless explicitly specified as a parameter
  * to the function.
  *
  * If \`p\` is omitted, the precision of the result is
  * determined from the source according to this table:
  *
  * | source | result |
  * | --- | --- |
  * | FIXED BIN(p,q) | FLOAT BIN(p) |
  * | FIXED DEC(p,q) | FLOAT BIN(r) where r = CEIL(p*3.32) |
  * | FLOAT BIN(p) | FLOAT BIN(p) |
  * | FLOAT DEC(p) | FLOAT BIN(r) where r = CEIL(p*3.32) |
  * | BIT | FLOAT BIN(M) |
  * | CHAR, GRAPHIC, UCHAR, or WIDECHAR | FLOAT BIN(r) where
  * r = CEIL(N*3.32) |
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the total number of digits in the result. It
  *   must not exceed the implementation limit.
  * @returns FLOAT BIN value of x with the
  *   specified precision.
  */
 FLOATBIN: PROC (x, p) RETURNS (FLOAT BINARY);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
 END;
 /**
  * FLOATDEC returns a FLOAT DEC value with precision derived
  * from the source unless explicitly specified as a parameter
  * to the function.
  *
  * If \`p\` is omitted, the precision of the result is
  * determined from the source according to this table:
  *
  * | source | result |
  * | --- | --- |
  * | FIXED BIN(p,q) | FLOAT DEC(r) where r = CEIL(p/3.32) |
  * | FIXED DEC(p,q) | FLOAT DEC(p) |
  * | FLOAT BIN(p) | FLOAT DEC(r) where r = CEIL(p/3.32) |
  * | FLOAT DEC(p) | FLOAT DEC(p) |
  * | BIT | FLOAT DEC(r) where r = CEIL(M/3.32) |
  * | CHAR, GRAPHIC, UCHAR, or WIDECHAR | FLOAT DEC(N) |
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the total number of digits in the result. It
  *   must not exceed the implementation limit.
  * @returns FLOAT DEC value of x with the
  *   specified precision.
  */
 FLOATDEC: PROC (x, p) RETURNS (FLOAT DECIMAL);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
 END;
 /**
  * MULTIPLY returns the product of \`x\` and \`y\`, with a
  * precision specified by \`p\` and \`q\`.
  *
  * If both operands are FIXED and at least one is FIXED BIN,
  * then the base, precision, and scale are determined by the
  * PRECTYPE compiler option. Otherwise, the base, precision,
  * and scale are determined by the rules for expression
  * evaluation. The mode is REAL if both operands are REAL;
  * otherwise, it is COMPLEX.
  *
  * Note that when applied to FIXED DECIMAL, then if the
  * mathematical result is too big for the specified precision
  * \`p\` but less than the maximum implementation value,
  *
  * - if SIZE is disabled, the FIXEDOVERFLOW condition will
  * not be raised and the result will be truncated
  * - if SIZE is enabled, the SIZE condition will be raised
  *
  * Note that the above text is false when the non-default
  * compiler option DECIMAL(FOFLONMULT) is in effect. In that
  * case, FIXEDOVERFLOW will be raised if SIZE is disabled
  * (and the result is too big).
  *
  * @param x Expression.
  * @param y Expression.
  * @param p Restricted expression that
  *   specifies the number of digits to be maintained
  *   throughout the operation.
  * @param [q] Restricted expression specifying
  *   the scaling factor of the result. For a fixed-point
  *   result, if \`q\` is omitted, a scaling factor of zero is
  *   the default, and if not omitted, it must be nonnegative.
  *   For a floating-point result, \`q\` must be omitted.
  * @returns Product of x and y with the
  *   specified precision.
  */
 MULTIPLY: PROC (x, y, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER>;
    DCL p ANY<NUMBER>;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * PRECVAL returns a FIXED BINARY(31) value giving the
  * precision for a numeric expression.
  *
  * For example, if x is declared as FIXED DEC(9,3), PRECVAL(x)
  * returns 9.
  *
  * @param x A numeric expression.
  * @returns Precision of the numeric
  *   expression.
  */
 PRECVAL: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY<NUMBER>;
 END;
 /**
  * PRECISION returns the value of \`x\`, with a precision
  * specified by \`p\` and \`q\`. The base, mode, and scale of
  * the returned value are the same as that of \`x\`.
  *
  * Abbreviation: PREC
  *
  * @param x Expression.
  * @param p Restricted expression. \`p\` specifies
  *   the number of digits that the value of the expression
  *   \`x\` is to have after conversion.
  * @param [q] Restricted expression specifying
  *   the scaling factor of the result. For a fixed-point
  *   result, if \`q\` is omitted, a scaling factor of zero is
  *   the default, and if not omitted, it must be nonnegative.
  *   For a floating-point result, \`q\` must be omitted.
  * @returns Value of x with the specified
  *   precision.
  */
 PRECISION: PREC: PROC (x, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER>;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * SCALEVAL returns a FIXED BINARY(31) value giving the scale
  * factor for a numeric expression.
  *
  * If x is FLOAT, the value returned is 0.
  *
  * For example, if x is declared as FIXED DEC(9,3), SCALEVAL(x)
  * returns 3.
  *
  * @param x A numeric expression.
  * @returns Scale factor of the numeric
  *   expression.
  */
 SCALEVAL: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY<NUMBER>;
 END;
 /**
  * SIGNED returns a signed FIXED BINARY value of \`x\`, with a
  * precision specified by \`p\` and \`q\`.
  *
  * @param x Expression.
  * @param [p] Restricted expression that
  *   specifies the number of digits to be maintained
  *   throughout the operation.
  * @param [q] Restricted expression that
  *   specifies the scaling factor of the result. If \`q\` is
  *   omitted, a scaling factor of zero is assumed. If \`q\` is
  *   specified, it must be nonnegative.
  * @returns Signed FIXED BINARY value of x
  *   with the specified precision.
  */
 SIGNED: PROC (x, p, q) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * SUBTRACT is equivalent to ADD(x,-y,p,q).
  *
  * For details about arguments, see ADD for argument
  * descriptions.
  *
  * @param x Expression.
  * @param y Expression.
  * @param p Restricted expression specifying
  *   the number of digits to be maintained.
  * @param [q] Restricted expression specifying
  *   the scaling factor. Omit for floating-point results.
  * @returns Difference of x and y with the
  *   specified precision.
  */
 SUBTRACT: PROC (x, y, p, q) RETURNS (ANY<NUMBER>);
    DCL x ANY<NUMBER>;
    DCL y ANY<NUMBER>;
    DCL p ANY<NUMBER>;
    DCL q ANY<NUMBER> OPTIONAL;
 END;
 /**
  * UNSIGNED returns an unsigned FIXED BINARY value of \`x\`,
  * with a precision specified by \`p\` and \`q\`.
  *
  * @param x Expression.
  * @param [p] Integer. It specifies the number
  *   of digits to be maintained throughout the operation.
  * @param [q] Restricted expression that
  *   specifies the scaling factor of the result. If \`q\` is
  *   omitted, a scaling factor of zero is assumed. If \`q\` is
  *   specified, it must be nonnegative.
  * @returns Unsigned FIXED BINARY value of x
  *   with the specified precision.
  */
 UNSIGNED: PROC (x, p, q) RETURNS (FIXED BINARY);
    DCL x ANY<NUMBER>;
    DCL p ANY<NUMBER> OPTIONAL;
    DCL q ANY<NUMBER> OPTIONAL;
 END;

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
 /**
  * ADDR returns the pointer value that identifies the generation of
  * \`x\`.
  *
  * @param x Reference. It refers to a variable of any data
  *   type, data organization, alignment, and storage class except:
  *
  *   - A subscripted reference to a variable that is an unaligned
  *   fixed-length bit string
  *   - A reference to a DEFINED or BASED variable or simple
  *   parameter, which is an unaligned fixed-length bit string
  *   - A minor structure or union whose first base element is an
  *   unaligned fixed-length bit string (except where it is also
  *   the first element of the containing major structure or union)
  *   - A major structure or union that has the DEFINED attribute or
  *   is a parameter, and that has an unaligned fixed-length bit
  *   string as its first element
  *   - A reference that is not to connected storage
  *
  *   If \`x\` is a reference to:
  *
  *   - An aggregate parameter, it must have the CONNECTED attribute
  *   - An aggregate, the returned value identifies the first
  *   element
  *   - A component or cross section of an aggregate, the returned
  *   value takes into account subscripting and structure or union
  *   qualification
  *   - A VARYING string, the returned value identifies the 2-byte
  *   prefix
  *   - A VARYING4 string, the returned value identifies the 4-byte
  *   prefix
  *   - An area, the returned value identifies the control
  *   information
  *   - A controlled variable that is not allocated in the current
  *   program, the null pointer value is returned
  *   - A based variable, the result is the value of the pointer
  *   explicitly qualifying \`x\` (if it appears), or associated
  *   with \`x\` in its declaration (if it exists), or a null
  *   pointer
  *   - A parameter, and a dummy argument has been created, the
  *   returned value identifies the dummy argument
  * @returns The pointer value that identifies the
  *   generation of \`x\`.
  */
 ADDR: PROC (x) RETURNS (ANY<LOCATOR>);
    DCL x ANY;
 END;
 /**
  * ADDRDATA returns the pointer value that identifies the
  * generation of \`x\`.
  *
  * ADDRDATA behaves the same as the ADDR built-in function except
  * in the following instance:
  *
  * - When applied to a varying string, ADDRDATA returns the address
  * of the first data byte of the string (rather than of the length
  * field).
  * - When applied to an OFFSET reference with the LOCATES attribute
  * and implicit AREA qualification:
  *   - If the OFFSET reference is not null, ADDRDATA returns the
  *   address of the located data.
  *   - If the OFFSET reference is null, ADDRDATA returns SYSNULL.
  *
  * @param x Reference.
  * @returns The pointer value that identifies the
  *   generation of \`x\`.
  */
 ADDRDATA: PROC (x) RETURNS (ANY<LOCATOR>);
    DCL x ANY;
 END;
 /**
  * ALLOC31 allocates storage of size n in heap storage below the
  * bar and returns the pointer to the allocated storage.
  *
  * @param n Expression. Nonnegative value that
  *   represents the storage size to be allocated. If necessary, n
  *   is converted to type size_t 1.
  *
  *   If the requested amount of storage is not available, the
  *   STORAGE condition is raised.
  * @returns The pointer to the allocated storage.
  */
 ALLOC31: PROC (n) RETURNS (ANY<LOCATOR>);
    DCL n ANY<NUMBER>;
 END;
 /**
  * ALLOCATE allocates storage of size \`n\` in heap storage and
  * returns the pointer to the allocated storage. You can also use
  * ALLOCATE to allocate the specified size in the specified area.
  *
  * Abbreviation: ALLOC
  *
  * @param n Expression. Nonnegative value that
  *   represents the storage size to be allocated. If necessary,
  *   \`n\` is converted to type size_t 1.
  *
  *   If the requested amount of storage is not available, the
  *   STORAGE condition is raised.
  * @param [x] AREA reference. When you specify
  *   ALLOCATE(n, x), the specified number of bytes n is allocated
  *   within that area. The number is rounded up to a multiple of 8.
  *
  *   If there is insufficient space within the specified area, the
  *   AREA condition is raised.
  * @returns The pointer to the allocated storage.
  */
 ALLOCATE: ALLOC: PROC (n, x) RETURNS (ANY<LOCATOR>);
    DCL n ANY<NUMBER>;
    DCL x ANY<AREA> OPTIONAL;
 END;
 /**
  * ALLOCATION returns a FIXED BINARY(31,0) specifying the number of
  * generations that can be accessed in the current program for
  * \`x\`.
  *
  * Abbreviation: ALLOCN
  *
  * If \`x\` is not allocated in the current program, the result is
  * zero.
  *
  * @param x Level-1 unsubscripted controlled variable.
  * @returns The number of generations of \`x\`
  *   that can be accessed in the current program.
  */
 ALLOCATION: ALLOCN: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY;
 END;
 /**
  * ALLOCNEXT allocates storage of the specified size in an AREA if
  * there is enough space in the first available chunk and returns a
  * pointer to the allocated storage (or if there is not enough
  * space, it returns sysnull).
  *
  * If the first available chunk in x is large enough, the storage
  * is allocated from x and a pointer to the allocated storage is
  * returned.
  *
  * If the first available chunk is not large enough, sysnull is
  * returned. Unlike the ALLOCATE built-in function, neither the
  * STORAGE nor the AREA condition is raised.
  *
  * ALLOCNEXT(n,x) generates much shorter and faster code than
  * ALLOCATE(n,x), but the user must check that a non-null pointer
  * is returned. It is best suited when repeated allocations are
  * made from an AREA without any FREEs or when all the FREEs from
  * an AREA are in reverse order from all the ALLOCATEs.
  *
  * @param n Expression. A nonnegative value that
  *   represents the storage size to be allocated. It is rounded up
  *   to the nearest multiple of 8. If necessary, n is converted to
  *   a size_t value.
  * @param x AREA reference.
  * @returns Pointer to the allocated storage, or
  *   sysnull if there is not enough space.
  */
 ALLOCNEXT: PROC (n, x) RETURNS (ANY<LOCATOR>);
    DCL n ANY<NUMBER>;
    DCL x ANY<AREA>;
 END;
 /**
  * ALLOCSIZE returns a FIXED BIN(31,0) value giving the amount of
  * storage allocated with a specified pointer. To use this built-in
  * function, you must also specify the CHECK(STORAGE) compile-time
  * option.
  *
  * ALLOCSIZE returns 0 if the pointer does not point to the start
  * of a piece of allocated storage.
  *
  * Note that the pointer passed to ALLOCSIZE is "rounded down" to
  * the nearest doubleword and that rounded value is compared
  * against all allocated addresses when similarly rounded down.
  *
  * @param p Pointer expression.
  * @returns The amount of storage allocated with
  *   the specified pointer.
  */
 ALLOCSIZE: PROC (p) RETURNS (FIXED BINARY(31));
    DCL p ANY<LOCATOR>;
 END;
 /**
  * AUTOMATIC allocates storage of size \`n\` automatic storage and
  * returns the pointer to the allocated storage.
  *
  * Abbreviation: AUTO
  *
  * The storage acquired cannot be explicitly freed; the storage is
  * automatically freed when the block terminates.
  *
  * @param n Expression. n must be nonnegative. If
  *   necessary, n is converted to type size_t 1.
  * @returns The pointer to the allocated storage.
  */
 AUTOMATIC: AUTO: PROC (n) RETURNS (ANY<LOCATOR>);
    DCL n ANY<NUMBER>;
 END;
 /**
  * AVAILABLEAREA returns a size_t 1 value that indicates the size
  * of the largest single allocation that can be obtained from the
  * area x.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Uarea area(1000);
  *   dcl Pz ptr;
  *   dcl C99z char(99) varyingz based(Pz);
  *   dcl (SizeBefore, SizeAfter) fixed bin(31);
  *   SizeBefore = availablearea(Uarea);         // returns 1000
  *   Alloc C99z in(Uarea);
  *   SizeAfter = availablearea(Uarea);          // returns 896
  *   dcl C9 char(896) based(Pz);
  *   Alloc C9 in(Uarea);
  * \`\`\`
  *
  * @param x A reference with the AREA attribute
  * @returns The size of the largest single
  *   allocation that can be obtained from the area \`x\`.
  */
 AVAILABLEAREA: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<AREA>;
 END;
 /**
  * BINARYVALUE converts \`x\`, which can be a pointer, offset, or
  * ordinal, to an integer. The function returns a FIXED BIN value
  * that is the converted value.
  *
  * If x is a pointer, the return value has type size_t 1. If x is
  * an ordinal, the return value has type FIXED BIN(31). If x is an
  * offset, the return value has type FIXED BIN(31) under
  * OFFSETSIZE(4) and FIXED BIN(63) under OFFSETSIZE(8).
  *
  * Abbreviation: BINVALUE
  *
  * @param x Expression
  * @returns The converted integer value.
  */
 BINARYVALUE: BINVALUE: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * BITLOCATION returns a FIXED BINARY(31,0) result that is the
  * location of bit \`x\` within the byte that contains \`x\`. The
  * value returned is always between 0 and 7 (0 ≤ value ≤ 7).
  *
  * Abbreviation: BITLOC
  *
  * BITLOCATION can be used in restricted expressions, with the
  * following limitations. If BITLOC(x) is used to set:
  *
  * - The extent of a variable \`y\` that must have constant
  * extents, or
  * - The value of a variable \`y\` that must have a constant value,
  *
  * then \`x\` must be declared before \`y\`.
  *
  * For examples, see LOCATION.
  *
  * @param x Reference of type unaligned bit. If \`x\` does
  *   not have type unaligned bit, a value of 0 is returned.
  *
  *   \`x\` must not be subscripted.
  * @returns The location of bit \`x\` within the
  *   byte that contains \`x\`.
  */
 BITLOCATION: BITLOC: PROC (x) RETURNS (FIXED BINARY(31));
    DCL x ANY;
 END;
 /**
  * CHECKSTG returns a bit(1) value which indicates whether a
  * specified pointer value is the start of a piece of uncorrupted
  * allocated storage. If no pointer value is supplied, CHECKSTG
  * determines whether all allocated storage is uncorrupted. To use
  * this built-in function, you must also specify the CHECK(STORAGE)
  * compile-time option.
  *
  * When an allocation is made, it is followed by eight extra bytes
  * which are set to 'ff'x. The allocation is considered uncorrupted
  * if those bytes have not been altered.
  *
  * The pointer expression must point to storage allocated for a
  * BASED variable.
  *
  * @param [p] Pointer expression.
  * @returns '1'B if the specified pointer value is the
  *   start of uncorrupted allocated storage.
  */
 CHECKSTG: PROC (p) RETURNS (BIT(1));
    DCL p ANY<LOCATOR> OPTIONAL;
 END;
 /**
  * CURRENTSIZE returns a FIXED BIN value that gives the
  * implementation-defined storage, in bytes, required by x.
  *
  * The value returned by CURRENTSIZE(x) is defined as the number of
  * bytes that would be transmitted in the following circumstances:
  *
  * \`\`\`
  *   declare F file record output
  *           environment(scalarvarying);
  *   write file(F) from(S);
  * \`\`\`
  *
  * If \`x\` is a scalar varying-length string, the returned value
  * includes the length-prefix of the string and the number of
  * currently-used bytes. It does not include any unused bytes in
  * the string.
  *
  * If \`x\` is a scalar area, the returned value includes the area
  * control bytes and the current extent of the area. It does not
  * include any unused bytes at the end of the area.
  *
  * If \`x\` is an aggregate containing areas or varying-length
  * strings, the returned value includes the area control bytes, the
  * maximum sizes of the areas, the length prefixes of the strings,
  * and the number of bytes in the maximum lengths of the strings.
  * There is an exception to this rule:
  *
  * - If \`x\` is a structure or union whose last element is a
  * nondimensioned area, the returned value includes that area's
  * control bytes and the current extent of that area. It does not
  * include any unused bytes at the end of that area.
  *
  * The CURRENTSIZE built-in function must not be used on a BASED
  * variable with adjustable extents if that variable has not been
  * allocated.
  *
  * Under the CMPAT(V3) compiler option, CURRENTSIZE returns a FIXED
  * BIN(63) value. Under all other CMPAT options, it returns a FIXED
  * BIN(31) value.
  *
  * For examples of the CURRENTSIZE built-in function, see SIZE.
  *
  * @param x A variable of any data type, data organization,
  *   and storage class except those in the following list:
  *
  *   - A BASED, DEFINED, parameter, subscripted, or structure or
  *   union base-element variable that is an unaligned fixed-length
  *   bit string
  *   - A minor structure or union whose first or last base element
  *   is an unaligned fixed-length bit string (except where it is
  *   also the first or last element of the containing major
  *   structure or union)
  *   - A major structure or union that has the BASED, DEFINED, or
  *   parameter attribute, and that has an unaligned fixed-length
  *   bit string as its first or last element
  *   - A variable not in connected storage
  * @returns The storage required by \`x\` in bytes.
  */
 CURRENTSIZE: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * CURRENTSTORAGE is a synonym for CURRENTSIZE.
  *
  * Abbreviation: CSTG
  *
  * Note: The USAGE(HEX(CSTG) is accepted as a synonym for
  * USAGE(HEX(CURRENTSIZE) in Enterprise PL/I for z/OS Version 6
  * Release 1.
  *
  * @param x A variable of any data type, data organization,
  *   and storage class.
  * @returns The storage required by \`x\` in bytes.
  */
 CURRENTSTORAGE: CSTG: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * EMPTY returns an area of zero extent. It can be used to free all
  * allocations in an area.
  *
  * The value of this function is assigned to an area variable when
  * the variable is allocated. Consider this example:
  *
  * \`\`\`
  *   declare A area,
  *           I based (P),
  *           J based (Q);
  *
  *   allocate I in(A), J in (A);
  *   A = empty();
  *
  *   // Equivalent to:  free I in (A), J in (A);
  * \`\`\`
  * @returns An area of zero extent.
  */
 EMPTY: PROC () RETURNS (ANY<AREA>);
 END;
 /**
  * ENTRYADDR returns a pointer value that is the address of the
  * entry point of the entry reference \`x\`. This may be a pointer
  * to an AMODE changing glue code used to call \`x\`.
  *
  * If \`x\` is a fetchable entry constant, it must be fetched
  * before ENTRYADDR is executed. However, if \`x\` has been
  * released, then ENTRYADDR will return SYSNULL.
  *
  * @param x Entry reference.
  * @returns The address of the entry point of \`x\`.
  */
 ENTRYADDR: PROC (x) RETURNS (ANY<LOCATOR>);
    DCL x ANY<ENTRY>;
 END;
 /**
  * HANDLE returns a handle to the typed structure \`x\`.
  *
  * @param x Typed structure.
  * @returns A handle to the typed structure \`x\`.
  */
 HANDLE: PROC (x) RETURNS (ANY);
    DCL x ANY<STRUCTURE>;
 END;
 /**
  * LOCATION returns a FIXED BIN value that specifies the byte
  * location of x within the level-1 structure or union that has
  * member x.
  *
  * Abbreviation: LOC
  *
  * LOCATION can be used in restricted expressions, with a
  * limitation. The value for \`x\` must be declared before \`y\` if
  * LOC(x) is used to set either of the following:
  *
  * - The extent of a variable \`y\` that must have constant
  * extents.
  * - The value of a variable \`y\` that must have a constant value.
  *
  * Under the CMPAT(V3) compiler option, LOCATION returns a FIXED
  * BIN(63) value. Under all other CMPAT options, it returns a FIXED
  * BIN(31) value.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl 1 Table static,
  *         2 Tab2loc fixed bin(15) nonasgn init(loc(Tab2)),
  *                     // location is 0; gets initialized to 8
  *         2 Tab3loc fixed bin(15) nonasgn init(loc(Tab3)),
  *                     // location is 2; gets initialized to 808
  *         2 Length fixed bin nonasgn init(loc(End)),
  *                     // location is 4
  *         2 * fixed bin,
  *         2 Tab2(20,20)    fixed bin,
  *                     // location is 8
  *         2 Tab3(20,20)    fixed bin,
  *                     // location is 808
  *
  *         2 F2_loc fixed bin nonasgn init(loc(F2)),
  *                     // location is 1608; gets initialized to  1612
  *         2 F2_bitloc fixed bin nonasgn init(bitloc(F2)),
  *                     // location is 1610; gets initialized to 1
  *
  *         2 Flags,        // location is 1612
  *           3 F1 bit(1),
  *           3 F2 bit(1),  // bitlocation is 1
  *           3 F3 bit(1),
  *         2 Bits(16) bit, // location is 1613
  *         2 End char(0);
  * \`\`\`
  *
  * @param x Structure or union member name. If \`x\` is not
  *   a member of a structure or union, a value of 0 is returned. If
  *   \`x\` has the BIT attribute, the value returned by LOCATION is
  *   the location of the byte that contains \`x\`.
  *
  *   The value for \`x\` must not be subscripted.
  * @returns The byte location of \`x\` within the
  *   level-1 structure or union.
  */
 LOCATION: LOC: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * LOCSTG(x) returns a FIXED BIN value that specifies the number of
  * bytes that are needed for the storage to hold all the elements
  * of x that have the LOCATES attributes.
  *
  * The return value has type FIXED BIN(63) under CMPAT(V3);
  * otherwise, it has type FIXED BIN(31).
  *
  * **Example**
  *
  * With the following declaration, the reference locstag(data)
  * returns the value 96*actual_count:
  *
  * \`\`\`
  * 	      declare
  *              1 data based(data_ptr) unaligned,
  *                  2 actual_count fixed bin(31),
  *                  2 orderinfo(order_count refer( actual_count)),
  *                     3 name     offset(pool)
  *                        locates(char(30) varying),
  *                     3 address offset(pool)
  *                        locates(char(62) varying),
  *                  2 pool area(10_000);
  * \`\`\`
  *
  * @param x Must be a reference that has the LOCATES
  *   attribute or contains subelements that have the LOCATES
  *   attribute.
  * @returns The number of bytes needed for the
  *   storage of elements with LOCATES attributes.
  */
 LOCSTG: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * LOCVAL(x, a) returns the value at the offset that is specified
  * by x in the a area. The type of the value is specified in the
  * LOCATES attribute of x.
  *
  * Do not use a LOCVAL reference as the argument to the ADDR
  * built-in function. To obtain the address of such a reference,
  * apply the POINTER built-in function to the corresponding OFFSET.
  *
  * **Example**
  *
  * With the following declaration, these two references are
  * equivalent: locval(name(1)); and locval(name(1), pool);. Both
  * references return the char(30) varying value at the location in
  * pool with the offset held in name(1).
  *
  * \`\`\`
  * 	      declare
  *               1 data based(data_ptr) unaligned,
  *                  2 actual_count fixed bin(31),
  *                  2 orderinfo(order_count refer( actual_count)),
  *                     3 name     offset(pool)
  *                        locates(char(30) varying),
  *                     3 address offset(pool)
  *                        locates(char(62) varying),
  *                  2 pool area(10_000);
  * \`\`\`
  *
  * @param x Must be an OFFSET with the LOCATES
  *   attribute. It must be a valid, non-null offset into the area a.
  * @param [a] Must be an AREA reference. If you do not
  *   specify a, the OFFSET attribute for x must have specified an
  *   AREA reference, and the offset is assumed to be from that area.
  * @returns The value at the offset specified by \`x\` in the
  *   \`a\` area.
  */
 LOCVAL: PROC (x, a) RETURNS (ANY);
    DCL x ANY<LOCATOR>;
    DCL a ANY<AREA> OPTIONAL;
 END;
 /**
  * NULL returns the null pointer value. The null pointer value does
  * not identify any generation of a variable. The null pointer
  * value can be assigned to and compared with handles. The null
  * pointer value can be converted to OFFSET by assignment of the
  * built-in function value to an offset variable.
  * @returns The null pointer value.
  */
 NULL: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * NULLENTRY returns a limited entry that has a null value.
  *
  * NULLENTRY can be assigned to or compared with any other entry
  * variable.
  *
  * You can use NULLENTRY to initialize an entry variable in static
  * storage.
  *
  * You cannot use NULLENTRY as one of the arguments to the PLISRTA,
  * PLISRTB, PLISRTC or PLISRTD built-in functions.
  *
  * ENTRYADDR(NULLENTRY) returns the same value as SYSNULL.
  * @returns A limited entry with a null value.
  */
 NULLENTRY: PROC () RETURNS (ANY<ENTRY>);
 END;
 /**
  * OFFSET returns an offset value derived from a pointer reference
  * \`x\` and relative to an area \`y\`. If x is the null pointer
  * value, the null offset value is returned.
  *
  * If \`x\` is an element reference, \`y\` must be an element
  * variable.
  *
  * @param x Pointer reference. It must identify a
  *   generation of a based variable within the area \`y\`, or be
  *   the null pointer value.
  * @param y Area reference.
  * @returns An offset value derived from the pointer
  *   \`x\` relative to the area \`y\`.
  */
 OFFSET: PROC (x, y) RETURNS (ANY<LOCATOR>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<AREA>;
 END;
 /**
  * OFFSETADD returns the sum of the arguments.
  *
  * @param x Expression. \`x\` must be specified as
  *   OFFSET.
  * @param y Expression. \`y\` must have a
  *   computational type and is converted to FIXED BINARY.
  * @returns The sum of the arguments.
  */
 OFFSETADD: PROC (x, y) RETURNS (ANY<LOCATOR>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<NUMBER>;
 END;
 /**
  * OFFSETDIFF returns a FIXED BIN value that is the arithmetic
  * difference between the arguments.
  *
  * The return value has type FIXED BIN(31) under OFFSETSIZE(4) or
  * type FIXED BIN(63) under OFFSETSIZE(8).
  *
  * @param x Expression. Must be specified as OFFSET.
  * @param y Expression. Must be specified as OFFSET.
  * @returns The arithmetic difference between \`x\`
  *   and \`y\`.
  */
 OFFSETDIFF: PROC (x, y) RETURNS (FIXED BINARY);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
 END;
 /**
  * OFFSETSUBTRACT is equivalent to OFFSETADD(x,-y).
  *
  * @param x Expressions. \`x\` must be specified as
  *   OFFSET.
  * @param y Expression. \`y\` must have a
  *   computational type and is converted to FIXED BINARY.
  * @returns The result of OFFSETADD(x,-y).
  */
 OFFSETSUBTRACT: PROC (x, y) RETURNS (ANY<LOCATOR>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<NUMBER>;
 END;
 /**
  * OFFSETVALUE returns an offset value that is the converted value
  * of \`x\`.
  *
  * @param x Expression. \`x\` must have a
  *   computational type and is converted to FIXED BINARY.
  * @returns An offset value that is the converted
  *   value of \`x\`.
  */
 OFFSETVALUE: PROC (x) RETURNS (ANY<LOCATOR>);
    DCL x ANY<NUMBER>;
 END;
 /**
  * POINTER returns a pointer value that identifies the generation
  * specified by an offset reference \`x\`, in an area specified by
  * \`y\`. If \`x\` is the null offset value, the null pointer value
  * is returned.
  *
  * Abbreviation: PTR
  *
  * Generations of based variables in different areas are equivalent
  * if, up to the allocation of the latest generation, the variables
  * have been allocated and freed the same number of times as each
  * other.
  *
  * @param x Offset reference. It can be the null
  *   offset value. If it is not, \`x\` must identify a generation
  *   of a based variable, but not necessarily in \`y\`. If it is
  *   not in \`y\`, the generation must be equivalent to a generation
  *   in \`y\`.
  * @param y Area reference.
  * @returns A pointer value that identifies the
  *   generation specified by \`x\` in area \`y\`.
  */
 POINTER: PTR: PROC (x, y) RETURNS (ANY<LOCATOR>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<AREA>;
 END;
 /**
  * POINTERADD returns a pointer value that is the sum of its
  * arguments.
  *
  * Abbreviation: PTRADD
  *
  * POINTERADD can be used as a locator for a based variable.
  *
  * POINTERADD can be used for subtraction by prefixing the operand
  * to be subtracted with a minus sign.
  *
  * There is no need to use POINTERADD to increment a pointer - you
  * can simply increment the pointer as you would an integer. For
  * example, there is no need to write:
  *
  * \`\`\`
  *       p = pointeradd(p,2);
  * \`\`\`
  *
  * Instead, you could write either of the following equivalent
  * statements:
  *
  * \`\`\`
  *       p = p + 2;
  *       p += 2;
  * \`\`\`
  *
  * However, POINTERADD can be useful in dereferencing the storage
  * at a location offset from a pointer, as in the following
  * example:
  *
  * \`\`\`
  *       dcl x fixed bin(31), b based fixed bin(31);
  *       x = pointeradd(p,2)->b;
  * \`\`\`
  *
  * Note, however, since a locator in PL/I must be a reference, you
  * cannot write
  *
  * \`\`\`
  *       x = (p + 2)->b;
  * \`\`\`
  *
  * @param x Pointer expression.
  * @param y Expression that must have a computational
  *   type and is converted to FIXED BINARY(31,0).
  * @returns A pointer value that is the sum of its
  *   arguments.
  */
 POINTERADD: PTRADD: PROC (x, y) RETURNS (ANY<LOCATOR>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<NUMBER>;
 END;
 /**
  * POINTERDIFF returns a size_t 1 result that is the difference
  * between the two pointers x and y.
  *
  * Abbreviation: PTRDIFF
  *
  * @param x Expressions declared as POINTER.
  * @param y Expressions declared as POINTER.
  * @returns The difference between the two pointers.
  */
 POINTERDIFF: PTRDIFF: PROC (x, y) RETURNS (FIXED BINARY);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
 END;
 /**
  * POINTERSUBTRACT is equivalent to POINTERADD(x,-y).
  *
  * Abbreviation: PTRSUBTRACT
  *
  * @param x Must be a pointer expression.
  * @param y Expression that must have a computational
  *   type and is converted to FIXED BINARY(31,0).
  * @returns The result of POINTERADD(x,-y).
  */
 POINTERSUBTRACT: PTRSUBTRACT: PROC (x, y) RETURNS (ANY<LOCATOR>);
    DCL x ANY<LOCATOR>;
    DCL y ANY<NUMBER>;
 END;
 /**
  * POINTERVALUE returns a pointer value that is the converted value
  * of \`x\`.
  *
  * Abbreviation: PTRVALUE
  *
  * POINTERVALUE(x) can be used to initialize static pointer
  * variables if \`x\` is a constant.
  *
  * @param x Expression that must have either the HANDLE
  *   attribute, or have a computational type. If \`x\` has a
  *   computational type, it is converted to FIXED BINARY(31,0).
  * @returns A pointer value that is the converted
  *   value of \`x\`.
  */
 POINTERVALUE: PTRVALUE: PROC (x) RETURNS (ANY<LOCATOR>);
    DCL x ANY;
 END;
 /**
  * SIZE returns a FIXED BIN value that gives the
  * implementation-defined storage, in bytes, allocated to a
  * variable x.
  *
  * The value returned by SIZE(x) is the maximum number of bytes
  * that could be transmitted in the following circumstances:
  *
  * \`\`\`
  *   declare F file record input
  *           environment(scalarvarying);
  *   read file(F) into(x);
  * \`\`\`
  *
  * - If \`x\` is a varying-length string, the returned value
  * includes the length-prefix of the string and the number of bytes
  * in the maximum length of the string
  * - If \`x\` is an area, the returned value includes the area
  * control bytes and the maximum size of the area
  * - If \`x\` is an aggregate containing areas or varying-length
  * strings, the returned value includes the area control bytes, the
  * maximum sizes of the areas, the length prefixes of the strings,
  * and the number of bytes in the maximum lengths of the strings.
  *
  * The SIZE built-in function must not be used on a BASED variable
  * with adjustable extents if that variable has not been allocated.
  *
  * Under the CMPAT(V3) compiler option, SIZE returns a FIXED
  * BIN(63) value. Under all other CMPAT options, it returns a FIXED
  * BIN(31) value.
  *
  * To get the number of bytes currently required by a variable, as
  * opposed to the number of bytes allocated to it, use the
  * CURRENTSIZE built-in function.
  *
  * When x is BASED and uses REFER, the compiler generates inline
  * code for SIZE(x) if:
  *
  * - Elements in x with the NONVARYING and BIT attributes have the
  * ALIGNED attribute.
  * - All other elements in x have the UNALIGNED attribute.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Scids   char(17)         init('See you at SCIDS!') static;
  *   dcl Vscids  char(20) varying init('See you at SCIDS!') static;
  *   dcl Stg fixed bin(31);
  *
  *   Stg = storage   (Scids);           // 17 bytes
  *   Stg = currentsize (Scids);         // 17 bytes
  *   Stg = size (Vscids);               // 22 bytes
  *   Stg = currentsize (Vscids);        // 19 bytes
  *   Stg = size (Stg);                  // 4  bytes
  *   Stg = currentsize (Stg);           // 4  bytes
  * \`\`\`
  *
  * @param x A variable of any data type, data organization,
  *   alignment, and storage class, except those in the following
  *   list:
  *
  *   - A BASED, DEFINED, parameter, subscripted, or structure or
  *   union base-element variable that is an unaligned fixed-length
  *   bit string
  *   - A minor structure or union whose first or last base element
  *   is an unaligned fixed-length bit string (except where it is
  *   also the first or last element of the containing major
  *   structure or union)
  *   - A major structure or union that has the BASED, DEFINED, or
  *   parameter attribute, and that has an unaligned fixed-length
  *   bit string as its first or last element
  *   - A variable not in connected storage
  * @returns The storage in bytes allocated to \`x\`.
  */
 SIZE: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * STORAGE is a synonym for SIZE.
  *
  * Abbreviation: STG
  *
  * Note: The USAGE(HEX(STG) is accepted as a synonym for
  * USAGE(HEX(SIZE).
  *
  * @param x A variable of any data type, data organization,
  *   alignment, and storage class.
  * @returns The storage in bytes allocated to \`x\`.
  */
 STORAGE: STG: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * SYSNULL returns the system null pointer value.
  *
  * You can assign SYSNULL to handles and compare it with handles.
  * You can use SYSNULL to initialize static pointer and offset
  * variables.
  *
  * Note: NULL and SYSNULL may compare equal; however, you should
  * not write code that depends on their equality.
  *
  * See also NULL.
  * @returns The system null pointer value.
  */
 SYSNULL: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * TYPE returns the typed structure or union located by the handle,
  * \`x\`.
  *
  * TYPE(x) dereferences the typed structure (or union) \`x\`. For
  * an example of the TYPE built-in functions, see TYPE
  * pseudovariable.
  *
  * @param x Handle.
  * @returns The typed structure or union located
  *   by the handle \`x\`.
  */
 TYPE: PROC (x) RETURNS (ANY<STRUCTURE>);
    DCL x ANY;
 END;
 /**
  * UNALLOCATED returns a BIT(1) value indicating whether or not a
  * specified pointer value is the start of a piece of allocated
  * storage. To use this built-in function, you must also specify
  * the CHECK(STORAGE) compile-time option.
  *
  * UNALLOCATED returns the BIT(1) value '1'b if the specified
  * pointer value is \`not\` the start of a piece of storage that is
  * obtained with the ALLOCATE statement or the ALLOCATE built-in
  * function.
  *
  * Note that the pointer passed to UNALLOCATED is "rounded down" to
  * the nearest doubleword and that rounded value is compared
  * against all allocated addresses when similarly rounded down.
  *
  * @param p Pointer expression.
  * @returns '1'b if the pointer does not point to the
  *   start of allocated storage.
  */
 UNALLOCATED: PROC (p) RETURNS (BIT(1));
    DCL p ANY<LOCATOR>;
 END;
 /**
  * VARGLIST returns the address of the first optional parameter
  * passed to a procedure with a variable number of arguments.
  *
  * The VARGLIST built-in function may be used only inside a
  * procedure whose last parameter has the LIST attribute.
  * @returns The address of the first optional
  *   parameter.
  */
 VARGLIST: PROC () RETURNS (ANY<LOCATOR>);
 END;
 /**
  * VARGSIZE returns the number of bytes that a variable would
  * occupy on the stack if it were passed BYVALUE.
  *
  * VARGSIZE(x) returns the number of bytes that x would occupy on
  * the stack if it were passed BYVALUE. This value will be at least
  * as large as SIZE(x); it will be larger if the value returned by
  * SIZE(x) needs to be rounded up to a 4-byte multiple.
  *
  * VARGSIZE is meant to be used only inside a procedure whose last
  * parameter has the LIST attribute.
  *
  * @param x A variable of any data type, data organization,
  *   alignment, and storage class, except as listed below.
  *
  *   \`x\` cannot be:
  *
  *   - A BASED, DEFINED, parameter, subscripted, or structure or
  *   union base-element variable that is an unaligned fixed-length
  *   bit string
  *   - A minor structure or union whose first or last base element
  *   is an unaligned fixed-length bit string (except where it is
  *   also the first or last element of the containing major
  *   structure or union)
  *   - A major structure or union that has the BASED, DEFINED, or
  *   parameter attribute, and which has an unaligned fixed-length
  *   bit string as its first or last element
  *   - A variable not in connected storage
  * @returns The number of bytes \`x\` would occupy
  *   on the stack if passed BYVALUE.
  */
 VARGSIZE: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;

 /* String-handling built-in functions */
 /**
  * BIT returns a result that is the bit value of \`x\`, and has a
  * length specified by \`y\`.
  *
  * @param x Expression.
  * @param [y] Expression. If necessary, \`y\` is
  *   converted to a real fixed-point binary value. If \`y\` is
  *   omitted, the length is determined by the rules for type
  *   conversion. If \`y\` = 0, the result is the null bit
  *   string. \`y\` must not be negative.
  * @returns The bit value of \`x\` with length \`y\`.
  */
 BIT: PROC (x, y) RETURNS (ANY);
    DCL x ANY;
    DCL y FIXED BINARY OPTIONAL;
 END;
 /**
  * BOOL returns a bit string that is the result of the Boolean
  * operation \`z\`, on \`x\` and \`y\`. The length of the result is
  * equal to that of the longer operand, \`x\` or \`y\`.
  *
  * @param x Expressions. \`x\` and \`y\` are converted to
  *   bit strings, if necessary. If \`x\` and \`y\` are of
  *   different lengths, the shorter is padded on the right with
  *   zeros to match the longer.
  * @param y See \`x\`.
  * @param z Expression. \`z\` is converted to a bit string
  *   of length 4, if necessary. When a bit from \`x\` is matched
  *   with a bit from \`y\`, the corresponding bit of the result is
  *   specified by a selected bit of \`z\`, as follows:
  *
  *   |  | x | y | Result |
  *   | --- | --- | --- | --- |
  *   |  | 0 | 0 | bit 1 of z |
  *   |  | 0 | 1 | bit 2 of z |
  *   |  | 1 | 0 | bit 3 of z |
  *   |  | 1 | 1 | bit 4 of z |
  * @returns The result of the Boolean operation on \`x\`
  *   and \`y\` using \`z\`.
  */
 BOOL: PROC (x, y, z) RETURNS (BIT(*));
    DCL x ANY;
    DCL y ANY;
    DCL z ANY;
 END;
 /**
  * CENTERLEFT returns a string that is the result of inserting
  * string \`x\` in the center (or one position to the left of
  * center) of a string with length y and padded on the left and on
  * the right with the character \`z\` as needed.
  *
  * Specifying a value for \`z\` is optional.
  *
  * Abbreviation: CENTER
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Source char value('Feel the Power');
  *   dcl Target20 char(20);
  *   dcl Target21 char(21);
  *
  *   Target20 = center (Source, length(Target20), '*');
  *              // '***Feel the Power***' - exactly centered
  *
  *
  *   Target21 = center (Source, length(Target21), '*');
  *              // '***Feel the Power****' - leaning left!
  *
  * \`\`\`
  *
  * If \`z\` is omitted, a blank is used as the padding character.
  *
  * @param x Expression that is converted to
  *   character.
  * @param y Expression that is converted to FIXED
  *   BINARY(31,0).
  * @param [z] Optional expression. If specified, \`z\`
  *   must be CHARACTER(1) NONVARYING type.
  * @returns \`x\` centered in a string of length
  *   \`y\`, padded with \`z\`.
  */
 CENTERLEFT: CENTRELEFT: CENTER: PROC (x, y, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y FIXED BINARY;
    DCL z CHARACTER OPTIONAL;
 END;
 /**
  * CENTERRIGHT returns a string that is the result of inserting
  * string \`x\` in the center (or one position to the right of
  * center) of a string with length \`y\` and padded on the left and
  * on the right with the character \`z\` as needed.
  *
  * Specifying a value for \`z\` is optional.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Source char value('Feel the Power');
  *   dcl Target20 char(20);
  *   dcl Target21 char(21);
  *
  *   Target20 = centerright (Source, length(Target20), '*');
  *              // '***Feel the Power***' - exactly centered
  *
  *   Target21 = centerright (Source, length(Target21), '*');
  *              // '****Feel the Power***' - leaning right!
  * \`\`\`
  *
  * If \`z\` is omitted, a blank is used as the padding character.
  *
  * @param x Expression that is converted to
  *   character.
  * @param y Expression that is converted to FIXED
  *   BINARY(31,0).
  * @param [z] Optional expression. If specified, \`z\`
  *   must be CHARACTER(1) NONVARYING type.
  * @returns \`x\` centered in a string of length
  *   \`y\`, padded with \`z\`.
  */
 CENTERRIGHT: CENTRERIGHT: PROC (x, y, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y FIXED BINARY;
    DCL z CHARACTER OPTIONAL;
 END;
 /**
  * CHARACTER returns the character value of \`x\`, with a length
  * specified by \`y\`. CHARACTER also supports conversion from
  * graphic to character type.
  *
  * Abbreviation: CHAR
  *
  * **Example: Conversion from graphic to character**
  *
  * \`\`\`
  *   dcl X graphic(6);
  *   dcl A char (6);
  *   A = char(X);
  * \`\`\`
  *
  * | For X with value | Intermediate result | A is assigned |
  * | --- | --- | --- |
  * | .A.B.C.D.E.F | ABCDEF | ABCDEF |
  *
  * @param x Expression.
  *
  *   \`x\` must have a computational type.
  *
  *   When \`x\` is nongraphic, CHARACTER returns \`x\` converted to
  *   character.
  *
  *   When \`x\` is GRAPHIC, CHARACTER returns \`x\` converted to
  *   SBCS characters. If a DBCS character cannot be translated to
  *   an SBCS equivalent, the CONVERSION condition is raised.
  *
  *   The values of \`x\` are not checked.
  * @param [y] Expression. If necessary, y is
  *   converted to a real fixed-point binary value.
  *
  *   If \`y\` is omitted, the length is determined by the rules for
  *   type conversion.
  *
  *   \`y\` cannot be negative.
  *
  *   If \`y\` = 0, the result is the null character string.
  * @returns The character value of \`x\` with length
  *   \`y\`.
  */
 CHARACTER: CHAR: PROC (x, y) RETURNS (CHARACTER);
    DCL x ANY;
    DCL y FIXED BINARY OPTIONAL;
 END;
 /**
  * CHARGRAPHIC converts a GRAPHIC (DBCS) string \`x\` to a mixed
  * character string with a length specified by \`y\`.
  *
  * Abbreviation: CHARG
  *
  * CHARGRAPHIC returns a mixed character string that is converted
  * from \`x\`.
  *
  * The following rules apply:
  *
  * - If \`y\` = 0, the result is the null character string.
  * - If \`y\` = 1, the result is a character string of 1 blank.
  * - If \`y\` is greater than the length needed to contain the
  * character string, the result is padded with SBCS blanks.
  * - If \`y\` is less than the length needed to contain the
  * character string, the result is truncated. The integrity is
  * preserved by truncating after a graphic and appending an SBCS
  * blank, if necessary, to complete the length of the string.
  *
  * **Example 1**
  *
  * This example shows a conversion from graphic to character. \`y\`
  * is long enough to contain the result.
  *
  * \`\`\`
  *   dcl X graphic(6);
  *   dcl A char (12);
  *   A = char(X,12);
  * \`\`\`
  *
  * | For X with value | Intermediate Result | A is assigned |
  * | --- | --- | --- |
  * | .A.B.C.D.E.F | .A.B.C.D.E.F | .A.B.C.D.E.F |
  *
  * **Example 2**
  *
  * This example shows a conversion from graphic to character.
  * However, \`y\` is too short to contain the result.
  *
  * \`\`\`
  *   dcl X graphic(6);
  *   dcl A char (12);
  *   A = char(X,11);
  * \`\`\`
  *
  * | For X with value | Intermediate Result | A is assigned |
  * | --- | --- | --- |
  * | .A.B.C.D.E.F | .A.B.C.D.E.F | .A.B.C.D.Eb |
  *
  * @param x Expression.
  *
  *   \`x\` must be a GRAPHIC string.
  * @param [y] Expression. If necessary, y is
  *   converted to a real fixed-point binary value.
  *
  *   If \`y\` is omitted, the length is determined by the rules for
  *   type conversion.
  *
  *   \`y\` cannot be negative.
  * @returns Mixed character string converted from \`x\`.
  */
 CHARGRAPHIC: CHARG: PROC (x, y) RETURNS (CHARACTER);
    DCL x GRAPHIC;
    DCL y FIXED BINARY OPTIONAL;
 END;
 /**
  * COLLAPSE returns a string that reduces all multiple occurrences
  * of a character to one, starting from an optional specified
  * position. The leading and trailing instances of that character
  * are also trimmed.
  *
  * **Example**
  *
  * \`\`\`
  * dcl s1 char value( ' abc  :  def   gh  ' );
  * dcl s  char(20);
  *
  * s = collapse(s1, ' ', 1);
  *       // 'abc : def gh '
  * s = collapse(s1, ' ', 2);
  *       // ' abc : def gh '
  * s = collapse(s1, ' ', index(s1,':'));
  *       // ' abc  : def gh '
  * \`\`\`
  *
  * @param x A string expression. \`x\` specifies
  *   the string from which all multiple occurrences of the
  *   character defined by \`y\` are reduced to one. \`x\` must have
  *   the CHARACTER attribute.
  * @param y An expression. \`y\` must have the type
  *   CHARACTER(1) NONVARYING. The leading and trailing instances
  *   of \`y\` are also trimmed.
  * @param [n] An expression. \`n\` specifies the
  *   location within \`x\` at which to begin to locate the first
  *   occurrences of \`y\`.
  *
  *   \`n\` must have a computational type and is converted to type
  *   size_t. The default value for \`n\` is 1.
  *
  *   - If \`n\` < 1, the default value 1 is used.
  *   - If \`n\` > length(\`x\`), the full string of \`x\` is
  *   returned.
  * @returns String with multiple occurrences of \`y\`
  *   reduced to one.
  */
 COLLAPSE: PROC (x, y, n) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y CHARACTER;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * COPY returns a string consisting of \`y\` concatenated copies of
  * the string \`x\`.
  *
  * **Example**
  *
  * Considering the following code:
  *
  * \`\`\`
  *   copy('Walla  ',1)         //  returns 'Walla  '
  *
  *   repeat('Walla  ',1)       //  returns 'Walla  Walla  '
  * \`\`\`
  *
  * In this example, repeat(x,n) is equivalent to copy(x,n+1).
  *
  * @param x Expression.
  *
  *   \`x\` must have a computational type and should have a string
  *   type. If not, it is converted to character.
  * @param y An integer expression with a nonnegative
  *   value. It specifies the number of repetitions. It must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  *
  *   If \`y\` is zero, the result is a null string.
  * @returns String of \`y\` concatenated copies of \`x\`.
  */
 COPY: PROC (x, y) RETURNS (CHARACTER);
    DCL x ANY;
    DCL y FIXED BINARY;
 END;
 /**
  * EDIT returns a character string of length LENGTH(y). Its value
  * is equivalent to what would result if \`x\` were assigned to a
  * variable declared with the picture specification given by \`y\`.
  *
  * For the valid picture characters, see Picture specification
  * characters.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl pic1 char(9) init ('ZZZZZZZZ9');
  *   dcl pic2 char(7) init ('ZZ9V.99');
  *   dcl num fixed dec (9) init (123456789);
  *   z = edit (num, pic1);                     // '123456789'
  *   z = edit (num, pic2);                     //    '789.00'
  *   z = edit (num, substr(pic1,8));           //     '89'
  *   z = edit (num, substr(pic2,1,5));         //    '789.'
  *   z = edit (num, substr(pic1,7,3));         //    '789'
  *   z = edit (num, substr(pic2,3,5));         //    '9.00'
  *   z = edit ('1', substr(pic1,7,3));         //     '  1'
  *   z = edit ('PL/I', 'AAXA');                //    'PL/I'
  *   z = edit ('PL/I', 'AAAA');                // raises conversion
  * \`\`\`
  *
  * If \`x\` cannot be edited into the picture specification given
  * by \`y\`, the conditions raised are those that would be raised
  * if \`x\` were assigned to a PICTURE data item which has the same
  * picture specification contained in \`y\`.
  *
  * @param x Expression
  *
  *   \`x\` must have computational type.
  * @param y String expression.
  *
  *   \`y\` must have character type and must contain picture
  *   characters that are valid for a PICTURE data item. If \`y\`
  *   does not contain a valid picture specification, the ERROR
  *   condition is raised.
  * @returns Character string of length LENGTH(\`y\`).
  */
 EDIT: PROC (x, y) RETURNS (CHARACTER);
    DCL x ANY;
    DCL y ANY<CHARACTER>;
 END;
 /**
  * GRAPHIC explicitly converts character (or mixed character) data
  * to GRAPHIC data. All other data first converts to character, and
  * then to the GRAPHIC data type.
  *
  * GRAPHIC returns the graphic value of \`x\`, with a length in
  * graphic symbols specified by \`y\`.
  *
  * The content of \`x\` is checked for validity during conversion,
  * using the same rules as for checking graphic and mixed character
  * constants.
  *
  * **Example 1**
  *
  * This example shows a conversion from CHARACTER to GRAPHIC. The
  * target is long enough to contain the result.
  *
  * \`\`\`
  *   dcl X char (11) varying;
  *   dcl A graphic (11);
  *   A = graphic(X,8);
  * \`\`\`
  *
  * | For X with values | Intermediate result | A is assigned |
  * | --- | --- | --- |
  * | ABCDEFGHIJ 123 123A.B.C | .A.B.C.D.E.F.G.H.I.J .1.2.3
  * .1.2.3.A.B.C | .A.B.C.D.E.F.G.H.b.b.b .1.2.3.b.b.b.b.b.b.b.b
  * .1.2.3.A.B.C.b.b.b.b.b |
  *
  * where .b is a DBCS blank.
  *
  * **Example 2**
  *
  * This example shows a conversion from CHARACTER to GRAPHIC.
  * However, the target is too short to contain the result.
  *
  * \`\`\`
  *   dcl X char (10) varying;
  *   dcl A graphic (8);
  *   A = graphic(X);
  * \`\`\`
  *
  * | For X with value | Intermediate result | A is assigned |
  * | --- | --- | --- |
  * | ABCDEFGHIJ | .A.B.C.D.E.F.G.H.I.J | .A.B.C.D.E.F.G.H |
  *
  * @param x Expression. When \`x\` is GRAPHIC, it is subject
  *   to a length change, with applicable padding or truncation.
  *   When \`x\` is nongraphic, it is converted to character, if
  *   necessary. SBCS characters are converted to equivalent DBCS
  *   characters.
  * @param [y] Expression. If necessary, \`y\` is
  *   converted to a real fixed-point binary value. If \`y\` is
  *   omitted, the length is determined by the rules for type
  *   conversion.
  *
  *   \`y\` must not be negative.
  *
  *   If \`y\` = 0, the result is the null graphic string.
  *
  *   The following rules apply:
  *
  *   - If \`y\` is greater than the length needed to contain the
  *   graphic string, the result is padded with graphic blanks.
  *   - If \`y\` is less than the length needed to contain the
  *   graphic string, the result is truncated.
  * @returns The graphic value of \`x\` with length \`y\`.
  */
 GRAPHIC: PROC (x, y) RETURNS (GRAPHIC);
    DCL x ANY;
    DCL y FIXED BINARY OPTIONAL;
 END;
 /**
  * HIGH returns a character string of length \`x\`, where each
  * character is the highest character in the collating sequence
  * (hexadecimal FF).
  *
  * @param x Expression. If necessary, \`x\` is
  *   converted to a positive real fixed-point binary value. If
  *   \`x\` = 0, the result is the null character string.
  * @returns String of length \`x\` with each character
  *   set to hexadecimal FF.
  */
 HIGH: PROC (x) RETURNS (CHARACTER);
    DCL x FIXED BINARY;
 END;
 /**
  * INDEX returns an unscaled REAL FIXED BINARY value that indicates
  * the starting position within \`x\` of a substring identical to
  * \`y\`. You can also specify the location within \`x\` where
  * processing begins.
  *
  * If \`y\` does not occur in \`x\`, or if either \`x\` or \`y\`
  * have zero length, the value zero is returned.
  *
  * If \`n\` is less than 1 or if \`n\` is greater than 1 +
  * length(x), the STRINGRANGE condition will be raised, and the
  * result will be 0.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * INDEX will perform best when the second and third arguments are
  * either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl tractatus char
  *         value( 'Wovon man nicht sprechen kann, ' ||
  *                'darueber muss man schweigen.' );
  *
  *   dcl pos fixed bin init(1);
  *
  *   pos = index( tractatus, 'man', pos+1 ); // pos = 07
  *
  *   pos = index( tractatus, 'man', pos+1 ); // pos = 46
  *
  *   pos = index( tractatus, 'man', pos+1 ); // pos = 00
  * \`\`\`
  *
  * @param x String-expression to be searched.
  * @param y Target string-expression of the
  *   search.
  * @param [n] \`n\` specifies the location within
  *   \`x\` at which to begin processing. It must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  * @returns The starting position within \`x\` of
  *   the first match for \`y\`.
  */
 INDEX: PROC (x, y, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * INDEXR returns an unscaled REAL FIXED BINARY value indicating
  * the starting position within \`x\` of a substring identical to
  * \`y\` when the search for \`y\` starts from the right end of
  * \`x\`. You can also specify the location within \`x\` where
  * processing begins.
  *
  * The INDEXR function performs the same operation as the INDEX
  * built-in function except for the following differences:
  *
  * - The search is done from right to left.
  * - The default value of \`n\` is LENGTH(\`x\`).
  * - Unless 0 ≤ \`n\` ≤ LENGTH(\`x\`), the STRINGRANGE condition,
  * if enabled, is raised. Its implicit action and normal return
  * give a result of zero.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * INDEXR will perform best when the second and third arguments are
  * either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  * @returns The starting position of the last
  *   match for \`y\` within \`x\`.
  */
 INDEXR: PROC (x, y, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * LEFT returns a string that is the result of inserting string
  * \`x\` at the left end of a string with length \`n\` and padded
  * on the right with the character \`z\` as needed.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Source char value('One Hundred SCIDS Marks');
  *   dcl Target char(30);
  *
  *   Target = left (Source, length(Target), '*');
  *              // 'One Hundred SCIDS Marks*******'
  * \`\`\`
  *
  * If \`z\` is omitted, a blank is used as the padding character.
  *
  * @param x Expression. \`x\` must have a
  *   computational type and should have a character type. If not,
  *   it is converted to CHARACTER.
  * @param n Expression. \`n\` must have a
  *   computational type and should have a character type. If \`n\`
  *   does not have the attributes FIXED BINARY(31,0), it is
  *   converted to them.
  * @param [z] Expression. If specified, \`z\` must have
  *   the type CHARACTER(1) NONVARYING type.
  * @returns \`x\` left-aligned in a string of length
  *   \`n\`, padded with \`z\`.
  */
 LEFT: PROC (x, n, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL n FIXED BINARY;
    DCL z CHARACTER OPTIONAL;
 END;
 /**
  * LENGTH returns an unscaled REAL FIXED BINARY value specifying
  * the current length of \`x\`.
  *
  * For an example of the LENGTH built-in function, refer to
  * MAXLENGTH.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * When applied to an OFFSET reference with the LOCATES attribute
  * and implicit AREA qualification:
  *
  * - If the OFFSET reference is not null, LENGTH returns the
  * address of the located data.
  * - If the OFFSET reference is null, LENGTH returns SYSNULL.
  *
  * @param x String-expression or an OFFSET reference with
  *   the LOCATES attribute and an explicit AREA reference. If \`x\`
  *   is binary, it is converted to bit string; otherwise, any other
  *   conversion required is to character string.
  * @returns The current length of \`x\`.
  */
 LENGTH: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * LOW returns a character string of length \`x\`, where each
  * character is the lowest character in the collating sequence
  * (hexadecimal 00).
  *
  * @param x Expression. If necessary, \`x\` is
  *   converted to a positive real fixed-point binary value. If
  *   \`x\` = 0, the result is the null character string.
  * @returns String of length \`x\` with each character
  *   set to hexadecimal 00.
  */
 LOW: PROC (x) RETURNS (CHARACTER);
    DCL x FIXED BINARY;
 END;
 /**
  * LOWERASCII returns a UCHAR string with all of its ASCII
  * characters converted to their corresponding lowercase
  * characters.
  *
  * LOWERASCII(x) is equivalent to TRANSLATE(x, 'a...z', 'A...Z').
  *
  * @param x Expression. x must have UCHAR type.
  * @returns \`x\` with ASCII characters converted to
  *   lowercase.
  */
 LOWERASCII: PROC (x) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * LOWERCASE returns a character string with all characters
  * converted to their lowercase equivalent.
  *
  * LOWERCASE(\`x\`) is equivalent to TRANSLATE(x, 'a...z', 'A...Z')
  * and LOWERCASE(\`x\`, \`c\` ) is equivalent to TRANSLATE(x,
  * lowerc, upperc). The values of \`lowerc\` and \`upperc\` are
  * determined by the value of the code page \`c\`. Specifying
  * LOWERCASE(\`x\`, \`c\`) will not only translate alphabetic
  * characters 'A...Z' to 'a...z', but also translate characters
  * such as uppercase Ä-umlaut('4a'x) to lowercase ä-umlaut('c0'x).
  *
  * For example, if the Lower_01141 was declared as:
  *
  * \`\`\`
  * dcl lower_01141 char
  *  value( (
  *               '8182838485868788'8991929394959697'x
  *            || '9899A2A3A4A5A6A7A8A9424445464748'x
  *            || '4951525354555657'586A708C8D8E9CC0'x
  *            || 'CBCDCECFD0DBDDDE'x
  *         ) );
  * \`\`\`
  *
  * and the Upper_01141 was declared as:
  *
  * \`\`\`
  * dcl upper_01141 char
  *   value( (
  *               'C1C2C3C4C5C6C7C8C9D1D2D3D4D5D6D7'x
  *            || 'D8D9E2E3E4E5E6E7E8E9626465666768'x
  *            || '6971727374757677'78E080ACADAE9E4A'x
  *            || 'EBEDEEEF5AFBFDFE'x
  *         ) );
  * \`\`\`
  *
  * then LOWERCASE(x, 1141 ) would be the same as TRANSLATE( x,
  * Lower_01141, Upper_01141 ).
  *
  * The appendix lists the values of \`lowerc\` and \`upperc\` for
  * the supported values of \`c\`. For details, see Limits.
  *
  * @param x An expression. If necessary, \`x\` is
  *   converted to character.
  * @param [c] An expression that specifies the code
  *   page that will be lowercased.
  * @returns \`x\` with all characters converted to
  *   lowercase.
  */
 LOWERCASE: PROC (x, c) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL c FIXED BINARY OPTIONAL;
 END;
 /**
  * LOWERLATIN1 returns a UCHAR string with all of its ASCII and
  * Latin-1 supplement characters converted to their corresponding
  * lowercase characters.
  *
  * The letters Y with DIAERESIS(ÿ) and SHARP S (ß) are not changed.
  *
  * @param x Expression. x must have UCHAR type.
  * @returns \`x\` with ASCII and Latin-1 characters
  *   converted to lowercase.
  */
 LOWERLATIN1: PROC (x) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * MAXLENGTH returns the maximum length of a string.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl x char(20);
  *   dcl y char(20) varying;
  *
  *   x, y = '';
  *
  *   x = copy( '*', length(x) );    // fills x with '*'
  *   y = copy( '*', length(y) );    // leaves y unchanged
  *
  *   x = copy( '-', maxlength(x) ); // fills x with '-'
  *   y = copy( '-', maxlength(y) ); // fills y with '-'
  * \`\`\`
  *
  * Note that the first assignment to \`y\` leaves it unchanged
  * because \`length(y)\` will return zero when it is used in the
  * code snippet above (since \`y\` is VARYING and was previously
  * set to '').
  *
  * However, the second assignment to \`y\` fills it with 20 - signs
  * because \`maxlength(y)\` will return 20 (the declared length of
  * \`y\`).
  *
  * @param x Expression. \`x\` must have a computational type
  *   and should have a string type. If not, it is converted to
  *   character.
  * @returns The maximum length of the string \`x\`.
  */
 MAXLENGTH: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY;
 END;
 /**
  * MPSTR truncates a string at a logical boundary and returns a
  * mixed character string.
  *
  * It does not truncate a double-byte character between bytes. The
  * length of the returned string is equal to the length of the
  * expression \`x\`, or to the value specified by \`y\`. The
  * processing of the string is determined by the rules selected by
  * the expression \`r\`, as described below.
  *
  * @param x Expression that yields the character
  *   string result. The value of \`x\` is converted to character if
  *   necessary.
  * @param r Expression that yields a character
  *   result. The expression cannot be GRAPHIC and is converted to
  *   character if necessary.
  *
  *   The expression \`r\` specifies the rules to be used for
  *   processing the string. The characters that can be used in
  *   \`r\` and the rules for them are as follows:
  *
  *   V or v Validates the mixed string \`x\` and returns a mixed
  *   string. S or s Removes any null DBCS strings, creates a new
  *   string, and returns a mixed string.
  *
  *   If both V and S are specified, V takes precedence over S,
  *   regardless of the order in which they were specified.
  *
  *   If S is specified without V, the string x is assumed to be a
  *   valid string. If the string is not valid, undefined results
  *   occur.
  *
  *   Note: The parameter \`r\` is ignored on Intel and AIX.
  * @param [y] Expression. If necessary, \`y\` is
  *   converted to a real fixed-point binary value. If \`y\` is
  *   omitted, the length is determined by the rules for type
  *   conversion. The value of \`y\` cannot be negative. If \`y\` =
  *   0, the result is the null character string. If \`y\` is
  *   greater than the length needed to contain \`x\`, the result is
  *   padded with blanks. If \`y\` is less than the length needed to
  *   contain \`x\`, the result is truncated by discarding excess
  *   characters from the right (if they are SBCS characters), or
  *   by discarding as many DBCS characters (2-byte pairs) as
  *   needed.
  * @returns Mixed character string truncated at a
  *   logical boundary.
  */
 MPSTR: PROC (x, r, y) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL r ANY<CHARACTER>;
    DCL y FIXED BINARY OPTIONAL;
 END;
 /**
  * PICSPEC casts data from CHARACTER to PICTURE type.
  *
  * The expression \`x\` must be CHARACTER NONVARYING with a length
  * known at compile time.
  *
  * \`y\` must be a character literal that specifies a valid PICTURE
  * with an external representation that has the same length as the
  * first argument.
  *
  * The result has the PICTURE type specified by the second
  * argument.
  *
  * Unlike the EDIT built-in function, no conversion is done and no
  * checks are made to see if the first argument holds data valid
  * for the picture.
  *
  * Like the UNSPEC built-in function, only the "type" of the data
  * is changed.
  *
  * So, for example given PICSPEC(x,'(5)9'), \`x\` must be CHAR(5)
  * (since while the picture specification '(5)9' was 4 characters
  * in length, its external representation requires 5 characters),
  * but \`x\` will not be checked to see if it actually contains 5
  * numeric digits.
  *
  * A statement of the N = N + PICSPEC(X,'(5)9') will not cause
  * \`x\` to be converted from CHAR to PIC'(5)9', a conversion that
  * would require a library call, but will cause the contents of
  * \`x\` to be treated as if it were declared as PIC'(5)9'.
  *
  * @param x Expression.
  * @param y Picture specification.
  * @returns Data of \`x\` cast to the PICTURE type
  *   specified by \`y\`.
  */
 PICSPEC: PROC (x, y) RETURNS (ANY<PICTURE>);
    DCL x CHARACTER;
    DCL y CHARACTER;
 END;
 /**
  * REGEX returns a FIXED BIN(31) that indicates the success of
  * matching a specified regular expression or pattern against a
  * string.
  *
  * If either i or j is an array, then
  *
  * - both must be arrays with matching bounds and NATIVE type
  * size_t
  * - the first elements of each array will be assigned the index
  * and length of the matching expression (if any).
  * - the second and subsequent elements of each array will be
  * assigned the index and length of the corresponding matching
  * subexpression (if any).
  *
  * The characters [, ], {, }, |, ^, and $ occur often in regular
  * expressions and have varying code points in different encoded
  * character sets. The (implicit or explicit) code page value must
  * correctly match the code page of p and x. If not, the pattern
  * might be deemed to be invalid or a match might not be found.
  *
  * The processing of the REGEX built-in function proceeds in these
  * steps:
  *
  * 1. If n is less than 1 or if n is greater than 1 + length(x),
  * the STRINGRANGE condition will be raised if enabled, and REGEX
  * will return the value 1.
  * 2. If there is no locale matching the code page c, then REGEX
  * will return the value -1.
  * 3. If the string p does not specify a valid regular expression,
  * then REGEX will return a value greater than 1.
  * 4. If there is no match in the string x for the regular
  * expression p, then REGEX will return the value 1 and set the
  * index i and the length j to 0. Otherwise, REGEX will return the
  * value 0 and set the index i and the length j corresponding to
  * the substring in x that is the first match for the regular
  * expression p.
  *
  * The search for a match to the regular expression is case
  * sensitive.
  *
  * **Examples**
  *
  * Example 1
  *
  * If p = "All(a|e)n" and x = "12Allan3Allen4Alan5Allan678", then
  *
  * - regex( i, j, p, x ) will return 0 and set i to 3 and j to 5
  * (because it has found the match for the first "Allan").
  * - regex( i, j, p, x, 4 ) will return 0 and set i to 9 and j
  * to 5 (because it has found the match for "Allen").
  * - regex( i, j, p, x, 10 ) will return 0 and set i to 20 and j
  * to 5 (because it has found the match for the second "Allan").
  * - regex( i, j, p, x , 21 ) will return 1 (because there are no
  * more matches).
  *
  * The preceding set of matches could also have been found via the
  * following loop, which uses the optional fifth parameter to walk
  * through the string x
  *
  * \`\`\`
  * n = 1;
  * do loop;
  *   rc = regex( i, j, p, x, n );
  *   if rc <> 0 then leave;
  *   put skip list( substr( x, i, j ) );
  *   n = i + j;
  * end;
  * \`\`\`
  *
  * Example 2
  *
  * If p = "[hc]+at" and x = "the cat in the hat", then regex( i,
  * j, p, x, n ) will find the match for "cat" or "hat" depending
  * on the value of n. But, if p = "63"x || "hc" || "fc"x ||
  * "+at", then although under codepage 1141, this pattern would
  * display as "[hc]+at".
  *
  * - Under the default code page 1140, regex( i, j, p, x, n )
  * would find no match, because under code page 1140 the hex
  * values for [ and ] are "ba"x and "bb"x respectively.
  * - However, regex( i, j, p, x, n, 1141) would find the match
  * for "cat" or "hat" depending on the value of n.
  *
  * Example 3
  *
  * Given the following:
  *
  * \`\`\`
  * pattern =
  * '([a-zA-Z]+) * ([a-zA-Z]+) * ((([a-zA-Z1-9]+)\.){0,1}([a-zA-Z1-9]+))';
  * string = ' CREATE DATABASE TESTDB;';
  * rc = regex( a_index, a_length, pattern, string );
  * \`\`\`
  *
  * Then
  *
  * \`\`\`
  * a_index(2) and a_length(2) will give the index and length for CREATE
  * a_index(3) and a_length(3) will give the index and length for DATABASE
  * a_index(4) and a_length(4) will give the index and length for TESTDB
  * \`\`\`
  *
  * @param i A reference. \`i\` must be ASSIGNABLE.
  *   If a match for the pattern is found, it will be assigned the
  *   index of the substring in x of the first match for the
  *   regular expression p. i must be REAL FIXED BIN with scale
  *   factor 0. i must be either a scalar or a one-dimensional
  *   array of scalars.
  * @param j A reference. j must be ASSIGNABLE. If
  *   a match for the pattern is found, it will be assigned the
  *   length of the substring in x of the first match for the
  *   regular expression p. j must be REAL FIXED BIN with scale
  *   factor 0. j must be either a scalar or a one-dimensional
  *   array of scalars.
  * @param p A string holding a regular
  *   expression. The pattern p must have CHARACTER type.
  *
  *   The pattern p must conform to the POSIX standard for Extended
  *   Regular Expressions (EREs) (and not to the POSIX standard for
  *   Basic Regular Expressions). Wikipedia and other web sites
  *   contain good descriptions of regular expressions.
  * @param x A string. x is to be searched for a
  *   match with the regular expression p. The string x must have
  *   CHARACTER type.
  * @param [n] An expression. n specifies the
  *   location within x at which to begin searching. n must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  *   If omitted, it defaults to 1.
  * @param [c] A restricted expression. c specifies
  *   the code page of p and x. If omitted, it defaults to the
  *   value in the CODEPAGE compiler option. If not omitted, a
  *   value for n must be specified.
  *
  *   The code page must have a computational type and is converted
  *   to FIXED BINARY (31,0). The code page must specify a valid,
  *   supported code page.
  * @returns 0 if a match was found, 1 if no match,
  *   -1 if no matching locale, >1 if pattern is invalid.
  */
 REGEX: PROC (i, j, p, x, n, c) RETURNS (FIXED BINARY);
    DCL i FIXED BINARY;
    DCL j FIXED BINARY;
    DCL p ANY<CHARACTER>;
    DCL x ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
    DCL c FIXED BINARY OPTIONAL;
 END;
 /**
  * REPEAT returns a string consisting of \`x\` concatenated to
  * itself the number of times specified by \`y\`.
  *
  * That is, there are (\`y\` + 1) occurrences of \`x\`.
  *
  * If \`y\` is zero or negative, the string \`x\` is returned. For
  * an example of the REPEAT built-in function, see COPY.
  *
  * @param x Bit, character, graphic, uchar or widechar
  *   expression to be repeated. If \`x\` is arithmetic, the
  *   following conversions occur:
  *
  *   - If it is binary, \`x\` is converted to bit string.
  *   - If it is decimal, \`x\` is converted to character string.
  * @param y Expression. If necessary, \`y\` is
  *   converted to a real fixed-point binary value.
  * @returns String of \`x\` repeated \`y\` + 1 times.
  */
 REPEAT: PROC (x, y) RETURNS (ANY);
    DCL x ANY;
    DCL y FIXED BINARY;
 END;
 /**
  * REPLACE returns a string with one or more occurrences of a
  * substring replaced by another substring.
  *
  * \`\`\`
  * dcl ein char(50) var init( 'reserved from #date# till #date#.' );
  * dcl aus char(80) var;
  *
  * dcl f   char(6);
  * dcl t   char(10);
  *
  * f = '#date#';
  * t = '2018/05/01';
  *
  * aus = replace( ein, f, t );
  *       // 'reserved from 2018/05/01 till #date#.'
  * aus = replace( ein, f, t, 16 );
  *       // 'reserved from #date# till 2018/05/01.'
  * aus = replace( ein, f, t, 1, 2 );
  *       // 'reserved from 2018/05/01 till 2018/05/01.'
  * aus = replace( ein, f, t, 16, 1 );
  *       // 'reserved from #date# till 2018/05/01.'
  * aus = replace( ein, f, t, 1, 0 );
  *       // 'reserved from 2018/05/01 till 2018/05/01.'
  * \`\`\`
  *
  * @param x A string expression that specifies
  *   the string within which the occurrences of the substring f
  *   will be replaced by the substring t. x must have a CHARACTER
  *   type.
  * @param f A string expression that specifies
  *   the substring that will be replaced within the string x. f
  *   must have a CHARACTER type.
  * @param t A string expression that specifies
  *   the substring that will be used to replace the substring f
  *   within the string x. t must have a CHARACTER type.
  * @param [n] An optional expression that specifies
  *   a location within the string x, from where the compiler
  *   begins searching for the substring f. n must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  *   The default value for n is 1. If n is less than 1 or greater
  *   than the length(x), the STRINGRANGE condition will be raised
  *   if enabled, and the result will be a null character string.
  * @param [i] An optional expression that specifies
  *   the maximum number of times that the substring f should be
  *   replaced by the substring t. i must have a computational type
  *   and is converted to FIXED BINARY(31,0). The default value for
  *   i is 1. i must be non-negative. If i is 0, all occurrences of
  *   the substring f in the string x will be replaced by the
  *   substring t.
  * @returns \`x\` with occurrences of \`f\` replaced
  *   by \`t\`.
  */
 REPLACE: PROC (x, f, t, n, i) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL f ANY<CHARACTER>;
    DCL t ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
    DCL i FIXED BINARY OPTIONAL;
 END;
 /**
  * REPLACEBY2 returns a nonvarying string formed by replacing some
  * of the characters in \`x\` by a pair of characters.
  *
  * REPLACEBY2 operates on each character of \`x\` as follows:
  *
  * If a character in \`x\` is found in \`z\`, the character pair in
  * \`y\` that corresponds to that in \`z\` is copied to the result;
  * otherwise, the character in \`x\` is copied directly to the
  * result. If \`z\` contains duplicates, the leftmost occurrence is
  * used.
  *
  * The string \`y\` must be twice as long as the string \`z\`.
  *
  * As an example, REPLACEBY2( 'Rätsel', 'aeoeuess', 'äöüß') returns
  * the string 'Raetsel'.
  *
  * @param x Character expression to be searched
  *   for possible replacement of its characters.
  * @param y Character expression containing the
  *   replacement pair values..
  * @param z Character expression containing the
  *   characters that are to be replaced.
  * @returns String with characters of \`z\` replaced by
  *   corresponding pairs from \`y\`.
  */
 REPLACEBY2: PROC (x, y, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL z ANY<CHARACTER>;
 END;
 /**
  * REVERSE returns a nonvarying string that contains the elements
  * of \`x\` in reverse order.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Source char value('HARPO');
  *   dcl Target char(length(Source));
  *
  *   Target = reverse (Source);     // 'OPRAH'
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a computational type
  *   and should have a string type. If \`x\` does not have a string
  *   type, it is converted to string (that is, from numeric to
  *   character, bit, graphic, uchar, or widechar), according to the
  *   rules for concatenation.
  * @returns \`x\` with its elements in reverse order.
  */
 REVERSE: PROC (x) RETURNS (ANY);
    DCL x ANY;
 END;
 /**
  * RIGHT returns a string that is the result of inserting string
  * \`x\` at the right end of a string with length \`n\` and padded
  * on the left with the character \`z\` as needed.
  *
  * If \`z\` is omitted, a blank is used as the padding character.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Source char value('One Hundred SCIDS Marks');
  *   dcl Target char(30);
  *
  *   Target = right (Source, length(Target), '*');
  *              // '*******One Hundred SCIDS Marks'
  * \`\`\`
  *
  * @param x Expression. \`x\` must have a
  *   computational type and can have a character type. If not, it
  *   is converted to character.
  * @param n Expression. \`n\` must have a
  *   computational type and is converted to FIXED BINARY(31,0).
  * @param [z] Expression. If specified, \`z\` must have
  *   the type CHARACTER(1) NONVARYING type.
  * @returns \`x\` right-aligned in a string of length
  *   \`n\`, padded with \`z\`.
  */
 RIGHT: PROC (x, n, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL n FIXED BINARY;
    DCL z CHARACTER OPTIONAL;
 END;
 /**
  * SCRUBOUT returns a string with all the characters from a second
  * string removed.
  *
  * SCRUBOUT( x, '0123456789' ) will remove all the numeric
  * characters from x.
  *
  * SCRUBOUT( x, '0123456789', 4 ) will remove all the numeric
  * characters from x after the first 3 characters.
  *
  * @param x A string expression that specifies the
  *   string from which the characters in the string f will be
  *   removed. x must have a CHARACTER type.
  * @param f A string expression that specifies the
  *   characters to be removed from x. f must have a CHARACTER type.
  * @param [n] An optional expression that specifies
  *   a location within the string x, from where the compiler begins
  *   searching for characters from the string f.
  *
  *   n must have a computational type and is converted to FIXED
  *   BINARY(31,0). The default value for n is 1.
  *
  *   If n is less than 1 or greater than length(x)+1, the
  *   STRINGRANGE condition will be raised if enabled, and the
  *   result will be a null character string.
  * @returns \`x\` with all characters from \`f\`
  *   removed.
  */
 SCRUBOUT: PROC (x, f, n) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL f ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * SEARCH returns an unscaled REAL FIXED BINARY value specifying
  * the first position in one string at which any character, bit,
  * graphic, uchar, or widechar of another string appears. It also
  * allows you to specify the location at which to start searching.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * SEARCH can be used to find delimiters in a string of numbers.
  *
  * SEARCH will perform best when the second and third arguments are
  * either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  *
  * **Example 1**
  *
  * \`\`\`
  *   dcl Source char value(' Our PL/I wields the Power ');
  *   dcl Pos fixed bin(31);
  *
  * // Find occurrences of any of the characters 'P','o',or 'w'
  * // in source
  *
  *   Pos = search (Source, 'Pow');           // returns 6 for the 'P'
  *   Pos = search (Source, 'Pow', Pos+1); // returns 11 for the 'w'
  *   Pos = search (Source, 'Pow', Pos+1); // returns 22 for the 'P'
  *   Pos = search (Source, 'Pow', Pos+1); // returns 23 for the 'o'
  *   Pos = search (Source, 'Pow', Pos+1); // returns 24 for the 'w'
  *
  *   Pos = index (source, 'Pow',1);      // returns 22 for the 'Pow'
  * \`\`\`
  *
  * In the above example, SEARCH returns the position at which any
  * of the three characters ('P', 'o', or 'w') appear. INDEX returns
  * the position at which the whole string 'Pow' appears.
  *
  * **Example 2**
  *
  * \`\`\`
  *   dcl Source char value (' 368,475;121.,856,478')
  *   dcl Delims char(3) init (',;.');         // string of delimiters
  *   dcl Number(5) char(3);
  *   dcl Start fixed bin(31);
  *   dcl End fixed bin(31);
  *
  *   // Extract the three-digit numbers from the source string
  *   // by searching for the delimiters
  *   Start = verify (Source, ' ');
  *                      // find start of first number
  *   End   = search (Source, ',;.', Start );
  *                      // find end of first number
  *   if End = 0 then
  *      End = length (Source) + 1;
  *   Number(1) = substr (Source, Start, 3);        // 368
  *   Start = verify (Source, Delims, End);
  *                // find start of second number
  *   End   = search (Source, Delims, Start );
  *   Number(2) = substr (Source, Start, 3);        // 475
  * \`\`\`
  *
  * @param x Expressions. \`x\` specifies the
  *   string in which to search for any character, bit, graphic,
  *   uchar, or widechar that appears in string \`y\`.
  *
  *   If either \`x\` or \`y\` are the null string, the result is
  *   zero.
  *
  *   If \`y\` does not occur in \`x\`, the result is zero.
  * @param y See \`x\`.
  * @param [n] Expression. \`n\` specifies the
  *   location within \`x\` at which to begin searching. It must
  *   have a computational type and is converted to FIXED
  *   BINARY(31,0).
  *
  *   Unless 1 ≤ \`n\` ≤ LENGTH(\`x\`)+1, STRINGRANGE condition, if
  *   enabled, is raised. Its implicit action and normal return give
  *   a result of zero.
  * @returns The first position in \`x\` at which any
  *   character of \`y\` appears.
  */
 SEARCH: PROC (x, y, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * SEARCHR searches for the first occurrence of any one of the
  * elements of a string within another string but the search starts
  * from the right.
  *
  * The SEARCHR function performs the same operation as the SEARCH
  * built-in function except for the following differences:
  *
  * - The search is done from right to left.
  * - The default value for \`n\` is LENGTH(\`x\`).
  * - Unless 0 ≤ \`n\` ≤ LENGTH(\`x\`), the STRINGRANGE condition,
  * if enabled, is raised. Its implicit action and normal return
  * give a result of zero.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * SEARCHR will perform best when the second and third arguments
  * are either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl Source char value (' 555 Bailey Ave, San Jose, CA 95141, USA');
  *   dcl Digits char value ('0123456789');
  *   dcl (Start, End) fixed bin(31);
  *   dcl Num char(20) var;
  *
  *      //   Find last number (i.e., zip code)
  *
  *   End   = searchr (Source, Digits);     // returns 35 for the '1'
  *   Start = verifyr (Source, Digits, End); // returns 30 for the ' '
  *   Num   = substr (Source, Start + 1, End - Start); // extract number
  * \`\`\`
  * @param x Expressions. \`x\` specifies the
  *   string in which to search for any character, bit, graphic,
  *   uchar, or widechar that appears in string \`y\`.
  *
  *   If either \`x\` or \`y\` are the null string, the result is
  *   zero.
  *
  *   If \`y\` does not occur in \`x\`, the result is zero.
  * @param y See \`x\`.
  * @param [n] Expression. \`n\` specifies the
  *   location within \`x\` at which to begin searching. It must
  *   have a computational type and is converted to FIXED
  *   BINARY(31,0).
  *
  *   Unless 1 ≤ \`n\` ≤ LENGTH(\`x\`)+1, STRINGRANGE condition, if
  *   enabled, is raised. Its implicit action and normal return give
  *   a result of zero.
  * @returns The last position in \`x\` at which any
  *   character of \`y\` appears.
  */
 SEARCHR: PROC (x, y, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * SQUEEZE returns a string that reduces all multiple occurrences
  * of a character to one, with an optionally specified starting
  * position.
  *
  * **Example**
  *
  * \`\`\`
  * dcl s1 char value( ' abc  :  def   gh  ' );
  * dcl s  char(20);
  *
  * s = squeeze(s1, ' ', 1);
  *       // ' abc : def gh '
  * s = squeeze(s1, ' ', index(s1,':'));
  *        // ' abc  : def gh '
  *
  * \`\`\`
  *
  * @param x A string expression. \`x\` specifies
  *   the string from which all multiple occurrences of the
  *   character defined by \`y\` are reduced to one. \`x\` must have
  *   the CHARACTER attribute.
  * @param y An expression that must have the type
  *   CHARACTER(1) NONVARYING.
  * @param [n] An expression that specifies the
  *   location within \`x\` at which to begin to locate the first
  *   occurrences of \`y\`. \`n\` must have a computational type and
  *   is converted to type size_t. The default value for \`n\` is 1.
  *
  *   - If \`n\` < 1, the default value 1 is used.
  *   - If \`n\` > length(\`x\`), the full string of \`x\` is
  *   returned.
  * @returns String with multiple occurrences of \`y\`
  *   reduced to one.
  */
 SQUEEZE: PROC (x, y, n) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y CHARACTER;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * SUBSTR returns a substring, specified by \`y\` and \`z\`, of
  * \`x\`.
  *
  * The STRINGRANGE condition is raised if \`z\` is negative or if
  * the values of \`y\` and \`z\` are such that the substring does
  * not lie entirely within the current length of \`x\`. It is not
  * raised when \`y\` = LENGTH(\`x\`)+1 and \`z\` = 0. For an
  * example of the SUBSTR built-in function, see SEARCH.
  *
  * @param x String expression. It specifies the
  *   string from which the substring is extracted. If \`x\` is not
  *   a string, it is converted to character.
  * @param y Expression that is converted to FIXED
  *   BINARY(31,0). \`y\` specifies the starting position of the
  *   substring in \`x\`.
  * @param [z] Expression that is converted to FIXED
  *   BINARY(31,0). \`z\` specifies the length of the substring in
  *   \`x\`. If \`z\` is zero, a null string is returned. If \`z\`
  *   is omitted, the substring returned is position \`y\` in \`x\`
  *   to the end of \`x\`.
  * @returns The substring of \`x\` starting at
  *   \`y\` with length \`z\`.
  */
 SUBSTR: PROC (x, y, z) RETURNS (ANY<CHARACTER>);
    DCL x ANY<CHARACTER>;
    DCL y FIXED BINARY;
    DCL z FIXED BINARY OPTIONAL;
 END;
 /**
  * SUBTO returns a substring, specified by \`y\` and \`z\`, of
  * \`x\`.
  *
  * SUBTO(\`x,y\`) is equivalent to SUBSTR(\`x,y\`), and
  * SUBTO(\`x,y,z\`) is equivalent to SUBSTR(\`x,y,z-y+\`1).
  *
  * The STRINGRANGE condition is raised for a SUBTO reference if and
  * only if the STRINGRANGE condition would be raised for the
  * equivalent SUBSTR reference. In particular, this means that if k
  * = length(\`x\`), then STRINGRANGE would be raised for
  * SUBTO(\`x,y,z\`) under any of these 5 conditions:
  *
  * \`\`\`
  *
  *          y < 1
  *          y > k+1
  *          y = k+1 then unless z = k
  *          z-y+1 < 0
  *          z > k
  * \`\`\`
  *
  * @param x String expression. It specifies the
  *   string from which the substring is extracted. If \`x\` is not
  *   a string, it is converted to character.
  * @param y Expression that is converted to FIXED
  *   BINARY(31,0). \`y\` specifies the starting position of the
  *   substring in \`x\`.
  * @param [z] Expression that is converted to FIXED
  *   BINARY(31,0). \`z\` specifies the ending position of the
  *   substring in \`x\`. If \`z = y-\`1, a null string is returned.
  *   If \`z\` is omitted, the substring returned is position \`y\`
  *   in \`x\` to the end of \`x\`.
  * @returns The substring of \`x\` from position
  *   \`y\` to position \`z\`.
  */
 SUBTO: PROC (x, y, z) RETURNS (ANY<CHARACTER>);
    DCL x ANY<CHARACTER>;
    DCL y FIXED BINARY;
    DCL z FIXED BINARY OPTIONAL;
 END;
 /**
  * TALLY returns a FIXED BINARY(31,0) result that indicates the
  * number of times that string \`y\` appears in string \`x\`.
  *
  * If \`y\` does not appear in \`x\`, a value of 0 is returned.
  *
  * If either \`x\` or \`y\` are the null string, the result is
  * zero.
  *
  * **Example**
  *
  * \`\`\`
  *   TALLY ('We''ve got the Power!', 'power');      // returns 0
  *   TALLY ('We''ve got the Power!', 'Power');      // returns 1
  *   TALLY ('We''ve got the Power!', ' ');          // returns 3
  *   TALLY ('We''ve got the Power!', 'e');          // returns 4
  *   TALLY ('1001'B, '1'B);                         // returns 2
  * \`\`\`
  *
  * @param x String expressions.
  *
  *   Both \`x\` and \`y\` must have computational type and should
  *   be character, bit, graphic, uchar, or widechar type.
  * @param y See \`x\`.
  * @returns The number of times \`y\` appears in
  *   \`x\`.
  */
 TALLY: PROC (x, y) RETURNS (FIXED BINARY);
    DCL x ANY;
    DCL y ANY;
 END;
 /**
  * TRANSLATE returns a character string of the same length as
  * \`x\`.
  *
  * TRANSLATE operates on each character of \`x\` as follows:
  *
  * If a character in \`x\` is found in \`z\`, the character in
  * \`y\` that corresponds to that in \`z\` is copied to the result;
  * otherwise, the character in \`x\` is copied directly to the
  * result. If \`z\` contains duplicates, the leftmost occurrence is
  * used.
  *
  * \`y\` is padded with blanks, or truncated, on the right to match
  * the length of \`z\`.
  *
  * Any arithmetic or bit arguments are converted to character.
  *
  * TRANSLATE supports UCHAR data. But if x has UCHAR type, then z
  * must not be omitted.
  *
  * TRANSLATE does not support GRAPHIC or WIDECHAR data.
  *
  * TRANSLATE will perform best when the second and third arguments
  * are either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl source char value("Ein Raetsel gibt es nicht.");
  *   dcl target char(length(source));
  *   dcl (to   value ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  *        from value ('abcdefghijklmnopqrstuvwxyz')) char;
  *
  *   target = translate(source, to, from);
  *            // "EIN RAETSEL GIBT ES NICHT."
  * \`\`\`
  *
  * Note that you could also use the UPPERCASE built-in for the same
  * purpose as the TRANSLATE built-in in the example above. However,
  * while the UPPERCASE built-in function will translate only the
  * standard alphabetic characters, TRANSLATE can be used to
  * translate other characters. For example, if "Raetsel" were
  * spelled with an ä-umlaut, TRANSLATE could translate the ä-umlaut
  * to Ä-umlaut if those characters were added to the \`from\` and
  * \`to\` strings, respectively.
  *
  * @param x Character expression to be searched
  *   for possible translation of its characters.
  * @param y Character expression containing the
  *   translation values of characters.
  * @param [z] Character expression containing the
  *   characters that are to be translated. If \`z\` is omitted, it
  *   defaults to collate().
  * @returns \`x\` with characters of \`z\` translated to
  *   corresponding characters in \`y\`.
  */
 TRANSLATE: PROC (x, y, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL z ANY<CHARACTER> OPTIONAL;
 END;
 /**
  * TRIM returns a nonvarying character string with characters
  * trimmed from one or both ends.
  *
  * If \`y\` and \`z\` are both omitted, they both default to a
  * CHAR(1) NONVARYING string containing one blank.
  *
  * **Example**
  *
  * In the following example, the TRIM function removes
  *
  * - all the blanks from the left side of the string.
  * - all the blanks and all the asterisks from the right side of
  * the string.
  *
  * \`\`\`
  *   dcl Source char value(" *** PL/I's got the Power!  ***  ");
  *   dcl Target char(length(Source)) varying;
  *
  *   Target = trim(Source, ' ', '* ');
  *                // "*** PL/I's got the Power!"
  *
  * \`\`\`
  *
  * @param x Expressions.
  *
  *   Each must have a computational type and should have CHARACTER
  *   type or UCHAR type. If not, they are converted.
  *
  *   \`x\` is the string from which the characters defined by \`y\`
  *   are trimmed from the left, and the characters defined by \`z\`
  *   are trimmed from the right.
  *
  *   If \`z\` is omitted, it defaults to a CHARACTER(1) NONVARYING
  *   string containing one blank.
  * @param [y] See \`x\`.
  * @param [z] See \`x\`.
  * @returns \`x\` with leading \`y\` and trailing \`z\`
  *   characters trimmed.
  */
 TRIM: PROC (x, y, z) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER> OPTIONAL;
    DCL z ANY<CHARACTER> OPTIONAL;
 END;
 /**
  * UHIGH returns a UCHAR string of length x with each UTF-8 data
  * item having the highest UCHAR value ('F48FBFBF'ux).
  *
  * The value returned by BYTELENGTH(UHIGH(x)) is equal to 4*x.
  *
  * @param x Expression. x must have UCHAR type.
  * @returns UCHAR string of length \`x\` with each item
  *   set to the highest UCHAR value.
  */
 UHIGH: PROC (x) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * ULENGTH returns a FIXED BINARY(31) value that is the number of
  * UTF characters held in a string.
  *
  * If \`x\` has CHARACTER type, then the string must contain valid
  * UTF-8 data. If not, the program is in error.
  *
  * If \`x\` has WIDECHAR type, then the string must contain valid
  * UTF-16 data. If not, the program is in error.
  *
  * ULENGTH will return the number of UTF-8 or UTF-16 characters
  * held in the CHAR or WIDECHAR argument, respectively. It does not
  * return the number of characters if the string were normalized.
  * For example, in UTF-8, a lowercase a umlaut may be represented
  * in the normalized or canonical form via the string 'c3_a4'x or
  * in the unnormalized or combining form as '61_cc_88'x, but
  * ULENGTH will return 1 for the string 'c3_a4'x and 2 for the
  * string '61_cc_88'x.
  *
  * @param x Expression. x must have CHARACTER or
  *   WIDECHAR type.
  * @returns The number of UTF characters in \`x\`.
  */
 ULENGTH: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * ULENGTH8 returns a FIXED BIN(31) value, which is the length of a
  * CHAR string needed if the UTF characters held in a string were
  * converted to UTF-8.
  *
  * If \`x\` has CHARACTER type, then ULENGTH8 is the same as
  * LENGTH, and the string will not be checked for valid UTF-8 data.
  *
  * If \`x\` has WIDECHAR type, then the string must contain valid
  * UTF-16 data, and ULENGTH8 will return the length of the CHAR
  * string that would result if \`x\` were converted from UTF-16 to
  * UTF-8. If the string does not contain valid UTF-16 data, the
  * program is in error.
  *
  * For example, if \`x\` equals the WIDECHAR string
  * '004B_00E4_0073_0065'wx, then ULENGTH8(x) returns 5.
  *
  * @param x Expression. x must have CHARACTER or
  *   WIDECHAR type.
  * @returns The length of the CHAR string needed to
  *   hold \`x\` converted to UTF-8.
  */
 ULENGTH8: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * ULENGTH16 returns a FIXED BINARY(31) value that is the length of
  * a WIDECHAR string needed when the UTF characters held in a
  * string were converted to UTF-16.
  *
  * If \`x\` has CHAR type, then the string must contain valid UTF-8
  * data, and ULENGTH16 will return the length of the WIDECHAR
  * string that would result if \`x\` were converted from UTF-8 to
  * UTF-16. If the string does not contain valid UTF-8 data, the
  * program is in error.
  *
  * If \`x\` has WIDECHAR type, then ULENGTH16 is the same as
  * LENGTH, and the string will not be checked for valid UTF-16
  * data.
  *
  * For example, if \`x\` equals the CHARACTER string
  * '4b_c3_a4_73_65'x, then ULENGTH16(x) returns 4.
  *
  * @param x Expression. x must have CHARACTER or
  *   WIDECHAR type.
  * @returns The length of the WIDECHAR string needed
  *   to hold \`x\` converted to UTF-16.
  */
 ULENGTH16: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * ULOW returns a UCHAR string of length x with each UTF-8 data
  * item having the lowest UCHAR value ('00'ux).
  *
  * The value returned by BYTELENGTH(ULOW(x)) is equal to x.
  *
  * @param x Expression. x must have UCHAR type.
  * @returns UCHAR string of length \`x\` with each item
  *   set to the lowest UCHAR value.
  */
 ULOW: PROC (x) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * UPOS returns a FIXED BIN(31) value which is the index of the nth
  * UTF character in a string.
  *
  * If \`x\` has CHARACTER type, then the string must contain valid
  * UTF-8 data. If not, the program is in error.
  *
  * If \`x\` has WIDECHAR type, then the string must contain valid
  * UTF-16 data. If not, the program is in error.
  *
  * If \`n\` is not positive or if \`n\` is larger than ULENGTH(x),
  * then zero will be returned. Otherwise, if \`x\` has CHARACTER
  * type, then UPOS(x,n) will return the position of the byte where
  * the nth UTF-8 character starts, and if \`x\` has WIDECHAR type,
  * then UPOS(x,n) will return the position of the widechar
  * character where the nth UTF-16 character starts.
  *
  * For example, if x equals the CHARACTER string
  * '4b_c3_a4_66_65_72'x, then
  *
  * - UPOS(x,1) returns 1
  * - UPOS(x,2) returns 2
  * - UPOS(x,3) returns 4
  * - UPOS(x,4) returns 5
  * - UPOS(x,5) returns 6
  *
  * @param x Expression which must have CHARACTER
  *   or WIDECHAR type.
  * @param n Expression which must have computational
  *   type and which will be converted to FIXED BIN(31) if
  *   necessary.
  * @returns The index of the \`n\`th UTF character
  *   in \`x\`.
  */
 UPOS: PROC (x, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL n FIXED BINARY;
 END;
 /**
  * UPPERASCII returns a UCHAR string with all of its ASCII
  * characters converted to their corresponding uppercase
  * characters.
  *
  * UPPERASCII(x) is equivalent to TRANSLATE(x, 'A...Z', 'a...z').
  *
  * @param x Expression. x must have UCHAR type.
  * @returns \`x\` with ASCII characters converted to
  *   uppercase.
  */
 UPPERASCII: PROC (x) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * UPPERCASE returns a character string with all characters
  * converted to their uppercase equivalent.
  *
  * UPPERCASE(\`x\`) is equivalent to TRANSLATE(x, 'A...Z', 'a...z')
  * and UPPERCASE(\`x\`, \`c\` ) is equivalent to TRANSLATE(x,
  * upperc, lowerc). The values of \`upperc\` and \`lowerc\` are
  * determined by the value of the code page \`c\`. Specifying
  * UPPERCASE(\`x\`, \`c\`) will not only translate alphabetic
  * characters 'a...z' to 'A...Z', but also translate characters
  * such as lowercase ä-umlaut('c0'x) to uppercase Ä-umlaut('4a'x).
  *
  * For example, if the Lower_01141 was declared as:
  *
  * \`\`\`
  * dcl lower_01141 char
  *  value( (
  *               '8182838485868788'8991929394959697'x
  *            || '9899A2A3A4A5A6A7A8A9424445464748'x
  *            || '4951525354555657'586A708C8D8E9CC0'x
  *            || 'CBCDCECFD0DBDDDE'x
  *         ) );
  * \`\`\`
  *
  * and the Upper_01141 was declared as:
  *
  * \`\`\`
  * dcl upper_01141 char
  *   value( (
  *               'C1C2C3C4C5C6C7C8C9D1D2D3D4D5D6D7'x
  *            || 'D8D9E2E3E4E5E6E7E8E9626465666768'x
  *            || '6971727374757677'78E080ACADAE9E4A'x
  *            || 'EBEDEEEF5AFBFDFE'x
  *         ) );
  * \`\`\`
  *
  * then UPPERCASE(x, 1141 ) would be the same as TRANSLATE( x,
  * Upper_01141, Lower_01141 ).
  *
  * The appendix lists the values of \`upperc\` and \`lowerc\` for
  * the supported values of \`c\`. For details, see Limits.
  *
  * @param x An expression. If necessary, \`x\` is
  *   converted to character.
  * @param [c] An expression that specifies the code
  *   page that will be uppercased.
  * @returns \`x\` with all characters converted to
  *   uppercase.
  */
 UPPERCASE: PROC (x, c) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
    DCL c FIXED BINARY OPTIONAL;
 END;
 /**
  * UPPERLATIN1 returns a UCHAR string with all of its ASCII and
  * Latin-1 supplement characters converted to their corresponding
  * uppercase characters.
  *
  * The letters Y with DIAERESIS(ÿ) and SHARP S(ß) are not changed.
  *
  * @param x Expression. x must have UCHAR type.
  * @returns \`x\` with ASCII and Latin-1 characters
  *   converted to uppercase.
  */
 UPPERLATIN1: PROC (x) RETURNS (CHARACTER);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * USUBSTR returns a substring of a UTF string.
  *
  * If \`x\` has CHARACTER type, then the string must contain valid
  * UTF-8 data. If not, the program is in error.
  *
  * If \`x\` has WIDECHAR type, then the string must contain valid
  * UTF-16 data. If not, the program is in error.
  *
  * The ERROR condition (and not the STRINGRANGE condition) will
  * also be raised if
  *
  * - \`i\` is less than 1, or
  * - \`j\` is less than zero, or
  * - \`i + j - 1\` is larger than ULENGTH(x)
  *
  * If \`x\` has CHARACTER type, then USUBSTR(x,i,j) will return a
  * CHARACTER string containing the \`j\` UTF-8 characters in \`x\`
  * starting with the \`i\`th UTF-8 character.
  *
  * If \`x\` has WIDECHAR type, then USUBSTR(x,i,j) will return a
  * WIDECHAR string containing the \`j\` UTF-16 characters in \`x\`
  * starting with the \`i\`th UTF-16 character.
  *
  * In general, USUBSTR(x,i,j) will not equal SUBSTR(x,i,j).
  *
  * For example, if x equals the CHARACTER string
  * '4b_c3_a4_66_65_72'x, then
  *
  * -
  * -
  * -
  * -
  *
  * @param x Expression which must have CHARACTER
  *   or WIDECHAR type.
  * @param i Expression which must have computational
  *   type and which will be converted to FIXED BIN(31) if
  *   necessary.
  * @param j Expression which must have computational
  *   type and which will be converted to FIXED BIN(31) if
  *   necessary.
  * @returns The \`j\` UTF characters of \`x\`
  *   starting at the \`i\`th character.
  */
 USUBSTR: PROC (x, i, j) RETURNS (ANY<CHARACTER>);
    DCL x ANY<CHARACTER>;
    DCL i FIXED BINARY;
    DCL j FIXED BINARY;
 END;
 /**
  * USUPPLEMENTARY returns a FIXED BIN(31) value that is either the
  * index of the first of the UTF surrogate pair in a string or zero
  * if the string contains no UTF surrogate pairs.
  *
  * If \`x\` has CHARACTER type, then the string must contain valid
  * UTF-8 data. However, the validity of the data will not be
  * checked. If the data is invalid, the ERROR condition will not be
  * raised, the program is in error, and the result returned by this
  * function will be unpredictable.
  *
  * If \`x\` has WIDECHAR type, then the string must contain valid
  * UTF-16 data. However, the validity of the data will not be
  * checked. If the data is invalid, the ERROR condition will not be
  * raised, the program is in error, and the result returned by this
  * function will be unpredictable.
  *
  * As an example, the musical G-clef is represented by the UTF-16
  * surrogate pair 'D834_DD1E'wx, and hence in the following code,
  * the value 3 will be listed:
  *
  * \`\`\`
  *     dcl w  wchar(20) varying;
  *     dcl jx fixed bin;
  *
  *     w = '0020_0020_D834_DD1E'wx
  *
  *     jx = usupplementary(w);
  *
  *     put skip list(jx);
  * \`\`\`
  *
  * @param x Expression which must have CHARACTER
  *   or WIDECHAR type.
  * @returns Index of the first UTF surrogate pair in
  *   \`x\`, or zero if none.
  */
 USUPPLEMENTARY: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * UTF8(x) returns a CHAR value that is the UTF-8 equivalent of x.
  *
  * If x has the type other than WIDECHAR, the CODEPAGE option
  * specifies the value for the code page of x when it is converted
  * to UTF-8.
  *
  * If x has the WIDECHAR type, it is converted to UTF-8 under the
  * assumption that x holds UTF-16.
  *
  * You can use UTF8(x) in restricted expressions. Therefore, you
  * can use UTF8(x) to create UTF-8 literals.
  *
  * Notes: If x has the CHAR type, the length of UTF8(x) might be
  * two times as large as the length of x. If x has the WCHAR type,
  * the length of UTF8(x) might be three times as the length of x.
  * If the length of UTF8 exceeds the maximum length of CHAR, the
  * generated code raises the ERROR condition. If x has the WCHAR
  * type and holds invalid UTF-16 data, the generated code raises
  * the ERROR condition. For example, UTF8('babb'x,1140) and
  * UTF8('63fc'x,1141) will both return '5b5d'x. Because on code
  * page 1140, 'ba'x and 'bb'x correspond to UTF-8 characters '5b'x
  * and '5d'x; but on code page 1141, '63'x and 'fc'x map to UTF-8
  * characters '5b'x and '5d'x.
  *
  * @param x An expression that must have one of these types:
  *   FIXED, FLOAT, PICTURE, BIT, CHAR, or WIDECHAR.
  * @param [c] A restricted expression that specifies
  *   the code page of the source. It is ignored if x has WIDECHAR
  *   type.
  *
  *   The code page must have a computational type and is converted
  *   to type FIXED BINARY (31,0). The code page must specify a
  *   valid, supported code page.
  * @returns The UTF-8 equivalent of \`x\`.
  */
 UTF8: PROC (x, c) RETURNS (CHARACTER);
    DCL x ANY;
    DCL c FIXED BINARY OPTIONAL;
 END;
 /**
  * UTF8STG returns a FIXED BIN value that specifies the number of
  * bytes that must be present if the input character is the start
  * of a valid UTF-8 character.
  *
  * The function returns zero if the character cannot be the start
  * of a valid UTF-8 character. For example, if the character has
  * the value '80'x, UTF8STG returns zero.
  *
  * @param x Specifies the input character. x must be
  *   of the type CHAR(1).
  * @returns The number of bytes needed for the
  *   UTF-8 character starting with \`x\`, or zero if invalid.
  */
 UTF8STG: PROC (x) RETURNS (FIXED BINARY);
    DCL x CHARACTER;
 END;
 /**
  * UTF8TOCHAR(x) returns a CHAR value holding x converted from
  * UTF-8.
  *
  * Note: If x holds invalid UTF-8 data, the generated code raises
  * the ERROR condition.
  *
  * @param x An expression that must have the CHAR
  *   type.
  *
  *   When x is converted from UTF-8 to CHAR, the CODEPAGE option
  *   is used to specify the target code page.
  * @param [c] A restricted expression that
  *   specifies the code page of x.
  *
  *   If omitted, it defaults to the value in the CODEPAGE compiler
  *   option.
  *
  *   If specified, the code page must have a computational type and
  *   is converted to FIXED BINARY (31,0). The code page must
  *   specify a valid, supported code page.
  * @returns The converted CHAR value.
  */
 UTF8TOCHAR: PROC (x, c) RETURNS (CHARACTER);
    DCL x CHARACTER;
    DCL c FIXED BINARY OPTIONAL;
 END;
 /**
  * UTF8TOWCHAR(x) returns a WCHAR value holding x converted from
  * UTF-8 to UTF-16.
  *
  * You can use UTF8TOWCHAR(x) in restricted expressions.
  *
  * Note: If x holds invalid UTF-8 data, the generated code raises
  * the ERROR condition.
  *
  * @param x An expression that must have the CHAR
  *   type. x is converted from UTF-8 to UTF-16.
  * @returns WCHAR value holding x converted from
  *   UTF-8 to UTF-16.
  */
 UTF8TOWCHAR: PROC (x) RETURNS (WIDECHAR);
    DCL x CHARACTER;
 END;
 /**
  * UVALID returns a FIXED BINARY(31) value which is zero if a
  * string contains valid UTF data and which is the index of the
  * first invalid element if the string does not contain valid UTF
  * data.
  *
  * If \`x\` has CHARACTER type, then UVALID(x) will return 0 if the
  * string contains valid UTF-8 data. Otherwise, it will return the
  * index of the BYTE where the first invalid UTF-8 data starts.
  *
  * If x has UCHAR type, then UVALID(x) will return 0 if the string
  * contains valid UTF-8 data. Otherwise, it will return the index
  * of the UCHAR where the first invalid UTF-8 data starts.
  *
  * If \`x\` has WIDECHAR or WIDEPIC type, then UVALID(x) will
  * return 0 if the string contains valid UTF-16 data. Otherwise, it
  * will return the index of the WIDECHAR where the first invalid
  * UTF-16 data starts.
  *
  * Note that UVALID will indicate if the string contains valid UTF
  * data (according to the rules below). It does not indicate if
  * these bytes have actually been allocated to represent any
  * particular character.
  *
  * For UTF-8 data, the validity of a byte varies as follows
  * according to its range:
  *
  * - '00'x - '7f'x, it is valid
  * - '80'x - 'c1'x, it is invalid
  * - 'c2'x - 'df'x, it is valid if followed by a second byte and if
  * that byte is in the range '80'x to 'bf'x
  * - 'e0'x - 'ef'x, it is valid if followed by 2 more bytes and if
  *   - when the first byte is 'e0'x, the second and third bytes
  *   must be in the ranges 'a0'x to 'bf'x and '80'x to 'bf'x,
  *   respectively.
  *   - when the first byte is in the range 'e1'x to 'ec'x, the
  *   second and third bytes must be in the ranges '80'x to 'bf'x
  *   - when the first byte is 'ed'x, the second and third bytes
  *   must be in the ranges '80'x to '9f'x and '80'x to 'bf'x,
  *   respectively.
  *   - when the first byte is in the range 'ee'x to 'ef'x, the
  *   second and third bytes must be in the ranges '80'x to 'bf'x
  * - 'f0'x - 'f4'x, it is valid if followed by 3 more bytes and if
  *   - when the first byte is 'f0'x, the second, third and fourth
  *   bytes must be in the ranges '90'x to 'bf', '80'x to 'bf'x and
  *   '80'x to 'bf'x, respectively.
  *   - when the first byte is in the range 'f1'x to 'f3'x, the
  *   second, third and fourth bytes must be in the range '80'x to
  *   'bf'x
  *   - when the first byte is 'f4'x, the second, third and fourth
  *   bytes must be in the ranges '80'x to '8f'x, '80'x to 'bf'x and
  *   '80'x to 'bf'x, respectively.
  * - 'f5'x - 'ff'x, it is invalid
  *
  * For UTF-16 data, the validity of a widechar varies as follows
  * according to its range:
  *
  * - '0000'wx - '007f'wx, it is valid and would be 1 byte if UTF-8
  * - '0080'wx - '07ff'wx, it is valid and would be 2 bytes if UTF-8
  * - '0800'wx - 'd7ff'wx, it is valid and would be 3 bytes if UTF-8
  * - 'd800'wx - 'dbff'wx, it is valid if followed by a second
  * widechar with a value greater than or equal to 'dc00'wx and less
  * than or equal to 'dfff'wx. It is a unicode surrogate pair and
  * would be 4 bytes if UTF-8
  * - 'dc00'wx - 'dfff'wx, it is valid only when it is the second
  * half of a surrogate pair
  * - 'e000'wx - 'ffff'wx, it is valid and would be 3 bytes if UTF-8
  *
  * @param x Expression which must have
  *   CHARACTER, UCHAR, WIDECHAR or WIDEPIC type.
  * @returns Zero if the string contains valid UTF
  *   data, or the index of the first invalid element.
  */
 UVALID: PROC (x) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
 END;
 /**
  * UWIDTH returns a FIXED BIN(31) value, which is the width of the
  * nth UTF character in a string.
  *
  * If \`x\` has CHARACTER type, then the string must contain valid
  * UTF-8 data. If not, the program is in error.
  *
  * If \`x\` has WIDECHAR type, then the string must contain valid
  * UTF-16 data. If not, the program is in error.
  *
  * If \`n\` is not positive or if \`n\` is larger than ULENGTH(x),
  * then zero will be returned. Otherwise, if \`x\` has CHARACTER
  * type, then UWIDTH(x,n) will return the width of the nth UTF-8
  * character, and if \`x\` has WIDECHAR type, then UWIDTH(x,n) will
  * return the width of the nth UTF-16 character.
  *
  * For example, if x equals the CHARACTER string
  * '4b_c3_a4_66_65_72'x, then
  *
  * - UWIDTH(x,1) returns 1
  * - UWIDTH(x,2) returns 2
  * - UWIDTH(x,3) returns 1
  * - UWIDTH(x,4) returns 1
  * - UWIDTH(x,5) returns 1
  *
  * @param x Expression which must have CHARACTER
  *   or WIDECHAR type.
  * @param n Expression which must have computational
  *   type and which will be converted to FIXED BIN(31) if
  *   necessary.
  * @returns The width of the nth UTF character.
  */
 UWIDTH: PROC (x, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL n ANY<NUMBER>;
 END;
 /**
  * VERIFY returns an unscaled REAL FIXED BINARY value that
  * indicates the position in \`x\` of the leftmost character, bit,
  * graphic, uchar, or widechar that is not in \`y\`. It also allows
  * you to specify the location within \`x\` at which to begin
  * processing.
  *
  * If all the characters, bits, graphics, uchars, or widechars in
  * \`x\` do appear in \`y\`, a value of zero is returned. If \`x\`
  * is the null string, a value of zero is returned. If \`x\` is not
  * the null string and \`y\` is the null string, the value of \`n\`
  * is returned. The default value for \`n\` is one.
  *
  * Unless 1 ≤ \`n\` ≤ LENGTH(\`x\`) + 1, the STRINGRANGE condition,
  * if enabled, is raised. Its implicit action and normal return
  * give a result of 0. If \`n\` = LENGTH(\`x\`) + 1, the result is
  * zero.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * VERIFY will perform best when the second and third arguments are
  * either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  *
  * **Example**
  *
  * \`\`\`
  *   X = '  a  b';         // Two blanks in each space
  *   Y = ' ';              // One blank
  *   N = 1;
  *   I = verify(X,Y,N);    // I = 3
  *
  *   do while (I > 0);
  *     display ( 'Nonblank at position ' || trim(I) );
  *     N = I + 1;
  *     I = verify(X,Y,N);
  *   end;
  * \`\`\`
  *
  * After the first pass through the do-loop, N=4 and VERIFY(X,Y,N)
  * returns 6. After the second pass, N=7 and (LENGTH(x)+1),
  * VERIFY(X,Y,N) now returns 0, and the loop ends.
  *
  * For more examples of the VERIFY built-in function, see SEARCH.
  *
  * @param x String-expression.
  * @param y String-expression.
  * @param [n] Expression \`n\` specifies the
  *   location within \`x\` where processing begins. It must have
  *   a computational type and is converted to FIXED BINARY(31,0).
  * @returns Position of the leftmost character in
  *   \`x\` that is not in \`y\`, or zero.
  */
 VERIFY: PROC (x, y, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * VERIFYR performs the same operation as the VERIFY built-in
  * function except that the verification is done from right to
  * left.
  *
  * Another difference is that the default value for \`n\` is
  * LENGTH(\`x\`).
  *
  * Unless 0 ≤ \`n\` ≤ LENGTH(\`x\`), the STRINGRANGE condition, if
  * enabled, is raised. If \`n\` = 0, the result is zero.
  *
  * The BIFPREC compiler option determines the precision of the
  * result returned.
  *
  * VERIFYR will perform best when the second and third arguments
  * are either literals, named constants declared with the VALUE
  * attribute, or restricted expressions.
  *
  * For argument descriptions, see VERIFY.
  *
  * **Example**
  *
  * \`\`\`
  *   X = 'a  b  ';         // Two blanks in each space
  *   Y = ' ';              // One blank
  *   N = length(X);        // N = 6
  *   I = verifyr(X,Y,N);   // I = 4
  *
  *   do while (I > 0);
  *     display ( 'Nonblank at position ' || trim(I) );
  *     N = I - 1;
  *     I = verifyr(X,Y,N);
  *   end;
  * \`\`\`
  *
  * After the first pass through the do-loop, N=3 and VERIFYR(X,Y,N)
  * returns 1. After the second pass, N=0, VERIFYR(X,Y,N) returns 0,
  * and the loop ends. For another example, see SEARCHR.
  *
  * @param x String-expression.
  * @param y String-expression.
  * @param [n] Expression \`n\` specifies the
  *   location within \`x\` where processing begins. It must have
  *   a computational type and is converted to FIXED BINARY(31,0).
  * @returns Position of the rightmost character in
  *   \`x\` that is not in \`y\`, or zero.
  */
 VERIFYR: PROC (x, y, n) RETURNS (FIXED BINARY);
    DCL x ANY<CHARACTER>;
    DCL y ANY<CHARACTER>;
    DCL n FIXED BINARY OPTIONAL;
 END;
 /**
  * WHIGH returns a widechar string of length \`x\`, where each
  * widechar has the highest widechar value (hexadecimal FFFF).
  *
  * @param x Expression. If necessary, \`x\` is
  *   converted to a positive real fixed-point binary value. If
  *   \`x\` = 0, the result is the null widechar string.
  * @returns Widechar string of length \`x\`.
  */
 WHIGH: PROC (x) RETURNS (WIDECHAR);
    DCL x ANY<NUMBER>;
 END;
 /**
  * WIDECHAR returns the widechar value of \`x\`, with a length
  * specified by \`y\`.
  *
  * Abbreviation: WCHAR
  *
  * @param x Expression.
  *
  *   \`x\` must have a computational type.
  *
  *   The values of \`x\` are not checked.
  * @param [y] Expression. If necessary, y is
  *   converted to a real fixed-point binary value.
  *
  *   If \`y\` is omitted, the length is determined by the rules for
  *   type conversion.
  *
  *   \`y\` cannot be negative.
  *
  *   If \`y\` = 0, the result is the null widechar string.
  * @returns The widechar value of \`x\`.
  */
 WIDECHAR: WCHAR: PROC (x, y) RETURNS (WIDECHAR);
    DCL x ANY;
    DCL y ANY<NUMBER> OPTIONAL;
 END;
 /**
  * WLOW returns a widechar string of length x, where each widechar
  * has the lowest widechar value (hexadecimal 0000).
  *
  * @param x Expression. If necessary, \`x\` is
  *   converted to a positive real fixed-point binary value. If
  *   \`x\` = 0, the result is the null widechar string.
  * @returns Widechar string of length x.
  */
 WLOW: PROC (x) RETURNS (WIDECHAR);
    DCL x ANY<NUMBER>;
 END;

 /* Subroutines */
 /**
  * The LOCNEWSPACE(x, a) built-in subroutine allocates space in a
  * for the variable type described by the LOCATES attribute that is
  * associated with x.
  *
  * In the following code snippet, the two executable statements are
  * equivalent: Both statements allocate 32 bytes from the pool area
  * and assign that offset to name(1).
  *
  * \`\`\`
  * 	     declare
  *              1 data based(data_ptr) unaligned,
  *                 2 actual_count fixed bin(31),
  *                 2 orderinfo(order_count refer( actual_count)),
  *                    3 name    offset(pool) locates(char(30) varying),
  *                    3 address offset(pool) locates(char(62) varying),
  *                 2 pool area(10_000);
  *
  *        call locnewspace(name(1));
  *        call locnewspace(name(1), pool);
  * \`\`\`
  *
  * @param x Must be an OFFSET reference with the
  *   LOCATES attribute. x must be scalar.
  * @param [a] Must be an AREA reference. a must be
  *   scalar.
  *
  *   If you do not specify a, the OFFSET attribute for x must have
  *   specified an AREA reference, and LOCNEWSPACE allocates space
  *   in that area.
  */
 LOCNEWSPACE: PROC (x, a);
    DCL x ANY<LOCATOR>;
    DCL a ANY<AREA> OPTIONAL;
 END;
 /**
  * The LOCNEWVALUE(v, x, a) built-in subroutine allocates space in
  * a for the variable type described by the LOCATES attribute that
  * is associated with x and assigns v to that area.
  *
  * The following three statements are equivalent:
  *
  * -
  * -
  * -
  *
  * If the OFFSET attribute for x specifies an AREA attribute, the
  * following statements are equivalent:
  *
  * -
  * -
  * -
  *
  * In the following code snippet, the two executable statements are
  * equivalent: Both statements allocate 17 bytes in the pool area,
  * assign that offset to name(1), and assign the 'Sherlock Holmes'
  * value as a character varying string to that location in the
  * area.
  *
  * \`\`\`
  *             declare
  *               1 data based(data_ptr) unaligned,
  *                 2 actual_count fixed bin(31),
  *                 2 orderinfo(order_count refer(actual_count)),
  *                    3 name    offset(pool) locates(char(30) varying),
  *                    3 address offset(pool) locates(char(62) varying),
  *                 2 pool area(10_000);
  *
  *             call locnewvalue('Sherlock Holmes', name(1));
  *             call locnewvalue('Sherlock Holmes', name(1), pool);
  * \`\`\`
  *
  * @param v Must be computational and scalar.
  * @param x Must be an OFFSET reference with the
  *   LOCATES attribute. x must be scalar.
  * @param [a] Must be an AREA reference. a must be
  *   scalar.
  *
  *   If you do not specify a, the OFFSET attribute for x must have
  *   specified an AREA reference, and LOCNEWSPACE allocates space
  *   in that area.
  */
 LOCNEWVALUE: PROC (v, x, a);
    DCL v ANY;
    DCL x ANY<LOCATOR>;
    DCL a ANY<AREA> OPTIONAL;
 END;
 /**
  * PLIASCII converts z bytes of an EBCDIC value at location y to an
  * ASCII value at location x.
  *
  * The storage at location x and y must not overlap unless they
  * specify the same location.
  *
  * @param x Expression with type POINTER or OFFSET.
  *   If the type is OFFSET, the expression must be an OFFSET
  *   variable declared with the AREA attribute.
  * @param y Expression with type POINTER or OFFSET.
  *   If the type is OFFSET, the expression must be an OFFSET
  *   variable declared with the AREA attribute.
  * @param z Expression. It must have a computational
  *   type and is converted to type size_t.1
  */
 PLIASCII: PROC (x, y, z);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * PLIATTN causes the ATTENTION condition to be raised at that
  * point in the code. It gives you explicit control over where the
  * compiler inserts attention breakpoints.
  *
  * The INTERRUPT option has no effect on the code that is generated
  * for a call to this subroutine.
  */
 PLIATTN: PROC ();
 END;
 /**
  * PLICANC allows you to cancel the automatic restart facility.
  *
  * For more information about using PLICANC, see the Programming
  * Guide.
  */
 PLICANC: PROC ();
 END;
 /**
  * PLICKPT allows you to take a checkpoint for later restart.
  *
  * For more information about using PLICKPT, see the Programming
  * Guide.
  *
  * @param [argument] Checkpoint expressions such as ddname
  *   and check-id.
  */
 PLICKPT: PROC (argument);
    DCL argument ANY LIST;
 END;
 /**
  * PLIDELETE frees the storage associated with the handle \`x\`.
  *
  * PLIDELETE(x) is the best way to free the storage associated with
  * a handle; this storage is usually acquired by the NEW type
  * function.
  *
  * CALL PLIDELETE(x) is equivalent to CALL PLIFREE(PTRVALUE(x)).
  *
  * @param x Handle expression.
  */
 PLIDELETE: PROC (x);
    DCL x ANY<LOCATOR>;
 END;
 /**
  * PLIDUMP allows you to obtain a formatted dump of selected parts
  * of storage that is used by your program.
  *
  * For more information about using PLIDUMP, refer to the
  * Programming Guide.
  *
  * @param [argument] Checkpoint expressions such as ddname
  *   and check-id.
  */
 PLIDUMP: PROC (argument);
    DCL argument ANY LIST;
 END;
 /**
  * PLIEBCDIC converts z bytes of an ASCII value at location y to an
  * EBCDIC value at location x.
  *
  * The storage at location x and y must not overlap unless they
  * specify the same location.
  *
  * @param x Expression with type POINTER or OFFSET.
  *   If the type is OFFSET, the expression must be an OFFSET
  *   variable declared with the AREA attribute.
  * @param y Expression with type POINTER or OFFSET.
  *   If the type is OFFSET, the expression must be an OFFSET
  *   variable declared with the AREA attribute.
  * @param z Expression. It must have a computational
  *   type and is converted to type size_t.1
  */
 PLIEBCDIC: PROC (x, y, z);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * PLIFILL moves \`z\` copies of the byte \`y\` to the location
  * \`x\` without any conversions, padding, or truncation.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl 1 Str1,
  *         2 B  fixed bin(31),
  *         2 C  pointer,
  *         2 * union,
  *           3 D  char(4),
  *           3 E  fixed bin(31),
  *           3 *,
  *             4 * char(3),
  *             4 F fixed bin(8) unsigned,
  *         2 * char(0)
  *              initial call plifill( addr(Str1), '00'x, stg(Str1) );
  * \`\`\`
  *
  * @param x Expression. \`x\` must be declared
  *   POINTER or OFFSET. If it is OFFSET, x must be declared with
  *   the AREA attribute.
  * @param y Must be declared CHARACTER(1) NONVARYING.
  * @param z Expression. It is converted to type
  *   size_t 1.
  */
 PLIFILL: PROC (x, y, z);
    DCL x ANY<LOCATOR>;
    DCL y CHARACTER;
    DCL z ANY<NUMBER>;
 END;
 /**
  * PLIFREE frees the heap storage associated with the pointer \`p\`
  * that was allocated using the ALLOCATE built-in function.
  *
  * PLIFREE is the opposite of ALLOCATE (ALLOC).
  *
  * @param p Locator expression.
  */
 PLIFREE: PROC (p);
    DCL p ANY<LOCATOR>;
 END;
 /**
  * PLIMOVE moves \`z\` storage units (bytes) from location \`y\` to
  * location \`x\`, without any conversions, padding, or truncation.
  *
  * Unlike the PLIOVER built-in subroutine, storage at locations
  * \`x\` and \`y\` is assumed to be unique. If storage overlaps,
  * unpredictable results can occur.
  *
  * **Example**
  *
  * \`\`\`
  *   dcl 1 Str1,
  *         2 B  fixed bin(31),
  *         2 C  pointer,
  *         2 * union,
  *           3 D  char(4),
  *           3 E  fixed bin(31),
  *           3 *,
  *             4 * char(3),
  *             4 F fixed bin(8) unsigned,
  *         2 * char(0);
  *   dcl 1 Template nonasgn static,
  *         2 * fixed bin(31) init(200),
  *         2 * pointer init(sysnull()),
  *         2 * char(4) init(''),
  *         2 * char(0);
  *
  *   call plimove(addr(Str1), addr(Template), stg(Str1));
  * \`\`\`
  *
  * @param x Expression declared as POINTER or
  *   OFFSET. If the type is OFFSET, \`x\` must be declared with
  *   the AREA attribute.
  * @param y Expression declared as POINTER or
  *   OFFSET. If the type is OFFSET, \`y\` must be declared with
  *   the AREA attribute.
  * @param z Expression. It must have a computational
  *   type and is converted to type size_t.1
  */
 PLIMOVE: PROC (x, y, z);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * PLIOVER moves \`z\` storage units (bytes) from location \`y\` to
  * location \`x\`, without any conversions, padding, or truncation.
  * Unlike the PLIMOVE built-in subroutine, the storage at locations
  * \`x\` and \`y\` can overlap.
  *
  * @param x Expression declared as POINTER or
  *   OFFSET. If the type is OFFSET, \`x\` must be declared with
  *   the AREA attribute.
  * @param y Expression declared as POINTER or
  *   OFFSET. If the type is OFFSET, \`y\` must be declared with
  *   the AREA attribute.
  * @param z Expression. It must have a computational
  *   type and is converted to type size_t.1
  */
 PLIOVER: PROC (x, y, z);
    DCL x ANY<LOCATOR>;
    DCL y ANY<LOCATOR>;
    DCL z ANY<NUMBER>;
 END;
 /**
  * PLIPARSE parses a character string into substrings.
  *
  * There must at least 3 arguments and no more than 64.
  *
  * The first argument is the input string to be parsed (which can
  * be any expression with CHARACTER type).
  *
  * The arguments after that input string consist of an even number
  * of pairs with each pair consisting of
  *
  * - an even number of pairs with each pair consisting of a target
  * reference (or an *) and a separator
  * - an optional, last target argument that must be a reference (or
  * * )
  *
  * The first target argument after the first separator that is not
  * found is assigned the remaining input and any remaining target
  * arguments are assigned the quotation marks.
  *
  * Any target argument that is not an * must have CHARACTER type
  * and must be ASSIGNABLE.
  *
  * The separators must all have CHARACTER type.
  *
  * Example 1
  *
  * Given
  *
  * \`\`\`
  *     dcl x1    char(16) varying;
  *     dcl x2    char(16) varying;
  *     dcl x3    char(16) varying;
  *     dcl x4    char(16) varying;
  *
  *     dcl s1    char value('KEY:');
  *     dcl s2    char value('--');
  *     dcl s3    char value('-');
  *
  *     input = '31415KEY:0123--45678-9';
  *
  *     call pliparse( input, x1, s1, x2, s2, x3, s3, x4  );
  * \`\`\`
  *
  * the target arguments will have the following values
  *
  * \`\`\`
  *     x1 = '31415';
  *     x2 = '0123';
  *     x3 = '45678';
  *     x4 = '9';
  * \`\`\`
  *
  * Example 2
  *
  * In this example, "input" differs from the example above in that
  * there is no "--"
  *
  * Given
  *
  * \`\`\`
  *     dcl x1    char(16) varying;
  *     dcl x2    char(16) varying;
  *     dcl x3    char(16) varying;
  *     dcl x4    char(16) varying;
  *
  *     dcl s1    char value('KEY:');
  *     dcl s2    char value('--');
  *     dcl s3    char value('-');
  *
  *     input = '31415KEY:0123-45678-9';
  *
  *     call pliparse( input, x1, s1, x2, s2, x3, s3, x4  );
  * \`\`\`
  *
  * the target arguments will have the following values
  *
  * \`\`\`
  *     x1 = '31415';
  *     x2 = '0123-45678-9';
  *     x3 = '';
  *     x4 = '';
  * \`\`\`
  *
  * Example 3
  *
  * Given
  *
  * \`\`\`
  *     dcl x1    char(16) varying;
  *     dcl x2    char(16) varying;
  *     dcl x3    char(16) varying;
  *     dcl x4    char(16) varying;
  *
  *     input = ' Alex  Bruno';
  *
  *     call pliparse( input, x1, ' ', x2, ' ', x3, ' ', x4  );
  *
  * \`\`\`
  *
  * the target arguments will have the following values
  *
  * \`\`\`
  *     x1 = '';
  *     x2 = 'Alex';
  *     x3 = '';
  *     x4 = 'Bruno';
  * \`\`\`
  *
  * Example 4
  *
  * Given
  *
  * \`\`\`
  *     dcl x1    char(16) varying;
  *     dcl x2    char(16) varying;
  *     dcl x3    char(16) varying;
  *     dcl x4    char(16) varying;
  *     input = collapse( ' Alex  Bruno', ' ' );
  *
  *     call pliparse( input, x1, ' ', x2, ' ', x3, ' ', x4  );
  * \`\`\`
  *
  * the target arguments will have the following values
  *
  * \`\`\`
  *     x1 = 'Alex';
  *     x2 = 'Bruno';
  *     x3 = '';
  *     x4 = '';
  * \`\`\`
  * 
  * @param args There must at least 3 arguments and 
  *   no more than 64.
  * 
  * @todo TODO has overloads
  */
 PLIPARSE: PROC (args);
    DCL args ANY LIST;
 END;
 /**
  * PLIREST allows you to restart program execution.
  *
  * For more information about using PLIREST, see the Programming
  * Guide.
  */
 PLIREST: PROC ();
 END;
 /**
  * PLIRETC allows you to set a return code that can be examined by
  * the program that invoked this PL/I program or by another PL/I
  * procedure via the PLIRETV built-in function.
  *
  * @param x An expression yielding a FIXED
  *   BINARY(31,0) return code.
  */
 PLIRETC: PROC (x);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISAXA performs SAX-style parsing of an XML document that is
  * located in a buffer in your program.
  *
  * Note that if the XML is contained in a CHARACTER VARYING or
  * WIDECHAR VARYING string, the ADDRDATA built-in function should
  * be used to obtain the address of the first data byte.
  *
  * Also note that if the XML is contained in a WIDECHAR string,
  * the value for the number of bytes is twice the value returned
  * by the LENGTH built-in function.
  *
  * For more information, see the Programming Guide.
  *
  * @param e An event structure.
  * @param p A pointer value or "token" that will
  *   be passed back to the parsing events.
  * @param x The address of the buffer containing
  *   the input XML.
  * @param n The number of bytes of data in that
  *   buffer. It must have a computational type and is converted
  *   to type size_t.1
  * @param [c] A numeric expression specifying the
  *   purported codepage of that XML.
  */
 PLISAXA: PROC (e, p, x, n, c);
    DCL e ANY;
    DCL p ANY<LOCATOR>;
    DCL x ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL c ANY<NUMBER> OPTIONAL;
 END;
 /**
  * PLISAXB performs SAX-style parsing of an XML document that is
  * located in a file.
  *
  * For more information, see the Programming Guide.
  *
  * @param e An event structure
  * @param p A pointer value or "token" that will
  *   be passed back to the parsing events
  * @param x A character string expression specifying
  *   the input file
  * @param [c] A numeric expression specifying the
  *   purported codepage of that XML
  */
 PLISAXB: PROC (e, p, x, c);
    DCL e ANY;
    DCL p ANY<LOCATOR>;
    DCL x CHARACTER;
    DCL c ANY<NUMBER> OPTIONAL;
 END;
 /**
  * PLISAXC performs SAX-style parsing of an XML document that is
  * located in one or more buffers in your program.
  *
  * PLISAXC uses the z/OS XML System Services parser and is
  * supported only on z/OS.
  *
  * For more information, see the Enterprise PL/I for z/OS®
  * Programming Guide.
  *
  * @param e An event structure.
  * @param p A pointer value or "token" that will
  *   be passed back to the parsing events.
  * @param x The address of the buffer containing
  *   the XML document.
  * @param n The number of bytes of data in that
  *   buffer. It must have a computational type and is converted
  *   to type size_t.1
  * @param [c] A numeric expression specifying the
  *   codepage of that XML document.
  */
 PLISAXC: PROC (e, p, x, n, c);
    DCL e ANY;
    DCL p ANY<LOCATOR>;
    DCL x ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL c ANY<NUMBER> OPTIONAL;
 END;
 /**
  * PLISAXD provides SAX-style parsing with XML validation of an
  * XML document.
  *
  * PLISAXD uses the z/OS® XML System Services parser and is
  * supported only on z/OS.
  *
  * For more information, see the chapter Using the PLISAXD XML
  * parser in the Enterprise PL/I for z/OS Programming Guide.
  *
  * Note: An OSR is a preprocessed version of a schema. For more
  * information about OSR, see the XML System Services User's
  * Guide and Reference.
  *
  * @param e An event structure.
  * @param p A pointer value or "token" that will
  *   be passed back to the parsing events.
  * @param x The address of s buffer that contains
  *   the XML document.
  * @param n The number of bytes of data in that
  *   buffer. It must have a computational type and is converted
  *   to type size_t.1
  * @param o The address of a buffer that contains
  *   an Optimized Schema Representation (OSR).
  * @param [c] A numeric expression specifying the
  *   codepage of that XML document.
  */
 PLISAXD: PROC (e, p, x, n, o, c);
    DCL e ANY;
    DCL p ANY<LOCATOR>;
    DCL x ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL o ANY<LOCATOR>;
    DCL c ANY<NUMBER> OPTIONAL;
 END;
 /**
  * PLISRTA sorts an input file to produce a sorted output file.
  *
  * For more information, see the Programming Guide.
  *
  * @param argument Sort arguments.
  */
 PLISRTA: PROC (argument);
    DCL argument ANY LIST;
 END;
 /**
  * PLISRTB sorts input records provided by an E15 PL/I exit
  * procedure to produce a sorted output file.
  *
  * For more information, see the Programming Guide.
  *
  * @param argument Sort arguments.
  */
 PLISRTB: PROC (argument);
    DCL argument ANY LIST;
 END;
 /**
  * PLISRTC sorts an input file to produce sorted records that are
  * processed by an E35 PL/I exit procedure.
  *
  * For more information, see the Enterprise PL/I for z/OSPL/I
  * for AIX Programming Guide.
  *
  * @param argument Sort arguments.
  */
 PLISRTC: PROC (argument);
    DCL argument ANY LIST;
 END;
 /**
  * PLISRTD sorts input records provided by an E15 PL/I exit
  * procedure to produce sorted records that are processed by an
  * E35 PL/I exit procedure.
  *
  * For more information, see the Programming Guide.
  *
  * @param argument Sort arguments.
  */
 PLISRTD: PROC (argument);
    DCL argument ANY LIST;
 END;
 /**
  * PLISTCK generates the corresponding store clock hardware
  * instruction and returns the condition code set by the
  * instruction.
  *
  * @param x REAL UNSIGNED FIXED BIN(64) reference.
  *   It is set by the STCK instruction. For more details about
  *   the STCK instruction, see the Principles of Operations
  *   manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCK: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKE generates the corresponding store clock hardware
  * instruction and returns the condition code set by the
  * instruction.
  *
  * @param x CHAR(16) NONVARYING reference. It is set
  *   by the STCKE instruction. For more details about the STCKE
  *   instruction, see the Principles of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKE: PROC (x) RETURNS (FIXED BINARY);
    DCL x CHARACTER;
 END;
 /**
  * PLISTCKF generates the corresponding store clock hardware
  * instruction and returns the condition code set by the
  * instruction.
  *
  * @param x REAL UNSIGNED FIXED BIN(64) reference.
  *   It is set by the STCKF instruction. For more details about
  *   the STCKF instruction, see the Principles of Operations
  *   manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKF: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKLOCAL generates the corresponding store clock hardware
  * instruction and adjusts the STCK value by subtracting the
  * number of leap seconds from the STCK value and then adding
  * the time zone difference to give the local time.
  *
  * @param x REAL UNSIGNED FIXED BINARY(64)
  *   reference.
  *
  *   It is set by the STCK instruction and then adjusted. For
  *   more details about the STCK instruction, see the Principles
  *   of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKLOCAL: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKELOCAL generates the corresponding store clock hardware
  * instruction and adjusts the STCKE value by subtracting the
  * number of leap seconds from the STCKE value and then adding
  * the time zone difference to give the local time.
  *
  * @param x CHAR(16) NONVARYING reference.
  *
  *   It is set by the STCKE instruction and then adjusted. For
  *   more details about the STCKE instruction, see the Principles
  *   of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKELOCAL: PROC (x) RETURNS (FIXED BINARY);
    DCL x CHARACTER;
 END;
 /**
  * PLISTCKP generates the corresponding Perform Timing Facility
  * Function (PTFF) hardware instruction and returns the condition
  * code set by the instruction.
  *
  * @param x REAL UNSIGNED FIXED BIN(64) reference.
  *
  *   It is set by the PTFF instruction. For more details about
  *   the PTFF instruction, see the Principles of Operations
  *   manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKP: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKPLOCAL generates the corresponding Perform Timing
  * Facility Function (PTFF) hardware instruction and then
  * adjusts the PTFF value by subtracting the number of leap
  * seconds from the PTFF value and then adding the time zone
  * difference to give the local time. It returns the condition
  * code set by the instruction.
  *
  * @param x REAL UNSIGNED FIXED BIN(64) reference.
  *
  *   It is set by the PTFF instruction and then adjusted. For
  *   more details about the PTFF instruction, see the Principles
  *   of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKPLOCAL: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKPUTC generates the corresponding Perform Timing
  * Facility Function (PTFF) hardware instruction and adjusts
  * the PTFF value by subtracting the number of leap seconds to
  * give the UTC time. It returns the condition code set by the
  * instruction.
  *
  * @param x REAL UNSIGNED FIXED BIN(64) reference.
  *
  *   It is set by the PTFF instruction and then adjusted. For
  *   more details about the PTFF instruction, see the Principles
  *   of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKPUTC: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKUTC generates the corresponding store clock hardware
  * instruction and adjusts the STCK value by subtracting the
  * number of leap seconds to give the UTC time.
  *
  * @param x REAL UNSIGNED FIXED BINARY(64)
  *   reference.
  *
  *   It is set by the STCK instruction and then adjusted. For
  *   more details about the STCK instruction, see the Principles
  *   of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKUTC: PROC (x) RETURNS (FIXED BINARY);
    DCL x FIXED BINARY;
 END;
 /**
  * PLISTCKEUTC generates the corresponding store clock hardware
  * instruction and adjusts the STCKE value by subtracting the
  * number of leap seconds to give the UTC time.
  *
  * @param x CHAR(16) NONVARYING reference.
  *
  *   It is set by the STCKE instruction and then adjusted. For
  *   more details about the STCKE instruction, see the Principles
  *   of Operations manual.
  * @returns The condition code set by the
  *   instruction.
  */
 PLISTCKEUTC: PROC (x) RETURNS (FIXED BINARY);
    DCL x CHARACTER;
 END;
 /**
  * PLITRAN11 translates one-byte data from a source buffer to
  * one-byte data in a target buffer.
  *
  * The buffer length must be nonnegative and must have a
  * computational type. The buffer length is converted to type
  * size_t.1
  *
  * The target buffer must be at least as large as the source
  * buffer.
  *
  * The translate table must be aligned on a doubleword boundary.
  * The easiest way to force this alignment is to add the
  * attribute ALIGNED(8) to the declare of the table.
  *
  * On z/OS, PLITRAN11 is implemented via inline code using the
  * CU11 instruction.
  *
  * @param p Address of the target buffer.
  * @param q Address of the source buffer.
  * @param n Length of the source buffer.
  * @param t Address of the 256-byte translate
  *   table.
  */
 PLITRAN11: PROC (p, q, n, t);
    DCL p ANY<LOCATOR>;
    DCL q ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL t ANY<LOCATOR>;
 END;
 /**
  * PLITRAN12 translates one-byte data from a source buffer to
  * two-byte data in a target buffer.
  *
  * The target buffer must be at least twice as large as the
  * source buffer.
  *
  * The translate table must be aligned on a doubleword boundary.
  * The easiest way to force this alignment is to add the
  * attribute ALIGNED(8) to the declare of the table.
  *
  * On z/OS, PLITRAN12 is implemented via inline code using the
  * CU12 instruction.
  *
  * Example:
  *
  * This table can be used to quickly transform a buffer to
  * lower-case hex:
  *
  * \`\`\`
  *            dcl
  *              1 lowerhex(16) static nonasgn aligned(8)
  *                             char(32) init (
  *                          /*   0 1 2 3 4 5 6 7 8 9 a b c d e f   //
  *                             '000102030405060708090a0b0c0d0e0f',
  *                             '101112131415161718191a1b1c1d1e1f',
  *                             '202122232425262728292a2b2c2d2e2f',
  *                             '303132333435363738393a3b3c3d3e3f',
  *                             '404142434445464748494a4b4c4d4e4f',
  *                             '505152535455565758595a5b5c5d5e5f',
  *                             '606162636465666768696a6b6c6d6e6f',
  *                             '707172737475767778797a7b7c7d7e7f',
  *                             '808182838485868788898a8b8c8d8e8f',
  *                             '909192939495969798999a9b9c9d9e9f',
  *                             'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
  *                             'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf',
  *                             'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf',
  *                             'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf',
  *                             'e0e1e2e3e4e5e6e7e8e9eaebecedeeef',
  *                             'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff'  );
  *
  *            call plitran12( p, q, n, addr(lowerhex) );
  * \`\`\`
  *
  * @param p Address of the target buffer.
  * @param q Address of the source buffer.
  * @param n Length of the source buffer. The
  *   buffer length must be nonnegative and must have a
  *   computational type. The buffer length is converted to type
  *   size_t.1
  * @param t Address of the 512-byte translate
  *   table.
  */
 PLITRAN12: PROC (p, q, n, t);
    DCL p ANY<LOCATOR>;
    DCL q ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL t ANY<LOCATOR>;
 END;
 /**
  * PLITRAN21 translates two-byte data from a source buffer to
  * one-byte data in a target buffer.
  *
  * The target buffer must be at least half as large as the
  * source buffer.
  *
  * The translate table must be aligned on a doubleword boundary.
  * The easiest way to force this alignment is to add the
  * attribute ALIGNED(8) to the declare of the table.
  *
  * On z/OS, PLITRAN21 is implemented via inline code using the
  * CU21 instruction.
  *
  * @param p Address of the target buffer.
  * @param q Address of the source buffer.
  * @param n Length of the source buffer. The
  *   buffer length must be nonnegative and must have a
  *   computational type. The buffer length is converted to type
  *   size_t.1
  * @param t Address of the 64K-byte translate
  *   table.
  */
 PLITRAN21: PROC (p, q, n, t);
    DCL p ANY<LOCATOR>;
    DCL q ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL t ANY<LOCATOR>;
 END;
 /**
  * PLITRAN22 translates two-byte data from a source buffer to
  * two-byte data in a target buffer.
  *
  * The target buffer must be at least as large as the source
  * buffer.
  *
  * The translate table must be aligned on a doubleword boundary.
  * The easiest way to force this alignment is to add the
  * attribute ALIGNED(8) to the declare of the table.
  *
  * On z/OS, PLITRAN22 is implemented via inline code using the
  * CU22 instruction.
  *
  * @param p Address of the target buffer.
  * @param q Address of the source buffer.
  * @param n Length of the source buffer. The
  *   buffer length must be nonnegative and must have a
  *   computational type. The buffer length is converted to type
  *   size_t.1
  * @param t Address of the 128K-byte translate
  *   table.
  */
 PLITRAN22: PROC (p, q, n, t);
    DCL p ANY<LOCATOR>;
    DCL q ANY<LOCATOR>;
    DCL n FIXED BINARY;
    DCL t ANY<LOCATOR>;
 END;

 ${KNOWN_BUILTINS}
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
  * @returns string of length 256 comprising the
  *   256 possible character values one time each in the collating 
  *   order
  */
 COLLATE: PROC RETURNS(CHARACTER); END;

 /**
  * \`COMMENT\` converts a \`CHARACTER\` expression into a comment.
  * @param text Expression that is to be converted to a
  *   comment. \`text\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @returns \`text\` is enclosed with a &#47;* and an 
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
  * @returns string of length 17 containing the date and
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
  * @returns string of length 18 containing the date and
  *   the time of compilation.
  */
 COMPILETIME: PROC RETURNS(CHARACTER); END;

 /**
  * \`COPY\` returns a \`CHARACTER\` string consisting of
  * \`n\` concatenated copies of the string \`string\`.
  * @param string Expression. \`string\` should have 
  *   \`CHARACTER\` type, and if not, it is converted thereto.
  * @param n Expression that specifies the number of 
  *   repetitions.
  * 
  *   \`n\` should have \`FIXED\` type, and if not, it is converted
  *   thereto.
  * 
  *   \`n\` must be nonnegative.
  * 
  *   If \`n\` is zero, the result is a null string.
  * @returns string consisting of \`n\` concatenated copies
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
  * @returns string of length 5 containing a decimal number
  */
 COUNTER: PROC RETURNS(CHARACTER); END;

 /**
  * \`DIMENSION\` returns a \`FIXED\` value specifying current extent
  * of dimension \`d\` of \`array\`.
  * @param array Array reference.
  *   \`array\` must not have less than \`d\` dimensions.
  * @param [d] Expression specifying a particular dimension 
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
  * @returns value specifying current extent of dimension
  *   \`d\` of \`array\`.
  */
 DIMENSION: DIM: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`HBOUND\` returns a \`FIXED\` value specifying current upper bound
  * of dimension \`d\` of \`array\`.
  * @param array Array reference. \`array\` must not have less
  *   than \`d\` dimensions.
  * @param [d] Expression specifying a particular dimension
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
  * @returns value specifying current upper bound of
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
  * @param haystack Expression to be searched.
  *   \`haystack\` should have \`CHARACTER\` type, and if not, it will
  *   be converted thereto.
  * @param needle Target expression of the search.
  *   \`needle\` should have \`CHARACTER\` type, and if not, it will
  *   be converted thereto.
  * @param [offset] \`offset\` specifies the location within
  *   \`haystack\` at which to begin processing.
  * 
  *   \`offset\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns value indicating the starting position within
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
  * @param array Array reference. \`array\` must not have less
  *   than \`d\` dimensions.
  * @param [d] Expression specifying a particular dimension
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
  * @returns value specifying current lower bound of
  *   dimension \`d\` of \`array\`.
  */
 LBOUND: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`LENGTH\` returns a \`FIXED\` value specifying the current length
  * of a given character expression.
  * @param string Expression. \`string\` should have
  *   \`CHARACTER\` type, and if not, it will be converted thereto.
  * @returns value specifying the current length of the
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
  * @param string Expression. \`string\` should have
  *   \`CHARACTER\` type, and if not, it will be converted thereto.
  * @param [codes] Expression. Specifies the code page that
  *   will be lowercased.
  * @returns character string with all characters 
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
  * @returns The value returned is not affected by nested
  *   macro invocations.
  */
 MACCOL: PROC RETURNS(FIXED); END;

 /**
  * \`MACLMAR\` returns a \`FIXED\` value that represents the column
  * number of the left source margin in \`MARGINS\` compiler option.
  * 
  * See the information about the \`MARGINS\` option in the
  * Programming Guide.
  * @returns column number of the left source margin in
  *   \`MARGINS\` compiler option
  */
 MACLMAR: PROC RETURNS(FIXED); END;

 /**
  * \`MACNAME\` returns the name of the preprocessor procedure within
  * which it is invoked.
  * 
  * It is invalid to invoke \`MACNAME\` outside of a preprocessor
  * procedure.
  * @returns name of the preprocessor procedure
  */
 MACNAME: PROC RETURNS(CHARACTER); END;

 /**
  * \`MACRMAR\` returns a \`FIXED\` value that represents the column
  * number of the right source margin in \`MARGINS\` compiler option.
  * 
  * See the information about the \`MARGINS\` option in the
  * Programming Guide.
  * @returns column number of the right source margin in
  *   \`MARGINS\` compiler option
  */
 MACRMAR: PROC RETURNS(FIXED); END;

 /**
  * \`MAX\` returns the largest value from a set of two or more
  * expressions.
  * @param value1 First expression. \`value1\` should have
  *   \`FIXED\` type, and if not, it will be converted thereto.
  * @param valueN Second and subsequent expressions.
  *   Each \`valueN\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns largest value from a set of two or more
  *   expressions
  */
 MAX: PROC(value1, valueN) RETURNS(FIXED);
   DECLARE value1 FIXED;
   DECLARE valueN FIXED LIST;
 END;

 /**
  * \`MIN\` returns the smallest value from a set of two or more
  * expressions.
  * @param value1 First expression. \`value1\` should have
  *   \`FIXED\` type, and if not, it will be converted thereto.
  * @param valueN Second and subsequent expressions.
  *   Each \`valueN\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns smallest value from a set of two or
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
  * @param parameter Must be a parameter of the preprocessor
  *   procedure.
  * @returns bit value indicating if a specified parameter
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
  * @param string Expression that is converted to a
  *   quoted string.
  * 
  *   \`string\` should have CHARACTER type, and if not, it is
  *   converted thereto.
  * @returns A valid quoted string.
  */
 QUOTE: PROC(string) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
 END;

 /**
  * \`REPEAT\` returns a \`CHARACTER\` string consisting of
  * \`(n + 1)\` concatenated copies of the string \`string\`.
  * @param string Expression.
  * 
  *   \`string\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @param n Expression that specifies the number of
  *   repetitions.
  * 
  *   \`n\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * 
  *   \`n\` must be nonnegative.
  * 
  *   If \`n\` is zero, the result is \`string\`
  *   (converted to character as necessary).
  * @returns A string consisting of
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
  * @param string Expression specifies the string from
  *   which the substring is extracted.
  * 
  *   \`string\` should have \`CHARACTER\` type, and if not, it is
  *   converted thereto.
  * @param offset Expression that specifies the starting
  *   position of the substring in \`string\`.
  * 
  *   \`offset\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * @param length Expression that specifies the length of the
  *   substring in \`string\`.
  * 
  *   \`length\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * @returns substring specified by \`offset\` and
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
  * @returns value that indicates the maximum number of bytes
  *   that is needed to hold an index for an array permitted under the
  *   compiler \`CMPAT\` option
  */
 SYSDIMSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSOFFSETSIZE\` returns a \`FIXED\` value that indicates the
  * number of bytes needed to hold an \`OFFSET\`.
  * 
  * Currently, \`SYSOFFSETSIZE\` returns 4.
  * @returns value that indicates the number of bytes needed
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
  * @returns string value of the \`SYSPARM\`
  *   compiler option
  */
 SYSPARM: PROC RETURNS(CHARACTER); END;

 /**
  * \`SYSPOINTERSIZE\` returns a \`FIXED\` value that indicates the
  * number of bytes needed to hold a \`POINTER\`.
  * 
  * Currently, \`SYSPOINTERSIZE\` returns 4. But under the
  * \`LP(64)\` option, the \`SYSPOINTERSIZE\` returns 8.
  * @returns value that indicates the number of bytes needed
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
  * @returns string value of the \`SYSTEM\` compiler option
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
  * @returns string containing the product name as well 
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
  * @param input Expression to be searched for possible 
  *   translation of its characters.
  * 
  *   \`input\` should have \`CHARACTER\` type, and if not, it is
  *   converted thereto.
  * @param replacement Expression containing the
  *   translation values of characters.
  * 
  *   \`replacement\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @param [search] Expression containing the characters
  *   that are to be translated. If \`search\` is omitted, the default
  *   is \`COLLATE\`.
  * 
  *   \`search\` should have \`CHARACTER\` type, and if not, it
  *   is converted thereto.
  * @returns string of the same length as \`input\`,
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
  * @param input is a \`CHARACTER\` string expression
  * @param [left] is a \`CHARACTER\` string expression,
  *   that should be trimmed from the left end of \`input\`.
  *   If \`left\` is omitted, the default is a single blank character.
  * @param [right] is a \`CHARACTER\` string expression,
  *   that should be trimmed from the right end of \`input\`.
  *   If \`right\` is omitted, the default is a single blank character.
  * @returns string with characters trimmed from one or
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
  * @param string Expression. If necessary, \`string\
  *   is converted to character.
  * @param [codes] Expression. Specifies the code page that
  *   will be uppercased.
  * @returns character string with all characters
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
  * @param input Expression. The string to be searched.
  * @param compare Expression. The string containing the
  *   characters to be verified against.
  * @param [offset] Expression. Specifies the position
  *   within \`input\` at which to begin processing.
  * @returns position in \`input\` of the leftmost character
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

function getIntTypeAliasesForLP(lp: CompilerOptions.LP): string {
  const p1 = lp === CompilerOptions.LP.LP64 ? 63 : 31;
  const p2 = lp === CompilerOptions.LP.LP64 ? 64 : 32;

  return `
 define alias __SIGNED_INT signed fixed bin(${p1},0);
 define alias __UNSIGNED_INT unsigned fixed bin(${p2},0);
`;
}

export const BuiltinsIntTypeAliasesLP32File =
  "builtins-int-type-aliases-lp32.pli";
export const BuiltinsIntTypeAliasesLP32Uri = `${BuiltinsUriSchema}:/${BuiltinsIntTypeAliasesLP32File}`;
export const BuiltinsIntTypeAliasesLP64File =
  "builtins-int-type-aliases-lp64.pli";
export const BuiltinsIntTypeAliasesLP64Uri = `${BuiltinsUriSchema}:/${BuiltinsIntTypeAliasesLP64File}`;

export const BuiltinsIntTypeAliasesLP32TextDocument = TextDocument.create(
  BuiltinsIntTypeAliasesLP32Uri,
  "pli",
  0,
  getIntTypeAliasesForLP(CompilerOptions.LP.LP32),
);
export const BuiltinsIntTypeAliasesLP64TextDocument = TextDocument.create(
  BuiltinsIntTypeAliasesLP64Uri,
  "pli",
  0,
  getIntTypeAliasesForLP(CompilerOptions.LP.LP64),
);
