import { startSystem } from "./system.js";

const system = startSystem();

export default {
  port: system.env?.PORT,
  fetch: system.server?.fetch,
};
