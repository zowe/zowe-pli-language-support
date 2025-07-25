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

// KEEP THIS FOR REFERENCE
// WE CAN DELETE IT ONCE IT IS NO LONGER USEFUL!
grammar Pl1

entry PliProgram:
    (statements+=Statement)*;

// Defined on p. 90
Package:
    'PACKAGE'
    exports=Exports? 
    reserves=Reserves? 
    options=Options? ';'
    statements+=Statement*
    end=EndStatement ';';

ConditionPrefix: ('(' items+=ConditionPrefixItem ')' ':')+;

ConditionPrefixItem: conditions+=Condition (',' conditions+=Condition)*;

Exports:
    'EXPORTS' '(' (all?='*' | (procedures+=ID (',' procedures+=ID)*)) ')';

Reserves: 'RESERVES' '(' (all?='*' | (variables+=ID (',' variables+=ID)*)) ')';

// TODO refine based on p. 126
Options: 'OPTIONS' '(' items+=OptionsItem (','? items+=OptionsItem)* ')';

OptionsItem: 
    SimpleOptionsItem |
    CMPATOptionsItem |
    LinkageOptionsItem |
    NoMapOptionsItem;

LinkageOptionsItem: 'LINKAGE' '(' value=('CDECL' | 'OPTLINK' | 'STDCALL' | 'SYSTEM') ')';

CMPATOptionsItem: 'CMPAT' '(' value=('V1' | 'V2' | 'V3') ')';

NoMapOptionsItem: type=('NOMAP' | 'NOMAPIN' | 'NOMAPOUT') ('(' (parameters+=ID (',' parameters+=ID)*)? ')')?;

SimpleOptionsItem: value=(
    // BEGIN/PACKAGE statement
    'ORDER' | 'REORDER' | 'NOCHARGRAPHIC' | 'CHARGRAPHIC' | 'NOINLINE' | 'INLINE' | 'MAIN' | 'NOEXECOPS' |
    // ENTRY declaration
    'COBOL' | 'FORTRAN' | 'BYADDR' | 'BYVALUE' | 'DESCRIPTOR' | 'NODESCRIPTOR' |
    'IRREDUCIBLE' | 'REDUCIBLE' | 'NORETURN' | 'REENTRANT' |
    // PACKAGE
    'FETCHABLE' | 'RENT' | 'AMODE31' | 'AMODE64' |
    // PROCEDURE statement
    'DLLINTERNAL' | 'FROMALIEN' | 'RETCODE' | 'ASSEMBLER' | /* abbr */ 'ASM' | 'WINMAIN' |
    // Undocumented (?)
    'INTER' | 'RECURSIVE'
    );

ProcedureStatement:
    ('PROC' | 'PROCEDURE' | xProc?='XPROC' | xProc?='XPROCEDURE') 
    ('(' (parameters+=ProcedureParameter (',' parameters+=ProcedureParameter)*)? ')')?
    // These can appear in any order:
    (
        returns+=ReturnsOption |
        options+=Options |
        recursive+='RECURSIVE' |
        (order+=('ORDER' | 'REORDER')) |
        (('EXTERNAL' | 'EXT') ('(' environmentName+=Expression ')')?) |
        scope+=ScopeAttribute
    )* ';'
    statements+=Statement*
    ('PROC' | 'PROCEDURE')? end=EndStatement ';';


ScopeAttribute returns string: ('STATIC' | 'DYNAMIC');

LabelPrefix: name=ID ':';

EntryStatement:
    'ENTRY'
    ('(' (parameters+=ProcedureParameter (',' parameters+=ProcedureParameter)*)? ')')?
    ((('EXTERNAL' | 'EXT') ('(' environmentName+=Expression ')')?) |
    variable+='VARIABLE' |
    limited+='LIMITED' |
    returns+=ReturnsOption |
    options+=Options)* ';';

// #region Statements

Statement: 
    condition=ConditionPrefix? (labels+=LabelPrefix)* value=Unit;

