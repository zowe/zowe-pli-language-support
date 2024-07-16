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
    name=FeatureID ':'
    exports=Exports? 
    reserves=Reserves? 
    options=Options? ';'
    statements+=PackageLevelStatements*
    'END' endName=FeatureID ';';

Exports:
    'EXPORTS' '(' (all?='*' | (procedures+=FeatureID (',' procedures+=FeatureID)*)) ')';

Reserves: 'RESERVES' '(' (all?='*' | (variables+=FeatureID (',' variables+=FeatureID)*)) ')';

// TODO refine based on p. 126
Options: 'OPTIONS' '(' items+=OptionsItem (','? items+=OptionsItem)* ')';

OptionsItem: 
    SimpleOptionsItem |
    MainOptionsItem |
    CMPATOptionsItem |
    LinkageOptionsItem |
    NoMapOptionsItem;

LinkageOptionsItem: 'LINKAGE' '(' value=('CDECL' | 'OPTLINK' | 'STDCALL' | 'SYSTEM') ')';

CMPATOptionsItem: 'CMPAT' '(' value=('V1' | 'V2' | 'V3') ')';

MainOptionsItem: 'MAIN' (noExecOps?='NOEXECOPS')?;

NoMapOptionsItem: type=('NOMAP' | 'NOMAPIN' | 'NOMAPOUT') ('(' (parameters+=FeatureID (',' parameters+=FeatureID)*)? ')')?;

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

ProcedureStatement: 
    (labels+=LabelPrefix)*
    ('PROC' | 'PROCEDURE') 
    ('(' (parameters+=ProcedureParameter (',' parameters+=ProcedureParameter)*)? ')')?
    (returns=FeatureID)?
    options=Options?
    recursive?='RECURSIVE'?
    (order=('ORDER' | 'REORDER'))?
    ('EXTERNAL' environmentName=FeatureID)?
    scope=ScopeAttribute? ';'
    statements+=ProcedureLevelStatement*
    ('PROC' | 'PROCEDURE')? 'END' endLabel=FeatureID? ';';


ScopeAttribute returns string: ('STATIC' | 'DYNAMIC');

LabelPrefix: name=FeatureID ':';

EntryStatement: 
    (labels+=LabelPrefix)*
    'ENTRY'
    ('(' (parameters+=ProcedureParameter (',' parameters+=ProcedureParameter)*)? ')')?
    ('EXTERNAL' environmentName=FeatureID)?
    ('RETURNS' '(' returnAttributes+=FeatureID* ')')?
    options=Options? ';';

ProcedureLevelStatement: Statement | Group | ProcedureStatement | BeginStatement;

// #region Statements

Statement: 
    (labels+=LabelPrefix)*
    value=(DeclareStatement | AllocateStatement | AssertStatement | AssignmentStatement | AttachStatement 
    | BeginStatement | CallStatement | CancelThreadStatement | CloseStatement | DefaultStatement | DefineAliasStatement | DefineOrdinalStatement | DefineStructureStatement
    | DisplayStatement | DoStatement | IfStatement | ExecStatement | OnStatement | PutStatement);

AllocateStatement: 'ALLOCATE' variable=AllocatedVariable ';';

AllocatedVariable: level=DECIMAL_NUM? variable=FeatureID attribute=AllocateAttribute?;

AllocateAttribute: AllocateDimension
    | AllocateType
    | InitialAttribute;

AllocateDimension: dimensions=Dimensions;

AllocateType: type=AllocateAttributeType dimensions=Dimensions?;

AllocateAttributeType returns string: 'CHARACTER' | 'BIT' | 'GRAPHIC' | 'UCHAR' | 'WIDECHAR' | 'AREA';

AssertStatement: 'ASSERT' (
    true?='TRUE' '(' actual=Expression ')' 
    | false?='FALSE' '(' actual=Expression ')'
    | compare?='COMPARE' '(' actual=Expression ',' expected=Expression (',' operator=STRING_TERM)? ')'
    | unreachable?='UNREACHABLE'
    )
    ('TEXT' displayExpression=Expression)?;

