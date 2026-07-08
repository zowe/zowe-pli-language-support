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
import { assertUnreachable } from "../utils/common";
import { isObject } from "../utils/types";
import type { CompilationUnit } from "../workspace/compilation-unit";
import { SemanticTokenTypes } from "../language-server/semantic-tokens";

export enum DataType {
  Area,
  Arithmetic,
  Entry,
  File,
  Format,
  Label,
  Locator,
  Ordinal,
  Picture,
  String,
  Structure,
  Task,
  Union,
  Unknown = -1,
}

export enum SyntaxKind {
  // Preprocessor AST
  ActivateStatement,
  ActivateItem,
  DeactivateStatement,
  TokenStatement,
  AnswerStatement,
  // Normal AST
  AFormatItem,
  AllocateDimension,
  AllocatedVariable,
  AllocateLocationReferenceIn,
  AllocateLocationReferenceSet,
  AllocateStatement,
  AllocateType,
  AnyAttribute,
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
  DoUntil,
  DoWhile,
  EFormatItem,
  EndStatement,
  EntryAttribute,
  EntryParameterDescription,
  EntryStatement,
  EntryUnionDescription,
  EnvironmentAttribute,
  EnvironmentOptionSymbol,
  EnvironmentOptionValue,
  EnvironmentOptionOrganization,
  EnvironmentOptionRecordFormat,
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
  IncludeItemMember,
  IncludeItemFile,
  InscanDirective,
  IndForAttribute,
  InitAcrossAttribute,
  InitAcrossList,
  InitialAttribute,
  InitialToAttribute,
  InitialCallAttribute,
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
  OrdinalValue,
  OrdinalValueList,
  OtherwiseStatement,
  Package,
  PageDirective,
  PageFormatItem,
  Parenthesis,
  PFormatItem,
  PictureAttribute,
  Program,
  PopDirective,
  PrefixedAttribute,
  PrintDirective,
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
  ReservedAttribute,
  ReplaceStatement,
  ReadStatement,
  ReadStatementOption,
  ReferenceItem,
  ReinitStatement,
  ReleaseStatement,
  RepeatedExpression,
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
  SqlAttributeStatement,
  SqlAttributeBinary,
  SqlAttributeLob,
  SqlAttributeLobLocator,
  SqlAttributeLobFile,
  SqlAttributeRowId,
  SqlAttributeTableLocator,
  SqlAttributeResultSetLocator,
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

  CicsResponseStatement,

  ExecStatement,
  ExecVariableReference,
}

export enum KeywordConditions {
  SUBSCRIPTRANGE,
  FIXEDOVERFLOW,
  ANYCONDITION,
  CONFORMANCE,
  STRINGRANGE,
  STRINGSIZE,
  ZERODIVIDE,
  ASSERTION,
  ATTENTION,
  INVALIDOP,
  UNDERFLOW,
  STORAGE,
  OVERFLOW,
  ERROR,
  AREA,
  FINISH,
  SIZE,
  CONVERSION,
}

export enum SimpleOptions {
  BYADDR,
  DESCRIPTOR,
  NOINLINE,
  INLINE,
  NORETURN,
  NOCHARGRAPHIC,
  NODESCRIPTOR,
  CHARGRAPHIC,
  IRREDUCIBLE,
  DLLINTERNAL,
  REDUCIBLE,
  REENTRANT,
  FETCHABLE,
  FROMALIEN,
  ASSEMBLER,
  RECURSIVE,
  FORTRAN,
  BYVALUE,
  AMODE31,
  AMODE64,
  RETCODE,
  WINMAIN,
  ORDER,
  REORDER,
  COBOL,
  INTER,
  MAIN,
  RENT,
  NOEXECOPS,
}

export enum DefaultAttribute {
  INT,
  NORESCAN,
  BIT,
  UNION,
  BYADDR,
  BYVALUE,
  INONLY,
  NOINIT,
  UCHAR,
  CHARACTER,
  STATIC,
  IEEE,
  JSONTRIMR,
  BINARY,
  DIRECT,
  AREA,
  FILE,
  NONASSIGNABLE,
  NONCONNECTED,
  LITTLEENDIAN,
  IRREDUCIBLE,
  REDUCIBLE,
  XMLCONTENT,
  JSONIGNORE,
  ASSIGNABLE,
  CONTROLLED,
  NONVARYING,
  SEQUENTIAL,
  CHARGRAPHIC,
  DIMACROSS,
  AUTOMATIC,
  BACKWARDS,
  CONDITION,
  CONNECTED,
  EXCLUSIVE,
  NONNATIVE,
  PARAMETER,
  PRECISION,
  STRUCTURE,
  TRANSIENT,
  UNALIGNED,
  BIGENDIAN,
  JSONNAME,
  JSONNULL,
  JSONOMIT,
  EXTERNAL,
  VARIABLE,
  WIDECHAR,
  ABNORMAL,
  BUFFERED,
  UNBUFFERED,
  CONSTANT,
  INTERNAL,
  OPTIONAL,
  POSITION,
  UNSIGNED,
  VARYING4,
  VARYINGZ,
  NULLINIT,
  XMLNAME,
  XMLATTR,
  XMLOMIT,
  OPTIONS,
  GRAPHIC,
  ALIGNED,
  BUILTIN,
  COMPLEX,
  DECIMAL,
  HEXADEC,
  OUTONLY,
  POINTER,
  VARYING,
  NOSCAN,
  RESCAN,
  RANGE,
  BASED,
  EVENT,
  FIXED,
  FLOAT,
  INOUT,
  INPUT,
  KEYED,
  LABEL,
  PRINT,
  STREAM,
  UPDATE,
  MEMBER,
  NATIVE,
  NORMAL,
  OFFSET,
  OUTPUT,
  RECORD,
  SIGNED,
  TASK,
  LIST,
  REAL,
  SCAN,
  XMLIGNORE,
  FORMAT,
}

export enum FileReferenceConditions {
  UNDEFINEDFILE,
  TRANSMIT,
  ENDFILE,
  ENDPAGE,
  NAME,
  RECORD,
  KEY,
}

export enum NoMapOption {
  NOMAPOUT,
  NOMAPIN,
  NOMAP,
}

export enum Varying {
  NONVARYING,
  VARYING4,
  VARYINGZ,
  VARYING,
}

export enum OpenOptionType {
  SEQUENTIAL,
  BUFFERED,
  UNBUFFERED,
  OUTPUT,
  RECORD,
  STREAM,
  UPDATE,
  LINESIZE,
  PAGESIZE,
  PRINT,
  DIRECT,
  TITLE,
  INPUT,
  KEYED,
  FILE,
}

export enum AllocateAttributeType {
  AREA,
  CHARACTER,
  WIDECHAR,
  GRAPHIC,
  UCHAR,
  BIT,
}

export enum CharType {
  CHARACTER,
  WIDECHAR,
  UCHAR,
}

export enum PutAttribute {
  FILE,
  LINE,
  PAGE,
  SKIP,
}

export enum ReadStatementType {
  IGNORE,
  INTO,
  FILE,
  SET,
  KEYTO,
  KEY,
}

export enum WriteStatementType {
  FROM,
  FILE,
  KEYTO,
  KEYFROM,
}

export enum RewriteStatementType {
  FROM,
  FILE,
  KEY,
}

export enum LocateType {
  KEYFROM,
  FILE,
  SET,
}

export enum LOB {
  BLOB,
  CLOB,
  DBCLOB,
}

export enum LOBLocator {
  BLOB_LOCATOR,
  CLOB_LOCATOR,
  DBCLOB_LOCATOR,
}

export enum VX {
  V1,
  V2,
  V3,
}

export enum TypeOrOrdinal {
  ORDINAL,
  TYPE,
}

export enum ScopeAttribute {
  DYNAMIC,
  STATIC,
}

export enum AssignmentOperator {
  /** ||= */
  PipePipeEquals,
  /** **= */
  StarStarEquals,
  /** += */
  PlusEquals,
  /** -= */
  MinusEquals,
  /** *= */
  StarEquals,
  /** /= */
  SlashEquals,
  /** |= */
  PipeEquals,
  /** &= */
  AmpersandEquals,
  /** ¬= or ^= */
  NotEquals,
  /** = */
  Equals,
}

export function assignmentToBinaryOperator(
  operator: AssignmentOperator,
): BinaryOperator | null {
  switch (operator) {
    case AssignmentOperator.PipePipeEquals:
      return BinaryOperator.PipePipe;
    case AssignmentOperator.StarStarEquals:
      return BinaryOperator.StarStar;
    case AssignmentOperator.PlusEquals:
      return BinaryOperator.Plus;
    case AssignmentOperator.MinusEquals:
      return BinaryOperator.Minus;
    case AssignmentOperator.StarEquals:
      return BinaryOperator.Star;
    case AssignmentOperator.SlashEquals:
      return BinaryOperator.Slash;
    case AssignmentOperator.PipeEquals:
      return BinaryOperator.Pipe;
    case AssignmentOperator.AmpersandEquals:
      return BinaryOperator.Ampersand;
    case AssignmentOperator.NotEquals:
      return BinaryOperator.Not;
    case AssignmentOperator.Equals:
      // No corresponding binary operator, simple assignment
      return null;
    default:
      assertUnreachable(operator);
  }
}

export enum BinaryOperator {
  NotEquals,
  NotLessThan,
  LessThanEquals,
  GreaterThanEquals,
  NotGreaterThan,
  PipePipe,
  StarStar,
  Star,
  Equals,
  Pipe,
  Not,
  Ampersand,
  LessThan,
  GreaterThan,
  Plus,
  Minus,
  Slash,
}

export enum UnaryOperator {
  Plus,
  Minus,
  Not,
}

export enum BooleanType {
  FALSE,
  TRUE,
}

export enum LinkageOption {
  OPTLINK,
  STDCALL,
  SYSTEM,
  CDECL,
}

export enum DefaultAttributeBinaryOperator {
  AND,
  OR,
}

