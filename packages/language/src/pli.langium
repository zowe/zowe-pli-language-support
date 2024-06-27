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

grammar Pl1

entry PliProgram:
    (packages+=Package | procedures+=ProcedureStatement)*;

// Defined on p. 90
Package: 
    name=ID ':'
    exports=Exports? 
    reserves=Reserves? 
    options=Options? ';'
    statements+=PackageLevelStatements*
    'END' endName=ID ';';

Exports:
    'EXPORTS' '(' (all?='*' | (procedures+=ID (',' procedures+=ID)*)) ')';

Reserves: 'RESERVES' '(' (all?='*' | (variables+=ID (',' variables+=ID)*)) ')';

// TODO refine based on p. 126
Options: 'OPTIONS' '(' items+=OptionsItem* ')';

OptionsItem: 
    SimpleOptionsItem |
    MainOptionsItem |
    CMPATOptionsItem |
    LinkageOptionsItem |
    NoMapOptionsItem;

LinkageOptionsItem: 'LINKAGE' '(' value=('CDECL' | 'OPTLINK' | 'STDCALL' | 'SYSTEM') ')';

CMPATOptionsItem: 'CMPAT' '(' value=('V1' | 'V2' | 'V3') ')';

MainOptionsItem: 'MAIN' (noExecOps?='NOEXECOPS')?;

NoMapOptionsItem: type=('NOMAP' | 'NOMAPIN' | 'NOMAPOUT') ('(' (parameters+=ID (',' parameters+=ID)*)? ')')?;

SimpleOptionsItem: value=(
    // BEGIN/PACKAGE statement
    'ORDER' | 'REORDER' | 'NOCHARGRAPHIC' | 'CHARGRAPHIC' | 'NOINLINE' | 'INLINE' |
    // ENTRY declaration
    'COBOL' | 'FORTRAN' | 'BYADDR' | 'BYVALUE' | 'DESCRIPTOR' | 'NODESCRIPTOR' |
    'IRREDUCIBLE' | 'REDUCIBLE' | 'NORETURN' | 'REENTRANT' |
    // PACKAGE
    'FETCHABLE' | 'RENT' | 'AMODE31' | 'AMODE64' |
    // PROCEDURE statement
    'DLLINTERNAL' | 'FROMALIEN' | 'RETCODE' | 'ASSEMBLER' | /* abbr */ 'ASM' | 'WINMAIN' |
    // Undocumented (?)
    'INTER'
    );

PackageLevelStatements: DeclareStatement | DefaultStatement | ProcedureStatement;

DefaultStatement: {infer DefaultStatement} 'default';
ProcedureStatement: 
    EntryLabels
    ('PROC' | 'PROCEDURE') 
    ('(' (parameters+=ProcedureParameter (',' parameters+=ProcedureParameter)*)? ')')?
    (returns=ID)?
    options=Options?
    recursive?='RECURSIVE'?
    (order=('ORDER' | 'REORDER'))?
    ('EXTERNAL' environmentName=ID)?
    scope=ScopeAttribute? ';'
    statements+=ProcedureLevelStatement*
    'END' endLabel=ID? ';';

fragment EntryLabels: (labels+=LabelPrefix)*;

LabelPrefix: name=ID ':';

EntryStatement: 
    EntryLabels
    'ENTRY'
    ('(' (parameters+=ProcedureParameter (',' parameters+=ProcedureParameter)*)? ')')?
    ('EXTERNAL' environmentName=ID)?
    ('RETURNS' '(' returnAttributes+=ID* ')')?
    options=Options? ';';

ProcedureLevelStatement: Statement | Group | InternalProcedure | BeginBlock;

Statement: DeclareStatement;
Group: {infer Group} 'group';
InternalProcedure: {infer InternalProcedure} 'internal';
BeginBlock: {infer BeginBlock} 'begin';

DeclareStatement: ('DCL' | 'DECLARE') items+=DeclaredItem (',' items+=DeclaredItem)*  ';';
DeclaredItem: level=NUM? (elements+=DeclaredVariable | elements+='*' | '(' elements+=DeclaredVariable (',' elements+=DeclaredVariable)* ')') attributes+=DeclarationAttribute*;

DeclaredVariable: name=ID;

DeclarationAttribute: ComputationDataAttribute | ScopeAttribute | EntryAttribute;

ComputationDataAttribute: type=(
    'FIXED' | 'DECIMAL' | 'REAL' | 'BIN' | 'BINARY' | 'CHARACTER' | 'CHAR' | 'POINTER' | 'PTR' | 'BIT' | 'BASED' | 'INIT'
    ) ('(' (parameters+=DataParameter (',' parameters+=DataParameter)*)? ')')?;

DataParameter: value=Literal;

EntryAttribute: 
    'ENTRY' 
    ('(' attributes+=EntryDescription (',' attributes+=EntryDescription)* ')')? 
    options=Options? 
    variable?='VARIABLE'?
    limited?='LIMITED'?
    ('RETURNS' '(' returnAttribute=DeclarationAttribute ')')?
    ('EXTERNAL' environmentName=ID)?
;

EntryDescription: EntryParameterDescription | EntryUnionDescription;

EntryParameterDescription: value=(DeclarationAttribute | 'ALIGNED' | 'UNALIGNED' | 'ASSIGNABLE' | 'NONASSIGNABLE' | 'INOUT' | 'INONLY' | 'OUTONLY' | 'CONNECTED' | 'NONCONNECTED' | 'BYADDR' | 'BYVALUE');

EntryUnionDescription: init=NUM attributes+=DeclarationAttribute* optional?='OPTIONAL'? ',' prefixedAttributes+=PrefixedAttribute*;

PrefixedAttribute: level=NUM attribute=DeclarationAttribute?;

ScopeAttribute: {infer ScopeAttribute} ('STATIC' | 'DYNAMIC');

ProcedureParameter: name=ID;

Literal: StringLiteral | NumberLiteral | BinaryLiteral;

StringLiteral: value=STRING;
NumberLiteral: value=NUM;
BinaryLiteral: value=BIN_NUM;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal BIN_NUM returns string: /('[01_]*'|[01_]*)(B|B4|XN)/;
terminal NUM returns number: /[0-9][0-9_]*(\.[0-9_]*)?/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

/**
 * PL1 only features a single token for comments that can span multiple lines.
 * This is the same comment type used in other common C like languages.
 */
hidden terminal COMMENT: /\/\*[\s\S]*?\*\//;