Unit: DeclareStatement | AllocateStatement | AssertStatement | AssignmentStatement | AttachStatement 
    | BeginStatement | CallStatement | CancelThreadStatement | CloseStatement | DefaultStatement | DefineAliasStatement | DefineOrdinalStatement | DefineStructureStatement
    | DelayStatement | DeleteStatement | DetachStatement | DisplayStatement | DoStatement
    | EntryStatement | ExecStatement | ExitStatement | FetchStatement | FlushStatement | FormatStatement
    | FreeStatement | GetStatement | GoToStatement
    | IfStatement | IncludeDirective | IterateStatement
    | LeaveStatement | LineDirective | LocateStatement
    | NoPrintDirective | NoteDirective | NullStatement
    | OnStatement | OpenStatement 
    | PageDirective | PopDirective | PrintDirective
    | ProcessDirective | ProcincDirective | PushDirective
    | PutStatement
    | QualifyStatement
    | ReadStatement | ReinitStatement | ReleaseStatement | ResignalStatement
    | ReturnStatement | RevertStatement | RewriteStatement
    | SelectStatement | SignalStatement | SkipDirective | StopStatement
    | WaitStatement | WriteStatement
    // Validate that these only appear at the expected locations
    | ProcedureStatement | Package;

AllocateStatement: ('ALLOCATE' | 'ALLOC') variables+=AllocatedVariable (',' variables+=AllocatedVariable)* ';';

AllocatedVariable: level=NUMBER? var=ReferenceItem attribute=AllocateAttribute?;

AllocateAttribute: AllocateDimension
    | AllocateType
    | AllocateLocationReferenceIn
    | AllocateLocationReferenceSet
    | InitialAttribute;

AllocateLocationReferenceIn: 'IN' '(' area=LocatorCall ')';
AllocateLocationReferenceSet: 'SET' '(' locatorVariable=LocatorCall ')';

AllocateDimension: dimensions=Dimensions;

AllocateType: type=AllocateAttributeType dimensions=Dimensions?;

AllocateAttributeType returns string: 'CHAR' | 'CHARACTER' | 'BIT' | 'GRAPHIC' | 'UCHAR' | 'WIDECHAR' | 'AREA';

AssertStatement: 'ASSERT' (
    true?='TRUE' '(' actual=Expression ')' 
    | false?='FALSE' '(' actual=Expression ')'
    | compare?='COMPARE' '(' actual=Expression ',' expected=Expression (',' operator=STRING_TERM)? ')'
    | unreachable?='UNREACHABLE'
    )
    ('TEXT' displayExpression=Expression)?;

AssignmentStatement: refs+=LocatorCall (',' refs+=LocatorCall)* operator=AssignmentOperator expression=Expression (',' 'BY' ('NAME' | 'DIMACROSS' dimacrossExpr=Expression))? ';';

AssignmentOperator returns string: '=' | '+=' | '-=' | '*=' | '/=' | '|=' | '&=' | '||=' | '**=' | '¬=' | '^=' | '<>';

AttachStatement: 'ATTACH' reference=LocatorCall ('THREAD' '(' task=LocatorCall ')') (environment?='ENVIRONMENT' '(' ('TSTACK' '(' tstack=Expression ')')? ')')? ';';

BeginStatement: 'BEGIN' options=Options? recursive?='RECURSIVE'? (order?='ORDER' | reorder?='REORDER')? ';'
    statements+=Statement*
    end=EndStatement ';';

EndStatement: (labels+=LabelPrefix)* 'END' label=LabelReference?;

CallStatement: 'CALL' call=ProcedureCall ';';

CancelThreadStatement: 'CANCEL' 'THREAD' '(' thread=LocatorCall ')' ';';

CloseStatement: 'CLOSE' 'FILE' '(' (files+=MemberCall | files+='*') ')' (','? 'FILE' '(' (files+=MemberCall | files+='*') ')')* ';';

DefaultStatement: ('DEFAULT' | 'DFT') expressions+=DefaultExpression (',' expressions+=DefaultExpression)* ';';

DefaultExpression: expression=DefaultExpressionPart attributes+=DefaultDeclarationAttribute*;

DefaultExpressionPart: 'DESCRIPTORS' expression=DefaultAttributeExpression | ('RANGE' '(' identifiers=DefaultRangeIdentifiers ')' | '(' expression=DefaultAttributeExpression ')');

DefaultRangeIdentifiers: (identifiers+=('*' | DefaultRangeIdentifierItem) (',' identifiers+=('*' | DefaultRangeIdentifierItem))*);

DefaultRangeIdentifierItem: from=ID (':' to=ID)?;

DefaultAttributeExpression: items+=DefaultAttributeExpressionNot ((operators+=('AND' | 'OR') items+=DefaultAttributeExpressionNot)*)?;

DefaultAttributeExpressionNot: (not?='NOT')? value=DefaultAttribute;

