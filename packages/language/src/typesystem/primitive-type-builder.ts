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

import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import {
  DefaultAttributeEnum,
  DefaultAttributeToEnum,
} from "../parser/token-mappings";
import { Token } from "../parser/tokens";
import { assertType } from "../preprocessor/util";
import * as ast from "../syntax-tree/ast";
import { assertUnreachable } from "../utils/common";
import { Error } from "../validation/pli-codes";
import {
  DataType,
  DataTypesByAttributeKind,
  AttributeKinds,
  AttributeTypes,
  TypeDescriptions,
  AttributeKind,
  ScaleMode,
  Volatility,
  AlignmentType,
  Assignability,
  StorageClass,
  ScopeType,
  NumberMode,
  Base,
  StorageConnection,
  StringKind,
  StringFormat,
  Endianess,
  Sign,
  AttributeWitnesses,
  FloatFormat,
  BufferMode,
  AccessMode,
  FileUsage,
  Alignment,
  Scope,
  DataTypesArray,
  Precisions,
  AttributeWitness,
  Implications,
  TransmissionDirection,
} from "./descriptions";

function createEmptyAttributeWitnesses(): AttributeWitnesses {
  const obj: Partial<AttributeWitnesses> = {};
  for (const kind of AttributeKinds) {
    obj[kind] = null;
  }
  return obj as AttributeWitnesses;
}

type BuiltType = {
  type: TypeDescriptions.Any | undefined;
  diagnostics: Diagnostic[];
};

export interface PrimitiveTypeBuilder {
  addAttribute(attribute: ast.DeclarationAttribute): void;
  build(): BuiltType;
}

