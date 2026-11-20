import { AnyValueMap, logs, SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { BatchLogRecordProcessor, type LogRecordProcessor } from '@opentelemetry/sdk-logs'
import { otelServiceName } from '@libraries/attributes'

type LogAttributes = Record<string, string | number | boolean | undefined>

/**
 * OTLP log processor for `@vercel/otel` `logRecordProcessors`.
 * Exports to `apps/otel` via `OTEL_EXPORTER_OTLP_ENDPOINT` / `_LOGS_ENDPOINT`.
 * Active span context is attached automatically on `logger.emit`.
 */
export function createOtlpLogRecordProcessor(): LogRecordProcessor | undefined {
  if (!(process.env.OTEL_EXPORTER_OTLP_ENDPOINT || process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT)) {
    return
  }

  return new BatchLogRecordProcessor({
    exporter: new OTLPLogExporter(),
    maxExportBatchSize: 50,
    scheduledDelayMillis: 5000,
  })
}

function emit(
  severityNumber: SeverityNumber,
  severityText: string,
  body: string,
  attributes?: LogAttributes,
): void {
  const attrs: AnyValueMap = {}
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      if (value !== undefined) {
        attrs[key] = value
      }
    }
  }

  logs.getLogger(otelServiceName(process.env, 'site')).emit({
    attributes: attrs,
    body,
    severityNumber,
    severityText,
  })
}

/** Server logger → OTLP logs (span-correlated when called under an active request). */
export const log = {
  debug(body: string, attributes?: LogAttributes): void {
    emit(SeverityNumber.DEBUG, 'DEBUG', body, attributes)
  },
  error(body: string, attributes?: LogAttributes): void {
    emit(SeverityNumber.ERROR, 'ERROR', body, attributes)
  },
  info(body: string, attributes?: LogAttributes): void {
    emit(SeverityNumber.INFO, 'INFO', body, attributes)
  },
  warn(body: string, attributes?: LogAttributes): void {
    emit(SeverityNumber.WARN, 'WARN', body, attributes)
  },
}
