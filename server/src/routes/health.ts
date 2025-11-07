import { Hono } from "hono";
import type { System } from "../system.js";

const healthRoutes = (system: System) => {
  const app = new Hono();

  app.get("/", (c) => {
    return c.json({ status: "ok", env: system.env });
  });

  return app;
};

export { healthRoutes }

