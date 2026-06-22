# Plugin Configuration

This document describes the **plugin configuration** subsystem of the PL/I language server: how the per-workspace `.pliplugin/` directory is loaded, parsed, validated, and surfaced to the rest of the server.
The owner of all of this state is the [`PluginConfigurationProvider`](../packages/language/src/workspace/plugin-configuration-provider.ts), reached through the [`WorkspaceContext`](../packages/language/src/workspace/workspace-context.ts) attached to every compilation unit.

The configuration answers two questions the language server cannot infer from source alone: *which files are entry points (programs), and what compiler options, include libraries, and behavioural toggles apply to each?* For how the data produced here feeds the rest of the pipeline, see [ARCHITECTURE.md](./ARCHITECTURE.md); for the LSP-facing handlers (code actions, commands, watcher notifications) that consume it, see [LANGUAGE-SERVER.md](./LANGUAGE-SERVER.md).

## The `.pliplugin` directory

A workspace opts into PL/I configuration by placing a `.pliplugin/` directory at its root, containing two JSON files.
Both are optional; if either is absent, the corresponding in-memory state is simply cleared.
The paths are defined in [constants.ts](../packages/language/src/language-server/constants.ts) as `PluginConfiguration.PROGRAM_FILE_PATH` and `PluginConfiguration.PROCESS_GROUP_FILE_PATH`.

| File | Purpose |
| --- | --- |
| `pgm_conf.json` | Maps **programs** (entry points) to a named **process group**. |
| `proc_grps.json` | Defines the **process groups**: compiler options, include libraries, include extensions, and LSP behaviour toggles. |

The split mirrors the IBM/Zowe convention: many programs share a small number of process groups, so the heavy settings live once per group and each program just references a group by name.

### `pgm_conf.json`

The top-level shape is a single `pgms` array.
Each entry has a `program` (a path or glob, relative to the workspace or absolute) and a `pgroup` (the name of a process group).
An optional `compiler-options` string array may override/extend the group's options for that program.

```jsonc
{
  "pgms": [
    { "program": "src/*.pli", "pgroup": "default" },
    { "program": "legacy/MAIN.pli", "pgroup": "mainframe",
      "compiler-options": ["MARGINS(2,72)"] }
  ]
}
```

### `proc_grps.json`

The top-level shape is a single `pgroups` array.
Each entry is one process group:

```jsonc
{
  "pgroups": [
    {
      "name": "default",
      "compiler-options": [],
      "libs": ["cpy", "inc"],
      "member-name-validation": false,
      "include-extensions": [".pli", ".pl1", ".inc"],
      "lsp-options": {
        "check-margins": true
      }
    }
  ]
}
```

Recognized fields (parsed in [loader.ts](../packages/language/src/config/loader.ts), schema in [schema.ts](../packages/language/src/config/schema.ts)):

- `name` - the group's identifier, referenced from `pgm_conf.json`.
  The only required field; a group without it is skipped.
- `compiler-options` - `string[]` of PL/I compiler options.
  Merged with the program's own options (see [Compiler options](#compiler-options)).
