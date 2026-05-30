import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    fresh({
      // This skips crons in dev mode
      serverEntry: mode == "serve" ? "./src/main.server.ts" : "./src/main.ts",
      clientEntry: "./src/client.ts",
      islandsDir: "./src/islands/",
      routeDir: "./src/routes/",
    }),
    tailwindcss(),
  ],
}));
