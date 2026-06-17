# Preprocessor

The preprocessor is the first stage of the PL/I document [lifecycle](./ARCHITECTURE.md#lifecycle): it turns raw source text into the token stream that the parser consumes.
Unlike a classic C-style text preprocessor, the PL/I preprocessor is a small interpreted language (`%`-prefixed macro statements, `%IF`/`%SELECT`/`%DO`, `%INCLUDE`, preprocessor `PROCEDURE`s, and an extensive builtin library) that runs *before* parsing and emits ordinary PL/I tokens in place of the macro directives it consumes.
This document describes how that subsystem is wired together, living under [`packages/language/src/preprocessor/`](../packages/language/src/preprocessor/).

Two cross-cutting concerns are worth flagging up front.
First, the preprocessor records which `%IF`/`%SELECT` branches were actually taken; this data backs the `pli/skippedCode` language-server feature (see [LANGUAGE-SERVER.md](./LANGUAGE-SERVER.md)) which greys out untaken branches in the editor.
Second, the entire chain `%INCLUDE` -> sub-file -> nested `%INCLUDE` is what makes one `CompilationUnit` span several files, as described in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Position in the lifecycle

The lifecycle ([lifecycle.ts](../packages/language/src/workspace/lifecycle.ts)) runs *tokenize -> parse -> symbol table -> link -> validate*.
The preprocessor *is* the tokenize step.
It is orchestrated by [`PliLexer.tokenize`](../packages/language/src/preprocessor/pli-lexer.ts), which performs the following pipeline for the entry document:

1. **Extract compiler options** (`*PROCESS`/`%PROCESS` directives) via [`CompilerOptionsProcessor`](../packages/language/src/preprocessor/compiler-options-processor.ts). The resulting options are stored on the `CompilationUnit` and pushed into the PL/I tokenizer.
2. **Margins processing** ([`PliMarginsProcessor`](../packages/language/src/preprocessor/pli-margins-processor.ts)) blanks out the source margins so only program text remains.
3. **Tokenize + preprocessor-parse** the margin-stripped text. A *full* parse of the local file extracts the preprocessor `Statement`s.
4. **Generate instructions** from those statements ([`generateInstructions`](../packages/language/src/preprocessor/instruction-generator.ts)) - a flat linked list of executable instruction nodes.
5. **Run instructions** ([`runInstructions`](../packages/language/src/preprocessor/instruction-interpreter.ts)), which interprets the macro language, performs `%INCLUDE` resolution, and emits the final token stream.

Steps 3–4 (which are pure functions of the file text) are memoized per-URI in the [`InstructionCache`](../packages/language/src/preprocessor/instruction-cache.ts); step 5 always re-runs because it depends on cross-file state.
The result carries the emitted tokens, the collected preprocessor `statements`, the `evaluationResults` (branch executions), and synthetic token references.
The lifecycle stores `evaluationResults` on `compilationUnit.preprocessorEvaluationResults`, and feeds the tokens to the parser.

## Margins processing

PL/I source is column-oriented.
By default only columns `2`–`72` are program text (`MARGINS(2,72)`); everything outside the margins is sequence numbers or carriage-control characters.
`PliMarginsProcessor.processMargins` reads the effective `MARGINS(m,n)` from the compiler options (falling back to `2`/`72`) and rewrites each line so that the `m-1` prefix columns and any text past column `n` are replaced with spaces, preserving the original line length and EOL so that all downstream token offsets still line up with the source document.

Margin *checking* is optional and gated on the process group's `check-margins` LSP option (see [PLUGIN-CONFIG.md](./PLUGIN-CONFIG.md)).
When enabled, the scanner reports left-margin and right-margin violations (`IBM1084I` for the right margin), with two deliberate exemptions: lines that begin with `%PROCESS`/`*PROCESS` are not flagged on the left, and the prefix area is allowed to contain only the characters matched by `PREFIX_PATTERN` (`[0-9+\- \r\t]`), since real-world code puts digits, `+`, and `-` in column 1.
The right margin is also tolerant of a trailing sequence field.

## Compiler options

`*PROCESS`/`%PROCESS` directives (and the equivalent options from the plugin `pgm_conf.json` configuration) are parsed and translated before anything else, because options such as `MARGINS`, `OR`, `NOT`, `CASE`, and `GRAPHIC` change how the rest of the file must be tokenized.

### Extraction and parsing

[`CompilerOptionsProcessor.getCompilerOptionsRange`](../packages/language/src/preprocessor/compiler-options-processor.ts) hand-scans the text for `PROCESS` directives at column 0, correctly skipping comments and strings, and supporting multi-line directives terminated by `;` (text after the first `;` on a directive is ignored).
It replaces each directive span with equal-length whitespace so positions are preserved, then hands the option text to [`parseAbstractCompilerOptions`](../packages/language/src/preprocessor/compiler-options/parser.ts) - a small Chevrotain-based parser producing an `AbstractCompilerOptions` AST (`name(value, value, ...)` options, possibly nested).

### Translation and dialects

The abstract options are turned into a typed [`CompilerOptions`](../packages/language/src/preprocessor/compiler-options/options.ts) object by the translator in [translate.ts](../packages/language/src/preprocessor/compiler-options/translate.ts).
There are three dialects, each with its own option shape, defaults, and rule table:

- **PLI** ([options-pli.ts](../packages/language/src/preprocessor/compiler-options/options-pli.ts), [translator-pli.ts](../packages/language/src/preprocessor/compiler-options/translator-pli.ts)) - the main option set: `MARGINS`, `MARGINI`, `INCAFTER`, the `PP(...)` preprocessor list and its `PPINCLUDE` value, `SYSPARM`, `SYSTEM`, `CMPAT`, `LP`, etc.
- **MACRO** ([options-macro.ts](../packages/language/src/preprocessor/compiler-options/options-macro.ts), [translator-macro.ts](../packages/language/src/preprocessor/compiler-options/translator-macro.ts)) - macro-preprocessor tuning: `CASE`, `RESCAN`, `FIXED`, `DBCS`, `NAMEPREFIX`, `DEPRECATE`. `RESCAN(ASIS)`, for example, controls whether re-scanned macro output is upper-cased.
- **SQL** ([options-sql.ts](../packages/language/src/preprocessor/compiler-options/options-sql.ts), [translator-sql.ts](../packages/language/src/preprocessor/compiler-options/translator-sql.ts)) - DB2/SQL preprocessor options (`CCSID0`, `CODEPAGE`, `HOSTCOPY`, `LINE`, ...).

The nested `PP(MACRO ...)` / `PP(SQL ...)` option strings are re-parsed and routed to the macro/SQL sub-translators.
Plugin-config options are translated *first* so that duplicate / mutually-exclusive options in the source file can be detected against them.

The [`Translator`](../packages/language/src/preprocessor/compiler-options/translator.ts) base class records each applied rule and reports **duplicate** and **mutually-exclusive** usages, plus **unknown option** (`IBM1159I`, promoted to error).
Validation helpers (`ensureArguments`, `ensureType`, `ensureEnum`, ...) throw structured diagnostics drawn from the large per-option [codes.ts](../packages/language/src/preprocessor/compiler-options/codes.ts) table.

### Recompile fingerprint

Some option rules carry a `recompile: true` flag, marking them as reaching the lexer/parser (e.g. `MARGINS`, `OR`, `NOT`, `CASE`).
A stable fingerprint is built from those applied rules and their concrete argument values.
`PliLexer` feeds this into the `InstructionCache`: when the fingerprint changes, the entire instruction cache is cleared so files are re-tokenized under the new option semantics.

## The macro language

### Instruction generation

After the file is parsed into preprocessor `Statement`s, [`generateInstructions`](../packages/language/src/preprocessor/instruction-generator.ts) lowers them into a graph of `InstructionNode`s (each `{ labels, instruction, next? }`) defined in [instructions.ts](../packages/language/src/preprocessor/instructions.ts).
This is essentially a compile step from AST to a tiny bytecode-like IR with explicit control flow:

- Sequential statements form a linked list ending in a synthetic `Halt`.
- `%IF` is lowered to a `Select` instruction with a true-branch case (condition = the `%IF` expression) and an optional empty-condition false-branch case; `%SELECT`/`%WHEN`/`%OTHERWISE` lowers to the same `Select` shape.
- `%DO` becomes a `Do` instruction; iterating/leaving (`%ITERATE`/`%LEAVE`) and `%GOTO` become `Goto` instructions whose target node is patched up once all nodes exist.
- `DECLARE`/`%REPLACE` become `Declare` instructions; assignments, `%ACTIVATE`/`%DEACTIVATE`, `%INCLUDE`/`INSCAN`, `%NOTE`, `ANSWER`, `CALL`, and SQL/CICS attribute statements each get their own instruction kind.
- Preprocessor `PROCEDURE`s are collected separately into a procedure container map (keyed by every label name), not inlined into the main list.

Because branch and loop targets reference nodes that may not be generated yet, the generator defers `next`-pointer wiring into callbacks executed in reverse at the end.

### Interpretation

[`runInstructions`](../packages/language/src/preprocessor/instruction-interpreter.ts) walks the instruction graph from the entry node, maintaining a context with a scoped symbol table (global variables plus per-procedure local scopes), the active procedure set, the accumulating output `tokens`, diagnostics, and the cross-file include bookkeeping.

Key behaviors:

- **Values** are scalars (string/`FIXED`, stored as strings) or n-dimensional arrays. Operators, `%DO` ranges, and conditions are evaluated over these values; non-scalar operands in conditions cause the branch to be treated as un-evaluable.
- **Token replacement / rescanning**: `Tokens` instructions copy source tokens to the output, but each identifier is checked against active global variables and active procedures. A match substitutes the variable's value (re-lexed and recursively re-scanned) or invokes the procedure inline (parsing its `( ... )` arguments straight from the token stream). An `immediateFollow` flag is tracked so adjacent tokens merge correctly (macro output concatenated with following text).
- **Procedures** run synchronously in a fresh local scope; `RETURN` sets the context return value. Function-like and `STATEMENT`-style procedures are invoked differently.
- **Builtins**: a large `builtinImplementations` map provides `SUBSTR`, `INDEX`, `LENGTH`, `TRIM`, `TRANSLATE`, `VERIFY`, `COPY`/`REPEAT`, `MIN`/`MAX`, `COUNTER`, `COLLATE`, `QUOTE`, the `SYS*` informational builtins (`SYSPARM`, `SYSTEM`, `SYSVERSION`, ...), `MACLMAR`/`MACRMAR` (driven by the `MARGINS` option), array-bound builtins (`HBOUND`/`LBOUND`/`DIMENSION`), and others. Several carry `TODO`s noting incomplete fidelity (e.g. `MACCOL` returns 0; `COMPILEDDATE`/`COMPILETIME` return fixed epoch values).
- **SQL / CICS / EXEC**: `EXEC SQL`/`EXEC CICS` and SQL attribute statements emit synthetic PL/I declarations (the `DFHEIBLK`/`SQL_LOB*` structure blocks) once per procedure, and replace the directive with a placeholder `DO; END;` so the parser always sees a valid statement.

### Branch executions and `pli/skippedCode`

The select interpreter records, per `%IF`/`%SELECT` syntax node, a `Map<caseIndex, true | undefined>` into the context's `branchExecutions`.
A `true` entry means that case was taken; `undefined` means the condition could not be evaluated; a missing entry means the case was definitively *not* taken.
[`skipped-code.ts`](../packages/language/src/language-server/skipped-code.ts) reads this map: for each `%IF`/`%SELECT` token it emits ranges for branches that were *not* executed (and also handles `%DO SKIP; ... %END;`), and pushes them to the client via the `pli/skippedCode` notification so the editor can grey out dead code.

### Safeguards

The interpreter is a Turing-complete macro language, so it is bounded against runaway loops and recursion.
`runInstructions` computes an instruction-counter limit from the process group's `instruction-counter-limit` LSP option, clamped between `1` and `MAX_INSTRUCTION_LIMIT` (`50000`) and defaulting to `DEFAULT_INSTRUCTION_LIMIT` (`5000`).
The runner counts visits per node and aborts once a node exceeds the limit (hardened in the recent "Safeguard macro interpreter" commit).
Additional guards: circular `next`-chain detection, a `MAX_COPY_SIZE` (100 000) cap on `COPY`/`REPEAT` output, the `COUNTER` builtin wrapping at 99999, and a workaround for V8's spread-argument limit when emitting very large token arrays.

## %INCLUDE resolution

`%INCLUDE`, the `INCLUDE_ALT` form, and `INSCAN` (which computes the file name from a macro variable) are the only instructions that touch the filesystem, so they run asynchronously ([include-resolver.ts](../packages/language/src/preprocessor/include-resolver.ts)).
They are what stitch multiple files into one `CompilationUnit`.

Resolution handles two on-disk shapes:

- **File includes** (`%INCLUDE "name";`) - look `name` up (with the process group's configured extensions) in each lib's pre-built file index, falling back to a live existence check for files added after lib expansion.
- **Member includes** (`%INCLUDE LIBNAME(member);` or `%INCLUDE member;`) - look the member up in a directory lib's member map or a DDName lib's member map. Mainframe data-set members surface as sibling files named `LIBNAME(member)`. Dataset members win over plain files when both match.

When `member-name-validation` is enabled on the process group, member names are checked against the mainframe rules (≤ 8 chars).
SQL builtins `SQLCA`/`SQLDA` resolve to virtual builtin URIs rather than disk files.

In the interpreter, include handling resolves the URI then guards against re-inclusion: idempotent includes that were already pulled in are skipped, and cyclic includes (URI already on the active stack) are rejected with a diagnostic.
On success it loads the document, runs the *same* margin -> tokenize -> preprocessor-parse -> generate-instructions pipeline (through the shared `InstructionCache`), merges the sub-file's procedures into the current context, registers the sub-file's tokens with the file service, and recursively interprets the included instructions in a child context.
Unresolved includes produce either a "missing configuration" diagnostic (when no process group/program config exists) or `IBM1848I`, tagged with `unresolvedFile`/`entryUri` data so the client can offer a quick fix (see [PLUGIN-CONFIG.md](./PLUGIN-CONFIG.md#relationship-to-quick-fixes)).

The `INCAFTER(PROCESS(name))` option is handled specially in `PliLexer`: it synthesizes a single `%INCLUDE` instruction prepended as the very first instruction in the stream (and a synthetic `IncludeItemFile` AST node so LSP "go to definition" works), allowing exactly one file to be included before normal preprocessing begins.

## Caching

The [`InstructionCache`](../packages/language/src/preprocessor/instruction-cache.ts) memoizes the expensive, file-local part of preprocessing (margins, tokenize, preprocessor-parse, instruction generation) keyed by URI, validated against the file text.
It is shared across the entry file and all included files.
The cache is invalidated wholesale whenever the compiler-options recompile fingerprint changes (see above), because such options alter tokenization itself.
The cross-file interpretation step is never cached, since it depends on the include graph and macro state assembled at run time.
