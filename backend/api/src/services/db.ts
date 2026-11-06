import { createDb, type Database } from "@backend/db";
import { env } from "./env";

// We are running on Bun so we should take advantage of the built in drivers
export const db: Database = createDb(env.DATABASE_URL);
