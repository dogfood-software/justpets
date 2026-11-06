import Elysia from "elysia";
import { auth } from "@backend/api/services/auth";

export const authPaths = new Elysia({ prefix: "/auth" }).all(
  "/*",
  (context) => {
    const { request, status } = context;
    if (["POST", "GET", "OPTIONS"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(405);
  },
  { detail: { hide: true } }
);
