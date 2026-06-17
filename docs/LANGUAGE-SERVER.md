# Language Server Features

This document describes the LSP-facing layer of the PL/I language server, i.e.
everything under [`packages/language/src/language-server`](../packages/language/src/language-server).
For how the underlying data (`CompilationUnit`, symbol table, references) is
produced, see [ARCHITECTURE.md](./ARCHITECTURE.md) and [LINKING.md](./LINKING.md).

The job of this layer is narrow: take an LSP request, find the right
`CompilationUnit` and token at the requested position, compute an answer in our
own internal model, and translate that model back into LSP types.
The heavy lifting (lexing, parsing, linking, type inference) has already happened by the time a request arrives.

## Request dispatch

[`connection-handler.ts`](../packages/language/src/language-server/connection-handler.ts)
wires every LSP capability to its handler in `startLanguageServer`.
It is the single entry point and the place to look first.

### Capabilities

`onInitialize` advertises what the server supports.
The notable ones:

* `textDocumentSync`: incremental, with open/close tracking.
* `completionProvider` with trigger characters `.`, `%`, `"`.
* hover, rename, definition, references, document highlight.
* `codeActionProvider` for `QuickFix` and `SourceFixAll`.
* `executeCommandProvider` for the three custom commands (see [Commands](#execute-commands)).
* `semanticTokensProvider` (full document only, no range requests).
* document symbols and workspace symbols.
* `signatureHelpProvider` with trigger `(` and retrigger `,`.
* `experimental.skippedPliCode` - a flag telling our VS Code client that the
  server emits the custom [skipped-code notification](#custom-notifications).

### Concurrency: `withReadMutex`

Almost every handler runs inside `withReadMutex`. It:

1. waits for `compilationUnitHandler.ready` (initial indexing complete),
2. takes a global read lock,
3. looks up the `CompilationUnit` owning the requested URI,
4. takes that unit's own read lock,
5. invokes the callback with the parsed URI and (possibly `undefined`) unit.

This guarantees a request never observes a half-reindexed unit.

### The translation pattern

Each handler follows the same shape:

```ts
withReadMutex(uri, async (uri, unit) => {
  const doc = unit?.services.files.getDocument(uri);
  if (!doc || !unit) return <empty>;
  const offset = doc.offsetAt(position);       // LSP position -> offset
  const result = someRequest(unit, uri, offset); // internal model
  return result.map(x => xToLSP(doc, x));        // internal model -> LSP
});
```

The feature logic lives in a per-feature `*-request.ts` file and works purely in
**character offsets** and our internal `Range` type (`{ start, end }` offsets,
not line/character).
The conversion to LSP `Position`/`Range` happens only at
the boundary, via the helpers in
[`types.ts`](../packages/language/src/language-server/types.ts)
(`rangeToLSP`, `completionItemToLSP`, `documentSymbolToLSP`, `hoverResponseToLSP`,
`diagnosticToLSP`, ...).
This is why every feature takes a `CompilationUnit` and an
`offset` rather than an LSP request object.

## Document management

[`text-documents.ts`](../packages/language/src/language-server/text-documents.ts)
provides a `TextDocuments` manager that normalizes all incoming URIs to VS Code's
format (`NormalizedTextDocuments`).
There are three stores, consolidated by
`DocumentConsolidator` in priority order:

1. **`BuiltinDocuments`** - the bundled builtin/SQLCA/SQLDA/macro documents.
2. **`EditorDocuments`** - files currently open in the editor (synced via LSP).
3. **`FileDocuments`** - files loaded on demand from disk via the
   `FileSystemProvider` (used to resolve `%INCLUDE` targets that aren't open).

## Features

### Hover

[`hover-request.ts`](../packages/language/src/language-server/hover-request.ts)

Binary-searches for the token at the offset, then runs a list of
`MarkupGenerator`s and concatenates every non-null result.
Generators cover:

* **reference tokens** - render the resolved declaration's type/signature.
  For procedure/builtin calls the inferred return type is shown, and for builtins
  the preceding JSDoc comment is attached.
* **include item tokens** - show the include directive plus a preview of the
  included file's first ~100 lines (`getFileContentPreview`).
* **name tokens** - render the declaration the name introduces.
* **`DFHRESP` (CICS)** - show the numeric response code.

`getJSDocCommentBeforeLabelPrefix` finds the JSDoc comment that precedes a label,
skipping intervening preprocessor `%` directives and alias label chains.
JSDoc is currently only surfaced for builtins.

### Signature help

[`signature-help-request.ts`](../packages/language/src/language-server/signature-help-request.ts)

Walks up from the cursor token to the enclosing `MemberCall`, resolves it to a
procedure, and builds one signature from the procedure declaration.
Parameter labels are computed as offset ranges into the rendered signature string.
The active parameter is derived from which argument (dimension) the cursor sits in,
with handling for variadic parameters and incomplete (unclosed) argument lists.
Per-parameter documentation is pulled from `@param` JSDoc tags.

### Completion

[`completion/`](../packages/language/src/language-server/completion)

Two distinct modes, selected in `connection-handler.ts` by `selectCompletionMode`
based on the trigger character and whether the document is a plugin config file:

* **PL/I completion** ([`completion-request.ts`](../packages/language/src/language-server/completion/completion-request.ts)):
  finds the token at the cursor, derives a `context` syntax node (looking back up
  to 5 tokens), and asks
  [`follow-elements.ts`](../packages/language/src/language-server/completion/follow-elements.ts)
  what may follow.
  A `FollowElement` is one of: a fixed set of keyword items
  (`CstNode`), local references, a qualified reference (after `.`), or a type
  reference (after `TYPE`/`:`). `follow-elements.ts` is essentially a large
  hand-maintained map from CST node kinds (which `(`, which `,`, which keyword the
  cursor follows) to the appropriate follow kind.
  [`completion-generator.ts`](../packages/language/src/language-server/completion/completion-generator.ts)
  then materializes those into items - keywords directly, and references by
  pulling distinct symbols from the relevant scope (regular vs. preprocessor).
  Results are fuzzy-matched against the partially typed query.

* **Config completion** ([`completion-plugin-configuration.ts`](../packages/language/src/language-server/completion/completion-plugin-configuration.ts)):
  for `pgm_conf.json`, suggests known process-group names as values of the
  `pgms[*].pgroup` property, using JSONC location parsing.

### Go to definition

[`definition-request.ts`](../packages/language/src/language-server/definition-request.ts)

For a reference token, returns the name token(s) of every node the reference
resolves to (`iterateReferenceNodes` handles redeclarations).
For a name token, returns the token's own location.
For an include item, returns the resolved file
(jumping to its start).
Self-references return nothing.

### Find references / document highlight / rename

All three are built on `getReferenceLocations` from the linker.

* **References** ([`references-request.ts`](../packages/language/src/language-server/references-request.ts)):
  returns the locations directly.
* **Document highlight**: same locations, filtered to the current file.
* **Rename** ([`rename-request.ts`](../packages/language/src/language-server/rename-request.ts)):
  same locations grouped by URI; the handler turns each into a `TextEdit` with the
  new name. (There is no `prepareRename`/validation step - any resolvable symbol
  is renamable.)

### Document symbols

[`document-symbol-request.ts`](../packages/language/src/language-server/document-symbol-request.ts)
+ [`document-symbol-builder.ts`](../packages/language/src/language-server/document-symbol-builder.ts)

Iterates valid tokens and dispatches each to the first matching `SymbolBuilder`:

* **`ProcedureSymbolBuilder`** -> `Function` symbols (range extended to the `END`).
* **`DeclareSymbolBuilder`** -> `Variable`/`Constant`/`Struct` symbols. A
  `LevelHierarchyBuilder` reconstructs the nesting from PL/I level numbers
  (`1 A, 2 B, 3 C`), promoting parents to `Struct`.
* **`LabelSymbolBuilder`** -> `Key` symbols for non-procedure labels.

The request then nests symbols by range containment, resetting the procedure
hierarchy when a top-level function is encountered.

### Workspace symbols

[`workspace-symbol-request.ts`](../packages/language/src/language-server/workspace-symbol-request.ts)

Reuses document symbols across all compilation units, flattens them, and filters
by a case-insensitive substring match against the query.
The per-unit symbol list
is memoized in the unit's `requestCaches` under `workspaceSymbols`.
Builtin files are excluded.

### Semantic tokens

[`semantic-tokens.ts`](../packages/language/src/language-server/semantic-tokens.ts)
(+ [`semantic-token-decoder.ts`](../packages/language/src/language-server/semantic-token-decoder.ts)
for tests)

Produces the encoded `number[]` stream LSP expects.
`tokenType` classifies each
token: first by following a reference to its target node (label->function/variable,
ordinal->enum, etc.), then by CST node kind, then by literal kind, and finally by
checking whether it is a control or modifier keyword.
Tokens inside a preprocessor
node get the `preprocessor` modifier.
`EXEC` (CICS/SQL) fragments are split into their own sub-tokens.
Multi-line comments are broken into one token per line,
since most clients cannot render multi-line semantic tokens.

The legend (`semanticTokenLegend`) is derived from the `SemanticTokenTypes` and
`SemanticTokenModifiers` enums and shared with the client.

#### Preprocessor italics (non-standard styling)

The server only *emits* the `preprocessor` modifier; turning it into italics is a
client-side concession.
The extension's `package.json` ships a `configurationDefaults` block that maps the
token rule `*.preprocessor:pli` to `{ "fontStyle": "italic" }`, so any token the
server marks as preprocessor (macro statements, `%`-directives, and the
EXEC-fragment sub-tokens) renders in italics regardless of the active theme.
This is the visible signal that a span is macro/preprocessor code rather than
ordinary PL/I.
The same `contributes` block also defines `semanticTokenScopes`, mapping our
`keyword` and `modifier` token types onto the TextMate scopes
`keyword.control.pli` / `keyword.storage.pli` so that themes without explicit
semantic-token colors still color them via the grammar.

### Code actions

[`code-actions/`](../packages/language/src/language-server/code-actions)

The `onCodeAction` handler splits on the requested kind:

* **Quick fixes** ([`apply-quick-fixes.ts`](../packages/language/src/language-server/code-actions/apply-quick-fixes.ts)):
  keyed off diagnostic codes. Covers ambiguous-reference disambiguation
  (`IBM1881I`), resolving an unfound `%INCLUDE` by adding a lib to `proc_grps.json`
  (`IBM1848I`), creating a startup config when none exists, uppercasing macro
  text, replacing an unknown process group, and removing unresolved libraries
  (individually or all at once). Config edits are produced with the JSONC
  utilities so comments/formatting survive.
* **Source actions** ([`apply-source-actions.ts`](../packages/language/src/language-server/code-actions/apply-source-actions.ts)):
  currently a single `SourceFixAll` that uppercases every macro-case diagnostic in
  the file in one edit.

Fixes that need to write files (config changes, include resolution) don't carry an
edit directly - they carry a **command** that the client invokes back.

### Execute commands

[`commands.ts`](../packages/language/src/language-server/commands.ts) +
[`constants.ts`](../packages/language/src/language-server/constants.ts)

Three commands, all triggered by the quick fixes above and dispatched in
`onExecuteCommand`:

* `pli.applyQuickFixResolveInclude` - write updated `proc_grps.json`.
* `pli.applyQuickFixCreateConfig` - create the `.pliplugin` config files.
* `pli.applyQuickFixRemoveUnresolvedLib` - write `proc_grps.json` with a lib removed.

The default config file contents also live in `constants.ts`
(`PluginConfiguration`).

## File handling and custom URI schemes

The language server never touches a real disk directly.
Everything it needs from the outside world goes through the
[`FileSystemProvider`](../packages/language/src/workspace/file-system-provider.ts)
interface (`readFile`, `readDir`, `fileExists`, `findFile`, `stat`, `writeFile`,
`deleteFile`), and a provider instance is handed to `startLanguageServer` at
startup.
This keeps the core package agnostic of where files live, and is what lets the
same server run in the browser, in tests (`VirtualFileSystemProvider`,
`EmptyFileSystemProvider`), and on the desktop.

### Provider implementations

There are two real implementations, both in the extension's `language` entry
points:

* **`VSCodeFileSystemProvider`** ([file-system.ts](../packages/vscode-extension/src/language/file-system.ts))
  turns every file operation into a custom LSP request to the *client* (see the
  `fs/*` protocol below).
  This is the web/browser path, where the server has no Node `fs` at all and the
  only way to read a file is to ask VS Code.
* **`NodeFileSystemProvider`** ([main.ts](../packages/vscode-extension/src/language/main.ts))
  extends it for the desktop: for `file:` URIs it goes straight to Node's `fs`
  (and `glob` for `findFile`), and falls back to the proxy super-implementation
  for any non-`file:` scheme.
  This avoids a client round-trip per include on desktop.

### The `fs/*` request protocol

When a provider proxies to the client, it uses a small set of custom requests
defined in [messages.ts](../packages/vscode-extension/src/common/messages.ts):
`fs/readFile`, `fs/readDir`, `fs/fileExists`, `fs/findFile`, `fs/stat`,
`fs/writeFile`.
The client side ([file-system-provider.ts](../packages/vscode-extension/src/extension/file-system-provider.ts))
answers each by delegating to `vscode.workspace.fs`, so reads honor whatever
VS Code itself can see - virtual workspaces, remote/SSH, the builtin scheme, etc.
`fs/findFile` is a workspace-wide `findFiles` glob used only by the
"add this file's parent dir to libs" quick fix; ordinary `%INCLUDE` resolution
uses the per-lib indexes built at config-load time, not this.

### The `pli-builtin:` scheme

PL/I's builtin functions, and the `SQLCA`/`SQLDA` structures, are not real files -
they are bundled text served under a dedicated read-only scheme,
`pli-builtin:` (`BuiltinsUriSchema`, e.g. `pli-builtin:/builtins.pli`).
There are two halves to making this work:

* On the **server**, the builtin documents are pre-registered in the
  `BuiltinDocuments` store (see [Document management](#document-management)) and
  carry the `pli-builtin` scheme; the linker resolves builtin references and
  `%INCLUDE SQLCA`/`SQLDA` to these virtual URIs.
  Features treat them specially - e.g. workspace symbols and the skipped-code /
  margin notifications skip builtin/virtual URIs, and JSDoc-on-hover is only
  surfaced for builtins.
* On the **client**, [builtin-files.ts](../packages/vscode-extension/src/extension/builtin-files.ts)
  registers a `BuiltinFileSystemProvider` for the scheme (read-only,
  case-insensitive) so that "go to definition" into a builtin actually opens a
  viewable document.
  It serves the four bundled texts (`builtins.pli`, the macro builtins, `SQLCA`,
  `SQLDA`) and rejects all writes.

### Virtual files and URI handling

`isVirtualFile` ([uri.ts](../packages/language/src/utils/uri.ts)) treats the
`git`, `untitled`, and `pli-builtin` schemes as virtual; the skipped-code and
margin-indicator notifications bail out for these so the editor doesn't try to
decorate a diff view or a builtin.
`uri.ts` also carries the PL/I-specific URI quirks: for "fragmentless" schemes
(`file`, `memory`, `git`, `untitled`, `pli-builtin`) a `#` is escaped to `%23`
before parsing, because `#` is a legal character in PL/I file/member names
(e.g. `A1@#_$`) and must never be misread as a URI fragment.
All map keys and equality comparisons go through `toNormalizedKey`, which lower-cases
and decodes the path so the same file under different encodings resolves to one unit.

The client registers the language for *any* scheme (`{ scheme: "*", language: "pli" }`,
plus `.pliplugin/*.json` on the `file` scheme), so PL/I features work in diffs,
untitled buffers, and builtin documents alike.

## Language auto-detection (non-standard)

PL/I source files frequently have no recognizable extension (mainframe data-set
members, `.txt`, no extension at all), so the extension proposes the language
rather than relying on the file association alone.
[document-identification.ts](../packages/vscode-extension/src/extension/document-identification.ts)
watches documents that VS Code opened as `plaintext` and, unless the user disabled
`pli.autoDetect`, decides whether to offer switching them to PL/I:

* It first rejects obvious non-PL/I files (`.git`, listing `.lst`/`.list`, compiler
  `.xml` output, anything whose first line looks like an IBM listing header).
* It then accepts on a likely PL/I extension (`pli`/`pl1`/`pl`/`p1`), or asks the
  server via the `pli/existingFileRequest` request whether the file is already part
  of a known compilation unit (e.g. pulled in as an include), or finally falls back
  to scanning the first 200 lines for `DCL`/`PROCEDURE`/`THEN DO` constellations.
* On a match it shows a one-time *"set language to PL/I?"* prompt with a *Never*
  option that flips `pli.autoDetect` off.

## Custom notifications and requests

Beyond the standard LSP protocol, the server uses a few custom messages:

* `pli/skippedCode` ([`skipped-code.ts`](../packages/language/src/language-server/skipped-code.ts)):
  ranges of code skipped by the preprocessor (untaken `%IF`/`%SELECT` branches,
  `%DO SKIP; ... %END;`). Emitted on cache revalidation, only
  when the ranges actually change.
  The client ([decorators.ts](../packages/vscode-extension/src/extension/decorators.ts))
  renders them as a dimmed `TextEditorDecorationType` whose opacity comes from the
  `pli.skippedCode.opacity` setting, and the whole feature can be toggled with
  `pli.skippedCode.enabled`.
* `pli/marginIndicator` ([`margin-indicator.ts`](../packages/language/src/language-server/margin-indicator.ts)):
  the source margin columns `m`/`n` (default 2/72). Also emitted on revalidation when changed.
  The client turns them into editor rulers (`editor.rulers` for the `pli` language),
  driven by the `pli.marginIndicator.rulers` setting
  (`off` / `default` `[1, 72]` / `automatic` from the reported margins).
* `WorkspaceDidChangePluginConfig` notification (client -> server): reloads
  plugin configurations, reindexes affected units, and refreshes semantic tokens.
* **`ExistingFileRequest`** (client -> server): answers whether a URI is part of a
  known compilation unit.
* Various `fs/*` requests. See the above for more details.

The two revalidation-driven notifications are not sent from `connection-handler.ts`
directly - they are registered as `onRevalidate` callbacks on the unit's
`requestCaches` in
[`compilation-unit.ts`](../packages/language/src/workspace/compilation-unit.ts),
so they fire automatically whenever a unit is rebuilt.
