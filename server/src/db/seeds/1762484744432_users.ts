import { Kysely, sql } from "kysely";
import { type Database } from "../schema.js";
import { hashPassword } from "../../auth.js";

process.loadEnvFile("../.env");
// When using kysely-ctl, it will be from the root of the `server` directory, so only one level up

// replace `any` with your database interface.
export async function seed(db: Kysely<Database>): Promise<void> {
  // seed code goes here...
  // note: this function is mandatory. you must implement this function.
  await db
    .withSchema(process.env.POSTGRES_DB || "")
    .insertInto("users")
    .values([
      {
        email: "coach@example.com",
        password_hash: await hashPassword("coach-123"),
        type: "COACH",
        modified_at: new Date(),
        deleted_at: sql`NULL`,
      },
      {
        email: "athlete@example.com",
        password_hash: await hashPassword("athelete-987"),
        type: "ATHLETE",
        modified_at: new Date(),
        deleted_at: sql`NULL`,
      },
    ])
    .execute();
}
