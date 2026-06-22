# Type System

The type system models the *attributes* of PL/I data and computes a `TypeDescriptions.Any` value for any syntax node that has a type (declared variables, structure members, procedure parameters, return values, expressions, ordinals, and type aliases).
It lives entirely under [`packages/language/src/typesystem`](../packages/language/src/typesystem) and is consumed by the LSP layer for hover and signature help, and by the validator for type-related diagnostics.

Unlike a conventional language with a small fixed set of types, PL/I describes data through a large, loosely-coupled collection of *attributes* (`FIXED`, `BINARY`, `PRECISION(...)`, `VARYING`, `DIMENSION(...)`, `BASED`, `ALIGNED`, ...).
The central design decision of this subsystem is therefore to treat a type as **a bag of attributes plus a discriminating `DataType`**, derived by collecting the attributes that appear on a declaration, resolving the data type they imply, and recording where each attribute came from.
For the surrounding architecture (compilation units, services, the parser/linker that feed this layer) see [ARCHITECTURE.md](./ARCHITECTURE.md); for how the rendered output reaches the editor see [LANGUAGE-SERVER.md](./LANGUAGE-SERVER.md).

## The type description model

The model is defined in [descriptions.ts](../packages/language/src/typesystem/descriptions.ts).
Every type is a `TypeDescriptions.Any`, a discriminated union over the `DataType` enum:

- **`Arithmetic`** - coded arithmetic data (`FIXED`/`FLOAT`, `BINARY`/`DECIMAL`).
  Carries `scale` (`ScaleMode.Fixed`/`Float`), `base` (`Base.Binary`/`Decimal`), `precision` (`{ totalDigitsCount, fractionalDigitsCount? }`), `sign`, `mode` (`NumberMode.Real`/`Complex`), `endianness`, and `floatFormat`.
  `DefaultPrecisions` and `MaximumPrecisions` encode the per-base/per-scale precision limits (e.g. FIXED BINARY default 15, max 31).
- **`String`** - `CHARACTER`/`BIT`/`GRAPHIC`/`UCHAR`/`WIDECHAR` strings.
  `stringBits` holds the `StringKind` and a length (a number, `"*"`, or a `refers` variable); `format` is the `StringFormat` (`VARYING`/`VARYING4`/`VARYINGZ`/`NONVARYING`).
- **`Picture`** - `PICTURE`/`WIDEPIC` editing pictures with a `NumberMode` domain.
- **`Locator`** - `POINTER`/`HANDLE`/`OFFSET`, distinguished by the `LocatorKind` union (pointers carry an optional `32`/`64` size).
- **`Entry`** - entry/procedure references.
  The `EntryData` attribute records the resolved `returns` type and `parameters` types (inferred lazily by calling back into the inferer).
- **`Ordinal`** - enumerations, carrying the list of member `names`.
- **`Area`**, **`File`**, **`Format`**, **`Label`**, **`Task`** - the remaining non-data and non-computational types.
  `File` carries `accessMode`/`bufferMode`/`transmissionDirection`/`usage`.
- **`Composite`** (`Structure` and `Union`) - aggregates.
  A composite has a `level`, a `members` map (`DeclaredVariable -> TypeDescriptions.Any`) and a parallel metadata map.
  Members link back via `parentType`/`variableNode`, so a member type knows the structure it belongs to.
- **`Unknown`** - the fallback when a type cannot be determined; assignability and stringification treat it specially (it is skipped in hover, and is assignable to/from anything).

Type **aliases** (`DEFINE ALIAS`) and `LIKE`/`TYPE` references do not get their own `DataType` - they are resolved to the underlying type during inference (see below), so an alias hovers as the type it stands for.

### Attributes and `AttributeKind`

The full set of attributes is enumerated in `AttributeKind` (precision, scale, base, sign, dimension, alignment, storage class, scope, assignability, varying format, parameter passing, etc.).
Several supporting tables tie the enum together:

- `AttributeTypes` maps each `AttributeKind` to the TypeScript type of its value; `AttributePropertyNames` maps it to the property name on a type description.
- `AttributeKindsByDataType` lists which attributes are meaningful for each `DataType`; `DataTypesByAttributeKind` is the inverse, used to narrow the candidate data type when an attribute is seen.
- `Implications` encodes cross-attribute inference, e.g. seeing `PRECISION` implies `DataType = Arithmetic` (and `Scale = Fixed` when a fractional count is present), and `BINARY`/`VARYING`/`OFFSET` likewise imply their owning data type.
- `DefaultValues` supplies a default for every attribute; the per-type `create*TypeDescription` factories layer documented PL/I defaults on top (e.g. arithmetic defaults to `FLOAT DECIMAL`, `PICTURE`/`STRING` default to `UNALIGNED`).

