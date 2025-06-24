# PL/I VSCode Extension

This project contains the VSCode extension for PL/I language support.

## Getting Started

To get started, make sure you have following installed:

- [Node.js](https://nodejs.org/) (>=18.0.0 as specified in the package.json)
- [pnpm](https://pnpm.io/) (version specified in `pnpm-lock.yaml`, which is 9.0 at the time of writing this)

### Installing

1. Install dependencies:
```sh
pnpm install
```

### Running the Extension

You can run the regular VSCode extension via a launch configuration (for the web extension see the bottom of this section):

1. Open the project in VS Code.
2. From the Run and Debug view, select **Run Extension** & click the green play button.
3. From the extension host window that pops up, navigate to the folder containing your PL/I code, and the LS should take care of the rest.

The extension can also be debugged from the language server side by then launching the 'Attach to Language Server' configuration, also listed in the Run and Debug view. This can be started up after the extension host is running.

To run the **Web Extension**, it's the same process, but select the **Run Web Extension** option instead.

### Building the Extension

You can also build a physical extension package to install locally:

Build the project bundle w/ ESBuild
```sh
pnpm esbuild:bundle
```

Build a VSIX package
```sh
pnpm package
```

This will produce a **pli-vscode-x.x.x.vsix** file in the root of the project (x.x.x correlating with current extension version). This can be locally installed for testing.
