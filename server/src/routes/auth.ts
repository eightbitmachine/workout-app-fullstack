import { Hono, type Context } from "hono";

import type { System } from "../system.js";
import { authJWT, verifyPassword } from "../auth.js";
import { createCredential } from "../../../core/auth.js";
import { findUser } from "../db/users.js";

const loginHandler = async (system: System, c: Context) => {
  // TODO: Parse don't validate.
  // (Consider how hono's validation fits into this? See: https://hono.dev/docs/guides/validation )
  const formData = await c.req.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const credentialResult = createCredential(email, password);
  if (!credentialResult.ok) {
    c.status(400);
    return c.json({
      ok: false,
      error: credentialResult.error,
    });
  }

  const foundUserResult = await findUser(system.queryBuilder, { email });

  if (foundUserResult.error) {
    c.status(400);
    return c.json({ ok: false, error: foundUserResult.error });
  }

  if (!foundUserResult.error) {
    const user = foundUserResult.user;
    const isValidPassword = password
      ? await verifyPassword(user?.password_hash, password)
      : false;

    if (!isValidPassword) {
      c.status(403);
      return c.json({
        ok: false,
        // TODO: Probably shouldn't return a not found? Instead log it but be vague for security reasons?
        error: "USER_NOT_FOUND",
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
        id: user?.id, // TODO: Perhaps only put the ID in the token, not in the clear of the response
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
