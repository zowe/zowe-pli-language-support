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
  TypesDescriptions,
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
} from "./descriptions";

function createEmptyAttributeWitnesses(): AttributeWitnesses {
  const obj: Partial<AttributeWitnesses> = {};
  for (const kind of AttributeKinds) {
    obj[kind] = null;
  }
  return obj as AttributeWitnesses;
}

type BuiltType = {
  type: TypesDescriptions.Any | null;
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
      case "FIXED":
        //TODO check digits count
        this.addAttributeWitness(
          AttributeKind.Scale,
          {
            mode: ScaleMode.Fixed,
            totalDigitsCount: 5,
            fractionalDigitsCount: 0,
          },
          attribute,
          token,
        );
        break;
      case "FLOAT":
        //TODO check digits count
        this.addAttributeWitness(
          AttributeKind.Scale,
          { mode: ScaleMode.Float, totalDigitsCount: 51 },
          attribute,
          token,
        );
        break;
      case "CHAR":
      case "CHARACTER":
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
      case "BIT":
        this.addAttributeWitness(
          AttributeKind.StringKind,
          StringKind.Bit,
          attribute,
          token,
        );
        break;
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
      case "ALIGNED":
        //TODO check alignment value
        this.addAttributeWitness(
          AttributeKind.Alignment,
          { type: AlignmentType.Aligned, alignment: 1 },
          attribute,
          token,
        );
        break;
      case "UNALIGNED":
        this.addAttributeWitness(
          AttributeKind.Alignment,
          { type: AlignmentType.Unaligned },
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
      case "ASSIGNABLE":
        this.addAttributeWitness(
          AttributeKind.Assignability,
          Assignability.Assignable,
          attribute,
          token,
        );
        break;
      case "NONASGN":
      case "NONASSIGNABLE":
        this.addAttributeWitness(
          AttributeKind.Assignability,
          Assignability.Nonassignable,
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
      case "BIN":
      case "BINARY":
        this.addAttributeWitness(
          AttributeKind.Base,
          Base.Binary,
          attribute,
          token,
        );
        break;
      case "DEC":
      case "DECIMAL":
        this.addAttributeWitness(
          AttributeKind.Base,
          Base.Decimal,
          attribute,
          token,
        );
        break;
      case "NONCONNECTED":
        this.addAttributeWitness(
          AttributeKind.Connection,
          StorageConnection.Nonconnected,
          attribute,
          token,
        );
        break;
      case "CONNECTED":
        this.addAttributeWitness(
          AttributeKind.Connection,
          StorageConnection.Connected,
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
      case "BIGENDIAN":
        this.addAttributeWitness(
          AttributeKind.Endianess,
          Endianess.Big,
          attribute,
          token,
        );
        break;
      case "LITTLEENDIAN":
        this.addAttributeWitness(
          AttributeKind.Endianess,
          Endianess.Little,
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
      case "BACKWARDS":
      case "BUFFERED":
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
      case "HEXADEC":
      case "IEEE":
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
      case "OFFSET":
      case "OPTIONAL":
      case "OPTIONS":
      case "OUTONLY":
      case "OUTPUT":
      case "PARAMETER":
      case "POINTER":
      case "POSITION":
      case "PREC":
      case "PRECISION":
      case "PRINT":
      case "PTR":
      case "RANGE":
      case "RECORD":
      case "RESCAN":
      case "RESERVED":
      case "SCAN":
      case "SEQUENTIAL":
      case "STREAM":
      case "STRUCTURE":
      case "TRANSIENT":
      case "UNAL":
      case "UNBUFFERED":
      case "UNION":
      case "UPDATE":
      case "VAR":
      case "VARIABLE":
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
      //TODO add diagnostic about missing or conflicting type attributes
      return {
        type: null,
        diagnostics: this.diagnostics,
      };
    }
    const dataType = Array.from(this.possibleDataTypes)[0];
    return {
      type: TypesDescriptions.create(dataType, this.attributeWitnesses),
      diagnostics: this.diagnostics,
    };
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
      let possibleDatatypes: Set<DataType>;
      if (kind === AttributeKind.DataType) {
        possibleDatatypes = new Set([value as DataType]);
      } else {
        possibleDatatypes = new Set(DataTypesByAttributeKind[kind]);
      }
      const leftDataTypes =
        this.possibleDataTypes.intersection(possibleDatatypes);
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
      } as AttributeWitnesses[K];
    }
  }
}
