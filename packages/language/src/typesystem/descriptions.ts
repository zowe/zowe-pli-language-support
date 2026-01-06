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

import { Token } from "../parser/tokens";
import * as ast from "../syntax-tree/ast";
import { assertUnreachable } from "../utils/common";

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=attributes-nondata#ndatts__vari */

export type Value = {
  type: TypeDescriptions.Any;
  value: string | number;
};

/** Makes T partial except for properties P, they are required */
export type PartialPartial<T, P extends keyof T> = Partial<Omit<T, P>> &
  Required<Omit<T, Exclude<keyof T, P>>>;

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

export const DataTypesArray: DataType[] = [
  DataType.Area,
  DataType.Arithmetic,
  DataType.Entry,
  DataType.File,
  DataType.Format,
  DataType.Label,
  DataType.Locator,
  DataType.Ordinal,
  DataType.Picture,
  DataType.String,
  DataType.Structure,
  DataType.Task,
  DataType.Union,
  DataType.Unknown,
];

export enum AttributeKind {
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-sequential-direct-attributes */
  AccessMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=alignment-aligned-unaligned-attributes */
  Alignment,
  /** TODO still needs to be handled by the type builder */
  AreaSize,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-assignable-nonassignable-attributes */
  Assignability,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-coded-arithmetic-data */
  Base,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-buffered-unbuffered-attributes */
  BufferMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-connected-nonconnected-attributes */
  Connection,
  /** This is a meta type that can be set by different attributes. */
  DataType,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=arrays-dimension-attribute */
  Dimension,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-bigendian-littleendian-attributes */
  Endianess,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-record-stream-attributes */
  FileUsage,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-hexadec-ieee-attributes */
  FloatFormat,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-initial-attribute */
  Initial,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=data-list-attribute */
  List,
  /** TODO need to find out whether LocatorKind can be split into more attribute kinds */
  LocatorKind,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-real-complex */
  NumberMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=data-optional-attribute */
  Optional,
  /** TODO still needs to be handled by the type builder */
  OrdinalNames,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-parameter-attribute */
  Parameter,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-using-inonly-inout-outonly */
  ParameterPassDirection,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-using-byvalue-byaddr */
  ParameterPassMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-picture-widepic */
  PictureKind,
  /**
   * TODO still needs to be handled by the type builder
   * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-defined-position-attributes
   */
  Position,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-precision-attribute */
  Precision,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-fixed-float */
  Scale,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=declarations-internal-external-attributes */
  Scope,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=facilities-preprocessor-scan */
  ScanMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=unions-like-attribute */
  SetLike,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=variables-type-attribute */
  SetType,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-signed-unsigned */
  Sign,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation */
  Storage,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-varying-varying4-varyingz-nonvarying */
  StringFormat,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-bit-character-graphic-uchar-widechar */
  StringKind,
  /** TODO belongs to StringKind, maybe refactor later */
  StringLength,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-input-output-update-attributes */
  TransmissionDirection,
  /**
   * TODO still needs to be handled by the type builder
   * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-variable-attribute
   */
  Variable,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-normal-abnormal-attributes */
  Volatility,
}

export const AttributeKinds: AttributeKind[] = [
  AttributeKind.AccessMode,
  AttributeKind.Alignment,
  AttributeKind.AreaSize,
  AttributeKind.Assignability,
  AttributeKind.Base,
  AttributeKind.BufferMode,
  AttributeKind.Connection,
  AttributeKind.DataType,
  AttributeKind.Dimension,
  AttributeKind.Endianess,
  AttributeKind.FileUsage,
  AttributeKind.FloatFormat,
  AttributeKind.Initial,
  AttributeKind.LocatorKind,
  AttributeKind.NumberMode,
  AttributeKind.Optional,
  AttributeKind.OrdinalNames,
  AttributeKind.Parameter,
  AttributeKind.ParameterPassDirection,
  AttributeKind.ParameterPassMode,
  AttributeKind.PictureKind,
  AttributeKind.Position,
  AttributeKind.Precision,
  AttributeKind.Scale,
  AttributeKind.ScanMode,
  AttributeKind.Scope,
  AttributeKind.Sign,
  AttributeKind.Storage,
  AttributeKind.StringFormat,
  AttributeKind.StringKind,
  AttributeKind.StringLength,
  AttributeKind.TransmissionDirection,
  AttributeKind.SetLike,
  AttributeKind.SetType,
  AttributeKind.Variable,
  AttributeKind.Volatility,
];

export type Bound = {
  value: number | "*" | undefined;
  expression: ast.Wildcard<ast.Expression> | null;
  refersTo: ast.LocatorCall | null;
};

export type DimensionBound = {
  lowerBound: Bound;
  upperBound: Bound;
};

