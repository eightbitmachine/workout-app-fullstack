import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import health from "./health.js";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/health", health);

serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
