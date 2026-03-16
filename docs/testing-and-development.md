# Testing and Development Guide

This document explains how to set up the development environment, build the project, run tests, and debug. It also describes the test infrastructure in detail so you can write effective tests for new features.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v20.18.1 (see `.nvmrc`; use `nvm use` if you have nvm installed) |
| **pnpm** | 9.x (`npm install -g pnpm@9`) |
| **VS Code** | 1.67.0 or later (for running the extension locally) |

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url> && cd broadcom-pli-ai-support

# Install dependencies
pnpm install

# Build everything (TypeScript + esbuild bundle + TextMate grammar)
pnpm build

# Run tests (watch mode)
pnpm test

# Check formatting
pnpm lint
```

---

## Build Pipeline

The full build runs four stages via `pnpm build`:

| Stage | Command | What it does |
|-------|---------|--------------|
| 1. Clean | `pnpm clean` | Removes `*.tsbuildinfo` and `out/` directories from `packages/language` and `packages/vscode-extension`. |
| 2. Compile | `tsc -b tsconfig.build.json` | TypeScript compilation using project references. Compiles `packages/language/src/` → `packages/language/out/` and type-checks `packages/vscode-extension/`. |
| 3. Bundle | `pnpm --dir packages/vscode-extension esbuild:bundle` | Runs `packages/vscode-extension/esbuild.mjs` to bundle four entry points (Node extension, Node language server, Browser extension, Browser language server) into `out/`. |
| 4. Merge grammar | `tsx ./scripts/generate-tmlanguage.mts` | Merges TextMate grammar files into `syntaxes/pli.merged.json` for syntax highlighting. |

For incremental development, use:

```bash
pnpm watch    # Watch-mode TypeScript compilation (stage 2 only)
```

---

## Running the Extension Locally

Use the VS Code launch configurations in `.vscode/launch.json`:

| Launch Config | What it does |
|---------------|-------------|
| **Run Extension** | Launches a new VS Code window (Extension Development Host) with the extension loaded. Opens `code_samples/plugin-example/` as the workspace. |
| **Run Web Extension** | Same but in browser/web extension mode with `code_samples/` as workspace. |
| **Attach to Language Server** | Attaches the debugger to the language server process on port 6009. Use this after "Run Extension" to debug server-side code. |
| **Extension + Language Server** | Compound config: launches the extension and attaches to the language server together. |

**Typical workflow:**

1. Press **F5** (or select "Run Extension" from the debug panel).
2. Open a `.pli` file in the Extension Development Host window.
3. Set breakpoints in `packages/language/src/` files.
4. If debugging server code, also launch "Attach to Language Server."

---

## Testing

### Test Framework

The project uses **Vitest** (v4.x) with the `@vitest/coverage-v8` coverage provider. Configuration is in `vitest.config.ts` at the repository root.

### Types of Tests

| Type | Location | ~Count | Description |
|------|----------|--------|-------------|
| **Unit tests** | `packages/language/test/**/*.test.ts` | ~27 files | Test individual modules: lexer, parser, preprocessor, LSP features, type system, workspace, validation. |
| **Fourslash integration tests** | `packages/language/test/fourslash/**/*.ts` | ~900+ files | Declarative integration tests that simulate opening PL/I files and verify diagnostics, completion, hover, references, linking, etc. |

### Running Tests

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests in watch mode (re-runs on file changes). |
| `pnpm coverage` | Run all tests once with coverage report. |
| `pnpm vitest run <path>` | Run a specific test file. |

**Run a single fourslash test:**

```bash
HARNESS_TEST_FILE=packages/language/test/fourslash/linker/procedure-label-not-referenced.ts \
  pnpm vitest run packages/language/test/fourslash-harness/execute.test.ts
```

**VS Code launch configs for tests:**

| Config | Description |
|--------|-------------|
| **Vitest: Run All Tests** | Runs `pnpm vitest run --no-watch` with debugger attached. |
| **Vitest: Run Selected File** | Runs Vitest for the currently open test file. |
| **Vitest: Run Selected Harness Test File** | Runs the fourslash harness for the currently open fourslash file. |

### Test Directory Structure

```
packages/language/test/
├── utils.ts              # Shared helpers: parse(), parseAndLink(), assertNoDiagnostics(), etc.
├── test-builder.ts       # Fluent TestBuilder for programmatic tests
├── fourslash/            # ~900+ fourslash integration test files
│   ├── framework.ts      # Global type declarations (reference only, not executed)
│   ├── completion/       # Completion tests
│   ├── linker/           # Linking/reference tests
│   ├── preprocessor/     # Preprocessor tests (includes, macros)
│   ├── validate/         # Validation rule tests (IBM codes)
│   ├── hover/            # Hover tests
│   └── ...
├── fourslash-harness/    # Harness framework
│   ├── execute.test.ts   # Discovers and runs all fourslash test files
│   ├── harness-parser.ts # Parses fourslash file format
│   ├── harness-runner.ts # Executes parsed commands in a VM
│   ├── harness-interface.ts  # Declares the harness API (verify, linker, completion, etc.)
│   ├── implementation/   # Maps harness API to TestBuilder
│   └── wrappers/         # Test wrappers (main.ts, process.ts)
├── compiler/             # Lexer/compiler-option unit tests
├── parser/               # Parser unit tests
├── preprocessor/         # Preprocessor unit tests
├── lsp/                  # LSP feature tests
├── typesystem/           # Type system tests
├── validation-messages/  # Validation message tests
└── workspace/            # Workspace/compilation-unit tests
```

---

## Fourslash Tests In Depth

Fourslash tests are the primary way integration tests are written in this project. They are inspired by [TypeScript's fourslash test system](https://github.com/microsoft/TypeScript/tree/main/tests/cases/fourslash).

### Anatomy of a Fourslash Test

```typescript
/// <reference path="../framework.ts" />

