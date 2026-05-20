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
import { DataType } from "../syntax-tree/ast";
import { assertUnreachable } from "../utils/common";
import { stringifyAttributeWitnesses } from "./stringify";

/** @see https://www.ibm.com/docs/en/epfz/6.1?topic=attributes-nondata#ndatts__vari */

export { DataType };

export type Value = {
  type: TypeDescriptions.Any;
  value: string | number;
};

/** Makes T partial except for properties P, they are required */
export type PartialPartial<T, P extends keyof T> = Partial<Omit<T, P>> &
  Required<Omit<T, Exclude<keyof T, P>>>;

export const DataTypesArray = [
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
] as const satisfies DataType[];

export enum AttributeKind {
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-sequential-direct-attributes */
  AccessMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=alignment-aligned-unaligned-attributes */
  Alignment,
  /** TODO still needs to be handled by the type builder */
  AreaSize,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-assignable-nonassignable-attributes */
  Assignability,
  AttributeWitnesses,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-coded-arithmetic-data */
  Base,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-buffered-unbuffered-attributes */
  BufferMode,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=subroutines-builtin-attribute */
  BuiltIn,
  /** @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-connected-nonconnected-attributes */
  Connection,
  /** This is a meta type that can be set by different attributes. */
  DataType,
  /** A flag indicating whether the data type is generic. If a DataType is generic, only the data type is relevant for assignability checks */
  DataTypeIsGeneric,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=arrays-dimension-attribute */
  Dimension,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-bigendian-littleendian-attributes */
  Endianess,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=data-entry-attribute */
  Entry,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-record-stream-attributes */
  FileUsage,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-hexadec-ieee-attributes */
  FloatFormat,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-initial-attribute */
  InitAcross,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-initial-attribute */
  Initial,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-initial-attribute */
  InitialTo,
  /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-initial-attribute */
  InitialCall,
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
  StringBits,
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
  AttributeKind.DataTypeIsGeneric,
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
  AttributeKind.StringBits,
  AttributeKind.TransmissionDirection,
  AttributeKind.SetLike,
  AttributeKind.SetType,
  AttributeKind.Variable,
  AttributeKind.Volatility,
];

export type Bound = {
  value: number | "*" | undefined;
  expression: ast.Expression | null;
  refersTo: ast.LocatorCall | null;
  node: ast.SyntaxNode | null;
  token: Token | null;
};

export type DimensionBound = {
  lowerBound: Bound;
  upperBound: Bound;
};

export type EntryData = {
  sourceAttribute: ast.EntryAttribute;
  returns: TypeDescriptions.Any | undefined;
  parameters: TypeDescriptions.Any[];
};

export type AttributeTypes = {
  [AttributeKind.AccessMode]: AccessMode;
  [AttributeKind.Alignment]: Alignment;
  [AttributeKind.AreaSize]: number;
  [AttributeKind.Assignability]: Assignability;
  [AttributeKind.AttributeWitnesses]: AttributeWitnesses;
  [AttributeKind.Base]: Base;
  [AttributeKind.BufferMode]: BufferMode;
  [AttributeKind.BuiltIn]: boolean;
  [AttributeKind.Connection]: StorageConnection;
  [AttributeKind.DataType]: DataType;
  [AttributeKind.DataTypeIsGeneric]: boolean;
  [AttributeKind.Dimension]: DimensionBound[] | undefined;
  [AttributeKind.Endianess]: Endianess;
  [AttributeKind.Entry]: EntryData | undefined;
  [AttributeKind.FileUsage]: FileUsage;
  [AttributeKind.FloatFormat]: FloatFormat;
  [AttributeKind.InitAcross]: ast.InitAcrossAttribute | undefined;
  [AttributeKind.Initial]: ast.InitialAttribute | undefined;
  [AttributeKind.InitialTo]: ast.InitialToAttribute | undefined;
  [AttributeKind.InitialCall]: ast.InitialCallAttribute | undefined;
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
  [AttributeKind.Precision]: Precision | undefined;
  [AttributeKind.Scale]: ScaleMode;
  [AttributeKind.ScanMode]: ast.ScanMode;
  [AttributeKind.Scope]: Scope;
  [AttributeKind.SetLike]: ast.LocatorCall | null;
  [AttributeKind.SetType]: ast.NamedType | null;
  [AttributeKind.Sign]: Sign;
  [AttributeKind.Storage]: StorageClass;
  [AttributeKind.StringFormat]: StringFormat;
  [AttributeKind.StringBits]: StringBits;
  [AttributeKind.TransmissionDirection]: TransmissionDirection;
  [AttributeKind.Variable]: boolean;
  [AttributeKind.Volatility]: Volatility;
};

