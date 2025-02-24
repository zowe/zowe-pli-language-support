# Zowe PL/I Language Support

PL/I Language Support by Zowe Community

See it in an interactive [playground](https://zowe.github.io/zowe-pli-language-support/)!

### Contained Projects
- [PL/I Language Support](./packages/language/README.md)
- [PL/I VSCode Extension](./packages/vscode-extension/README.md)
- [PL/I Playground](./packages/playground/README.md)

### Getting Started

To get started, make sure you have following installed:

- [Node.js](https://nodejs.org/) (>=18.0.0 as specified in the package.json)
- [pnpm](https://pnpm.io/) (version specified in `pnpm-lock.yaml`, which is 9.0 at the time of writing this)

### Installing

Via pnpm, you can quickly install all dependencies like so:
```sh
pnpm install
```

### Building

Building at the top level will build all contained projects:
```sh
pnpm build
```

This will trigger generation, building the language & vscode-extension projects, and bundling of the extension. For more details on each of these projects, see their respective READMEs linked above.
