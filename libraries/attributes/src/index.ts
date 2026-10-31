import {
  defaultResource,
  type Resource,
  resourceFromAttributes,
} from "@opentelemetry/resources";

/** Get the OTEL service name from environment variables or a fallback. */
export function otelServiceName(
  env: Record<string, string | undefined>,
  fallback: string
): string {
  return env.OTEL_SERVICE_NAME ?? env.RAILWAY_SERVICE_NAME ?? fallback;
}

/**
 * Railway injects replica/region/deployment into the container env at start.
 * Build OTEL resource attributes from those live values (not `${{RAILWAY_*}}`
 * Variable UI interpolation, which is empty at config time).
 */
export function railwayResourceAttributes(
  env: Record<string, string | undefined>
): Record<string, string | number | boolean> {
  const attrs: Record<string, string> = {};

  const pairs: [string, string | undefined][] = [
    ["deployment.environment.name", env.RAILWAY_ENVIRONMENT_NAME],
    ["service.instance.id", env.RAILWAY_REPLICA_ID],
    ["cloud.region", env.RAILWAY_REPLICA_REGION],
    ["railway.deployment.id", env.RAILWAY_DEPLOYMENT_ID],
    ["service.version", env.RAILWAY_GIT_COMMIT_SHA],
  ];

  for (const [key, value] of pairs) {
    if (value) {
      attrs[key] = value;
    }
  }

  return attrs;
}

/**
 * Default SDK resource (`telemetry.sdk.*`, etc.) merged with Railway attrs.
 * Prefer this over a bare `resourceFromAttributes(...)` so SDK identity is kept.
 */
export function railwayOtelResource(
  env: Record<string, string | undefined>
): Resource {
  return defaultResource().merge(
    resourceFromAttributes(railwayResourceAttributes(env))
  );
}

/**
 * Attribute map for APIs that take attrs instead of a Resource (e.g. `@vercel/otel`).
 * Omits `service.name` so the caller's `serviceName` / `OTEL_SERVICE_NAME` wins.
 */
export function railwayOtelResourceAttributes(
  env: Record<string, string | undefined>
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(
    railwayOtelResource(env).attributes
  )) {
    if (key === "service.name") {
      continue;
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      out[key] = value;
    }
  }
  return out;
}