export type AttributeTypes = {
  [AttributeKind.AccessMode]: AccessMode;
  [AttributeKind.Alignment]: Alignment;
  [AttributeKind.AreaSize]: number;
  [AttributeKind.Assignability]: Assignability;
  [AttributeKind.Base]: Base;
  [AttributeKind.BufferMode]: BufferMode;
  [AttributeKind.Connection]: StorageConnection;
  [AttributeKind.DataType]: DataType;
  [AttributeKind.Dimension]: DimensionBound[] | undefined;
  [AttributeKind.Endianess]: Endianess;
  [AttributeKind.FileUsage]: FileUsage;
  [AttributeKind.FloatFormat]: FloatFormat;
  [AttributeKind.Initial]: ast.InitialAttribute | undefined;
  [AttributeKind.List]: boolean;
  [AttributeKind.LocatorKind]: LocatorKind;
  [AttributeKind.NumberMode]: NumberMode;
  [AttributeKind.Optional]: boolean;
  [AttributeKind.OrdinalNames]: string[];
  [AttributeKind.Parameter]: boolean;
  [AttributeKind.ParameterPassDirection]: ParameterPassDirection;
  [AttributeKind.ParameterPassMode]: ParameterPassMode | undefined;
  [AttributeKind.PictureKind]: PictureWideness;
  [AttributeKind.Position]: StoragePosition;
  [AttributeKind.Precision]: Precision;
  [AttributeKind.Scale]: ScaleMode;
  [AttributeKind.ScanMode]: ast.ScanMode;
  [AttributeKind.Scope]: Scope;
  [AttributeKind.SetLike]: ast.LocatorCall | null;
  [AttributeKind.SetType]: ast.NamedType | null;
  [AttributeKind.Sign]: Sign;
  [AttributeKind.Storage]: StorageClass;
  [AttributeKind.StringFormat]: StringFormat;
  [AttributeKind.StringKind]: StringKind;
  [AttributeKind.StringLength]: number;
  [AttributeKind.TransmissionDirection]: TransmissionDirection;
  [AttributeKind.Variable]: boolean;
  [AttributeKind.Volatility]: Volatility;
};

export const CommonAttributeKinds: AttributeKind[] = [
  AttributeKind.DataType,

  AttributeKind.Alignment,
  AttributeKind.Assignability,
  AttributeKind.Connection,
  AttributeKind.Dimension,
  AttributeKind.Initial,
  AttributeKind.ParameterPassMode,
  AttributeKind.Position,
  AttributeKind.Scope,
  AttributeKind.Storage,
  AttributeKind.Variable,
  AttributeKind.Volatility,

  AttributeKind.SetLike,
  AttributeKind.SetType,
];

export const AttributeKindsByDataType: Record<DataType, AttributeKind[]> = {
  [DataType.Unknown]: [...CommonAttributeKinds],
  [DataType.Structure]: [],
  [DataType.Union]: [],
  [DataType.Area]: [
    ...CommonAttributeKinds,
    AttributeKind.AreaSize,
    AttributeKind.Endianess,
  ],
  [DataType.Arithmetic]: [
    ...CommonAttributeKinds,
    AttributeKind.Scale,
    AttributeKind.Base,
    AttributeKind.Sign,
    AttributeKind.Precision,
    AttributeKind.NumberMode,
    AttributeKind.Endianess,
    AttributeKind.FloatFormat,
  ],
  [DataType.File]: [
    ...CommonAttributeKinds,
    AttributeKind.AccessMode,
    AttributeKind.BufferMode,
    AttributeKind.FileUsage,
    AttributeKind.TransmissionDirection,
  ],
  [DataType.Format]: [...CommonAttributeKinds],
  [DataType.Label]: [...CommonAttributeKinds],
  [DataType.Locator]: [...CommonAttributeKinds, AttributeKind.LocatorKind],
  [DataType.Entry]: [...CommonAttributeKinds],
  [DataType.Ordinal]: [...CommonAttributeKinds, AttributeKind.OrdinalNames],
  [DataType.Picture]: [
    ...CommonAttributeKinds,
    AttributeKind.PictureKind,
    AttributeKind.NumberMode,
  ],
  [DataType.String]: [
    ...CommonAttributeKinds,
    AttributeKind.StringKind,
    AttributeKind.StringFormat,
    AttributeKind.StringLength,
  ],
  [DataType.Task]: [...CommonAttributeKinds],
};

export type AttributeWitness<K extends keyof AttributeTypes> = {
  value: AttributeTypes[K];
  witness: ast.DeclarationAttribute;
  image: string;
  token: Token;
  implicit: boolean;
};

export type AttributeWitnesses = {
  [K in keyof AttributeTypes]: AttributeWitness<K> | null;
};

export const DataTypesByAttributeKind = Object.entries(
  AttributeKindsByDataType,
).reduce(
  (acc, [type, properties]) => {
    for (const property of properties) {
      (acc[property] ??= []).push(Number(type) as DataType);
    }
    return acc;
  },
  {} as Record<AttributeKind, DataType[]>,
);

interface BaseTypeDescriptionProps {
  alignment: Alignment;
  assignability: Assignability;
  connection: StorageConnection;
  dimension?: DimensionBound[];
  initial?: ast.InitialAttribute;
  list: boolean;
  optional: boolean;
  parameter: boolean;
  parameterPassDirection?: ParameterPassDirection;
  parameterPassMode?: ParameterPassMode;
  position?: StoragePosition;
  scanMode?: ast.ScanMode;
  scope: Scope;
  storage: StorageClass;
  variable?: boolean;
  volatility: Volatility;
}

interface WithTypeDescriminator {
  type: DataType;
}

interface WithParentType {
  parentType?: TypeDescriptions.Structure | TypeDescriptions.Union; //TODO: TypeDescriptions.Union;
}

