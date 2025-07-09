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

import { Range } from "../language-server/types";
import { Token } from "../parser/tokens";

export enum SyntaxKind {
  // Preprocessor AST
  ActivateStatement,
  ActivateItem,
  DeactivateStatement,
  TokenStatement,
  // Normal AST
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
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  ComputationDataAttribute,
  ConditionPrefix,
  ConditionPrefixItem,
  DataSpecificationDataList,
  DataSpecificationDataListItem,
  DataSpecificationOptions,
  DateAttribute,
  DeclaredItem,
  WildcardItem,
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
  ExportsItem,
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
  GenericAttribute,
  GenericReference,
  GenericDescriptor,
  HandleAttribute,
  IfStatement,
  IncludeDirective,
  IncludeAltDirective,
  IncludeItem,
  IndForAttribute,
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
  LocateStatementOption,
  LocatorCall,
  MemberCall,
  NamedCondition,
  NoMapOptionsItem,
  NoPrintDirective,
  NoteDirective,
  NullStatement,
  NumberLiteral,
  OnStatement,
  OpenOptionsGroup,
  OpenOption,
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
  ProcedureCallArgs,
  ProcedureParameter,
  ProcedureStatement,
  ProcedureOrderOption,
  ProcedureRecursiveOption,
  ProcedureScopeOption,
  EnvironmentOption,
  ProcessDirective,
  ProcincDirective,
  PushDirective,
  PutFileStatement,
  PutItem,
  PutStringStatement,
  QualifyStatement,
  ReadStatement,
  ReadStatementOption,
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
  RewriteStatementOption,
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
  WriteStatementOption,
  XFormatItem,
}

export interface AstNode {
  container: SyntaxNode | null;
  kind: SyntaxKind;
}

export interface Reference<T extends SyntaxNode = SyntaxNode> {
  owner: SyntaxNode;
  text: string;
  token: Token;
  node: T | null | undefined;
  preprocessor: boolean;
}

export function createReference<T extends SyntaxNode>(
  owner: SyntaxNode,
  token: Token,
  preprocessor = false,
): Reference<T> {
  return {
    owner,
    text: token.image,
    token,
    node: undefined,
    preprocessor,
  };
}

export type Wildcard<T> = T | "*";

export type SyntaxNode =
  // Preprocessor nodes
  | ActivateStatement
  | ActivateItem
  | DeactivateStatement
  | TokenStatement
  // Normal nodes
  | AFormatItem
  | AllocateDimension
  | AllocatedVariable
  | AllocateLocationReferenceIn
  | AllocateLocationReferenceSet
  | AllocateStatement
  | AllocateType
  | AssertStatement
  | AssignmentStatement
  | AttachStatement
  | BeginStatement
  | BFormatItem
  | BinaryExpression
  | Bound
  | CallStatement
  | CancelThreadStatement
  | CFormatItem
  | CloseStatement
  | CMPATOptionsItem
  | ColumnFormatItem
  | CompilerOptions
  | CompilerOption
  | CompilerOptionString
  | CompilerOptionText
  | ComputationDataAttribute
  | ConditionPrefix
  | ConditionPrefixItem
  | DataSpecificationDataList
  | DataSpecificationDataListItem
  | DataSpecificationOptions
  | DateAttribute
  | DeclaredItem
  | WildcardItem
  | DeclaredVariable
  | DeclareStatement
  | DefaultAttributeExpression
  | DefaultAttributeExpressionNot
  | DefaultExpression
  | DefaultExpressionPart
  | DefaultRangeIdentifierItem
  | DefaultRangeIdentifiers
  | DefaultStatement
  | DefaultValueAttribute
  | DefaultValueAttributeItem
  | DefineAliasStatement
  | DefinedAttribute
  | DefineOrdinalStatement
  | DefineStructureStatement
  | DelayStatement
  | DeleteStatement
  | DetachStatement
  | DimensionBound
  | Dimensions
  | DimensionsDataAttribute
  | DisplayStatement
  | DoSpecification
  | DoStatement
  | DoType3
  | DoUntil
  | DoWhile
  | EFormatItem
  | EndStatement
  | EntryAttribute
  | EntryParameterDescription
  | EntryStatement
  | EntryUnionDescription
  | EnvironmentAttribute
  | EnvironmentAttributeItem
  | ExecStatement
  | ExitStatement
  | Exports
  | ExportsItem
  | FetchEntry
  | FetchStatement
  | FFormatItem
  | FileReferenceCondition
  | FlushStatement
  | FormatList
  | FormatListItem
  | FormatListItemLevel
  | FormatStatement
  | FreeStatement
  | GetCopy
  | GetFile
  | GetFileStatement
  | GetSkip
  | GetStringStatement
  | GFormatItem
  | GoToStatement
  | GenericAttribute
  | GenericReference
  | GenericDescriptor
  | HandleAttribute
  | IfStatement
  | IncludeDirective
  | IncludeAltDirective
  | IncludeItem
  | IndForAttribute
  | InitAcrossExpression
  | InitialAttribute
  | InitialAttributeItemStar
  | InitialAttributeSpecification
  | InitialAttributeSpecificationIterationValue
  | InitialToContent
  | IterateStatement
  | KeywordCondition
  | LabelPrefix
  | LabelReference
  | LeaveStatement
  | LFormatItem
  | LikeAttribute
  | LineDirective
  | LineFormatItem
  | LinkageOptionsItem
  | Literal
  | LocateStatement
  | LocateStatementOption
  | LocatorCall
  | MemberCall
  | NamedCondition
  | NoMapOptionsItem
  | NoPrintDirective
  | NoteDirective
  | NullStatement
  | NumberLiteral
  | OnStatement
  | OpenOptionsGroup
  | OpenOption
  | OpenStatement
  | Options
  | OrdinalTypeAttribute
  | OrdinalValue
  | OrdinalValueList
  | OtherwiseStatement
  | Package
  | PageDirective
  | PageFormatItem
  | Parenthesis
  | PFormatItem
  | PictureAttribute
  | PliProgram
  | PopDirective
  | PrefixedAttribute
  | PrintDirective
  | ProcedureCall
  | ProcedureCallArgs
  | ProcedureParameter
  | ProcedureStatement
  | ProcessDirective
  | ProcincDirective
  | PushDirective
  | PutFileStatement
  | PutItem
  | PutStringStatement
  | QualifyStatement
  | ReadStatement
  | ReadStatementOption
  | ReferenceItem
  | ReinitStatement
  | ReleaseStatement
  | Reserves
  | ResignalStatement
  | ReturnsAttribute
  | ReturnsOption
  | ReturnStatement
  | RevertStatement
  | RewriteStatement
  | RewriteStatementOption
  | RFormatItem
  | SelectStatement
  | SignalStatement
  | SimpleOptionsItem
  | SkipDirective
  | SkipFormatItem
  | Statement
  | StopStatement
  | StringLiteral
  | SubStructure
  | TypeAttribute
  | UnaryExpression
  | ValueAttribute
  | ValueListAttribute
  | ValueListFromAttribute
  | ValueRangeAttribute
  | VFormatItem
  | WaitStatement
  | WhenStatement
  | WriteStatement
  | WriteStatementOption
  | XFormatItem
  | EnvironmentOption
  | ProcedureOrderOption
  | ProcedureRecursiveOption
  | ProcedureScopeOption;

