import { defineConfig } from "tsdown";

const isClientDependency = (id: string) =>
  /^(?:@elysia\/eden|elysia)(?:\/|$)/.test(id);

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
      alwaysBundle: [/@libraries\/.*/, /@packages\/.*/],
    },
  }
]);