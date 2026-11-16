import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

async function main() {
  const databaseURL = process.env.DATABASE_URL;
  if (!databaseURL) {
    throw new Error("DATABASE_URL is required to run database migrations");
  }

  const client = new Client({ connectionString: databaseURL, connectionTimeoutMillis: 10_000 });
  try {
    await client.connect();
    // Hold a session lock through migration discovery and execution; closing releases it.
    await client.query("SELECT pg_advisory_lock(hashtext('justpets:db:migrate'))");
    console.log("Applying database migrations...");
    await migrate(drizzle({ client }), {
      migrationsFolder: fileURLToPath(new URL("./migrations/", import.meta.url)),
    });
    console.log("Database migrations completed");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Database migrations failed", error);
  process.exitCode = 1;
});