// @filename: main.pli
// @wrap: main
//// DCL <|1:A|> FIXED BIN;
//// PUT(<|1>A);

linker.expectLinks();
```

**Breakdown:**

1. **`/// <reference path="../framework.ts" />`** — Required boilerplate. Points to the harness type declarations (path varies by directory depth).

2. **`// @filename: main.pli`** — Declares a virtual file. All subsequent `////` lines belong to this file. Multiple `// @filename:` directives create a multi-file test.

3. **`// @wrap: main`** — Wraps the content in a template. `main` wraps in `STARTPR: PROCEDURE OPTIONS (MAIN); ... END STARTPR;`. This avoids boilerplate in every test.

4. **`//// DCL <|1:A|> FIXED BIN;`** — PL/I source lines. `<|1:A|>` is a **range marker**: label `1`, covering the text `A`. `<|1>` alone is a **position marker**: label `1` at that point.

5. **`linker.expectLinks();`** — An assertion command. This verifies that all markers with the same label resolve to each other (i.e. the reference at `<|1>A` links to the declaration at `<|1:A|>`).

### Marker Syntax

| Syntax | Type | Meaning |
|--------|------|---------|
| `<\|label>` | Position marker | Marks a specific cursor position in the source. |
| `<\|label:text\|>` | Range marker | Marks a range of text. The text between `:` and `\|>` is the content. |

### Common Assertion Commands

| Command | What it checks |
|---------|----------------|
| `linker.expectLinks()` | All markers with the same label resolve to each other. |
| `verify.expectErrorCodesAt("1", code.Severe.IBM1916I.fullCode)` | A specific diagnostic code appears at marker `1`. |
| `verify.expectNoDiagnosticsAt("1")` | No diagnostics at marker `1`. |
| `completion.expectAt(1, { includes: ["A"] })` | Completion at marker `1` includes `A`. |
| `hover.expectAt(1, "FIXED BIN(31)")` | Hover at marker `1` shows expected text. |
| `semanticTokens.expectAt("1", "variable")` | Semantic token at marker `1` is of type `variable`. |

### Test Modes

Append a suffix to the filename to change test behavior:

| Suffix | Effect |
|--------|--------|
| `.todo.ts` | Marks test as `test.todo` (pending). |
| `.skip.ts` | Marks test as `test.skip` (skipped). |
| `.fail.ts` | Marks test as `test.fails` (expected to fail). |

### How to Write a New Fourslash Test

1. Create a `.ts` file under the appropriate subdirectory of `packages/language/test/fourslash/`.
2. Add the `/// <reference path>` boilerplate.
3. Define your virtual file(s) with `// @filename:` and `////` content lines.
4. Place markers at the positions you want to test.
5. Add assertion commands.
6. Run: `HARNESS_TEST_FILE=<your-file> pnpm vitest run packages/language/test/fourslash-harness/execute.test.ts`

---

## Writing Unit Tests

Unit tests use standard Vitest `describe`/`test`/`expect` patterns. The key helper is `packages/language/test/utils.ts`:

```typescript
import { parse, parseAndLink, assertNoDiagnostics } from "../utils";

test("example", () => {
  const { unit, diagnostics } = parseAndLink(`
    STARTPR: PROCEDURE OPTIONS (MAIN);
      DCL X FIXED BIN;
      X = 42;
    END STARTPR;
  `);
  assertNoDiagnostics(diagnostics);
});
```

**Key helpers in `utils.ts`:**

| Function | Purpose |
|----------|---------|
| `parse(text)` | Tokenize and parse PL/I text. Returns the compilation unit and diagnostics. |
| `parseStmts(text)` | Parse statements wrapped in a `PROCEDURE OPTIONS (MAIN)` block. |
| `parseAndLink(text)` | Parse, build symbol table, and resolve references. |
| `replaceNamedIndices(text)` | Extract `<|label>` and `<|label:range|>` markers from text. |
| `assertNoParseErrors(...)` | Assert no parser errors. |
| `assertNoLinkingErrors(...)` | Assert no linking errors. |
| `assertNoDiagnostics(...)` | Assert no diagnostics of any kind. |

---

## Other Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm pretty` | Auto-fix formatting with Prettier. |
| `pnpm license:check` | Verify license headers on all source files. |
| `pnpm license:fix` | Auto-add missing license headers. |
| `pnpm package` | Build and package a `.vsix` file for distribution. |
| `pnpm playground` | Build the browser playground. |

---

## Code Style and Conventions

- **Formatter:** Prettier (configured in the project; run `pnpm pretty` before committing).
- **License headers:** Every source file must have the Eclipse Public License v2.0 header. Run `pnpm license:check` to verify.
- **No `CONTRIBUTING.md`:** Follow the patterns established in the codebase. Tests are expected for new features.
- **Branch workflow:** Main development happens on a `development` branch; `main` is for releases (see `packages/language/README.md`).
