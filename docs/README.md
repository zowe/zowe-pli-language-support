# PL/I Language Support — Documentation

Documentation for the Broadcom PL/I Language Support VS Code extension and language server.

## Contents

### New to Mainframe / Language-Server Development?

| Document | Description |
|----------|-------------|
| [Concepts and Domain Primer](concepts-and-domain-primer.md) | **Start here if you are new to the domain.** A general-purpose guide explaining mainframe development, language servers, the analysis pipeline, preprocessors, and configuration-based tooling — with analogies to modern web development. Not specific to this project. |

### Understanding This Project

| Document | Description |
|----------|-------------|
| [Architecture Overview](architecture-overview.md) | High-level purpose, monorepo layout, runtime flow, main modules, and entry points. |
| [Configuration System](configuration-system.md) | The `.pliplugin` folder, `pgm_conf.json` and `proc_grps.json`, and how configuration is loaded and applied. |
| [Execution Flow](execution-flow.md) | Step-by-step trace when a user opens a PL/I file: extension activation, server startup, file analysis, configuration lookup, include resolution, and diagnostics. Lists the files that implement each step. |
| [Study Roadmap](study-roadmap.md) | The 10 most important files in the repo, what each one does, and the recommended order to read them. Includes a simplified mental model of the system. |
| [Architecture (Lifecycle)](ARCHITECTURE.md) | Short original description of the lifecycle and pipeline (lexing → parsing → symbol table → resolution → validation). |

### Doing the Work

| Document | Description |
|----------|-------------|
| [Testing and Development](testing-and-development.md) | How to set up the dev environment, build the project, run tests, debug, and write fourslash tests. |
| [How to Add a Validation Rule](how-to-add-a-validation-rule.md) | Step-by-step guide for adding a new diagnostic rule: defining codes, writing the check function, registering it, and testing. |

### Reference

| Document | Description |
|----------|-------------|
| [Glossary](glossary.md) | Definitions of PL/I terms (copybook, `%INCLUDE`, margins, structured declarations, etc.) and project-specific terms (`CompilationUnit`, lifecycle, `ReferencesCache`, etc.). |

---

## Onboarding Path for New Contributors

### Phase 0 — Learn the domain (if needed, 1 hour)

If you are new to mainframe languages, language servers, or configuration-based compiler tooling:

1. Read the **[Concepts and Domain Primer](concepts-and-domain-primer.md)**. It explains what language servers are, how analysis pipelines work, what preprocessors do, and why mainframe tooling has certain complexities — all with analogies to web development concepts you already know.

### Phase 1 — Understand the big picture (1–2 hours)

2. Read the **[Study Roadmap](study-roadmap.md)** "How the System Works" section (10 bullet points) for a quick mental model of this specific project.
3. Read the **[Architecture Overview](architecture-overview.md)** to understand the monorepo structure, main components, and how the extension, language server, and parser interact.
4. Skim the **[Glossary](glossary.md)** for any unfamiliar PL/I or project-specific terms.

### Phase 2 — Understand the details (2–4 hours)

5. Read the **[Configuration System](configuration-system.md)** to see how programs are mapped to process groups and how `%INCLUDE` paths and compiler options are resolved.
6. Read the **[Execution Flow](execution-flow.md)** to trace the code path from "user opens a `.pli` file" through the lifecycle and diagnostics, with exact file references.
7. Follow the **[Study Roadmap](study-roadmap.md)** reading order — read the 10 key source files in the recommended sequence.

### Phase 3 — Start contributing

8. Set up your environment using the **[Testing and Development](testing-and-development.md)** guide.
9. Run the extension locally (F5) and open a `.pli` file to see diagnostics in action.
10. Study the **[How to Add a Validation Rule](how-to-add-a-validation-rule.md)** guide to understand how to add new diagnostics.
11. Pick a fourslash test to study (see `packages/language/test/fourslash/`) to understand how integration tests work.

### Specialization paths

Once you understand the system, you can specialize:

| Area | Key files to study | What to read |
|------|-------------------|--------------|
| **Parser / New syntax** | `parser/parser.ts`, `parser/parser-types.ts`, `syntax-tree/ast.ts` | Study existing statement rules, then add new ones |
| **Preprocessor / Macros** | `preprocessor/instruction-interpreter.ts`, `preprocessor/instruction-generator.ts` | Understand the VM instruction set and include resolution |
| **Validation / Diagnostics** | `validation/pli-validator.ts`, `validation/compiler/IBM*.ts` | Follow the [How to Add a Validation Rule](how-to-add-a-validation-rule.md) guide |
| **Type system** | `typesystem/infer.ts`, `typesystem/type-cache.ts`, `typesystem/composite-type-builder.ts` | Study type inference and assignability checking |
| **LSP features** | `language-server/connection-handler.ts`, `language-server/completion/`, `language-server/hover-request.ts` | Study how `withReadMutex` gates requests, then look at individual feature handlers |
| **Configuration** | `workspace/plugin-configuration-provider.ts`, `preprocessor/compiler-options-processor.ts` | Read the [Configuration System](configuration-system.md) doc |
| **Testing** | `test/fourslash-harness/`, `test/utils.ts`, `test/test-builder.ts` | Read the [Testing and Development](testing-and-development.md) guide |
