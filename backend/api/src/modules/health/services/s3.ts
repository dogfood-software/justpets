import type { DependencyResponse } from "../models";
import { s3 } from "@backend/api/services/s3";

/** List one object to verify Bun.s3 credentials and bucket reachability. */
export async function checkS3(): Promise<DependencyResponse> {
  const start = performance.now();
  try {
    await s3.list({ maxKeys: 1 });

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
