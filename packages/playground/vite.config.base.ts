import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { UserConfig } from "vite";

/// <reference lib="rolldown-vite/config" />

export const buildBaseConfig: () => UserConfig = () => {
  return {
    base: "./",
    build: {
      rolldownOptions: {
        input: {
          index: path.resolve(__dirname, "index.html"),
        },
      },
      emptyOutDir: true,
      outDir: path.resolve(__dirname, "out"),
      assetsInlineLimit: 0,
    },
    worker: {
      format: "es",
    },
    plugins: [vsixPlugin()],
    server: {
      port: 5173,
      host: "0.0.0.0",
      cors: {
        origin: "*",
      },
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
    },
  };
};
