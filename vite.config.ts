import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    fresh({
      serverEntry: "./src/main.ts",
      clientEntry: "./src/client.ts",
      islandsDir: "./src/islands/",
      routeDir: "./src/routes/",
    }),
    tailwindcss(),
  ],
  ssr: {
    // skip SSR for this file
    external: ["./src/crons.ts", "./src/main.ts"],
  },
});