export type AllocateAttribute =
  | AllocateDimension
  | AllocateLocationReferenceIn
  | AllocateLocationReferenceSet
  | AllocateType
  | InitialAttribute;
export type AllocateAttributeType =
  | "AREA"
  | "BIT"
  | "CHAR"
  | "CHARACTER"
  | "GRAPHIC"
  | "UCHAR"
  | "WIDECHAR";
export type AssignmentOperator =
  | "&="
  | "**="
  | "*="
  | "+="
  | "-="
  | "/="
  | "<>"
  | "="
  | "^="
  | "|="
  | "||="
  | "¬=";
export type CharType = "CHAR" | "UCHAR" | "WCHAR";
export type Condition =
  | FileReferenceCondition
  | KeywordCondition
  | NamedCondition;
export type DataAttributeType = DefaultAttribute;
export type CommonDeclarationAttribute =
  | ComputationDataAttribute
  | DateAttribute
  | DefinedAttribute
  | DimensionsDataAttribute
  | EntryAttribute
  | EnvironmentAttribute
  | HandleAttribute
  | InitialAttribute
  | LikeAttribute
  | OrdinalTypeAttribute
  | PictureAttribute
  | ReturnsAttribute
  | TypeAttribute
  | ValueListAttribute
  | ValueListFromAttribute
  | ValueRangeAttribute
  | GenericAttribute
  | IndForAttribute;
export type ScanMode = "SCAN" | "RESCAN" | "NOSCAN";
/**
 * A list of all the possible attributes that can be used in a defaiöt exüressopm.
 * This is essentially a list of all attributes that can be used in a common declaration + the DEFAULT VALUE attribute.
 */
export type DefaultDeclarationAttribute =
  | CommonDeclarationAttribute
  | DefaultValueAttribute;
/**
 * A list of all the possible attributes that can be used in a declaration.
 * This is essentially a list of all attributes that can be used in a common declaration + the VALUE attribute.
 */
export type DeclarationAttribute = CommonDeclarationAttribute | ValueAttribute;
export type DefaultAttribute =
  | ScanMode
  | "ABNORMAL"
  | "ALIGNED"
  | "AREA"
  | "ASSIGNABLE"
  | "AUTOMATIC"
  | "BACKWARDS"
  | "BASED"
  | "BIGENDIAN"
  | "BIN"
  | "BINARY"
  | "BIT"
  | "BUFFERED"
  | "BUILTIN"
  | "BYADDR"
  | "BYVALUE"
  | "CHAR"
  | "CHARACTER"
  | "COMPLEX"
  | "CONDITION"
  | "CONNECTED"
  | "CONSTANT"
  | "CONTROLLED"
  | "CTL"
  | "DEC"
  | "DECIMAL"
  | "DIMACROSS"
  | "EVENT"
  | "EXCLUSIVE"
  | "EXT"
  | "EXTERNAL"
  | "FILE"
  | "FIXED"
  | "FLOAT"
  | "FORMAT"
  | "GENERIC"
  | "GRAPHIC"
  | "HEX"
  | "HEXADEC"
  | "IEEE"
  | "INONLY"
  | "INOUT"
  | "INPUT"
  | "INT"
  | "INTERNAL"
  | "IRREDUCIBLE"
  | "KEYED"
  | "LABEL"
  | "LIST"
  | "LITTLEENDIAN"
  | "MEMBER"
  | "NATIVE"
  | "NONASGN"
  | "NONASSIGNABLE"
  | "NONCONNECTED"
  | "NONNATIVE"
  | "NONVARYING"
  | "NORMAL"
  | "NOINIT"
  | "NULLINIT"
  | "OFFSET"
  | "OPTIONAL"
  | "OPTIONS"
  | "OUTONLY"
  | "OUTPUT"
  | "PARAMETER"
  | "POINTER"
  | "POSITION"
  | "PREC"
  | "PRECISION"
  | "PRINT"
  | "PTR"
  | "RANGE"
  | "REAL"
  | "RECORD"
  | "RESERVED"
  | "SEQUENTIAL"
  | "SIGNED"
  | "STATIC"
  | "STREAM"
  | "STRUCTURE"
  | "TASK"
  | "TRANSIENT"
  | "UCHAR"
  | "UNAL"
  | "UNALIGNED"
  | "UNBUFFERED"
  | "UNION"
  | "UNSIGNED"
  | "UPDATE"
  | "VAR"
  | "VARIABLE"
  | "VARYING"
  | "VARYING4"
  | "VARYINGZ"
  | "VARZ"
  | "WIDECHAR";
export type DoType2 = DoUntil | DoWhile;
export type EntryDescription =
  | EntryParameterDescription
  | EntryUnionDescription;
export type Expression =
  | BinaryExpression
  | Literal
  | LocatorCall
  | Parenthesis
  | UnaryExpression;
export type FormatItem =
  | AFormatItem
  | BFormatItem
  | CFormatItem
  | ColumnFormatItem
  | EFormatItem
  | FFormatItem
  | GFormatItem
  | LFormatItem
  | LineFormatItem
  | PFormatItem
  | PageFormatItem
  | RFormatItem
  | SkipFormatItem
  | VFormatItem
  | XFormatItem;
export type FQN = string;
export type GetStatement = GetFileStatement | GetStringStatement;
export type InitialAttributeItem =
  | InitialAttributeItemStar
  | InitialAttributeSpecification;
export type InitialAttributeSpecificationIteration =
  | InitialAttributeItemStar
  | InitialAttributeSpecificationIterationValue;
export type LiteralValue = NumberLiteral | StringLiteral;
export type NamedElement = DeclaredVariable | OrdinalValue | LabelPrefix;
export type NamedType = DefineAliasStatement;
export type OptionsItem =
  | CMPATOptionsItem
  | LinkageOptionsItem
  | NoMapOptionsItem
  | SimpleOptionsItem;