export const AttributePropertyNames = {
  [AttributeKind.AccessMode]: "accessMode" as const,
  [AttributeKind.Alignment]: "alignment" as const,
  [AttributeKind.AreaSize]: "areaSize" as const,
  [AttributeKind.Assignability]: "assignability" as const,
  [AttributeKind.Base]: "base" as const,
  [AttributeKind.BufferMode]: "bufferMode" as const,
  [AttributeKind.BuiltIn]: "builtIn" as const,
  [AttributeKind.Connection]: "connection" as const,
  [AttributeKind.DataType]: "dataType" as const,
  [AttributeKind.DataTypeIsGeneric]: "isDataTypeGeneric" as const,
  [AttributeKind.Dimension]: "dimension" as const,
  [AttributeKind.Endianess]: "endianess" as const,
  [AttributeKind.FileUsage]: "fileUsage" as const,
  [AttributeKind.FloatFormat]: "floatFormat" as const,
  [AttributeKind.InitAcross]: "initAcross" as const,
  [AttributeKind.Initial]: "initial" as const,
  [AttributeKind.InitialTo]: "initialTo" as const,
  [AttributeKind.InitialCall]: "initialCall" as const,
  [AttributeKind.Entry]: "entry" as const,
  [AttributeKind.List]: "list" as const,
  [AttributeKind.LocatorKind]: "locatorKind" as const,
  [AttributeKind.NumberMode]: "numberMode" as const,
  [AttributeKind.Optional]: "optional" as const,
  [AttributeKind.OrdinalNames]: "ordinalNames" as const,
  [AttributeKind.Parameter]: "parameter" as const,
  [AttributeKind.ParameterPassDirection]: "parameterPassDirection" as const,
  [AttributeKind.ParameterPassMode]: "parameterPassMode" as const,
  [AttributeKind.PictureKind]: "pictureKind" as const,
  [AttributeKind.Position]: "position" as const,
  [AttributeKind.Precision]: "precision" as const,
  [AttributeKind.Scale]: "scale" as const,
  [AttributeKind.Scope]: "scope" as const,
  [AttributeKind.ScanMode]: "scanMode" as const,
  [AttributeKind.Sign]: "sign" as const,
  [AttributeKind.Storage]: "storage" as const,
  [AttributeKind.StringFormat]: "stringFormat" as const,
  [AttributeKind.StringBits]: "stringBits" as const,
  [AttributeKind.TransmissionDirection]: "transmissionDirection" as const,
  [AttributeKind.Variable]: "variable" as const,
  [AttributeKind.Volatility]: "volatility" as const,
  [AttributeKind.SetLike]: "like" as const,
  [AttributeKind.SetType]: "typeRef" as const,
  [AttributeKind.AttributeWitnesses]: "attributeWitnesses" as const,
} satisfies { [K in AttributeKind]: string };

export type AttributePreprocessorValidator<K extends AttributeKind> = (
  value: AttributeTypes[K],
) => boolean;

export const AttributeIsValidForPreprocessor: {
  [K in AttributeKind]?: AttributePreprocessorValidator<K>;
} = {
  [AttributeKind.Scale]: function (value: ScaleMode): boolean {
    return value === ScaleMode.Fixed;
  },
  [AttributeKind.StringBits]: function (value: StringBits): boolean {
    return value.kind === StringKind.Character && value.length === undefined;
  },
  [AttributeKind.DataType]: (value) => value === DataType.Entry,
  [AttributeKind.DataTypeIsGeneric]: () => true,
  [AttributeKind.Scope]: () => true,
  [AttributeKind.BuiltIn]: () => true,
  [AttributeKind.Entry]: () => true,
  [AttributeKind.ScanMode]: () => true,
  [AttributeKind.Dimension]: () => true,
  [AttributeKind.Initial]: () => true,
};

