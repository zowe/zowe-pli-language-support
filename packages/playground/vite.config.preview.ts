import { defineConfig } from "vite";
import { buildBaseConfig } from "./vite.config.base";

/// <reference lib="rolldown-vite/config" />

export default defineConfig(() => {
  const previewConfig = buildBaseConfig();
  previewConfig.preview = {
    port: 4173,
    host: "0.0.0.0",
    cors: {
      origin: "*",
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  };
  return previewConfig;
});
