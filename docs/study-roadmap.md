# Code Navigation Guide: Study Roadmap

A curated reading order for the 10 most important files in the repository. Each entry explains what the file does, why it matters, and what to pay attention to when reading it.

The recommended order follows the same flow as the data: start with the pipeline overview, learn the data model, understand configuration, then walk through each pipeline step (tokenize → preprocess → parse → symbol table → link → validate), and finally see how LSP requests consume the result. By the time you finish file 10, you will understand every function it calls.

> **Tip:** All file paths below are relative to `packages/language/src/`. For PL/I-specific terminology, see the [Glossary](glossary.md).

---

## How the System Works (Simplified Mental Model)

1. **The user opens a `.pli` file in VS Code.** The extension activates and spawns a language server process that communicates over the Language Server Protocol (LSP).

2. **The language server reads the workspace's `.pliplugin/` folder.** Two JSON files -- `pgm_conf.json` and `proc_grps.json` -- tell it which source files are programs, which directories contain copybooks (libraries), and which compiler options to apply.

3. **When a document is opened or changed, the server creates (or reuses) a `CompilationUnit`.** This is a mutable bag that accumulates every analysis result -- tokens, AST, symbol table, references, diagnostics -- for that file and its includes.

4. **The lifecycle pipeline runs six steps in fixed order:** Tokenize → Parse → Generate Symbol Table → Link → Preprocessor Validate → Validate. Each step reads the previous step's output from the `CompilationUnit` and writes its own output back. Between each step, the server checks for cancellation so it can abandon outdated work if the user keeps typing.

5. **Tokenizing is the most complex step.** It extracts `*PROCESS` compiler options, strips margins, runs the PL/I preprocessor (a stack-based virtual machine that handles `%INCLUDE`, `%DECLARE`, `%IF`, macro procedures), and produces a flat token stream for the parser.

6. **`%INCLUDE` resolution happens inside the preprocessor VM.** It searches the process group's library directories for the included file, reads it, recursively tokenizes and preprocesses it, and splices the resulting tokens into the main stream.

7. **The parser is a handwritten recursive-descent parser** (not generated). It consumes the token stream and builds a typed AST where every node has a `SyntaxKind` and children. Note: the `container` pointer (parent reference) is not set by the parser -- it is set later during the symbol-table pass, which is what makes the tree navigable in both directions.

8. **The symbol-table pass walks the AST to index every declaration** (variables, labels, procedures, types) into a `MultiMap<name, QualifiedSyntaxNode>` organized by scope. The reference-resolution pass then links every use of a name to its declaration, enabling go-to-definition and find-references.

9. **Validation rules are modular.** Each rule is a function registered against a `SyntaxKind`. The validator walks the AST and dispatches matching rules. Adding a new diagnostic means writing a function and registering it in `pli-validator.ts` -- no changes to the pipeline.

10. **After the lifecycle completes, diagnostics are sent back to VS Code over LSP.** Every other LSP feature (hover, completion, rename, semantic tokens) is a thin handler that acquires the `CompilationUnit` for the requested file and reads its already-computed AST, symbol table, and references.

---

## Recommended Reading Order

### 1. `packages/language/src/workspace/lifecycle.ts` (108 lines)

**Start here.** This is the table of contents for the entire analysis pipeline.

**What it does:** Defines the `lifecycle()` function that runs every time a document is opened or changed. It calls **six steps** in order: `tokenize` → `parse` → `generateSymbolTable` → `link` → `preprocessorValidate` → `validate`. Each call delegates to a single function in another file.

**Why read first:** Every other file on this list is called from here. Reading lifecycle.ts gives you the complete pipeline at a glance before diving into any one step.

**What to look for:**
- The `lifecycle()` function (line 30) and its six sequential steps.
- How `interruptAndCheck(cancellation)` is placed between steps so the server stays responsive.
- The module-level `const lexer = new PliLexer()` (line 51) -- a single shared lexer instance.
- How each wrapper function (`tokenize`, `parse`, `link`, etc.) writes results back onto the `CompilationUnit`.

---

### 2. `packages/language/src/workspace/compilation-unit.ts` (422 lines)

**What it does:** Defines the `CompilationUnit` interface (the central data structure) and the `CompilationUnitHandler` class that manages all active units and bridges LSP document events to the lifecycle.

