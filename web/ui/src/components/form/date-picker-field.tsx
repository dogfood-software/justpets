"use client";

import {
  Calendar,
  DateField,
  DatePicker,
  type DateValue,
  Description,
  FieldError,
  Label,
} from "@heroui/react";
import { useFieldContext } from "./context";
import { getError } from "./get-error";

export function DatePickerField({
  label,
  description,
  calendarAriaLabel,
  ...props
}: {
  label?: string;
  description?: string;
  calendarAriaLabel: string;
} & React.ComponentProps<typeof DatePicker>) {
  const field = useFieldContext<DateValue | null>();
  const error = getError(field);

  return (
    <DatePicker
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      value={field.state.value}
      {...props}
    >
      {!!label && <Label>{label}</Label>}
      <DateField.Group fullWidth>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover>
        <Calendar aria-label={calendarAriaLabel}>
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
      {!!description && <Description>{description}</Description>}
      {typeof error === "string" && <FieldError>{error}</FieldError>}
    </DatePicker>
  );
}