export function isAttributeValidForPreprocessor<K extends AttributeKind>(
  kind: K,
  value: AttributeTypes[K],
): boolean {
  const validator = AttributeIsValidForPreprocessor[kind];
  return validator ? validator(value) : false;
}

export type AttributeStringifier<K extends AttributeKind> = (
  value: AttributeTypes[K],
  witnesses: AttributeWitnesses,
) => string | undefined;

export const AttributeStringifiers: {
  [K in AttributeKind]: AttributeStringifier<K>;
} = {
  [AttributeKind.DataTypeIsGeneric]: function (
    value: boolean,
    witnesses: AttributeWitnesses,
  ): string | undefined {
    if (value) {
      const dataType = witnesses.witnesses[AttributeKind.DataType]?.value;
      if (dataType === undefined || dataType === DataType.Unknown) {
        return "ANY";
      }
      const type = TypeDescriptions.Names[dataType].toUpperCase();
      return `ANY<${type}>`;
    }
    return undefined;
  },
  [AttributeKind.BuiltIn]: function (value: boolean): string | undefined {
    return value ? "BUILTIN" : undefined;
  },
  [AttributeKind.AccessMode]: function (value: AccessMode): string {
    switch (value) {
      case AccessMode.Direct:
        return "DIRECT";
      case AccessMode.Sequential:
        return "SEQUENTIAL";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Alignment]: function (value: Alignment): string {
    switch (value.type) {
      case AlignmentType.Aligned:
        return `ALIGNED(${value.alignment})`;
      case AlignmentType.Unaligned:
        return "UNALIGNED";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.AreaSize]: function (_value: number): string {
    //TODO implement
    return `AREA(...)`;
  },
  [AttributeKind.Assignability]: function (value: Assignability): string {
    switch (value) {
      case Assignability.Assignable:
        return "ASSIGNABLE";
      case Assignability.Nonassignable:
        return "NONASSIGNABLE";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Base]: function (value: Base): string {
    switch (value) {
      case Base.Binary:
        return "BINARY";
      case Base.Decimal:
        return "DECIMAL";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.BufferMode]: function (value: BufferMode): string {
    switch (value) {
      case BufferMode.Buffered:
        return "BUFFERED";
      case BufferMode.Unbuffered:
        return "UNBUFFERED";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Connection]: function (value: StorageConnection): string {
    switch (value) {
      case StorageConnection.Connected:
        return "CONNECTED";
      case StorageConnection.Nonconnected:
        return "NONCONNECTED";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.DataType]: function (value: DataType): string | undefined {
    return undefined;
  },
  [AttributeKind.Dimension]: function (
    value: DimensionBound[] | undefined,
  ): string | undefined {
    if (!value) {
      return undefined;
    }
    return `DIMENSION(*)`;
    /*
    ${value
      .map((bound) => {
        if (bound.upperBound.value !== undefined) {
          if (bound.lowerBound.value !== undefined) {
            return `${bound.lowerBound.value}:${bound.upperBound.value}`;
          } else {
            throw new Error(
              "Cannot stringify dimension bound with no lower bound value",
            );
          }
        } else {
          if (bound.lowerBound.value !== undefined) {
            return `${bound.lowerBound.value}`;
          } else {
            throw new Error("Cannot stringify dimension bound with no values");
          }
        }
      })
      .join(", ")}
    */
  },
  [AttributeKind.Endianess]: function (value: Endianess): string {
    switch (value) {
      case Endianess.Big:
        return "BIGENDIAN";
      case Endianess.Little:
        return "LITTLEENDIAN";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Entry]: function (
    data: EntryData | undefined,
  ): string | undefined {
    if (!data) {
      return undefined;
    }
    //TODO: Implement stringification of EntryAttribute
    const value = data.sourceAttribute;

    let parameters = "";
    if (data.parameters.length > 0) {
      parameters = data.parameters.map((param) => param.toString()).join(", ");
      parameters = `(${parameters})`;
    }

    let returns = "";
    if (data.returns) {
      returns = ` RETURNS(${data.returns.toString()})`;
    }

    let external = "";
    if (value.hasExternal) {
      external = " EXTERNAL";
      if (value.environmentName) {
        //TODO: implement environment name expression stringification
        external += `(...)`;
      }
    }

    return `ENTRY${parameters}${returns}${external}`;
  },
  [AttributeKind.FileUsage]: function (value: FileUsage): string {
    switch (value) {
      case FileUsage.Record:
        return "RECORD";
      case FileUsage.Stream:
        return "STREAM";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.FloatFormat]: function (value: FloatFormat): string {
    switch (value) {
      case FloatFormat.IEEE:
        return "IEEE";
      case FloatFormat.HexaDec:
        return "HEXADEC";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.InitAcross]: function (
    value: ast.InitAcrossAttribute | undefined,
  ): string | undefined {
    if (!value) {
      return undefined;
    }
    return "INITACROSS(...)";
  },
  [AttributeKind.Initial]: function (
    value: ast.InitialAttribute | undefined,
  ): string | undefined {
    if (!value) {
      return "";
    }
    // TODO: Implement stringification of InitialAttribute
    return "INITIAL(...)";
  },
  [AttributeKind.InitialTo]: function (
    value: ast.InitialToAttribute | undefined,
  ): string | undefined {
    if (!value) {
      return "";
    }
    // TODO: Implement stringification of InitialToAttribute
    return "INITIAL TO(...)";
  },
  [AttributeKind.InitialCall]: function (
    value: ast.InitialCallAttribute | undefined,
  ): string | undefined {
    if (!value) {
      return "";
    }
    // TODO: Implement stringification of InitialCallAttribute
    return "INITIAL CALL(...)";
  },
  [AttributeKind.List]: function (value: boolean): string | undefined {
    return value ? "LIST" : undefined;
  },
  [AttributeKind.LocatorKind]: function (value: LocatorKind): string {
    switch (value.type) {
      case "pointer":
        return value.size ? `POINTER(${value.size})` : "POINTER";
      //TODO struct type name
      case "handle":
        // TODO structure name
        return `HANDLE${value.size ? `(${value.size})` : ""} (...)`;
      //TODO area variable name
      case "offset":
        //TODO area variable name
        return `OFFSET (...)`;
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.NumberMode]: function (value: NumberMode): string {
    switch (value) {
      case NumberMode.Complex:
        return "COMPLEX";
      case NumberMode.Real:
        return "REAL";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Optional]: function (value: boolean): string | undefined {
    return value ? "OPTIONAL" : undefined;
  },
  [AttributeKind.OrdinalNames]: function (value: string[]): string | undefined {
    //TODO implement Ordinal names stringification
    return undefined;
  },
  [AttributeKind.Parameter]: function (value: boolean): string | undefined {
    return value ? "PARAMETER" : undefined;
  },
  [AttributeKind.ParameterPassDirection]: function (
    value: ParameterPassDirection,
  ): string {
    switch (value) {
      case ParameterPassDirection.InOnly:
        return "INONLY";
      case ParameterPassDirection.OutOnly:
        return "OUTONLY";
      case ParameterPassDirection.InOut:
        return "INOUT";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.ParameterPassMode]: function (
    value: ParameterPassMode | undefined,
  ): string | undefined {
    switch (value) {
      case undefined:
        return undefined;
      case ParameterPassMode.ByAddr:
        return "BYADDR";
      case ParameterPassMode.ByValue:
        return "BYVALUE";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.PictureKind]: function (value: PictureWideness): string {
    //TODO picture-specification is missing
    switch (value) {
      case PictureWideness.Picture:
        return "PICTURE";
      case PictureWideness.WidePicture:
        return "WIDEPIC";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Position]: function (_value: StoragePosition): string {
    //TODO implement stringification of StoragePosition
    return "/*POSITION(...)*/";
  },
  [AttributeKind.Precision]: function (
    value: Precision | undefined,
  ): string | undefined {
    if (!value) {
      return undefined;
    } else if (value.fractionalDigitsCount !== undefined) {
      return `PRECISION(${value.totalDigitsCount}, ${value.fractionalDigitsCount})`;
    } else {
      return `PRECISION(${value.totalDigitsCount})`;
    }
  },
  [AttributeKind.Scale]: function (value: ScaleMode): string {
    switch (value) {
      case ScaleMode.Fixed:
        return "FIXED";
      case ScaleMode.Float:
        return "FLOAT";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Scope]: function (value: Scope): string {
    switch (value.type) {
      case ScopeType.Internal:
        return "INTERNAL";
      case ScopeType.External:
        return `EXTERNAL('${value.environment}')`;
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.ScanMode]: function (value: ast.ScanMode): string {
    switch (value) {
      case ast.ScanMode.NOSCAN:
        return "NOSCAN";
      case ast.ScanMode.SCAN:
        return "SCAN";
      case ast.ScanMode.RESCAN:
        return "RESCAN";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Sign]: function (value: Sign): string {
    switch (value) {
      case Sign.Signed:
        return "SIGNED";
      case Sign.Unsigned:
        return "UNSIGNED";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Storage]: function (value: StorageClass): string {
    switch (value) {
      case StorageClass.Automatic:
        return "AUTOMATIC";
      case StorageClass.Static:
        return "STATIC";
      case StorageClass.Based:
        /* TODO add locator reference */
        return "BASED(...)";
      case StorageClass.Controlled:
        return "CONTROLLED";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.StringFormat]: function (value: StringFormat): string {
    switch (value) {
      case StringFormat.NonVarying:
        return "NONVARYING";
      case StringFormat.Varying:
        return "VARYING";
      case StringFormat.Varying4:
        return "VARYING4";
      case StringFormat.VaryingZ:
        return "VARYINGZ";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.StringBits]: function (value: StringBits): string {
    const length =
      typeof value.length === "undefined"
        ? ""
        : typeof value.length === "number"
          ? `(${value.length}${value.refers ? ` REFERS ${value.refers.name}` : ""})`
          : "(*)";
    switch (value.kind) {
      case StringKind.Bit:
        return `BIT${length}`;
      case StringKind.Character:
        return `CHARACTER${length}`;
      case StringKind.Graphic:
        return `GRAPHIC${length}`;
      case StringKind.UChar:
        return `UCHAR${length}`;
      case StringKind.WideChar:
        return `WIDECHAR${length}`;
      default:
        assertUnreachable(value.kind);
    }
  },
  [AttributeKind.TransmissionDirection]: function (
    value: TransmissionDirection,
  ): string {
    switch (value) {
      case TransmissionDirection.Input:
        return "INPUT";
      case TransmissionDirection.Output:
        return "OUTPUT";
      case TransmissionDirection.Update:
        return "UPDATE";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.Variable]: function (value: boolean): string | undefined {
    return value ? "VARIABLE" : undefined;
  },
  [AttributeKind.Volatility]: function (value: Volatility): string {
    switch (value) {
      case Volatility.Normal:
        return "NORMAL";
      case Volatility.Abnormal:
        return "ABNORMAL";
      default:
        assertUnreachable(value);
    }
  },
  [AttributeKind.SetLike]: function (
    _value: ast.LocatorCall | null,
  ): string | undefined {
    return undefined;
  },
  [AttributeKind.SetType]: function (
    _value: ast.NamedType | null,
  ): string | undefined {
    return undefined;
  },
  [AttributeKind.AttributeWitnesses]: function (
    _value: AttributeWitnesses,
  ): string | undefined {
    return undefined;
  },
};

export const CommonAttributeKinds = [
  AttributeKind.DataType,

  AttributeKind.Alignment,
  AttributeKind.Assignability,
  AttributeKind.BuiltIn,
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
] satisfies readonly AttributeKind[];

const CompositeAttributeKinds = [
  AttributeKind.Dimension,
  AttributeKind.Alignment,
  AttributeKind.Storage,
] satisfies readonly AttributeKind[];
export const AttributeKindsByDataType = {
  [DataType.Unknown]: [...CommonAttributeKinds] as const,
  [DataType.Structure]: CompositeAttributeKinds,
  [DataType.Union]: CompositeAttributeKinds,
  [DataType.Area]: [
    ...CommonAttributeKinds,
    AttributeKind.AreaSize,
    AttributeKind.Endianess,
  ] as const,
  [DataType.Arithmetic]: [
    ...CommonAttributeKinds,
    AttributeKind.Scale,
    AttributeKind.Base,
    AttributeKind.Sign,
    AttributeKind.Precision,
    AttributeKind.NumberMode,
    AttributeKind.Endianess,
    AttributeKind.FloatFormat,
  ] as const,
  [DataType.File]: [
    ...CommonAttributeKinds,
    AttributeKind.AccessMode,
    AttributeKind.BufferMode,
    AttributeKind.FileUsage,
    AttributeKind.TransmissionDirection,
  ] as const,
  [DataType.Format]: [...CommonAttributeKinds] as const,
  [DataType.Label]: [...CommonAttributeKinds] as const,
  [DataType.Locator]: [
    ...CommonAttributeKinds,
    AttributeKind.LocatorKind,
  ] as const,
  [DataType.Entry]: [...CommonAttributeKinds, AttributeKind.Entry] as const,
  [DataType.Ordinal]: [
    ...CommonAttributeKinds,
    AttributeKind.OrdinalNames,
  ] as const,
  [DataType.Picture]: [
    ...CommonAttributeKinds,
    AttributeKind.PictureKind,
    AttributeKind.NumberMode,
  ] as const,
  [DataType.String]: [
    ...CommonAttributeKinds,
    AttributeKind.StringBits,
    AttributeKind.StringFormat,
  ] as const,
  [DataType.Task]: [...CommonAttributeKinds] as const,
} satisfies Record<DataType, AttributeKind[]>;

export type AttributeWitness<K extends keyof AttributeTypes> = {
  value: AttributeTypes[K];
  witness: ast.DeclarationAttribute;
  image: string;
  token: Token;
  implicit: boolean;
};

export type AttributeWitnesses = {
  order: AttributeKind[];
  witnesses: Partial<{
    [K in keyof AttributeTypes]: AttributeWitness<K> | null;
  }>;
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
  builtIn: boolean;
  connection: StorageConnection;
  dimension?: DimensionBound[];
  initial?: ast.InitialAttribute;
  isDataTypeGeneric: boolean;
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
  witnesses: AttributeWitnesses;
  toString(): string;
}

interface WithTypeDescriminator {
  type: DataType;
}

interface WithParentType {
  parentType?: TypeDescriptions.Composite;
  variableNode?: ast.DeclaredVariable;
}

interface BaseTypeDescription
  extends WithTypeDescriminator, BaseTypeDescriptionProps, WithParentType {}

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
    builtIn = false,
    variable,
    scanMode,
    list,
    parameterPassDirection,
    parameterPassMode,
    initial,
    optional,
    parameter,
    isDataTypeGeneric,
    witnesses,
    toString,
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
  isDataTypeGeneric ??=
    TypeDescriptions.DefaultValues[AttributeKind.DataTypeIsGeneric];

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
    builtIn,
    connection,
    dimension,
    initial,
    isDataTypeGeneric,
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

    witnesses: witnesses ?? { order: [], witnesses: {} },
    toString() {
      return toString!();
    },
  };
}

//--- Area ---
const AreaType = DataType.Area;
type AreaType = typeof AreaType;

interface AreaTypeDescriptionProps extends BaseTypeDescriptionProps {
  size: number;
}

interface AreaTypeDescription
  extends BaseTypeDescription, AreaTypeDescriptionProps {
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
  extends BaseTypeDescription, ArithmeticTypeDescriptionProps {
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
  initial,
  ...base
}: Partial<ArithmeticTypeDescription>): ArithmeticTypeDescription {
  return {
    type: ArithmeticType,
    ...createBaseTypeDescription(ArithmeticType, base),
    mode,
    scale,
    precision,
    initial,
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

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-input-output-update-attributes */
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
  extends BaseTypeDescription, FileTypeDescriptionProps {
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
  extends BaseTypeDescription, FormatTypeDescriptionProps {
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
  extends BaseTypeDescription, LabelTypeDescriptionProps {
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
  | { type: "pointer"; size?: 32 | 64 }
  | { type: "handle"; size?: 32 | 64; structTypeName?: null } //TODO structTypeName should be mandatory
  | { type: "offset"; areaVariable?: null };

interface LocatorTypeDescriptionProps extends BaseTypeDescriptionProps {
  kind: LocatorKind;
}

interface LocatorTypeDescription
  extends BaseTypeDescription, LocatorTypeDescriptionProps {
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
  extends BaseTypeDescription, EntryTypeDescriptionProps {
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
  extends BaseTypeDescription, OrdinalTypeDescriptionProps {
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
  extends BaseTypeDescription, PictureTypeDescriptionProps {
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

export type StringBits = {
  kind: StringKind;
  length?: number | "*";
  refers?: ast.DeclaredVariable;
};

/** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-varying-varying4-varyingz-nonvarying */
export enum StringFormat {
  Varying,
  Varying4,
  VaryingZ,
  NonVarying,
}

interface StringTypeDescriptionProps extends BaseTypeDescriptionProps {
  stringBits: StringBits;
  format: StringFormat;
}

interface StringTypeDescription
  extends BaseTypeDescription, StringTypeDescriptionProps {
  type: StringType;
}

function createStringTypeDescription({
  stringBits,
  format,
  ...base
}: PartialPartial<
  StringTypeDescriptionProps,
  "stringBits" | "format"
>): StringTypeDescription {
  return {
    type: StringType,
    ...createBaseTypeDescription(StringType, base),
    stringBits,
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
  extends BaseTypeDescription, TaskTypeDescriptionProps {
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

//TODO [Lotes] remove the builtin flag again, when the referenced variable/function type is resolvable
function createUnknownTypeDescription(common?: {
  builtIn?: boolean;
}): UnknownTypeDescription {
  return {
    type: UnknownType,
    ...createBaseTypeDescription(UnknownType, {
      ...common,
    }),
  };
}

//--- Structure ---
interface WithMembers {
  level: number;
  members: Map<ast.DeclaredVariable, TypeDescriptions.Any>;
  membersMetadata: Map<ast.DeclaredVariable, BuilderDeclareItem>;
}

const StructureType = DataType.Structure;
type StructureType = typeof StructureType;

interface CompositeTypeDescriptionProps extends WithMembers, WithParentType {
  type: DataType.Structure | DataType.Union;
  dimension?: DimensionBound[];
  storage?: StorageClass;
  alignment?: Alignment;
  toString(): string;
  witnesses: AttributeWitnesses;
  optional: boolean;
  list: boolean;
  isDataTypeGeneric: boolean;
}

interface CompositeTypeDescription extends CompositeTypeDescriptionProps {}

//--- Union ---
const UnionType = DataType.Union;
type UnionType = typeof UnionType;

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
      if (value && typeof value.fractionalDigitsCount !== "undefined") {
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
  [AttributeKind.StringBits]: {
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
    [AreaType]: "Area" as const,
    [ArithmeticType]: "Arithmetic" as const,
    [FileType]: "File" as const,
    [FormatType]: "Format" as const,
    [LabelType]: "Label" as const,
    [LocatorType]: "Locator" as const,
    [EntryType]: "Entry" as const,
    [OrdinalType]: "Ordinal" as const,
    [PictureType]: "Picture" as const,
    [StringType]: "String" as const,
    [TaskType]: "Task" as const,
    [UnknownType]: "Unknown" as const,
    [StructureType]: "Structure" as const,
    [UnionType]: "Union" as const,
  } satisfies Record<DataType, string>;
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
    | Composite;
  export type TypeDescriptionType = Any["type"];

  //TODO check default values
  export const DefaultValues: AttributeTypes = {
    [AttributeKind.BuiltIn]: false,
    [AttributeKind.AttributeWitnesses]: {
      order: [],
      witnesses: {},
    },
    [AttributeKind.List]: false,
    [AttributeKind.Optional]: false,
    [AttributeKind.Parameter]: false,
    [AttributeKind.FileUsage]: FileUsage.Record,
    [AttributeKind.BufferMode]: BufferMode.Unbuffered,
    [AttributeKind.AccessMode]: AccessMode.Sequential,
    [AttributeKind.FloatFormat]: FloatFormat.IEEE,
    [AttributeKind.Endianess]: Endianess.Big,
    [AttributeKind.Entry]: undefined,
    [AttributeKind.DataType]: DataType.Area,
    [AttributeKind.DataTypeIsGeneric]: false,
    [AttributeKind.Dimension]: undefined,
    [AttributeKind.InitAcross]: undefined,
    [AttributeKind.Initial]: undefined,
    [AttributeKind.InitialTo]: undefined,
    [AttributeKind.InitialCall]: undefined,
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
    [AttributeKind.StringBits]: { kind: StringKind.Bit, length: 1 },
    [AttributeKind.StringFormat]: StringFormat.Varying,
    [AttributeKind.TransmissionDirection]: TransmissionDirection.Input,
    [AttributeKind.SetType]: null,
    [AttributeKind.SetLike]: null,
  };

  export type Composite = CompositeTypeDescription;
  export const isComposite = (type: TypeDescriptions.Any): type is Composite =>
    type.type === DataType.Structure || type.type === DataType.Union;

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
    stringBits: {
      kind: StringKind.Bit,
      length: 1,
    },
    format: StringFormat.NonVarying,
  });
  export const isBoolean = (
    type: TypeDescriptions.Any,
  ): type is StringTypeDescription =>
    isString(type) &&
    type.stringBits.kind === StringKind.Bit &&
    type.stringBits.length === 1;

  export function createComposite({
    type,
    level,
    variableNode,
    witnesses,
  }: {
    type: DataType.Structure | DataType.Union;
    witnesses: AttributeWitnesses;
    level: number;
    variableNode: ast.DeclaredVariable;
  }): Composite {
    const attributes = witnesses.witnesses;
    return {
      type,
      isDataTypeGeneric:
        attributes[AttributeKind.DataTypeIsGeneric]?.value ??
        DefaultValues[AttributeKind.DataTypeIsGeneric],
      witnesses,
      level,
      list:
        attributes[AttributeKind.List]?.value ??
        DefaultValues[AttributeKind.List],
      members: new Map(),
      membersMetadata: new Map(),
      parentType: undefined,
      storage: attributes[AttributeKind.Storage]?.value,
      alignment: attributes[AttributeKind.Alignment]?.value,
      dimension:
        attributes[AttributeKind.Dimension]?.value ??
        DefaultValues[AttributeKind.Dimension],
      optional:
        attributes[AttributeKind.Optional]?.value ??
        DefaultValues[AttributeKind.Optional],
      variableNode,
      toString: () => stringifyAttributeWitnesses(witnesses),
    };
  }

  export function createPrimitive(
    type: Exclude<DataType, DataType.Structure | DataType.Union>,
    witnesses: AttributeWitnesses,
  ): Any {
    const attributes = witnesses.witnesses;
    const common = {
      toString: () => stringifyAttributeWitnesses(witnesses),
      witnesses,
      list:
        attributes[AttributeKind.List]?.value ??
        DefaultValues[AttributeKind.List],
      alignment:
        attributes[AttributeKind.Alignment]?.value ??
        DefaultValues[AttributeKind.Alignment],
      builtIn: attributes[AttributeKind.BuiltIn]?.value ?? false,
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
      optional:
        attributes[AttributeKind.Optional]?.value ??
        DefaultValues[AttributeKind.Optional],
      scanMode:
        attributes[AttributeKind.ScanMode]?.value ??
        DefaultValues[AttributeKind.ScanMode],
      isDataTypeGeneric:
        attributes[AttributeKind.DataTypeIsGeneric]?.value ??
        DefaultValues[AttributeKind.DataTypeIsGeneric],
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
            attributes[AttributeKind.OrdinalNames]?.value ??
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
          stringBits:
            attributes[AttributeKind.StringBits]?.value ??
            DefaultValues[AttributeKind.StringBits],
          format:
            attributes[AttributeKind.StringFormat]?.value ??
            DefaultValues[AttributeKind.StringFormat],
        });
      case DataType.Task:
        return TypeDescriptions.Task(common);
      case DataType.Unknown:
        return TypeDescriptions.Unknown(common);
      default:
        assertUnreachable(type);
    }
  }
}

export interface BuilderDeclareItem {
  name: string;
  nameToken: Token;
  node: ast.DeclaredVariable;
  attributes: ast.DeclarationAttribute[];
  level: number | undefined;
}
