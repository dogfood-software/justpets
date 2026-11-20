"use client";

import { Description, FieldError, Label, NumberField } from "@heroui/react";
import { useFieldContext } from "./context";
import { getError } from "./get-error";

export function NumberInputField({
  label,
  description,
  ...props
}: { label?: string; description?: string } & React.ComponentProps<
  typeof NumberField
>) {
  const field = useFieldContext<number>();
  const error = getError(field);
  return (
    <NumberField
      {...props}
      isInvalid={!!error}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value)}
      value={field.state.value}
    >
      {!!label && <Label>{label}</Label>}
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input />
        <NumberField.IncrementButton />
      </NumberField.Group>
      {!!description && <Description>{description}</Description>}
      {typeof error === "string" && <FieldError>{error}</FieldError>}
    </NumberField>
  );
}
