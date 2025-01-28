/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

//@ts-check
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");
const minify = process.argv.includes("--minify");

const success = watch ? "Watch build succeeded" : "Build succeeded";

function getTime() {
  const date = new Date();
  return `[${`${padZeroes(date.getHours())}:${padZeroes(date.getMinutes())}:${padZeroes(date.getSeconds())}`}] `;
}

function padZeroes(i) {
  return i.toString().padStart(2, "0");
}

const plugins = [
  {
    name: "watch-plugin",
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length === 0) {
          console.log(getTime() + success);
        }
      });
    },
  },
];

const nodeCtx = await esbuild.context({
  // Entry points for the vscode extension and the language server
  entryPoints: ["src/extension/main.ts", "src/language/main.ts"],
  outdir: "out",
  bundle: true,
  target: "ES2017",
  // VSCode's extension host is still using cjs, so we need to transform the code
  format: "cjs",
  // To prevent confusing node, we explicitly use the `.cjs` extension
  outExtension: {
    ".js": ".cjs",
  },
  loader: { ".ts": "ts" },
  external: ["vscode"],
  platform: "node",
  sourcemap: !minify,
  minify,
  plugins,
});

const browserCtx = await esbuild.context({
  // Entry points for the vscode extension and the language server
  entryPoints: [
    "src/extension/main-browser.ts",
    "src/language/main-browser.ts",
  ],
  outdir: "out",
  bundle: true,
  target: "ES2017",
  format: "cjs",
  loader: { ".ts": "ts" },
  external: ["vscode"],
  platform: "browser",
  sourcemap: !minify,
  minify,
  plugins,
});

if (watch) {
  await Promise.all([nodeCtx.watch(), browserCtx.watch()]);
} else {
  await Promise.all([nodeCtx.rebuild(), browserCtx.rebuild()]);
  await Promise.all([nodeCtx.dispose(), browserCtx.dispose()]);
}