DefaultAttribute returns string:
    'ABNORMAL' | 'ALIGNED' | 'AREA' | 'ASSIGNABLE' | 'AUTOMATIC' | 'AUTO'
    | 'BACKWARDS' | 'BASED' | 'BIT' | 'BUFFERED' | 'BUILTIN' | 'BYADDR' | 'BYVALUE' | 'BIN' | 'BINARY'
    | 'CHARACTER' | 'CHAR' | 'COMPLEX' | 'CONDITION' | 'CONNECTED' | 'CONSTANT' | 'CONTROLLED' | 'CTL'
    | 'DECIMAL' | 'DEC' | 'DIMACROSS'
    | 'EVENT' | 'EXCLUSIVE' | 'EXTERNAL' | 'EXT'
    | 'FILE' | 'FIXED' | 'FLOAT' | 'FORMAT'
    | 'GENERIC' | 'GRAPHIC'
    | 'HEX' | 'HEXADEC'
    | 'IEEE' | 'INONLY' | 'INOUT' | 'INTERNAL' | 'INT' | 'IRREDUCIBLE' | 'INPUT'
    | 'KEYED'
    | 'LABEL' | 'LIST'
    | 'MEMBER'
    | 'NATIVE' | 'NONASSIGNABLE' | 'NONASGN' | 'NONCONNECTED' | 'NONNATIVE' | 'NONVARYING' | 'NORMAL'
    | 'OFFSET' | 'OPTIONAL' | 'OPTIONS' | 'OUTONLY' | 'OUTPUT'
    | 'PARAMETER' | 'POINTER' | 'PTR' | 'POSITION' | 'PRECISION' | 'PREC' | 'PRINT'
    | 'RANGE' | 'REAL' | 'RECORD' | 'RESERVED'
    | 'SEQUENTIAL' | 'SIGNED' | 'STATIC' | 'STREAM' | 'STRUCTURE'
    | 'TASK' | 'TRANSIENT'
    | 'UNAL' | 'UCHAR' | 'UNALIGNED' | 'UNBUFFERED' | 'UNION' | 'UNSIGNED' | 'UPDATE'
    | 'VARIABLE' | 'VARYING' | 'VAR' | 'VARYING4' | 'VARYINGZ' | 'VARZ'
    | 'WIDECHAR'
    | 'GENERIC' | 'XMLCONTENT' | 'JSONIGNORE' | 'XMLIGNORE' | 'JSONTRIMR' | 'JSONNAME' | 'JSONNULL' | 'JSONOMIT' | 'NULLINIT'
    | 'BIGENDIAN' | 'LITTLEENDIAN'
    | 'XMLNAME' | 'XMLATTR' | 'XMLOMIT' | 'NOINIT' | 'INDFOR'

;

DefineAliasStatement: ('DEFINE' | xDefine?='XDEFINE') 'ALIAS' name=ID (attributes+=DeclarationAttribute (','? attributes+=DeclarationAttribute)*)? ';';

DefineOrdinalStatement:
    ('DEFINE' | xDefine?='XDEFINE') 'ORDINAL' name=FQN
    '(' ordinalValues=OrdinalValueList ')' 
    (
        // std. attributes
        attributes+= ('SIGNED' | 'UNSIGNED')  |
        // attribute w/ precision val (will only take one)
        (attributes+=('PRECISION' | 'PREC') '(' precision+=NUMBER ')')
    )* ';';

OrdinalValueList: members+=OrdinalValue (',' members+=OrdinalValue)*;

OrdinalValue: name=ID ('VALUE'  '(' value=NUMBER ')')?;

DefineStructureStatement: ('DEFINE' | xDefine?='XDEFINE') ('STRUCTURE'|'STRUCT') level=NUMBER name=FQN (union?='UNION')? (',' substructures+=SubStructure)* ';';

SubStructure: level=NUMBER name=ID attributes+=DeclarationAttribute*;

DelayStatement: 'DELAY' '(' delay=Expression ')' ';';

DeleteStatement: 'DELETE' 'FILE' '(' (file=LocatorCall) ')' ('KEY' '(' key=Expression ')')? ';';

DetachStatement: 'DETACH' 'THREAD' '(' reference=LocatorCall ')' ';';

DisplayStatement: 'DISPLAY' '(' expression=Expression ')' 
    ('REPLY' '(' reply=LocatorCall ')')? 
    ('ROUTCDE' '(' rout+=NUMBER (',' rout+=NUMBER)* ')' ('DESC' '(' desc+=NUMBER (',' desc+=NUMBER)* ')')?)? ';'
;

