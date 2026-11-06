import { sql } from "drizzle-orm";
import { db } from "@backend/api/services/db";
import type { DependencyResponse } from "../models";
import type { RequestLogger } from "evlog";

export async function checkPostgres(log: RequestLogger): Promise<DependencyResponse> {
  const start = performance.now();
  try {
    const result = await db.execute<{ version: string }>(
      sql`SELECT version();`
    );
    const version = result?.rows?.[0]?.version;
    log.set({ "postgres_version": version })

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
