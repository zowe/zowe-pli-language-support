import { defineConfig } from "vite";
import { buildBaseConfig } from "./vite.config.base";

/// <reference lib="rolldown-vite/config" />

export default defineConfig(() => {
  return buildBaseConfig();
});