**Why read second:** You need to understand the shape of `CompilationUnit` -- every other file reads from or writes to it. And `CompilationUnitHandler` is the orchestrator that decides *when* the lifecycle runs.

**What to look for:**
- The `CompilationUnit` interface (line 67): `uri`, `compilerOptions`, `ast`, `preprocessorAst`, `tokens`, `referencesCache`, `diagnostics`, `rootScope`, `programConfig`, `processGroup`, `services`.
- The lazy `programConfig` and `processGroup` getters (lines 182-203) that cache configuration lookups.
- `getOrCreateCompilationUnit()` (line 243): the decision point that skips library-only files via `isLibFileCandidate()`.
- `updateUri()` (line 332): the entry point from document events into `process()` → `lifecycle()`.
- `process()` (line 364): runs lifecycle, converts diagnostics, sends them per-file.

---

### 3. `packages/language/src/workspace/plugin-configuration-provider.ts` (848 lines)

**What it does:** Loads, parses, and caches `.pliplugin/pgm_conf.json` and `.pliplugin/proc_grps.json`. Provides the `getProgramConfig()`, `getProcessGroupConfig()`, and `isLibFileCandidate()` APIs that the rest of the system uses.

**Why read third:** Configuration determines how everything else behaves -- which compiler options to apply, which libraries to search, which files are entry points.

**What to look for:**
- `ProgramConfig` and `ProcessGroup` interfaces (lines 34, 72): the two main config types.
- `loadConfigurations()` (line 328): reads both JSON files from `.pliplugin/`.
- `postProcessProcessGroups()` (line 481): recursively expands `libs` directories into `$computedLibs` (the list actually used for include resolution).
- `postProcessProgramConfigs()` (line 596): merges compiler options from program + group.
- `getProgramConfig(uri)` (line 762): exact match then glob match via minimatch.
- `isLibFileCandidate(uri)` (line 298): glob-matches against computed lib patterns to decide if a file is a copybook.

---

### 4. `packages/language/src/preprocessor/pli-lexer.ts` (162 lines)

**What it does:** The `PliLexer` class orchestrates the entire tokenization phase: compiler-option extraction, margin processing, preprocessor parsing, instruction generation, and instruction execution. Returns the final token stream used by the PL/I parser.

**Why read fourth:** This is where text becomes tokens, and it is the most complex step in the pipeline. It ties together every preprocessor sub-module.

**What to look for:**
- `tokenize()` (line 55): the single entry point. Trace each call in order:
  1. `extractCompilerOptions(inputText, uri)` -- pulls `*PROCESS` directives and merges with plugin config.
  2. `unit.compilerOptions = opts` -- stores merged options on the unit.
  3. `unit.instructionCache.get(uri, inputText, () => {...})` -- margin processing, preprocessor tokenize, preprocessor parse, instruction generation (cached).
  4. `runInstructions(unit, uri, instruction.result, options)` -- executes the preprocessor VM (include resolution happens here).
- How diagnostics from each sub-phase are added to `unit.diagnostics` under `DiagnosticCategory.Lexer` and `DiagnosticCategory.CompilerOptions`.

---

### 5. `packages/language/src/preprocessor/instruction-interpreter.ts` (2929 lines)

**What it does:** Implements the preprocessor virtual machine. Executes the instruction list produced by `instruction-generator.ts`, handling variable substitution, control flow (`%IF`, `%DO`, `%SELECT`), `%INCLUDE` / `%INSCAN` resolution, macro procedure calls, and built-in functions.

**Why read fifth:** This is where `%INCLUDE` resolution lives and where the preprocessor generates the final token stream. It is the largest single file in the language core and the heart of PL/I macro expansion.

**What to look for:**
- `runInstructions()` (line 324): public entry point; creates the `InterpreterContext` and starts the loop.
- `doRunInstructions()` (line 381): the main loop -- reads instruction nodes and dispatches.
- `runInstruction()` (line 457): async dispatcher (only `Include` is async); all others go to `runInstructionSync()`.
- `runInstructionSync()` (line 480): handles Tokens (PUSH+SCAN+PRINT), Assignment, Declare, Activate, Deactivate, Goto, Select, Do, etc.
- `runIncludeInstruction()` (line 2123): reads the included file, tokenizes, parses preprocessor statements, generates instructions, and recursively runs them.
- `resolveIncludeFileUri()` (line 2359): uses the process group's `$computedLibs` and `includeExtensions` to find the file on the file system.

