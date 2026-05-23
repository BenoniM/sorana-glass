import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { 
      entry: "server",
      preset: "vercel" // Tells the underlying Nitro/Vinxi engine to build for Vercel Functions
    },
  },
  vite: {
    server: {
      port: 5173,
      strictPort: true,
    }
  }
});