interface BaseTypeDescription
  extends WithTypeDescriminator,
    BaseTypeDescriptionProps,
    WithParentType {}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=alignment-aligned-unaligned-attributes */
export enum AlignmentType {
  Aligned,
  Unaligned,
}
export type Alignment =
  | { type: AlignmentType.Aligned; alignment: 1 | 2 | 4 | 8 }
  | { type: AlignmentType.Unaligned };

export const Alignments = {
  Aligned: (alignment: 1 | 2 | 4 | 8) => ({
    type: AlignmentType.Aligned,
    alignment,
  }),
  Unaligned: () => ({ type: AlignmentType.Unaligned }),
};

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=declarations-internal-external-attributes */
export enum ScopeType {
  Internal,
  External,
}
export type Scope =
  | { type: ScopeType.Internal }
  | { type: ScopeType.External; environment: string };

export const Scopes = {
  Internal: ScopeType.Internal,
  External: (environment: string) => ({
    type: ScopeType.External,
    environment,
  }),
};

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation */
export enum StorageClass {
  Automatic,
  Static,
  Based,
  Controlled,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-connected-nonconnected-attributes */
export enum StorageConnection {
  Connected,
  Nonconnected,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-assignable-nonassignable-attributes */
export enum Assignability {
  Assignable,
  Nonassignable,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-defined-position-attributes */
export type StoragePosition = {
  //DEFINED variable [POSITION (position)]
  variable: null; //TODO set to "Variable" AstNode
  position: null; //TODO set to "Expression" AstNode
};

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-normal-abnormal-attributes */
export enum Volatility {
  Normal,
  Abnormal,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-using-byvalue-byaddr */
export enum ParameterPassMode {
  ByAddr,
  ByValue,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-using-inonly-inout-outonly */
export enum ParameterPassDirection {
  InOnly,
  OutOnly,
  InOut,
}

/* TODO for storage attributes:
Parameter:
PARAMETER
[CONTROLLED]

@see https://www.ibm.com/docs/en/epfz/6.1?topic=control-initial-attribute
[INITIAL
[CALL]]
*/

function createBaseTypeDescription(
  type: TypeDescriptions.TypeDescriptionType,
  {
    alignment,
    connection,
    scope,
    storage,
    volatility,
    position,
    dimension,
    assignability,
    variable,
    scanMode,
    list,
    parameterPassDirection,
    parameterPassMode,
    initial,
    optional,
    parameter,
  }: Partial<BaseTypeDescriptionProps>,
): BaseTypeDescriptionProps {
  if (!alignment) {
    if (type === PictureType || type === StringType) {
      alignment = { type: AlignmentType.Unaligned };
    } else {
      alignment = { type: AlignmentType.Aligned, alignment: 1 }; //TODO no documentation of default value for alignment
    }
  }

  if (variable !== undefined) {
    if (type !== EntryType && type !== FileType && type !== LabelType) {
      variable = undefined;
    }
  }

  assignability ??= TypeDescriptions.DefaultValues[AttributeKind.Assignability];
  connection ??= TypeDescriptions.DefaultValues[AttributeKind.Connection];
  scope ??= TypeDescriptions.DefaultValues[AttributeKind.Scope];
  volatility ??= TypeDescriptions.DefaultValues[AttributeKind.Volatility];
  list ??= TypeDescriptions.DefaultValues[AttributeKind.List];
  optional ??= TypeDescriptions.DefaultValues[AttributeKind.Optional];
  parameter ??= TypeDescriptions.DefaultValues[AttributeKind.Parameter];
  initial ??= TypeDescriptions.DefaultValues[AttributeKind.Initial];
  scanMode ??= TypeDescriptions.DefaultValues[AttributeKind.ScanMode];

  if (!storage) {
    if (scope?.type === ScopeType.Internal) {
      storage = StorageClass.Automatic;
    } else {
      storage = StorageClass.Static;
    }
  }

  return {
    alignment,
    assignability,
    connection,
    dimension,
    initial,
    list,
    optional,
    parameter,
    parameterPassDirection,
    parameterPassMode,
    position,
    scanMode,
    scope,
    storage,
    variable,
    volatility,
  };
}

//--- Area ---
const AreaType = DataType.Area;
type AreaType = typeof AreaType;

interface AreaTypeDescriptionProps extends BaseTypeDescriptionProps {
  size: number;
}

interface AreaTypeDescription
  extends BaseTypeDescription,
    AreaTypeDescriptionProps {
  type: AreaType;
}

/**
 * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-area-data-attribute
 */
function createAreaTypeDescription({
  size = 1000,
  ...base
}: Partial<AreaTypeDescriptionProps>): AreaTypeDescription {
  return {
    type: AreaType,
    ...createBaseTypeDescription(AreaType, base),
    size,
  };
}

function isAreaTypeDescription(
  description: WithTypeDescriminator,
): description is AreaTypeDescription {
  return description.type === AreaType;
}

//--- Arithmetic ---
const ArithmeticType = DataType.Arithmetic;
type ArithmeticType = typeof ArithmeticType;

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-hexadec-ieee-attributes */
export enum FloatFormat {
  IEEE,
  HexaDec,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-bigendian-littleendian-attributes */
export enum Endianess {
  Big,
  Little,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-coded-arithmetic-data */
export enum NumberMode {
  Real,
  Complex,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-coded-arithmetic-data */
export enum Base {
  Binary,
  Decimal,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-fixed-float */
export enum ScaleMode {
  Fixed,
  Float,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-precision-attribute */
export type Precision = {
  totalDigitsCount: number;
  fractionalDigitsCount?: number;
};

export const Precisions = {
  create: (totalDigitsCount: number = 5, fractionalDigitsCount?: number) => ({
    totalDigitsCount,
    fractionalDigitsCount,
  }),
};

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-signed-unsigned */
export enum Sign {
  Signed,
  Unsigned,
}

interface ArithmeticTypeDescriptionProps {
  mode: NumberMode;
  scale: ScaleMode;
  precision: Precision;
  base: Base;
  sign: Sign;
  endianness: Endianess;
  floatFormat: FloatFormat;
}

interface ArithmeticTypeDescription
  extends BaseTypeDescription,
    ArithmeticTypeDescriptionProps {
  type: ArithmeticType;
}

//@see https://www.microfocus.com/documentation/openpli/80/pulang.htm
//Data  Type   	Max Precision   	Default Precision
//Fixed Binary	31	                15*
//Fixed Decimal	18	                5
//Float Binary	52	                23
//Float Decimal	16	                6
//TODO * The -Iongint Compiler option changes the default precision of fixed binary from 15 to 31.
export const DefaultPrecisions: Record<ScaleMode, Record<Base, number>> = {
  [ScaleMode.Float]: {
    [Base.Binary]: 23,
    [Base.Decimal]: 6,
  },
  [ScaleMode.Fixed]: {
    [Base.Binary]: 15,
    [Base.Decimal]: 5,
  },
};

export const MaximumPrecisions: Record<ScaleMode, Record<Base, number>> = {
  [ScaleMode.Float]: {
    [Base.Binary]: 52,
    [Base.Decimal]: 16,
  },
  [ScaleMode.Fixed]: {
    [Base.Binary]: 31,
    [Base.Decimal]: 18,
  },
};

//TODO endianness default value depends on platform (BIGENDIAN except on Intel where the default is LITTLEENDIAN)
function createArithmeticTypeDescription({
  mode = NumberMode.Real,
  scale = ScaleMode.Float,
  base: unit = Base.Decimal,
  precision = { totalDigitsCount: 5, fractionalDigitsCount: 0 },
  sign = Sign.Signed,
  endianness = Endianess.Big,
  //TODO default value depends on platform?
  floatFormat = FloatFormat.IEEE,
  ...base
}: Partial<ArithmeticTypeDescriptionProps>): ArithmeticTypeDescription {
  return {
    type: ArithmeticType,
    ...createBaseTypeDescription(ArithmeticType, base),
    mode,
    scale,
    precision,
    base: unit,
    sign,
    endianness,
    floatFormat,
  };
}

function isArithmeticTypeDescription(
  description: WithTypeDescriminator,
): description is ArithmeticTypeDescription {
  return description.type === ArithmeticType;
}

//--- File ---
const FileType = DataType.File;
type FileType = typeof FileType;

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-buffered-unbuffered-attributes */
export enum BufferMode {
  Unbuffered,
  Buffered,
}

/**
 * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-sequential-direct-attributes
 */
export enum AccessMode {
  Sequential,
  Direct,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-record-stream-attributes */
export enum FileUsage {
  Record,
  Stream,
}

export enum TransmissionDirection {
  Input,
  Output,
  Update,
}

interface FileTypeDescriptionProps extends BaseTypeDescriptionProps {
  accessMode: AccessMode;
  bufferMode: BufferMode;
  transmissionDirection: TransmissionDirection;
  usage: FileUsage;
}

interface FileTypeDescription
  extends BaseTypeDescription,
    FileTypeDescriptionProps {
  type: FileType;
}

function createFileTypeDescription({
  usage = FileUsage.Stream,
  accessMode = AccessMode.Sequential,
  bufferMode = accessMode === AccessMode.Sequential
    ? BufferMode.Buffered
    : BufferMode.Unbuffered,
  transmissionDirection = TransmissionDirection.Input,
  ...base
}: Partial<FileTypeDescriptionProps>): FileTypeDescription {
  return {
    type: FileType,
    ...createBaseTypeDescription(FileType, base),
    accessMode,
    bufferMode,
    transmissionDirection,
    usage,
  };
}

function isFileTypeDescription(
  description: WithTypeDescriminator,
): description is FileTypeDescription {
  return description.type === FileType;
}

//--- Format ---
const FormatType = DataType.Format;
type FormatType = typeof FormatType;

interface FormatTypeDescriptionProps extends BaseTypeDescriptionProps {}

interface FormatTypeDescription
  extends BaseTypeDescription,
    FormatTypeDescriptionProps {
  type: FormatType;
}

function createFormatTypeDescription({
  ...base
}: Partial<FormatTypeDescriptionProps>): FormatTypeDescription {
  return {
    type: FormatType,
    ...createBaseTypeDescription(FormatType, base),
  };
}

function isFormatTypeDescription(
  description: WithTypeDescriminator,
): description is FormatTypeDescription {
  return description.type === FormatType;
}

//--- Label ---
const LabelType = DataType.Label;
type LabelType = typeof LabelType;

interface LabelTypeDescriptionProps extends BaseTypeDescriptionProps {}

interface LabelTypeDescription
  extends BaseTypeDescription,
    LabelTypeDescriptionProps {
  type: LabelType;
}

function createLabelTypeDescription({
  ...base
}: Partial<LabelTypeDescriptionProps>): LabelTypeDescription {
  return {
    type: LabelType,
    ...createBaseTypeDescription(LabelType, base),
  };
}

function isLabelTypeDescription(
  description: WithTypeDescriminator,
): description is LabelTypeDescription {
  return description.type === LabelType;
}

//--- Locator ---
const LocatorType = DataType.Locator;
type LocatorType = typeof LocatorType;

/**
 * TODO may need to be split into PointerKind, HandleKind, OffsetKind
 * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attribute-pointer-variable
 * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=unions-handle-attribute
 * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attribute-offset-data
 */
export type LocatorKind =
  | { type: "pointer"; size: 32 | 64 }
  | { type: "handle"; size: 32 | 64; structTypeName: string }
  | { type: "offset"; areaVariable: null };

interface LocatorTypeDescriptionProps extends BaseTypeDescriptionProps {
  kind: LocatorKind;
}

interface LocatorTypeDescription
  extends BaseTypeDescription,
    LocatorTypeDescriptionProps {
  type: LocatorType;
}

function createLocatorTypeDescription({
  kind,
  ...base
}: PartialPartial<
  LocatorTypeDescriptionProps,
  "kind"
>): LocatorTypeDescription {
  return {
    type: LocatorType,
    ...createBaseTypeDescription(LocatorType, base),
    kind,
  };
}

function isLocatorTypeDescription(
  description: WithTypeDescriminator,
): description is LocatorTypeDescription {
  return description.type === LocatorType;
}

//--- Entry ---
const EntryType = DataType.Entry;
type EntryType = typeof EntryType;

interface EntryTypeDescriptionProps extends BaseTypeDescriptionProps {}

interface EntryTypeDescription
  extends BaseTypeDescription,
    EntryTypeDescriptionProps {
  type: EntryType;
}

function createEntryTypeDescription({
  ...base
}: Partial<EntryTypeDescriptionProps>): EntryTypeDescription {
  return {
    type: EntryType,
    ...createBaseTypeDescription(EntryType, base),
  };
}

function isEntryTypeDescription(
  description: WithTypeDescriminator,
): description is EntryTypeDescription {
  return description.type === EntryType;
}

//--- Ordinal ---
const OrdinalType = DataType.Ordinal;
type OrdinalType = typeof OrdinalType;

interface OrdinalTypeDescriptionProps extends BaseTypeDescriptionProps {
  names: string[];
}

interface OrdinalTypeDescription
  extends BaseTypeDescription,
    OrdinalTypeDescriptionProps {
  type: OrdinalType;
}

function createOrdinalTypeDescription({
  names,
  ...base
}: PartialPartial<
  OrdinalTypeDescriptionProps,
  "names"
>): OrdinalTypeDescription {
  return {
    type: OrdinalType,
    ...createBaseTypeDescription(OrdinalType, base),
    names,
  };
}

function isOrdinalTypeDescription(
  description: WithTypeDescriminator,
): description is OrdinalTypeDescription {
  return description.type === OrdinalType;
}

//--- Picture ---
const PictureType = DataType.Picture;
type PictureType = typeof PictureType;

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-picture-widepic */
export enum PictureWideness {
  Picture,
  WidePicture,
}

interface PictureTypeDescriptionProps extends BaseTypeDescriptionProps {
  kind: PictureWideness;
  domain: NumberMode;
}

interface PictureTypeDescription
  extends BaseTypeDescription,
    PictureTypeDescriptionProps {
  type: PictureType;
}

function createPictureTypeDescription({
  kind,
  domain = NumberMode.Real,
  ...base
}: PartialPartial<
  PictureTypeDescriptionProps,
  "kind"
>): PictureTypeDescription {
  return {
    type: PictureType,
    ...createBaseTypeDescription(PictureType, base),
    kind,
    domain,
  };
}

function isPictureTypeDescription(
  description: WithTypeDescriminator,
): description is PictureTypeDescription {
  return description.type === PictureType;
}

//--- String ---
const StringType = DataType.String;
type StringType = typeof StringType;

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-bit-character-graphic-uchar-widechar */
export enum StringKind {
  Bit,
  Character,
  Graphic,
  UChar,
  WideChar,
}

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-varying-varying4-varyingz-nonvarying */
export enum StringFormat {
  Varying,
  Varying4,
  VaryingZ,
  NonVarying,
}

interface StringTypeDescriptionProps extends BaseTypeDescriptionProps {
  kind: StringKind;
  format: StringFormat;
  length: number;
}

interface StringTypeDescription
  extends BaseTypeDescription,
    StringTypeDescriptionProps {
  type: StringType;
}

function createStringTypeDescription({
  kind,
  format,
  length,
  ...base
}: PartialPartial<
  StringTypeDescriptionProps,
  "length" | "kind" | "format"
>): StringTypeDescription {
  return {
    type: StringType,
    ...createBaseTypeDescription(StringType, base),
    kind,
    length,
    format,
  };
}

function isStringTypeDescription(
  description: WithTypeDescriminator,
): description is StringTypeDescription {
  return description.type === StringType;
}

//--- Task ---
const TaskType = DataType.Task;
type TaskType = typeof TaskType;

interface TaskTypeDescriptionProps extends BaseTypeDescriptionProps {}

interface TaskTypeDescription
  extends BaseTypeDescription,
    TaskTypeDescriptionProps {
  type: TaskType;
}

function createTaskTypeDescription({
  ...base
}: Partial<TaskTypeDescriptionProps>): TaskTypeDescription {
  return {
    type: TaskType,
    ...createBaseTypeDescription(TaskType, base),
  };
}

function isTaskTypeDescription(
  description: WithTypeDescriminator,
): description is TaskTypeDescription {
  return description.type === TaskType;
}

//--- Unknown ---
const UnknownType = DataType.Unknown;
type UnknownType = typeof UnknownType;

interface UnknownTypeDescription extends BaseTypeDescription {
  type: UnknownType;
}

function createUnknownTypeDescription(): UnknownTypeDescription {
  return {
    type: UnknownType,
    ...createBaseTypeDescription(UnknownType, {}),
  };
}

//--- Structure ---
const StructureType = DataType.Structure;
type StructureType = typeof StructureType;

interface StructureTypeDescriptionProps {
  level: number;
  members: Record<string, TypeDescriptions.Any>;
  membersMetadata: Record<string, BuilderDeclareItem>;
}

interface StructureTypeDescription
  extends StructureTypeDescriptionProps,
    WithParentType {
  type: StructureType;
}

function createStructureTypeDescription({
  level,
  members = {},
  membersMetadata = {},
}: StructureTypeDescriptionProps): StructureTypeDescription {
  return {
    type: StructureType,
    level,
    members,
    membersMetadata,
  };
}

//--- Union ---
const UnionType = DataType.Union;
type UnionType = typeof UnionType;

interface UnionTypeDescriptionProps {
  level: number;
  members: Record<string, TypeDescriptions.Any>;
  membersMetadata: Record<string, BuilderDeclareItem>;
}

interface UnionTypeDescription
  extends UnionTypeDescriptionProps,
    WithParentType {
  type: UnionType;
}

function createUnionTypeDescription({
  level,
  members = {},
  membersMetadata = {},
}: UnionTypeDescriptionProps): UnionTypeDescription {
  return {
    type: UnionType,
    level,
    members,
    membersMetadata,
  };
}

//--- Implications between attributes ---

export type Implications = {
  [S in AttributeKind]: Partial<{
    [T in AttributeKind]: (
      value: AttributeTypes[S],
    ) => AttributeTypes[T] | undefined;
  }>;
};

/**
 * Defines implications between attributes, e.g. setting Precision implies setting Scale=<precision-dependent> and DataType=Arithmetic
 */
export const Implications: Partial<Implications> = {
  [AttributeKind.AccessMode]: {
    [AttributeKind.DataType]: () => DataType.File,
  },
  [AttributeKind.Alignment]: undefined,
  [AttributeKind.AreaSize]: undefined,
  [AttributeKind.Assignability]: undefined,
  [AttributeKind.Base]: {
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.BufferMode]: {
    [AttributeKind.DataType]: () => DataType.File,
  },
  [AttributeKind.Connection]: undefined,
  [AttributeKind.DataType]: undefined,
  [AttributeKind.Endianess]: {
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.FileUsage]: {
    [AttributeKind.DataType]: () => DataType.File,
  },
  [AttributeKind.FloatFormat]: {
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.LocatorKind]: undefined,
  [AttributeKind.NumberMode]: {
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.OrdinalNames]: undefined,
  [AttributeKind.PictureKind]: undefined,
  [AttributeKind.Position]: undefined,
  [AttributeKind.Precision]: {
    [AttributeKind.Scale]: (value) => {
      if (typeof value.fractionalDigitsCount !== "undefined") {
        return ScaleMode.Fixed;
      }
      return undefined;
    },
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.Scale]: {
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.Scope]: undefined,
  [AttributeKind.Sign]: {
    [AttributeKind.DataType]: () => DataType.Arithmetic,
  },
  [AttributeKind.Storage]: undefined,
  [AttributeKind.StringFormat]: {
    [AttributeKind.DataType]: () => DataType.String,
  },
  [AttributeKind.StringKind]: {
    [AttributeKind.DataType]: () => DataType.String,
  },
  [AttributeKind.StringLength]: {
    [AttributeKind.DataType]: () => DataType.String,
  },
  [AttributeKind.TransmissionDirection]: {
    [AttributeKind.DataType]: () => DataType.File,
  },
  [AttributeKind.Variable]: undefined,
  [AttributeKind.Volatility]: undefined,
};

export namespace TypeDescriptions {
  export const Names = {
    [AreaType]: "Area",
    [ArithmeticType]: "Arithmetic",
    [FileType]: "File",
    [FormatType]: "Format",
    [LabelType]: "Label",
    [LocatorType]: "Locator",
    [EntryType]: "Entry",
    [OrdinalType]: "Ordinal",
    [PictureType]: "Picture",
    [StringType]: "String",
    [TaskType]: "Task",
    [UnknownType]: "Unknown",
    [StructureType]: "Structure",
    [UnionType]: "Union",
  };
  export type Any =
    | Area
    | Arithmetic
    | File
    | Format
    | Label
    | Locator
    | Entry
    | Ordinal
    | Picture
    | String
    | Task
    | Unknown
    | Structure
    | Union;
  export type TypeDescriptionType = Any["type"];