AssignmentStatement: refs+=ReferenceItem (',' refs+=ReferenceItem)* operator=AssignmentOperator expression=Expression (',' 'BY' ('NAME' | 'DIMACROSS' dimacrossExpr=Expression))? ';';

AssignmentOperator returns string: '=' | '+=' | '-=' | '*=' | '/=' | '|=' | '&=' | '||=' | '**=' | '¬=' | '^=' | '<>';

AttachStatement: 'ATTACH' reference=ReferenceItem ('THREAD' '(' task=ReferenceItem ')') (environment?='ENVIRONMENT' '(' ('TSTACK' '(' tstack=Expression ')')? ')')? ';';

BeginStatement: 'BEGIN' options=Options? recursive?='RECURSIVE'? (order?='ORDER' | reorder?='REORDER')? ';'
    statements+=Statement*
    ('BEGIN')? 'END' ';';

CallStatement: 'CALL' reference=FeatureID ('(' (arguments+=('*' | Expression) (',' arguments+=('*' | Expression))*)? ')')? ';';

CancelThreadStatement: 'CANCEL' 'THREAD' '(' thread=ReferenceItem ')' ';';

CloseStatement: 'CLOSE' 'FILE' (file=ReferenceItem | star?='*') ';';

DefaultStatement: ('DEFAULT' | 'DFT') expressions+=DefaultExpression (',' expressions+=DefaultExpression)* ';';

DefaultExpression: expression=DefaultExpressionPart attributes+=DeclarationAttribute*;

DefaultExpressionPart: ('RANGE' '(' identifiers=DefaultRangeIdentifiers ')' | '(' expression=DefaultAttributeExpression ')');

DefaultRangeIdentifiers: (identifiers+=('*' | DefaultRangeIdentifierItem) (',' identifiers+=('*' | DefaultRangeIdentifierItem))*);

DefaultRangeIdentifierItem: from=FeatureID (':' to=FeatureID)?;

DefaultAttributeExpression: items+=DefaultAttributeExpressionNot ((operators+=('AND' | 'OR') items+=DefaultAttributeExpressionNot)*)?;

DefaultAttributeExpressionNot: (not?='NOT')? value=DefaultAttribute;

DefaultAttribute returns string:
    'ABNORMAL' | 'ALIGNED' | 'AREA' | 'ASSIGNABLE' | 'AUTOMATIC' 
    | 'BACKWARDS' | 'BASED' | 'BIT' | 'BUFFERED' | 'BUILTIN' | 'BYADDR' | 'BYVALUE' | 'BIN'
    | 'CHARACTER' | 'CHAR' | 'COMPLEX' | 'CONDITION' | 'CONNECTED' | 'CONSTANT' | 'CONTROLLED'
    | 'DECIMAL' | 'DEFINED' | 'DIMENSION' 
    | 'ENTRY' | 'ENVIRONMENT' | 'ENV' | 'EVENT' | 'EXCLUSIVE' | 'EXTERNAL'
    | 'FILE' | 'FIXED' | 'FLOAT' | 'FORMAT'
    | 'GENERIC' | 'GRAPHIC'
    | 'HEX' | 'HEXADEC'
    | 'IEEE' | 'INITIAL' | 'INIT' | 'INONLY' | 'INOUT' | 'INTERNAL' | 'IRREDUCIBLE' | 'INPUT'
    | 'KEYED'
    | 'LABEL' | 'LIST'
    | 'MEMBER'
    | 'NATIVE' | 'NONASSIGNABLE' | 'NONCONNECTED' | 'NONNATIVE' | 'NONVARYING' | 'NORMAL'
    | 'OFFSET' | 'OPTIONAL' | 'OPTIONS' | 'OUTONLY' | 'OUTPUT'
    | 'PARAMETER' | 'PICTURE' | 'POINTER' | 'POSITION' | 'PRECISION' | 'PRINT'
    | 'RANGE' | 'REAL' | 'RECORD' | 'RESERVED' | 'RETURNS'
    | 'SEQUENTIAL' | 'SIGNED' | 'STATIC' | 'STREAM' | 'STRUCTURE'
    | 'TASK' | 'TRANSIENT'
    | 'UNAL' | 'UCHAR' | 'UNALIGNED' | 'UNBUFFERED' | 'UNION' | 'UNSIGNED' | 'UPDATE'
    | 'VARIABLE' | 'VARYING' | 'VAR' | 'VARYING4' | 'VARYINGZ'
    | 'WIDECHAR' | 'WIDEPIC'
