# Testing

The PL/I language server features a sophisticated testing infrastructure via the fourslash framework.

It enables developers to easily create individual workspaces of PL/I code and run tests against those snippets. The tests themselves run as simple JavaScript inside of a node.js sandbox.

## Running the tests

Running all tests is as simple as running `pnpm test` in your terminal. Additional testing scripts can be found in the `package.json` of the root project. Running the fourslash tests only can be done via the `pnpm test:fourslash` script.

## Running the compiler tests

An additional benefit to the fourslash infrastructure is the ability to run the tests against the compiler. This enables developers to confirm that the behavior of the language server aligns to the behavior of the compiler.

The compiler tests are run in three separate phases:
1. The extraction phase is triggered via the `pnpm extract-compiler-tests` script. It expects an additional path as an argument like `pnpm extract-compiler-tests ../output/compiler`, where it will place all of the test files.
2. The second phase requires use of a PL/I mainframe compiler. All output files in the aforementioned `../output/compiler` directory need to be compiled. This should provide a `.list` file for each test case, using the same structure as the input test files. The listings should be placed somewhere relative to this repository (e.g. `../output/listings`).
3. The third phase executes all tests annotated with `@compiler: true` against the `../output/listings` directory. For this, the `TEST_COMPILER_OUTPUT=../output/listings` env variables needs to be set before running the `pnpm test:fourslash` script. The easiest way to do this is via the `cross-env` package:

```sh
npx cross-env TEST_COMPILER_OUTPUT=../output/listings pnpm test:fourslash
```

Note that not all testing functions are actually implemented for the compiler tests, as the compiler does not provide all of the necessary data. Calling such a non-implemented testing function will result in a `console.warn` output.