DoStatement:
    'DO'
    // Note: DoType1 does nothing
    (doType2=DoType2 | doType3=DoType3<true>)? ';'
        statements+=Statement*
    end=EndStatement ';';

DoType2: DoWhile | DoUntil;

DoWhile: 'WHILE' '(' while=Expression ')' ('UNTIL' '(' until=Expression ')')?;

DoUntil: 'UNTIL' '(' until=Expression ')' ('WHILE' '(' while=Expression ')')?;

DoType3<content>: variable=DoType3Variable '=' specifications+=DoSpecification<content> (',' specifications+=DoSpecification<content>)*;

DoType3Variable: name=ID;

DoSpecification<content>: exp1=Expression (
        'TO' to=Expression ('BY' by=Expression)?
        | 'BY' by=Expression ('TO' to=Expression)?
        | 'UPTHRU' upthru=Expression
        | 'DOWNTHRU' downthru=Expression
        | 'REPEAT' repeat=Expression
    )?
    (<content> whileOrUntil=(DoWhile | DoUntil)?);

ExecStatement: 'EXEC' query=ExecFragment ';';

ExitStatement: {infer ExitStatement} 'EXIT' ';';

FetchStatement: 'FETCH' entries+=FetchEntry (',' entries+=FetchEntry)* ';';

FetchEntry: entry=[NamedElement:ID] ('SET' '(' set=LocatorCall ')')? ('TITLE' '(' title=Expression ')')?;

FlushStatement: 'FLUSH' 'FILE' '(' file=(LocatorCall | '*') ')' ';';

FormatStatement: 'FORMAT' '(' list=FormatList ')' ';';

FormatList: items+=FormatListItem (',' items+=FormatListItem)*;

FormatListItem: level=FormatListItemLevel? (item=FormatItem | '(' list=FormatList ')');

FormatListItemLevel: level=NUMBER | '(' level=Expression ')';

FormatItem: AFormatItem | BFormatItem | CFormatItem | EFormatItem | FFormatItem | PFormatItem
    | ColumnFormatItem | GFormatItem | LFormatItem | LineFormatItem | PageFormatItem
    | RFormatItem | SkipFormatItem | VFormatItem | XFormatItem;

AFormatItem: 'A' ('(' fieldWidth=Expression ')')?;

BFormatItem: 'B' ('(' fieldWidth=Expression ')')?;

CFormatItem: 'C' '(' item=(FFormatItem | EFormatItem | PFormatItem)')';

FFormatItem: 'F' '(' fieldWidth=Expression (',' fractionalDigits=Expression (',' scalingFactor=Expression)?)? ')';
EFormatItem: 'E' '(' fieldWidth=Expression ',' fractionalDigits=Expression (',' significantDigits=Expression)? ')';
PFormatItem: 'P' specification=STRING_TERM;

ColumnFormatItem: ('COLUMN' | 'COL') '(' characterPosition=Expression ')';

GFormatItem: 'G' ('(' fieldWidth=Expression ')')?;

LFormatItem: {infer LFormatItem} 'L';

LineFormatItem: 'LINE' '(' lineNumber=Expression ')';

PageFormatItem: {infer PageFormatItem} 'PAGE';

RFormatItem: 'R' '(' labelReference=ID ')';

SkipFormatItem: 'SKIP' ('(' skip=Expression ')')?;

VFormatItem: {infer VFormatItem} 'V';

XFormatItem: 'X' '(' width=Expression ')';

FreeStatement: 'FREE' references+=LocatorCall (',' references+=LocatorCall)* ';';

GetStatement: 'GET' (
    // The specifications can appear in any order
    {infer GetFileStatement} specifications+=(GetFile|GetCopy|GetSkip|DataSpecificationOptions)+
    |
    {infer GetStringStatement} 'STRING' '(' expression=Expression ')' dataSpecification=DataSpecificationOptions
) ';';

GetFile: 'FILE' '(' file=Expression ')';

GetCopy: 'COPY' ('(' /* TODO REFERENCE */ copyReference=ID ')')?;

GetSkip: 'SKIP' ('(' skipExpression=Expression ')')?;

GoToStatement: ('GO' 'TO' | 'GOTO') label=LabelReference ';';

IfStatement: 'IF' expression=Expression 'THEN' unit=Statement ('ELSE' else=Statement)?;

IncludeDirective: ('%INCLUDE' | '%XINCLUDE') items+=IncludeItem (',' items+=IncludeItem)* ';';

IncludeItem: file=(STRING_TERM|ID) | ddname?='ddname' '(' file=(STRING_TERM|ID) ')';

