import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Switch } from "../components/hero";
import { storyLocale } from "./story-locale";

const labels = {
  "en-US": {
    enable: "Enable notifications",
    unavailable: "Unavailable",
  },
  "es-US": {
    enable: "Activar notificaciones",
    unavailable: "No disponible",
  },
  "he-IL": {
    enable: "הפעל התראות",
    unavailable: "לא זמין",
  },
} as const;

const meta = {
  component: Switch,
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function SwitchLabel({ children }: { children: string }) {
  return (
    <Switch>
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        {children}
      </Switch.Content>
    </Switch>
  );
}

export const Off: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("switch")).not.toBeChecked();
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return <SwitchLabel>{t.enable}</SwitchLabel>;
  },
};

export const On: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Switch defaultSelected>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {t.enable}
        </Switch.Content>
      </Switch>
    );
  },
};

export const Disabled: Story = {
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Switch isDisabled>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {t.unavailable}
        </Switch.Content>
      </Switch>
    );
  },
};
