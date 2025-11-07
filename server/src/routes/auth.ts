import { Hono } from "hono";
import type { System } from "../system.js";

const authRoutes = (system: System) => {
  const app = new Hono();

  app.post("/login", async (c) => {
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
  });

  return app;
};

export { authRoutes };
