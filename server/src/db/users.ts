import { Kysely } from "kysely";
import { type Database } from "./schema.js";
import type { DatabaseError } from "pg";

type UserType = "COACH" | "ATHLETE";

type User = {
  id: number;
  email: string;
  type: UserType;
  password_hash?: string;
};

// : Promise<{ok: false, error: Error} | { ok: true, user: User | undefined}>
const findUser = async (
  queryBuilder: Kysely<Database> | undefined,
  params: { id?: number; email?: string; type?: UserType },
) => {
  if (!queryBuilder) {
    return Promise.resolve({ ok: false, error: new Error("DB_NONE") });
  }

  if (!params.id && !params.email) {
    return Promise.resolve({ ok: false, error: new Error("PARAMS_NONE") });
  }

  let query = queryBuilder
    .withSchema("workout_db")
    .selectFrom("users")
    .select(["id", "email", "type", "password_hash"]);

  if (params.email) {
    query = query.where("email", "=", params.email);
  }

  if (params.id) {
    query = query.where("id", "=", params.id);
  }

  if (params.type !== undefined) {
    query = query.where((eb) =>
      eb.and([eb("type", "=", params.type as UserType)]),
    );
  }

  return query
    .executeTakeFirst()
    .then((result) => {
      return result
        ? { ok: true, user: result }
        : { ok: false, error: new Error("USER_NOT_FOUND") };
    })
    .catch((error: DatabaseError) => {
      return { ok: false, error: error };
    });
};

export { type UserType, type User, findUser };