---

### 6. `packages/language/src/parser/parser.ts` (6573 lines)

**What it does:** A handwritten recursive-descent parser for the PL/I language. Consumes the token stream from the lexer and produces the AST (`ast.Program`). Also annotates each token with its role (name, reference, keyword, etc.) so that LSP features can work efficiently.

**Why read sixth:** This is where the token stream becomes a typed AST. Understanding the grammar rules here is essential for working on any new language feature.

**What to look for:**
- `parsePli(input)` (line 36): the public entry point. Creates a `ParserState` and runs the top-level `pliProgram` rule.
- The `rule()` / `sequence()` / `choice()` / `orRule()` combinators imported from `parser-types.ts` -- these are the building blocks of the grammar.
- `pliProgram` (line 46): the top-level rule that loops over statements.
- Individual statement rules (search for `Statement` in rule names): `declareStatement`, `procedureStatement`, `doStatement`, `ifStatement`, `assignmentStatement`, etc.
- How `state.consume(TokenType)` both advances the parser and annotates tokens with `CstNodeKind`.
- Error recovery via `state.skipRecovery()` -- the parser attempts to resynchronize after errors.

---

### 7. `packages/language/src/linking/symbol-table.ts` (679 lines)

**What it does:** Traverses the AST to build the symbol table and scope tree. Handles all declaration kinds: variables (`DCL`), labels, procedures, parameters, structured declarations (levels), factorized declarations, TYPE definitions (ALIAS, ORDINAL, STRUCTURE).

**Why read seventh:** This is where the AST becomes navigable. After this step, every named element is indexed and every AST node has a `container` parent pointer.

**What to look for:**
- `SymbolTable` class (line 50): `symbols` (a MultiMap of name → QualifiedSyntaxNode), `typeSymbols`, `nodeLookup`.
- `iterateSymbols(unit)` (search for the export): the public entry point called from lifecycle. Walks the AST with `forEachNode`.
- `handleNode(...)`: dispatches to specific handlers for each `SyntaxKind` (ProcedureStatement, DeclareStatement, LabelStatement, etc.).
- `DeclaredItemParser` usage: how structured declarations with levels (1 A, 2 B, 3 C) are converted into a linked list of `QualifiedSyntaxNode`s.
- `recursivelySetContainer()`: sets the `container` property on every AST node so tree traversal works upward.

---

### 8. `packages/language/src/linking/resolver.ts` (509 lines)

**What it does:** Resolves all references collected during symbol-table construction. Walks each reference in the `ReferencesCache`, looks up matching symbols in the scope chain, and reports errors for unresolved or ambiguous references.

**Why read eighth:** This is where "go-to definition" and "find references" get their data. Understanding this file is critical for working on navigation features.

**What to look for:**
- `ReferencesCache` class (near the top): `priorityList` (TYPE/LIKE references resolved first), `list` (normal references), `reverseMap` (declaration → all referencing tokens).
- `resolveReferences(unit)` (search for export): the public entry point. Resolves priority references first, then calls `reiterateSymbols` for affected nodes, then resolves normal references.
- `getMatchingSymbols(...)`: the core lookup -- prefers explicit symbols, falls back to implicit, reports ambiguity.
- `assignReference()` / `assignQualifiedReference()`: handles qualified names (`A.B.C`) by walking the `QualifiedSyntaxNode` parent chain.
- `StatementOrderCache`: tracks statement ordering so the resolver can warn about "use before declare".

---

### 9. `packages/language/src/validation/validator.ts` (169 lines)

**What it does:** The validation orchestrator. Defines the `ValidationChecks` registry (a map from `SyntaxKind` to arrays of validation functions) and the dispatch loop that runs them over the AST. Also handles linking-error-to-diagnostic conversion.

**Why read ninth:** This is where all diagnostic rules are registered and dispatched. When adding a new validation rule, this is the integration point.

