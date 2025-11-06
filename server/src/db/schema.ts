import { type ColumnType, type Generated } from "kysely";

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