  //TODO check default values
  export const DefaultValues: AttributeTypes = {
    [AttributeKind.List]: false,
    [AttributeKind.Optional]: false,
    [AttributeKind.Parameter]: false,
    [AttributeKind.FileUsage]: FileUsage.Record,
    [AttributeKind.BufferMode]: BufferMode.Unbuffered,
    [AttributeKind.AccessMode]: AccessMode.Sequential,
    [AttributeKind.FloatFormat]: FloatFormat.IEEE,
    [AttributeKind.Endianess]: Endianess.Big,
    [AttributeKind.DataType]: DataType.Area,
    [AttributeKind.Dimension]: undefined,
    [AttributeKind.Initial]: undefined,
    [AttributeKind.Alignment]: {
      type: AlignmentType.Aligned,
      alignment: 1,
    },
    [AttributeKind.Scope]: {
      type: ScopeType.Internal,
    },
    [AttributeKind.Storage]: StorageClass.Automatic,
    [AttributeKind.Volatility]: Volatility.Normal,
    [AttributeKind.Position]: {
      variable: null,
      position: null,
    },
    [AttributeKind.Assignability]: Assignability.Assignable,
    [AttributeKind.Connection]: StorageConnection.Connected,
    [AttributeKind.Variable]: false,
    [AttributeKind.Scale]: ScaleMode.Fixed,
    [AttributeKind.ScanMode]: ast.ScanMode.NOSCAN,
    [AttributeKind.Precision]: {
      totalDigitsCount: 5,
      fractionalDigitsCount: 0,
    },
    [AttributeKind.Base]: Base.Binary,
    [AttributeKind.Sign]: Sign.Signed,
    [AttributeKind.NumberMode]: NumberMode.Real,
    [AttributeKind.AreaSize]: 0,
    [AttributeKind.LocatorKind]: {
      type: "pointer",
      size: 32,
    },
    [AttributeKind.OrdinalNames]: [],
    [AttributeKind.ParameterPassMode]: ParameterPassMode.ByAddr,
    [AttributeKind.ParameterPassDirection]: ParameterPassDirection.InOut,
    [AttributeKind.PictureKind]: PictureWideness.Picture,
    [AttributeKind.StringKind]: StringKind.Bit,
    [AttributeKind.StringFormat]: StringFormat.Varying,
    [AttributeKind.StringLength]: 0,
    [AttributeKind.TransmissionDirection]: TransmissionDirection.Input,
    [AttributeKind.SetType]: null,
    [AttributeKind.SetLike]: null,
  };

