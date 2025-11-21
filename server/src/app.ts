import { Hono } from "hono";
import { jwt, type JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";

import type { System } from "./types.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";

export function app(system: System) {
  const app = new Hono<{ Variables: JwtVariables }>();

  app.use("*", cors());
  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.route("/health", healthRoutes(system));
  app.route("/auth", authRoutes(system));

  app.use(
    "/programs/*",
    jwt({
      secret: system.env.JWT_SECRET as string,
    }),
  );

  app.get("/programs", (c) => {
    return c.json({ programs: [] });
  });

  return app;
}