export class DefaultPrimitiveTypeBuilder implements PrimitiveTypeBuilder {
  private diagnostics: Diagnostic[] = [];
  private possibleDataTypes = new Set<DataType>(DataTypesArray);
  private attributeWitnesses: AttributeWitnesses =
    createEmptyAttributeWitnesses();
  constructor(public elementName: Token) {}
  addAttribute(attribute: ast.DeclarationAttribute): void {
    switch (attribute.kind) {
      case ast.SyntaxKind.ComputationDataAttribute:
        if (attribute.type) {
          this.handleDefaultAttribute(attribute);
        }
        break;
      case ast.SyntaxKind.DateAttribute:
      case ast.SyntaxKind.DefinedAttribute:
        break;
      case ast.SyntaxKind.DimensionsDataAttribute:
        break;
      case ast.SyntaxKind.EntryAttribute:
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Entry,
          attribute,
          attribute.entryToken!,
        );
        break;
      case ast.SyntaxKind.EnvironmentAttribute:
      case ast.SyntaxKind.GenericAttribute:
      case ast.SyntaxKind.HandleAttribute:
      case ast.SyntaxKind.IndForAttribute:
      case ast.SyntaxKind.InitialAttribute:
      case ast.SyntaxKind.LikeAttribute:
        break;
      case ast.SyntaxKind.PictureAttribute:
        /**
         * Picture wideness attributes
         * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-picture-widepic
         */
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Picture,
          attribute,
          attribute.pictureToken!,
        );
        break;
      case ast.SyntaxKind.ReturnsAttribute:
        break;
      case ast.SyntaxKind.TypeAttribute:
        //TODO handle type attribute
        if (attribute.type) {
          this.addAttributeWitness(
            AttributeKind.DataType,
            DataType.Unknown,
            attribute,
            attribute.type.token,
          );
        }
        break;
      case ast.SyntaxKind.ValueAttribute:
      case ast.SyntaxKind.ValueListAttribute:
      case ast.SyntaxKind.ValueListFromAttribute:
      case ast.SyntaxKind.ValueRangeAttribute:
        break;
      default:
        assertUnreachable(attribute);
    }
  }
  handleDefaultAttribute(attribute: ast.ComputationDataAttribute) {
    const token = attribute.typeToken!;
    assertType<number>(attribute.typeToken?.tokenTypeIdx);
    const typeAsEnum = DefaultAttributeToEnum[attribute.typeToken.tokenTypeIdx];
    switch (typeAsEnum) {
      /**
       * Data type attributes
       */
      case DefaultAttributeEnum.TASK:
      case DefaultAttributeEnum.FILE:
      case DefaultAttributeEnum.FORMAT:
      case DefaultAttributeEnum.AREA: {
        const mapTo = {
          [DefaultAttributeEnum.AREA]: DataType.Area,
          [DefaultAttributeEnum.FILE]: DataType.File,
          [DefaultAttributeEnum.FORMAT]: DataType.Format,
          [DefaultAttributeEnum.TASK]: DataType.Task,
        };
        const dataType = mapTo[typeAsEnum];
        this.addAttributeWitness(
          AttributeKind.DataType,
          dataType,
          attribute,
          token,
        );
        break;
      }

      /**
       * Access mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-sequential-direct-attributes
       */
      case DefaultAttributeEnum.SEQUENTIAL:
      case DefaultAttributeEnum.DIRECT: {
        this.addAttributeWitness(
          AttributeKind.AccessMode,
          typeAsEnum === DefaultAttributeEnum.DIRECT
            ? AccessMode.Direct
            : AccessMode.Sequential,
          attribute,
          token,
        );
        break;
      }

      /**
       * Alignment attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=alignment-aligned-unaligned-attributes
       */
      case DefaultAttributeEnum.ALIGNED:
      case DefaultAttributeEnum.UNALIGNED: {
        //TODO check alignment value
        const attributeValue: Alignment =
          typeAsEnum === DefaultAttributeEnum.ALIGNED
            ? { type: AlignmentType.Aligned, alignment: 1 }
            : { type: AlignmentType.Unaligned };
        this.addAttributeWitness(
          AttributeKind.Alignment,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      /**
       * Assignability attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-assignable-nonassignable-attributes
       */
      case DefaultAttributeEnum.ASSIGNABLE:
      case DefaultAttributeEnum.NONASSIGNABLE: {
        const attributeValue =
          typeAsEnum === DefaultAttributeEnum.ASSIGNABLE
            ? Assignability.Assignable
            : Assignability.Nonassignable;
        this.addAttributeWitness(
          AttributeKind.Assignability,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      /**
       * Base attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-coded-arithmetic-data
       */
      case DefaultAttributeEnum.BINARY:
      case DefaultAttributeEnum.DECIMAL: {
        this.addPrecision(attribute, token);
        const base =
          typeAsEnum === DefaultAttributeEnum.BINARY
            ? Base.Binary
            : Base.Decimal;
        this.addAttributeWitness(AttributeKind.Base, base, attribute, token);
        break;
      }

      /**
       * Buffer mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-buffered-unbuffered-attributes
       */
      case DefaultAttributeEnum.BUFFERED:
      case DefaultAttributeEnum.UNBUFFERED: {
        const mode =
          typeAsEnum === DefaultAttributeEnum.UNBUFFERED
            ? BufferMode.Unbuffered
            : BufferMode.Buffered;
        this.addAttributeWitness(
          AttributeKind.BufferMode,
          mode,
          attribute,
          token,
        );
        break;
      }

      /**
       * Connection attributes (StorageConnection)
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-connected-nonconnected-attributes
       */
      case DefaultAttributeEnum.CONNECTED:
      case DefaultAttributeEnum.NONCONNECTED: {
        const connection =
          typeAsEnum === DefaultAttributeEnum.CONNECTED
            ? StorageConnection.Connected
            : StorageConnection.Nonconnected;
        this.addAttributeWitness(
          AttributeKind.Connection,
          connection,
          attribute,
          token,
        );
        break;
      }

      /**
       * Endianess attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-bigendian-littleendian-attributes
       */
      case DefaultAttributeEnum.BIGENDIAN:
      case DefaultAttributeEnum.LITTLEENDIAN: {
        const endianess =
          typeAsEnum === DefaultAttributeEnum.BIGENDIAN
            ? Endianess.Big
            : Endianess.Little;
        this.addAttributeWitness(
          AttributeKind.Endianess,
          endianess,
          attribute,
          token,
        );
        break;
      }

      /**
       * File usage attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-record-stream-attributes
       */
      case DefaultAttributeEnum.STREAM:
      case DefaultAttributeEnum.RECORD: {
        const usage =
          typeAsEnum === DefaultAttributeEnum.STREAM
            ? FileUsage.Stream
            : FileUsage.Record;
        this.addAttributeWitness(
          AttributeKind.FileUsage,
          usage,
          attribute,
          token,
        );
        break;
      }

      /**
       * Float format attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-hexadec-ieee-attributes
       */
      case DefaultAttributeEnum.IEEE:
      case DefaultAttributeEnum.HEXADEC: {
        const format =
          typeAsEnum === DefaultAttributeEnum.IEEE
            ? FloatFormat.IEEE
            : FloatFormat.HexaDec;
        this.addAttributeWitness(
          AttributeKind.FloatFormat,
          format,
          attribute,
          token,
        );
        break;
      }

      /**
       * Number mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-real-complex
       */
      case DefaultAttributeEnum.COMPLEX:
      case DefaultAttributeEnum.REAL: {
        const mode =
          typeAsEnum === DefaultAttributeEnum.COMPLEX
            ? NumberMode.Complex
            : NumberMode.Real;
        this.addAttributeWitness(
          AttributeKind.NumberMode,
          mode,
          attribute,
          token,
        );
        break;
      }

      /**
       * Scale mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-fixed-float
       */
      case DefaultAttributeEnum.FLOAT:
      case DefaultAttributeEnum.FIXED: {
        const scaleMode =
          typeAsEnum === DefaultAttributeEnum.FIXED
            ? ScaleMode.Fixed
            : ScaleMode.Float;
        this.addPrecision(attribute, token);
        this.addAttributeWitness(
          AttributeKind.Scale,
          scaleMode,
          attribute,
          token,
        );
        break;
      }

      /**
       * Scope attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=declarations-internal-external-attributes
       */
      case DefaultAttributeEnum.INTERNAL:
      case DefaultAttributeEnum.EXTERNAL: {
        //TODO check environment
        const scope: Scope =
          typeAsEnum === DefaultAttributeEnum.INTERNAL
            ? { type: ScopeType.Internal }
            : { type: ScopeType.External, environment: "TODO" };
        this.addAttributeWitness(AttributeKind.Scope, scope, attribute, token);
        break;
      }

      /**
       * Sign attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-signed-unsigned
       */
      case DefaultAttributeEnum.UNSIGNED:
      case DefaultAttributeEnum.SIGNED: {
        const sign =
          typeAsEnum === DefaultAttributeEnum.SIGNED
            ? Sign.Signed
            : Sign.Unsigned;
        this.addAttributeWitness(AttributeKind.Sign, sign, attribute, token);
        break;
      }

      /**
       * Storage class attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation
       */
      case DefaultAttributeEnum.AUTOMATIC:
      case DefaultAttributeEnum.STATIC:
      case DefaultAttributeEnum.BASED:
      case DefaultAttributeEnum.CONTROLLED: {
        const mapTo = {
          [DefaultAttributeEnum.AUTOMATIC]: StorageClass.Automatic,
          [DefaultAttributeEnum.STATIC]: StorageClass.Static,
          [DefaultAttributeEnum.BASED]: StorageClass.Based,
          [DefaultAttributeEnum.CONTROLLED]: StorageClass.Controlled,
        };
        const clss = mapTo[typeAsEnum];
        this.addAttributeWitness(AttributeKind.Storage, clss, attribute, token);
        break;
      }

      /**
       * String format attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-varying-varying4-varyingz-nonvarying
       */
      case DefaultAttributeEnum.VARYING4:
      case DefaultAttributeEnum.VARYING:
      case DefaultAttributeEnum.VARYINGZ:
      case DefaultAttributeEnum.NONVARYING: {
        const mapTo = {
          [DefaultAttributeEnum.VARYING4]: StringFormat.Varying4,
          [DefaultAttributeEnum.VARYING]: StringFormat.Varying,
          [DefaultAttributeEnum.VARYINGZ]: StringFormat.VaryingZ,
          [DefaultAttributeEnum.NONVARYING]: StringFormat.NonVarying,
        };
        const format = mapTo[typeAsEnum];
        this.addAttributeWitness(
          AttributeKind.StringFormat,
          format,
          attribute,
          token,
        );
        break;
      }

      /**
       * String kind attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-bit-character-graphic-uchar-widechar
       */
      case DefaultAttributeEnum.BIT:
      case DefaultAttributeEnum.UCHAR:
      case DefaultAttributeEnum.WIDECHAR:
      case DefaultAttributeEnum.GRAPHIC:
      case DefaultAttributeEnum.CHARACTER: {
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        if (precision) {
          this.addAttributeWitness(
            AttributeKind.StringLength,
            precision[0],
            attribute,
            token,
          );
        }
        const mapTo = {
          [DefaultAttributeEnum.CHARACTER]: StringKind.Character,
          [DefaultAttributeEnum.BIT]: StringKind.Bit,
          [DefaultAttributeEnum.UCHAR]: StringKind.UChar,
          [DefaultAttributeEnum.WIDECHAR]: StringKind.WideChar,
          [DefaultAttributeEnum.GRAPHIC]: StringKind.Graphic,
        };
        const kind = mapTo[typeAsEnum];
        this.addAttributeWitness(
          AttributeKind.StringKind,
          kind,
          attribute,
          token,
        );
        break;
      }

      /**
       * Volatility attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-normal-abnormal-attributes
       */
      case DefaultAttributeEnum.NORMAL:
      case DefaultAttributeEnum.ABNORMAL: {
        const volatility =
          typeAsEnum === DefaultAttributeEnum.NORMAL
            ? Volatility.Normal
            : Volatility.Abnormal;
        this.addAttributeWitness(
          AttributeKind.Volatility,
          volatility,
          attribute,
          token,
        );
        break;
      }

      /**
       * Scale attributes with precision
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-precision-attribute
       */
      case DefaultAttributeEnum.PRECISION: {
        this.addPrecision(attribute, token);
        break;
      }

      case DefaultAttributeEnum.POINTER: {
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Locator,
          attribute,
          token,
        );
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        if (precision && precision.length === 1) {
          const size = precision[0];
          if (size !== 32 && size !== 64) {
            //TODO report error about invalid pointer size
          } else {
            this.addAttributeWitness(
              AttributeKind.LocatorKind,
              { type: "pointer", size },
              attribute,
              token,
            );
          }
        }
        break;
      }
      case DefaultAttributeEnum.OFFSET: {
        //TODO set areaVariable if any
        this.addAttributeWitness(
          AttributeKind.LocatorKind,
          { type: "offset", areaVariable: null },
          attribute,
          token,
        );
        break;
      }

      case DefaultAttributeEnum.BUILTIN: {
        //TODO temporary solution
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Unknown,
          attribute,
          token,
        );
        break;
      }

      /**
       * File transmission direction attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-input-output-update-attributes
       */
      case DefaultAttributeEnum.INPUT:
      case DefaultAttributeEnum.UPDATE:
      case DefaultAttributeEnum.OUTPUT: {
        const mapTo = {
          [DefaultAttributeEnum.INPUT]: TransmissionDirection.Input,
          [DefaultAttributeEnum.OUTPUT]: TransmissionDirection.Output,
          [DefaultAttributeEnum.UPDATE]: TransmissionDirection.Update,
        };
        const attributeValue = mapTo[typeAsEnum];
        this.addAttributeWitness(
          AttributeKind.TransmissionDirection,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      case DefaultAttributeEnum.BACKWARDS:
      case DefaultAttributeEnum.BYADDR:
      case DefaultAttributeEnum.BYVALUE:
      case DefaultAttributeEnum.CONDITION:
      case DefaultAttributeEnum.CONSTANT:
      case DefaultAttributeEnum.DIMACROSS:
      case DefaultAttributeEnum.EVENT:
      case DefaultAttributeEnum.EXCLUSIVE:
      case DefaultAttributeEnum.GENERIC:
      case DefaultAttributeEnum.HEX:
      case DefaultAttributeEnum.INONLY:
      case DefaultAttributeEnum.INOUT:
      case DefaultAttributeEnum.IRREDUCIBLE:
      case DefaultAttributeEnum.KEYED:
      case DefaultAttributeEnum.LABEL:
      case DefaultAttributeEnum.LIST:
      case DefaultAttributeEnum.MEMBER:
      case DefaultAttributeEnum.NATIVE:
      case DefaultAttributeEnum.NOINIT:
      case DefaultAttributeEnum.NONNATIVE:
      case DefaultAttributeEnum.NOSCAN:
      case DefaultAttributeEnum.NULLINIT:
      case DefaultAttributeEnum.OPTIONAL:
      case DefaultAttributeEnum.OPTIONS:
      case DefaultAttributeEnum.OUTONLY:
      case DefaultAttributeEnum.PARAMETER:
      case DefaultAttributeEnum.POSITION:
      case DefaultAttributeEnum.PRINT:
      case DefaultAttributeEnum.RANGE:
      case DefaultAttributeEnum.RESCAN:
      case DefaultAttributeEnum.RESERVED:
      case DefaultAttributeEnum.SCAN:
      case DefaultAttributeEnum.STRUCTURE:
      case DefaultAttributeEnum.TRANSIENT:
      case DefaultAttributeEnum.UNION:
      case DefaultAttributeEnum.VARIABLE:
        break;
      default:
        assertUnreachable(typeAsEnum);
    }
  }
  private addPrecision(attribute: ast.ComputationDataAttribute, token: Token) {
    const precision = this.acceptDimensionsAsListOfNumbers(
      attribute.dimensions,
    );
    if (precision && precision.length > 0) {
      this.addAttributeWitness(
        AttributeKind.Precision,
        Precisions.create(
          precision[0],
          precision.length > 1 ? precision[1] : undefined,
        ),
        attribute,
        token,
      );
    }
  }

  build() {
    if (this.possibleDataTypes.size !== 1) {
      // TODO: Reenable once we ensure that we don't show any false positives
      // if (this.elementName) {
      //   this.diagnostics.push(
      //     diagnosticFromCode(
      //       Error.IBM1482I,
      //       this.elementName,
      //       this.elementName.image,
      //     ),
      //   );
      // }
      return {
        type: TypeDescriptions.Unknown(),
        diagnostics: this.diagnostics,
      };
    }
    let dataType = Array.from(this.possibleDataTypes)[0];
    assertType<Exclude<DataType, DataType.Structure>>(dataType);
    return {
      type: TypeDescriptions.createPrimitive(dataType, this.attributeWitnesses),
      diagnostics: this.diagnostics,
    };
  }
  private acceptDimensionsAsListOfNumbers(
    dimensions: ast.Dimensions | null,
  ): number[] | null {
    const result: number[] = [];
    if (!dimensions) {
      return null;
    }
    for (const dim of dimensions.dimensions) {
      if (dim.lower) {
        //TODO lower bound is not acceptable here, report error
        break;
      }
      if (dim.upper?.expression === "*") {
        // TODO We don't support * in dimension for now
        break;
      } else if (dim.upper?.expression?.kind === ast.SyntaxKind.Literal) {
        const literal = dim.upper.expression.value;
        if (literal?.kind === ast.SyntaxKind.NumberLiteral && literal.value) {
          result.push(parseInt(literal.value));
        }
      }
    }
    return result;
  }

  private addAttributeWitness<K extends keyof AttributeTypes>(
    kind: K,
    value: AttributeTypes[K],
    attribute: ast.DeclarationAttribute,
    token: Token,
  ) {
    if (this.attributeWitnesses[kind]) {
      const witness = this.attributeWitnesses[kind]!;
      if (value !== witness.value) {
        this.diagnostics.push(
          diagnosticFromCode(Error.IBM2462I, token, token.image, witness.image),
        );
        return;
      } else if (!witness.implicit) {
        this.diagnostics.push(
          diagnosticFromCode(Error.IBM1309I, token, token.image),
        );
      }
      let currentDataTypes: Set<DataType>;
      if (kind === AttributeKind.DataType) {
        currentDataTypes = new Set([value as DataType]);
      } else {
        currentDataTypes = new Set(DataTypesByAttributeKind[kind]);
      }
      const leftDataTypes = new Set<DataType>(
        [...this.possibleDataTypes].filter((dt) => currentDataTypes.has(dt)),
      );
      if (leftDataTypes.size === 0) {
        this.diagnostics.push(
          diagnosticFromCode(Error.IBM2462I, token, token.image, witness.image),
        );
        return;
      } else {
        this.possibleDataTypes = leftDataTypes;
      }
    } else {
      //first time seeing this attribute
      const current: AttributeWitness<K> = {
        value,
        witness: attribute,
        image: token.image,
        token,
        implicit: false,
      };
      this.attributeWitnesses[kind] = current as AttributeWitnesses[K];
      if (kind === AttributeKind.DataType) {
        this.possibleDataTypes = new Set([value as DataType]);
      }
      this.applyWitnessImplications(kind, current as AttributeWitness<K>);
    }
  }
  private applyWitnessImplications<S extends keyof AttributeTypes>(
    sourceKind: S,
    current: AttributeWitness<S>,
  ) {
    const value = current.value;
    const implications = Implications[sourceKind];
    if (!implications) {
      return;
    }
    for (const [targetKindString, implication] of Object.entries(
      implications,
    )) {
      const targetKind = parseInt(targetKindString) as keyof AttributeTypes;
      const targetWitness = this.attributeWitnesses[targetKind];
      const impliedValue = implication(value);
      if (typeof impliedValue === "undefined") {
        continue;
      }
      if (targetWitness && targetWitness.value !== impliedValue) {
        this.diagnostics.push(
          diagnosticFromCode(
            Error.IBM2462I,
            current.token,
            current.token.image,
            targetWitness.image,
          ),
        );
      } else {
        const newtargetWitness: AttributeWitness<typeof targetKind> = {
          value: impliedValue,
          witness: current.witness,
          image: `${current.image}`,
          token: current.token,
          implicit: true,
        };
        this.attributeWitnesses[targetKind] = newtargetWitness as any;
        if (targetKind === AttributeKind.DataType) {
          this.possibleDataTypes = new Set([impliedValue as DataType]);
        }
        this.applyWitnessImplications(
          targetKind,
          newtargetWitness as AttributeWitness<typeof targetKind>,
        ); //recursively apply implications
      }
    }
  }
}
