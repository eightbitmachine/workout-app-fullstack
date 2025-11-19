import { startSystem, stopSystem } from "./system.js";

const system = startSystem();

process.once("SIGINT", async () => {
  console.log("Shutdown Event");

  stopSystem(system).then(() => {
    console.log("Shutdown done");
    process.exit(0);
  });
});

export default system.server;
