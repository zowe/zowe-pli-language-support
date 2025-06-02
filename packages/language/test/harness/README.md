# Harness Test Framework

Inspired by the [TypeScript Fourslash testing system](https://github.com/microsoft/TypeScript/tree/main/tests/cases/fourslash).

## Example

```ts
/// <reference path="../framework.ts" />

/**
 * Redeclaration of label must fail
 */

// @wrap: main
//// OUTER: PROCEDURE;
//// END OUTER;
//// <|1:OUTER|>: PROCEDURE;
//// END OUTER;
//// CALL OUTER;

verify.expectExclusiveErrorCodesAt(1, code.Severe.IBM1916I.fullCode);
```

## Usage

All test files must include the framework reference.

```ts
/// <reference path="framework.ts" />
```

### Virtual File System

A single test file can describe multiple PL/I files. The test runner will create a virtual file system. Files are inserted into the unit compiler in reverse order (i.e., your main file should be last).

A file is defined by the `// @filename: ...` tag on a file definition, e.g.:

```ts
// @filename: file1.pli
//// DCL A;
//// PUT(A);

// @filename: file2.pli
//// DCL B;
//// PUT(B);
```

### Wrap

The `// @wrap: ...` tag wraps a file in a predefined wrap template.
The wrap template are defined in the `wrappers/` directory.
The `<...>` tag is used to declare where content is inserted to the wrap template.

### Imperative Testing Commands

After the file definitions, the commands follow.

## Contributing

When adding a test command, it first needs to be declared in the `harness-interface.ts` and `tests/framework.ts` file to be exposed to the test files. Following that, the semantics needs to be implemented in the `harness-implementation.ts` file.
