import type { useFieldContext } from "./context";

export function getError(
  // biome-ignore lint/suspicious/noExplicitAny: complex type we care not for
  field: ReturnType<typeof useFieldContext<any>>
): string | undefined {
  if (!field.state.meta.isDirty) {
    return undefined;
  }

  const error = field.state.meta.errors?.[0];
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return undefined;
}
