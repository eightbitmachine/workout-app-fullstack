import type {
  ColumnType,
  Generated,
  Selectable,
  Insertable,
  Updateable,
} from "kysely";

// NOTE: See Kysely docs on creating types <https://kysely.dev/docs/getting-started#types> 

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  id: Generated<number>;
  email: string;
  password_hash: string;
  type: "COACH" | "ATHLETE";
  created_at: ColumnType<Date, never, never>;
  modified_at: ColumnType<Date, Date, Date>;
  deleted_at: ColumnType<Date | null, Date, Date | null>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

// NOTE: Types can be generated via codegen by instrospecting the DB using
// third-party tools like `kysely-codegen`. 
// See <https://kysely.dev/docs/generating-types>
