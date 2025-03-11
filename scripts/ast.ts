import { CstNode } from "./cst-base";

export enum SyntaxKind {
    AFormatItem,
    AllocateDimension,
    AllocatedVariable,
    AllocateLocationReferenceIn,
    AllocateLocationReferenceSet,
    AllocateStatement,
    AllocateType,
    AssertStatement,
    AssignmentStatement,
    AttachStatement,
    BeginStatement,
    BFormatItem,
    BinaryExpression,
    Bound,
    CallStatement,
    CancelThreadStatement,
    CFormatItem,
    CloseStatement,
    CMPATOptionsItem,
    ColumnFormatItem,
    CompilerOptions,
    ComputationDataAttribute,
    ConditionPrefix,
    ConditionPrefixItem,
    DataSpecificationDataList,
    DataSpecificationDataListItem,
    DataSpecificationOptions,
    DateAttribute,
    DeclaredItem,
    DeclaredVariable,
    DeclareStatement,
    DefaultAttributeExpression,
    DefaultAttributeExpressionNot,
    DefaultExpression,
    DefaultExpressionPart,
    DefaultRangeIdentifierItem,
    DefaultRangeIdentifiers,
    DefaultStatement,
    DefaultValueAttribute,
    DefaultValueAttributeItem,
    DefineAliasStatement,
    DefinedAttribute,
    DefineOrdinalStatement,
    DefineStructureStatement,
    DelayStatement,
    DeleteStatement,
    DetachStatement,
    DimensionBound,
    Dimensions,
    DimensionsDataAttribute,
    DisplayStatement,
    DoSpecification,
    DoStatement,
    DoType3,
    DoType3Variable,
    DoUntil,
    DoWhile,
    EFormatItem,
    EndStatement,
    EntryAttribute,
    EntryParameterDescription,
    EntryStatement,
    EntryUnionDescription,
    EnvironmentAttribute,
    EnvironmentAttributeItem,
    ExecStatement,
    ExitStatement,
    Exports,
    FetchEntry,
    FetchStatement,
    FFormatItem,
    FileReferenceCondition,
    FlushStatement,
    FormatList,
    FormatListItem,
    FormatListItemLevel,
    FormatStatement,
    FreeStatement,
    GetCopy,
    GetFile,
    GetFileStatement,
    GetSkip,
    GetStringStatement,
    GFormatItem,
    GoToStatement,
    HandleAttribute,
    IfStatement,
    IncludeDirective,
    IncludeItem,
    InitAcrossExpression,
    InitialAttribute,
    InitialAttributeItemStar,
    InitialAttributeSpecification,
    InitialAttributeSpecificationIterationValue,
    InitialToContent,
    IterateStatement,
    KeywordCondition,
    LabelPrefix,
    LabelReference,
    LeaveStatement,
    LFormatItem,
    LikeAttribute,
    LineDirective,
    LineFormatItem,
    LinkageOptionsItem,
    Literal,
    LocateStatement,
    LocateStatementFile,
    LocateStatementKeyFrom,
    LocateStatementSet,
    LocatorCall,
    MemberCall,
    NamedCondition,
    NoMapOptionsItem,
    NoPrintDirective,
    NoteDirective,
    NullStatement,
    NumberLiteral,
    OnStatement,
    OpenOptionsAccess,
    OpenOptionsBuffering,
    OpenOptionsFile,
    OpenOptionsGroup,
    OpenOptionsKeyed,
    OpenOptionsLineSize,
    OpenOptionsPageSize,
    OpenOptionsPrint,
    OpenOptionsStream,
    OpenOptionsTitle,
    OpenStatement,
    Options,
    OrdinalTypeAttribute,
    OrdinalValue,
    OrdinalValueList,
    OtherwiseStatement,
    Package,
    PageDirective,
    PageFormatItem,
    Parenthesis,
    PFormatItem,
    PictureAttribute,
    PliProgram,
    PopDirective,
    PrefixedAttribute,
    PrintDirective,
    ProcedureCall,
    ProcedureParameter,
    ProcedureStatement,
    ProcessDirective,
    ProcincDirective,
    PushDirective,
    PutFileStatement,
    PutItem,
    PutStringStatement,
    QualifyStatement,
    ReadStatement,
    ReadStatementFile,
    ReadStatementIgnore,
    ReadStatementInto,
    ReadStatementKey,
    ReadStatementKeyTo,
    ReadStatementSet,
    ReferenceItem,
    ReinitStatement,
    ReleaseStatement,
    Reserves,
    ResignalStatement,
    ReturnsAttribute,
    ReturnsOption,
    ReturnStatement,
    RevertStatement,
    RewriteStatement,
    RewriteStatementFile,
    RewriteStatementFrom,
    RewriteStatementKey,
    RFormatItem,
    SelectStatement,
    SignalStatement,
    SimpleOptionsItem,
    SkipDirective,
    SkipFormatItem,
    Statement,
    StopStatement,
    StringLiteral,
    SubStructure,
    TypeAttribute,
    UnaryExpression,
    ValueAttribute,
    ValueListAttribute,
    ValueListFromAttribute,
    ValueRangeAttribute,
    VFormatItem,
    WaitStatement,
    WhenStatement,
    WriteStatement,
    WriteStatementFile,
    WriteStatementFrom,
    WriteStatementKeyFrom,
    WriteStatementKeyTo,
    XFormatItem
}

export interface AstNode {
    cst?: CstNode;
}

export type Reference<T> = T;

