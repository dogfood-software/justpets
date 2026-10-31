# 🔭 Open Telemetry (OTEL)

Proxy collector that receives logs, traces, and metrics from all services, then
fans them out to PostHog, Better Stack, and Railway Traces.

See [otel-config.yaml](./otel-config.yaml) for the configuration.

## Exporters

| Sink | Signals | Notes |
| --- | --- | --- |
| **PostHog** (EU) | logs, traces, metrics | Product analytics + observability |
| **Better Stack** | logs, traces, metrics | Live tail + [AI SRE](https://betterstack.com/ai-sre) (free tier: 3-day retention) |
| **Railway Traces** | traces only | Third sink via Railway's host OTLP receiver |

Apps keep pointing at this collector (`OTEL_EXPORTER_OTLP_ENDPOINT=http://otel.railway.internal:4318`).
Fan-out stays collector-only — no per-app dual export.

**PostHog traces:** the collector re-roots `router` SERVER spans (clears `parent_span_id`) because Railway edge/proxy parents are not exported to this collector. Better Stack and Railway keep the original parent links.

## Environment variables

Set these on the Railway `otel` service:

| Variable | Purpose |
| --- | --- |
| `PH_PROJECT_TOKEN` | PostHog project API token (`Bearer` auth) |
| `BETTERSTACK_INGESTING_HOST` | Better Stack source ingest host (no `https://`) |
| `BETTERSTACK_SOURCE_TOKEN` | Better Stack source token (`Bearer` auth) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Injected by Railway when Tracing is enabled on `otel` — do **not** set this yourself. Config defaults to `http://127.0.0.1:4318` if unset so the collector still starts. |

Also set (Railway's receiver accepts traces only):

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

### Railway Traces setup

1. **Router (edge):** Tracing setup → **Traced** on for `router` (Manual is fine). Edge/proxy spans start for the public domain.
2. **Collector:** **Traced** on for `otel` (Manual). Redeploy so Railway injects `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_PROTOCOL`, and `OTEL_EXPORTER_OTLP_HEADERS=x-railway-otel=true`.
3. [otel-config.yaml](./otel-config.yaml) sends `x-railway-otel: true` on the Railway exporter (collector map form of that injected header).
4. Do **not** override `OTEL_EXPORTER_OTLP_ENDPOINT` on `otel` — that blocks Railway injection ([docs](https://docs.railway.com/observability/tracing#provided-variables)).

#### What to verify in staging

- PostHog and Better Stack still receive traces/logs/metrics.
- Railway Traces shows edge spans for traffic through `router` (`x-railway-trace-id`).
- App spans appear after the collector exports (App indicator for `otel`).
- Check `@serviceName:…` (payload `service.name`) vs `@service:otel` (Railway sender identity).
- Railway ingest limit: **1,000 spans / 10s / replica** on `otel`. Over-limit rejects Railway-bound batches only; other exporters keep their own queues.

### Better Stack setup

1. Create an **OpenTelemetry** source in Better Stack → Sources.
2. Copy the **ingesting host** and **source token** from the source setup screen.
3. Prefer an **EU** ingest region if you want parity with the EU PostHog instance.
4. Docs:
   - [OpenTelemetry collector dual-export](https://betterstack.com/docs/logs/open-telemetry/)
   - [Direct OTLP endpoints](https://betterstack.com/docs/logs/ingesting-data/http/traces/) (`/v1/traces`, `/v1/logs`, `/v1/metrics`)
   - [AI SRE](https://betterstack.com/docs/ai-sre/analyzing-data/logs/) (queries the data you ingest)
