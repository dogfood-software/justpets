import type { useFieldContext } from './context'

export function getError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Accept fields with any value type.
  field: ReturnType<typeof useFieldContext<any>>,
): string | undefined {
  if (!field.state.meta.isDirty) {
    return undefined
  }

  const error = field.state.meta.errors?.[0]
  if (typeof error === 'string') {
    return error
  }
  if (typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return undefined
}