IterateStatement: 'ITERATE' label=LabelReference? ';';

LeaveStatement: 'LEAVE' label=LabelReference? ';';

LineDirective: '%LINE' ('(' line=NUMBER ',' file=STRING_TERM ')') ';';

LocateStatement: 
    'LOCATE' variable=LocatorCall
    // These can appear in any order
    arguments+=(LocateStatementFile | LocateStatementSet | LocateStatementKeyFrom)*
    ';'
;

LocateStatementFile: 'FILE' '(' file=ReferenceItem ')';
LocateStatementSet: 'SET' '(' set=LocatorCall ')';
LocateStatementKeyFrom: 'KEYFROM' '(' keyfrom=Expression ')';

NoPrintDirective: {infer NoPrintDirective} '%NOPRINT' ';';

NoteDirective: '%NOTE' '(' message=Expression (',' code=Expression)? ')' ';';

NullStatement: {infer NullStatement} ';';

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

NamedCondition: 'CONDITION' '(' name=ID ')';

FileReferenceCondition: keyword=('ENDFILE' | 'ENDPAGE'| 'KEY'|'NAME'|'RECORD'|'TRANSMIT'|'UNDEFINEDFILE'|'UNDF') ('(' fileReference=ReferenceItem ')')?;

OpenStatement: 'OPEN' options+=OpenOptionsGroup (',' options+=OpenOptionsGroup)* ';';

OpenOptionsGroup: options+=(
    OpenOptionsFile 
    | OpenOptionsStream 
    | OpenOptionsAccess
    | OpenOptionsBuffering
    | OpenOptionsKeyed
    | OpenOptionsPrint
    | OpenOptionsTitle
    | OpenOptionsLineSize
    | OpenOptionsPageSize
);

OpenOptionsFile: 'FILE' '(' file=ReferenceItem ')';
OpenOptionsStream: stream?='STREAM' | record?='RECORD';
OpenOptionsAccess: input?='INPUT' | output?='OUTPUT' | update?='UPDATE';
OpenOptionsBuffering: (sequential?=('SEQUENTIAL'|'SEQL') | direct?='DIRECT') (unbuffered?=('UNBUFFERED'|'UNBUF') | buffered?=('BUF'|'BUFFERED'))?;
OpenOptionsKeyed: keyed?='KEYED';
OpenOptionsPrint: print?='PRINT';
OpenOptionsTitle: 'TITLE' '(' title=Expression ')';
OpenOptionsLineSize: 'LINESIZE' '(' lineSize=Expression ')';
OpenOptionsPageSize: 'PAGESIZE' '(' pageSize=Expression ')';

PageDirective: {infer PageDirective} '%PAGE' ';';

PopDirective: {infer PopDirective} '%POP' ';';

PrintDirective: {infer PrintDirective} '%PRINT' ';';

ProcessDirective: ('*PROCESS' | '%PROCESS') (compilerOptions+=CompilerOptions (',' compilerOptions+=CompilerOptions))? ';';

CompilerOptions: value='TODO';

ProcincDirective: ('%PROCINC' | '*PROCINC') datasetName=ID ';';

PushDirective: {infer PushDirective} '%PUSH' ';';

PutStatement: 'PUT' 
    (
        {infer PutFileStatement} items+=(PutItem | DataSpecificationOptions)+
        | 
        {infer PutStringStatement} ('STRING' '(' stringExpression=Expression ')' dataSpecification=DataSpecificationOptions)
    )? ';'
;

PutItem: attribute=PutAttribute ('(' expression=Expression ')')?;

PutAttribute returns string: 'PAGE' | 'LINE' | 'SKIP' | 'FILE';

DataSpecificationOptions: (
    ('LIST'? '(' dataList=DataSpecificationDataList ')')
    | data?='DATA' ('(' dataListItems+=DataSpecificationDataListItem (',' dataListItems+=DataSpecificationDataListItem)* ')')?
    | edit?='EDIT' ('(' dataLists+=DataSpecificationDataList ')' '(' formatLists+=FormatList ')')+
);

DataSpecificationDataList: items+=DataSpecificationDataListItem (',' items+=DataSpecificationDataListItem)*;

DataSpecificationDataListItem: value=Expression;

QualifyStatement: 
    'QUALIFY' ';'
    statements+=Statement*
    end=EndStatement ';'
;

ReadStatement: 'READ'
    // Arguments can appear in any order
    arguments+=(
        ReadStatementFile
        | ReadStatementIgnore
        | ReadStatementInto
        | ReadStatementSet
        | ReadStatementKey
        | ReadStatementKeyTo
    )* ';'
