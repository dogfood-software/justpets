'use client'

import {
  DateField,
  type DateRange,
  DateRangePicker,
  Description,
  Label,
  RangeCalendar,
} from '@heroui/react'
import { useFieldContext } from './context'

export function DateRangePickerField({
  label,
  description,
  calendarAriaLabel,
  ...props
}: {
  label?: string
  description?: string
  calendarAriaLabel: string
} & React.ComponentProps<typeof DateRangePicker>) {
  const field = useFieldContext<DateRange | null>()

  return (
    <DateRangePicker
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      value={field.state.value}
      {...props}
    >
      {!!label && <Label>{label}</Label>}
      <DateField.Group fullWidth>
        <DateField.Input slot="start">
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateRangePicker.RangeSeparator />
        <DateField.Input slot="end">
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DateRangePicker.Trigger>
            <DateRangePicker.TriggerIndicator />
          </DateRangePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DateRangePicker.Popover>
        <RangeCalendar aria-label={calendarAriaLabel}>
          <RangeCalendar.Header>
            <RangeCalendar.YearPickerTrigger>
              <RangeCalendar.YearPickerTriggerHeading />
              <RangeCalendar.YearPickerTriggerIndicator />
            </RangeCalendar.YearPickerTrigger>
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
          <RangeCalendar.YearPickerGrid>
            <RangeCalendar.YearPickerGridBody>
              {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
            </RangeCalendar.YearPickerGridBody>
          </RangeCalendar.YearPickerGrid>
        </RangeCalendar>
      </DateRangePicker.Popover>
      {!!description && <Description>{description}</Description>}
    </DateRangePicker>
  )
}
