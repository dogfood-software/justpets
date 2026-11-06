import Elysia, { status } from "elysia";
import { dependencySchema, type DependencyResponse } from "./models";
// import { checkResend } from "./services/resend";
import { checkS3 } from "./services/s3";
import { checkRedis } from "./services/redis";
import { checkPostgres } from "./services/postgres";
import { tracing } from "../tracing";
import { z } from "zod"

const keys = z.enum(["postgres", "s3", "redis"])

const healthyDependenciesSchema = z.record(
  keys,
  dependencySchema.options[0]
);

export const healthPaths = new Elysia({ prefix: "/health" })
  .use(tracing)
  .get(
  "",
  async function healthCheck({ log }) {
    const dependencies = {
      postgres: checkPostgres(log),
      // resend: checkResend(),
      s3: checkS3(),
      redis: checkRedis(log),
    };

    await Promise.all(Object.values(dependencies));

    const results = Object.entries(dependencies).reduce(
      (acc, [key, value]) =>
        Object.assign(acc, { [key]: globalThis.Bun.peek(value) }),
      {} as Record<keyof typeof dependencies, DependencyResponse>
    );

    const healthy = healthyDependenciesSchema.safeParse(results);

    if (healthy.success) {
      return status(200, {
        dependencies: healthy.data,
        status: "healthy",
      });
    }

    return status(503, {
      dependencies: results,
      status: "unhealthy",
    });
  },
  {
    response: {
      200: z.object({
        status: z.literal("healthy"),
        dependencies: healthyDependenciesSchema,
      }),
      503: z.object({
        status: z.literal("unhealthy"),
        dependencies: z.record(keys, dependencySchema),
      })
    },
    detail: {
      description: "validate health of the api service and its dependencies",
      security: [],
      tags: ["Health"],
    },
  }
);
