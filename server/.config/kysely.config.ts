import {
  DummyDriver,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  PostgresDialect,
} from "kysely";

import { Pool } from "pg";
import { defineConfig } from "kysely-ctl";

// I don't know how to get the --with-env passed through with pnpm and kysely-ctl
process.loadEnvFile("../.env");

export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  // dialect: {
  // 	createAdapter() {
  // 		return new PostgresAdapter()
  // 	},
  // 	createDriver() {
  // 		return new DummyDriver()
  // 	},
  // 	createIntrospector(db) {
  // 		return new PostgresIntrospector(db)
  // 	},
  // 	createQueryCompiler() {
  // 		return new PostgresQueryCompiler()
  // 	},
  // },
  dialect: new PostgresDialect({
    pool: new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: "localhost",
      port: 5432,
    }),
  }),
  migrations: {
    migrationFolder: "../src/db/migrations",
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
