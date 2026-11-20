"use client";

import { Description, FieldError, Label, Slider } from "@heroui/react";
import { useFieldContext } from "./context";
import { getError } from "./get-error";

export function SliderField({
  label,
  description,
  ...props
}: { label?: string; description?: string } & React.ComponentProps<
  typeof Slider
>) {
  const field = useFieldContext<number | number[]>();
  const error = getError(field);
  return (
    <Slider onChange={field.handleChange} value={field.state.value} {...props}>
      {!!label && <Label>{label}</Label>}
      <Slider.Output />
      <Slider.Track>
        {({ state }) => (
          <>
            <Slider.Fill />
            {state.values.map((v, i) => (
              <Slider.Thumb index={i} key={v} />
            ))}
          </>
        )}
      </Slider.Track>
      {!!description && <Description>{description}</Description>}
      {typeof error === "string" && <FieldError>{error}</FieldError>}
    </Slider>
  );
}
