"use client";

import {
  Button,
  Description,
  FieldError,
  InputGroup,
  Label,
  TextField,
  type TextFieldProps,
} from "@heroui/react";
import { useState } from "react";
import { faEye, faEyeSlash } from "../../icons/solid";
import { cn } from "../../utils/cn";
import { Icon } from "../icon";
import { useFieldContext } from "./context";
import { getError } from "./get-error";

export function TextInputField({
  label,
  placeholder,
  description,
  prefix,
  suffix,
  type,
  ...props
}: {
  label?: string;
  placeholder?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
} & Omit<TextFieldProps, "value" | "onChange" | "onBlur" | "isInvalid">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const field = useFieldContext<string>();
  const error = getError(field);

  const finalType =
    // biome-ignore lint/style/noNestedTernary: simple override
    type === "password" ? (isPasswordVisible ? "text" : "password") : type;

  return (
    <TextField
      isInvalid={!!error}
      onBlur={field.handleBlur}
      onChange={(value) => field.handleChange(value)}
      value={field.state.value}
      {...props}
    >
      <Label>{label}</Label>
      <InputGroup>
        {!!prefix && <InputGroup.Prefix>{prefix}</InputGroup.Prefix>}
        <InputGroup.Input
          className={cn(
            prefix ? "ps-0" : "ps-3",
            suffix || type === "password" ? "pe-0" : "pe-3"
          )}
          placeholder={placeholder}
          type={finalType}
        />
        {type === "password" ? (
          <InputGroup.Suffix>
            <Button
              isIconOnly
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              variant="ghost"
            >
              <Icon icon={isPasswordVisible ? faEyeSlash : faEye} />
            </Button>
            {suffix}
          </InputGroup.Suffix>
        ) : (
          suffix && <InputGroup.Suffix>{suffix}</InputGroup.Suffix>
        )}
      </InputGroup>
      {!!description && <Description>{description}</Description>}
      {typeof error === "string" && <FieldError>{error}</FieldError>}
    </TextField>
  );
}
