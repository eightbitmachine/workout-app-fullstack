import { Hono, type Context } from "hono";

import type { System } from "../system.js";
import { findUser } from "../db/users.js";
import { authJWT, verifyPassword } from "../auth.js";

const loginHandler = async (system: System, c: Context) => {
  // TODO: Parse don't validate.
  // (Consider how hono's validation fits into this? See: https://hono.dev/docs/guides/validation )
  const formData = await c.req.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email && !password) {
    c.status(400);
    return c.json({
      ok: false,
      error: "NO_CREDENTIALS",
    });
  }

  const foundUserResult = await findUser(system.db, { email });

  if (foundUserResult.error) {
    c.status(400);
    return c.json({ ok: false, error: foundUserResult.error });
  }

  if (!foundUserResult.error) {
    const user = foundUserResult.user;
    const isValidPassword = password
      ? await verifyPassword(user?.password_hash, password)
      : Promise.resolve(false);

    if (!isValidPassword) {
      c.status(401);
      return c.json({
        ok: false,
        error: "",
      });
    }

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
      // TODO: The `token` should be saved to session or local storage in the client
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
