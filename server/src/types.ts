import type { Server } from "net";

import type { Pool } from "pg";
import type { Kysely } from "kysely";

import type { Database } from "./db/schema.js";

export type System = {
  env: NodeJS.ProcessEnv;
  db?: Pool;
  queryBuilder?: Kysely<Database>;
  server?: Server;
};