export type OrdinalType = DefineOrdinalStatement;
export type PutAttribute = "FILE" | "LINE" | "PAGE" | "SKIP";
export type PutStatement = PutFileStatement | PutStringStatement;
export type ScopeAttribute = "DYNAMIC" | "STATIC";
export type Unit =
  | AllocateStatement
  | AssertStatement
  | AssignmentStatement
  | AttachStatement
  | BeginStatement
  | CallStatement
  | CancelThreadStatement
  | CloseStatement
  | DeclareStatement
  | DefaultStatement
  | DefineAliasStatement
  | DefineOrdinalStatement
  | DefineStructureStatement
  | DelayStatement
  | DeleteStatement
  | DetachStatement
  | DisplayStatement
  | DoStatement
  | EntryStatement
  | ExecStatement
  | ExitStatement
  | FetchStatement
  | FlushStatement
  | FormatStatement
  | FreeStatement
  | GetStatement
  | GoToStatement
  | IfStatement
  | IterateStatement
  | LeaveStatement
  | LineDirective
  | LocateStatement
  | NoteDirective
  | NullStatement
  | OnStatement
  | OpenStatement
  | Package
  | ProcedureStatement
  | PutStatement
  | QualifyStatement
  | ReadStatement
  | ReinitStatement
  | ReleaseStatement
  | ResignalStatement
  | ReturnStatement
  | RevertStatement
  | RewriteStatement
  | SelectStatement
  | SignalStatement
  | StopStatement
  | WaitStatement
  | WriteStatement
  // Exclusive to preprocessor
  | TokenStatement
  | IncludeDirective
  | IncludeAltDirective
  | ActivateStatement
  | DeactivateStatement
  | ProcessDirective
  | ProcincDirective
  | PushDirective
  | PageDirective
  | PopDirective
  | PrintDirective
  | NoPrintDirective
  | SkipDirective;
export type Varying = "NONVARYING" | "VARYING" | "VARYING4" | "VARYINGZ";

// Preprocessor AST

export interface ActivateStatement extends AstNode {
  kind: SyntaxKind.ActivateStatement;
  items: ActivateItem[];
}

export function createActivateStatement(): ActivateStatement {
  return {
    kind: SyntaxKind.ActivateStatement,
    container: null,
    items: [],
  };
}

export interface ActivateItem extends AstNode {
  kind: SyntaxKind.ActivateItem;
  reference: ReferenceItem | null;
  scanMode: ScanMode | null;
}

export function createActivateItem(): ActivateItem {
  return {
    kind: SyntaxKind.ActivateItem,
    container: null,
    reference: null,
    scanMode: null,
  };
}

export interface DeactivateStatement extends AstNode {
  kind: SyntaxKind.DeactivateStatement;
  references: ReferenceItem[];
}

export function createDeactivateStatement(): DeactivateStatement {
  return {
    kind: SyntaxKind.DeactivateStatement,
    container: null,
    references: [],
  };
}

export interface TokenStatement extends AstNode {
  kind: SyntaxKind.TokenStatement;
  tokens: Token[];
}

export function createTokenStatement(): TokenStatement {
  return {
    kind: SyntaxKind.TokenStatement,
    container: null,
    tokens: [],
  };
}

// Normal PLI AST

export interface AFormatItem extends AstNode {
  kind: SyntaxKind.AFormatItem;
  fieldWidth: Expression | null;
}

export function createAFormatItem(): AFormatItem {
  return {
    kind: SyntaxKind.AFormatItem,
    container: null,
    fieldWidth: null,
  };
}

export interface AllocateDimension extends AstNode {
  kind: SyntaxKind.AllocateDimension;
  dimensions: Dimensions | null;
}
export interface AllocatedVariable extends AstNode {
  kind: SyntaxKind.AllocatedVariable;
  level: string | null;
  var: ReferenceItem | null;
  attribute: AllocateAttribute | null;
}
export interface AllocateLocationReferenceIn extends AstNode {
  kind: SyntaxKind.AllocateLocationReferenceIn;
  area: LocatorCall | null;
}
export interface AllocateLocationReferenceSet extends AstNode {
  kind: SyntaxKind.AllocateLocationReferenceSet;
  locatorVariable: LocatorCall | null;
}
export interface AllocateStatement extends AstNode {
  kind: SyntaxKind.AllocateStatement;
  variables: AllocatedVariable[];
}
export interface AllocateType extends AstNode {
  kind: SyntaxKind.AllocateType;
  type: AllocateAttributeType | null;
  dimensions: Dimensions | null;
}
export interface AssertStatement extends AstNode {
  kind: SyntaxKind.AssertStatement;
  true: boolean;
  actual: Expression | null;
  false: boolean;
  unreachable: boolean;
  displayExpression: Expression | null;
  compare: boolean;
  expected: Expression | null;
  operator: string | null;
}
export interface AssignmentStatement extends AstNode {
  kind: SyntaxKind.AssignmentStatement;
  refs: LocatorCall[];
  operator: AssignmentOperator | null;
  expression: Expression | null;
  dimacrossExpr: Expression | null;
}
export function createAssignmentStatement(): AssignmentStatement {
  return {
    kind: SyntaxKind.AssignmentStatement,
    container: null,
    refs: [],
    operator: null,
    expression: null,
    dimacrossExpr: null,
  };
}
export interface AttachStatement extends AstNode {
  kind: SyntaxKind.AttachStatement;
  reference: LocatorCall | null;
  task: LocatorCall | null;
  environment: boolean;
  tstack: Expression | null;
}
export interface BeginStatement extends AstNode {
  kind: SyntaxKind.BeginStatement;
  options: Options | null;
  recursive: boolean;
  statements: Statement[];
  end: EndStatement | null;
  order: boolean;
  reorder: boolean;
}
export interface BFormatItem extends AstNode {
  kind: SyntaxKind.BFormatItem;
  fieldWidth: Expression | null;
}
export interface BinaryExpression extends AstNode {
  kind: SyntaxKind.BinaryExpression;
  left: Expression | null;
  right: Expression | null;
  op:
    | "^="
    | "<>"
    | "^<"
    | "<="
    | ">="
    | "^>"
    | "<="
    | "||"
    | "**"
    | "*"
    | "="
    | "|"
    | "^"
    | "&"
    | "<"
    | ">"
    | "+"
    | "-"
    | "/"
    | null;
}
export interface Bound extends AstNode {
  kind: SyntaxKind.Bound;
  expression: Wildcard<Expression> | null;
  refer: LocatorCall | null;
}
export function createBound(): Bound {
  return {
    kind: SyntaxKind.Bound,
    container: null,
    expression: null,
    refer: null,
  };
}
export interface CallStatement extends AstNode {
  kind: SyntaxKind.CallStatement;
  call: ProcedureCall | null;
}
export interface CancelThreadStatement extends AstNode {
  kind: SyntaxKind.CancelThreadStatement;
  thread: LocatorCall | null;
}
export interface CFormatItem extends AstNode {
  kind: SyntaxKind.CFormatItem;
  item: FFormatItem | EFormatItem | PFormatItem | null;
}
export interface CloseStatement extends AstNode {
  kind: SyntaxKind.CloseStatement;
  files: Wildcard<MemberCall>[];
}
export interface CMPATOptionsItem extends AstNode {
  kind: SyntaxKind.CMPATOptionsItem;
  value: "V1" | "V2" | "V3" | null;
}
export interface ColumnFormatItem extends AstNode {
  kind: SyntaxKind.ColumnFormatItem;
  characterPosition: Expression | null;
}
export interface CompilerOptions extends AstNode {
  kind: SyntaxKind.CompilerOptions;
  value: "TODO" | null;
}

export type CompilerOptionValue =
  | CompilerOption
  | CompilerOptionString
  | CompilerOptionText;

export interface CompilerOption extends AstNode {
  kind: SyntaxKind.CompilerOption;
  name: string;
  token: Token;
  values: CompilerOptionValue[];
}

