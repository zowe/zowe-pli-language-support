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
import * as ast from "../syntax-tree/ast";
import {
  AccessMode,
  Alignment,
  AlignmentType,
  Assignability,
  AttributeKind,
  AttributeTypes,
  AttributeWitness,
  AttributeWitnesses,
  Base,
  BufferMode,
  DataType,
  DataTypesArray,
  DataTypesByAttributeKind,
  Endianess,
  EntryData,
  FileUsage,
  FloatFormat,
  Implications,
  isAttributeValidForPreprocessor,
  NumberMode,
  ParameterPassDirection,
  ParameterPassMode,
  Precisions,
  ScaleMode,
  Scope,
  ScopeType,
  Sign,
  StorageClass,
  StorageConnection,
  StringFormat,
  StringKind,
  TransmissionDirection,
  Volatility,
} from "./descriptions";
import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import { Token } from "../parser/tokens";
import { assertUnreachable } from "../utils/common";
import { computeDimensions } from "./computed-attributes";
import { Error } from "../validation/pli-codes";
import { CompilationUnit } from "../workspace/compilation-unit";

export type AttributeCollectorResult = {
  witnesses: AttributeWitnesses;
  diagnostics: Diagnostic[];
  dataTypeGuess: Set<DataType>;
};

export interface TypeAttributeCollector {
  addAttribute(attribute: ast.DeclarationAttribute): void;
  build(): AttributeCollectorResult;
}

export class DefaultTypeAttributeCollector implements TypeAttributeCollector {
  private diagnostics: Diagnostic[] = [];
  private possibleDataTypes = new Set<DataType>(DataTypesArray);
  private attributeWitnesses: AttributeWitnesses = {
    order: [],
    witnesses: {},
  };

  constructor(
    public elementName: Token,
    private unit: CompilationUnit,
    private inPreprocessor: boolean,
  ) {}

  addAttribute(attribute: ast.DeclarationAttribute): void {
    switch (attribute.kind) {
      /**
       * Builtin attributes (only for builtin files, this is outside the PL/I specification
       * in order to make it possible to declare builtin procedures with parameters of any type)
       */
      case ast.SyntaxKind.AnyAttribute: {
        if (attribute.token) {
          this.addAttributeWitness(
            AttributeKind.DataType,
            attribute.dataType,
            attribute,
            attribute.token,
          );
          this.addAttributeWitness(
            AttributeKind.DataTypeIsGeneric,
            true,
            attribute,
            attribute.token,
          );
          if (attribute.dimensions && attribute.dimensions.token) {
            this.addAttributeWitness(
              AttributeKind.Dimension,
              computeDimensions(attribute.dimensions),
              attribute,
              attribute.dimensions.token,
            );
          }
        }
        break;
      }

      case ast.SyntaxKind.ComputationDataAttribute:
        if (attribute !== null) {
          this.handleDefaultAttribute(attribute);
        }
        break;
      case ast.SyntaxKind.DateAttribute:
      case ast.SyntaxKind.DefinedAttribute:
        break;
      case ast.SyntaxKind.InitAcrossAttribute:
        if (attribute.token) {
          this.addAttributeWitness(
            AttributeKind.InitAcross,
            attribute,
            attribute,
            attribute.token,
          );
        }
        break;
      case ast.SyntaxKind.InitialAttribute:
        if (attribute.initial) {
          this.addAttributeWitness(
            AttributeKind.Initial,
            attribute,
            attribute,
            attribute.initial,
          );
        }
        break;
      case ast.SyntaxKind.InitialToAttribute:
        if (attribute.initial) {
          this.addAttributeWitness(
            AttributeKind.InitialTo,
            attribute,
            attribute,
            attribute.initial,
          );
        }
        break;
      case ast.SyntaxKind.InitialCallAttribute:
        if (attribute.initial) {
          this.addAttributeWitness(
            AttributeKind.InitialCall,
            attribute,
            attribute,
            attribute.initial,
          );
        }
        break;
      case ast.SyntaxKind.DimensionsDataAttribute:
        if (attribute.dimensions && attribute.dimensions.token) {
          this.addAttributeWitness(
            AttributeKind.Dimension,
            computeDimensions(attribute.dimensions),
            attribute,
            attribute.dimensions.token,
          );
        }
        break;
      case ast.SyntaxKind.EntryAttribute:
        if (attribute.entryToken) {
          this.addAttributeWitness(
            AttributeKind.DataType,
            DataType.Entry,
            attribute,
            attribute.entryToken,
          );
          const data: EntryData = {
            sourceAttribute: attribute,
            returns: undefined,
            parameters: [],
          };
          if (attribute.returns.length > 0) {
            const returns = attribute.returns[0];
            data.returns = this.unit.services.inferer.inferType(
              returns,
              this.unit,
            );
          }
          for (const param of attribute.attributes) {
            data.parameters.push(
              this.unit.services.inferer.inferType(param, this.unit),
            );
          }
          this.addAttributeWitness(
            AttributeKind.Entry,
            data,
            attribute,
            attribute.entryToken,
          );
        }
        break;
      case ast.SyntaxKind.EnvironmentAttribute:
      case ast.SyntaxKind.GenericAttribute:
      case ast.SyntaxKind.HandleAttribute:
      case ast.SyntaxKind.IndForAttribute:
      case ast.SyntaxKind.ReservedAttribute: // TODO: @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=declarations-reserved-attribute
        break;
      case ast.SyntaxKind.LikeAttribute:
        if (attribute.reference && attribute.likeToken) {
          this.addAttributeWitness(
            AttributeKind.SetLike,
            attribute.reference,
            attribute,
            attribute.likeToken,
          );
        }
        break;
      case ast.SyntaxKind.PictureAttribute:
        /**
         * Picture wideness attributes
         * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-picture-widepic
         */
        if (attribute.pictureToken) {
          this.addAttributeWitness(
            AttributeKind.DataType,
            DataType.Picture,
            attribute,
            attribute.pictureToken,
          );
        }
        break;
      case ast.SyntaxKind.ReturnsAttribute: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=organization-returns-option-attribute
        break;
      case ast.SyntaxKind.TypeAttribute:
        if (attribute.type && attribute.type.node) {
          this.addAttributeWitness(
            AttributeKind.SetType,
            attribute.type.node,
            attribute,
            attribute.type.token,
          );
        }
        break;
      case ast.SyntaxKind.ValueAttribute: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-value-attribute
      case ast.SyntaxKind.ValueListAttribute: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-valuelist-attribute
      case ast.SyntaxKind.ValueListFromAttribute: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-valuelistfrom-attribute
      case ast.SyntaxKind.ValueRangeAttribute: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-valuerange-attribute
        break;
      default:
        assertUnreachable(attribute);
    }
  }