;

DefineAliasStatement: 'DEFINE' 'ALIAS' name=FeatureID (attributes+=DeclarationAttribute (',' attributes+=DeclarationAttribute)*)? ';';

DefineOrdinalStatement:
    'DEFINE' 'ORDINAL' name=FQN
    '(' ordinalValues=OrdinalValueList ')' 
    ('PRECISION' '(' precision=DECIMAL_NUM ')')? 
    (signed?='SIGNED' | unsigned?='UNSIGNED')?
    ';';

OrdinalValueList: members+=OrdinalValue (',' members+=OrdinalValue)*;

OrdinalValue: name=FeatureID ('VALUE'  '(' value=DECIMAL_NUM ')')?;

DefineStructureStatement: 'DEFINE' 'STRUCTURE' level=DECIMAL_NUM name=FQN (union?='UNION')? (',' substructures+=SubStructure)* ';';

SubStructure: level=DECIMAL_NUM name=FeatureID (attributes+=DeclarationAttribute (',' attributes+=DeclarationAttribute)*)?;

DisplayStatement: 'DISPLAY' '(' expression=Expression ')' 
    ('REPLY' reply=ReferenceItem)? 
    ('ROUTCDE' '(' rout+=DECIMAL_NUM (',' rout+=DECIMAL_NUM)* ')' ('DESC' '(' desc+=DECIMAL_NUM (',' desc+=DECIMAL_NUM)* ')')?)? ';'
;

DoStatement:
    'DO'
    // Note: DoType1 does nothing
    (DoType2 | DoType3)? ';'
        statements+=Statement*
    ('DO')? 'END' ';';

DoType2: DoWhile | DoUntil;

DoWhile: 'WHILE' '(' while=Expression ')' ('UNTIL' '(' until=Expression ')')?;

DoUntil: 'UNTIL' '(' until=Expression ')' ('WHILE' '(' while=Expression ')')?;

DoType3: reference=ReferenceItem '=' specifications+=DoSpecification (',' specifications+=DoSpecification)*;

DoSpecification: exp1=Expression (
        'TO' to=Expression ('BY' by=Expression)?
        | 'BY' by=Expression ('TO' to=Expression)?
        | 'UPTHRU' upthru=Expression
        | 'DOWNTHRU' downthru=Expression
        | 'REPEAT' repeat=Expression
    )?
    whileOrUntil=(DoWhile | DoUntil)?;

ExecStatement: 'EXEC' query=ExecFragment ';';

IfStatement: 'IF' expression=Expression 'THEN' unit=Statement ('ELSE' else=Statement)?;

OnStatement: 'ON' conditions+=Condition (',' conditions+=Condition)* snap?='SNAP'? (system?='SYSTEM' ';' | onUnit=Statement);

Condition: KeywordCondition | NamedCondition | FileReferenceCondition;

KeywordCondition: keyword=(
    'ANYCONDITION' | 'ANYCOND' | 'AREA' | 'ASSERTION' | 'ATTENTION' 
    | 'CONFORMANCE' | 'CONVERSION'
    | 'ERROR'
    | 'FINISH'
    | 'FIXEDOVERFLOW' | 'FOFL'
    | 'INVALIDOP'
    | 'OVERFLOW' | 'OFL'
    | 'SIZE' | 'STORAGE' | 'STRINGRANGE' | 'STRINGSIZE' | 'SUBSCRIPTRANGE'
    | 'UNDERFLOW' | 'UFL'
    | 'ZERODIVIDE' | 'ZDIV'
);

NamedCondition: 'CONDITION' '(' name=FeatureID ')';

FileReferenceCondition: keyword=('ENDFILE' | 'ENDPAGE'| 'KEY'|'NAME'|'RECORD'|'TRANSMIT'|'UNDEFINEDFILE'|'UNDF') ('(' fileReference=ReferenceItem ')')?;