export interface CompilerOptionString extends AstNode {
  kind: SyntaxKind.CompilerOptionString;
  token: Token;
  value: string;
}

export interface CompilerOptionText extends AstNode {
  kind: SyntaxKind.CompilerOptionText;
  token: Token;
  value: string;
}

export interface ComputationDataAttribute extends AstNode {
  kind: SyntaxKind.ComputationDataAttribute;
  type: DataAttributeType | null;
  dimensions: Dimensions | null;
}
export function createComputationDataAttribute(): ComputationDataAttribute {
  return {
    kind: SyntaxKind.ComputationDataAttribute,
    container: null,
    type: null,
    dimensions: null,
  };
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
  value: Expression | null;
}
export interface DataSpecificationOptions extends AstNode {
  kind: SyntaxKind.DataSpecificationOptions;
  dataList: DataSpecificationDataList | null;
  edit: boolean;
  dataLists: DataSpecificationDataList[];
  formatLists: FormatList[];
  data: boolean;
  dataListItems: DataSpecificationDataListItem[];
}
export interface DateAttribute extends AstNode {
  kind: SyntaxKind.DateAttribute;
  pattern: string | null;
}
export interface WildcardItem extends AstNode {
  kind: SyntaxKind.WildcardItem;
  token: Token | null;
}
export type DeclaredItemElement =
  | DeclaredVariable
  | DeclaredItem
  | WildcardItem;
