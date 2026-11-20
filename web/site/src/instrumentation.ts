// import { MongooseInstrumentation } from "@opentelemetry/instrumentation-mongoose";
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
// import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis";
import {
  otelServiceName,
  railwayOtelResourceAttributes,
  errorAttributes,
} from '@libraries/attributes'
import { type InstrumentationOptionOrName, registerOTel } from '@vercel/otel'
import type { Instrumentation as NextInstrumentation } from 'next'
import { log } from '@/features/log'
import { createOtlpLogRecordProcessor } from '@/features/log/otel'

/** Propagate W3C trace context to local services and Railway private networking. */
const PROPAGATE_CONTEXT_URLS = [
  /^https?:\/\/localhost(:\d+)?(\/|$)/,
  /^https?:\/\/[^/]+\.railway\.internal(:\d+)?(\/|$)/,
]

/**
 * Traces + logs → apps/otel via OTEL_EXPORTER_OTLP_ENDPOINT.
 * Logs emitted under a request inherit the active span (trace_id / span_id).
 *
 * `"auto"` keeps @vercel/otel fetch instrumentation (W3C propagation).
 *
 * Production standalone loads `pino` via `require()`, so `PinoInstrumentation`
 * patches through require-in-the-middle. We intentionally do not call
 * `module.register("@opentelemetry/instrumentation/hook.mjs")`: NFT does not
 * trace that specifier, and Node standalone then fails to resolve the package.
 *
 * Dev would still need that ESM hook for Payload's externalized `import "pino"`.
 * But in dev we see them in the shell...
 */
export function register(): void {
  const logProcessor = createOtlpLogRecordProcessor()

  const instrumentations: InstrumentationOptionOrName[] = [
    'auto',
    new PinoInstrumentation(),
    // new MongooseInstrumentation(),
    // new RedisInstrumentation(),
  ]

  registerOTel({
    attributes: railwayOtelResourceAttributes(process.env),
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: PROPAGATE_CONTEXT_URLS,
      },
    },
    instrumentations,
    logRecordProcessors: logProcessor ? [logProcessor] : undefined,
    serviceName: otelServiceName(process.env, 'site'),
  })
}

export const onRequestError: NextInstrumentation.onRequestError = (error, request, context) => {
  const digest =
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    error.digest !== undefined &&
    error.digest !== null
      ? String(error.digest)
      : undefined

  log.error({
    ...errorAttributes(error),
    'http.method': request.method,
    'http.route': context.routePath,
    'http.target': request.path,
    'next.digest': digest,
    'next.route_type': context.routeType,
    'next.router_kind': context.routerKind,
  })
}
