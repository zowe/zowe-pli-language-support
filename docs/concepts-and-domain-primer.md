# Concepts and Domain Primer

A beginner-friendly guide for developers entering the world of mainframe language tooling, language servers, and configuration-based compiler analysis — written for experienced developers who come from other domains (web, mobile, cloud) and may not be familiar with any of these areas.

Read this guide **before** diving into the project-specific documentation. It will give you the conceptual vocabulary and mental models you need to understand why things are built the way they are.

---

## Table of Contents

1. [The Mainframe World (and Why It Still Matters)](#1-the-mainframe-world-and-why-it-still-matters)
2. [What Is a Language Server?](#2-what-is-a-language-server)
3. [The Analysis Pipeline: How Code Goes from Text to Diagnostics](#3-the-analysis-pipeline-how-code-goes-from-text-to-diagnostics)
4. [The Preprocessor: A Language Inside a Language](#4-the-preprocessor-a-language-inside-a-language)
5. [Configuration-Based Compiler Tooling](#5-configuration-based-compiler-tooling)
6. [Key Recurring Concepts](#6-key-recurring-concepts)
7. [Non-Obvious Subtleties](#7-non-obvious-subtleties)
8. [How to Explore a Codebase Like This](#8-how-to-explore-a-codebase-like-this)

---

## 1. The Mainframe World (and Why It Still Matters)

If you come from web development, "mainframe" might sound like ancient history. It is not. IBM mainframes process roughly 70% of the world's financial transactions, most airline reservation systems, and large portions of government and insurance workloads. The code running those systems is often written in COBOL, PL/I, or Assembler — languages designed in the 1960s that are still actively maintained and extended.

### Why this matters to you

Modern tooling projects like this one exist because mainframe developers deserve the same IDE experience you have: autocomplete, go-to-definition, inline diagnostics, hover information, and refactoring support. The challenge is that mainframe languages carry decades of design decisions that look strange to modern eyes but are deeply rational in their original context.

### Key differences from modern development

| Modern concept | Mainframe equivalent | Why it's different |
|----------------|---------------------|-------------------|
| File system (directories, files) | **Partitioned Datasets (PDS)** — a dataset containing named "members" | No file extensions, no deep directory trees. A "file" is a member of a dataset, often limited to 8-character names. |
| Import / require / include | **`%INCLUDE` / Copybooks** | Not a module system — raw text insertion. The included file is literally spliced into the source at that point, like C's `#include`. |
| Package manager (npm, pip) | **Library paths (SYSLIB)** | No versioning. Libraries are directories the compiler searches for include files. The search order matters. |
| Build config (tsconfig.json, webpack.config.js) | **JCL (Job Control Language) / Compiler options** | Compilation settings are specified through `*PROCESS` directives in the source or through external configuration. There is no standard project file format. |
| Source format (free-form UTF-8) | **Fixed-format columns** | Source code often lives within specific column ranges (e.g. columns 2–72). Column 1 and columns 73–80 are metadata, not code. This is inherited from 80-column punch cards. |

### The key insight

When you see something in a language-server project that seems unnecessarily complex — like margins processing, DD-name resolution, or member-name validation — it almost always traces back to a real mainframe constraint that existing codebases depend on. The language server must faithfully reproduce the compiler's behavior, quirks and all, or its diagnostics will not match what the real compiler produces.

---

## 2. What Is a Language Server?

### The problem

Every IDE (VS Code, IntelliJ, Eclipse, Vim) wants to provide smart features for every language: autocomplete, diagnostics, go-to-definition, find-references, rename, hover, formatting. Without a shared standard, every combination of (IDE × language) requires a custom integration. That is O(n × m) work.

### The solution: Language Server Protocol (LSP)

Microsoft created LSP so that a single **language server** can serve any IDE that speaks the protocol. The server is a separate process that understands one language deeply. The IDE (the "client") communicates with it over JSON-RPC messages.

**Web analogy:** Think of a language server as a backend API. The IDE is the frontend. They communicate over a well-defined protocol (like REST, but for code intelligence). The server holds all the state (parsed code, symbol tables), and the client just sends requests ("what completions are available at line 10, column 5?") and renders the responses.

### How it works in practice

```
┌──────────────────────┐          LSP (JSON-RPC)           ┌───────────────────────┐
│     VS Code          │ ◄──────────────────────────────►  │   Language Server     │
│  (or any LSP client) │                                   │  (separate process)   │
│                      │  textDocument/didOpen             │                       │
│  User opens file  ──►│─────────────────────────────────► │  Tokenize, parse,     │
│                      │                                   │  analyze, validate    │
│                      │  textDocument/publishDiagnostics  │                       │
│  Shows squiggles  ◄──│◄───────────────────────────────── │  Sends diagnostics    │
│                      │                                   │                       │
│  User hovers      ──►│  textDocument/hover ────────────► │  Looks up symbol info │
│  Shows tooltip    ◄──│◄──────────────── hover response── │                       │
└──────────────────────┘                                   └───────────────────────┘
```

### Key LSP messages you will encounter

| Message | Direction | Purpose |
|---------|-----------|---------|
| `textDocument/didOpen` | Client → Server | User opened a file. Server should analyze it. |
| `textDocument/didChange` | Client → Server | User edited a file. Server should re-analyze. |
| `textDocument/publishDiagnostics` | Server → Client | Server sends errors/warnings for the client to display. |
| `textDocument/completion` | Client → Server | User triggered autocomplete. Server returns suggestions. |
| `textDocument/hover` | Client → Server | User hovered over a symbol. Server returns type info / docs. |
| `textDocument/definition` | Client → Server | User wants go-to-definition. Server returns the target location. |
| `textDocument/references` | Client → Server | User wants find-references. Server returns all locations. |
| `initialize` / `initialized` | Both | Handshake: server declares its capabilities, client provides workspace info. |

### The extension is the bridge

In VS Code, a **language client** (a VS Code extension) is responsible for:

1. Starting the language server process.
2. Forwarding editor events to it.
3. Rendering the server's responses (diagnostics as squiggles, completions as dropdown menus, etc.).

The extension itself usually contains very little logic — it is mostly glue code. The real intelligence lives in the language server.

---

## 3. The Analysis Pipeline: How Code Goes from Text to Diagnostics

Every language server follows roughly the same pipeline to turn raw source text into useful IDE features. Understanding this pipeline is the single most important concept for working on any language-tooling project.

### The pipeline, step by step

```
Source text
    │
    ▼
┌──────────────┐
│  Tokenizing  │  Break raw text into meaningful chunks (tokens)
│  (Lexing)    │  "DCL X FIXED BIN;" → [DCL] [X] [FIXED] [BIN] [;]
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Parsing    │  Build a tree structure (AST) from the token stream
│              │  Program → DeclareStatement → Variable(X, FIXED BIN)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Symbol Table │  Index all declarations by name and scope
│ Construction │  { "X" → Variable(FIXED BIN), scope: mainProc }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Linking    │  Resolve every reference to its declaration
│ (Resolution) │  "PUT(X)" → X refers to Variable(X, FIXED BIN)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Validation  │  Check for semantic errors (type mismatches, unused vars, etc.)
│              │  "X = 'hello'" → error: cannot assign CHAR to FIXED BIN
└──────┬───────┘
       │
       ▼
  Diagnostics sent to IDE
```

### Modern analogies for each step

**Tokenizing** is like a scanner at a supermarket checkout — it reads the barcode (raw characters) and produces a structured item (token) with a type and value. In web terms, it is what a JSON parser does when it distinguishes `{`, `"key"`, `:`, `123`, and `}`.

**Parsing** is like an HTML parser building a DOM tree from tags. The token stream `[DCL] [X] [FIXED] [BIN] [;]` becomes a tree node `DeclareStatement { variable: "X", type: FIXED BIN }`. The parser enforces grammar rules: if you write `DCL DCL`, it knows that is a syntax error, just like `<div><div>` without closing tags.

**Symbol table construction** is like building an index for a book. After parsing, you know every declaration exists — but you have not yet connected references to declarations. The symbol table is a lookup structure: "given the name `X` and the current scope, which declaration does it refer to?" This is analogous to how JavaScript resolves variable names through scope chains (block → function → module → global).

**Linking (reference resolution)** is like the linker in C/C++ compilation: it takes unresolved symbols and connects them to their definitions. In language-server terms, this is what makes go-to-definition work. Every time you see a variable name used (not declared), the linker looks it up in the symbol table and creates a link.

**Validation** is like ESLint or TypeScript's type checker: it walks the tree, checks rules, and reports problems. Each rule is a self-contained function that examines one type of AST node. In mainframe language servers, many rules correspond to actual IBM compiler diagnostic codes (e.g., `IBM1059I: SELECT statement contains no OTHERWISE clause`).

### Why the pipeline is always the same order

Each step depends on the output of the previous one:

- You cannot parse without tokens.
- You cannot build a symbol table without an AST.
- You cannot resolve references without a symbol table.
- You cannot validate types without resolved references.

This is why language servers run the full pipeline on every edit and why performance optimization (cancellation, caching, incremental updates) is a constant concern.

---

## 4. The Preprocessor: A Language Inside a Language

### What is a preprocessor?

A preprocessor transforms source code **before** the main parser sees it. If you have used C/C++, you know `#include`, `#define`, `#ifdef`. Mainframe languages like PL/I have preprocessors too, but they are significantly more powerful — closer to a full programming language than a simple text substitution system.

### Why preprocessors are complex in mainframe languages

| Feature | C preprocessor | PL/I preprocessor |
|---------|---------------|-------------------|
| Include files | `#include "file.h"` | `%INCLUDE 'MEMBER';` |
| Conditional compilation | `#ifdef` / `#endif` | `%IF` / `%THEN` / `%ELSE` |
| Macro definitions | `#define MAX(a,b) ...` | `%DECLARE` + `%ACTIVATE` + macro procedures |
| Variables | Not really | Full variable system with types and arithmetic |
| Control flow | Not really | `%DO` loops, `%GOTO`, `%SELECT` |
| Functions | Not really | Built-in functions + user-defined macro procedures |

**The key insight:** A PL/I preprocessor is effectively a small programming language that generates PL/I code. It has its own variables, control flow, and function calls. A language server must execute this preprocessor to produce the final token stream that the "real" parser consumes.

### The virtual machine analogy

In language-server projects, the preprocessor is often implemented as a **virtual machine (VM)**: the preprocessor source is "compiled" into a list of instructions (like bytecode), and an interpreter executes those instructions to produce the final token stream. This is the same pattern as the Java Virtual Machine or the Python bytecode interpreter, just much simpler.

```
Preprocessor source       Preprocessor VM         Final token stream
(%IF, %INCLUDE, etc.)  →  instruction list  →     (used by PL/I parser)
```

### Include resolution: the most important preprocessor feature

When the preprocessor encounters `%INCLUDE 'COPYBOOK'`, it must:

1. **Find the file** — Search configured library directories, trying each configured file extension (e.g. `.pli`, `.inc`, `.cpy`).
2. **Read the file** — Load its contents from the file system.
3. **Process it** — Run it through the same preprocessor pipeline (it might contain its own `%INCLUDE` statements).
4. **Splice the results** — Insert the processed tokens into the main token stream.

This recursive process is why a language server's "compilation unit" is not a single file but a **graph of files** connected by include directives.

---

## 5. Configuration-Based Compiler Tooling

### The problem

In modern development, your project's build configuration is standardized: `tsconfig.json` for TypeScript, `Cargo.toml` for Rust, `pom.xml` for Java. Mainframe languages have no such standard. Historically, compilation settings lived in JCL (Job Control Language) scripts that are specific to the mainframe environment and not portable to a PC-based IDE.

### The solution: workspace configuration

Language servers for mainframe languages solve this by introducing a **workspace configuration directory** (like `.pliplugin/` in this project, or `.copybooks/` in COBOL projects). This directory contains JSON files that tell the language server:

1. **Which source files are entry points** — Not every file in the workspace should be analyzed independently. Some are "programs" (entry points) and others are "copybooks" (included files).
2. **How to group files** — Programs are assigned to **process groups** (named build configurations) that specify which libraries to search, which compiler options to use, and which file extensions to recognize.
3. **Where to find include files** — Library paths (directories containing copybooks) that the preprocessor should search when resolving `%INCLUDE`.

### Analogy: process groups are like build profiles

| Web concept | Mainframe equivalent |
|-------------|---------------------|
| `tsconfig.json` / webpack config | Process group (compiler options, include paths) |
| Build profiles (dev, staging, prod) | Multiple process groups (e.g., "default", "prod", "test") |
| `paths` / `baseUrl` in tsconfig | `libs` in the process group (where to find includes) |
| `include` / `exclude` in tsconfig | `pgm_conf.json` program mappings (which files are entry points) |

### The two-file pattern

Most mainframe language servers use a two-file configuration pattern:

1. **Program configuration** (`pgm_conf.json` or equivalent) — Maps source files to process groups. Answers: "which files are programs, and which build profile does each one use?"
2. **Process group configuration** (`proc_grps.json` or equivalent) — Defines the process groups themselves. Answers: "for this build profile, where are the libraries, what compiler options apply, and what extensions do include files have?"

This separation allows many programs to share the same build settings (process group) without duplicating configuration.

### Why "library file detection" matters

A language server must distinguish between **entry-point files** (programs) and **library files** (copybooks). This distinction matters because:

- **Programs** get their own compilation unit. When you open `main.pli`, the server creates a compilation unit, runs the full pipeline, and sends diagnostics.
- **Library files** do NOT get their own compilation unit. When you open `common.inc` (a copybook), the server recognizes it is under a configured library path and does not analyze it in isolation. It will only be analyzed when included from an entry-point program.

This avoids false diagnostics: a copybook might reference variables that only exist in the including program, so analyzing it alone would produce spurious "undefined variable" errors.

---

## 6. Key Recurring Concepts

### Compilation Unit

**What it is:** The central data structure in a language server. It represents everything the server knows about one program: tokens, AST, symbol table, resolved references, diagnostics, and configuration. Crucially, it is not a single file — it encompasses the entry-point file plus all files included via `%INCLUDE`.

**Web analogy:** Think of a compilation unit as the result of running webpack on a single entry point: it bundles the main file and all its transitive imports into one coherent unit of analysis.

**Why it matters:** Every LSP request (hover, completion, definition) is answered by looking at the compilation unit. If you hover over a variable in `copybook.inc`, the server finds the compilation unit that includes it (owned by `main.pli`), and looks up the variable in that unit's symbol table.

### Diagnostics

**What they are:** Errors, warnings, and informational messages produced during analysis. Each diagnostic has a severity, a message, a location (file + range), and optionally a code (like `IBM1059I`).

**Web analogy:** Diagnostics are like ESLint or TypeScript errors. They appear as squiggly underlines in the editor and in the "Problems" panel.

**How they flow:** Each pipeline step can produce diagnostics. They are accumulated in a `DiagnosticsStore` during the lifecycle, then converted to LSP format and sent to the client after the pipeline completes. Diagnostics are grouped by file — a single compilation unit can produce diagnostics for multiple files (the entry point + included copybooks).

### Scope and Scope Chains

**What they are:** A scope is a region of code where certain names are visible. In PL/I, scopes are created by procedures, begin blocks, and packages. The symbol table is organized by scope, and reference resolution walks the scope chain from innermost to outermost.

**Web analogy:** Identical to JavaScript scope: block scope → function scope → module scope → global scope. When you reference a variable, the runtime (or language server) looks in the current scope first, then walks up the chain.

### The Read Mutex Pattern

**What it is:** A concurrency pattern used in language servers to ensure that LSP request handlers never run while the compilation unit is being updated. Updates (triggered by `textDocument/didChange`) acquire a write lock; request handlers acquire a read lock. Multiple reads can proceed concurrently, but a write blocks all reads.

**Web analogy:** Like a database with read/write locks. `SELECT` queries (reads) can run concurrently. `UPDATE` queries (writes) block everything else. This prevents a hover request from reading a half-updated AST.

---

## 7. Non-Obvious Subtleties

These are concepts that experienced developers from other domains often find surprising or confusing when first working on mainframe language-server projects.

### 1. "Tokenizing" is not just splitting text

In mainframe languages, tokenizing is the most complex pipeline step — not the simplest. Before the main tokenizer even runs, the source text goes through margins processing (stripping fixed-format columns), compiler-option extraction (`*PROCESS` directives), preprocessor parsing, and preprocessor execution. The "token stream" that the PL/I parser sees has already been through four or five transformations.

### 2. The compilation unit is a graph, not a file

If `A.pli` includes `B.inc` and `C.inc`, all three files share one compilation unit. When you edit `A.pli`, the server discards the entire unit and rebuilds it from scratch — including re-processing `B.inc` and `C.inc`. There is no incremental update at the include-file level (yet). This is simpler but means that every keystroke triggers a full re-analysis of all included files.

### 3. Configuration affects analysis at multiple levels

The process group configuration is not just used at startup. It is consulted:
- When deciding whether a file is an entry point or a library file.
- When extracting compiler options (which affect margins, macro behavior, etc.).
- When resolving `%INCLUDE` directives (which libraries to search, which extensions to try).
- When validating (some rules depend on compiler options being set).

A change to the configuration file triggers a full reload and re-analysis of all open files.

### 4. The parser is handwritten, not generated

Many language servers use parser generators (ANTLR, tree-sitter, Langium). In mainframe language projects, the parser is often **handwritten** as a recursive-descent parser. This is because mainframe languages have complex, ambiguous grammars that are difficult to express in standard grammar notations. A handwritten parser gives the developer full control over error recovery, ambiguity resolution, and token annotation.

### 5. Token annotation is a side effect of parsing

As the parser consumes tokens, it annotates each one with the AST node it belongs to and its semantic role (is this identifier a name being declared, or a reference to something else?). This annotation is what makes LSP features efficient: when you hover at offset 42, the server looks up which token is at that offset, checks its annotation, and immediately knows what AST node and semantic role to report. Without this, every LSP request would need to walk the entire AST.

### 6. Diagnostics come from every pipeline step

It is tempting to think "diagnostics = validation," but in practice every step produces diagnostics:
- **Tokenizer/Preprocessor:** Invalid margins, unresolvable `%INCLUDE`, preprocessor syntax errors.
- **Parser:** Syntax errors, unexpected tokens.
- **Symbol table:** (Rarely, but possible for malformed declarations.)
- **Linker:** Unresolved references, ambiguous references, redeclared variables.
- **Validator:** Type mismatches, deprecated features, compiler-specific rules.

All diagnostics are collected into one store and sent together.

### 7. Built-in declarations are real files

Language servers for mainframe languages often provide "built-in" declarations — the standard library functions, types, and constants that every program can use without declaring. These are implemented as actual source files (in a virtual file system) that are parsed and added to the root scope. When you type a built-in function name, the server resolves it by looking it up in this pre-populated scope, just like any user declaration.

---

## 8. How to Explore a Codebase Like This

### Start with the pipeline

Every language-server project has an analysis pipeline. Find it first. Look for a file named `lifecycle.ts`, `pipeline.ts`, `analyzer.ts`, or similar. This file will call the major steps in order and give you a table of contents for the entire codebase.

### Trace a single file open

The best way to understand any language server is to trace what happens when you open a file:

1. **Extension activation** — Find the `activate()` function in the VS Code extension.
2. **Server startup** — Find where the language server process starts and registers LSP handlers.
3. **Document open** — Find the handler for `textDocument/didOpen`. Trace it to the pipeline.
4. **Pipeline execution** — Follow each step (tokenize → parse → link → validate).
5. **Diagnostic delivery** — Find where diagnostics are sent back to the client.

This is a single thread of execution that touches every major component.

### Use the data model as your map

Find the central data structure (often called `SourceFile`, `CompilationUnit`, `Document`, or `Program`). Read its type definition. Every field corresponds to the output of one pipeline step:

- `tokens` → output of tokenizing
- `ast` → output of parsing
- `symbolTable` / `scopeCache` → output of symbol-table construction
- `referencesCache` → input/output of linking
- `diagnostics` → accumulated from all steps

### Read tests to understand behavior

Integration tests (especially fourslash-style tests) are the best documentation for expected behavior. They show you: "given this input, the server should produce these completions / diagnostics / hover results." Read tests before reading implementation.

### Configuration is the entry point for domain logic

If you want to understand why the server behaves differently for different files, start with the configuration loader. It will show you how programs are mapped to build profiles, how library paths are resolved, and how compiler options are merged.

### Map concepts to files

In any language-server project of this type, you will find these functional areas:

| Functional area | What to look for |
|-----------------|-----------------|
| Pipeline orchestrator | A file that calls tokenize → parse → link → validate in sequence |
| Central data model | An interface with fields for tokens, AST, symbol table, diagnostics |
| Configuration loader | A class that reads JSON config files and provides lookup APIs |
| Tokenizer/Lexer | A class that takes raw text and produces a token array |
| Preprocessor | A module that handles `%INCLUDE`, `%IF`, macro expansion |
| Parser | A module that takes tokens and produces an AST |
| Symbol table builder | A module that walks the AST and indexes declarations |
| Reference resolver | A module that links name references to declarations |
| Validator | A registry of check functions dispatched by AST node type |
| LSP handler | A file that registers `connection.onHover`, `connection.onCompletion`, etc. |

Once you identify which file in the codebase corresponds to each area, you have a complete mental map.

---

## Summary

| Concept | One-sentence explanation | Web analogy |
|---------|------------------------|-------------|
| Language Server | A backend process that understands one language and serves IDE features over LSP. | A REST API for code intelligence. |
| Compilation Unit | The full analysis result for one program and all its includes. | The output of webpack for one entry point. |
| Analysis Pipeline | Tokenize → Parse → Symbol Table → Link → Validate, in fixed order. | Build pipeline: transpile → bundle → lint → type-check. |
| Preprocessor | A mini-language that transforms source code before parsing (includes, macros, conditionals). | Babel transforms + webpack loaders combined. |
| Process Group | A named set of build settings (libraries, compiler options, extensions). | A build profile (dev/staging/prod) in your CI config. |
| Program Config | Maps source files to process groups. | The `entry` field in webpack.config.js. |
| Symbol Table | An index of all declarations by name and scope. | `window.__symbols = { name: definition }` but scope-aware. |
| Reference Resolution | Connecting every use of a name to its declaration. | What makes Ctrl+Click "Go to Definition" work. |
| Diagnostics | Errors and warnings collected from every pipeline step, sent to the IDE. | ESLint + TypeScript errors combined. |
| Margins | Fixed column ranges where source code lives (e.g. columns 2–72). | No direct analogy. A mainframe-specific constraint from punch cards. |
| Copybook | A reusable include file (declarations, types, shared code). | A shared module or header file. |

---

**Next step:** Now that you have the domain vocabulary, proceed to the [project-specific documentation](README.md) starting with the [Study Roadmap](study-roadmap.md) and [Architecture Overview](architecture-overview.md).
