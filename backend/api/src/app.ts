// dedupe imports for OTEL, god this API sucks
import serverTiming from "@elysia/server-timing";
import { env } from "./services/env";
import { Elysia } from "elysia";
import { VERSION } from "./utils/constants";
import { tracing } from "./modules/tracing";
import { authPaths } from "./modules/auth";
import { docsPaths } from "./modules/docs";
import { healthPaths } from "./modules/health";

// Create the Elysia app
export const app = new Elysia({ nativeStaticResponse: false, prefix: "/api" })
  .headers({
    "X-API-Deployment": env.DEPLOYMENT_ID || "unknown",
    "X-API-Version": VERSION,
  })
  .use(serverTiming())
  .use(tracing)
  // add routes
  .use(docsPaths)
  .use(authPaths)
  .use(healthPaths);

export type App = typeof app;
// export type {
//   ActiveOrganization,
//   Organization,
//   Session,
// } from "./modules/auth";