;

ReadStatementFile: 'FILE' '(' file=LocatorCall ')';
ReadStatementIgnore: 'IGNORE' '(' ignore=Expression ')';
ReadStatementInto: 'INTO' '(' intoRef=LocatorCall ')';
ReadStatementSet: 'SET' '(' set=LocatorCall ')';
ReadStatementKey: 'KEY' '(' key=Expression ')';
ReadStatementKeyTo: 'KEYTO' '(' keyto=LocatorCall ')';

ReinitStatement: 'REINIT' reference=LocatorCall ';';

ReleaseStatement: 'RELEASE' (star?='*' | references+=ID (',' references+=ID)*) ';';

ResignalStatement: {infer ResignalStatement} 'RESIGNAL' ';';

ReturnStatement: 'RETURN' ('(' expression=Expression ')')? ';';

RevertStatement: 'REVERT' conditions+=Condition (',' conditions+=Condition)* ';';

RewriteStatement: 'REWRITE' arguments+=(RewriteStatementFile | RewriteStatementFrom | RewriteStatementKey)* ';';

RewriteStatementFile: 'FILE' '(' file=LocatorCall ')';
RewriteStatementFrom: 'FROM' '(' from=LocatorCall ')';
RewriteStatementKey: 'KEY' '(' key=Expression ')';

// Ensure via validation that `Otherwise` appears last
SelectStatement: 
    'SELECT' ('(' on=Expression ')')? ';' 
    (statements+=(WhenStatement | OtherwiseStatement))*
    end=EndStatement ';'
;

WhenStatement: 'WHEN' '(' conditions+=Expression (',' conditions+=Expression)* ')' unit=Statement /* maybe? ';' */;

OtherwiseStatement: ('OTHERWISE' | 'OTHER') unit=Statement /* maybe? ';' */;

SignalStatement: 'SIGNAL' condition+=Condition ';';

SkipDirective: '%SKIP' ('(' lines=Expression ')')? ';';

StopStatement: {infer StopStatement} 'STOP' ';';

WaitStatement: 'WAIT' 'THREAD' '(' task=LocatorCall ')' ';';

WriteStatement: 'WRITE' arguments+=(WriteStatementFile | WriteStatementFrom | WriteStatementKeyFrom | WriteStatementKeyTo) ';';

WriteStatementFile: 'FILE' '(' file=LocatorCall ')';
WriteStatementFrom: 'FROM' '(' from=LocatorCall ')';
WriteStatementKeyFrom: 'KEYFROM' '(' keyfrom=Expression ')';
WriteStatementKeyTo: 'KEYTO' '(' keyto=LocatorCall ')';

// #endregion

InitialAttribute: (('INITIAL' | 'INIT') (
    direct?='(' items+=InitialAttributeItem (',' items+=InitialAttributeItem)* ')'
    | call?='CALL' procedureCall=ProcedureCall
    | to?='TO' '(' content=InitialToContent ')' '(' items+=InitialAttributeItem (',' items+=InitialAttributeItem)* ')'
    )
    | across?='INITACROSS' '(' expressions+=InitAcrossExpression (',' expressions+=InitAcrossExpression)* ')'
    );

InitialToContent: (varying=Varying type=CharType? | type=CharType varying=Varying?);

Varying returns string: 'VARYING' | 'VARYING4' | 'VARYINGZ' | 'NONVARYING';

CharType returns string: 'CHAR' | 'UCHAR' | 'WCHAR';

InitAcrossExpression: '(' expressions+=Expression (',' expressions+=Expression)* ')';

InitialAttributeItem: InitialAttributeItemStar | InitialAttributeSpecification;

InitialAttributeItemStar: {infer InitialAttributeItemStar} '*';
InitialAttributeSpecification: ('(' (star?='*') ')' | expression=Expression) item=InitialAttributeSpecificationIteration?;

InitialAttributeSpecificationIteration: InitialAttributeItemStar | InitialAttributeSpecificationIterationValue;

InitialAttributeSpecificationIterationValue: '(' items+=InitialAttributeItem (',' items+=InitialAttributeItem)* ')';

DeclareStatement: ('DCL' | 'DECLARE' | xDeclare?='XDECLARE' | xDeclare?='XDCL') items+=DeclaredItem (',' items+=DeclaredItem)*  ';';
DeclaredItem: level=NUMBER? (element=DeclaredVariable | element='*' | '(' items+=DeclaredItem (',' items+=DeclaredItem)* ')') attributes+=DeclarationAttribute*;

