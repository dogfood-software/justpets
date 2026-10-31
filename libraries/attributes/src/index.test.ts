import { describe, expect, it } from "vitest";
import {
  otelServiceName,
  railwayOtelResource,
  railwayOtelResourceAttributes,
  railwayResourceAttributes,
} from "./index";

describe("otelServiceName", () => {
  it("prefers OTEL_SERVICE_NAME over RAILWAY_SERVICE_NAME", () => {
    expect(
      otelServiceName(
        {
          OTEL_SERVICE_NAME: "otel-service",
          RAILWAY_SERVICE_NAME: "railway-service",
        },
        "fallback"
      )
    ).toBe("otel-service");
  });

  it("uses RAILWAY_SERVICE_NAME when OTEL_SERVICE_NAME is unset", () => {
    expect(
      otelServiceName({ RAILWAY_SERVICE_NAME: "railway-service" }, "fallback")
    ).toBe("railway-service");
  });

  it("uses the fallback when neither service name is set", () => {
    expect(otelServiceName({}, "fallback")).toBe("fallback");
  });

  it("preserves an explicitly empty OTEL_SERVICE_NAME", () => {
    expect(
      otelServiceName(
        { OTEL_SERVICE_NAME: "", RAILWAY_SERVICE_NAME: "railway-service" },
        "fallback"
      )
    ).toBe("");
  });
});

describe("railwayResourceAttributes", () => {
  it("maps Railway environment values to OpenTelemetry attribute names", () => {
    expect(
      railwayResourceAttributes({
        RAILWAY_ENVIRONMENT_NAME: "production",
        RAILWAY_REPLICA_ID: "replica-1",
        RAILWAY_REPLICA_REGION: "us-west",
        RAILWAY_DEPLOYMENT_ID: "deployment-1",
        RAILWAY_GIT_COMMIT_SHA: "abc123",
      })
    ).toEqual({
      "deployment.environment.name": "production",
      "service.instance.id": "replica-1",
      "cloud.region": "us-west",
      "railway.deployment.id": "deployment-1",
      "service.version": "abc123",
    });
  });

  it("omits unset and empty environment values", () => {
    expect(
      railwayResourceAttributes({
        RAILWAY_ENVIRONMENT_NAME: "production",
        RAILWAY_REPLICA_ID: "",
      })
    ).toEqual({ "deployment.environment.name": "production" });
  });

  it("returns an empty object when no Railway values are set", () => {
    expect(railwayResourceAttributes({})).toEqual({});
  });
});

describe("railwayOtelResource", () => {
  it("includes Railway attributes while retaining SDK resource attributes", () => {
    const resource = railwayOtelResource({
      RAILWAY_REPLICA_ID: "replica-1",
    });

    expect(resource.attributes["service.instance.id"]).toBe("replica-1");
    expect(resource.attributes["telemetry.sdk.name"]).toBeDefined();
  });
});

describe("railwayOtelResourceAttributes", () => {
  it("includes resource attributes other than service.name", () => {
    const attributes = railwayOtelResourceAttributes({
      RAILWAY_REPLICA_ID: "replica-1",
    });

    expect(attributes["service.instance.id"]).toBe("replica-1");
    expect(attributes["telemetry.sdk.name"]).toBeDefined();
    expect(attributes).not.toHaveProperty("service.name");
  });
});
