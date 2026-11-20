import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/useDestructuring: Vite rewrites import.meta.dirname; destructuring breaks configDir
const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            storybookScript: "pnpm run storybook -- --no-open",
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright({}),
          },
          name: "storybook",
        },
      },
      // Browser project: real Chromium APIs (e.g. cookieStore). Not available in jsdom.
      {
        plugins: [react()],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright({}),
          },
          include: ["src/**/*.browser.test.{ts,tsx}"],
          name: "browser",
        },
      },
      // Node project: pure utilities with no browser APIs (real clsx/twMerge, not mocks).
      {
        test: {
          environment: "node",
          exclude: ["src/**/*.browser.test.ts"],
          include: ["src/**/*.test.ts"],
          name: "node",
        },
      },
    ],
  },
});