type NamedElement = DeclaredVariable | DoType3Variable | ProcedureStatement | OrdinalValue;
type NamedType = DefineAliasStatement;
type OrdinalType = DefineOrdinalStatement;

DeclaredVariable: name=ID;

DefaultDeclarationAttribute:
    InitialAttribute
    | DateAttribute
    | HandleAttribute
    | DefinedAttribute
    | PictureAttribute
    | EnvironmentAttribute
    | DimensionsDataAttribute
    | DefaultValueAttribute
    | ValueListFromAttribute
    | ValueListAttribute
    | ValueRangeAttribute
    | ReturnsAttribute
    | ComputationDataAttribute
    | EntryAttribute
    | LikeAttribute
    | TypeAttribute
    | OrdinalTypeAttribute;

DeclarationAttribute:
    InitialAttribute
    | DateAttribute
    | HandleAttribute
    | DefinedAttribute
    | PictureAttribute
    | EnvironmentAttribute
    | DimensionsDataAttribute
    | ValueAttribute
    | ValueListFromAttribute
    | ValueListAttribute
    | ValueRangeAttribute
    | ReturnsAttribute
    | ComputationDataAttribute
    | EntryAttribute
    | LikeAttribute
    | TypeAttribute
    | OrdinalTypeAttribute;

DateAttribute: 'DATE' ('(' pattern=STRING_TERM ')')?;

DefinedAttribute: ('DEFINED' | 'DEF') (reference=MemberCall | '(' reference=MemberCall ')') (('POSITION' | 'POS') '(' position=Expression ')')?;

PictureAttribute: ('PICTURE' | 'WIDEPIC' | 'PIC') picture=STRING_TERM?;

DimensionsDataAttribute: ('DIMENSION' | 'DIM')? dimensions=Dimensions;

TypeAttribute: 'TYPE' (type=[NamedType:ID] | '(' type=[NamedType:ID] ')');

// TODO @montymxb Jan. 24th, 2025: This may be too strict w/ regards to byvalue after, I suspect that we can pass much more there
OrdinalTypeAttribute: 'ORDINAL' (type=[OrdinalType:ID] | '(' type=[OrdinalType:ID] ')') byvalue?='BYVALUE';

/**
 * Used to specify the attribute of a value that is returned (slightly different from `ReturnsOption`).
 * Order of contained attributes is not a factor, consider it a set, so duplicates are ignored as well.
 * All data attrs are valid + aligned/unaligned + non-data attributes BYVALUE/BYADDR, DATE, VALUELIST, and VALUERANGE (see pg. 134 lang-ref 6.1)
 */
ReturnsAttribute: 'RETURNS' '(' (attrs+=(ComputationDataAttribute | DateAttribute | ValueListAttribute | ValueRangeAttribute))* ')';

ComputationDataAttribute: type=DataAttributeType dimensions=Dimensions?;

DefaultValueAttribute: 'VALUE' '(' (items+=DefaultValueAttributeItem (',' items+=DefaultValueAttributeItem)*) ')';

ValueAttribute: 'VALUE' '(' (value=Expression) ')';

DefaultValueAttributeItem: attributes+=DeclarationAttribute+;

ValueListAttribute: 'VALUELIST' '(' (values+=Expression (',' values+=Expression)*)? ')';

ValueListFromAttribute: 'VALUELISTFROM' from=LocatorCall;

ValueRangeAttribute: 'VALUERANGE' '(' (values+=Expression (',' values+=Expression)*)? ')';

DataAttributeType returns string: DefaultAttribute;

LikeAttribute: 'LIKE' reference=LocatorCall;

HandleAttribute: 'HANDLE' ('(' size=NUMBER ')')? (type=[NamedType:ID] | '(' type=[NamedType:ID] ')');

Dimensions: '(' (dimensions+=DimensionBound (',' dimensions+=DimensionBound)*)? ')';

/** 
 * Attention! This naming has an explanation:
 * - When only bound1 is given, it is the upper bound.
 * - Otherwise bound1 is the lower and bound2 is the upper bound!
 * Keep in mind, that `DimensionBound: upper=Bound | lower=Bound ':' upper=Bound;` is expensive because of the long common prefix.
 */
DimensionBound: bound1=Bound (':' bound2=Bound)?;

Bound: (expression='*' | expression=Expression ('REFER' '(' refer=LocatorCall ')')?);

