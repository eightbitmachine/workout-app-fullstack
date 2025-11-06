import { Kysely, sql } from "kysely";
import type { Database } from "../schema.js";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .withSchema("workout_db")
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    // Email addresses can be up to 320 characters in length but in practice,
    // they are usuall constrained to 254
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("password_hash", "text", (col) => col.notNull())
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("modified_at", "timestamptz", (col) => col.defaultTo(sql`NULL`))
    .addColumn("deleted_at", "timestamptz", (col) => col.defaultTo(sql`NULL`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.withSchema("workout_db").dropTable("users").execute();
}