export interface DeclaredItem extends AstNode {
  kind: SyntaxKind.DeclaredItem;
  level: number | null;
  elements: DeclaredItemElement[];
  levelToken: Token | null;
  attributes: DeclarationAttribute[];
}
export function createDeclaredItem(): DeclaredItem {
  return {
    kind: SyntaxKind.DeclaredItem,
    container: null,
    level: null,
    levelToken: null,
    elements: [],
    attributes: [],
  };
}
export interface DeclaredVariable extends AstNode {
  kind: SyntaxKind.DeclaredVariable;
  nameToken: Token | null;
  name: string | null;
}
export function createDeclaredVariable(): DeclaredVariable {
  return {
    kind: SyntaxKind.DeclaredVariable,
    container: null,
    nameToken: null,
    name: null,
  };
}
export interface DeclareStatement extends AstNode {
  kind: SyntaxKind.DeclareStatement;
  items: DeclaredItem[];
  xDeclare: boolean;
}
export function createDeclareStatement(): DeclareStatement {
  return {
    kind: SyntaxKind.DeclareStatement,
    container: null,
    items: [],
    xDeclare: false,
  };
}
export interface DefaultAttributeExpression extends AstNode {
  kind: SyntaxKind.DefaultAttributeExpression;
  items: DefaultAttributeExpressionNot[];
  operators: ("AND" | "OR")[];
}
export interface DefaultAttributeExpressionNot extends AstNode {
  kind: SyntaxKind.DefaultAttributeExpressionNot;
  not: boolean;
  value: DefaultAttribute | null;
}
export interface DefaultExpression extends AstNode {
  kind: SyntaxKind.DefaultExpression;
  expression: DefaultExpressionPart | null;
  attributes: DefaultDeclarationAttribute[];
}
export interface DefaultExpressionPart extends AstNode {
  kind: SyntaxKind.DefaultExpressionPart;
  expression: DefaultAttributeExpression | null;
  identifiers: DefaultRangeIdentifiers | null;
}
export interface DefaultRangeIdentifierItem extends AstNode {
  kind: SyntaxKind.DefaultRangeIdentifierItem;
  from: string | null;
  to: string | null;
}
export interface DefaultRangeIdentifiers extends AstNode {
  kind: SyntaxKind.DefaultRangeIdentifiers;
  identifiers: Wildcard<DefaultRangeIdentifierItem>[];
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
  name: string | null;
  xDefine: boolean;
  attributes: DeclarationAttribute[];
}
export interface DefinedAttribute extends AstNode {
  kind: SyntaxKind.DefinedAttribute;
  reference: MemberCall | null;
  position: Expression | null;
}
export interface DefineOrdinalStatement extends AstNode {
  kind: SyntaxKind.DefineOrdinalStatement;
  name: FQN | null;
  ordinalValues: OrdinalValueList | null;
  xDefine: boolean;
  attributes: ("SIGNED" | "UNSIGNED" | "PRECISION" | "PREC")[];
  precision: string | null;
}
export interface DefineStructureStatement extends AstNode {
  kind: SyntaxKind.DefineStructureStatement;
  xDefine: boolean;
  level: string | null;
  name: FQN | null;
  union: boolean;
  substructures: SubStructure[];
}
export interface DelayStatement extends AstNode {
  kind: SyntaxKind.DelayStatement;
  delay: Expression | null;
}
export interface DeleteStatement extends AstNode {
  kind: SyntaxKind.DeleteStatement;
  file: LocatorCall | null;
  key: Expression | null;
}
export interface DetachStatement extends AstNode {
  kind: SyntaxKind.DetachStatement;
  reference: LocatorCall | null;
}
export interface DimensionBound extends AstNode {
  kind: SyntaxKind.DimensionBound;
  /**
   * Contains the lower bound of the dimension.
   * In most cases, this will be null, as the lower bound is usually 1.
   * However, it can be set to a different value in the source code.
   * PLI declarations like `VAR(3:5)` will have a lower bound of 3.
   * If this is part of a variable reference,
   * the lower and upper bound will indicate a slice of the array
   */
  lower: Bound | null;
  /**
   * Contains the upper bound of the dimension.
   * It can never be null, unless a parser error occurs.
   */
  upper: Bound | null;
}
export function createDimensionBound(): DimensionBound {
  return {
    kind: SyntaxKind.DimensionBound,
    container: null,
    lower: null,
    upper: null,
  };
}
export interface Dimensions extends AstNode {
  kind: SyntaxKind.Dimensions;
  dimensions: DimensionBound[];
}
export function createDimensions(): Dimensions {
  return {
    kind: SyntaxKind.Dimensions,
    container: null,
    dimensions: [],
  };
}
export interface DimensionsDataAttribute extends AstNode {
  kind: SyntaxKind.DimensionsDataAttribute;
  dimensions: Dimensions | null;
}
export function createDimensionsDataAttribute(): DimensionsDataAttribute {
  return {
    kind: SyntaxKind.DimensionsDataAttribute,
    container: null,
    dimensions: null,
  };
}
export interface DisplayStatement extends AstNode {
  kind: SyntaxKind.DisplayStatement;
  expression: Expression | null;
  reply: LocatorCall | null;
  rout: string[];
  desc: string[];
}
export interface DoSpecification extends AstNode {
  kind: SyntaxKind.DoSpecification;
  expression: Expression | null;
  upthru: Expression | null;
  downthru: Expression | null;
  repeat: Expression | null;
  whileOrUntil: DoWhile | DoUntil | null;
  to: Expression | null;
  by: Expression | null;
}
export interface DoStatement extends AstNode {
  kind: SyntaxKind.DoStatement;
  statements: Statement[];
  end: EndStatement | null;
  doType2: DoType2 | null;
  doType3: DoType3 | null;
  doType4: boolean;
}
export function createDoStatement(): DoStatement {
  return {
    kind: SyntaxKind.DoStatement,
    container: null,
    statements: [],
    end: null,
    doType2: null,
    doType3: null,
    doType4: false,
  };
}
export interface DoType3 extends AstNode {
  kind: SyntaxKind.DoType3;
  variable: ReferenceItem | null;
  specifications: DoSpecification[];
}
export function createDoType3(): DoType3 {
  return {
    kind: SyntaxKind.DoType3,
    container: null,
    variable: null,
    specifications: [],
  };
}
export interface DoUntil extends AstNode {
  kind: SyntaxKind.DoUntil;
  until: Expression | null;
  while: Expression | null;
}
export function createDoUntil(): DoUntil {
  return {
    kind: SyntaxKind.DoUntil,
    container: null,
    until: null,
    while: null,
  };
}
export interface DoWhile extends AstNode {
  kind: SyntaxKind.DoWhile;
  while: Expression | null;
  until: Expression | null;
}
export function createDoWhile(): DoWhile {
  return {
    kind: SyntaxKind.DoWhile,
    container: null,
    while: null,
    until: null,
  };
}
export interface EFormatItem extends AstNode {
  kind: SyntaxKind.EFormatItem;
  fieldWidth: Expression | null;
  fractionalDigits: Expression | null;
  significantDigits: Expression | null;
}
export interface EndStatement extends AstNode {
  kind: SyntaxKind.EndStatement;
  labels: LabelPrefix[];
  label: LabelReference | null;
}
export interface EntryAttribute extends AstNode {
  kind: SyntaxKind.EntryAttribute;
  limited: "LIMITED"[];
  attributes: EntryDescription[];
  options: Options[];
  variable: "VARIABLE"[];
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
  variable: "VARIABLE"[];
  limited: "LIMITED"[];
  returns: ReturnsOption[];
  options: Options[];
  environmentName: EnvironmentOption[];
}
export interface EntryUnionDescription extends AstNode {
  kind: SyntaxKind.EntryUnionDescription;
  init: string | null;
  attributes: DeclarationAttribute[];
  prefixedAttributes: PrefixedAttribute[];
}
export interface EnvironmentAttribute extends AstNode {
  kind: SyntaxKind.EnvironmentAttribute;
  items: EnvironmentAttributeItem[];
}
export interface EnvironmentAttributeItem extends AstNode {
  kind: SyntaxKind.EnvironmentAttributeItem;
  environment: string | null;
  args: Expression[];
}
export interface ExecStatement extends AstNode {
  kind: SyntaxKind.ExecStatement;
  query: string | null;
}
export interface ExitStatement extends AstNode {
  kind: SyntaxKind.ExitStatement;
}
export interface ExportsItem extends AstNode {
  kind: SyntaxKind.ExportsItem;
  reference: Reference<ProcedureStatement> | null;
}
export interface Exports extends AstNode {
  kind: SyntaxKind.Exports;
  all: boolean;
  procedures: ExportsItem[];
}
export interface FetchEntry extends AstNode {
  kind: SyntaxKind.FetchEntry;
  entry: ReferenceItem | null;
  set: LocatorCall | null;
  title: Expression | null;
}
export interface FetchStatement extends AstNode {
  kind: SyntaxKind.FetchStatement;
  entries: FetchEntry[];
}
export interface FFormatItem extends AstNode {
  kind: SyntaxKind.FFormatItem;
  fieldWidth: Expression | null;
  fractionalDigits: Expression | null;
  scalingFactor: Expression | null;
}
export interface FileReferenceCondition extends AstNode {
  kind: SyntaxKind.FileReferenceCondition;
  keyword:
    | "ENDFILE"
    | "ENDPAGE"
    | "KEY"
    | "NAME"
    | "RECORD"
    | "TRANSMIT"
    | "UNDEFINEDFILE"
    | "UNDF"
    | null;
  fileReference: ReferenceItem | null;
}
export interface FlushStatement extends AstNode {
  kind: SyntaxKind.FlushStatement;
  file: Wildcard<LocatorCall> | null;
}
export interface FormatList extends AstNode {
  kind: SyntaxKind.FormatList;
  items: FormatListItem[];
}
export interface FormatListItem extends AstNode {
  kind: SyntaxKind.FormatListItem;
  level: FormatListItemLevel | null;
  item: FormatItem | null;
  list: FormatList | null;
}
export interface FormatListItemLevel extends AstNode {
  kind: SyntaxKind.FormatListItemLevel;
  level: string | Expression | null;
}
export interface FormatStatement extends AstNode {
  kind: SyntaxKind.FormatStatement;
  list: FormatList | null;
}
export interface FreeStatement extends AstNode {
  kind: SyntaxKind.FreeStatement;
  references: LocatorCall[];
}
export interface GetCopy extends AstNode {
  kind: SyntaxKind.GetCopy;
  copyReference: string | null;
}
export interface GetFile extends AstNode {
  kind: SyntaxKind.GetFile;
  file: Expression | null;
}
export interface GetFileStatement extends AstNode {
  kind: SyntaxKind.GetFileStatement;
  specifications: (GetFile | GetCopy | GetSkip | DataSpecificationOptions)[];
}
export interface GetSkip extends AstNode {
  kind: SyntaxKind.GetSkip;
  skipExpression: Expression | null;
}
export interface GetStringStatement extends AstNode {
  kind: SyntaxKind.GetStringStatement;
  expression: Expression | null;
  dataSpecification: DataSpecificationOptions | null;
}
export interface GFormatItem extends AstNode {
  kind: SyntaxKind.GFormatItem;
  fieldWidth: Expression | null;
}
export interface GoToStatement extends AstNode {
  kind: SyntaxKind.GoToStatement;
  label: LabelReference | null;
}
export function createGoToStatement(): GoToStatement {
  return {
    kind: SyntaxKind.GoToStatement,
    container: null,
    label: null,
  };
}
export interface GenericAttribute extends AstNode {
  kind: SyntaxKind.GenericAttribute;
  references: GenericReference[];
}
export interface GenericReference extends AstNode {
  kind: SyntaxKind.GenericReference;
  entry: ReferenceItem | null;
  otherwise: boolean;
  descriptors: Wildcard<GenericDescriptor>[];
}
export interface GenericDescriptor extends AstNode {
  kind: SyntaxKind.GenericDescriptor;
  attributes: DeclarationAttribute[];
}
export interface HandleAttribute extends AstNode {
  kind: SyntaxKind.HandleAttribute;
  size: string | null;
  type: Reference<NamedType> | null;
}
export interface IfStatement extends AstNode {
  kind: SyntaxKind.IfStatement;
  expression: Expression | null;
  unit: Statement | null;
  else: Statement | null;
  unitRange: Range | null;
  elseRange: Range | null;
}
export function createIfStatement(): IfStatement {
  return {
    kind: SyntaxKind.IfStatement,
    container: null,
    expression: null,
    unit: null,
    else: null,
    unitRange: null,
    elseRange: null,
  };
}
export interface IncludeDirective extends AstNode {
  kind: SyntaxKind.IncludeDirective;
  xInclude: boolean;
  token: Token | null;
  items: IncludeItem[];
}
export function createIncludeDirective(): IncludeDirective {
  return {
    kind: SyntaxKind.IncludeDirective,
    container: null,
    token: null,
    xInclude: false,
    items: [],
  };
}
/**
 * @see https://www.ibm.com/docs/en/pli-for-aix/3.1.0?topic=preprocessors-include-preprocessor
 */
