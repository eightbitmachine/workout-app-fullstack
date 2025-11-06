import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { type Database } from "./db/schema.js";

const createPostgresDialect = (
  user: string,
  password: string,
  database: string,
) => {
  console.log({ user, password, database });

  return new PostgresDialect({
    pool: new Pool({
      user,
      password,
      database,
      host: "localhost",
      port: 5432,
    }),
  });
};

const startDatabase = (env: NodeJS.Process["env"]) =>
  new Kysely<Database>({
    dialect: createPostgresDialect(
      env.POSTGRES_USER || "",
      env.POSTGRES_PASSWORD || "",
      env.POSTGRES_DB || "",
    ),
  });

const stopDatabase = (db: Kysely<Database> | null | undefined) => {
  db?.destroy();
};

type System = {
  db?: Kysely<Database>;
};

const startSystem = (): System => {
  let system = {};
  system = { db: startDatabase(process.env), ...system };

  return system;
};

const stopSystem = (system: System) => {
  if (system.db) {
    stopDatabase(system.db);
  }
};

export { startSystem, stopSystem };