  export const Structure = createStructureTypeDescription;
  export type Structure = StructureTypeDescription;
  export const isStructure = (
    type: TypeDescriptions.Any,
  ): type is StructureTypeDescription => type.type === StructureType;

  export const Union = createUnionTypeDescription;
  export type Union = UnionTypeDescription;
  export const isUnion = (
    type: TypeDescriptions.Any,
  ): type is UnionTypeDescription => type.type === UnionType;

  export const Unknown = createUnknownTypeDescription;
  export type Unknown = UnknownTypeDescription;
  export const isUnknown = (
    type: TypeDescriptions.Any,
  ): type is UnknownTypeDescription => type.type === UnknownType;

  export const Area = createAreaTypeDescription;
  export type Area = AreaTypeDescription;
  export const isArea = isAreaTypeDescription;

  export const Arithmetic = createArithmeticTypeDescription;
  export type Arithmetic = ArithmeticTypeDescription;
  export const isArithmetic = isArithmeticTypeDescription;

  export const File = createFileTypeDescription;
  export type File = FileTypeDescription;
  export const isFile = isFileTypeDescription;

  export const Format = createFormatTypeDescription;
  export type Format = FormatTypeDescription;
  export const isFormat = isFormatTypeDescription;

  export const Label = createLabelTypeDescription;
  export type Label = LabelTypeDescription;
  export const isLabel = isLabelTypeDescription;

