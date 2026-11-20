"use client";

import {
  Description,
  FieldError,
  Label,
  TextArea,
  TextField,
  type TextFieldProps,
} from "@heroui/react";
import { useFieldContext } from "./context";
import { getError } from "./get-error";

export function TextAreaField({
  label,
  placeholder,
  description,
  ...props
}: {
  label?: React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;
} & Omit<TextFieldProps, "value" | "onChange" | "onBlur" | "isInvalid">) {
  const field = useFieldContext<string>();
  const error = getError(field);
  return (
    <TextField
      isInvalid={!!error}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value)}
      value={field.state.value}
      {...props}
    >
      {!!label && <Label>{label}</Label>}
      <TextArea aria-placeholder={placeholder} placeholder={placeholder} />
      {!!description && <Description>{description}</Description>}
      {typeof error === "string" && <FieldError>{error}</FieldError>}
    </TextField>
  );
}