// ONLY FOR FILES
EnvironmentAttribute: ('ENVIRONMENT' | 'ENV') '(' items+=EnvironmentAttributeItem* ')';

EnvironmentAttributeItem: environment=ID ('(' (args+=Expression (','? args+=Expression)*)? ')')?;

EntryAttribute:
    (
        limited+='LIMITED'
    )*
    'ENTRY'
    ('(' attributes+=EntryDescription (',' attributes+=EntryDescription)* ')')?
    (
        options+=Options |
        variable+='VARIABLE' |
        limited+='LIMITED' |
        returns+=ReturnsOption |
        (('EXTERNAL' | 'EXT') ('(' environmentName+=Expression ')')?)
    )*
;

ReturnsOption: 'RETURNS' '(' returnAttributes+=DeclarationAttribute* ')';

EntryDescription: EntryParameterDescription | EntryUnionDescription;

EntryParameterDescription: (attributes+=DeclarationAttribute+ | star?='*' attributes+=DeclarationAttribute*);

EntryUnionDescription: init=NUMBER attributes+=DeclarationAttribute* ',' prefixedAttributes+=PrefixedAttribute*;

PrefixedAttribute: level=NUMBER attribute=DeclarationAttribute*;

ProcedureParameter: id=ID;

ReferenceItem: ref=[NamedElement:ID] dimensions=Dimensions?;

Expression: BinaryExpression;


// Note for expressions: Documentation uses '¬' to denote inversion or negation. The language actually uses '^'

BinaryExpression infers Expression: 
    {infer BinaryExpression} 
    items+=PrimaryExpression 
    (
        op+=(
            // Priority 7
            '|' | '¬' | '^' |
            // Priority 6
            '&' |
            // Priority 5
            '<' | '¬<' | '<=' | '=' | '¬=' | '^=' | '<>' | '>=' | '>' | '¬>' |
            // Priority 4
            '||' | '!!' |
            // Priority 3
            '+' | '-' |
            // Priority 2
            '*' | '/' |
            // Priority 1
            '**'
        ) 
        items+=PrimaryExpression
    )*;

PrimaryExpression infers Expression: 
    Literal
    | ParenthesizedExpression
    | UnaryExpression
    | LocatorCall;

// Performs special handling as a recursive descent parser otherwise cannot handle the 
// special data-list type-3-DO loop
// See also language reference pp. 301
ParenthesizedExpression infers Expression: {infer Parenthesis} '(' value=Expression ('DO' do=DoType3<false>)? ')' ({infer Literal.multiplier=current} value=LiteralValue)?;

MemberCall:
    element=ReferenceItem
	({infer MemberCall.previous=current} 
        "." element=ReferenceItem
    )*;

LocatorCall:
    element=MemberCall
    ({infer LocatorCall.previous=current}
        (pointer?="->" | handle?="=>") element=MemberCall
    )*;

/**
 * Call to a known procedure or external declaration (via a named element), does not necessarily require an arg list
 */
ProcedureCall: procedure=[NamedElement:ID] (hasArgs?='(' (args+=(Expression | '*') (',' args+=(Expression | '*'))*)? ')')?;

LabelReference: label=[LabelPrefix:ID];

UnaryExpression: op=('+' | '-' | '¬' | '^') expr=Expression;

Literal: value=LiteralValue;
LiteralValue: StringLiteral | NumberLiteral;

StringLiteral: value=STRING_TERM;
NumberLiteral: value=NUMBER;

FQN returns string: ID ('.' ID)*;

hidden terminal WS: /\s+/;
terminal ExecFragment: /(?<=EXEC\s*)[a-zA-Z]+\s[^;]*/i;
terminal ID: /[$@#_a-zA-Z][\w_$@#]*/;
/**
 * Includes both fixed and non-fixed (with and without mantissa)
 */
terminal NUMBER: FULL_NUM /([bB]|[iI])*/;
// terminal WRAPPED_NUM:  ("'" (FULL_NUM | HEX_CHAR*) "'") /([xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/;
// terminal fragment HEX_CHAR: /[0-9a-fA-F]/;
terminal fragment NUM: /([0-9][0-9_]*(\.[0-9_]+)?)|(\.[0-9_]+)/;
terminal fragment FULL_NUM: NUM MANTISSA?;
terminal fragment MANTISSA: /[eEsSdDqQ][-+]?[0-9]+/;
// This terminal combines WRAPPED_NUM and normal strings
terminal STRING_TERM: /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX][nN]|[xX][uU]|[xX]|[aA]|[eE]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[iI]|[mM])*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;