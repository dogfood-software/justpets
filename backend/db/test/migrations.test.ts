import { execFile } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { Client } from 'pg'
import { expect, test } from 'vitest'

const exec = promisify(execFile)
const packageRoot = fileURLToPath(new URL('../', import.meta.url))

test('migrates an empty database and safely reruns with existing data', async () => {
  const container = await new PostgreSqlContainer('postgres:18').withStartupTimeout(120_000).start()
  let client: Client | undefined
  let runtimeRoot: string | undefined
  const run = async (command: string, args: string[], env = process.env, cwd = packageRoot) => {
    try {
      return await exec(command, args, { cwd, env, timeout: 180_000 })
    } catch (error) {
      const failure = error as Error & { stdout?: string; stderr?: string }
      throw new Error(`${failure.message}\n${failure.stdout ?? ''}\n${failure.stderr ?? ''}`, {
        cause: error,
      })
    }
  }

  try {
    await run('pnpm', ['run', 'build:migrations'])
    runtimeRoot = await mkdtemp(join(tmpdir(), 'justpets-migrations-'))
    await cp(join(packageRoot, 'dist'), runtimeRoot, { recursive: true })
    const env = { ...process.env, DATABASE_URL: container.getConnectionUri() }
    const migrate = () => run('bun', [join(runtimeRoot!, 'migrate.js')], env, runtimeRoot)
    await expect(
      run('bun', [join(runtimeRoot, 'migrate.js')], { ...env, DATABASE_URL: '' }, runtimeRoot),
    ).rejects.toThrow('DATABASE_URL is required')

    const databaseURL = container.getConnectionUri()
    client = new Client({ connectionString: databaseURL })
    await client.connect()
    expect((await client.query("SELECT to_regclass('auth.user') AS name")).rows[0].name).toBeNull()

    await migrate()

    const migrations = await readdir(join(packageRoot, 'src/migrations'), { withFileTypes: true })
    const journal = await client.query('SELECT * FROM drizzle.__drizzle_migrations ORDER BY id')
    expect(journal.rowCount).toBe(migrations.filter((entry) => entry.isDirectory()).length)
    expect(journal.rowCount).toBeGreaterThan(0)

    const user = await client.query(`
      INSERT INTO auth."user" (name, email) VALUES ('Migration test', 'migration@example.com')
      RETURNING id, locale, email_verified
    `)
    expect(user.rows[0]).toMatchObject({ locale: 'en-US', email_verified: false })
    // Exercise a migrated foreign key and its cascade, in addition to column defaults.
    await client.query(
      `
      INSERT INTO auth.session (expires_at, token, user_id, updated_at)
      VALUES (now() + interval '1 day', 'migration-session', $1, now())
    `,
      [user.rows[0].id],
    )

    await migrate()
    // Keep the CLI workflow compatible with migrations applied by the production runner.
    await run('pnpm', ['run', 'db:migrate'], env)
    expect(
      (await client.query('SELECT * FROM drizzle.__drizzle_migrations ORDER BY id')).rows,
    ).toEqual(journal.rows)
    expect(
      (await client.query('SELECT id FROM auth."user" WHERE id = $1', [user.rows[0].id])).rowCount,
    ).toBe(1)
    expect(
      (await client.query("SELECT * FROM auth.session WHERE token = 'migration-session'")).rowCount,
    ).toBe(1)
    await client.query('DELETE FROM auth."user" WHERE id = $1', [user.rows[0].id])
    expect(
      (await client.query("SELECT * FROM auth.session WHERE token = 'migration-session'")).rowCount,
    ).toBe(0)

    const brokenMigration = join(runtimeRoot, 'migrations/20990101000000_failure')
    await mkdir(brokenMigration)
    await writeFile(
      join(brokenMigration, 'migration.sql'),
      'CREATE TABLE public.migration_rollback_test (id integer);\n--> statement-breakpoint\nSELECT * FROM public.missing_migration_table;',
    )
    await expect(migrate()).rejects.toThrow('Database migrations failed')
    expect(
      (await client.query("SELECT to_regclass('public.migration_rollback_test') AS name")).rows[0]
        .name,
    ).toBeNull()
    expect(
      (await client.query('SELECT * FROM drizzle.__drizzle_migrations ORDER BY id')).rows,
    ).toEqual(journal.rows)
  } finally {
    try {
      await client?.end()
    } finally {
      try {
        await container.stop()
      } finally {
        if (runtimeRoot) await rm(runtimeRoot, { recursive: true, force: true })
      }
    }
  }
}, 240_000)