PutStatement: 'PUT' ((('FILE' '(' file=ReferenceItem ')')? (dataSpecification=DataSpecificationOptions)?
    (
        page?='PAGE'? ('LINE' '(' line=Expression ')')? 
        | skip?='SKIP' ('(' skipExpression=Expression ')')?
    ) (dataSpecification=DataSpecificationOptions)?)
    | ('STRING' '(' stringExpression=Expression ')' dataSpecification=DataSpecificationOptions)) ';'
;

DataSpecificationOptions: (
    ('LIST'? '(' dataList=DataSpecificationDataList ')')
    | data?='DATA' ('(' dataListItems+=DataSpecificationDataListItem (',' dataListItems+=DataSpecificationDataListItem)* ')')?
    | edit?='EDIT' ('(' dataLists+=DataSpecificationDataList ')' '(' formatLists+=DataSpecificationFormatList ')')+
);

DataSpecificationDataList: items+=(DataSpecificationDataListItem | DataSpecificationDataListItem3DO) (',' items+=(DataSpecificationDataListItem | DataSpecificationDataListItem3DO))*;

DataSpecificationDataListItem: values+=Expression (',' values+=Expression)+;

DataSpecificationDataListItem3DO: {infer DataSpecificationDataListItem3DO} 'TODO';

DataSpecificationFormatList: DataSpecificationDataListItem;

// #endregion

InitialAttribute: (('INITIAL' | 'INIT') (
    direct?='(' items+=InitialAttributeItem (',' items+=InitialAttributeItem)* ')'
    | call?='CALL' reference=ID ('(' arguments+=Expression (',' arguments+=Expression)* ')')?
    | to?='TO' '(' content=InitialToContent ')' '(' items+=InitialAttributeItem (',' items+=InitialAttributeItem)* ')'
    )
    | across?='INITACROSS' '(' expressions+=InitAcrossExpression (',' expressions+=InitAcrossExpression)* ')'
    );

InitialToContent: (varying=Varying type=CharType | type=CharType varying=Varying?);

Varying returns string: 'VARYING' | 'VARYING4' | 'VARYINGZ' | 'NONVARYING';

CharType returns string: 'CHAR' | 'UCHAR' | 'WCHAR';

InitAcrossExpression: '(' expressions+=Expression (',' expressions+=Expression)* ')';

InitialAttributeItem: InitialAttributeItemStar | InitialAttributeConstant | InitialAttributeReference | InitialAttributeExpression | InitialAttributeSpecification;

InitialAttributeItemStar: {infer InitialAttributeItemStar} '*';
InitialAttributeConstant: constant=ConstantExpression;
InitialAttributeReference: reference=ID;
InitialAttributeExpression: '(' expression=Expression ')';
InitialAttributeSpecification: '(' star?='*' | expression=Expression ')' item=InitialAttributeSpecificationIteration;

InitialAttributeSpecificationIteration: InitialAttributeItemStar | InitialAttributeConstant | InitialAttributeReference | InitialAttributeSpecificationIterationValue;

InitialAttributeSpecificationIterationValue: '(' items+=InitialAttributeItem (',' items+=InitialAttributeItem)* ')';

Group: {infer Group} 'GROUP';

DeclareStatement: ('DCL' | 'DECLARE') items+=DeclaredItem (',' items+=DeclaredItem)*  ';';
DeclaredItem: level=DECIMAL_NUM? (elements+=DeclaredVariable | elements+='*' | '(' elements+=DeclaredVariable (',' elements+=DeclaredVariable)* ')') attributes+=DeclarationAttribute*;

type NamedElement = DeclaredVariable | ProcedureParameter;

DeclaredVariable: name=ID;

DeclarationAttribute: ComputationDataAttribute | DimensionsDataAttribute | EntryAttribute;

DimensionsDataAttribute: dimensions=Dimensions;

ComputationDataAttribute: type=DataAttributeType;

DataAttributeType returns string: DefaultAttribute;

Dimensions: '(' (dimensions+=DimensionBound (',' dimensions+=DimensionBound)*)? ')';

