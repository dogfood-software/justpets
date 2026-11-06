// dedupe imports for OTEL, god this API sucks
import { env } from "./services/env";
import { initLogger, log } from "evlog";
import { VERSION } from "./utils/constants";

initLogger({
  env: { service: "api" },
  pretty: env.NODE_ENV === "development",
});

const port = Number(process.env.PORT) || 4041;

// Create the Elysia app
import { app } from "./app";

// Start the server
app.listen({ hostname: "0.0.0.0", idleTimeout: env.IDLE_TIMEOUT, port }, () => {
  log.info({
    message: "server is running",
    port,
    timeout: env.IDLE_TIMEOUT,
    hostname: "0.0.0.0",
    semver: VERSION,
    env: env.NODE_ENV,
    deploymentId: env.DEPLOYMENT_ID,
  });
});

// Graceful shutdown helper
async function shutdown(signal: string) {
  log.info({ message: "shutting down", signal });
  await app.stop();
  process.exit(0);
}

// Graceful shutdown on SIGTERM and SIGINT
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

export { app };
export type App = typeof app;
// export type {
//   ActiveOrganization,
//   Organization,
//   Session,
// } from "@backend/auth/server";
