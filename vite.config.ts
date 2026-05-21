import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      port: 5173, // Replace 3000 with your desired port number
      strictPort: true,
    }
  }
});