"use client";

import { Button } from "@heroui/react";
import { Icon, type IconProp } from "../icon";
import { useFormContext } from "./context";

export function SubmitButton({
  label,
  icon,
  ...props
}: { label: string; icon?: IconProp } & React.ComponentProps<typeof Button>) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          isDisabled={!canSubmit}
          isPending={isSubmitting}
          type="submit"
          variant="primary"
          {...props}
        >
          {!!icon && <Icon icon={icon} />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