export enum ProcedureOrder {
  ORDER,
  REORDER,
}

export interface AstNode {
  container: SyntaxNode | null;
  kind: SyntaxKind;
}

export function isSyntaxNode(node: unknown): node is SyntaxNode {
  return isObject<AstNode>(node) && typeof node.kind === "number";
}

export function getContainer<K extends SyntaxNode["kind"]>(
  node: SyntaxNode | null | undefined,
  kind: K,
): Extract<SyntaxNode, { kind: K }> | null {
  if (!node) {
    return null;
  }
  let container = node.container;
  while (container) {
    if (container.kind === kind) {
      return container as Extract<SyntaxNode, { kind: K }>;
    }
    container = container.container;
  }
  return null;
}

export enum ReferenceType {
  /**
   * A variable reference in the PL/I code. Can also target labels.
   */
  Variable,
  /**
   * A type reference in the PL/I code. Only valid for normal PL/I code.
   */
  Type,
  /**
   * References a type OR variable, but will prefer type if both exist.
   *
   * This is a rather exotic case that only exists to support the limited amount of type functions.
   * These look like `BIND(:type, pointer:)`, and require to be able to reference either a type or variable.
   */
  TypeOrVariable,
}

export interface Reference<T extends SyntaxNode = SyntaxNode> {
  owner: SyntaxNode;
  text: string;
  token: Token;
  /**
   * This is the main target of the reference.
   *
   * If the reference hasn't been resolved yet, this will be `undefined`.
   * If the reference resolution has failed (i.e. the reference doesn't actually point to any element in the code), this will be `null`.
   * In all other cases, this will be the resolved target of the reference.
   */
  node: T | null | undefined;
  /**
   * PL/I generally only allows a reference to resolve to a single element.
   * However, for the purpose of the language server, we want to be able to reference multiple elements at once.
   * For example, in the case of ambiguous reference or when encountering a procedure and its forward declaration.
   * This field is only really useful for selected LSP services - other features should use the `node` field instead.
   *
   * Note that the `nodes` might not always be filled, even when the `node` field is set.
   * However, when the `nodes` are filled, they should always also contain the value of the `node` field as one of their elements.
   * Use the `iterateReferenceNodes` helper to iterate over all possible nodes of a reference, regardless of how they are stored.
   */
  nodes: T[];
  type: ReferenceType;
}

export function createReference<T extends SyntaxNode>(
  owner: SyntaxNode,
  token: Token,
  type: ReferenceType,
): Reference<T>;
export function createReference<T extends SyntaxNode>(
  owner: SyntaxNode,
  token: Token | null | undefined,
  type: ReferenceType,
): Reference<T> | null;
export function createReference<T extends SyntaxNode>(
  owner: SyntaxNode,
  token: Token | null | undefined,
  type: ReferenceType,
): Reference<T> | null {
  if (!token) {
    return null;
  }
  return {
    owner,
    text: token.image,
    token,
    nodes: [],
    node: undefined,
    type,
  };
}

export function* iterateReferenceNodes(ref: Reference): Iterable<SyntaxNode> {
  if (ref.nodes.length > 0) {
    // If any nodes are set, they automatically include the `node` field as well.
    yield* ref.nodes;
  } else if (ref.node) {
    yield ref.node;
  }
}

export function isPreprocessorNode(
  unit: CompilationUnit,
  node: SyntaxNode,
): boolean {
  let parent = node;
  while (parent.container) {
    parent = parent.container;
  }
  return unit.preprocessorAst === parent;
}

export type Wildcard<T> = T | "*";

export type SyntaxNode =
  // Preprocessor nodes
  | ActivateStatement
  | ActivateItem
  | AnswerStatement
  | DeactivateStatement
  | TokenStatement
  | CicsResponseStatement
  | SqlAttributeStatement
  | SqlAttributeBinary
  | SqlAttributeLob
  | SqlAttributeLobLocator
  | SqlAttributeLobFile
  | SqlAttributeRowId
  | SqlAttributeTableLocator
  | SqlAttributeResultSetLocator

  // Normal nodes
  | AFormatItem
  | AllocateDimension
  | AllocatedVariable
  | AllocateLocationReferenceIn
  | AllocateLocationReferenceSet
  | AllocateStatement
  | AllocateType
  | AnyAttribute
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
  | EnvironmentOptionItem
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
  | IncludeItemMember
  | IncludeItemFile
  | InscanDirective
  | IndForAttribute
  | InitAcrossAttribute
  | InitAcrossList
  | InitialAttribute
  | InitialToAttribute
  | InitialCallAttribute
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
  | OrdinalValue
  | OrdinalValueList
  | OtherwiseStatement
  | Package
  | PageDirective
  | PageFormatItem
  | Parenthesis
  | PFormatItem
  | PictureAttribute
  | Program
  | PopDirective
  | PrefixedAttribute
  | PrintDirective
  | ProcedureParameter
  | ProcedureStatement
  | ProcessDirective
  | ProcincDirective
  | PushDirective
  | PutFileStatement
  | PutItem
  | PutStringStatement
  | QualifyStatement
  | ReplaceStatement
  | ReadStatement
  | ReadStatementOption
  | ReferenceItem
  | ReinitStatement
  | ReleaseStatement
  | RepeatedExpression
  | Reserves
  | ReservedAttribute
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
  | ProcedureScopeOption
  | ExecStatement
  | ExecVariableReference;

export type AllocateAttribute =
  | AllocateDimension
  | AllocateLocationReferenceIn
  | AllocateLocationReferenceSet
  | AllocateType
  | InitialAttribute
  | InitialCallAttribute
  | InitialToAttribute;
export type Condition =
  | FileReferenceCondition
  | KeywordCondition
  | NamedCondition;
export type DataAttributeType = DefaultAttribute;
export type CommonDeclarationAttribute =
  | AnyAttribute
  | ComputationDataAttribute
  | DateAttribute
  | DefinedAttribute
  | DimensionsDataAttribute
  | EntryAttribute
  | EnvironmentAttribute
  | HandleAttribute
  | InitialAttribute
  | InitialToAttribute
  | InitialCallAttribute
  | InitAcrossAttribute
  | LikeAttribute
  | PictureAttribute
  | ReturnsAttribute
  | TypeAttribute
  | ValueListAttribute
  | ValueListFromAttribute
  | ValueRangeAttribute
  | GenericAttribute
  | IndForAttribute
  | ReservedAttribute;
/**
 * Type extending attributes are attributes that extend the type of a variable.
 */
export type TypeExtendingAttribute = LikeAttribute | TypeAttribute;
export enum ScanMode {
  SCAN,
  RESCAN,
  NOSCAN,
}

export enum DefineOrdinalAttribute {
  SIGNED,
  UNSIGNED,
  PRECISION,
}

/**
 * A list of all the possible attributes that can be used in a default expression.
 * This is essentially a list of all attributes that can be used in a common declaration + the DEFAULT VALUE attribute.
 */
export type DefaultDeclarationAttribute =
  | CommonDeclarationAttribute
  | DefaultValueAttribute;
/**
 * A list of all the possible attributes that can be used in a declaration.
 * This is essentially a list of all attributes that can be used in a common declaration + the VALUE attribute.
 */
export type DeclarationAttribute =
  | CommonDeclarationAttribute
  | ValueAttribute
  | AnyAttribute;
export type DoType2 = DoUntil | DoWhile;
export type EntryDescription =
  | EntryParameterDescription
  | EntryUnionDescription;
export type Expression =
  | BinaryExpression
  | Literal
  | RepeatedExpression
  | WildcardItem
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
export type Literal = NumberLiteral | StringLiteral;
export type NamedVariable = DeclaredVariable | OrdinalValue | LabelPrefix;
export type NamedType =
  | DefineAliasStatement
  | DefineOrdinalStatement
  // Only if part of a define struct statement
  | DeclaredVariable;
export type NamedElement = NamedVariable | NamedType;
export type OptionsItem =
  | CMPATOptionsItem
  | LinkageOptionsItem
  | NoMapOptionsItem
  | SimpleOptionsItem;
export type OrdinalType = DefineOrdinalStatement;
export type PutStatement = PutFileStatement | PutStringStatement;
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
  | ReplaceStatement
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
  | AnswerStatement
  | TokenStatement
  | IncludeDirective
  | IncludeAltDirective
  | InscanDirective
  | ActivateStatement
  | DeactivateStatement
  | ProcessDirective
  | ProcincDirective
  | PushDirective
  | PageDirective
  | PopDirective
  | PrintDirective
  | NoPrintDirective
  | SkipDirective
  | SqlAttributeStatement
  | CicsResponseStatement
  | ExecVariableReference
  | ExecStatement;

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

export enum SkipModeType {
  Page,
  Skip,
}

export type SkipMode =
  | {
      type: SkipModeType.Page;
    }
  | {
      type: SkipModeType.Skip;
      count: Expression | null;
    };

export interface AnswerStatement extends AstNode {
  kind: SyntaxKind.AnswerStatement;
  expression: Expression | null;
  scanMode: ScanMode | null;
  skip: SkipMode | null;
  skipToken: Token | null;
  column: Expression | null;
  columnToken: Token | null;
  margins: {
    left: Expression | null;
    right: Expression | null;
  } | null;
  marginsToken: Token | null;
}

