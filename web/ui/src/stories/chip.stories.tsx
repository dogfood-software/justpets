import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Chip } from "../components/hero";
import { storyLocale } from "./story-locale";

const labels = {
  "en-US": { default: "Friendly", matched: "Matched" },
  "es-US": { default: "Amigable", matched: "Compatibles" },
  "he-IL": { default: "ידידותי", matched: "התאמה" },
} as const;

const meta = {
  component: Chip,
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as never,
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)];
    await expect(canvas.getByText(t.default)).toBeVisible();
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return <Chip>{t.default}</Chip>;
  },
};

export const AccentSoft: Story = {
  args: { children: "24", color: "accent", size: "sm", variant: "soft" },
};

export const Success: Story = {
  args: {} as never,
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return <Chip color="success">{t.matched}</Chip>;
  },
};
