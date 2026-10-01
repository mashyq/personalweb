import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vercel serves the app from the domain root, so "/" is correct.
  // Change to "/your-repo/" only if you deploy under a sub-path.
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the React runtime in its own long-lived cache chunk.
        manualChunks(id) {
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "react";
          }
        },
      },
    },
  },
});