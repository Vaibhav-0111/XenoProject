import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Self-contained Vite config (no external Lovable plugin).
// tanstackStart() already bundles the TanStack Router code-generation plugin
// (routeTree.gen.ts) and SSR server entry handling.
// nitro() is required for production deployment to serverless platforms.
export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "src/server.ts" },
    }),
    nitro({
      preset: "vercel",
    }),
    viteReact(),
  ],
  server: {
    host: true,
  },
});
