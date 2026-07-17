import path from "node:path";
import { defineConfig } from "vite";
import { buildBaseConfig } from "./vite.config.base";

/// <reference lib="rolldown-vite/config" />

export default defineConfig(({ command }) => {
  console.log(`Running vite.config.production.ts with command: ${command}`);
  return buildBaseConfig();
});
