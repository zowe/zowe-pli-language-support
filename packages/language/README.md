# PL1 Language Package

This project contains the Langium-based implementation of PL/I and it's associated language server + tests. This includes features such as parsing & validation, along with standard LS features such as syntax highlighting, code completion, and cross-reference linking for PL/I code.

## Getting Started

To get started, make sure you have following installed:

- [Node.js](https://nodejs.org/) (>=18.0.0 as specified in the package.json)
- [pnpm](https://pnpm.io/) (version specified in `pnpm-lock.yaml`, which is 9.0 at the time of writing this)

### Installation

1. Install dependencies:
```sh
pnpm install
```

2. Build the project (will also regenerate the grammar artifacts)
```sh
pnpm build
```

## Development

Two branches are of interest when developing:
- `main`: The most recent stable state of the project, releases will be built off of this for public use.
- `development`: The current state of the project, where new features are being developed and tested.

When working on a new feature or issue, make sure to create a new branch off of `development`, and submit a PR against that.

### Running Tests

To run the tests across all packages, you can use:

```sh
pnpm test
```