export type SyntaxNode =
    AFormatItem |
    AllocateDimension |
    AllocatedVariable |
    AllocateLocationReferenceIn |
    AllocateLocationReferenceSet |
    AllocateStatement |
    AllocateType |
    AssertStatement |
    AssignmentStatement |
    AttachStatement |
    BeginStatement |
    BFormatItem |
    BinaryExpression |
    Bound |
    CallStatement |
    CancelThreadStatement |
    CFormatItem |
    CloseStatement |
    CMPATOptionsItem |
    ColumnFormatItem |
    CompilerOptions |
    ComputationDataAttribute |
    ConditionPrefix |
    ConditionPrefixItem |
    DataSpecificationDataList |
    DataSpecificationDataListItem |
    DataSpecificationOptions |
    DateAttribute |
    DeclaredItem |
    DeclaredVariable |
    DeclareStatement |
    DefaultAttributeExpression |
    DefaultAttributeExpressionNot |
    DefaultExpression |
    DefaultExpressionPart |
    DefaultRangeIdentifierItem |
    DefaultRangeIdentifiers |
    DefaultStatement |
    DefaultValueAttribute |
    DefaultValueAttributeItem |
    DefineAliasStatement |
    DefinedAttribute |
    DefineOrdinalStatement |
    DefineStructureStatement |
    DelayStatement |
    DeleteStatement |
    DetachStatement |
    DimensionBound |
    Dimensions |
    DimensionsDataAttribute |
    DisplayStatement |
    DoSpecification |
    DoStatement |
    DoType3 |
    DoType3Variable |
    DoUntil |
    DoWhile |
    EFormatItem |
    EndStatement |
    EntryAttribute |
    EntryParameterDescription |
    EntryStatement |
    EntryUnionDescription |
    EnvironmentAttribute |
    EnvironmentAttributeItem |
    ExecStatement |
    ExitStatement |
    Exports |
    FetchEntry |
    FetchStatement |
    FFormatItem |
    FileReferenceCondition |
    FlushStatement |
    FormatList |
    FormatListItem |
    FormatListItemLevel |
    FormatStatement |
    FreeStatement |
    GetCopy |
    GetFile |
    GetFileStatement |
    GetSkip |
    GetStringStatement |
    GFormatItem |
    GoToStatement |
    HandleAttribute |
    IfStatement |
    IncludeDirective |
    IncludeItem |
    InitAcrossExpression |
    InitialAttribute |
    InitialAttributeItemStar |
    InitialAttributeSpecification |
    InitialAttributeSpecificationIterationValue |
    InitialToContent |
    IterateStatement |
    KeywordCondition |
    LabelPrefix |
    LabelReference |
    LeaveStatement |
    LFormatItem |
    LikeAttribute |
    LineDirective |
    LineFormatItem |
    LinkageOptionsItem |
    Literal |
    LocateStatement |
    LocateStatementFile |
    LocateStatementKeyFrom |
    LocateStatementSet |
    LocatorCall |
    MemberCall |
    NamedCondition |
    NoMapOptionsItem |
    NoPrintDirective |
    NoteDirective |
    NullStatement |
    NumberLiteral |
    OnStatement |
    OpenOptionsAccess |
    OpenOptionsBuffering |
    OpenOptionsFile |
    OpenOptionsGroup |
    OpenOptionsKeyed |
    OpenOptionsLineSize |
    OpenOptionsPageSize |
    OpenOptionsPrint |
    OpenOptionsStream |
    OpenOptionsTitle |
    OpenStatement |
    Options |
    OrdinalTypeAttribute |
    OrdinalValue |
    OrdinalValueList |
    OtherwiseStatement |
    Package |
    PageDirective |
    PageFormatItem |
    Parenthesis |
    PFormatItem |
    PictureAttribute |
    PliProgram |
    PopDirective |
    PrefixedAttribute |
    PrintDirective |
    ProcedureCall |
    ProcedureParameter |
    ProcedureStatement |
    ProcessDirective |
    ProcincDirective |
    PushDirective |
    PutFileStatement |
    PutItem |
    PutStringStatement |
    QualifyStatement |
    ReadStatement |
    ReadStatementFile |
    ReadStatementIgnore |
    ReadStatementInto |
    ReadStatementKey |
    ReadStatementKeyTo |
    ReadStatementSet |
    ReferenceItem |
    ReinitStatement |
    ReleaseStatement |
    Reserves |
    ResignalStatement |
    ReturnsAttribute |
    ReturnsOption |
    ReturnStatement |
    RevertStatement |
    RewriteStatement |
    RewriteStatementFile |
    RewriteStatementFrom |
    RewriteStatementKey |
    RFormatItem |
    SelectStatement |
    SignalStatement |
    SimpleOptionsItem |
    SkipDirective |
    SkipFormatItem |
    Statement |
    StopStatement |
    StringLiteral |
    SubStructure |
    TypeAttribute |
    UnaryExpression |
    ValueAttribute |
    ValueListAttribute |
    ValueListFromAttribute |
    ValueRangeAttribute |
    VFormatItem |
    WaitStatement |
    WhenStatement |
    WriteStatement |
    WriteStatementFile |
    WriteStatementFrom |
    WriteStatementKeyFrom |
    WriteStatementKeyTo |
    XFormatItem
    ;

