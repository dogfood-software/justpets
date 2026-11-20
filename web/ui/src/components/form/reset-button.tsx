"use client";

import { Button } from "@heroui/react";
import { useFormContext } from "./context";

export function ResetButton({
  label = "Reset",
  ...props
}: { label?: string } & React.ComponentProps<typeof Button>) {
  const form = useFormContext();
  return (
    <Button
      onPress={() => form.reset()}
      type="button"
      variant="ghost"
      {...props}
    >
      {label}
    </Button>
  );
}
