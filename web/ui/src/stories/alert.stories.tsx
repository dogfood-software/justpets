import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Alert } from "../components/hero";
import { storyLocale } from "./story-locale";

const labels = {
  "en-US": {
    dangerDescription: "Could not save preferences.",
    dangerTitle: "Error",
    successDescription: "Your changes have been saved.",
    successTitle: "Success",
    warningDescription: "Profile photo still uploading.",
    warningTitle: "Warning",
  },
  "es-US": {
    dangerDescription: "No se pudieron guardar las preferencias.",
    dangerTitle: "Error",
    successDescription: "Tus cambios se han guardado.",
    successTitle: "Éxito",
    warningDescription: "La foto de perfil aún se está subiendo.",
    warningTitle: "Advertencia",
  },
  "he-IL": {
    dangerDescription: "לא ניתן לשמור את ההעדפות.",
    dangerTitle: "שגיאה",
    successDescription: "השינויים שלך נשמרו.",
    successTitle: "הצלחה",
    warningDescription: "תמונת הפרופיל עדיין מועלית.",
    warningTitle: "אזהרה",
  },
} as const;

const meta = {
  component: Alert,
  tags: ["ai-generated", "needs-work"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {} as never,
  play: async ({ canvas, globals }) => {
    const t = labels[storyLocale(globals)];
    await expect(canvas.getByText(t.successDescription)).toBeVisible();
  },
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Alert status="success">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t.successTitle}</Alert.Title>
          <Alert.Description>{t.successDescription}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  },
};

export const Warning: Story = {
  args: {} as never,
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Alert status="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t.warningTitle}</Alert.Title>
          <Alert.Description>{t.warningDescription}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  },
};

export const Danger: Story = {
  args: {} as never,
  render: (_args, { globals }) => {
    const t = labels[storyLocale(globals)];
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t.dangerTitle}</Alert.Title>
          <Alert.Description>{t.dangerDescription}</Alert.Description>
        </Alert.Content>
      </Alert>
    );
  },
};
