import {opentelemetry } from "@elysia/opentelemetry";
import { Elysia } from "elysia";
import { evlog } from "evlog/elysia";
import { createOTLPDrain } from "evlog/otlp";
import { otelServiceName, railwayOtelResource } from "@libraries/attributes";
import { enrich } from "./utils";

// Collector fans out to PostHog / Better Stack / etc.
const drain = createOTLPDrain();

export const tracing = new Elysia({
  detail: { hide: true },
  name: "tracing-context",
}).use(opentelemetry({
    resource: railwayOtelResource(process.env),
    serviceName: otelServiceName(process.env, "api"),
  }))
  .use(evlog({ drain, enrich, redact: true }));