  handleDefaultAttribute(attribute: ast.ComputationDataAttribute) {
    if (attribute.type === null || !attribute.typeToken) {
      return;
    }
    const token = attribute.typeToken;
    const type = attribute.type;
    switch (type) {
      /**
       * Data type attributes
       */
      case ast.DefaultAttribute.TASK:
      case ast.DefaultAttribute.FILE:
      case ast.DefaultAttribute.LABEL:
      case ast.DefaultAttribute.FORMAT:
      case ast.DefaultAttribute.AREA: {
        const mapTo = {
          [ast.DefaultAttribute.AREA]: DataType.Area,
          [ast.DefaultAttribute.FILE]: DataType.File,
          [ast.DefaultAttribute.FORMAT]: DataType.Format,
          [ast.DefaultAttribute.TASK]: DataType.Task,
          [ast.DefaultAttribute.LABEL]: DataType.Label,
        };
        const dataType = mapTo[type];
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
      case ast.DefaultAttribute.SEQUENTIAL:
      case ast.DefaultAttribute.DIRECT: {
        this.addAttributeWitness(
          AttributeKind.AccessMode,
          type === ast.DefaultAttribute.DIRECT
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
      case ast.DefaultAttribute.ALIGNED:
      case ast.DefaultAttribute.UNALIGNED: {
        //TODO check alignment value
        const attributeValue: Alignment =
          type === ast.DefaultAttribute.ALIGNED
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
      case ast.DefaultAttribute.ASSIGNABLE:
      case ast.DefaultAttribute.NONASSIGNABLE: {
        const attributeValue =
          type === ast.DefaultAttribute.ASSIGNABLE
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
      case ast.DefaultAttribute.BINARY:
      case ast.DefaultAttribute.DECIMAL: {
        const base =
          type === ast.DefaultAttribute.BINARY ? Base.Binary : Base.Decimal;
        this.addAttributeWitness(AttributeKind.Base, base, attribute, token);
        this.addPrecision(attribute, token);
        break;
      }

      /**
       * Buffer mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-buffered-unbuffered-attributes
       */
      case ast.DefaultAttribute.BUFFERED:
      case ast.DefaultAttribute.UNBUFFERED: {
        const mode =
          type === ast.DefaultAttribute.UNBUFFERED
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
      case ast.DefaultAttribute.CONNECTED:
      case ast.DefaultAttribute.NONCONNECTED: {
        const connection =
          type === ast.DefaultAttribute.CONNECTED
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
      case ast.DefaultAttribute.BIGENDIAN:
      case ast.DefaultAttribute.LITTLEENDIAN: {
        const endianess =
          type === ast.DefaultAttribute.BIGENDIAN
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
      case ast.DefaultAttribute.STREAM:
      case ast.DefaultAttribute.RECORD: {
        const usage =
          type === ast.DefaultAttribute.STREAM
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
      case ast.DefaultAttribute.IEEE:
      case ast.DefaultAttribute.HEXADEC: {
        const format =
          type === ast.DefaultAttribute.IEEE
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
      case ast.DefaultAttribute.COMPLEX:
      case ast.DefaultAttribute.REAL: {
        const mode =
          type === ast.DefaultAttribute.COMPLEX
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
      case ast.DefaultAttribute.FLOAT:
      case ast.DefaultAttribute.FIXED: {
        const scaleMode =
          type === ast.DefaultAttribute.FIXED
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
      case ast.DefaultAttribute.INTERNAL:
      case ast.DefaultAttribute.EXTERNAL: {
        //TODO check environment
        const scope: Scope =
          type === ast.DefaultAttribute.INTERNAL
            ? { type: ScopeType.Internal }
            : { type: ScopeType.External, environment: "TODO" };
        this.addAttributeWitness(AttributeKind.Scope, scope, attribute, token);
        break;
      }

      /**
       * Sign attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-signed-unsigned
       */
      case ast.DefaultAttribute.UNSIGNED:
      case ast.DefaultAttribute.SIGNED: {
        const sign =
          type === ast.DefaultAttribute.SIGNED ? Sign.Signed : Sign.Unsigned;
        this.addAttributeWitness(AttributeKind.Sign, sign, attribute, token);
        break;
      }

      /**
       * Storage class attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation
       */
      case ast.DefaultAttribute.AUTOMATIC:
      case ast.DefaultAttribute.STATIC:
      case ast.DefaultAttribute.BASED:
      case ast.DefaultAttribute.CONTROLLED: {
        const mapTo = {
          [ast.DefaultAttribute.AUTOMATIC]: StorageClass.Automatic,
          [ast.DefaultAttribute.STATIC]: StorageClass.Static,
          [ast.DefaultAttribute.BASED]: StorageClass.Based,
          [ast.DefaultAttribute.CONTROLLED]: StorageClass.Controlled,
        };
        const clss = mapTo[type];
        this.addAttributeWitness(AttributeKind.Storage, clss, attribute, token);
        break;
      }

      /**
       * String format attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-varying-varying4-varyingz-nonvarying
       */
      case ast.DefaultAttribute.VARYING4:
      case ast.DefaultAttribute.VARYING:
      case ast.DefaultAttribute.VARYINGZ:
      case ast.DefaultAttribute.NONVARYING: {
        const mapTo = {
          [ast.DefaultAttribute.VARYING4]: StringFormat.Varying4,
          [ast.DefaultAttribute.VARYING]: StringFormat.Varying,
          [ast.DefaultAttribute.VARYINGZ]: StringFormat.VaryingZ,
          [ast.DefaultAttribute.NONVARYING]: StringFormat.NonVarying,
        };
        const format = mapTo[type];
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
      case ast.DefaultAttribute.BIT:
      case ast.DefaultAttribute.UCHAR:
      case ast.DefaultAttribute.WIDECHAR:
      case ast.DefaultAttribute.GRAPHIC:
      case ast.DefaultAttribute.CHARACTER: {
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        const mapTo = {
          [ast.DefaultAttribute.CHARACTER]: StringKind.Character,
          [ast.DefaultAttribute.BIT]: StringKind.Bit,
          [ast.DefaultAttribute.UCHAR]: StringKind.UChar,
          [ast.DefaultAttribute.WIDECHAR]: StringKind.WideChar,
          [ast.DefaultAttribute.GRAPHIC]: StringKind.Graphic,
        };
        const kind = mapTo[type];
        //TODO refers variable?
        this.addAttributeWitness(
          AttributeKind.StringBits,
          {
            kind,
            length:
              precision && precision.length > 0 ? precision[0] : undefined,
          }, //TODO default length?
          attribute,
          token,
        );
        break;
      }

      /**
       * Volatility attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-normal-abnormal-attributes
       */
      case ast.DefaultAttribute.NORMAL:
      case ast.DefaultAttribute.ABNORMAL: {
        const volatility =
          type === ast.DefaultAttribute.NORMAL
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
      case ast.DefaultAttribute.PRECISION: {
        this.addPrecision(attribute, token);
        break;
      }

      case ast.DefaultAttribute.POINTER: {
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
        } else {
          this.addAttributeWitness(
            AttributeKind.LocatorKind,
            { type: "pointer" },
            attribute,
            token,
          );
        }
        break;
      }
      case ast.DefaultAttribute.OFFSET: {
        //TODO set areaVariable if any
        this.addAttributeWitness(
          AttributeKind.LocatorKind,
          { type: "offset", areaVariable: null },
          attribute,
          token,
        );
        break;
      }

      case ast.DefaultAttribute.BUILTIN: {
        this.addAttributeWitness(AttributeKind.BuiltIn, true, attribute, token);
        break;
      }

      /**
       * File transmission direction attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-input-output-update-attributes
       */
      case ast.DefaultAttribute.INPUT:
      case ast.DefaultAttribute.UPDATE:
      case ast.DefaultAttribute.OUTPUT: {
        const mapTo = {
          [ast.DefaultAttribute.INPUT]: TransmissionDirection.Input,
          [ast.DefaultAttribute.OUTPUT]: TransmissionDirection.Output,
          [ast.DefaultAttribute.UPDATE]: TransmissionDirection.Update,
        };
        const attributeValue = mapTo[type];
        this.addAttributeWitness(
          AttributeKind.TransmissionDirection,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      /**
       * Procedure parameter passing attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-using-byvalue-byaddr
       */
      case ast.DefaultAttribute.BYADDR:
      case ast.DefaultAttribute.BYVALUE: {
        const mapTo = {
          [ast.DefaultAttribute.BYADDR]: ParameterPassMode.ByAddr,
          [ast.DefaultAttribute.BYVALUE]: ParameterPassMode.ByValue,
        };
        const attributeValue = mapTo[type];
        this.addAttributeWitness(
          AttributeKind.ParameterPassMode,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      /**
       * Preprocessor scan attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=facilities-preprocessor-scan
       */
      case ast.DefaultAttribute.NOSCAN:
      case ast.DefaultAttribute.SCAN:
      case ast.DefaultAttribute.RESCAN: {
        const mapTo = {
          [ast.DefaultAttribute.NOSCAN]: ast.ScanMode.NOSCAN,
          [ast.DefaultAttribute.SCAN]: ast.ScanMode.SCAN,
          [ast.DefaultAttribute.RESCAN]: ast.ScanMode.RESCAN,
        };
        const attributeValue = mapTo[type];
        this.addAttributeWitness(
          AttributeKind.ScanMode,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      /**
       * Procedure parameter passing direction attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-using-inonly-inout-outonly
       */
      case ast.DefaultAttribute.INONLY:
      case ast.DefaultAttribute.OUTONLY:
      case ast.DefaultAttribute.INOUT: {
        const mapTo = {
          [ast.DefaultAttribute.INONLY]: ParameterPassDirection.InOnly,
          [ast.DefaultAttribute.OUTONLY]: ParameterPassDirection.OutOnly,
          [ast.DefaultAttribute.INOUT]: ParameterPassDirection.InOut,
        };
        const attributeValue = mapTo[type];
        this.addAttributeWitness(
          AttributeKind.ParameterPassDirection,
          attributeValue,
          attribute,
          token,
        );
        break;
      }

      /**
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=conditions-condition-condition
       */
      case ast.DefaultAttribute.CONDITION: {
        //TODO
        break;
      }

      /**
       * List flag attribute
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=data-list-attribute
       */
      case ast.DefaultAttribute.LIST: {
        this.addAttributeWitness(AttributeKind.List, true, attribute, token);
        break;
      }

      case ast.DefaultAttribute.OPTIONAL: {
        this.addAttributeWitness(
          AttributeKind.Optional,
          true,
          attribute,
          token,
        );
        break;
      }

      /**
       * Options attribute
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=organization-options-option-attribute
       */
      case ast.DefaultAttribute.OPTIONS: {
        //TODO
        break;
      }

      /** @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-keyed-attribute */
      case ast.DefaultAttribute.KEYED: {
        //TODO
        break;
      }

      /**
       * Parameter flag attribute
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=procedures-parameter-attribute
       */
      case ast.DefaultAttribute.PARAMETER: {
        this.addAttributeWitness(
          AttributeKind.Parameter,
          true,
          attribute,
          token,
        );
        break;
      }

      case ast.DefaultAttribute.DIMACROSS: //for composite types only
      case ast.DefaultAttribute.UNION: //for composite types only
        break;
      case ast.DefaultAttribute.BACKWARDS: //no documentation found
      case ast.DefaultAttribute.CONSTANT: //no documentation found
      case ast.DefaultAttribute.EVENT: //no documentation found
      case ast.DefaultAttribute.EXCLUSIVE: //no documentation found
      case ast.DefaultAttribute.IRREDUCIBLE: //no documentation found, but @see https://www.ibm.com/support/pages/apar/PI26521
      case ast.DefaultAttribute.REDUCIBLE: //no documentation found
      case ast.DefaultAttribute.MEMBER: //no documentation found
      case ast.DefaultAttribute.NATIVE: //no documentation found
      case ast.DefaultAttribute.NOINIT: //no documentation found
      case ast.DefaultAttribute.NONNATIVE: //no documentation found
      case ast.DefaultAttribute.NULLINIT: //no documentation found
      case ast.DefaultAttribute.TRANSIENT: //no documentation found
      case ast.DefaultAttribute.RANGE: //no documentation found
        break;

      case ast.DefaultAttribute.POSITION: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=control-defined-position-attributes
      case ast.DefaultAttribute.PRINT: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=transmission-print-attribute
      case ast.DefaultAttribute.STRUCTURE: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=definitions-defining-typed-structures-unions
      case ast.DefaultAttribute.VARIABLE: //@see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-variable-attribute
      case ast.DefaultAttribute.CHARGRAPHIC:
      case ast.DefaultAttribute.JSONIGNORE:
      case ast.DefaultAttribute.JSONNAME:
      case ast.DefaultAttribute.JSONNULL:
      case ast.DefaultAttribute.JSONOMIT:
      case ast.DefaultAttribute.JSONTRIMR:
      case ast.DefaultAttribute.XMLATTR:
      case ast.DefaultAttribute.XMLCONTENT:
      case ast.DefaultAttribute.XMLIGNORE:
      case ast.DefaultAttribute.XMLNAME:
      case ast.DefaultAttribute.XMLOMIT:
      case ast.DefaultAttribute.INT:
      case ast.DefaultAttribute.NORESCAN:
        break;
      default:
        assertUnreachable(type);
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
      if (dim.upper?.expression?.kind === ast.SyntaxKind.NumberLiteral) {
        const literal = dim.upper.expression.value;
        if (literal) {
          result.push(parseInt(literal));
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
    if (this.attributeWitnesses.witnesses[kind]) {
      const witness = this.attributeWitnesses.witnesses[kind];
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
      if (
        this.inPreprocessor &&
        !isAttributeValidForPreprocessor(kind, value)
      ) {
        this.diagnostics.push(
          diagnosticFromCode(Error.IBM3552I, token, token.image),
        );
        return;
      }
      const current: AttributeWitness<K> = {
        value,
        witness: attribute,
        image: token.image,
        token,
        implicit: false,
      };
      this.attributeWitnesses.witnesses[kind] =
        current as AttributeWitnesses["witnesses"][K];
      this.attributeWitnesses.order.push(kind);
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
      const targetWitness = this.attributeWitnesses.witnesses[targetKind];
      const impliedValue = implication(value);
      if (impliedValue === undefined) {
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
        this.attributeWitnesses.witnesses[targetKind] = newtargetWitness as any;
        //NO because implicit: this.attributeWitnesses.order.push(targetKind);
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

  build(): AttributeCollectorResult {
    return {
      witnesses: this.attributeWitnesses,
      dataTypeGuess: this.possibleDataTypes,
      diagnostics: this.diagnostics,
    };
  }
}
