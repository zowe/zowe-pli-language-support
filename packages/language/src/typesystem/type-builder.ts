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
  private attributeWitnesses: AttributeWitnesses =
    createEmptyAttributeWitnesses();
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
      case ast.SyntaxKind.PictureAttribute:
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
       * Access mode attributes
       * @see https://www.ibm.com/docs/en/epfz/6.1.0?topic=files-sequential-direct-attributes
       */
      case "SEQL":
      case "SEQUENTIAL":
      case "DIRECT": {
        this.addAttributeWitness(
          AttributeKind.AccessMode,
          attribute.type === "DIRECT" ? AccessMode.Direct : AccessMode.Sequential,
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
        const attributeValue: Alignment = attribute.type === "ALIGNED"
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
        const attributeValue = attribute.type === "ASSIGNABLE"
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
        const base = attribute.type === "BIN" || attribute.type === "BINARY"
          ? Base.Binary
          : Base.Decimal;
        this.addAttributeWitness(
          AttributeKind.Base,
          base,
          attribute,
          token,
        );
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
        const mode = attribute.type === "UNBUF" || attribute.type === "UNBUFFERED"
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
        const connection = attribute.type === "CONNECTED"
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
        const endianess = attribute.type === "BIGENDIAN"
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
      case "STREAM":
      case "RECORD": {
        const usage = attribute.type === "STREAM"
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
      case "IEEE": 
      case "HEXADEC": {
        const format = attribute.type === "IEEE"
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
      
      case "PREC":
      case "PRECISION": {
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
        );
        if (precision) {
          if (precision.length === 1) {
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
      case "FIXED": {
        const precision = this.acceptDimensionsAsListOfNumbers(
          attribute.dimensions,
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
        break;
      }
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
        this.addAttributeWitness(
          AttributeKind.StringKind,
          StringKind.Character,
          attribute,
          token,
        );
        break;
      }
      case "BIT": {
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
          AttributeKind.StringKind,
          StringKind.Bit,
          attribute,
          token,
        );
        break;
      }
      case "ABNORMAL":
        this.addAttributeWitness(
          AttributeKind.Volatility,
          Volatility.Abnormal,
          attribute,
          token,
        );
        break;
      case "NORMAL":
        this.addAttributeWitness(
          AttributeKind.Volatility,
          Volatility.Normal,
          attribute,
          token,
        );
        break;
      case "AREA":
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Area,
          attribute,
          token,
        );
        break;
      case "AUTOMATIC":
        this.addAttributeWitness(
          AttributeKind.Storage,
          StorageClass.Automatic,
          attribute,
          token,
        );
        break;
      case "EXTERNAL":
        //TODO check environment
        this.addAttributeWitness(
          AttributeKind.Scope,
          { type: ScopeType.External, environment: "TODO" },
          attribute,
          token,
        );
        break;
      case "INTERNAL":
        this.addAttributeWitness(
          AttributeKind.Scope,
          { type: ScopeType.Internal },
          attribute,
          token,
        );
        break;
      case "STATIC":
        this.addAttributeWitness(
          AttributeKind.Storage,
          StorageClass.Static,
          attribute,
          token,
        );
        break;
      case "COMPLEX":
        this.addAttributeWitness(
          AttributeKind.NumberMode,
          NumberMode.Complex,
          attribute,
          token,
        );
        break;
      case "REAL":
        this.addAttributeWitness(
          AttributeKind.NumberMode,
          NumberMode.Real,
          attribute,
          token,
        );
        break;
      
      case "VARYING":
        this.addAttributeWitness(
          AttributeKind.StringFormat,
          StringFormat.Varying,
          attribute,
          token,
        );
        break;
      case "VARYING4":
        this.addAttributeWitness(
          AttributeKind.StringFormat,
          StringFormat.Varying4,
          attribute,
          token,
        );
        break;
      case "VARZ":
      case "VARYINGZ":
        this.addAttributeWitness(
          AttributeKind.StringFormat,
          StringFormat.VaryingZ,
          attribute,
          token,
        );
        break;
      case "NONVARYING":
        this.addAttributeWitness(
          AttributeKind.StringFormat,
          StringFormat.NonVarying,
          attribute,
          token,
        );
        break;
      case "FILE":
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.File,
          attribute,
          token,
        );
        break;
      case "TASK":
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Task,
          attribute,
          token,
        );
        break;
      
      case "CONTROLLED":
        this.addAttributeWitness(
          AttributeKind.Storage,
          StorageClass.Controlled,
          attribute,
          token,
        );
        break;
      case "BASED":
        this.addAttributeWitness(
          AttributeKind.Storage,
          StorageClass.Based,
          attribute,
          token,
        );
        break;
      case "FORMAT":
        this.addAttributeWitness(
          AttributeKind.DataType,
          DataType.Format,
          attribute,
          token,
        );
        break;
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
      
      
      case "BACKWARDS":
      case "EXCLUSIVE":
      case "BYADDR":
      case "BYVALUE":
      case "BUILTIN":
      case "CONDITION":
      case "CONSTANT":
      case "CTL":
      case "DIMACROSS":
      case "EVENT":
      case "EXT":
      case "GENERIC":
      case "HEX":
      case "INONLY":
      case "INOUT":
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
        break;
      case "UPDATE":
      case "INPUT":
      case "OUTPUT":
        break;
      case "VAR":
      case "VARIABLE":
        //https://www.ibm.com/docs/en/epfz/6.1.0?topic=attributes-variable-attribute
        break;
      case "SIGNED":
        this.addAttributeWitness(
          AttributeKind.Sign,
          Sign.Signed,
          attribute,
          token,
        );
        break;
      case "UNSIGNED":
        this.addAttributeWitness(
          AttributeKind.Sign,
          Sign.Unsigned,
          attribute,
          token,
        );
        break;
      case "UCHAR":
        this.addAttributeWitness(
          AttributeKind.StringKind,
          StringKind.UChar,
          attribute,
          token,
        );
        break;
      case "WIDECHAR":
        this.addAttributeWitness(
          AttributeKind.StringKind,
          StringKind.WideChar,
          attribute,
          token,
        );
        break;
      case "GRAPHIC":
        this.addAttributeWitness(
          AttributeKind.StringKind,
          StringKind.Graphic,
          attribute,
          token,
        );
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