DimensionBound: lower=Bound (':' upper=Bound)?;

Bound: (expression=(Expression | '*') | 'REFER' refer=ReferenceItem);

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

EntryUnionDescription: init=DECIMAL_NUM attributes+=DeclarationAttribute* optional?='OPTIONAL'? ',' prefixedAttributes+=PrefixedAttribute*;

PrefixedAttribute: level=DECIMAL_NUM attribute=DeclarationAttribute?;

ProcedureParameter: name=FeatureID;

ReferenceItem: ref=[NamedElement:FeatureID] dimensions=Dimensions?;

Expression: BitOrExpression;


// Note for expressions: Documentation uses '¬' to denote inversion or negation. The language actually uses '^'

// Priority 7
BitOrExpression infers Expression: BitAndExpression ({infer BitOrExpression.left=current} op=('|' | '¬' | '^') right=BitAndExpression)*;

// Priority 6
BitAndExpression infers Expression: CompExpression ({infer BitAndExpression.left=current} op='&' right=CompExpression)*;

// Priority 5
CompExpression infers Expression: ConcatExpression ({infer CompExpression.left=current} op=('<' | '¬<' | '<=' | '=' | '¬=' | '^=' | '<>' | '>=' | '>' | '¬>') right=ConcatExpression)*;

// Priority 4
ConcatExpression infers Expression: AddExpression ({infer ConcatExpression.left=current} op=('||' | '!!') right=AddExpression)*;

// Priority 3
AddExpression infers Expression: MultExpression ({infer AddExpression.left=current} op=('+' | '-' ) right=MultExpression)*;

// Priority 2
MultExpression infers Expression: ExpExpression ({infer MultExpression.left=current} op=('*' | '/' ) right=ExpExpression)*;

// Priority 1
ExpExpression infers Expression: PrimaryExpression ({infer ExpExpression.left=current} op='**' right=PrimaryExpression)*;

PrimaryExpression infers Expression: 
    '(' Expression ')'
    | UnaryExpression
    | ConstantExpression
    | MemberCall;

MemberCall:
    element=ReferenceItem dimensions=Dimensions?
	({infer MemberCall.previous=current} 
        "." element=ReferenceItem
        dimensions=Dimensions?
    )*;

UnaryExpression: op=('+' | '-' | '¬' | '^') expr=Expression;

ConstantExpression: Literal;

Literal: StringLiteral | BinaryLiteral | DecimalLiteral;

StringLiteral: ('(' multiplier=DECIMAL_NUM ')')? value=STRING_TERM;
BinaryLiteral: (negative?='-' | '+')? value=(BINARY_NUM | WRAPPED_NUM);
DecimalLiteral: (negative?='-' | '+')? value=DECIMAL_NUM;

FQN returns string: ID ('.' ID)*;
FeatureID returns string: ID;

hidden terminal WS: /\s+/;
terminal ExecFragment: /(?<=[eE][xX][eE][cC]\s+)[a-zA-Z]+\s[^;]*/;
terminal ID: /[@#_a-zA-Z][\w_@#]*/;
/**
 * Includes both fixed and non-fixed (with and without mantissa)
 */
terminal BINARY_NUM: FULL_NUM /[bB][iI]?/;
terminal WRAPPED_NUM:  ("'" (FULL_NUM | HEX_CHAR*) "'") /([xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX])[iI]?/;
terminal fragment HEX_CHAR: /[0-9a-fA-F]/;
terminal fragment NUM: /([0-9][0-9_]*(\.[0-9_]*)?)|(\.[0-9_]*)/;
terminal fragment FULL_NUM: NUM MANTISSA?;
terminal fragment MANTISSA: /[ESDQ][-+]?[0-9]+/;
terminal DECIMAL_NUM: FULL_NUM /[iI]?/;
terminal STRING_TERM: /("(\\.|[^"\\])*"|'(\\.|[^'\\])*')([xX][aA][eE])?/;

/**
 * PL1 only features a single token for comments that can span multiple lines.
 * This is the same comment type used in other common C like languages.
 */
hidden terminal COMMENT: /\/\*[\s\S]*?\*\//;