**What to look for:**
- `ValidationChecks` type: `Partial<{ [K in SyntaxKind]: ValidationFunction<...>[] }>`. Each key is a syntax kind, each value is an array of check functions.
- `registerPliValidationChecks()` (imported from `pli-validator.ts`): the registry of all PL/I validation rules. Check that file to see which IBM codes are implemented and how they map to AST node types.
- `registerPreprocessorValidationChecks()` (imported from `pp-validator.ts`): the registry for preprocessor checks.
- `generatePliValidationDiagnostics(unit)` / `generatePreprocessorValidationDiagnostics(unit)`: create an acceptor from `unit.diagnostics` and call `validateSyntaxNode`.
- `validateSyntaxNode(...)`: the recursive dispatcher that walks nodes and calls matching handlers.
- `linkingErrorsToDiagnostics(...)`: converts unresolved references, redeclarations, and unused labels into diagnostics.

---

### 10. `packages/language/src/language-server/connection-handler.ts` (379 lines)

**What it does:** The LSP server bootstrap. Creates the `CompilationUnitHandler`, registers all LSP request handlers (hover, completion, definition, references, rename, semantic tokens, code actions, etc.), initializes the plugin configuration, and wires the config-change notification.

**Why read last:** By now you understand everything this file calls. Reading it last shows how all the pieces are wired together at the LSP protocol level.

**What to look for:**
- `startLanguageServer(connection)` (line 59): the single entry point from the language server process.
- `withReadMutex(uri, cb)` (line 64): the pattern used by every LSP handler -- waits for `ready`, acquires the global mutex, finds the compilation unit, acquires the unit mutex, then runs the callback.
- `onInitialize` (line 82): returns server capabilities.
- `onInitialized` (line 127): calls `PluginConfigurationProviderInstance.init()` per folder, sends config diagnostics, then `markReady()`.
- `onNotification(WorkspaceDidChangePlipluginConfigNotification)` (line 328): reloads config and reindexes.
- Each `connection.on*` handler: a thin wrapper that gets the compilation unit and delegates to a request module (e.g. `hoverRequest`, `completionRequest`, `definitionRequest`).

---

## Quick Reference: Files by Topic

| Topic | Primary file | Supporting files |
|-------|-------------|-----------------|
| **Pipeline orchestration** | `workspace/lifecycle.ts` | `workspace/compilation-unit.ts` |
| **Tokenizing** | `preprocessor/pli-lexer.ts` | `parser/tokenizer.ts`, `preprocessor/pli-margins-processor.ts`, `preprocessor/compiler-options-processor.ts` |
| **Preprocessor VM** | `preprocessor/instruction-interpreter.ts` | `preprocessor/instruction-generator.ts`, `preprocessor/instructions.ts`, `parser/parser-entry.ts` |
| **Parsing** | `parser/parser.ts` | `parser/parser-state.ts`, `parser/parser-types.ts`, `parser/tokens.ts`, `parser/binary-expressions.ts` |
| **AST definitions** | `syntax-tree/ast.ts` | `syntax-tree/cst.ts`, `syntax-tree/ast-utils.ts`, `syntax-tree/ast-iterator.ts` |
| **Symbol tables** | `linking/symbol-table.ts` | `linking/declared-item-parser.ts`, `linking/qualified-syntax-node.ts`, `linking/scope.ts` |
| **Linking** | `linking/resolver.ts` | `linking/tokens.ts`, `linking/error.ts` |
| **Configuration** | `workspace/plugin-configuration-provider.ts` | `language-server/constants.ts`, `preprocessor/compiler-options-processor.ts`, `preprocessor/compiler-options/` |
| **Diagnostics** | `validation/diagnostics-store.ts` | `validation/validator.ts`, `validation/pli-validator.ts`, `validation/pp-validator.ts`, `validation/compiler/IBM*.ts` |
| **LSP wiring** | `language-server/connection-handler.ts` | `language-server/hover-request.ts`, `completion/completion-request.ts`, `definition-request.ts`, etc. |

---

## Visual: Reading Order Mapped to the Pipeline

```
Read order    Pipeline step           File
─────────     ──────────────          ─────────────────────────────────────────
   1          (overview)              lifecycle.ts
   2          (data model)            compilation-unit.ts
   3          (configuration)         plugin-configuration-provider.ts
   4          tokenize                pli-lexer.ts
   5          tokenize (preprocessor) instruction-interpreter.ts
   6          parse                   parser.ts
   7          generateSymbolTable     symbol-table.ts
   8          link                    resolver.ts
   9          validate                validator.ts
  10          (LSP wiring)            connection-handler.ts
```

Start at the top of the pipeline and work down. By the time you reach `connection-handler.ts`, you will understand every function it calls.