`DimensionBound[]` represents array dimensions; each `Bound` keeps the evaluated `value` (a number, `"*"`, or `undefined`), the originating expression, and a token, so dimensions can be both type-checked and rendered.

### Attribute witnesses

A type does not just store attribute *values* - it stores `AttributeWitnesses`: for each attribute, the value plus the `witness` AST node, the source `token`, its `image`, and whether it was set implicitly (via an implication).
This is what lets diagnostics point at the exact keyword that caused a conflict, and lets `stringify` reproduce the declaration in the order the attributes were written.
Every concrete type description's `toString()` simply renders its witnesses.

## Type inference

`DefaultTypeInferer` in [infer.ts](../packages/language/src/typesystem/infer.ts) implements the `TypeInferer` service interface (`inferType`, `isAssignable`), registered on the compilation unit as `services.inferer` and called throughout the server as `unit.services.inferer.inferType(node, unit)`.

`inferType` is memoized through `services.typeCache` and dispatches on `node.kind`:

- **Expressions** (`NumberLiteral`, `StringLiteral`, `LocatorCall`, `MemberCall`, `Parenthesis`, unary/binary, etc.) go to `inferExpressionType`.
  Literals synthesize an arithmetic/string type carrying the literal as an `INITIAL` attribute; a `LocatorCall` follows the reference to its declaration; a `MemberCall` walks the member chain and rebuilds the structure type for the referenced member.
  **Binary expressions currently return `Unknown` - arithmetic result inference is not yet wired in** (see below).
- **Declarations** (`DeclareStatement`/`DefineStructureStatement`, `DeclaredItem`, `DeclaredVariable`) go through `inferDeclareStatement`, which flattens the declaration into builder items, builds each item's type, caches it per item node, and reconstructs the structure nesting from the level numbers.
  Asking for a `DeclaredVariable`'s type infers its whole containing statement and then reads the cached result.
- **`DefineAliasStatement`**, **`DefineOrdinalStatement`**, **`ReturnsOption`**, and **entry parameter descriptions** each build a type directly.
  Ordinals, for instance, are inferred as `FIXED BINARY` with synthesized attributes.
- Anything unrecognized falls back to `TypeDescriptions.Unknown()`.

### Caching

[type-cache.ts](../packages/language/src/typesystem/type-cache.ts) is a simple `Map<SyntaxNode, TypeDescriptions.Any>` keyed by node.
Beyond avoiding recomputation, `get` writes a temporary `Unknown` entry *before* invoking the getter, which breaks infinite recursion on circular references (e.g. a self-referential structure).
The cache is per-compilation-unit and cleared on rebuild.

## Building types: primitive vs composite

Attribute collection is shared; type construction splits by shape.

[attribute-witnesses.ts](../packages/language/src/typesystem/attribute-witnesses.ts) holds `DefaultTypeAttributeCollector`, which consumes the AST `DeclarationAttribute`s of a declaration one at a time.
For each attribute it records a witness, narrows a running `possibleDataTypes` set, and applies `Implications` recursively.
It is the primary source of **type-system diagnostics**: conflicting attributes, redundant repeats, and attributes illegal in a preprocessor context.
Its `build()` returns the witnesses, accumulated diagnostics, and the narrowed data-type guess.

[composite-type-builder.ts](../packages/language/src/typesystem/composite-type-builder.ts) (`DefaultCompositeTypeBuilder`) orchestrates a declaration: it flattens nested `DeclaredItem`s into a flat list (propagating shared attributes to children), runs the collector, and decides per item whether it is composite (it has a level and only structure-legal attributes, or is a generic `STRUCTURE`/`UNION`).
Composite items become `TypeDescriptions.createComposite`; everything else is delegated to the primitive builder.

[primitive-type-builder.ts](../packages/language/src/typesystem/primitive-type-builder.ts) (`DefaultPrimitiveTypeBuilder`) turns a witness set into a concrete type.
It resolves `TYPE`/`LIKE` references by inferring the referenced node's type (cloning composites under the new variable, and emitting diagnostics for unresolved or non-structure `LIKE` targets).
Otherwise, if the data-type guess narrowed to exactly one candidate, it calls `TypeDescriptions.createPrimitive(dataType, witnesses)`; an ambiguous guess yields `Unknown`.
`createPrimitive` reads each attribute (or its default) off the witnesses and feeds the matching `create*TypeDescription` factory.