export function createAnswerStatement(): AnswerStatement {
  return {
    kind: SyntaxKind.AnswerStatement,
    container: null,
    expression: null,
    scanMode: null,
    skip: null,
    skipToken: null,
    column: null,
    columnToken: null,
    margins: null,
    marginsToken: null,
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

export function createAllocateDimension(): AllocateDimension {
  return {
    kind: SyntaxKind.AllocateDimension,
    container: null,
    dimensions: null,
  };
}

export interface AllocatedVariable extends AstNode {
  kind: SyntaxKind.AllocatedVariable;
  level: string | null;
  var: ReferenceItem | null;
  attributes: AllocateAttribute[];
}

export function createAllocatedVariable(): AllocatedVariable {
  return {
    kind: SyntaxKind.AllocatedVariable,
    container: null,
    level: null,
    var: null,
    attributes: [],
  };
}
export interface AllocateLocationReferenceIn extends AstNode {
  kind: SyntaxKind.AllocateLocationReferenceIn;
  area: LocatorCall | null;
}

export function createAllocateLocationReferenceIn(): AllocateLocationReferenceIn {
  return {
    kind: SyntaxKind.AllocateLocationReferenceIn,
    container: null,
    area: null,
  };
}

export interface AllocateLocationReferenceSet extends AstNode {
  kind: SyntaxKind.AllocateLocationReferenceSet;
  locatorVariable: LocatorCall | null;
}

export function createAllocateLocationReferenceSet(): AllocateLocationReferenceSet {
  return {
    kind: SyntaxKind.AllocateLocationReferenceSet,
    container: null,
    locatorVariable: null,
  };
}

export interface AllocateStatement extends AstNode {
  kind: SyntaxKind.AllocateStatement;
  variables: AllocatedVariable[];
}

export function createAllocateStatement(): AllocateStatement {
  return {
    kind: SyntaxKind.AllocateStatement,
    container: null,
    variables: [],
  };
}

export interface AllocateType extends AstNode {
  kind: SyntaxKind.AllocateType;
  type: AllocateAttributeType | null;
  dimensions: Dimensions | null;
}

export function createAllocateType(): AllocateType {
  return {
    kind: SyntaxKind.AllocateType,
    container: null,
    type: null,
    dimensions: null,
  };
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

export function createAssertStatement(): AssertStatement {
  return {
    kind: SyntaxKind.AssertStatement,
    container: null,
    true: false,
    actual: null,
    false: false,
    unreachable: false,
    displayExpression: null,
    compare: false,
    expected: null,
    operator: null,
  };
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

export function createAttachStatement(): AttachStatement {
  return {
    kind: SyntaxKind.AttachStatement,
    container: null,
    reference: null,
    task: null,
    environment: false,
    tstack: null,
  };
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

export function createBeginStatement(): BeginStatement {
  return {
    kind: SyntaxKind.BeginStatement,
    container: null,
    options: null,
    recursive: false,
    statements: [],
    end: null,
    order: false,
    reorder: false,
  };
}

export interface BFormatItem extends AstNode {
  kind: SyntaxKind.BFormatItem;
  fieldWidth: Expression | null;
}

export function createBFormatItem(): BFormatItem {
  return {
    kind: SyntaxKind.BFormatItem,
    container: null,
    fieldWidth: null,
  };
}

export interface BinaryExpression extends AstNode {
  kind: SyntaxKind.BinaryExpression;
  left: Expression | null;
  right: Expression | null;
  op: BinaryOperator | null;
  opToken: Token | null;
}
export interface Bound extends AstNode {
  kind: SyntaxKind.Bound;
  expression: Expression | null;
  refer: LocatorCall | null;
  token: Token | null;
}
export function createBound(): Bound {
  return {
    kind: SyntaxKind.Bound,
    container: null,
    expression: null,
    refer: null,
    token: null,
  };
}
export interface CallStatement extends AstNode {
  kind: SyntaxKind.CallStatement;
  call: LocatorCall | null;
}

export function createCallStatement(): CallStatement {
  return {
    kind: SyntaxKind.CallStatement,
    container: null,
    call: null,
  };
}

export interface CancelThreadStatement extends AstNode {
  kind: SyntaxKind.CancelThreadStatement;
  thread: LocatorCall | null;
}

export function createCancelThreadStatement(): CancelThreadStatement {
  return {
    kind: SyntaxKind.CancelThreadStatement,
    container: null,
    thread: null,
  };
}

export interface CFormatItem extends AstNode {
  kind: SyntaxKind.CFormatItem;
  item: FFormatItem | EFormatItem | PFormatItem | null;
}

export function createCFormatItem(): CFormatItem {
  return {
    kind: SyntaxKind.CFormatItem,
    container: null,
    item: null,
  };
}

export interface CloseStatement extends AstNode {
  kind: SyntaxKind.CloseStatement;
  files: Wildcard<MemberCall>[];
}

export function createCloseStatement(): CloseStatement {
  return {
    kind: SyntaxKind.CloseStatement,
    container: null,
    files: [],
  };
}

export interface CMPATOptionsItem extends AstNode {
  kind: SyntaxKind.CMPATOptionsItem;
  value: VX | null;
}

export function createCMPATOptionsItem(): CMPATOptionsItem {
  return {
    kind: SyntaxKind.CMPATOptionsItem,
    container: null,
    value: null,
  };
}

export interface ColumnFormatItem extends AstNode {
  kind: SyntaxKind.ColumnFormatItem;
  characterPosition: Expression | null;
}

export function createColumnFormatItem(): ColumnFormatItem {
  return {
    kind: SyntaxKind.ColumnFormatItem,
    container: null,
    characterPosition: null,
  };
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

/**
 * Not part of the PL/I specification!
 * Helps declaring parameters of any type for builtin procedures
 */
export interface AnyAttribute extends AstNode {
  kind: SyntaxKind.AnyAttribute;
  token: Token | null;
  dataType: DataType;
  dimensions: Dimensions | null;
}

export function createAnyAttribute(): AnyAttribute {
  return {
    kind: SyntaxKind.AnyAttribute,
    container: null,
    token: null,
    dataType: DataType.Unknown,
    dimensions: null,
  };
}

export interface ComputationDataAttribute extends AstNode {
  kind: SyntaxKind.ComputationDataAttribute;
  type: DataAttributeType | null;
  typeToken: Token | null;
  dimensions: Dimensions | null;
}
export function createComputationDataAttribute(): ComputationDataAttribute {
  return {
    kind: SyntaxKind.ComputationDataAttribute,
    container: null,
    type: null,
    typeToken: null,
    dimensions: null,
  };
}
export interface ConditionPrefix extends AstNode {
  kind: SyntaxKind.ConditionPrefix;
  items: ConditionPrefixItem[];
}

export function createConditionPrefix(): ConditionPrefix {
  return {
    kind: SyntaxKind.ConditionPrefix,
    container: null,
    items: [],
  };
}

export interface ConditionPrefixItem extends AstNode {
  kind: SyntaxKind.ConditionPrefixItem;
  conditions: Condition[];
}

export function createConditionPrefixItem(): ConditionPrefixItem {
  return {
    kind: SyntaxKind.ConditionPrefixItem,
    container: null,
    conditions: [],
  };
}

export interface DataSpecificationDataList extends AstNode {
  kind: SyntaxKind.DataSpecificationDataList;
  items: DataSpecificationDataListItem[];
}

export function createDataSpecificationDataList(): DataSpecificationDataList {
  return {
    kind: SyntaxKind.DataSpecificationDataList,
    container: null,
    items: [],
  };
}

export interface DataSpecificationDataListItem extends AstNode {
  kind: SyntaxKind.DataSpecificationDataListItem;
  value: Expression | null;
}

export function createDataSpecificationDataListItem(): DataSpecificationDataListItem {
  return {
    kind: SyntaxKind.DataSpecificationDataListItem,
    container: null,
    value: null,
  };
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

export function createDataSpecificationOptions(): DataSpecificationOptions {
  return {
    kind: SyntaxKind.DataSpecificationOptions,
    container: null,
    dataList: null,
    edit: false,
    dataLists: [],
    formatLists: [],
    data: false,
    dataListItems: [],
  };
}

export interface DateAttribute extends AstNode {
  kind: SyntaxKind.DateAttribute;
  pattern: string | null;
}

export function createDateAttribute(): DateAttribute {
  return {
    kind: SyntaxKind.DateAttribute,
    container: null,
    pattern: null,
  };
}

export interface WildcardItem extends AstNode {
  kind: SyntaxKind.WildcardItem;
  token: Token | null;
}
export function createWildcardItem(): WildcardItem {
  return {
    kind: SyntaxKind.WildcardItem,
    container: null,
    token: null,
  };
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
  startToken: Token | null;
  endToken: Token | null;
}
export function createDeclaredItem(): DeclaredItem {
  return {
    kind: SyntaxKind.DeclaredItem,
    container: null,
    level: null,
    levelToken: null,
    elements: [],
    attributes: [],
    startToken: null,
    endToken: null,
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
  operators: DefaultAttributeBinaryOperator[];
}

export function createDefaultAttributeExpression(): DefaultAttributeExpression {
  return {
    kind: SyntaxKind.DefaultAttributeExpression,
    container: null,
    items: [],
    operators: [],
  };
}

export interface DefaultAttributeExpressionNot extends AstNode {
  kind: SyntaxKind.DefaultAttributeExpressionNot;
  not: boolean;
  value: DefaultAttribute | null;
}

export function createDefaultAttributeExpressionNot(): DefaultAttributeExpressionNot {
  return {
    kind: SyntaxKind.DefaultAttributeExpressionNot,
    container: null,
    not: false,
    value: null,
  };
}

export interface DefaultExpression extends AstNode {
  kind: SyntaxKind.DefaultExpression;
  expression: DefaultExpressionPart | null;
  attributes: DefaultDeclarationAttribute[];
}
export function createDefaultExpression(): DefaultExpression {
  return {
    kind: SyntaxKind.DefaultExpression,
    container: null,
    expression: null,
    attributes: [],
  };
}

export interface DefaultExpressionPart extends AstNode {
  kind: SyntaxKind.DefaultExpressionPart;
  expression: DefaultAttributeExpression | null;
  identifiers: DefaultRangeIdentifiers | null;
}

export function createDefaultExpressionPart(): DefaultExpressionPart {
  return {
    kind: SyntaxKind.DefaultExpressionPart,
    container: null,
    expression: null,
    identifiers: null,
  };
}

export interface DefaultRangeIdentifierItem extends AstNode {
  kind: SyntaxKind.DefaultRangeIdentifierItem;
  from: string | null;
  to: string | null;
}

export function createDefaultRangeIdentifierItem(): DefaultRangeIdentifierItem {
  return {
    kind: SyntaxKind.DefaultRangeIdentifierItem,
    container: null,
    from: null,
    to: null,
  };
}

export interface DefaultRangeIdentifiers extends AstNode {
  kind: SyntaxKind.DefaultRangeIdentifiers;
  identifiers: Wildcard<DefaultRangeIdentifierItem>[];
}

export function createDefaultRangeIdentifiers(): DefaultRangeIdentifiers {
  return {
    kind: SyntaxKind.DefaultRangeIdentifiers,
    container: null,
    identifiers: [],
  };
}

export interface DefaultStatement extends AstNode {
  kind: SyntaxKind.DefaultStatement;
  expressions: DefaultExpression[];
}

export function createDefaultStatement(): DefaultStatement {
  return {
    kind: SyntaxKind.DefaultStatement,
    container: null,
    expressions: [],
  };
}

export interface DefaultValueAttribute extends AstNode {
  kind: SyntaxKind.DefaultValueAttribute;
  items: DefaultValueAttributeItem[];
}

export function createDefaultValueAttribute(): DefaultValueAttribute {
  return {
    kind: SyntaxKind.DefaultValueAttribute,
    container: null,
    items: [],
  };
}

export interface DefaultValueAttributeItem extends AstNode {
  kind: SyntaxKind.DefaultValueAttributeItem;
  attributes: DeclarationAttribute[];
}

export function createDefaultValueAttributeItem(): DefaultValueAttributeItem {
  return {
    kind: SyntaxKind.DefaultValueAttributeItem,
    container: null,
    attributes: [],
  };
}

export interface DefineAliasStatement extends AstNode {
  kind: SyntaxKind.DefineAliasStatement;
  name: string | null;
  nameToken: Token | null;
  xDefine: boolean;
  attributes: DeclarationAttribute[];
}

export function createDefineAliasStatement(): DefineAliasStatement {
  return {
    kind: SyntaxKind.DefineAliasStatement,
    container: null,
    name: null,
    nameToken: null,
    xDefine: false,
    attributes: [],
  };
}

export interface DefinedAttribute extends AstNode {
  kind: SyntaxKind.DefinedAttribute;
  reference: MemberCall | null;
  position: Expression | null;
}

export function createDefinedAttribute(): DefinedAttribute {
  return {
    kind: SyntaxKind.DefinedAttribute,
    container: null,
    reference: null,
    position: null,
  };
}

export interface DefineOrdinalStatement extends AstNode {
  kind: SyntaxKind.DefineOrdinalStatement;
  name: string | null;
  nameToken: Token | null;
  ordinalValues: OrdinalValueList | null;
  xDefine: boolean;
  attributes: DefineOrdinalAttribute[];
  precision: string | null;
  startToken: Token | null;
  endToken: Token | null;
}

export function createDefineOrdinalStatement(): DefineOrdinalStatement {
  return {
    kind: SyntaxKind.DefineOrdinalStatement,
    container: null,
    name: null,
    nameToken: null,
    ordinalValues: null,
    xDefine: false,
    attributes: [],
    precision: null,
    startToken: null,
    endToken: null,
  };
}

export interface DefineStructureStatement extends AstNode {
  kind: SyntaxKind.DefineStructureStatement;
  xDefine: boolean;
  items: DeclaredItem[];
}

export function createDefineStructureStatement(): DefineStructureStatement {
  return {
    kind: SyntaxKind.DefineStructureStatement,
    container: null,
    xDefine: false,
    items: [],
  };
}

export interface DelayStatement extends AstNode {
  kind: SyntaxKind.DelayStatement;
  delay: Expression | null;
}

export function createDelayStatement(): DelayStatement {
  return {
    kind: SyntaxKind.DelayStatement,
    container: null,
    delay: null,
  };
}

export interface DeleteStatement extends AstNode {
  kind: SyntaxKind.DeleteStatement;
  file: LocatorCall | null;
  key: Expression | null;
}

export function createDeleteStatement(): DeleteStatement {
  return {
    kind: SyntaxKind.DeleteStatement,
    container: null,
    file: null,
    key: null,
  };
}

export interface DetachStatement extends AstNode {
  kind: SyntaxKind.DetachStatement;
  reference: LocatorCall | null;
}

export function createDetachStatement(): DetachStatement {
  return {
    kind: SyntaxKind.DetachStatement,
    container: null,
    reference: null,
  };
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
  /**
   * Token after the start of the dimension bound, which is usually the opening parenthesis or a comma.
   * Used for signature help requests.
   */
  startToken: Token | null;
  /**
   * Token before the end of the dimension bound, which is usually the closing parenthesis or a comma.
   * Used for signature help requests.
   */
  endToken: Token | null;
}
export function createDimensionBound(): DimensionBound {
  return {
    kind: SyntaxKind.DimensionBound,
    container: null,
    lower: null,
    upper: null,
    startToken: null,
    endToken: null,
  };
}
export interface Dimensions extends AstNode {
  kind: SyntaxKind.Dimensions;
  dimensions: DimensionBound[];
  token: Token | null;
}
export function createDimensions(): Dimensions {
  return {
    kind: SyntaxKind.Dimensions,
    container: null,
    dimensions: [],
    token: null,
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

export function createDisplayStatement(): DisplayStatement {
  return {
    kind: SyntaxKind.DisplayStatement,
    container: null,
    expression: null,
    reply: null,
    rout: [],
    desc: [],
  };
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
export function createDoSpecification(): DoSpecification {
  return {
    kind: SyntaxKind.DoSpecification,
    container: null,
    expression: null,
    upthru: null,
    downthru: null,
    repeat: null,
    whileOrUntil: null,
    to: null,
    by: null,
  };
}
export interface DoStatement extends AstNode {
  kind: SyntaxKind.DoStatement;
  statements: Statement[];
  end: EndStatement | null;
  doType2: DoType2 | null;
  doType3: DoType3 | null;
  doType4: boolean;
  skip: boolean;
  doToken: Token | null;
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
    skip: false,
    doToken: null,
  };
}
export interface DoType3 extends AstNode {
  kind: SyntaxKind.DoType3;
  variable: MemberCall | null;
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

export function createEFormatItem(): EFormatItem {
  return {
    kind: SyntaxKind.EFormatItem,
    container: null,
    fieldWidth: null,
    fractionalDigits: null,
    significantDigits: null,
  };
}

export interface EndStatement extends AstNode {
  kind: SyntaxKind.EndStatement;
  endToken: Token | null;
  labels: LabelPrefix[];
  label: LabelReference | null;
  semicolon: Token | null;
}

export function createEndStatement(): EndStatement {
  return {
    kind: SyntaxKind.EndStatement,
    container: null,
    labels: [],
    label: null,
    semicolon: null,
    endToken: null,
  };
}
export interface EntryAttribute extends AstNode {
  kind: SyntaxKind.EntryAttribute;
  limited: Token[];
  attributes: EntryDescription[];
  options: Options[];
  variable: Token[];
  returns: ReturnsOption[];
  hasExternal: boolean;
  environmentName: Expression | null;
  entryToken: Token | null;
}
export function createEntryAttribute(): EntryAttribute {
  return {
    kind: SyntaxKind.EntryAttribute,
    container: null,
    limited: [],
    attributes: [],
    options: [],
    variable: [],
    returns: [],
    environmentName: null,
    entryToken: null,
    hasExternal: false,
  };
}
export interface EntryParameterDescription extends AstNode {
  kind: SyntaxKind.EntryParameterDescription;
  attributes: DeclarationAttribute[];
  star: boolean;
}

export function createEntryParameterDescription(): EntryParameterDescription {
  return {
    kind: SyntaxKind.EntryParameterDescription,
    container: null,
    attributes: [],
    star: false,
  };
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

export function createEntryStatement(): EntryStatement {
  return {
    kind: SyntaxKind.EntryStatement,
    container: null,
    parameters: [],
    variable: [],
    limited: [],
    returns: [],
    options: [],
    environmentName: [],
  };
}

export interface EntryUnionDescription extends AstNode {
  kind: SyntaxKind.EntryUnionDescription;
  init: string | null;
  attributes: DeclarationAttribute[];
  prefixedAttributes: PrefixedAttribute[];
}

export function createEntryUnionDescription(): EntryUnionDescription {
  return {
    kind: SyntaxKind.EntryUnionDescription,
    container: null,
    init: null,
    attributes: [],
    prefixedAttributes: [],
  };
}

export interface EnvironmentAttribute extends AstNode {
  kind: SyntaxKind.EnvironmentAttribute;
  items: EnvironmentOptionItem[];
}

export function createEnvironmentAttribute(): EnvironmentAttribute {
  return {
    kind: SyntaxKind.EnvironmentAttribute,
    container: null,
    items: [],
  };
}

export type EnvironmentOptionItem =
  | EnvironmentOptionOrganization
  | EnvironmentOptionRecordFormat
  | EnvironmentOptionSymbol
  | EnvironmentOptionValue;

export enum Organization {
  Consecutive,
  Indexed,
  Relative,
}

export interface EnvironmentOptionOrganization extends AstNode {
  kind: SyntaxKind.EnvironmentOptionOrganization;
  organization: Organization | null;
  token: Token | null;
}

export function createEnvironmentOptionOrganization(): EnvironmentOptionOrganization {
  return {
    kind: SyntaxKind.EnvironmentOptionOrganization,
    container: null,
    organization: null,
    token: null,
  };
}

export enum RecordFormat {
  F,
  FB,
  FS,
  FBS,
  V,
  VB,
  VS,
  VBS,
  U,
}

export interface EnvironmentOptionRecordFormat extends AstNode {
  kind: SyntaxKind.EnvironmentOptionRecordFormat;
  format: RecordFormat | null;
  token: Token | null;
}

export function createEnvironmentOptionRecordFormat(): EnvironmentOptionRecordFormat {
  return {
    kind: SyntaxKind.EnvironmentOptionRecordFormat,
    container: null,
    format: null,
    token: null,
  };
}

export enum EnvironmentOptionSymbolName {
  BKWD,
  GENKEY,
  REUSE,
  SKIP,
  VSAM,
  SCALARVARYING,
  CONSECUTIVE,
  LEAVE,
  REREAD,
  CTLASA,
  CTL360,
  GRAPHIC,
  INDEXED,
  TOTAL,
}

export enum EnvironmentOptionValueName {
  BUFND,
  BUFNI,
  BUFSP,
  BLKSIZE,
  RECSIZE,
  PASSWORD,
  KEYLOC,
  REGIONAL,
}

export interface EnvironmentOptionSymbol extends AstNode {
  kind: SyntaxKind.EnvironmentOptionSymbol;
  name: EnvironmentOptionSymbolName | null;
  token: Token | null;
}

export function createEnvironmentOptionSymbol(): EnvironmentOptionSymbol {
  return {
    kind: SyntaxKind.EnvironmentOptionSymbol,
    container: null,
    name: null,
    token: null,
  };
}

export interface EnvironmentOptionValue extends AstNode {
  kind: SyntaxKind.EnvironmentOptionValue;
  name: EnvironmentOptionValueName | null;
  value: Expression | null;
  token: Token | null;
}

export function createEnvironmentOptionValue(): EnvironmentOptionValue {
  return {
    kind: SyntaxKind.EnvironmentOptionValue,
    container: null,
    name: null,
    value: null,
    token: null,
  };
}

export interface ExitStatement extends AstNode {
  kind: SyntaxKind.ExitStatement;
}

export function createExitStatement(): ExitStatement {
  return {
    kind: SyntaxKind.ExitStatement,
    container: null,
  };
}

export interface ExportsItem extends AstNode {
  kind: SyntaxKind.ExportsItem;
  reference: Reference<ProcedureStatement> | null;
}

export function createExportsItem(): ExportsItem {
  return {
    kind: SyntaxKind.ExportsItem,
    container: null,
    reference: null,
  };
}

export interface Exports extends AstNode {
  kind: SyntaxKind.Exports;
  all: boolean;
  procedures: ExportsItem[];
}

export function createExports(): Exports {
  return {
    kind: SyntaxKind.Exports,
    container: null,
    all: false,
    procedures: [],
  };
}

export interface FetchEntry extends AstNode {
  kind: SyntaxKind.FetchEntry;
  entry: ReferenceItem | null;
  set: LocatorCall | null;
  title: Expression | null;
}

export function createFetchEntry(): FetchEntry {
  return {
    kind: SyntaxKind.FetchEntry,
    container: null,
    entry: null,
    set: null,
    title: null,
  };
}

export interface FetchStatement extends AstNode {
  kind: SyntaxKind.FetchStatement;
  entries: FetchEntry[];
}

export function createFetchStatement(): FetchStatement {
  return {
    kind: SyntaxKind.FetchStatement,
    container: null,
    entries: [],
  };
}

export interface FFormatItem extends AstNode {
  kind: SyntaxKind.FFormatItem;
  fieldWidth: Expression | null;
  fractionalDigits: Expression | null;
  scalingFactor: Expression | null;
}

export function createFFormatItem(): FFormatItem {
  return {
    kind: SyntaxKind.FFormatItem,
    container: null,
    fieldWidth: null,
    fractionalDigits: null,
    scalingFactor: null,
  };
}

export interface FileReferenceCondition extends AstNode {
  kind: SyntaxKind.FileReferenceCondition;
  keyword: FileReferenceConditions | null;
  fileReference: LocatorCall | null;
}

export function createFileReferenceCondition(): FileReferenceCondition {
  return {
    kind: SyntaxKind.FileReferenceCondition,
    container: null,
    keyword: null,
    fileReference: null,
  };
}

export interface FlushStatement extends AstNode {
  kind: SyntaxKind.FlushStatement;
  file: Wildcard<LocatorCall> | null;
}

export function createFlushStatement(): FlushStatement {
  return {
    kind: SyntaxKind.FlushStatement,
    container: null,
    file: null,
  };
}

export interface FormatList extends AstNode {
  kind: SyntaxKind.FormatList;
  items: FormatListItem[];
}

export function createFormatList(): FormatList {
  return {
    kind: SyntaxKind.FormatList,
    container: null,
    items: [],
  };
}

export interface FormatListItem extends AstNode {
  kind: SyntaxKind.FormatListItem;
  level: FormatListItemLevel | null;
  item: FormatItem | null;
  list: FormatList | null;
}

export function createFormatListItem(): FormatListItem {
  return {
    kind: SyntaxKind.FormatListItem,
    container: null,
    level: null,
    item: null,
    list: null,
  };
}

export interface FormatListItemLevel extends AstNode {
  kind: SyntaxKind.FormatListItemLevel;
  level: string | Expression | null;
}

export function createFormatListItemLevel(): FormatListItemLevel {
  return {
    kind: SyntaxKind.FormatListItemLevel,
    container: null,
    level: null,
  };
}

export interface FormatStatement extends AstNode {
  kind: SyntaxKind.FormatStatement;
  list: FormatList | null;
}

export function createFormatStatement(): FormatStatement {
  return {
    kind: SyntaxKind.FormatStatement,
    container: null,
    list: null,
  };
}

export interface FreeStatement extends AstNode {
  kind: SyntaxKind.FreeStatement;
  references: LocatorCall[];
}

export function createFreeStatement(): FreeStatement {
  return {
    kind: SyntaxKind.FreeStatement,
    container: null,
    references: [],
  };
}

export interface GetCopy extends AstNode {
  kind: SyntaxKind.GetCopy;
  copyReference: string | null;
}

export function createGetCopy(): GetCopy {
  return {
    kind: SyntaxKind.GetCopy,
    container: null,
    copyReference: null,
  };
}

export interface GetFile extends AstNode {
  kind: SyntaxKind.GetFile;
  file: Expression | null;
}

export function createGetFile(): GetFile {
  return {
    kind: SyntaxKind.GetFile,
    container: null,
    file: null,
  };
}

export interface GetFileStatement extends AstNode {
  kind: SyntaxKind.GetFileStatement;
  specifications: (GetFile | GetCopy | GetSkip | DataSpecificationOptions)[];
}

export function createGetFileStatement(): GetFileStatement {
  return {
    kind: SyntaxKind.GetFileStatement,
    container: null,
    specifications: [],
  };
}

export interface GetSkip extends AstNode {
  kind: SyntaxKind.GetSkip;
  skipExpression: Expression | null;
}

export function createGetSkip(): GetSkip {
  return {
    kind: SyntaxKind.GetSkip,
    container: null,
    skipExpression: null,
  };
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

export function createGFormatItem(): GFormatItem {
  return {
    kind: SyntaxKind.GFormatItem,
    container: null,
    fieldWidth: null,
  };
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

export function createGenericAttribute(): GenericAttribute {
  return {
    kind: SyntaxKind.GenericAttribute,
    container: null,
    references: [],
  };
}

export interface GenericReference extends AstNode {
  kind: SyntaxKind.GenericReference;
  entry: ReferenceItem | null;
  otherwise: boolean;
  descriptors: Wildcard<GenericDescriptor>[];
}

export function createGenericReference(): GenericReference {
  return {
    kind: SyntaxKind.GenericReference,
    container: null,
    entry: null,
    otherwise: false,
    descriptors: [],
  };
}

export interface GenericDescriptor extends AstNode {
  kind: SyntaxKind.GenericDescriptor;
  attributes: DeclarationAttribute[];
}

export function createGenericDescriptor(): GenericDescriptor {
  return {
    kind: SyntaxKind.GenericDescriptor,
    container: null,
    attributes: [],
  };
}

export interface HandleAttribute extends AstNode {
  kind: SyntaxKind.HandleAttribute;
  size: string | null;
  type: Reference<NamedType> | null;
}

export function createHandleAttribute(): HandleAttribute {
  return {
    kind: SyntaxKind.HandleAttribute,
    container: null,
    size: null,
    type: null,
  };
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
  idempotent: boolean;
  token: Token | null;
  items: IncludeItem[];
}
export function createIncludeDirective(): IncludeDirective {
  return {
    kind: SyntaxKind.IncludeDirective,
    container: null,
    token: null,
    idempotent: false,
    items: [],
  };
}
/**
 * @see https://www.ibm.com/docs/en/pli-for-aix/3.1.0?topic=preprocessors-include-preprocessor
 */
export interface IncludeAltDirective extends AstNode {
  kind: SyntaxKind.IncludeAltDirective;
  idempotent: boolean;
  token: Token | null;
  items: IncludeItem[];
}
export function createIncludeAltDirective(): IncludeAltDirective {
  return {
    kind: SyntaxKind.IncludeAltDirective,
    container: null,
    token: null,
    idempotent: false,
    items: [],
  };
}

export type IncludeItem = IncludeItemFile | IncludeItemMember;

/**
 * Include item by file name
 */
export interface IncludeItemFile extends AstNode {
  kind: SyntaxKind.IncludeItemFile;
  token: Token | null;
  range: Range | null;
  fileName: string | null;
  /**
   * Indicates whether the include statement is sourced from an EXEC SQL statement.
   */
  sql: boolean;

  // Properties filled by the preprocessor
  filePath: string | null;
  relativeFilePath: string | null;
}

/**
 * Include item by member name + optional ddname
 */
export interface IncludeItemMember extends AstNode {
  kind: SyntaxKind.IncludeItemMember;
  token: Token | null;
  range: Range | null;

  // Properties filled by the preprocessor
  filePath: string | null;
  relativeFilePath: string | null;

  /**
   * Member name of the include, if present
   */
  memberName: string | null;

  /**
   * Explicit ddname for resolving the member within
   */
  ddname: string | null;

  /**
   * Contributing tokens for ddname components
   */
  ddnameTokens: Token[] | null;
}

/**
 * Type guard for an IncludeItemFile w/ fileName prop
 */
export function isIncludeItemFile(
  item: unknown,
): item is IncludeItemFile & { fileName: string } {
  return isObject<IncludeItemFile>(item) && typeof item.fileName === "string";
}

/**
 * Type guard for an IncludeItemMember w/ memberName prop
 */
export function isIncludeItemMember(
  item: unknown,
): item is IncludeItemMember & { memberName: string } {
  return (
    isObject<IncludeItemMember>(item) && typeof item.memberName === "string"
  );
}

export function createIncludeItemFile(): IncludeItemFile {
  return {
    kind: SyntaxKind.IncludeItemFile,
    container: null,
    range: null,
    filePath: null,
    relativeFilePath: null,
    token: null,
    fileName: null,
    sql: false,
  };
}

export function createIncludeItemMember(): IncludeItemMember {
  return {
    kind: SyntaxKind.IncludeItemMember,
    container: null,
    range: null,
    filePath: null,
    relativeFilePath: null,
    token: null,
    memberName: null,
    ddname: null,
    ddnameTokens: null,
  };
}

export interface InscanDirective extends AstNode {
  kind: SyntaxKind.InscanDirective;
  token: Token | null;
  item: ReferenceItem | null;
  idempotent: boolean;
  // Properties filled by the preprocessor
  filePath: string | null;
  relativeFilePath: string | null;
  sourceText: string | null;
}
export function createInscanDirective(): InscanDirective {
  return {
    kind: SyntaxKind.InscanDirective,
    container: null,
    token: null,
    item: null,
    filePath: null,
    relativeFilePath: null,
    idempotent: false,
    sourceText: null,
  };
}
export interface IndForAttribute extends AstNode {
  kind: SyntaxKind.IndForAttribute;
  reference: LocatorCall | null;
}

export function createIndForAttribute(): IndForAttribute {
  return {
    kind: SyntaxKind.IndForAttribute,
    container: null,
    reference: null,
  };
}

export interface InitAcrossAttribute extends AstNode {
  kind: SyntaxKind.InitAcrossAttribute;
  token: Token | null;
  lists: InitAcrossList[];
}

export function createInitAcrossAttribute(): InitAcrossAttribute {
  return {
    kind: SyntaxKind.InitAcrossAttribute,
    container: null,
    token: null,
    lists: [],
  };
}

export interface InitAcrossList extends AstNode {
  kind: SyntaxKind.InitAcrossList;
  expressions: Expression[];
}

export function createInitAcrossList(): InitAcrossList {
  return {
    kind: SyntaxKind.InitAcrossList,
    container: null,
    expressions: [],
  };
}

export interface InitialAttribute extends AstNode {
  kind: SyntaxKind.InitialAttribute;
  initial: Token | null;
  expressions: Expression[];
}
export function createInitialAttribute(): InitialAttribute {
  return {
    kind: SyntaxKind.InitialAttribute,
    container: null,
    initial: null,
    expressions: [],
  };
}
export interface InitialCallAttribute extends AstNode {
  kind: SyntaxKind.InitialCallAttribute;
  initial: Token | null;
  procedureCall: ReferenceItem | null;
}

export function createInitialCallAttribute(): InitialCallAttribute {
  return {
    kind: SyntaxKind.InitialCallAttribute,
    container: null,
    initial: null,
    procedureCall: null,
  };
}
export interface InitialToAttribute extends AstNode {
  kind: SyntaxKind.InitialToAttribute;
  initial: Token | null;
  expressions: Expression[];
  varying: Varying | null;
  type: CharType | null;
}
export function createInitialToAttribute(): InitialToAttribute {
  return {
    kind: SyntaxKind.InitialToAttribute,
    container: null,
    initial: null,
    expressions: [],
    varying: null,
    type: null,
  };
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
  keyword: KeywordConditions | null;
}

export function createKeywordCondition(): KeywordCondition {
  return {
    kind: SyntaxKind.KeywordCondition,
    container: null,
    keyword: null,
  };
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
  leaveToken: Token | null;
}
export function createLeaveStatement(): LeaveStatement {
  return {
    kind: SyntaxKind.LeaveStatement,
    container: null,
    label: null,
    leaveToken: null,
  };
}
export interface LFormatItem extends AstNode {
  kind: SyntaxKind.LFormatItem;
}

export function createLFormatItem(): LFormatItem {
  return {
    kind: SyntaxKind.LFormatItem,
    container: null,
  };
}

export interface LikeAttribute extends AstNode {
  kind: SyntaxKind.LikeAttribute;
  reference: LocatorCall | null;
  likeToken: Token | null;
}

export function createLikeAttribute(): LikeAttribute {
  return {
    kind: SyntaxKind.LikeAttribute,
    container: null,
    reference: null,
    likeToken: null,
  };
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

export function createLineFormatItem(): LineFormatItem {
  return {
    kind: SyntaxKind.LineFormatItem,
    container: null,
    lineNumber: null,
  };
}

export interface LinkageOptionsItem extends AstNode {
  kind: SyntaxKind.LinkageOptionsItem;
  value: LinkageOption | null;
}

export function createLinkageOptionsItem(): LinkageOptionsItem {
  return {
    kind: SyntaxKind.LinkageOptionsItem,
    container: null,
    value: null,
  };
}

/**
 * Repeated expressions are used in two ways:
 * 1. Repeat the following literal a certain number of times.
 *    I.e. (5)"a" would repeat the string "a" 5 times, resulting in "aaaaa".
 * 2. Generate an array from the following expression, repeated a certain number of times.
 *    I.e. (5)(3)"a" would generate an array with 5 elements, each being the result of (3)"a" ("aaa").
 *    This array syntax is only valid as part of the INITIAL attribute, used to initialize arrays.
 *
 * Note that the first form is only supported in the normal PL/I parser. The preprocessor exclusively supports the second form.
 * Meaning that (5)"a" in the preprocessor would be treated as an array of 5 elements, each being "a".
 */
export interface RepeatedExpression extends AstNode {
  kind: SyntaxKind.RepeatedExpression;
  expression: Expression | null;
  count: Expression | null;
}

export function createRepeatedExpression(): RepeatedExpression {
  return {
    kind: SyntaxKind.RepeatedExpression,
    container: null,
    expression: null,
    count: null,
  };
}

export interface LocateStatement extends AstNode {
  kind: SyntaxKind.LocateStatement;
  variable: LocatorCall | null;
  arguments: LocateStatementOption[];
}

export function createLocateStatement(): LocateStatement {
  return {
    kind: SyntaxKind.LocateStatement,
    container: null,
    variable: null,
    arguments: [],
  };
}

export interface LocateStatementOption extends AstNode {
  kind: SyntaxKind.LocateStatementOption;
  type: LocateType | null;
  element: Expression | null;
}

export function createLocateStatementOption(): LocateStatementOption {
  return {
    kind: SyntaxKind.LocateStatementOption,
    container: null,
    type: null,
    element: null,
  };
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

export function createNamedCondition(): NamedCondition {
  return {
    kind: SyntaxKind.NamedCondition,
    container: null,
    name: null,
  };
}

export interface NoMapOptionsItem extends AstNode {
  kind: SyntaxKind.NoMapOptionsItem;
  type: NoMapOption | null;
  parameters: string[];
}

export function createNoMapOptionsItem(): NoMapOptionsItem {
  return {
    kind: SyntaxKind.NoMapOptionsItem,
    container: null,
    type: null,
    parameters: [],
  };
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
  noteToken: Token | null;
  message: Expression | null;
  code: Expression | null;
}

export function createNoteDirective(): NoteDirective {
  return {
    kind: SyntaxKind.NoteDirective,
    noteToken: undefined!,
    container: null,
    code: null,
    message: null,
  };
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

export function createOnStatement(): OnStatement {
  return {
    kind: SyntaxKind.OnStatement,
    container: null,
    conditions: [],
    snap: false,
    system: false,
    onUnit: null,
  };
}

export interface OpenOptionsGroup extends AstNode {
  kind: SyntaxKind.OpenOptionsGroup;
  options: OpenOption[];
}

export function createOpenOptionsGroup(): OpenOptionsGroup {
  return {
    kind: SyntaxKind.OpenOptionsGroup,
    container: null,
    options: [],
  };
}

export interface OpenOption extends AstNode {
  kind: SyntaxKind.OpenOption;
  option: OpenOptionType | null;
  expression: Expression | null;
}

export function createOpenOption(): OpenOption {
  return {
    kind: SyntaxKind.OpenOption,
    container: null,
    option: null,
    expression: null,
  };
}

export interface OpenStatement extends AstNode {
  kind: SyntaxKind.OpenStatement;
  options: OpenOptionsGroup[];
}

export function createOpenStatement(): OpenStatement {
  return {
    kind: SyntaxKind.OpenStatement,
    container: null,
    options: [],
  };
}

export interface Options extends AstNode {
  kind: SyntaxKind.Options;
  items: OptionsItem[];
}

export function createOptions(): Options {
  return {
    kind: SyntaxKind.Options,
    container: null,
    items: [],
  };
}

export interface OrdinalValue extends AstNode {
  kind: SyntaxKind.OrdinalValue;
  name: string | null;
  nameToken: Token | null;
  value: Expression | null;
}

export function createOrdinalValue(): OrdinalValue {
  return {
    kind: SyntaxKind.OrdinalValue,
    container: null,
    name: null,
    nameToken: null,
    value: null,
  };
}

export interface OrdinalValueList extends AstNode {
  kind: SyntaxKind.OrdinalValueList;
  members: OrdinalValue[];
}

export function createOrdinalValueList(): OrdinalValueList {
  return {
    kind: SyntaxKind.OrdinalValueList,
    container: null,
    members: [],
  };
}

export interface OtherwiseStatement extends AstNode {
  kind: SyntaxKind.OtherwiseStatement;
  unit: Statement | null;
  range: Range | null;
}
export function createOtherwiseStatement(): OtherwiseStatement {
  return {
    kind: SyntaxKind.OtherwiseStatement,
    container: null,
    unit: null,
    range: null,
  };
}
export interface Package extends AstNode {
  kind: SyntaxKind.Package;
  exports: Exports | null;
  reserves: Reserves | null;
  options: Options | null;
  statements: Statement[];
  end: EndStatement | null;
}

export function createPackage(): Package {
  return {
    kind: SyntaxKind.Package,
    container: null,
    statements: [],
    end: null,
    exports: null,
    options: null,
    reserves: null,
  };
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

export function createPageFormatItem(): PageFormatItem {
  return {
    kind: SyntaxKind.PageFormatItem,
    container: null,
  };
}

export interface Parenthesis extends AstNode {
  kind: SyntaxKind.Parenthesis;
  expressions: Expression[];
  do: DoType3 | null;
}

export function createParenthesis(): Parenthesis {
  return {
    kind: SyntaxKind.Parenthesis,
    container: null,
    expressions: [],
    do: null,
  };
}

export interface PFormatItem extends AstNode {
  kind: SyntaxKind.PFormatItem;
  specification: string | null;
}

export function createPFormatItem(): PFormatItem {
  return {
    kind: SyntaxKind.PFormatItem,
    container: null,
    specification: null,
  };
}

export interface PictureAttribute extends AstNode {
  kind: SyntaxKind.PictureAttribute;
  picture: string | null;
  pictureToken: Token | null;
}

export function createPictureAttribute(): PictureAttribute {
  return {
    kind: SyntaxKind.PictureAttribute,
    container: null,
    picture: null,
    pictureToken: null,
  };
}

export interface Program extends AstNode {
  kind: SyntaxKind.Program;
  statements: Statement[];
}

export function createProgram(): Program {
  return {
    kind: SyntaxKind.Program,
    container: null,
    statements: [],
  };
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

export function createPrefixedAttribute(): PrefixedAttribute {
  return {
    kind: SyntaxKind.PrefixedAttribute,
    container: null,
    level: null,
    attributes: [],
  };
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

export interface ProcedureParameter extends AstNode {
  kind: SyntaxKind.ProcedureParameter;
  ref: Reference<NamedVariable> | null;
}
export function createProcedureParameter(): ProcedureParameter {
  return {
    kind: SyntaxKind.ProcedureParameter,
    container: null,
    ref: null,
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
  procToken: Token | null;
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
    procToken: null,
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
  order: ProcedureOrder | null;
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

export function createProcincDirective(): ProcincDirective {
  return {
    kind: SyntaxKind.ProcincDirective,
    container: null,
    datasetName: null,
  };
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

export function createPutFileStatement(): PutFileStatement {
  return {
    kind: SyntaxKind.PutFileStatement,
    container: null,
    items: [],
  };
}

export interface PutItem extends AstNode {
  kind: SyntaxKind.PutItem;
  attribute: PutAttribute | null;
  expression: Expression | null;
}

export function createPutItem(): PutItem {
  return {
    kind: SyntaxKind.PutItem,
    container: null,
    attribute: null,
    expression: null,
  };
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

export function createQualifyStatement(): QualifyStatement {
  return {
    kind: SyntaxKind.QualifyStatement,
    container: null,
    statements: [],
    end: null,
  };
}

export interface ReservedAttribute extends AstNode {
  kind: SyntaxKind.ReservedAttribute;
  importedToken: Token | null;
}

export function createReservedAttribute(): ReservedAttribute {
  return {
    kind: SyntaxKind.ReservedAttribute,
    container: null,
    importedToken: null,
  };
}

export interface ReplaceStatement extends AstNode {
  kind: SyntaxKind.ReplaceStatement;
  name: string | null;
  nameToken: Token | null;
  literal: Literal | null;
}
export function createReplaceStatement(): ReplaceStatement {
  return {
    kind: SyntaxKind.ReplaceStatement,
    container: null,
    name: null,
    nameToken: null,
    literal: null,
  };
}
export interface ReadStatement extends AstNode {
  kind: SyntaxKind.ReadStatement;
  arguments: ReadStatementOption[];
}

export function createReadStatement(): ReadStatement {
  return {
    kind: SyntaxKind.ReadStatement,
    container: null,
    arguments: [],
  };
}

export interface ReadStatementOption extends AstNode {
  kind: SyntaxKind.ReadStatementOption;
  type: ReadStatementType | null;
  value: Expression | null;
}

export function createReadStatementOption(): ReadStatementOption {
  return {
    kind: SyntaxKind.ReadStatementOption,
    container: null,
    type: null,
    value: null,
  };
}

export interface ReferenceItem extends AstNode {
  kind: SyntaxKind.ReferenceItem;
  ref: Reference<NamedElement> | null;
  dimensions: Dimensions[];
}
export function createReferenceItem(): ReferenceItem {
  return {
    kind: SyntaxKind.ReferenceItem,
    container: null,
    ref: null,
    dimensions: [],
  };
}
export interface ReinitStatement extends AstNode {
  kind: SyntaxKind.ReinitStatement;
  reference: LocatorCall | null;
}

export function createReinitStatement(): ReinitStatement {
  return {
    kind: SyntaxKind.ReinitStatement,
    container: null,
    reference: null,
  };
}

export interface ReleaseStatement extends AstNode {
  kind: SyntaxKind.ReleaseStatement;
  star: boolean;
  references: string[];
}

export function createReleaseStatement(): ReleaseStatement {
  return {
    kind: SyntaxKind.ReleaseStatement,
    container: null,
    star: false,
    references: [],
  };
}

export interface Reserves extends AstNode {
  kind: SyntaxKind.Reserves;
  all: boolean;
  variables: string[];
}

export function createReserves(): Reserves {
  return {
    kind: SyntaxKind.Reserves,
    container: null,
    all: false,
    variables: [],
  };
}

export interface ResignalStatement extends AstNode {
  kind: SyntaxKind.ResignalStatement;
}

export function createResignalStatement(): ResignalStatement {
  return {
    kind: SyntaxKind.ResignalStatement,
    container: null,
  };
}

export interface ReturnsAttribute extends AstNode {
  kind: SyntaxKind.ReturnsAttribute;
  attrs: (
    | ComputationDataAttribute
    | DateAttribute
    | ValueListAttribute
    | ValueRangeAttribute
    | AnyAttribute
  )[];
}

export function createReturnsAttribute(): ReturnsAttribute {
  return {
    kind: SyntaxKind.ReturnsAttribute,
    container: null,
    attrs: [],
  };
}

export interface ReturnsOption extends AstNode {
  kind: SyntaxKind.ReturnsOption;
  returnAttributes: DeclarationAttribute[];
  returnsToken: Token | null;
}
export function createReturnsOption(): ReturnsOption {
  return {
    kind: SyntaxKind.ReturnsOption,
    container: null,
    returnAttributes: [],
    returnsToken: null,
  };
}
export interface ReturnStatement extends AstNode {
  kind: SyntaxKind.ReturnStatement;
  expression: Expression | null;
  returnToken: Token | null;
}
export function createReturnStatement(): ReturnStatement {
  return {
    kind: SyntaxKind.ReturnStatement,
    container: null,
    expression: null,
    returnToken: null,
  };
}
export interface RevertStatement extends AstNode {
  kind: SyntaxKind.RevertStatement;
  conditions: Condition[];
}

export function createRevertStatement(): RevertStatement {
  return {
    kind: SyntaxKind.RevertStatement,
    container: null,
    conditions: [],
  };
}

export interface RewriteStatement extends AstNode {
  kind: SyntaxKind.RewriteStatement;
  arguments: RewriteStatementOption[];
}

export function createRewriteStatement(): RewriteStatement {
  return {
    kind: SyntaxKind.RewriteStatement,
    container: null,
    arguments: [],
  };
}

export interface RewriteStatementOption extends AstNode {
  kind: SyntaxKind.RewriteStatementOption;
  type: RewriteStatementType | null;
  value: Expression | null;
}

export function createRewriteStatementOption(): RewriteStatementOption {
  return {
    kind: SyntaxKind.RewriteStatementOption,
    container: null,
    type: null,
    value: null,
  };
}

export interface RFormatItem extends AstNode {
  kind: SyntaxKind.RFormatItem;
  labelReference: string | null;
}

export function createRFormatItem(): RFormatItem {
  return {
    kind: SyntaxKind.RFormatItem,
    container: null,
    labelReference: null,
  };
}

export type SelectCase = WhenStatement | OtherwiseStatement;
export interface SelectStatement extends AstNode {
  kind: SyntaxKind.SelectStatement;
  on: Expression | null;
  cases: SelectCase[];
  end: EndStatement | null;
  selectToken: Token | null;
}
export function createSelectStatement(): SelectStatement {
  return {
    kind: SyntaxKind.SelectStatement,
    container: null,
    on: null,
    cases: [],
    end: null,
    selectToken: null,
  };
}
export interface SignalStatement extends AstNode {
  kind: SyntaxKind.SignalStatement;
  condition: Condition[];
}

export function createSignalStatement(): SignalStatement {
  return {
    kind: SyntaxKind.SignalStatement,
    container: null,
    condition: [],
  };
}

export interface SimpleOptionsItem extends AstNode {
  kind: SyntaxKind.SimpleOptionsItem;
  value: SimpleOptions | null;
}

export function createSimpleOptionsItem(): SimpleOptionsItem {
  return {
    kind: SyntaxKind.SimpleOptionsItem,
    container: null,
    value: null,
  };
}

export interface SkipDirective extends AstNode {
  kind: SyntaxKind.SkipDirective;
  token: Token | null;
  lines: Expression | null;
  lineCount: number;
}
export function createSkipDirective(): SkipDirective {
  return {
    kind: SyntaxKind.SkipDirective,
    container: null,
    token: null,
    lines: null,
    lineCount: 1,
  };
}
export interface SkipFormatItem extends AstNode {
  kind: SyntaxKind.SkipFormatItem;
  skip: Expression | null;
}

export function createSkipFormatItem(): SkipFormatItem {
  return {
    kind: SyntaxKind.SkipFormatItem,
    container: null,
    skip: null,
  };
}

export interface Statement extends AstNode {
  kind: SyntaxKind.Statement;
  condition: ConditionPrefix | null;
  labels: LabelPrefix[];
  value: Unit | null;
  startToken: Token | null;
  endToken: Token | null;
}
export function createStatement(): Statement {
  return {
    kind: SyntaxKind.Statement,
    container: null,
    condition: null,
    labels: [],
    value: null,
    startToken: null,
    endToken: null,
  };
}
export interface StopStatement extends AstNode {
  kind: SyntaxKind.StopStatement;
}

export function createStopStatement(): StopStatement {
  return {
    kind: SyntaxKind.StopStatement,
    container: null,
  };
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
export interface TypeAttribute extends AstNode {
  kind: SyntaxKind.TypeAttribute;
  type: Reference<NamedType> | null;
  /**
   * To differentiate whether "TYPE" or "ORDINAL" was used
   *
   * "ORDINAL" is only valid for references to ordinal types.
   */
  typeToken: Token | null;
}

export function createTypeAttribute(): TypeAttribute {
  return {
    kind: SyntaxKind.TypeAttribute,
    container: null,
    type: null,
    typeToken: null,
  };
}

export interface UnaryExpression extends AstNode {
  kind: SyntaxKind.UnaryExpression;
  op: UnaryOperator | null;
  expr: Expression | null;
}

export function createUnaryExpression(): UnaryExpression {
  return {
    kind: SyntaxKind.UnaryExpression,
    container: null,
    op: null,
    expr: null,
  };
}

export interface ValueAttribute extends AstNode {
  kind: SyntaxKind.ValueAttribute;
  value: Expression | null;
}

export function createValueAttribute(): ValueAttribute {
  return {
    kind: SyntaxKind.ValueAttribute,
    container: null,
    value: null,
  };
}

export interface ValueListAttribute extends AstNode {
  kind: SyntaxKind.ValueListAttribute;
  values: Expression[];
}

export function createValueListAttribute(): ValueListAttribute {
  return {
    kind: SyntaxKind.ValueListAttribute,
    container: null,
    values: [],
  };
}

export interface ValueListFromAttribute extends AstNode {
  kind: SyntaxKind.ValueListFromAttribute;
  from: LocatorCall | null;
}

export function createValueListFromAttribute(): ValueListFromAttribute {
  return {
    kind: SyntaxKind.ValueListFromAttribute,
    container: null,
    from: null,
  };
}

export interface ValueRangeAttribute extends AstNode {
  kind: SyntaxKind.ValueRangeAttribute;
  values: Expression[];
}

export function createValueRangeAttribute(): ValueRangeAttribute {
  return {
    kind: SyntaxKind.ValueRangeAttribute,
    container: null,
    values: [],
  };
}

export interface VFormatItem extends AstNode {
  kind: SyntaxKind.VFormatItem;
}

export function createVFormatItem(): VFormatItem {
  return {
    kind: SyntaxKind.VFormatItem,
    container: null,
  };
}

export interface WaitStatement extends AstNode {
  kind: SyntaxKind.WaitStatement;
  task: LocatorCall | null;
}

export function createWaitStatement(): WaitStatement {
  return {
    kind: SyntaxKind.WaitStatement,
    container: null,
    task: null,
  };
}

export interface WhenStatement extends AstNode {
  kind: SyntaxKind.WhenStatement;
  conditions: Expression[];
  unit: Statement | null;
  range: Range | null;
}
export function createWhenStatement(): WhenStatement {
  return {
    kind: SyntaxKind.WhenStatement,
    container: null,
    conditions: [],
    unit: null,
    range: null,
  };
}
export interface WriteStatement extends AstNode {
  kind: SyntaxKind.WriteStatement;
  arguments: WriteStatementOption[];
}

export function createWriteStatement(): WriteStatement {
  return {
    kind: SyntaxKind.WriteStatement,
    container: null,
    arguments: [],
  };
}

export interface WriteStatementOption extends AstNode {
  kind: SyntaxKind.WriteStatementOption;
  type: WriteStatementType | null;
  value: Expression | null;
}

export function createWriteStatementOption(): WriteStatementOption {
  return {
    kind: SyntaxKind.WriteStatementOption,
    container: null,
    type: null,
    value: null,
  };
}

export interface XFormatItem extends AstNode {
  kind: SyntaxKind.XFormatItem;
  width: Expression | null;
}

export enum SqlAttributeBinaryType {
  BINARY,
  VARBINARY,
}

export interface SqlAttributeBinary extends AstNode {
  kind: SyntaxKind.SqlAttributeBinary;
  type: SqlAttributeBinaryType | null;
  length: number | null;
  size: SQLAttributeLobSize | null;
}

export function createSqlAttributeBinary(): SqlAttributeBinary {
  return {
    kind: SyntaxKind.SqlAttributeBinary,
    container: null,
    type: null,
    length: null,
    size: null,
  };
}

export function createXFormatItem(): XFormatItem {
  return {
    kind: SyntaxKind.XFormatItem,
    container: null,
    width: null,
  };
}

export enum SQLAttributeLobType {
  BLOB,
  CLOB,
  DBCLOB,
}

export enum SQLAttributeLobSize {
  K,
  M,
  G,
}

export interface SqlAttributeLob extends AstNode {
  kind: SyntaxKind.SqlAttributeLob;
  type: SQLAttributeLobType | null;
  length: number | null;
  size: SQLAttributeLobSize | null;
}

export function createSqlAttributeLob(): SqlAttributeLob {
  return {
    kind: SyntaxKind.SqlAttributeLob,
    container: null,
    type: null,
    length: null,
    size: null,
  };
}

export interface SqlAttributeLobLocator extends AstNode {
  kind: SyntaxKind.SqlAttributeLobLocator;
  type: SQLAttributeLobType | null;
}

export function createSqlAttributeLobLocator(): SqlAttributeLobLocator {
  return {
    kind: SyntaxKind.SqlAttributeLobLocator,
    container: null,
    type: null,
  };
}

export interface SqlAttributeLobFile extends AstNode {
  kind: SyntaxKind.SqlAttributeLobFile;
  type: SQLAttributeLobType | null;
}

export function createSqlAttributeLobFile(): SqlAttributeLobFile {
  return {
    kind: SyntaxKind.SqlAttributeLobFile,
    container: null,
    type: null,
  };
}

export interface SqlAttributeRowId extends AstNode {
  kind: SyntaxKind.SqlAttributeRowId;
}

export function createSqlAttributeRowId(): SqlAttributeRowId {
  return {
    kind: SyntaxKind.SqlAttributeRowId,
    container: null,
  };
}

export interface SqlAttributeTableLocator extends AstNode {
  kind: SyntaxKind.SqlAttributeTableLocator;
  name: string | null;
  nameToken: Token | null;
}

export function createSqlAttributeTableLocator(): SqlAttributeTableLocator {
  return {
    kind: SyntaxKind.SqlAttributeTableLocator,
    container: null,
    name: null,
    nameToken: null,
  };
}

export interface SqlAttributeResultSetLocator extends AstNode {
  kind: SyntaxKind.SqlAttributeResultSetLocator;
}

export function createSqlAttributeResultSetLocator(): SqlAttributeResultSetLocator {
  return {
    kind: SyntaxKind.SqlAttributeResultSetLocator,
    container: null,
  };
}

export type SqlAttributeType =
  | SqlAttributeBinary
  | SqlAttributeLob
  | SqlAttributeLobLocator
  | SqlAttributeLobFile
  | SqlAttributeRowId
  | SqlAttributeTableLocator
  | SqlAttributeResultSetLocator;

export interface SqlAttributeStatement extends AstNode {
  kind: SyntaxKind.SqlAttributeStatement;
  isXml: boolean;
  body: SqlAttributeType | null;
}

export function createSQLAttributeStatement(): SqlAttributeStatement {
  return {
    kind: SyntaxKind.SqlAttributeStatement,
    container: null,
    isXml: false,
    body: null,
  };
}

// Values sourced from:
// https://www.ibmmainframer.com/cics-tutorial/cics-response-option/
export enum CicsResponseCode {
  NORMAL = 0,
  NOTFND = 13,
  DUPREC = 14,
  INVREQ = 16,
  NOSPACE = 18,
  NOTOPEN = 19,
  ENDFILE = 20,
  LENGERR = 22,
  QZERO = 23,
  QBUSY = 25,
  ITEMERR = 26,
  PGMIDERR = 27,
  ENDDATA = 29,
  MAPFAIL = 36,
  QIDERR = 44,
  ENQBUSY = 55,
  DISABLED = 84,
}

export interface CicsResponseStatement extends AstNode {
  kind: SyntaxKind.CicsResponseStatement;
  token: Token | null;
  code: CicsResponseCode | null;
  codeToken: Token | null;
}

export function createCicsResponseStatement(): CicsResponseStatement {
  return {
    kind: SyntaxKind.CicsResponseStatement,
    container: null,
    token: null,
    code: null,
    codeToken: null,
  };
}

export enum PreprocessorType {
  CICS,
  SQL,
  UNKNOWN,
}

export interface PreprocessorToken {
  token: Token;
  semanticType: SemanticTokenTypes;
}

export interface ExecStatement extends AstNode {
  kind: SyntaxKind.ExecStatement;
  execToken: Token | null;
  preprocessorType: PreprocessorType;
  preprocessorTokens: PreprocessorToken[];
  replacement: string | IncludeDirective | null;
}

export function createExecStatement(): ExecStatement {
  return {
    kind: SyntaxKind.ExecStatement,
    execToken: null,
    container: null,
    preprocessorType: PreprocessorType.UNKNOWN,
    preprocessorTokens: [],
    replacement: null,
  };
}

export interface ExecVariableReference extends AstNode {
  kind: SyntaxKind.ExecVariableReference;
  ref: Reference<NamedVariable> | null;
}

export function createExecVariableReference(): ExecVariableReference {
  return {
    kind: SyntaxKind.ExecVariableReference,
    container: null,
    ref: null,
  };
}