- `libs` - `string[]` of include-library locations.
  Each is expanded against the file system (see [Library expansion](#library-expansion-libs)).
- `include-extensions` - `string[]` of file extensions tried when resolving `%INCLUDE` members, and used to decide which files count as standalone library files.
- `member-name-validation` - `boolean` (optional).
  When true, include member names are validated: max 8 characters, starting with a letter, then letters / digits / `@ # _ $` (case-insensitive).
  See [include-resolver.ts](../packages/language/src/preprocessor/include-resolver.ts).
- `lsp-options` - a nested object of language-server-only toggles:
  - `check-margins` (`boolean`, default `false`) - enables margin diagnostics in [pli-margins-processor.ts](../packages/language/src/preprocessor/pli-margins-processor.ts).
  - `instruction-counter-limit` (`number`, default `DEFAULT_INSTRUCTION_LIMIT`) - caps preprocessor instruction execution to guard against runaway macros ([instruction-interpreter.ts](../packages/language/src/preprocessor/instruction-interpreter.ts)).
  - `case-upper-validation` (`boolean`, default `true`) - drives uppercase-text validation.

## Loading and parsing

`PluginConfigurationProvider.init(workspacePath)` (called once per workspace folder from the connection handler's `onInitialized`) records the workspace URI and runs `loadConfigurations()`.
`loadConfigurations()`:

1. reads `.pliplugin/pgm_conf.json` and `.pliplugin/proc_grps.json` through the injected [`FileSystemProvider`](../packages/language/src/workspace/file-system-provider.ts)
2. parses each file
3. post-processes (expands libs, merges compiler options)
4. cross-validates program references against the loaded group names
5. returns LSP diagnostics keyed by config URI

### JSONC parsing with source provenance

Both files are parsed as **JSONC** (JSON with comments) via [jsonc.ts](../packages/language/src/utils/jsonc.ts), a thin wrapper over `jsonc-parser`.
The loader performs a *single* tree walk (`jsoncParseTree`) and, for every leaf it extracts, pulls the node's `offset`/`length` out of the same node.
Each value is wrapped as a `JsonItem<T>` carrying its `value` plus `meta` (range, URI, JSON path).
This is the key design choice: a diagnostic about, say, one bad `libs[]` entry already has that entry's exact range and JSON path on hand - no second pass to re-discover ranges, and the JSON path is exactly what the JSONC *edit* APIs (`jsoncModify`, `jsoncApplyEdits`) need for surgical quick fixes.
Values that did not come from JSON (applied defaults, test fixtures) carry no `meta`.

Parse failures degrade gracefully: a structurally broken file (missing/non-array `pgms`/`pgroups`) yields `config: undefined` and the existing in-memory state for that file is cleared, but the other file still loads.

## Matching a document to its configuration

`getProgramConfig(uri)` resolves a file URI to its program record:

1. **Exact match** against the registered (workspace-resolved, normalized) program keys.
2. **Glob fallback** - each registered `program` is treated as a [`minimatch`](https://github.com/isaacs/minimatch) pattern against the decoded URI, so `src/*.pli` matches any `.pli` file in `src`.

From there `getProcessGroupConfig(name)` looks up the referenced group.
A compilation unit exposes both via lazily-cached getters in [compilation-unit.ts](../packages/language/src/workspace/compilation-unit.ts); the cache is valid for the unit's lifetime and cleared on `reset()`.

If *no* program configs are registered at all, every file is treated as a valid entry point - configuration is purely additive.

### Library files vs. compilation units

A file that lives *inside* a configured include library (and matches one of that lib's `include-extensions`) does **not** get its own compilation unit - it is pulled in via `%INCLUDE` from the programs that reference it.
The check is backed by a prefix->extension index built lazily from the expanded directory libs and invalidated whenever process groups are reloaded.

## Compiler options

After loading, each program's `compiler-options` and its bound group's `compiler-options` are merged ([compiler-options-merge.ts](../packages/language/src/config/compiler-options-merge.ts)) and parsed *once* into an `AbstractCompilerOptions`, stored on the program record alongside any parse issues.
The preprocessor's [compiler-options-processor.ts](../packages/language/src/preprocessor/compiler-options-processor.ts) reads these directly, so option strings are never re-parsed per request and issues are reported exactly once.
See [PREPROCESSOR.md](./PREPROCESSOR.md#compiler-options) for how the parsed options drive lexing.

## Library expansion (`libs`)

Each `libs` entry is turned into one or more in-memory entries by [lib-expander.ts](../packages/language/src/config/lib-expander.ts), driven by `stat` rather than exception handling:

- **Directory** - a real folder.
  Recursively walked (BFS); the lib and every subdirectory are indexed by lower-cased basename.
  File types come straight from `readDir` to avoid per-entry `stat` calls.
- **Data set** - the mainframe convention surfaced onto a regular file system: the lib path itself doesn't exist, but sibling files named `<basename>(<member>)` carry the members.
  Produces a single entry indexing those members, so `%INCLUDE m1;` resolves to e.g. `cpy/A.B.C(m1)` in O(1).
- **Unresolved** - a lib pointing at a single file, or a path that resolves to nothing on disk.
  (Note the deliberate fallback for in-memory/test file systems: a path whose `stat` reports nothing but whose `readDir` returns `[]` is accepted as a phantom directory so config stays usable until files appear.)

Expanded entries are deduplicated by path and sorted shallow-first, with a forward-slash-normalized directory set for fuzzy lookups.
These computed fields feed include resolution in [include-resolver.ts](../packages/language/src/preprocessor/include-resolver.ts).

## Reload flow

The VS Code client watches `.pliplugin/` and sends a `WorkspaceDidChangePluginConfig` notification.
The handler in [connection-handler.ts](../packages/language/src/language-server/connection-handler.ts) responds by:

1. calling `reloadConfigurations()` (which re-runs `loadConfigurations()`, overwriting all in-memory state and invalidating the lib-file index);
2. publishing the fresh config diagnostics;
3. reindexing all reachable (open) compilation units so changed compiler options, margins, and libs take effect immediately;
4. refreshing semantic tokens so syntax coloring updates.

Because compilation units cache their program/process-group config for their lifetime, the reindex (which re-runs the lifecycle on each open unit) is what actually propagates a config change - there is no incremental config diffing.
