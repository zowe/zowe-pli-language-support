import path from "path";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";
import type { UserConfig } from "vite";

const config: UserConfig = {
  base: "",
  build: {
    target: "es2024",
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
      },
    },
    emptyOutDir: false,
    assetsInlineLimit: 0,
    outDir: path.resolve(__dirname, "out"),
  },
  worker: {
    format: "es",
  },
  esbuild: {
    minifySyntax: false,
  },
  plugins: [vsixPlugin()],
};
export default config;
