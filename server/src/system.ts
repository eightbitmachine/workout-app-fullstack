import type { Server } from "net";

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { type Database } from "./db/schema.js";

import { serve } from "@hono/node-server";

import type { System } from "./types.js";
import { app } from "./app.js";

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
  console.log("Stopping Query Builder...");
  return queryBuilder?.destroy();
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
  console.log("Stopping database...");
  return connectionPool?.end();
};

const startServer = (system: System) => {
  const server = serve(
    {
      fetch: app(system).fetch, // `fetch` is the entrypoint into a Hono app
      port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );

  return server;
};

const stopServer = (server: Server) => {
  console.log("Stopping HTTP server...");
  const closePromise = new Promise<Server>((resolve) => {
    server.on("close", resolve);
    server?.close();
  });

  return closePromise.then((server) => {
    console.log("Server closed...");
    return server;
  });
};

const startSystem = (): System => {
  let system: System = { env: process.env }; // NOTE: We must use `node --with-env-file` or `tsx --with-env--file`
  system = { db: startDatabase(system), ...system };
  system = { queryBuilder: startQueryBuilder(system), ...system };
  system = { server: startServer(system), ...system };
  return system;
};

const stopSystem = (system: System) => {
  return (system.server ? stopServer(system.server) : Promise.resolve(() => {}))
    .then(() => stopQueryBuilder(system.queryBuilder))
    .then(() => stopDatabase(system.db));
};

export { startSystem, stopSystem, type System };