export type AllocateAttribute = AllocateDimension | AllocateLocationReferenceIn | AllocateLocationReferenceSet | AllocateType | InitialAttribute;
export type AllocateAttributeType = 'AREA' | 'BIT' | 'CHAR' | 'CHARACTER' | 'GRAPHIC' | 'UCHAR' | 'WIDECHAR';
export type AssignmentOperator = '&=' | '**=' | '*=' | '+=' | '-=' | '/=' | '<>' | '=' | '^=' | '|=' | '||=' | '¬=';
export type CharType = 'CHAR' | 'UCHAR' | 'WCHAR';
export type Condition = FileReferenceCondition | KeywordCondition | NamedCondition;
export type DataAttributeType = DefaultAttribute;
export type DeclarationAttribute = ComputationDataAttribute | DateAttribute | DefinedAttribute | DimensionsDataAttribute | EntryAttribute | EnvironmentAttribute | HandleAttribute | InitialAttribute | LikeAttribute | OrdinalTypeAttribute | PictureAttribute | ReturnsAttribute | TypeAttribute | ValueAttribute | ValueListAttribute | ValueListFromAttribute | ValueRangeAttribute;
export type DefaultAttribute = 'ABNORMAL' | 'ALIGNED' | 'AREA' | 'ASSIGNABLE' | 'AUTOMATIC' | 'BACKWARDS' | 'BASED' | 'BIGENDIAN' | 'BIN' | 'BINARY' | 'BIT' | 'BUFFERED' | 'BUILTIN' | 'BYADDR' | 'BYVALUE' | 'CHAR' | 'CHARACTER' | 'COMPLEX' | 'CONDITION' | 'CONNECTED' | 'CONSTANT' | 'CONTROLLED' | 'CTL' | 'DEC' | 'DECIMAL' | 'DIMACROSS' | 'EVENT' | 'EXCLUSIVE' | 'EXT' | 'EXTERNAL' | 'FILE' | 'FIXED' | 'FLOAT' | 'FORMAT' | 'GENERIC' | 'GRAPHIC' | 'HEX' | 'HEXADEC' | 'IEEE' | 'INONLY' | 'INOUT' | 'INPUT' | 'INT' | 'INTERNAL' | 'IRREDUCIBLE' | 'KEYED' | 'LABEL' | 'LIST' | 'LITTLEENDIAN' | 'MEMBER' | 'NATIVE' | 'NONASGN' | 'NONASSIGNABLE' | 'NONCONNECTED' | 'NONNATIVE' | 'NONVARYING' | 'NORMAL' | 'OFFSET' | 'OPTIONAL' | 'OPTIONS' | 'OUTONLY' | 'OUTPUT' | 'PARAMETER' | 'POINTER' | 'POSITION' | 'PREC' | 'PRECISION' | 'PRINT' | 'PTR' | 'RANGE' | 'REAL' | 'RECORD' | 'RESERVED' | 'SEQUENTIAL' | 'SIGNED' | 'STATIC' | 'STREAM' | 'STRUCTURE' | 'TASK' | 'TRANSIENT' | 'UCHAR' | 'UNAL' | 'UNALIGNED' | 'UNBUFFERED' | 'UNION' | 'UNSIGNED' | 'UPDATE' | 'VAR' | 'VARIABLE' | 'VARYING' | 'VARYING4' | 'VARYINGZ' | 'VARZ' | 'WIDECHAR';
export type DefaultDeclarationAttribute = ComputationDataAttribute | DateAttribute | DefaultValueAttribute | DefinedAttribute | DimensionsDataAttribute | EntryAttribute | EnvironmentAttribute | HandleAttribute | InitialAttribute | LikeAttribute | OrdinalTypeAttribute | PictureAttribute | ReturnsAttribute | TypeAttribute | ValueListAttribute | ValueListFromAttribute | ValueRangeAttribute;
export type DoType2 = DoUntil | DoWhile;
export type EntryDescription = EntryParameterDescription | EntryUnionDescription;
export type Expression = BinaryExpression | Literal | LocatorCall | Parenthesis | UnaryExpression;
export type FormatItem = AFormatItem | BFormatItem | CFormatItem | ColumnFormatItem | EFormatItem | FFormatItem | GFormatItem | LFormatItem | LineFormatItem | PFormatItem | PageFormatItem | RFormatItem | SkipFormatItem | VFormatItem | XFormatItem;
export type FQN = string;
export type GetStatement = GetFileStatement | GetStringStatement;
export type InitialAttributeItem = InitialAttributeItemStar | InitialAttributeSpecification;
export type InitialAttributeSpecificationIteration = InitialAttributeItemStar | InitialAttributeSpecificationIterationValue;
export type LiteralValue = NumberLiteral | StringLiteral;
export type NamedElement = DeclaredVariable | DoType3Variable | OrdinalValue | ProcedureStatement;
export type NamedType = DefineAliasStatement;
export type OptionsItem = CMPATOptionsItem | LinkageOptionsItem | NoMapOptionsItem | SimpleOptionsItem;
export type OrdinalType = DefineOrdinalStatement;
export type PutAttribute = 'FILE' | 'LINE' | 'PAGE' | 'SKIP';
export type PutStatement = PutFileStatement | PutStringStatement;
export type ScopeAttribute = 'DYNAMIC' | 'STATIC';
export type Unit = AllocateStatement | AssertStatement | AssignmentStatement | AttachStatement | BeginStatement | CallStatement | CancelThreadStatement | CloseStatement | DeclareStatement | DefaultStatement | DefineAliasStatement | DefineOrdinalStatement | DefineStructureStatement | DelayStatement | DeleteStatement | DetachStatement | DisplayStatement | DoStatement | EntryStatement | ExecStatement | ExitStatement | FetchStatement | FlushStatement | FormatStatement | FreeStatement | GetStatement | GoToStatement | IfStatement | IncludeDirective | IterateStatement | LeaveStatement | LineDirective | LocateStatement | NoPrintDirective | NoteDirective | NullStatement | OnStatement | OpenStatement | Package | PageDirective | PopDirective | PrintDirective | ProcedureStatement | ProcessDirective | ProcincDirective | PushDirective | PutStatement | QualifyStatement | ReadStatement | ReinitStatement | ReleaseStatement | ResignalStatement | ReturnStatement | RevertStatement | RewriteStatement | SelectStatement | SignalStatement | SkipDirective | StopStatement | WaitStatement | WriteStatement;
export type Varying = 'NONVARYING' | 'VARYING' | 'VARYING4' | 'VARYINGZ';