## Arithmetic result types

[arithmetic-operations.ts](../packages/language/src/typesystem/arithmetic-operations.ts) implements the IBM rules for the result type of `+ - * / **` between two arithmetic operands.
`createArithmeticOperationTable(rulesOption)` builds a lookup keyed by `<leftBase><op><rightBase>` from a large rule set transcribed from the IBM documentation (at-least-one-`FLOAT`, unscaled `FIXED`, scaled `FIXED`, and the `RULES(ANS)` vs `RULES(IBM)` variants).
Each rule computes the result base and precision from the operands (`DecimalToBinaryDigitsFactor ≈ 3.32 = ln10/ln2` converts between bases).

Note this table is, at present, exercised only by [its unit tests](../packages/language/test/typesystem/arithmetic-operations.test.ts) - `inferExpressionType` still returns `Unknown` for `BinaryExpression`, so the table is not yet consulted during live inference.
Several rules carry `@todo` markers for special cases (and flag spots where the IBM documentation itself is inconsistent).

## Assignability

There are two assignability paths, and only one is used at runtime:

- `DefaultTypeInferer.isAssignable` (in [infer.ts](../packages/language/src/typesystem/infer.ts)) is the live implementation behind `services.inferer.isAssignable`, used by argument checking.
  It is deliberately permissive: same `DataType` is assignable, arithmetic↔string is allowed (with a numeric-literal sanity check when assigning a string literal to an arithmetic target), and the final fallback returns `true`.
  Most attribute-level constraints are still TODO, so it currently surfaces almost no false positives.
- [assignability.ts](../packages/language/src/typesystem/assignability.ts) exports a stricter, standalone `isAssignableTo` (unknown handling plus arithmetic↔arithmetic), but the remaining rules are TODO and it is not yet the one wired into validation.

Type diagnostics therefore originate from three places: the **attribute collector** (conflicting/illegal attributes), the **builders** (unresolved `LIKE`/`TYPE`), and the **validators** - [type-check-validator.ts](../packages/language/src/validation/type-check-validator.ts) (dimension bounds, precision vs scale, forbidden builtin-only attributes such as `LIST`/`ANY` in user code) and [check-arguments.ts](../packages/language/src/validation/compiler/check-arguments.ts) (argument count and per-argument assignability against a procedure's inferred parameter types, honouring `optional` and variadic `list` parameters).

## Constant evaluation and computed attributes

[evaluate.ts](../packages/language/src/typesystem/evaluate.ts) provides `evaluateExpression`, a small constant-folder for literals and unary `+`/`-`, returning a `Value` (type + value).
[computed-attributes.ts](../packages/language/src/typesystem/computed-attributes.ts) uses it in `computeDimensions`, which turns an AST `Dimensions` node into `DimensionBound[]`, evaluating each bound to a number, `"*"`, or `undefined`, and defaulting a missing lower bound to `1`.
These feed the `Dimension`/`Precision` attribute values during collection.

## Stringification

[stringify.ts](../packages/language/src/typesystem/stringify.ts) renders types back into PL/I source for hover and signature help (connecting this subsystem to the Hover and Signature help features in [LANGUAGE-SERVER.md](./LANGUAGE-SERVER.md)):

- `stringifyAttributeWitnesses` joins the per-attribute stringifiers (defined in `descriptions.ts`) in witness order - this is what every type's `toString()` calls.
- `stringifyTypeDescription(name, type)` produces a full `DCL ...;` block.
  For composites it recurses through members, prefixing each with its level number and reconstructing the surrounding structure from `parentType`.
  It returns `undefined` for `Unknown`, which is how hover falls back to the raw declaration text.
- `stringifyDeclaration`/`extractDeclaration` are the fallback path: they slice the original source between the declaration's start and end tokens, so even types that don't stringify cleanly still show *something*.

Hover ([hover-request.ts](../packages/language/src/language-server/hover-request.ts)) calls `inferType` then `stringifyTypeDescription`, falling back to `stringifyDeclaration`.
Many stringifiers are still stubs (`DIMENSION(*)`, `INITIAL(...)`, `ENTRY` environment names, ordinal names, `POSITION`), so the rendered output is approximate for those attributes - these are the most visible remaining simplifications in the subsystem.
