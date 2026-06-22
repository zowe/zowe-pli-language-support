# Linking Implementation

The linker handles connecting symbols to their definitions, to later be used in e.g. go-to definition/references.

## The Linker Algorithm

The linker works in two steps:

1. symbol table and scope creation
2. symbol resolution

The symbol table and scope creation step handles extracting declarations from AST nodes (e.g., from variable declarations, implicit assignments, procedure declarations, and do-loop constructs) and filing them into the correct scope. Certain constructs requires additional handling, such as _unrolling_.

### Symbol Table and Scope Creation

The symbol tables and scopes are created by recursively traversing the AST nodes in `iterateSymbolTable`. Upon reaching a node of interest, such as a declaration statement, it will be parsed and added to the symbol table of the current scope.

A scope defines a region of the program in which a declared symbol is valid and can be referred to. Scopes contain a symbol tables, which contain a map of `QualifiedSyntaxNode`s. Scopes and can have a parent scope. Currently, only procedures create child scopes.

Each scope is attached to the respective procedure. During reference resolving, if no scope is attached to the current AST node, the hierarchy is traversed until a scope-defining node (i.e. a procedure) is encountered.

A `QualifiedSyntaxNode` represents a node that can be referenced by a symbol. The node keeps track of its level, and can be explicit and implicit depending on the type of declaration. The node may also be redeclared, if there are multiple nodes with the same identifier on the root level 1 (the `isRedeclared` flag is set during the validation cycle). The qualification status of a resolved symbol is [described below](#qualification-status).

#### Structured Declarations

A structured declaration describes a hierarchy of symbols, similar to namespaces. This is done by using integer levels before the variable name, e.g.:

```pli
DCL 1 A,
      2 B,
        3 K,
        3 G,
      2 C,
        3 K;
```

All declared variables, `A1`, `B`, `C`, `G`, and both `K`s are immediately accessible in the scope. Trying to access the variable `K` without qualification will result in a `S IBM1881I` ambiguity error. To avoid this, you must qualify the variable until it no longer becomes ambiguous, e.g. `A.B.K`. PLI does not require you to fully qualify a structured variable, which means all of these are valid qualifications: `B.G`, `A.G`, and `A.B.G`.

Structured declarations are handled in the `DeclaredItemParser`, where they are converted into `QualifiedSyntaxNode`s, a linked list type data structure. The above PL/I code would be converted into this structure:

```
K -> B -> A
G -> B -> A
B -> A
K -> C -> A
C -> A
A
```

Every letter symbolizes a `QualifiedSyntaxNode`, and every arrow symbolizes the node's `parent`. All of these nodes are then added into the current scope's symbol table. Qualification and ambiguity checking is then later handled in the symbol resolution step. 

#### Wildcard/star declarations

A wildcard declaration, denoted by an asterix (`*`), is used in place of a variable identifier to create a structure without explicitly naming the intermediate level.

```pli
DCL 1 A,
      2 *, /* Wildcard used to anonymously group the following members */
        3 B CHAR(8) VALUE("B");
PUT(A.B); /* 'B' is directly accessible via 'A', as if 'B' was declared at level 2 directly under 'A'. */
/* Output: B */
```

However, a fully qualified reference to a symbol will precede a symbol under a wildcard declaration:

```pli
DCL 1 A,
       2 *, /* Anonymous group */
         3 B CHAR(8) VALUE("B"), /* First 'B', effectively part of A */
       2 B CHAR(8) VALUE("B2"); /* Second 'B', directly part of A /*
PUT(A.B); /* This reference resolves to the second 'B' */
/* Output: B2 */
```

#### Factorized declarations

In the case of factorized variables, a single DeclaredItem can contain multiple names. e.g.:

```pli
DCL 1 A,
      2 (B, C, D),
         3 E;
```

These will be unrolled into non-factorized variables:

```
  DCL 1 A,
        2 B,
        2 C,
        2 D,
          3 E;
```

#### Procedure Parameters

A procedure parameter is declared inside the parenthesis of a procedure. The parameter expects an explicit declaration of itself inside the procedure, and will create an implicit declaration error if this is not the case.

```pli
 MYPROC: PROCEDURE(MYPARAM); /* Implicit declaration error */
  /* DCL MYPARAM; */ /* Expects an explicit declaration inside the procedure. */
  PUT(MYPARAM);
 END MYPROC;
```

If an explicit declaration of the parameter name is declared outside of the procedure, we don't link to it, as the explicit declaration must reside inside the procedure to properly declare the parameter. That is, this code would still result in an implicit declaration error:

```pli
 DCL MYPARAM; /* Explicit declaration outside does not propagate into the below procedure */
 MYPROC: PROCEDURE(MYPARAM); /* Implicit declaration error */
  PUT(MYPARAM);
 END MYPROC;
```

To properly support this, we dynamically add a virtual explicit declaration in the symbol table at the location of the procedure parameter when detecting an implicitly declared procedure parameter during symbol resolution. This causes all containing nodes to link to the implicitly declared procedure parameter, as it behaves as an explicitly declared variable. This is showcased below (NOTE, this is not parsable code):

```pli
 DCL MYPARAM; /* Explicit declaration outside does not propagate into the below procedure */
 MYPROC: PROCEDURE(MYPARAM; DCL MYPARAM); /* We create a virtual explicitly declared variable at the position of the implicitly declared procedure parameter */
  PUT(MYPARAM);
 END MYPROC;
```

### Symbol Resolution

The symbol resolution step (`resolveReferences`) iterates through all possible references (collected from the previous step) and tries to resolve them. Resolution is done by walking up the scope chain to find a potential match. It first tries to find explicit declarations (e.g., `DCL` statements, or procedure labels). If multiple explicit declarations are found, we report an ambiguity error. If no explicit declarations are found, we try to find implicit declarations (e.g., `A = 1;` or `DO I = 1 TO 300 BY 100;`). When resolving an implicit variable declaration, we check if the usage of the symbol is before or after the declaration (using the `StatementOrderCache`), and report a possible `W IBM1085I: Potential unset variable`.

#### Qualification Status

A resolved node may have three types of qualification statuses:

* `NoQualification`: The qualified identifier did not qualify the node.
* `PartialQualification`: The qualified identifier partially identifies the node, e.g. `A.C`, `B.C`, and `C` partially identifies `C` in `DCL 1 A, 2 B, 3 C`.
* `FullQualification`: The qualified identifier fully identifies the node, e.g. `A.B.C` fully identifies `C` in `DCL 1 A, 2 B, 3 C`.

#### LIKE and TYPE attributes

The `LIKE` and `TYPE` attributes extend a declaration with the members of another declared structure or type, e.g.:

```pli
DCL 1 A, 2 B, 2 C;
// X gains the members B and C
// as if they were declared directly under X
DCL 1 X LIKE A;
```

This creates a chicken-and-egg problem for symbol resolution: to build the symbol table entries for `X.B` and `X.C`, we first need to know which declaration `A` resolves to - but resolving `A` normally requires a fully built symbol table. We solve this with **two-phase linking**.

During symbol table creation, any reference that lives inside a `LikeAttribute` or `TypeAttribute` is flagged as a **priority reference**. This happens in `iterateSymbolTable`: once it descends into a `LikeAttribute`/`TypeAttribute` node, the `prioRef` flag is set and propagated to all descendant references, which are then registered via `referencesCache.priorityAdd` instead of the normal `add`.

`resolveReferences` then proceeds in two phases:

1. **Resolve priority references first.** Each priority reference (the target of a `LIKE`/`TYPE`) is resolved against the partially-built symbol table. For every resolved reference, `getNodeToReprocess` walks up to the containing `DeclareStatement` and collects it into a `nodesToReprocess` set.
2. **Reiterate the affected declarations.** `reiterateSymbols` runs a second symbol table pass over _only_ the collected declare statements. Now that the `LIKE`/`TYPE` targets resolve, `getExtendingDeclaredItems` can follow them and `unrollSubtree` copies the target's members into the extending declaration at the correct level. This second pass reuses the existing scopes rather than creating new ones. Duplicate symbols are guarded against via the symbol table's `existingNodes` set (keyed by `QualifiedSyntaxNode.getId()`), so re-processing a declaration does not add its original symbols twice.

After both phases, the symbol table is complete and all remaining (normal) references are resolved against it.

The unrolling itself happens in the `DeclaredItemParser` (`unrollFactorized` -> `unrollSubtree`). When a `DeclaredItem` carries a `LIKE`/`TYPE` attribute, the target's members are spliced in beneath it. Cyclic extensions (e.g. `DCL 1 A LIKE B; DCL 1 B LIKE A;`) are detected with a `visited` set and reported via `reportCyclicLike` instead of recursing infinitely.

Note that `LIKE` references a regular declared variable, whereas `TYPE` references a type declaration. The distinction between variable and type references is described in [Type references](#type-references) below.

#### Type references

Some references do not point at variables but at _types_ declared with `DEFINE STRUCTURE`, `DEFINE ALIAS`, or `DEFINE ORDINAL`:

```pli
DEFINE ALIAS Name CHAR(32) VARYING;
DCL MyName TYPE Name;
```

Type declarations are kept in a separate symbol table from variables. When a `DEFINE` statement is processed, `addTypeDeclaration` files it into the scope's `typeSymbols` map (rather than the `symbols` map used for variables). For `DEFINE ORDINAL`, the ordinal name becomes a type symbol while its members are added as ordinary (variable) symbols.

Each reference carries a `ReferenceType` that controls which table `getMatchingSymbols` searches:

* `ReferenceType.Variable`: only the variable symbol table. This is the default for ordinary PL/I references (including `LIKE` targets).
* `ReferenceType.Type`: only the type symbol table, via `getTypeSymbols`. Used for `TYPE` attributes.
* `ReferenceType.TypeOrVariable`: prefers a type symbol, falling back to a variable when no type matches. This is an exotic case that exists to support type functions such as `BIND(:type, pointer:)`, where the argument may legally be either.

Type symbols are qualified, ambiguity-checked, and assigned to references exactly like variable symbols - only the table they are looked up in differs.

#### REFER attribute

The `REFER` attribute declares a self-defining structure, where the extent (array bound or string length) of one member is held by another member of the _same_ structure. The syntax is `<extent-expression> REFER(<refer-object>)`:

```pli
DCL 1 STR BASED(P),
    2 X FIXED BINARY(31,0),
    2 Y (L REFER(X)), /* Y is an array whose bound is held by the refer object X */
    2 L FIXED BINARY(31,0) INIT(1000);
```

The refer-object case is handled in `getMatchingSymbols`. When resolving a reference, `tryExtractRootStructureIfBasedMember` checks whether the reference's owner sits in the refer-object position. It does so by walking up the chain `ReferenceItem -> MemberCall -> LocatorCall -> Bound` and confirming that the `Bound`'s `refer` slot points back at that `LocatorCall`. If so, it returns the root level-1 composite (`STR`) via `getRootCompositeNode`.

When a root composite is found, the candidate explicit symbols are filtered down to only those that are members of that same composite (`isMemberOfComposite`). This guarantees the refer object links to the member `X` inside `STR` and never to an unrelated `X` declared elsewhere.
