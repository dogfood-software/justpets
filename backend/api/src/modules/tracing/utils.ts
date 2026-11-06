import { getCurrentSpan } from "@elysia/opentelemetry";
import type { EnrichContext } from "evlog";
import { createDefaultEnrichers } from "evlog/enrichers";

/** Prefer the active OTEL span so logs correlate with spans we export. */
function enrichActiveOtelSpan(ctx: EnrichContext) {
  const spanContext = getCurrentSpan()?.spanContext();
  if (!spanContext?.traceId || spanContext.traceId === "0".repeat(32)) {
    return;
  }

  ctx.event.traceId ??= spanContext.traceId;
  ctx.event.spanId ??= spanContext.spanId;
}

const enrichers = createDefaultEnrichers();

/** Enrich the context of the OTEL log with active span information */
export async function enrich(ctx: EnrichContext) {
  enrichActiveOtelSpan(ctx);
  await enrichers(ctx);
}