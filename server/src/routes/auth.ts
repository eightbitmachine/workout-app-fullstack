import { Hono, type Context } from "hono";
import type { System } from "../system.js";

const loginHandler = async (system: System, c: Context) => {
  const formData = await c.req.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const user = await system.db
    ?.withSchema(system?.env?.POSTGRES_DB || "")
    .selectFrom("users")
    .select(["id", "email", "type", "password_hash"])
    .where("email", "=", email)
    .executeTakeFirst();

  return c.json({
    ok: true,
    user: {
      id: user?.id,
      email: user?.email,
      type: user?.type,
    },
  });
};

const authRoutes = (system: System) => {
  const app = new Hono();

  app.post("/login", (c) => { return loginHandler(system, c); });

  return app;
};

export { authRoutes };
