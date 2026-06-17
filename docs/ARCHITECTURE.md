# PL/I Language Server Architecture

This document describes the architecture of the PL/I language server (LS).

## Source Files

The core of all data are the so called `CompilationUnit` objects.
These don't represent a single file in our LS, but rather a connected graph of files that are somehow related via `INCLUDE` macros.
I.e. if we have two files in our workspace, `A.pli` and `B.pli` (with `A` containing `%INCLUDE "B.pli"`), we only create a single `CompilationUnit` object that encapsulates both files.
The `uri` of the `CompilationUnit` will point to the entry file.

LSP requests that target the `B.pli` file will be performed on the `CompilationUnit` that "belongs" to the `A.pli` file. Since each `CompilationUnit` stores all tokens of each file belonging to it, the LSP request can then lookup the actual token at the specified client position. 

## Plugin Configuration

In addition to the data stored in the `CompilationUnit`, we also store additional meta data about the current workspace in the plugin configuration.
Each workspace can define a `.pliplugin` directory with a `pgm_conf.json` and `proc_grps.json` file.
`pgm_conf.json` declares which files are programs (entry points) and which process group each one uses; `proc_grps.json` defines those process groups - their compiler options, include libraries, include extensions, and language-server toggles.
This is the only source of information the LS cannot derive from the source code itself: it decides which files become compilation units, which directories `%INCLUDE` resolves against, and which compiler options apply.

For more information on the configuration files, loading, validation, and reload behavior, see [here](./PLUGIN-CONFIG.md).

## Lifecycle

The lifecycle of a document is always the same and is performed in isolation. 
Meaning that no other `CompilationUnit` objects are involved in this process.

The following steps are performed in the order they are written.

### Lexing

The first phase of the lifecycle is responsible for producing the token outputs used by the parser. This phase is also performing the macro expansion.

Before any tokens can be produced, the lexer extracts the compiler options (`*PROCESS`/`%PROCESS` directives, plus the options from the plugin configuration) and applies margin processing, blanking out the column-oriented sequence/carriage-control areas so that only program text remains.
The remaining text is then tokenized. Because options such as `MARGINS` and `CASE` change how the text must be tokenized, they are resolved first.

### Macro Preprocessor

The PL/I macro preprocessor is not a separate text-substitution pass but an interpreted language (`%`-prefixed statements, `%IF`/`%SELECT`/`%DO`, `%INCLUDE`, etc.) that runs as part of lexing and emits ordinary PL/I tokens in place of the directives it consumes.
The preprocessor statements are lowered into a small instruction graph and interpreted, which is also where `%INCLUDE` resolution happens - this is what pulls additional files into the same `CompilationUnit`.
The interpreter records which `%IF`/`%SELECT` branches were taken, which the LS later uses to grey out skipped code in the editor.

For more information on margin processing, compiler options, the macro instruction model, and include resolution, see [here](./PREPROCESSOR.md).

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
Since all named elements in the `SourceFile` are now known, we can start resolving those references.
For that, we simply iterate over them and perform a lookup in the `ReferencesCache`.

For more information regarding the symbol table or reference resolution, see [here](./LINKING.md).

### Semantic Validation

The language server performs semantic validations in the last step.
This includes features such as type checking or other validations performed by the PL/I compiler.
Type checking is backed by the type system, which infers a type description for every typed node (declarations, parameters, expressions, ...) and is also what powers the type information shown on hover and in signature help. For more information, see [here](./TYPE-SYSTEM.md).

## LSP Integration

The LSP integration layer is the thin shell on top of the lifecycle: it receives requests from the language client, finds the `CompilationUnit` and token at the requested position, computes an answer from that data, and translates it back into LSP types.

For more information on the request handlers, the translation layer, and the custom protocol extensions, see [here](./LANGUAGE-SERVER.md).

## Testing

The language server is tested using (1) typical unit tests and (2) integration tests using a custom testing framework called _fourslash_.

See [here](./TESTING.md) for more information on the testing process.
