'use client'

import { Checkbox, Description, FieldError } from '@heroui/react'
import { useFieldContext } from './context'
import { getError } from './get-error'

export function CheckboxField({
  label,
  description,
  ...props
}: { label: string; description?: string } & React.ComponentProps<typeof Checkbox>) {
  const field = useFieldContext<boolean>()
  const error = getError(field)
  return (
    <Checkbox
      isSelected={field.state.value}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      {...props}
    >
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        {label} {/* plain text — the clickable label + accessible name */}
      </Checkbox.Content>
      {!!description && <Description>{description}</Description>}
      {typeof error === 'string' && <FieldError>{error}</FieldError>}
    </Checkbox>
  )
}
