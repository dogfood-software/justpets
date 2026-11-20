"use client";

import { Description, FieldError, Switch } from "@heroui/react";
import { useFieldContext } from "./context";
import { getError } from "./get-error";

export function SwitchField({
  label,
  description,
  ...props
}: (
  | { label: string; "aria-label"?: string }
  | { label?: string; "aria-label": string }
) & {
  description?: React.ReactNode;
} & React.ComponentProps<typeof Switch>) {
  const field = useFieldContext<boolean>();
  const error = getError(field);
  return (
    <Switch
      isSelected={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      {...props}
    >
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        {label}
      </Switch.Content>
      {!!description && <Description>{description}</Description>}
      {typeof error === "string" && <FieldError>{error}</FieldError>}
    </Switch>
  );
}
