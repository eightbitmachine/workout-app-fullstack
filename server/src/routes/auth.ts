import { Hono, type Context } from "hono";

import type { System } from "../system.js";
import { findUser } from "../db/users.js";
import { authJWT, verifyPassword } from "../auth.js";

const loginHandler = async (system: System, c: Context) => {
  const formData = await c.req.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const foundUserResult = await findUser(system.db, { email });

  if (!foundUserResult.error) {
    const user = foundUserResult.user;
    const isValidPassword = password
      ? await verifyPassword(user?.password_hash, password)
      : Promise.resolve(false);

    const token = await authJWT(system.env?.JWT_SECRET || "", {
      id: user.id,
      email: user.email,
      type: user.type,
    });

    return c.json({
      ok: true,
      user: {
        id: user?.id,
        email: user?.email,
        type: user?.type,
      },
      isValid: isValidPassword,
      token,
    });
  }
};

const authRoutes = (system: System) => {
  const app = new Hono();

  app.post("/login", (c) => {
    return loginHandler(system, c);
  });

  return app;
};

export { authRoutes };
