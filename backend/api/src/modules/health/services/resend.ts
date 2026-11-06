import { env } from "@backend/api/services/env";
import { Resend } from "resend";
import type { DependencyResponse } from "../models";

/** List domains to verify the Resend API key without sending mail. */
export async function checkResend(): Promise<DependencyResponse> {
  const start = performance.now();
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.domains.list({ limit: 1 });
    if (error) {
      throw error;
    }

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
