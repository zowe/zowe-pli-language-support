# Glossary

This glossary defines PL/I-specific and project-specific terms used throughout the documentation and codebase. If you encounter an unfamiliar term while reading the docs or the source, check here first.

---

## PL/I Language Terms

| Term | Definition |
|------|-----------|
| **PL/I** | "Programming Language One." A general-purpose, block-structured programming language originally developed by IBM in the 1960s for mainframe systems. It supports both scientific and business computing, with built-in features for concurrency, I/O, and structured data. |
| **Copybook** | A reusable source file included via `%INCLUDE`. Analogous to a C header file. Copybooks typically contain declarations, type definitions, or common routines shared across programs. On mainframes, they are stored in partitioned datasets (PDS). |
| **`%INCLUDE`** | A preprocessor directive that inserts the contents of another file (a copybook) into the current file at compile time. Example: `%INCLUDE 'COMMON';` searches the configured library directories for a file named `COMMON` (with configured extensions). |
| **`%DECLARE` / `%DCL`** | A preprocessor directive that declares a preprocessor variable. Unlike regular `DECLARE`, these variables exist only at preprocess time and are used for conditional compilation and macro expansion. |
| **`%IF` / `%THEN` / `%ELSE`** | Preprocessor conditional directives. Allow conditional inclusion of source code based on preprocessor variable values. Evaluated at preprocess time, not runtime. |
| **`%DO` / `%END`** | Preprocessor loop and block directives. Can repeat code generation or group conditional blocks. |
| **`%INSCAN`** | Like `%INCLUDE`, but the included content is also scanned for preprocessor directives (macro expansion). Used when the included file itself contains preprocessor statements. |
| **`*PROCESS`** | A source-file directive (appears before the first PL/I statement) that sets compiler options for the current compilation unit. Example: `*PROCESS MARGINS(2,72);`. These are merged with options from the `.pliplugin` configuration. |
| **Margins** | In PL/I, source code is typically constrained to specific columns (e.g. columns 2–72), inheriting fixed-format card-image conventions from mainframe punch cards. Column 1 and columns 73+ are ignored by the compiler. The language server respects these margins during analysis. |
| **DCL / DECLARE** | The PL/I statement for declaring variables. Example: `DCL X FIXED BIN(31);` declares a 31-bit fixed binary integer named `X`. |
| **Procedure** | PL/I's equivalent of a function or subroutine. Declared with the `PROCEDURE` keyword and ended with `END`. The main entry point uses `PROCEDURE OPTIONS(MAIN)`. |
| **Label** | A name attached to a statement (written before the colon). Labels are used as targets for `GOTO`, as names for procedures, and for `BEGIN` blocks. Example: `MYPROC: PROCEDURE;`. |
| **Structured declaration** | A hierarchical declaration using level numbers. Example: `DCL 1 REC, 2 NAME CHAR(30), 2 AGE FIXED BIN;` defines a structure `REC` with members `NAME` and `AGE`. |
| **Factorized declaration** | A shorthand for declaring multiple items with shared attributes. Example: `DCL (A, B, C) FIXED BIN;` declares three fixed binary variables. |
| **Qualified name** | A dotted name that navigates a structure hierarchy. Example: `REC.NAME` refers to the `NAME` member inside structure `REC`. |
| **DD-name** | "Data Definition name." On mainframes, a logical name for a dataset. In the context of this project, a DD-name entry in `libs` refers to a mainframe partitioned dataset member using the syntax `ddname(member)`. |
| **PDS / Partitioned Dataset** | A mainframe file system concept: a dataset containing multiple named "members," each of which can be a source file. Library paths in this project may point to PDS-style directories. |

---

## Project-Specific Terms

| Term | Definition |
|------|-----------|
| **CompilationUnit** | The central data structure in the language server. Represents not a single file but a **graph of files** connected via `%INCLUDE` — the entry-point program plus all its included copybooks. Contains tokens, AST, symbol table, references, diagnostics, and configuration. All LSP requests for any file in the graph are served by the same `CompilationUnit`. |
| **Lifecycle** | The six-step analysis pipeline that runs every time a document is opened or changed: tokenize → parse → generate symbol table → link → preprocessor validate → validate. Defined in `packages/language/src/workspace/lifecycle.ts`. |
| **CompilationUnitHandler** | The class that manages all active `CompilationUnit`s and bridges LSP document events to the lifecycle. It decides when to create, reuse, or delete compilation units. |
| **PluginConfigurationProvider** | A singleton that loads, parses, and caches `.pliplugin/pgm_conf.json` and `.pliplugin/proc_grps.json`. Provides APIs to look up program configs, process groups, and library file membership. |
| **Process group** | A named set of build settings (library paths, compiler options, include extensions, LSP options) defined in `proc_grps.json`. Programs are assigned to process groups via `pgm_conf.json`. Analogous to a build configuration or profile. |
| **Program config** | An entry in `pgm_conf.json` that maps a source file (or glob pattern) to a process group. Tells the language server which files are entry points and how they should be analyzed. |
| **`$computedLibs`** | The runtime-expanded list of library directories for a process group. At config load time, each `libs` entry in `proc_grps.json` is recursively expanded to include all subdirectories. This computed list is what the preprocessor actually searches during `%INCLUDE` resolution. |
| **FileStore** | A per-`CompilationUnit` map from file URI to `TextDocument` + tokens. Tracks all files that participate in the compilation unit (entry file + included files). |
| **ReferencesCache** | Collects all `Reference` objects found during symbol-table construction. Used during the linking step to resolve references, and later by LSP features like go-to-definition and find-references. Contains a `reverseMap` (declaration → referencing tokens) and `priorityList` (TYPE/LIKE references resolved first). |
| **DiagnosticsStore** | Accumulates diagnostics from all pipeline phases. Each diagnostic is categorized (CompilerOptions, Lexer, Parser, SymbolTable, Linking, TypeSystem, Validation) and deduplicated by a key derived from its URI, range, and code. |
| **Preprocessor VM** | A stack-based virtual machine (`InstructionInterpreter`) that executes preprocessor instructions. Handles `%INCLUDE`, `%IF`, `%DO`, variable substitution, macro procedures, and built-in functions. Produces the final token stream consumed by the parser. |
| **InstructionGenerator** | Compiles the preprocessor AST (from `preprocessorParse`) into a linked list of `InstructionNode`s that the preprocessor VM executes. |
| **Fourslash tests** | The project's integration test format, inspired by TypeScript's fourslash system. Test files define virtual PL/I files with markers and assertions (e.g. "expect completion at position X to include Y"). See [Testing and Development](testing-and-development.md). |
| **`withReadMutex`** | The pattern used by every LSP request handler in `connection-handler.ts`. It waits for the server to be ready, acquires the global mutex in read mode, finds the compilation unit, acquires the unit's mutex in read mode, then runs the request callback. This ensures LSP requests never run concurrently with document updates. |

---

## Abbreviations

| Abbreviation | Meaning |
|-------------|---------|
| **LSP** | Language Server Protocol |
| **AST** | Abstract Syntax Tree |
| **CST** | Concrete Syntax Tree |
| **VM** | Virtual Machine (in this project: the preprocessor instruction interpreter) |
| **IPC** | Inter-Process Communication (how VS Code communicates with the language server in Node mode) |
| **URI** | Uniform Resource Identifier (used as file keys throughout the codebase) |
| **PP** | Preprocessor |
| **DCL** | Declare (PL/I keyword) |
