import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api/proxy": {
        target: "http://18.140.140.211:5550/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, ""),
      },
    },
  },
});
