import { execFile } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";
import { expect, test } from "vitest";

const exec = promisify(execFile);
const packageRoot = fileURLToPath(new URL("../", import.meta.url));

test("migrates an empty database and safely reruns with existing data", async () => {
  const container = await new PostgreSqlContainer("postgres:18")
    .withStartupTimeout(120_000)
    .start();
  let client: Client | undefined;
  const run = async (command: string, args: string[], env = process.env) => {
    try {
      return await exec(command, args, { cwd: packageRoot, env, timeout: 180_000 });
    } catch (error) {
      const failure = error as Error & { stdout?: string; stderr?: string };
      throw new Error(`${failure.message}\n${failure.stdout ?? ""}\n${failure.stderr ?? ""}`, { cause: error });
    }
  };

  try {
    const databaseURL = container.getConnectionUri();
    client = new Client({ connectionString: databaseURL });
    await client.connect();
    expect((await client.query("SELECT to_regclass('auth.user') AS name")).rows[0].name).toBeNull();

    const migrate = () => run("pnpm", ["run", "db:migrate"], { ...process.env, DATABASE_URL: databaseURL });
    await migrate();

    const migrations = await readdir(join(packageRoot, "src/migrations"), { withFileTypes: true });
    const journal = await client.query('SELECT * FROM drizzle.__drizzle_migrations ORDER BY id');
    expect(journal.rowCount).toBe(migrations.filter((entry) => entry.isDirectory()).length);
    expect(journal.rowCount).toBeGreaterThan(0);

    const user = await client.query(`
      INSERT INTO auth."user" (name, email) VALUES ('Migration test', 'migration@example.com')
      RETURNING id, locale, email_verified
    `);
    expect(user.rows[0]).toMatchObject({ locale: "en-US", email_verified: false });
    // Exercise a migrated foreign key and its cascade, in addition to column defaults.
    await client.query(`
      INSERT INTO auth.session (expires_at, token, user_id, updated_at)
      VALUES (now() + interval '1 day', 'migration-session', $1, now())
    `, [user.rows[0].id]);

    await migrate();
    expect((await client.query('SELECT * FROM drizzle.__drizzle_migrations ORDER BY id')).rows).toEqual(journal.rows);
    expect((await client.query('SELECT id FROM auth."user" WHERE id = $1', [user.rows[0].id])).rowCount).toBe(1);
    expect((await client.query("SELECT * FROM auth.session WHERE token = 'migration-session'")).rowCount).toBe(1);
    await client.query('DELETE FROM auth."user" WHERE id = $1', [user.rows[0].id]);
    expect((await client.query("SELECT * FROM auth.session WHERE token = 'migration-session'")).rowCount).toBe(0);
  } finally {
    try {
      await client?.end();
    } finally {
      await container.stop();
    }
  }
}, 240_000);
