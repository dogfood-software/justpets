import { defineConfig } from "tsdown";

export default defineConfig([
  {
    name: "server",
    entry: { server: "./src/server.ts" },
    format: "esm",
    outDir: "./dist",
    clean: true,
    dts: true,
    sourcemap: true,
    deps: {
      alwaysBundle: [/@backend\/.*/, /@libraries\/.*/, /@packages\/.*/],
    },
  }
]);