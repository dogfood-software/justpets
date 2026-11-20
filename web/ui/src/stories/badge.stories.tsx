import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Avatar, Badge } from "../components/hero";
import { storyLocale } from "./story-locale";

const labels = {
  "en-US": { accent: "New", initials: "JD" },
  "es-US": { accent: "Nuevo", initials: "JD" },
  "he-IL": { accent: "חדש", initials: "י.ד." },
} as const;

const meta = {
  component: Badge,
  render: (args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Badge.Anchor>
        <Avatar>
          <Avatar.Fallback>{t.initials}</Avatar.Fallback>
        </Avatar>
        <Badge {...args} />
      </Badge.Anchor>
    );
  },
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {
  args: { children: "5", color: "danger", size: "sm" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("5")).toBeVisible();
  },
};

export const Accent: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Badge.Anchor>
        <Avatar>
          <Avatar.Fallback>{t.initials}</Avatar.Fallback>
        </Avatar>
        <Badge color="accent" size="sm">
          {t.accent}
        </Badge>
      </Badge.Anchor>
    );
  },
};

export const SuccessDot: Story = {
  args: { color: "success", placement: "bottom-right", size: "sm" },
};
