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

import { IToken } from "chevrotain";

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
  GenericAttribute,
  GenericReference,
  GenericDescriptor,
  HandleAttribute,
  IfStatement,
  IncludeDirective,
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
  token: IToken;
  node: T | null | undefined;
}

export function createReference<T extends SyntaxNode>(
  owner: SyntaxNode,
  token: IToken,
): Reference<T> {
  return {
    owner,
    text: token.image,
    token,
    node: undefined,
  };
}

export type Wildcard<T> = T | "*";

export type SyntaxNode =
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
  | ComputationDataAttribute
  | ConditionPrefix
  | ConditionPrefixItem
  | DataSpecificationDataList
  | DataSpecificationDataListItem
  | DataSpecificationOptions
  | DateAttribute
  | DeclaredItem
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
  | DoType3Variable
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
  | XFormatItem;

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
export type NamedElement =
  | DeclaredVariable
  | DoType3Variable
  | OrdinalValue
  | ProcedureStatement;
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
  | IncludeDirective
  | IterateStatement
  | LeaveStatement
  | LineDirective
  | LocateStatement
  | NoPrintDirective
  | NoteDirective
  | NullStatement
  | OnStatement
  | OpenStatement
  | Package
  | PageDirective
  | PopDirective
  | PrintDirective
  | ProcedureStatement
  | ProcessDirective
  | ProcincDirective
  | PushDirective
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
  | SkipDirective
  | StopStatement
  | WaitStatement
  | WriteStatement;
export type Varying = "NONVARYING" | "VARYING" | "VARYING4" | "VARYINGZ";

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
  left: Expression;
  right: Expression;
  op: string; //'|' | '¬' | '^' | '&' | '<' | '¬<' | '<=' | '=' | '¬=' | '^=' | '<>' | '>=' | '>' | '¬>' | '||' | '!!' | '+' | '-' | '*' | '/' | '**';
}
export interface Bound extends AstNode {
  kind: SyntaxKind.Bound;
  expression: Wildcard<Expression> | null;
  refer: LocatorCall | null;
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
export interface ComputationDataAttribute extends AstNode {
  kind: SyntaxKind.ComputationDataAttribute;
  type: DataAttributeType | null;
  dimensions: Dimensions | null;
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
export interface DeclaredItem extends AstNode {
  kind: SyntaxKind.DeclaredItem;
  level: string | null;
  element: Wildcard<DeclaredVariable> | null;
  attributes: DeclarationAttribute[];
  items: DeclaredItem[];
}
export interface DeclaredVariable extends AstNode {
  kind: SyntaxKind.DeclaredVariable;
  nameToken: IToken | null;
  name: string | null;
}
export interface DeclareStatement extends AstNode {
  kind: SyntaxKind.DeclareStatement;
  items: DeclaredItem[];
  xDeclare: boolean;
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
  signed: boolean;
  unsigned: boolean;
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
  bound1: Bound | null;
  bound2: Bound | null;
}
export interface Dimensions extends AstNode {
  kind: SyntaxKind.Dimensions;
  dimensions: DimensionBound[];
}
export interface DimensionsDataAttribute extends AstNode {
  kind: SyntaxKind.DimensionsDataAttribute;
  dimensions: Dimensions | null;
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
}
export interface DoType3 extends AstNode {
  kind: SyntaxKind.DoType3;
  variable: DoType3Variable | null;
  specifications: DoSpecification[];
}
export interface DoType3Variable extends AstNode {
  kind: SyntaxKind.DoType3Variable;
  name: string | null;
}
export interface DoUntil extends AstNode {
  kind: SyntaxKind.DoUntil;
  until: Expression | null;
  while: Expression | null;
}
export interface DoWhile extends AstNode {
  kind: SyntaxKind.DoWhile;
  while: Expression | null;
  until: Expression | null;
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
  environmentName: Expression[];
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
export interface Exports extends AstNode {
  kind: SyntaxKind.Exports;
  all: boolean;
  procedures: string[];
}
export interface FetchEntry extends AstNode {
  kind: SyntaxKind.FetchEntry;
  name: string | null;
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
}
export interface IncludeDirective extends AstNode {
  kind: SyntaxKind.IncludeDirective;
  items: IncludeItem[];
}
export interface IncludeItem extends AstNode {
  kind: SyntaxKind.IncludeItem;
  file: string | null;
  ddname: boolean;
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
  nameToken: IToken | null;
  name: string | null;
}
export interface LabelReference extends AstNode {
  kind: SyntaxKind.LabelReference;
  label: Reference<LabelPrefix> | null;
}
export interface LeaveStatement extends AstNode {
  kind: SyntaxKind.LeaveStatement;
  label: LabelReference | null;
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
export interface MemberCall extends AstNode {
  kind: SyntaxKind.MemberCall;
  element: ReferenceItem | null;
  previous: MemberCall | null;
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
export interface NoteDirective extends AstNode {
  kind: SyntaxKind.NoteDirective;
  message: Expression | null;
  code: Expression | null;
}
export interface NullStatement extends AstNode {
  kind: SyntaxKind.NullStatement;
}
export interface NumberLiteral extends AstNode {
  kind: SyntaxKind.NumberLiteral;
  value: string | null;
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
export interface PrefixedAttribute extends AstNode {
  kind: SyntaxKind.PrefixedAttribute;
  level: string | null;
  attribute: DeclarationAttribute | null;
}
export interface PrintDirective extends AstNode {
  kind: SyntaxKind.PrintDirective;
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
  id: string | null;
}
export interface ProcedureStatement extends AstNode {
  kind: SyntaxKind.ProcedureStatement;
  xProc: boolean;
  parameters: ProcedureParameter[];
  statements: Statement[];
  returns: ReturnsOption[];
  options: Options[];
  recursive: "RECURSIVE"[];
  order: ("ORDER" | "REORDER")[];
  scope: ScopeAttribute[];
  end: EndStatement | null;
  environmentName: Expression[];
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
export interface ReturnStatement extends AstNode {
  kind: SyntaxKind.ReturnStatement;
  expression: Expression | null;
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
export interface StopStatement extends AstNode {
  kind: SyntaxKind.StopStatement;
}
export interface StringLiteral extends AstNode {
  kind: SyntaxKind.StringLiteral;
  value: string | null;
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
  op: "+" | "-" | "¬" | "^" | null;
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
