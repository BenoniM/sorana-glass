import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Prevent @cloudflare/vite-plugin from being auto-injected during builds.
  // Without this, any machine with the optional peer dep installed produces
  // Cloudflare Worker output instead of the Vercel-compatible bundle.
  cloudflare: false,
  tanstackStart: {
    server: {
      entry: "server",
      preset: "vercel",
    },
  },
  vite: {
    server: {
      port: 5173,
      strictPort: true,
    },
  },
});
