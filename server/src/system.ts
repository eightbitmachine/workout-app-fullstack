import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { type Database } from "./db/schema.js";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";

type System = {
  env?: NodeJS.ProcessEnv;
  db?: Pool;
  queryBuilder?: Kysely<Database>;
  server?: Bun.Server<Hono>;
};

const startQueryBuilder = (system: System) => {
  if (!system.db) {
    return undefined;
  }

  const dialect = new PostgresDialect({
    pool: system.db,
  });

  const queryBuilder = new Kysely<Database>({ dialect });

  return queryBuilder;
};

const stopQueryBuilder = (queryBuilder?: Kysely<Database>) => {
  queryBuilder?.destroy();
};

// TODO: Confiure some kind of timeout?
// Because the page response hangs if we do a request when the db is shutdown.
const startDatabase = (system: System) => {
  const connectionPool = new Pool({
    user: system?.env?.POSTGRES_USER || "",
    password: system?.env?.POSTGRES_PASSWORD || "",
    database: system?.env?.POSTGRES_DB || "",
    host: "localhost",
    port: 5432,
  });

  // NOTE: Kysely itself asserts that it's only a query builder and doesn't offer any documentation on error handling.
  // They note that all they do is pass on any errors
  // I've added this just so things don't slip away for now
  connectionPool.on("error", (err, client) => {
    console.log(`Postgres Error ${err.message}\n${err.stack}`);
  });

  return connectionPool;
};

const stopDatabase = (connectionPool?: Pool) => {
  connectionPool?.end();
};

const startServer = (system: System) => {
  const app = new Hono();

  app.use("*", cors());
  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.route("/health", healthRoutes(system));
  app.route("/auth", authRoutes(system));

  const server = Bun.serve<Hono>({
    port: system.env?.PORT !== undefined ? parseInt(system.env.PORT) : 3000,
    fetch: app.fetch,
  });

  // Graceful Shutdown Handling
  // See <https://github.com/orgs/honojs/discussions/3731>
  return server;
};

const stopServer = (server: Bun.Server<Hono>) => {
  return server.stop();
};

const startSystem = (): System => {
  let system: System = { env: process.env }; // NOTE: We must use `node --with-env-file` or `tsx --with-env--file`
  system = { db: startDatabase(system), ...system };
  system = { queryBuilder: startQueryBuilder(system), ...system };
  system = { server: startServer(system), ...system };
  console.log(system);
  return system;
};

const stopSystem = (system: System) => {
  const tasks = [];

  tasks.push(() => {
    if (system.db) {
      return Promise.resolve(stopDatabase(system.db));
    }
  });

  tasks.push(() => {
    if (system.server) {
      stopServer(system.server);
    }
  });

  return Promise.all(tasks);
};

export { startSystem, stopSystem, type System };
