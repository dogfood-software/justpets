import { drizzle } from "drizzle-orm/node-postgres";

import { relations } from "./relations";

export function createDb(databaseURL: string) {
  return drizzle(databaseURL, { relations });
}

export type Database = ReturnType<typeof createDb>;
