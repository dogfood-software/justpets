import { redis } from "@backend/api/services/redis";
import type { DependencyResponse } from "../models";
import type { RequestLogger } from "evlog";

/** Read Redis server info to verify connectivity and log its version. */
export async function checkRedis(log: RequestLogger): Promise<DependencyResponse> {
  const start = performance.now();
  try {
    const info = await redis.info("server");
    const version = info.match(/^redis_version:([^\r\n]+)/m)?.[1];
    log.set({ redis_version: version });

    return {
      latency: performance.now() - start,
      status: "healthy",
    };
  } catch (error) {
    return {
      error,
      latency: performance.now() - start,
      status: "unhealthy",
    };
  }
}
