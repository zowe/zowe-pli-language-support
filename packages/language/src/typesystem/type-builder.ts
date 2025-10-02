import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import { Token } from "../parser/tokens";
import { assertType } from "../preprocessor/util";
import * as ast from "../syntax-tree/ast";
import { assertUnreachable } from "../utils/common";
import { Error } from "../validation/messages/pli-codes";
import {
  DataType,
  DataTypes,
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

export interface TypeBuilder {
  addAttribute(attribute: ast.DeclarationAttribute): void;
  build(): BuiltType;
}

export class DefaultTypeBuilder implements TypeBuilder {
  private diagnostics: Diagnostic[] = [];
  private possibleDataTypes = new Set<DataType>(DataTypes);
  private attributeWitnesses: AttributeWitnesses = createEmptyAttributeWitnesses();
  constructor(private token: Token | null) { }
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
      case ast.SyntaxKind.EnvironmentAttribute:
      case ast.SyntaxKind.GenericAttribute:
      case ast.SyntaxKind.HandleAttribute:
      case ast.SyntaxKind.IndForAttribute:
      case ast.SyntaxKind.InitialAttribute:
      case ast.SyntaxKind.LikeAttribute:
      case ast.SyntaxKind.OrdinalTypeAttribute:
        break;
      case ast.SyntaxKind.PictureAttribute:
        /**
         * Picture wideness attributes
         * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-picture-widepic
         */
        break;
      case ast.SyntaxKind.ReturnsAttribute:
      case ast.SyntaxKind.TypeAttribute:
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
    assertType<ast.DefaultAttribute>(attribute.type);
    switch (attribute.type) {
      /**
       * Data type attributes
       */
      case "TASK":
      case "FILE":
      case "FORMAT":
      case "AREA": {
        const mapTo = {
          AREA: DataType.Area,
          FILE: DataType.File,
          FORMAT: DataType.Format,
          TASK: DataType.Task,
        };
        const dataType = mapTo[attribute.type];
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
      case "SEQL":
      case "SEQUENTIAL":
      case "DIRECT": {
        this.addAttributeWitness(
          AttributeKind.AccessMode,
          attribute.type === "DIRECT"
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
      case "ALIGNED":
      case "UNALIGNED": {
        //TODO check alignment value
        const attributeValue: Alignment =
          attribute.type === "ALIGNED"
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
      case "ASSIGNABLE":
      case "NONASGN":
      case "NONASSIGNABLE":
        const attributeValue =
          attribute.type === "ASSIGNABLE"
            ? Assignability.Assignable
            : Assignability.Nonassignable;
        this.addAttributeWitness(
          AttributeKind.Assignability,
          attributeValue,
          attribute,
          token,
        );
        break;

      /**
       * Base attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-coded-arithmetic-data
       */
      case "BIN":
      case "BINARY":
      case "DEC":
      case "DECIMAL": {
        const base =
          attribute.type === "BIN" || attribute.type === "BINARY"
            ? Base.Binary
            : Base.Decimal;
        this.addAttributeWitness(AttributeKind.Base, base, attribute, token);
        break;
      }

      /**
       * Buffer mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-buffered-unbuffered-attributes
       */
      case "BUF":
      case "BUFFERED":
      case "UNBUF":
      case "UNBUFFERED": {
        const mode =
          attribute.type === "UNBUF" || attribute.type === "UNBUFFERED"
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
      case "CONNECTED":
      case "NONCONNECTED": {
        const connection =
          attribute.type === "CONNECTED"
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
      case "BIGENDIAN":
      case "LITTLEENDIAN": {
        const endianess =
          attribute.type === "BIGENDIAN" ? Endianess.Big : Endianess.Little;
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
      case "STREAM":
      case "RECORD": {
        const usage =
          attribute.type === "STREAM" ? FileUsage.Stream : FileUsage.Record;
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
      case "IEEE":
      case "HEXADEC": {
        const format =
          attribute.type === "IEEE" ? FloatFormat.IEEE : FloatFormat.HexaDec;
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
      case "COMPLEX":
      case "REAL": {
        const mode =
          attribute.type === "COMPLEX" ? NumberMode.Complex : NumberMode.Real;
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
      case "FIXED": {
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Arithmetic,
          attribute,
          token,
        );
        this.addAttributeWitness(
          AttributeKind.Scale,
          {
            mode: ScaleMode.Fixed,
            //TODO verify default precision for fixed
            totalDigitsCount: precision ? precision[0] : 5,
            fractionalDigitsCount:
              precision && precision.length > 1 ? precision[1] : 0,
          },
          attribute,
          token,
        );
        break;
      }
      case "FLOAT": {
        const witness = this.attributeWitnesses[AttributeKind.Scale];
        if (witness?.value?.mode === ScaleMode.Fixed) {
          this.diagnostics.push(
            diagnosticFromCode(Error.IBM2424I, witness.token),
          );
          break;
        }
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        this.addAttributeWitness(
          AttributeKind.Scale,
          // TODO verify default precision for float
          {
            mode: ScaleMode.Float,
            totalDigitsCount: precision ? precision[0] : 51,
          },
          attribute,
          token,
        );
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Arithmetic,
          attribute,
          token,
        );
        break;
      }

      /**
       * Scope attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=declarations-internal-external-attributes
       */
      case "INTERNAL":
      case "EXTERNAL": {
        //TODO check environment
        const scope: Scope =
          attribute.type === "INTERNAL"
            ? { type: ScopeType.Internal }
            : { type: ScopeType.External, environment: "TODO" };
        this.addAttributeWitness(AttributeKind.Scope, scope, attribute, token);
        break;
      }

      /**
       * Sign attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-signed-unsigned
       */
      case "UNSIGNED":
      case "SIGNED": {
        const sign = attribute.type === "SIGNED" ? Sign.Signed : Sign.Unsigned;
        this.addAttributeWitness(AttributeKind.Sign, sign, attribute, token);
        break;
      }

      /**
       * Storage class attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1?topic=control-storage-classes-allocation-deallocation
       */
      case "AUTOMATIC":
      case "STATIC":
      case "BASED":
      case "CONTROLLED": {
        const mapTo = {
          AUTOMATIC: StorageClass.Automatic,
          STATIC: StorageClass.Static,
          BASED: StorageClass.Based,
          CONTROLLED: StorageClass.Controlled,
        };
        const clss = mapTo[attribute.type];
        this.addAttributeWitness(AttributeKind.Storage, clss, attribute, token);
        break;
      }

      /**
       * String format attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-varying-varying4-varyingz-nonvarying
       */
      case "VARYING4":
      case "VARYING":
      case "VARZ":
      case "VARYINGZ":
      case "NONVARYING": {
        const mapTo = {
          VARYING4: StringFormat.Varying4,
          VARYING: StringFormat.Varying,
          VARZ: StringFormat.VaryingZ,
          VARYINGZ: StringFormat.VaryingZ,
          NONVARYING: StringFormat.NonVarying,
        };
        const format = mapTo[attribute.type];
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
      case "BIT":
      case "UCHAR":
      case "WIDECHAR":
      case "GRAPHIC":
      case "CHAR":
      case "CHARACTER": {
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
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.String,
          attribute,
          token,
        );
        const mapTo = {
          CHAR: StringKind.Character,
          CHARACTER: StringKind.Character,
          BIT: StringKind.Bit,
          UCHAR: StringKind.UChar,
          WIDECHAR: StringKind.WideChar,
          GRAPHIC: StringKind.Graphic,
        };
        const kind = mapTo[attribute.type];
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
      case "NORMAL":
      case "ABNORMAL": {
        const volatility =
          attribute.type === "NORMAL" ? Volatility.Normal : Volatility.Abnormal;
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
      case "PREC":
      case "PRECISION": {
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        if (precision) {
          if (precision.length === 1) {
            this.addAttributeWitness(
              AttributeKind.DataType,
              DataType.Arithmetic,
              attribute,
              token,
            );
            this.addAttributeWitness(
              AttributeKind.Scale,
              {
                mode: ScaleMode.Fixed,
                totalDigitsCount: precision[0],
                fractionalDigitsCount: 0,
              },
              attribute,
              token,
            );
          } else if (precision.length >= 2) {
            if (
              this.attributeWitnesses[AttributeKind.Scale]?.value?.mode ===
              ScaleMode.Float
            ) {
              this.diagnostics.push(diagnosticFromCode(Error.IBM2424I, token));
              break;
            }
            this.addAttributeWitness(
              AttributeKind.DataType,
              DataType.Arithmetic,
              attribute,
              token,
            );
            this.addAttributeWitness(
              AttributeKind.Scale,
              {
                mode: ScaleMode.Fixed,
                totalDigitsCount: precision[0],
                fractionalDigitsCount: precision[1],
              },
              attribute,
              token,
            );
          }
        }
        break;
      }

      case "PTR":
      case "POINTER": {
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
      case "OFFSET": {
        //TODO set areaVariable if any
        this.addAttributeWitness(
          AttributeKind.LocatorKind,
          { type: "offset", areaVariable: null },
          attribute,
          token,
        );
        break;
      }

      case "BUILTIN": {
        //TODO temporary solution
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Unknown,
          attribute,
          token,
        );
        break;
      }
        

      case "BACKWARDS":
      case "BYADDR":
      case "BYVALUE":
      case "CONDITION":
      case "CONSTANT":
      case "CTL":
      case "DIMACROSS":
      case "EVENT":
      case "EXCLUSIVE":
      case "EXT":
      case "GENERIC":
      case "HEX":
      case "INONLY":
      case "INOUT":
      case "INPUT":
      case "INT":
      case "IRREDUCIBLE":
      case "KEYED":
      case "LABEL":
      case "LIST":
      case "MEMBER":
      case "NATIVE":
      case "NOINIT":
      case "NONNATIVE":
      case "NOSCAN":
      case "NULLINIT":
      case "OPTIONAL":
      case "OPTIONS":
      case "OUTONLY":
      case "OUTPUT":
      case "PARAMETER":
      case "POSITION":
      case "PRINT":
      case "RANGE":
      case "RESCAN":
      case "RESERVED":
      case "SCAN":
      case "STRUCTURE":
      case "TRANSIENT":
      case "UNAL":
      case "UNION":
      case "UPDATE":
      case "VAR":
      case "VARIABLE":
        break;
      default:
        assertUnreachable(attribute.type);
    }
  }
  build() {
    if (this.possibleDataTypes.size !== 1) {
      if (this.token) {
        this.diagnostics.push(
          diagnosticFromCode(Error.IBM1482I, this.token, this.token.image),
        );
      }
      return {
        type: TypeDescriptions.Unknown(),
        diagnostics: this.diagnostics,
      };
    }
    const dataType = Array.from(this.possibleDataTypes)[0];
    return {
      type: TypeDescriptions.create(dataType, this.attributeWitnesses),
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
    witness: ast.DeclarationAttribute,
    token: Token,
  ) {
    if (this.attributeWitnesses[kind]) {
      const witness = this.attributeWitnesses[kind]!;
      if (value !== witness.value) {
        this.diagnostics.push(
          diagnosticFromCode(Error.IBM2462I, token, token.image, witness.image),
        );
        return;
      } else {
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
      this.attributeWitnesses[kind] = {
        value,
        witness,
        image: token.image,
        token,
      } as AttributeWitnesses[K];
      if (kind === AttributeKind.DataType) {
        this.possibleDataTypes = new Set([value as DataType]);
      }
    }
  }
}