export interface IncludeAltDirective extends AstNode {
  kind: SyntaxKind.IncludeAltDirective;
  xInclude: boolean;
  token: Token | null;
  items: IncludeItem[];
}
export function createIncludeAltDirective(): IncludeAltDirective {
  return {
    kind: SyntaxKind.IncludeAltDirective,
    container: null,
    token: null,
    xInclude: false,
    items: [],
  };
}
export interface IncludeItem extends AstNode {
  kind: SyntaxKind.IncludeItem;
  fileName: string | null;
  string: boolean;
  ddname: string | null;
  filePath: string | null;
  token: Token | null;
}
export function createIncludeItem(): IncludeItem {
  return {
    kind: SyntaxKind.IncludeItem,
    container: null,
    fileName: null,
    string: false,
    ddname: null,
    filePath: null,
    token: null,
  };
}
export interface IndForAttribute extends AstNode {
  kind: SyntaxKind.IndForAttribute;
  reference: LocatorCall | null;
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
  procedureCall: ProcedureCall | null;
  to: boolean;
  content: InitialToContent | null;
}
export interface InitialAttributeItemStar extends AstNode {
  kind: SyntaxKind.InitialAttributeItemStar;
}
export interface InitialAttributeSpecification extends AstNode {
  kind: SyntaxKind.InitialAttributeSpecification;
  star: boolean;
  item: InitialAttributeSpecificationIteration | null;
  expression: Expression | null;
}
export interface InitialAttributeSpecificationIterationValue extends AstNode {
  kind: SyntaxKind.InitialAttributeSpecificationIterationValue;
  items: InitialAttributeItem[];
}
export interface InitialToContent extends AstNode {
  kind: SyntaxKind.InitialToContent;
  varying: Varying | null;
  type: CharType | null;
}
export interface IterateStatement extends AstNode {
  kind: SyntaxKind.IterateStatement;
  label: LabelReference | null;
}
export function createIterateStatement(): IterateStatement {
  return {
    kind: SyntaxKind.IterateStatement,
    container: null,
    label: null,
  };
}
export interface KeywordCondition extends AstNode {
  kind: SyntaxKind.KeywordCondition;
  keyword:
    | "ANYCONDITION"
    | "ANYCOND"
    | "AREA"
    | "ASSERTION"
    | "ATTENTION"
    | "CONFORMANCE"
    | "CONVERSION"
    | "ERROR"
    | "FINISH"
    | "FIXEDOVERFLOW"
    | "FOFL"
    | "INVALIDOP"
    | "OVERFLOW"
    | "OFL"
    | "SIZE"
    | "STORAGE"
    | "STRINGRANGE"
    | "STRINGSIZE"
    | "SUBSCRIPTRANGE"
    | "UNDERFLOW"
    | "UFL"
    | "ZERODIVIDE"
    | "ZDIV"
    | null;
}
export interface LabelPrefix extends AstNode {
  kind: SyntaxKind.LabelPrefix;
  nameToken: Token | null;
  name: string | null;
}
export function createLabelPrefix(): LabelPrefix {
  return {
    kind: SyntaxKind.LabelPrefix,
    container: null,
    nameToken: null,
    name: null,
  };
}
export interface LabelReference extends AstNode {
  kind: SyntaxKind.LabelReference;
  label: Reference<LabelPrefix> | null;
}
export function createLabelReference(): LabelReference {
  return {
    kind: SyntaxKind.LabelReference,
    container: null,
    label: null,
  };
}
export interface LeaveStatement extends AstNode {
  kind: SyntaxKind.LeaveStatement;
  label: LabelReference | null;
}
export function createLeaveStatement(): LeaveStatement {
  return {
    kind: SyntaxKind.LeaveStatement,
    container: null,
    label: null,
  };
}
export interface LFormatItem extends AstNode {
  kind: SyntaxKind.LFormatItem;
}
export interface LikeAttribute extends AstNode {
  kind: SyntaxKind.LikeAttribute;
  reference: LocatorCall | null;
}
export interface LineDirective extends AstNode {
  kind: SyntaxKind.LineDirective;
  line: string | null;
  file: string | null;
}
export interface LineFormatItem extends AstNode {
  kind: SyntaxKind.LineFormatItem;
  lineNumber: Expression | null;
}
export interface LinkageOptionsItem extends AstNode {
  kind: SyntaxKind.LinkageOptionsItem;
  value: "CDECL" | "OPTLINK" | "STDCALL" | "SYSTEM" | null;
}
export interface Literal extends AstNode {
  kind: SyntaxKind.Literal;
  multiplier: Parenthesis | null;
  value: LiteralValue | null;
}
export function createLiteral(): Literal {
  return {
    kind: SyntaxKind.Literal,
    container: null,
    multiplier: null,
    value: null,
  };
}
export interface LocateStatement extends AstNode {
  kind: SyntaxKind.LocateStatement;
  variable: LocatorCall | null;
  arguments: LocateStatementOption[];
}
export interface LocateStatementOption extends AstNode {
  kind: SyntaxKind.LocateStatementOption;
  type: "FILE" | "KEYFROM" | "SET" | null;
  element: Expression | null;
}
export interface LocatorCall extends AstNode {
  kind: SyntaxKind.LocatorCall;
  element: MemberCall | null;
  previous: LocatorCall | null;
  pointer: boolean;
  handle: boolean;
}
export function createLocatorCall(): LocatorCall {
  return {
    kind: SyntaxKind.LocatorCall,
    container: null,
    element: null,
    previous: null,
    pointer: false,
    handle: false,
  };
}
export interface MemberCall extends AstNode {
  kind: SyntaxKind.MemberCall;
  element: ReferenceItem | null;
  previous: MemberCall | null;
}
export function createMemberCall(): MemberCall {
  return {
    kind: SyntaxKind.MemberCall,
    container: null,
    element: null,
    previous: null,
  };
}
export interface NamedCondition extends AstNode {
  kind: SyntaxKind.NamedCondition;
  name: string | null;
}
export interface NoMapOptionsItem extends AstNode {
  kind: SyntaxKind.NoMapOptionsItem;
  type: "NOMAP" | "NOMAPIN" | "NOMAPOUT" | null;
  parameters: string[];
}
export interface NoPrintDirective extends AstNode {
  kind: SyntaxKind.NoPrintDirective;
}
export function createNoPrintDirective(): NoPrintDirective {
  return {
    kind: SyntaxKind.NoPrintDirective,
    container: null,
  };
}
export interface NoteDirective extends AstNode {
  kind: SyntaxKind.NoteDirective;
  message: Expression | null;
  code: Expression | null;
}
export interface NullStatement extends AstNode {
  kind: SyntaxKind.NullStatement;
}
export function createNullStatement(): NullStatement {
  return { kind: SyntaxKind.NullStatement, container: null };
}
export interface NumberLiteral extends AstNode {
  kind: SyntaxKind.NumberLiteral;
  value: string | null;
}
export function createNumberLiteral(): NumberLiteral {
  return {
    kind: SyntaxKind.NumberLiteral,
    container: null,
    value: null,
  };
}
export interface OnStatement extends AstNode {
  kind: SyntaxKind.OnStatement;
  conditions: Condition[];
  snap: boolean;
  system: boolean;
  onUnit: Statement | null;
}
export interface OpenOptionsGroup extends AstNode {
  kind: SyntaxKind.OpenOptionsGroup;
  options: OpenOption[];
}
export interface OpenOption extends AstNode {
  kind: SyntaxKind.OpenOption;
  option: string | null;
  expression: Expression | null;
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
  type: Reference<OrdinalType> | null;
  byvalue: boolean;
}
export interface OrdinalValue extends AstNode {
  kind: SyntaxKind.OrdinalValue;
  name: string | null;
  nameToken: Token | null;
  value: string | null;
}
export interface OrdinalValueList extends AstNode {
  kind: SyntaxKind.OrdinalValueList;
  members: OrdinalValue[];
}
export interface OtherwiseStatement extends AstNode {
  kind: SyntaxKind.OtherwiseStatement;
  unit: Statement | null;
}
export interface Package extends AstNode {
  kind: SyntaxKind.Package;
  exports: Exports | null;
  reserves: Reserves | null;
  options: Options | null;
  statements: Statement[];
  end: EndStatement | null;
}
export interface PageDirective extends AstNode {
  kind: SyntaxKind.PageDirective;
}
export function createPageDirective(): PageDirective {
  return {
    kind: SyntaxKind.PageDirective,
    container: null,
  };
}
export interface PageFormatItem extends AstNode {
  kind: SyntaxKind.PageFormatItem;
}
export interface Parenthesis extends AstNode {
  kind: SyntaxKind.Parenthesis;
  value: Expression | null;
  do: DoType3 | null;
}
export interface PFormatItem extends AstNode {
  kind: SyntaxKind.PFormatItem;
  specification: string | null;
}
export interface PictureAttribute extends AstNode {
  kind: SyntaxKind.PictureAttribute;
  picture: string | null;
}
export interface PliProgram extends AstNode {
  kind: SyntaxKind.PliProgram;
  statements: Statement[];
}
export interface PopDirective extends AstNode {
  kind: SyntaxKind.PopDirective;
}
export function createPopDirective(): PopDirective {
  return {
    kind: SyntaxKind.PopDirective,
    container: null,
  };
}
export interface PrefixedAttribute extends AstNode {
  kind: SyntaxKind.PrefixedAttribute;
  level: string | null;
  attributes: DeclarationAttribute[];
}
export interface PrintDirective extends AstNode {
  kind: SyntaxKind.PrintDirective;
}
export function createPrintDirective(): PrintDirective {
  return {
    kind: SyntaxKind.PrintDirective,
    container: null,
  };
}
export interface ProcedureCall extends AstNode {
  kind: SyntaxKind.ProcedureCall;
  /**
   * Call to a known procedure or external declaration (via a named element), does not necessarily require an arg list
   */
  procedure: Reference<NamedElement> | null;
  /**
   * First argument list of the CALL statement.
   * In case of a procedure array, this is the index!
   * Use `args2` for the actual arguments (assuming there are any).
   */
  args1: ProcedureCallArgs | null;
  /**
   * Second argument list of the CALL statement.
   * Likely empty. Only filled if the linked procedure is an array!
   */
  args2: ProcedureCallArgs | null;
}
export interface ProcedureCallArgs extends AstNode {
  kind: SyntaxKind.ProcedureCallArgs;
  list: Wildcard<Expression>[];
}
export interface ProcedureParameter extends AstNode {
  kind: SyntaxKind.ProcedureParameter;
  name: string | null;
  nameToken: Token | null;
}
export function createProcedureParameter(): ProcedureParameter {
  return {
    kind: SyntaxKind.ProcedureParameter,
    container: null,
    name: null,
    nameToken: null,
  };
}
export interface ProcedureStatement extends AstNode {
  kind: SyntaxKind.ProcedureStatement;
  xProc: boolean;
  parameters: ProcedureParameter[];
  /**
   * Preprocessor specific indicator, whether this is a "STATEMENT" type procedure
   */
  statement: boolean;
  statements: Statement[];
  options: ProcedureOption[];
  end: EndStatement | null;
}
export function createProcedureStatement(): ProcedureStatement {
  return {
    kind: SyntaxKind.ProcedureStatement,
    container: null,
    xProc: false,
    statement: false,
    parameters: [],
    statements: [],
    options: [],
    end: null,
  };
}
export type ProcedureOption =
  | ProcedureOrderOption
  | ProcedureRecursiveOption
  | ProcedureScopeOption
  | ReturnsOption
  | Options
  | EnvironmentOption;
