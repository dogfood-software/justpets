import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Separator } from "../components/hero";
import { storyLocale } from "./story-locale";

const labels = {
  "en-US": {
    blog: "Blog",
    docs: "Docs",
    playdates: "Playdates",
    subtitle: "Browse matches nearby.",
    title: "Dog profiles",
    walks: "Walks",
  },
  "es-US": {
    blog: "Blog",
    docs: "Docs",
    playdates: "Citas de juego",
    subtitle: "Explora coincidencias cercanas.",
    title: "Perfiles de perros",
    walks: "Paseos",
  },
  "he-IL": {
    blog: "בלוג",
    docs: "מסמכים",
    playdates: "מפגשי משחק",
    subtitle: "עיין בהתאמות בקרבת מקום.",
    title: "פרופילי כלבים",
    walks: "טיולים",
  },
} as const;

const meta = {
  component: Separator,
  render: (args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <div className="max-w-md">
        <div className="space-y-1">
          <h4 className="font-medium">{t.title}</h4>
          <p className="text-muted text-sm">{t.subtitle}</p>
        </div>
        <Separator className="my-4" {...args} />
        <div className="flex h-5 items-center gap-4 text-sm">
          <div>{t.blog}</div>
          <Separator orientation="vertical" />
          <div>{t.docs}</div>
        </div>
      </div>
    );
  },
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)];
    await expect(canvas.getByText(t.title)).toBeVisible();
  },
};

export const VerticalOnly: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>{t.walks}</div>
        <Separator orientation="vertical" />
        <div>{t.playdates}</div>
      </div>
    );
  },
};