export interface AFormatItem extends AstNode {
    kind: SyntaxKind.AFormatItem;
    fieldWidth: Expression;
}
export interface AllocateDimension extends AstNode {
    kind: SyntaxKind.AllocateDimension;
    dimensions: Dimensions;
}
export interface AllocatedVariable extends AstNode {
    kind: SyntaxKind.AllocatedVariable;
    level: string;
    var: ReferenceItem;
    attribute: AllocateAttribute;
}
export interface AllocateLocationReferenceIn extends AstNode {
    kind: SyntaxKind.AllocateLocationReferenceIn;
    area: LocatorCall;
}
export interface AllocateLocationReferenceSet extends AstNode {
    kind: SyntaxKind.AllocateLocationReferenceSet;
    locatorVariable: LocatorCall;
}
export interface AllocateStatement extends AstNode {
    kind: SyntaxKind.AllocateStatement;
    variables: AllocatedVariable[];
}
export interface AllocateType extends AstNode {
    kind: SyntaxKind.AllocateType;
    type: AllocateAttributeType;
    dimensions: Dimensions;
}
export interface AssertStatement extends AstNode {
    kind: SyntaxKind.AssertStatement;
    true: boolean;
    actual: Expression;
    false: boolean;
    unreachable: boolean;
    displayExpression: Expression;
    compare: boolean;
    expected: Expression;
    operator: string;
}
export interface AssignmentStatement extends AstNode {
    kind: SyntaxKind.AssignmentStatement;
    refs: LocatorCall[];
    operator: AssignmentOperator;
    expression: Expression;
    dimacrossExpr: Expression;
}
export interface AttachStatement extends AstNode {
    kind: SyntaxKind.AttachStatement;
    reference: LocatorCall;
    task: LocatorCall;
    environment: boolean;
    tstack: Expression;
}
export interface BeginStatement extends AstNode {
    kind: SyntaxKind.BeginStatement;
    options: Options;
    recursive: boolean;
    statements: Statement[];
    end: EndStatement;
    order: boolean;
    reorder: boolean;
}
export interface BFormatItem extends AstNode {
    kind: SyntaxKind.BFormatItem;
    fieldWidth: Expression;
}
export interface BinaryExpression extends AstNode {
    kind: SyntaxKind.BinaryExpression;
    items: Expression[];
    op: ('|' | '¬' | '^' | '&' | '<' | '¬<' | '<=' | '=' | '¬=' | '^=' | '<>' | '>=' | '>' | '¬>' | '||' | '!!' | '+' | '-' | '*' | '/' | '**')[];
}
export interface Bound extends AstNode {
    kind: SyntaxKind.Bound;
    expression: '*' | Expression;
    refer: LocatorCall;
}
export interface CallStatement extends AstNode {
    kind: SyntaxKind.CallStatement;
    call: ProcedureCall;
}
export interface CancelThreadStatement extends AstNode {
    kind: SyntaxKind.CancelThreadStatement;
    thread: LocatorCall;
}
export interface CFormatItem extends AstNode {
    kind: SyntaxKind.CFormatItem;
    item: FFormatItem | EFormatItem | PFormatItem;
}
export interface CloseStatement extends AstNode {
    kind: SyntaxKind.CloseStatement;
    files: (MemberCall | '*')[];
}
export interface CMPATOptionsItem extends AstNode {
    kind: SyntaxKind.CMPATOptionsItem;
    value: 'V1' | 'V2' | 'V3';
}
export interface ColumnFormatItem extends AstNode {
    kind: SyntaxKind.ColumnFormatItem;
    characterPosition: Expression;
}
export interface CompilerOptions extends AstNode {
    kind: SyntaxKind.CompilerOptions;
    value: 'TODO';
}
export interface ComputationDataAttribute extends AstNode {
    kind: SyntaxKind.ComputationDataAttribute;
    type: DataAttributeType;
    dimensions: Dimensions;
}
export interface ConditionPrefix extends AstNode {
    kind: SyntaxKind.ConditionPrefix;
    items: ConditionPrefixItem[];
}
export interface ConditionPrefixItem extends AstNode {
    kind: SyntaxKind.ConditionPrefixItem;
    conditions: Condition[];
}
export interface DataSpecificationDataList extends AstNode {
    kind: SyntaxKind.DataSpecificationDataList;
    items: DataSpecificationDataListItem[];
}
export interface DataSpecificationDataListItem extends AstNode {
    kind: SyntaxKind.DataSpecificationDataListItem;
    value: Expression;
}
export interface DataSpecificationOptions extends AstNode {
    kind: SyntaxKind.DataSpecificationOptions;
    dataList: DataSpecificationDataList;
    edit: boolean;
    dataLists: DataSpecificationDataList[];
    formatLists: FormatList[];
    data: boolean;
    dataListItems: DataSpecificationDataListItem[];
}
export interface DateAttribute extends AstNode {
    kind: SyntaxKind.DateAttribute;
    pattern: string;
}
export interface DeclaredItem extends AstNode {
    kind: SyntaxKind.DeclaredItem;
    level: string;
    element: DeclaredVariable | '*';
    attributes: DeclarationAttribute[];
    items: DeclaredItem[];
}
export interface DeclaredVariable extends AstNode {
    kind: SyntaxKind.DeclaredVariable;
    name: string;
}
export interface DeclareStatement extends AstNode {
    kind: SyntaxKind.DeclareStatement;
    items: DeclaredItem[];
    xDeclare: boolean;
}
export interface DefaultAttributeExpression extends AstNode {
    kind: SyntaxKind.DefaultAttributeExpression;
    items: DefaultAttributeExpressionNot[];
    operators: ('AND' | 'OR')[];
}
export interface DefaultAttributeExpressionNot extends AstNode {
    kind: SyntaxKind.DefaultAttributeExpressionNot;
    not: boolean;
    value: DefaultAttribute;
}
export interface DefaultExpression extends AstNode {
    kind: SyntaxKind.DefaultExpression;
    expression: DefaultExpressionPart;
    attributes: DefaultDeclarationAttribute[];
}
export interface DefaultExpressionPart extends AstNode {
    kind: SyntaxKind.DefaultExpressionPart;
    expression: DefaultAttributeExpression;
    identifiers: DefaultRangeIdentifiers;
}
export interface DefaultRangeIdentifierItem extends AstNode {
    kind: SyntaxKind.DefaultRangeIdentifierItem;
    from: string;
    to: string;
}
export interface DefaultRangeIdentifiers extends AstNode {
    kind: SyntaxKind.DefaultRangeIdentifiers;
    identifiers: ('*' | DefaultRangeIdentifierItem)[];
}
export interface DefaultStatement extends AstNode {
    kind: SyntaxKind.DefaultStatement;
    expressions: DefaultExpression[];
}
export interface DefaultValueAttribute extends AstNode {
    kind: SyntaxKind.DefaultValueAttribute;
    items: DefaultValueAttributeItem[];
}
export interface DefaultValueAttributeItem extends AstNode {
    kind: SyntaxKind.DefaultValueAttributeItem;
    attributes: DeclarationAttribute[];
}
export interface DefineAliasStatement extends AstNode {
    kind: SyntaxKind.DefineAliasStatement;
    name: string;
    xDefine: boolean;
    attributes: DeclarationAttribute[];
}
export interface DefinedAttribute extends AstNode {
    kind: SyntaxKind.DefinedAttribute;
    reference: MemberCall;
    position: Expression;
}
export interface DefineOrdinalStatement extends AstNode {
    kind: SyntaxKind.DefineOrdinalStatement;
    name: FQN;
    ordinalValues: OrdinalValueList;
    xDefine: boolean;
    signed: boolean;
    unsigned: boolean;
    precision: string;
}
export interface DefineStructureStatement extends AstNode {
    kind: SyntaxKind.DefineStructureStatement;
    xDefine: boolean;
    level: string;
    name: FQN;
    union: boolean;
    substructures: SubStructure[];
}
export interface DelayStatement extends AstNode {
    kind: SyntaxKind.DelayStatement;
    delay: Expression;
}
export interface DeleteStatement extends AstNode {
    kind: SyntaxKind.DeleteStatement;
    file: LocatorCall;
    key: Expression;
}
export interface DetachStatement extends AstNode {
    kind: SyntaxKind.DetachStatement;
    reference: LocatorCall;
}
export interface DimensionBound extends AstNode {
    kind: SyntaxKind.DimensionBound;
    bound1: Bound;
    bound2: Bound;
}
export interface Dimensions extends AstNode {
    kind: SyntaxKind.Dimensions;
    dimensions: DimensionBound[];
}
export interface DimensionsDataAttribute extends AstNode {
    kind: SyntaxKind.DimensionsDataAttribute;
    dimensions: Dimensions;
}
export interface DisplayStatement extends AstNode {
    kind: SyntaxKind.DisplayStatement;
    expression: Expression;
    reply: LocatorCall;
    rout: string[];
    desc: string[];
}
export interface DoSpecification extends AstNode {
    kind: SyntaxKind.DoSpecification;
    exp1: Expression;
    upthru: Expression;
    downthru: Expression;
    repeat: Expression;
    whileOrUntil: DoWhile | DoUntil;
    to: Expression;
    by: Expression;
}
export interface DoStatement extends AstNode {
    kind: SyntaxKind.DoStatement;
    statements: Statement[];
    end: EndStatement;
    doType2: DoType2;
    doType3: DoType3;
}
export interface DoType3 extends AstNode {
    kind: SyntaxKind.DoType3;
    variable: DoType3Variable;
    specifications: DoSpecification[];
}
export interface DoType3Variable extends AstNode {
    kind: SyntaxKind.DoType3Variable;
    name: string;
}
export interface DoUntil extends AstNode {
    kind: SyntaxKind.DoUntil;
    until: Expression;
    while: Expression;
}
export interface DoWhile extends AstNode {
    kind: SyntaxKind.DoWhile;
    while: Expression;
    until: Expression;
}
export interface EFormatItem extends AstNode {
    kind: SyntaxKind.EFormatItem;
    fieldWidth: Expression;
    fractionalDigits: Expression;
    significantDigits: Expression;
}
export interface EndStatement extends AstNode {
    kind: SyntaxKind.EndStatement;
    labels: LabelPrefix[];
    label: LabelReference;
}
export interface EntryAttribute extends AstNode {
    kind: SyntaxKind.EntryAttribute;
    limited: 'LIMITED'[];
    attributes: EntryDescription[];
    options: Options[];
    variable: 'VARIABLE'[];
    returns: ReturnsOption[];
    environmentName: Expression[];
}
export interface EntryParameterDescription extends AstNode {
    kind: SyntaxKind.EntryParameterDescription;
    attributes: DeclarationAttribute[];
    star: boolean;
}
export interface EntryStatement extends AstNode {
    kind: SyntaxKind.EntryStatement;
    parameters: ProcedureParameter[];
    variable: 'VARIABLE'[];
    limited: 'LIMITED'[];
    returns: ReturnsOption[];
    options: Options[];
    environmentName: Expression[];
}
export interface EntryUnionDescription extends AstNode {
    kind: SyntaxKind.EntryUnionDescription;
    init: string;
    attributes: DeclarationAttribute[];
    prefixedAttributes: PrefixedAttribute[];
}
export interface EnvironmentAttribute extends AstNode {
    kind: SyntaxKind.EnvironmentAttribute;
    items: EnvironmentAttributeItem[];
}
export interface EnvironmentAttributeItem extends AstNode {
    kind: SyntaxKind.EnvironmentAttributeItem;
    environment: string;
    args: Expression[];
}
export interface ExecStatement extends AstNode {
    kind: SyntaxKind.ExecStatement;
    query: string;
}
export interface ExitStatement extends AstNode {
    kind: SyntaxKind.ExitStatement;
}
export interface Exports extends AstNode {
    kind: SyntaxKind.Exports;
    all: boolean;
    procedures: string[];
}
export interface FetchEntry extends AstNode {
    kind: SyntaxKind.FetchEntry;
    name: string;
    set: LocatorCall;
    title: Expression;
}
export interface FetchStatement extends AstNode {
    kind: SyntaxKind.FetchStatement;
    entries: FetchEntry[];
}
export interface FFormatItem extends AstNode {
    kind: SyntaxKind.FFormatItem;
    fieldWidth: Expression;
    fractionalDigits: Expression;
    scalingFactor: Expression;
}
export interface FileReferenceCondition extends AstNode {
    kind: SyntaxKind.FileReferenceCondition;
    keyword: 'ENDFILE' | 'ENDPAGE' | 'KEY' | 'NAME' | 'RECORD' | 'TRANSMIT' | 'UNDEFINEDFILE' | 'UNDF';
    fileReference: ReferenceItem;
}
export interface FlushStatement extends AstNode {
    kind: SyntaxKind.FlushStatement;
    file: LocatorCall | '*';
}
export interface FormatList extends AstNode {
    kind: SyntaxKind.FormatList;
    items: FormatListItem[];
}
export interface FormatListItem extends AstNode {
    kind: SyntaxKind.FormatListItem;
    level: FormatListItemLevel;
    item: FormatItem;
    list: FormatList;
}
export interface FormatListItemLevel extends AstNode {
    kind: SyntaxKind.FormatListItemLevel;
    level: string | Expression;
}
export interface FormatStatement extends AstNode {
    kind: SyntaxKind.FormatStatement;
    list: FormatList;
}
export interface FreeStatement extends AstNode {
    kind: SyntaxKind.FreeStatement;
    references: LocatorCall[];
}
export interface GetCopy extends AstNode {
    kind: SyntaxKind.GetCopy;
    copyReference: string;
}
export interface GetFile extends AstNode {
    kind: SyntaxKind.GetFile;
    file: Expression;
}
export interface GetFileStatement extends AstNode {
    kind: SyntaxKind.GetFileStatement;
    specifications: (GetFile | GetCopy | GetSkip | DataSpecificationOptions)[];
}
export interface GetSkip extends AstNode {
    kind: SyntaxKind.GetSkip;
    skipExpression: Expression;
}
export interface GetStringStatement extends AstNode {
    kind: SyntaxKind.GetStringStatement;
    expression: Expression;
    dataSpecification: DataSpecificationOptions;
}
export interface GFormatItem extends AstNode {
    kind: SyntaxKind.GFormatItem;
    fieldWidth: Expression;
}
export interface GoToStatement extends AstNode {
    kind: SyntaxKind.GoToStatement;
    label: LabelReference;
}
export interface HandleAttribute extends AstNode {
    kind: SyntaxKind.HandleAttribute;
    size: string;
    type: Reference<NamedType>;
}
export interface IfStatement extends AstNode {
    kind: SyntaxKind.IfStatement;
    expression: Expression;
    unit: Statement;
    else: Statement;
}
export interface IncludeDirective extends AstNode {
    kind: SyntaxKind.IncludeDirective;
    items: IncludeItem[];
}
export interface IncludeItem extends AstNode {
    kind: SyntaxKind.IncludeItem;
    file: string;
    ddname: boolean;
}
export interface InitAcrossExpression extends AstNode {
    kind: SyntaxKind.InitAcrossExpression;
    expressions: Expression[];
}
export interface InitialAttribute extends AstNode {
    kind: SyntaxKind.InitialAttribute;
    across: boolean;
    expressions: InitAcrossExpression[];
    direct: boolean;
    items: InitialAttributeItem[];
    call: boolean;
    procedureCall: ProcedureCall;
    to: boolean;
    content: InitialToContent;
}
export interface InitialAttributeItemStar extends AstNode {
    kind: SyntaxKind.InitialAttributeItemStar;
}
export interface InitialAttributeSpecification extends AstNode {
    kind: SyntaxKind.InitialAttributeSpecification;
    star: boolean;
    item: InitialAttributeSpecificationIteration;
    expression: Expression;
}
export interface InitialAttributeSpecificationIterationValue extends AstNode {
    kind: SyntaxKind.InitialAttributeSpecificationIterationValue;
    items: InitialAttributeItem[];
}
export interface InitialToContent extends AstNode {
    kind: SyntaxKind.InitialToContent;
    varying: Varying;
    type: CharType;
}
export interface IterateStatement extends AstNode {
    kind: SyntaxKind.IterateStatement;
    label: LabelReference;
}
export interface KeywordCondition extends AstNode {
    kind: SyntaxKind.KeywordCondition;
    keyword: 'ANYCONDITION' | 'ANYCOND' | 'AREA' | 'ASSERTION' | 'ATTENTION' | 'CONFORMANCE' | 'CONVERSION' | 'ERROR' | 'FINISH' | 'FIXEDOVERFLOW' | 'FOFL' | 'INVALIDOP' | 'OVERFLOW' | 'OFL' | 'SIZE' | 'STORAGE' | 'STRINGRANGE' | 'STRINGSIZE' | 'SUBSCRIPTRANGE' | 'UNDERFLOW' | 'UFL' | 'ZERODIVIDE' | 'ZDIV';
}
export interface LabelPrefix extends AstNode {
    kind: SyntaxKind.LabelPrefix;
    name: string;
}
export interface LabelReference extends AstNode {
    kind: SyntaxKind.LabelReference;
    label: Reference<LabelPrefix>;
}
export interface LeaveStatement extends AstNode {
    kind: SyntaxKind.LeaveStatement;
    label: LabelReference;
}
export interface LFormatItem extends AstNode {
    kind: SyntaxKind.LFormatItem;
}
export interface LikeAttribute extends AstNode {
    kind: SyntaxKind.LikeAttribute;
    reference: LocatorCall;
}
export interface LineDirective extends AstNode {
    kind: SyntaxKind.LineDirective;
    line: string;
    file: string;
}
export interface LineFormatItem extends AstNode {
    kind: SyntaxKind.LineFormatItem;
    lineNumber: Expression;
}
export interface LinkageOptionsItem extends AstNode {
    kind: SyntaxKind.LinkageOptionsItem;
    value: 'CDECL' | 'OPTLINK' | 'STDCALL' | 'SYSTEM';
}
export interface Literal extends AstNode {
    kind: SyntaxKind.Literal;
    multiplier: Parenthesis;
    value: LiteralValue;
}
export interface LocateStatement extends AstNode {
    kind: SyntaxKind.LocateStatement;
    variable: LocatorCall;
    arguments: (LocateStatementFile | LocateStatementSet | LocateStatementKeyFrom)[];
}
export interface LocateStatementFile extends AstNode {
    kind: SyntaxKind.LocateStatementFile;
    file: ReferenceItem;
}
export interface LocateStatementKeyFrom extends AstNode {
    kind: SyntaxKind.LocateStatementKeyFrom;
    keyfrom: Expression;
}
export interface LocateStatementSet extends AstNode {
    kind: SyntaxKind.LocateStatementSet;
    set: LocatorCall;
}
export interface LocatorCall extends AstNode {
    kind: SyntaxKind.LocatorCall;
    element: MemberCall;
    previous: LocatorCall;
    pointer: boolean;
    handle: boolean;
}
export interface MemberCall extends AstNode {
    kind: SyntaxKind.MemberCall;
    element: ReferenceItem;
    previous: MemberCall;
}
export interface NamedCondition extends AstNode {
    kind: SyntaxKind.NamedCondition;
    name: string;
}
export interface NoMapOptionsItem extends AstNode {
    kind: SyntaxKind.NoMapOptionsItem;
    type: 'NOMAP' | 'NOMAPIN' | 'NOMAPOUT';
    parameters: string[];
}
export interface NoPrintDirective extends AstNode {
    kind: SyntaxKind.NoPrintDirective;
}
export interface NoteDirective extends AstNode {
    kind: SyntaxKind.NoteDirective;
    message: Expression;
    code: Expression;
}
export interface NullStatement extends AstNode {
    kind: SyntaxKind.NullStatement;
}
export interface NumberLiteral extends AstNode {
    kind: SyntaxKind.NumberLiteral;
    value: string;
}
export interface OnStatement extends AstNode {
    kind: SyntaxKind.OnStatement;
    conditions: Condition[];
    snap: boolean;
    system: boolean;
    onUnit: Statement;
}
export interface OpenOptionsAccess extends AstNode {
    kind: SyntaxKind.OpenOptionsAccess;
    input: boolean;
    output: boolean;
    update: boolean;
}
export interface OpenOptionsBuffering extends AstNode {
    kind: SyntaxKind.OpenOptionsBuffering;
    sequential: boolean;
    direct: boolean;
    unbuffered: boolean;
    buffered: boolean;
}
export interface OpenOptionsFile extends AstNode {
    kind: SyntaxKind.OpenOptionsFile;
    file: ReferenceItem;
}
export interface OpenOptionsGroup extends AstNode {
    kind: SyntaxKind.OpenOptionsGroup;
    options: (OpenOptionsFile | OpenOptionsStream | OpenOptionsAccess | OpenOptionsBuffering | OpenOptionsKeyed | OpenOptionsPrint | OpenOptionsTitle | OpenOptionsLineSize | OpenOptionsPageSize)[];
}
export interface OpenOptionsKeyed extends AstNode {
    kind: SyntaxKind.OpenOptionsKeyed;
    keyed: boolean;
}
export interface OpenOptionsLineSize extends AstNode {
    kind: SyntaxKind.OpenOptionsLineSize;
    lineSize: Expression;
}
export interface OpenOptionsPageSize extends AstNode {
    kind: SyntaxKind.OpenOptionsPageSize;
    pageSize: Expression;
}
export interface OpenOptionsPrint extends AstNode {
    kind: SyntaxKind.OpenOptionsPrint;
    print: boolean;
}
export interface OpenOptionsStream extends AstNode {
    kind: SyntaxKind.OpenOptionsStream;
    stream: boolean;
    record: boolean;
}
export interface OpenOptionsTitle extends AstNode {
    kind: SyntaxKind.OpenOptionsTitle;
    title: Expression;
}
export interface OpenStatement extends AstNode {
    kind: SyntaxKind.OpenStatement;
    options: OpenOptionsGroup[];
}
export interface Options extends AstNode {
    kind: SyntaxKind.Options;
    items: OptionsItem[];
}
export interface OrdinalTypeAttribute extends AstNode {
    kind: SyntaxKind.OrdinalTypeAttribute;
    type: Reference<OrdinalType>;
    byvalue: boolean;
}
export interface OrdinalValue extends AstNode {
    kind: SyntaxKind.OrdinalValue;
    name: string;
    value: string;
}
export interface OrdinalValueList extends AstNode {
    kind: SyntaxKind.OrdinalValueList;
    members: OrdinalValue[];
}
export interface OtherwiseStatement extends AstNode {
    kind: SyntaxKind.OtherwiseStatement;
    unit: Statement;
}
export interface Package extends AstNode {
    kind: SyntaxKind.Package;
    exports: Exports;
    reserves: Reserves;
    options: Options;
    statements: Statement[];
    end: EndStatement;
}
export interface PageDirective extends AstNode {
    kind: SyntaxKind.PageDirective;
}
export interface PageFormatItem extends AstNode {
    kind: SyntaxKind.PageFormatItem;
}
export interface Parenthesis extends AstNode {
    kind: SyntaxKind.Parenthesis;
    value: Expression;
    do: DoType3;
}
export interface PFormatItem extends AstNode {
    kind: SyntaxKind.PFormatItem;
    specification: string;
}
export interface PictureAttribute extends AstNode {
    kind: SyntaxKind.PictureAttribute;
    picture: string;
}
export interface PliProgram extends AstNode {
    kind: SyntaxKind.PliProgram;
    statements: Statement[];
}
export interface PopDirective extends AstNode {
    kind: SyntaxKind.PopDirective;
}
export interface PrefixedAttribute extends AstNode {
    kind: SyntaxKind.PrefixedAttribute;
    level: string;
    attribute: DeclarationAttribute;
}
export interface PrintDirective extends AstNode {
    kind: SyntaxKind.PrintDirective;
}
export interface ProcedureCall extends AstNode {
    kind: SyntaxKind.ProcedureCall;
    procedure: Reference<ProcedureStatement>;
    args: (Expression | '*')[];
}
export interface ProcedureParameter extends AstNode {
    kind: SyntaxKind.ProcedureParameter;
    id: string;
}
export interface ProcedureStatement extends AstNode {
    kind: SyntaxKind.ProcedureStatement;
    xProc: boolean;
    parameters: ProcedureParameter[];
    statements: Statement[];
    returns: ReturnsOption[];
    options: Options[];
    recursive: 'RECURSIVE'[];
    order: ('ORDER' | 'REORDER')[];
    scope: ScopeAttribute[];
    end: EndStatement;
    environmentName: Expression[];
}
export interface ProcessDirective extends AstNode {
    kind: SyntaxKind.ProcessDirective;
    compilerOptions: CompilerOptions[];
}
export interface ProcincDirective extends AstNode {
    kind: SyntaxKind.ProcincDirective;
    datasetName: string;
}
export interface PushDirective extends AstNode {
    kind: SyntaxKind.PushDirective;
}
export interface PutFileStatement extends AstNode {
    kind: SyntaxKind.PutFileStatement;
    items: (PutItem | DataSpecificationOptions)[];
}
export interface PutItem extends AstNode {
    kind: SyntaxKind.PutItem;
    attribute: PutAttribute;
    expression: Expression;
}
export interface PutStringStatement extends AstNode {
    kind: SyntaxKind.PutStringStatement;
    stringExpression: Expression;
    dataSpecification: DataSpecificationOptions;
}
export interface QualifyStatement extends AstNode {
    kind: SyntaxKind.QualifyStatement;
    statements: Statement[];
    end: EndStatement;
}
export interface ReadStatement extends AstNode {
    kind: SyntaxKind.ReadStatement;
    arguments: (ReadStatementFile | ReadStatementIgnore | ReadStatementInto | ReadStatementSet | ReadStatementKey | ReadStatementKeyTo)[];
}
export interface ReadStatementFile extends AstNode {
    kind: SyntaxKind.ReadStatementFile;
    file: LocatorCall;
}
export interface ReadStatementIgnore extends AstNode {
    kind: SyntaxKind.ReadStatementIgnore;
    ignore: Expression;
}
export interface ReadStatementInto extends AstNode {
    kind: SyntaxKind.ReadStatementInto;
    intoRef: LocatorCall;
}
export interface ReadStatementKey extends AstNode {
    kind: SyntaxKind.ReadStatementKey;
    key: Expression;
}
export interface ReadStatementKeyTo extends AstNode {
    kind: SyntaxKind.ReadStatementKeyTo;
    keyto: LocatorCall;
}
export interface ReadStatementSet extends AstNode {
    kind: SyntaxKind.ReadStatementSet;
    set: LocatorCall;
}
export interface ReferenceItem extends AstNode {
    kind: SyntaxKind.ReferenceItem;
    ref: Reference<NamedElement>;
    dimensions: Dimensions;
}
export interface ReinitStatement extends AstNode {
    kind: SyntaxKind.ReinitStatement;
    reference: LocatorCall;
}
export interface ReleaseStatement extends AstNode {
    kind: SyntaxKind.ReleaseStatement;
    star: boolean;
    references: string[];
}
export interface Reserves extends AstNode {
    kind: SyntaxKind.Reserves;
    all: boolean;
    variables: string[];
}
export interface ResignalStatement extends AstNode {
    kind: SyntaxKind.ResignalStatement;
}
export interface ReturnsAttribute extends AstNode {
    kind: SyntaxKind.ReturnsAttribute;
    attrs: (ComputationDataAttribute | DateAttribute | ValueListAttribute | ValueRangeAttribute)[];
}
export interface ReturnsOption extends AstNode {
    kind: SyntaxKind.ReturnsOption;
    returnAttributes: DeclarationAttribute[];
}
export interface ReturnStatement extends AstNode {
    kind: SyntaxKind.ReturnStatement;
    expression: Expression;
}
export interface RevertStatement extends AstNode {
    kind: SyntaxKind.RevertStatement;
    conditions: Condition[];
}
export interface RewriteStatement extends AstNode {
    kind: SyntaxKind.RewriteStatement;
    arguments: (RewriteStatementFile | RewriteStatementFrom | RewriteStatementKey)[];
}
export interface RewriteStatementFile extends AstNode {
    kind: SyntaxKind.RewriteStatementFile;
    file: LocatorCall;
}
export interface RewriteStatementFrom extends AstNode {
    kind: SyntaxKind.RewriteStatementFrom;
    from: LocatorCall;
}
export interface RewriteStatementKey extends AstNode {
    kind: SyntaxKind.RewriteStatementKey;
    key: Expression;
}
export interface RFormatItem extends AstNode {
    kind: SyntaxKind.RFormatItem;
    labelReference: string;
}
export interface SelectStatement extends AstNode {
    kind: SyntaxKind.SelectStatement;
    on: Expression;
    statements: (WhenStatement | OtherwiseStatement)[];
    end: EndStatement;
}
export interface SignalStatement extends AstNode {
    kind: SyntaxKind.SignalStatement;
    condition: Condition[];
}
export interface SimpleOptionsItem extends AstNode {
    kind: SyntaxKind.SimpleOptionsItem;
    value: 'ORDER' | 'REORDER' | 'NOCHARGRAPHIC' | 'CHARGRAPHIC' | 'NOINLINE' | 'INLINE' | 'MAIN' | 'NOEXECOPS' | 'COBOL' | 'FORTRAN' | 'BYADDR' | 'BYVALUE' | 'DESCRIPTOR' | 'NODESCRIPTOR' | 'IRREDUCIBLE' | 'REDUCIBLE' | 'NORETURN' | 'REENTRANT' | 'FETCHABLE' | 'RENT' | 'AMODE31' | 'AMODE64' | 'DLLINTERNAL' | 'FROMALIEN' | 'RETCODE' | 'ASSEMBLER' | 'ASM' | 'WINMAIN' | 'INTER' | 'RECURSIVE';
}
export interface SkipDirective extends AstNode {
    kind: SyntaxKind.SkipDirective;
    lines: Expression;
}
export interface SkipFormatItem extends AstNode {
    kind: SyntaxKind.SkipFormatItem;
    skip: Expression;
}
export interface Statement extends AstNode {
    kind: SyntaxKind.Statement;
    condition: ConditionPrefix;
    labels: LabelPrefix[];
    value: Unit;
}
export interface StopStatement extends AstNode {
    kind: SyntaxKind.StopStatement;
}
export interface StringLiteral extends AstNode {
    kind: SyntaxKind.StringLiteral;
    value: string;
}
export interface SubStructure extends AstNode {
    kind: SyntaxKind.SubStructure;
    level: string;
    name: string;
    attributes: DeclarationAttribute[];
}
export interface TypeAttribute extends AstNode {
    kind: SyntaxKind.TypeAttribute;
    type: Reference<NamedType>;
}
export interface UnaryExpression extends AstNode {
    kind: SyntaxKind.UnaryExpression;
    op: '+' | '-' | '¬' | '^';
    expr: Expression;
}
export interface ValueAttribute extends AstNode {
    kind: SyntaxKind.ValueAttribute;
    value: Expression;
}
export interface ValueListAttribute extends AstNode {
    kind: SyntaxKind.ValueListAttribute;
    values: Expression[];
}
export interface ValueListFromAttribute extends AstNode {
    kind: SyntaxKind.ValueListFromAttribute;
    from: LocatorCall;
}
export interface ValueRangeAttribute extends AstNode {
    kind: SyntaxKind.ValueRangeAttribute;
    values: Expression[];
}
export interface VFormatItem extends AstNode {
    kind: SyntaxKind.VFormatItem;
}
export interface WaitStatement extends AstNode {
    kind: SyntaxKind.WaitStatement;
    task: LocatorCall;
}
export interface WhenStatement extends AstNode {
    kind: SyntaxKind.WhenStatement;
    conditions: Expression[];
    unit: Statement;
}
export interface WriteStatement extends AstNode {
    kind: SyntaxKind.WriteStatement;
    arguments: (WriteStatementFile | WriteStatementFrom | WriteStatementKeyFrom | WriteStatementKeyTo)[];
}
export interface WriteStatementFile extends AstNode {
    kind: SyntaxKind.WriteStatementFile;
    file: LocatorCall;
}
export interface WriteStatementFrom extends AstNode {
    kind: SyntaxKind.WriteStatementFrom;
    from: LocatorCall;
}
export interface WriteStatementKeyFrom extends AstNode {
    kind: SyntaxKind.WriteStatementKeyFrom;
    keyfrom: Expression;
}
export interface WriteStatementKeyTo extends AstNode {
    kind: SyntaxKind.WriteStatementKeyTo;
    keyto: LocatorCall;
}
export interface XFormatItem extends AstNode {
    kind: SyntaxKind.XFormatItem;
    width: Expression;
}