export interface ProcedureOrderOption extends AstNode {
  kind: SyntaxKind.ProcedureOrderOption;
  order: "ORDER" | "REORDER" | null;
}
export function createProcedureOrderOption(): ProcedureOrderOption {
  return {
    kind: SyntaxKind.ProcedureOrderOption,
    container: null,
    order: null,
  };
}
export interface ProcedureRecursiveOption extends AstNode {
  kind: SyntaxKind.ProcedureRecursiveOption;
}
export function createProcedureRecursiveOption(): ProcedureRecursiveOption {
  return {
    kind: SyntaxKind.ProcedureRecursiveOption,
    container: null,
  };
}
export interface ProcedureScopeOption extends AstNode {
  kind: SyntaxKind.ProcedureScopeOption;
  scope: ScopeAttribute | null;
}
export function createProcedureScopeOption(): ProcedureScopeOption {
  return {
    kind: SyntaxKind.ProcedureScopeOption,
    container: null,
    scope: null,
  };
}
export interface EnvironmentOption extends AstNode {
  kind: SyntaxKind.EnvironmentOption;
  environment: Expression | null;
}
export function createEnvironmentOption(): EnvironmentOption {
  return {
    kind: SyntaxKind.EnvironmentOption,
    container: null,
    environment: null,
  };
}
export interface ProcessDirective extends AstNode {
  kind: SyntaxKind.ProcessDirective;
  compilerOptions: CompilerOptions[];
}
export interface ProcincDirective extends AstNode {
  kind: SyntaxKind.ProcincDirective;
  datasetName: string | null;
}
export interface PushDirective extends AstNode {
  kind: SyntaxKind.PushDirective;
}
export function createPushDirective(): PushDirective {
  return {
    kind: SyntaxKind.PushDirective,
    container: null,
  };
}
export interface PutFileStatement extends AstNode {
  kind: SyntaxKind.PutFileStatement;
  items: (PutItem | DataSpecificationOptions)[];
}
export interface PutItem extends AstNode {
  kind: SyntaxKind.PutItem;
  attribute: PutAttribute | null;
  expression: Expression | null;
}
export interface PutStringStatement extends AstNode {
  kind: SyntaxKind.PutStringStatement;
  stringExpression: Expression | null;
  dataSpecification: DataSpecificationOptions | null;
}
export interface QualifyStatement extends AstNode {
  kind: SyntaxKind.QualifyStatement;
  statements: Statement[];
  end: EndStatement | null;
}
export interface ReadStatement extends AstNode {
  kind: SyntaxKind.ReadStatement;
  arguments: ReadStatementOption[];
}
export interface ReadStatementOption extends AstNode {
  kind: SyntaxKind.ReadStatementOption;
  type: "KEY" | "KEYTO" | "INTO" | "SET" | "IGNORE" | "FILE" | null;
  value: Expression | null;
}
export interface ReferenceItem extends AstNode {
  kind: SyntaxKind.ReferenceItem;
  ref: Reference<NamedElement> | null;
  dimensions: Dimensions | null;
}
export function createReferenceItem(): ReferenceItem {
  return {
    kind: SyntaxKind.ReferenceItem,
    container: null,
    ref: null,
    dimensions: null,
  };
}
export interface ReinitStatement extends AstNode {
  kind: SyntaxKind.ReinitStatement;
  reference: LocatorCall | null;
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
  attrs: (
    | ComputationDataAttribute
    | DateAttribute
    | ValueListAttribute
    | ValueRangeAttribute
  )[];
}
export interface ReturnsOption extends AstNode {
  kind: SyntaxKind.ReturnsOption;
  returnAttributes: DeclarationAttribute[];
}
export function createReturnsOption(): ReturnsOption {
  return {
    kind: SyntaxKind.ReturnsOption,
    container: null,
    returnAttributes: [],
  };
}
export interface ReturnStatement extends AstNode {
  kind: SyntaxKind.ReturnStatement;
  expression: Expression | null;
}
export function createReturnStatement(): ReturnStatement {
  return {
    kind: SyntaxKind.ReturnStatement,
    container: null,
    expression: null,
  };
}
export interface RevertStatement extends AstNode {
  kind: SyntaxKind.RevertStatement;
  conditions: Condition[];
}
export interface RewriteStatement extends AstNode {
  kind: SyntaxKind.RewriteStatement;
  arguments: RewriteStatementOption[];
}
export interface RewriteStatementOption extends AstNode {
  kind: SyntaxKind.RewriteStatementOption;
  type: "FILE" | "FROM" | "KEY" | null;
  value: Expression | null;
}
export interface RFormatItem extends AstNode {
  kind: SyntaxKind.RFormatItem;
  labelReference: string | null;
}
export interface SelectStatement extends AstNode {
  kind: SyntaxKind.SelectStatement;
  on: Expression | null;
  statements: (WhenStatement | OtherwiseStatement)[];
  end: EndStatement | null;
}
export interface SignalStatement extends AstNode {
  kind: SyntaxKind.SignalStatement;
  condition: Condition[];
}
export interface SimpleOptionsItem extends AstNode {
  kind: SyntaxKind.SimpleOptionsItem;
  value:
    | "ORDER"
    | "REORDER"
    | "NOCHARGRAPHIC"
    | "CHARGRAPHIC"
    | "NOINLINE"
    | "INLINE"
    | "MAIN"
    | "NOEXECOPS"
    | "COBOL"
    | "FORTRAN"
    | "BYADDR"
    | "BYVALUE"
    | "DESCRIPTOR"
    | "NODESCRIPTOR"
    | "IRREDUCIBLE"
    | "REDUCIBLE"
    | "NORETURN"
    | "REENTRANT"
    | "FETCHABLE"
    | "RENT"
    | "AMODE31"
    | "AMODE64"
    | "DLLINTERNAL"
    | "FROMALIEN"
    | "RETCODE"
    | "ASSEMBLER"
    | "ASM"
    | "WINMAIN"
    | "INTER"
    | "RECURSIVE"
    | null;
}
export interface SkipDirective extends AstNode {
  kind: SyntaxKind.SkipDirective;
  lines: Expression | null;
  lineCount: number;
}
export function createSkipDirective(): SkipDirective {
  return {
    kind: SyntaxKind.SkipDirective,
    container: null,
    lines: null,
    lineCount: 1,
  };
}
export interface SkipFormatItem extends AstNode {
  kind: SyntaxKind.SkipFormatItem;
  skip: Expression | null;
}
export interface Statement extends AstNode {
  kind: SyntaxKind.Statement;
  condition: ConditionPrefix | null;
  labels: LabelPrefix[];
  value: Unit | null;
}
export function createStatement(): Statement {
  return {
    kind: SyntaxKind.Statement,
    container: null,
    condition: null,
    labels: [],
    value: null,
  };
}
export interface StopStatement extends AstNode {
  kind: SyntaxKind.StopStatement;
}
export interface StringLiteral extends AstNode {
  kind: SyntaxKind.StringLiteral;
  value: string | null;
}
export function createStringLiteral(): StringLiteral {
  return {
    kind: SyntaxKind.StringLiteral,
    container: null,
    value: null,
  };
}
export interface SubStructure extends AstNode {
  kind: SyntaxKind.SubStructure;
  level: string | null;
  name: string | null;
  attributes: DeclarationAttribute[];
}
export interface TypeAttribute extends AstNode {
  kind: SyntaxKind.TypeAttribute;
  type: Reference<NamedType> | null;
}
export interface UnaryExpression extends AstNode {
  kind: SyntaxKind.UnaryExpression;
  op: "+" | "-" | "^" | null;
  expr: Expression | null;
}
export interface ValueAttribute extends AstNode {
  kind: SyntaxKind.ValueAttribute;
  value: Expression | null;
}
export interface ValueListAttribute extends AstNode {
  kind: SyntaxKind.ValueListAttribute;
  values: Expression[];
}
export interface ValueListFromAttribute extends AstNode {
  kind: SyntaxKind.ValueListFromAttribute;
  from: LocatorCall | null;
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
  task: LocatorCall | null;
}
export interface WhenStatement extends AstNode {
  kind: SyntaxKind.WhenStatement;
  conditions: Expression[];
  unit: Statement | null;
}
export interface WriteStatement extends AstNode {
  kind: SyntaxKind.WriteStatement;
  arguments: WriteStatementOption[];
}
export interface WriteStatementOption extends AstNode {
  kind: SyntaxKind.WriteStatementOption;
  type: "FILE" | "FROM" | "KEYFROM" | "KEYTO" | null;
  value: Expression | null;
}
export interface XFormatItem extends AstNode {
  kind: SyntaxKind.XFormatItem;
  width: Expression | null;
}