  export const Locator = createLocatorTypeDescription;
  export type Locator = LocatorTypeDescription;
  export const isLocator = isLocatorTypeDescription;

  export const Entry = createEntryTypeDescription;
  export type Entry = EntryTypeDescription;
  export const isEntry = isEntryTypeDescription;

  export const Ordinal = createOrdinalTypeDescription;
  export type Ordinal = OrdinalTypeDescription;
  export const isOrdinal = isOrdinalTypeDescription;

  export const Picture = createPictureTypeDescription;
  export type Picture = PictureTypeDescription;
  export const isPicture = isPictureTypeDescription;

  export const String = createStringTypeDescription;
  export type String = StringTypeDescription;
  export const isString = isStringTypeDescription;

  export const Task = createTaskTypeDescription;
  export type Task = TaskTypeDescription;
  export const isTask = isTaskTypeDescription;

  /** fake type */
  export const Boolean = createStringTypeDescription({
    kind: StringKind.Bit,
    format: StringFormat.NonVarying,
    length: 1,
  });
  export const isBoolean = (
    type: TypeDescriptions.Any,
  ): type is StringTypeDescription =>
    isString(type) && type.kind === StringKind.Bit && type.length === 1;

  export function createPrimitive(
    type: Exclude<DataType, DataType.Structure | DataType.Union>,
    attributes: AttributeWitnesses,
  ): Any {
    const common = {
      alignment:
        attributes[AttributeKind.Alignment]?.value ??
        DefaultValues[AttributeKind.Alignment],
      dimension:
        attributes[AttributeKind.Dimension]?.value ??
        DefaultValues[AttributeKind.Dimension],
      initial:
        attributes[AttributeKind.Initial]?.value ??
        DefaultValues[AttributeKind.Initial],
      scope:
        attributes[AttributeKind.Scope]?.value ??
        DefaultValues[AttributeKind.Scope],
      storage:
        attributes[AttributeKind.Storage]?.value ??
        DefaultValues[AttributeKind.Storage],
      volatility:
        attributes[AttributeKind.Volatility]?.value ??
        DefaultValues[AttributeKind.Volatility],
      parameterPassDirection:
        attributes[AttributeKind.ParameterPassDirection]?.value,
      parameterPassMode: attributes[AttributeKind.ParameterPassMode]?.value,
      position:
        attributes[AttributeKind.Position]?.value ??
        DefaultValues[AttributeKind.Position],
      assignability:
        attributes[AttributeKind.Assignability]?.value ??
        DefaultValues[AttributeKind.Assignability],
      connection:
        attributes[AttributeKind.Connection]?.value ??
        DefaultValues[AttributeKind.Connection],
      variable:
        attributes[AttributeKind.Variable]?.value ??
        DefaultValues[AttributeKind.Variable],
      scanMode:
        attributes[AttributeKind.ScanMode]?.value ??
        DefaultValues[AttributeKind.ScanMode],
    };
    switch (type) {
      case DataType.Area:
        return TypeDescriptions.Area({
          ...common,
          size:
            attributes[AttributeKind.AreaSize]?.value ??
            DefaultValues[AttributeKind.AreaSize],
        });
      case DataType.Arithmetic:
        return TypeDescriptions.Arithmetic({
          ...common,
          scale:
            attributes[AttributeKind.Scale]?.value ??
            DefaultValues[AttributeKind.Scale],
          base:
            attributes[AttributeKind.Base]?.value ??
            DefaultValues[AttributeKind.Base],
          sign:
            attributes[AttributeKind.Sign]?.value ??
            DefaultValues[AttributeKind.Sign],
          mode:
            attributes[AttributeKind.NumberMode]?.value ??
            DefaultValues[AttributeKind.NumberMode],
          endianness:
            attributes[AttributeKind.Endianess]?.value ??
            DefaultValues[AttributeKind.Endianess],
          floatFormat:
            attributes[AttributeKind.FloatFormat]?.value ??
            DefaultValues[AttributeKind.FloatFormat],
          precision:
            attributes[AttributeKind.Precision]?.value ??
            DefaultValues[AttributeKind.Precision],
        });
      case DataType.File:
        return TypeDescriptions.File({
          ...common,
          accessMode:
            attributes[AttributeKind.AccessMode]?.value ??
            DefaultValues[AttributeKind.AccessMode],
          bufferMode:
            attributes[AttributeKind.BufferMode]?.value ??
            DefaultValues[AttributeKind.BufferMode],
          transmissionDirection:
            attributes[AttributeKind.TransmissionDirection]?.value ??
            DefaultValues[AttributeKind.TransmissionDirection],
          usage:
            attributes[AttributeKind.FileUsage]?.value ??
            DefaultValues[AttributeKind.FileUsage],
        });
      case DataType.Format:
        return TypeDescriptions.Format(common);
      case DataType.Label:
        return TypeDescriptions.Label(common);
      case DataType.Locator:
        return TypeDescriptions.Locator({
          ...common,
          kind:
            attributes[AttributeKind.LocatorKind]?.value ??
            DefaultValues[AttributeKind.LocatorKind],
        });
      case DataType.Entry:
        return TypeDescriptions.Entry(common);
      case DataType.Ordinal:
        return TypeDescriptions.Ordinal({
          ...common,
          names:
            attributes[AttributeKind.OrdinalNames]!.value ??
            DefaultValues[AttributeKind.OrdinalNames],
        });
      case DataType.Picture:
        return TypeDescriptions.Picture({
          ...common,
          kind:
            attributes[AttributeKind.PictureKind]?.value ??
            DefaultValues[AttributeKind.PictureKind],
          domain:
            attributes[AttributeKind.NumberMode]?.value ??
            DefaultValues[AttributeKind.NumberMode],
        });
      case DataType.String:
        return TypeDescriptions.String({
          ...common,
          kind:
            attributes[AttributeKind.StringKind]?.value ??
            DefaultValues[AttributeKind.StringKind],
          format:
            attributes[AttributeKind.StringFormat]?.value ??
            DefaultValues[AttributeKind.StringFormat],
          length:
            attributes[AttributeKind.StringLength]?.value ??
            DefaultValues[AttributeKind.StringLength],
        });
      case DataType.Task:
        return TypeDescriptions.Task(common);
      case DataType.Unknown:
        return TypeDescriptions.Unknown();
      default:
        assertUnreachable(type);
    }
  }
}

export interface BuilderDeclareItem {
  name: string;
  nameToken: Token;
  node: ast.SyntaxNode;
  attributes: ast.DeclarationAttribute[];
  level?: number;
}
