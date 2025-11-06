import { Kysely } from "kysely";
import type { Database } from "../schema.js";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.createSchema("workout_db").execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropSchema("workout_db").execute();
}
