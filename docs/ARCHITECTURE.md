# PL/I Language Server Architecture

This document describes the architecture of the PL/I language server (LS).

> **Note:** This is the original architecture document. It uses the term `SourceFile`, which has since been renamed to `CompilationUnit` in the codebase. For comprehensive up-to-date documentation, see the [Architecture Overview](architecture-overview.md), [Execution Flow](execution-flow.md), and [Study Roadmap](study-roadmap.md).

## Source Files (CompilationUnit)

The core of all data are the `CompilationUnit` objects (previously called `SourceFile`).
These don't represent a single file in our LS, but rather a connected graph of files that are somehow related via `INCLUDE` macros.
I.e. if we have two files in our workspace, `A.pli` and `B.pli` (with `A` containing `%INCLUDE "B.pli"`), we only create a single `CompilationUnit` object that encapsulates both files.
The `uri` of the `CompilationUnit` will point to the entry file.

LSP requests that target the `B.pli` file will be performed on the `CompilationUnit` that "belongs" to the `A.pli` file.

## Lifecycle

The lifecycle of a document is always the same and is performed in isolation. 
Meaning that no other `CompilationUnit` objects are involved in this process.
Therefore, we don't need any kind of dependency checking - we just discard the current `CompilationUnit` object and construct a new one.
This might be subject to change later once we start caching data for unchanged parts of the code.

The following steps are performed in the order they are written.

### Lexing

The first phase of the lifecycle is responsible for producing the token outputs used by the parser. This phase is also performing the macro expansion.
All tokens generated/used in the lexing and parsing phase are stored in the `tokens.ts` file.
Note that for performance optimization, some tokens are combined into one, such as all binary operators, etc. This is done by using Chevrotain's token category feature.

The generated tokens are stored on the `CompilationUnit` object.

### Parsing

The parser is handwritten and produces an AST and a list of parser errors as its output.

The parser has a minor side effect: While consuming the token stream, each token is annotated with its use case.
Specifically what `SyntaxNode` the specific token belongs to and what it was parsed for (i.e. is this `ID` a name of a variable, or a reference to a variable).
This information is later required to efficiently respond to the LSP requests of the language client.

### Symbol Table

Once we have a full AST, we can begin constructing the symbol table.
The symbol table is essentially just a lookup structure to find certain elements (labels, declarations, etc.) by their name.
It is created by iterating through the AST and storing some information about them:
1. If the element is a named node that can be referenced somehow, we store it alongside its name in the symbol table.
2. We set the `container` property of each AST node. We use this information later on to traverse the AST more easily (so we can go up and down in the tree!).
3. If an element contains a `Reference` (i.e. an object that stores references to other AST nodes), we store that object in our `ReferencesCache`.

### Reference Resolution

In the previous section, we traversed the AST and stored all `Reference` objects in our `ReferencesCache`.
Since all named elements in the `CompilationUnit` are now known, we can start resolving those references.
For that, we simply iterate over them and perform a lookup in the `ReferencesCache`.

### Semantic Validation

The language server performs semantic validations in the last step.
This includes features such as type checking or other validations performed by the PL/I compiler.
