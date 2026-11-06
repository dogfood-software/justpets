import openapi from "@elysia/openapi";
import { env } from "@backend/api/services/env";
import Elysia from "elysia";
import z from "zod";
import { VERSION } from "@backend/api/utils/constants";
import { OpenAPI } from "@backend/api/modules/auth/lib/openapi";

export const tags = {
  "Health": "Validation endpoints to make sure the service is alive.",
  "Auth": "Core Better Auth API"
}

type TagList = (keyof typeof tags)[]

// const projectRoot = process.cwd();

const authPaths = await OpenAPI.getPaths("/api/auth")
const authTags = [...new Set(
  Object.values<any>(authPaths).flatMap((p) => Object.values<any>(p).flatMap((op) => op.tags ?? [])),
)]

export const docsPaths = new Elysia({ detail: { hide: true }, prefix: "/docs" })
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: authPaths,
        //@ts-expect-error this is valid but not in the types
        "x-tagGroups": [
          { name: "Better Auth", tags: authTags },
          { name: "Internal", tags: ["Health"] as TagList },
        ],
        info: {
          description: [
            "# 🧑‍💻 Welcome Tinkerers, Hackers & Robots",
            "This is our entire published API surface, available in the OpenAPI standard spec via both JSON and YAML formats.",
            "",
            "## 🔐 Authentication",
            "We use [Better Auth](https://better-auth.com) for authentication. Protected routes are automatically tagged below and will return a 401 if not authenticated.",
            "Please use valid API keys generated for your buisness in the application",
            "",
            "## 🔖 Versioning",
            "We include the following headers automatically on all deployments to identify the version of the running applicaiton.",
            "",
            `- \`X-API-Version\` — API version (\`${VERSION}\`)`,
            `- \`X-API-Deployment\` — Specific Git SHA of the deployment (\`${env.DEPLOYMENT_ID || "unknown"}\`)`,
          ].join("\n"),
          title: "API",
          version: VERSION,
        },
        // Same shape as Better Auth: both schemes in one object = AND in Scalar
        security: [{ apiKeyCookie: [], bearerAuth: [] }],
        tags: Object.entries(tags).map(([name, description]) => ({ name, description }))
      },
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      provider: "scalar",
      scalar: {
        theme: "halloween",
        showDeveloperTools: "never",
      },
      // Not TS 7 compatible yet
      // references: fromTypes(path.join(projectRoot, "dist/src/index.d.ts"), {
      //   projectRoot,
      // }),
      specPath: "/openapi.json",
    })
  );
