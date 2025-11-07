import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { type Database } from "./db/schema.js";

import type { Server } from "net";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";

type System = {
  env?: NodeJS.ProcessEnv;
  db?: Kysely<Database>;
  server?: Server;
};

const startDatabase = (system: System) => {
  const dialect = new PostgresDialect({
    pool: new Pool({
      user: system?.env?.POSTGRES_USER || "",
      password: system?.env?.POSTGRES_PASSWORD || "",
      database: system?.env?.POSTGRES_DB || "",
      host: "localhost",
      port: 5432,
    }),
  });

  const db = new Kysely<Database>({ dialect });

  return db;
};

const stopDatabase = (db: Kysely<Database> | null | undefined) => {
  db?.destroy();
};

const startServer = (system: System) => {
  const app = new Hono();

  app.use("*", cors());
  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.route("/health", healthRoutes(system));
  app.route("/auth", authRoutes(system));

  const server = serve(
    {
      fetch: app.fetch, // `fetch` is the entrypoint into a Hono app
      port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );

  server.addListener("close", () => {
    console.log("Closing the DB");
    stopDatabase(system.db);
  });

  return server;
};

const stopServer = (server: Server) => {
  server?.close();
};

const startSystem = (): System => {
  let system: System = { env: process.env }; // NOTE: We must use `node --with-env-file` or `tsx --with-env--file`
  system = { db: startDatabase(system), ...system };
  system = { server: startServer(system), ...system };
  console.log(system);
  return system;
};

const stopSystem = (system: System) => {
  if (system.db) {
    stopDatabase(system.db);
  }

  if (system.server) {
    stopServer(system.server);
  }
};

export { startSystem, stopSystem, type System };
