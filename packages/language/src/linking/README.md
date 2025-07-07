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

### Symbol Resolution

The symbol resolution step (`resolveReferences`) iterates through all possible references (collected from the previous step) and tries to resolve them. Resolution is done by walking up the scope chain to find a potential match. It first tries to find explicit declarations (e.g., `DCL` statements, or procedure labels). If multiple explicit declarations are found, we report an ambiguity error. If no explicit declarations are found, we try to find implicit declarations (e.g., `A = 1;` or `DO I = 1 TO 300 BY 100;`). When resolving an implicit variable declaration, we check if the usage of the symbol is before or after the declaration (using the `StatementOrderCache`), and report a possible `W IBM1085I: Potential unset variable`.

#### Qualification Status

A resolved node may have three types of qualification statuses:

* `NoQualification`: The qualified identifier did not qualify the node.
* `PartialQualification`: The qualified identifier partially identifies the node, e.g. `A.C`, `B.C`, and `C` partially identifies `C` in `DCL 1 A, 2 B, 3 C`.
* `FullQualification`: The qualified identifier fully identifies the node, e.g. `A.B.C` fully identifies `C` in `DCL 1 A, 2 B, 3 C`.
