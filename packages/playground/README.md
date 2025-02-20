# PL/I Playground

This project contains the source code for the PL/I playground. Which can be visited at https://zowe.github.io/zowe-pli-language-support/. The playground is a monaco-based editor that allows you to write and run PL/I code completely in your browser, without a backend.

### Getting Started

To get started, make sure you have following installed:

- [Node.js](https://nodejs.org/) (>=18.0.0 as specified in the package.json)
- [pnpm](https://pnpm.io/) (version specified in `pnpm-lock.yaml`, which is 9.0 at the time of writing this)

### Installing

Install dependencies:
```sh
pnpm install
```

### Building & Running

You can build the playground by running the following command:
```sh
pnpm build

# you can also run a clean too to keep things fresh
pnpm build:clean
```

Then you can run the playground locally like so via the preview script:
```sh
pnpm preview
```
