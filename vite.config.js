import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolveSiteUrl } from "./scripts/resolve-site-url.mjs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env values first so a real process env (Vercel) always wins.
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const site = resolveSiteUrl(env);

  return {
    plugins: [react(), tailwindcss()],
    // Vercel serves the app from the domain root, so "/" is correct.
    // Change to "/your-repo/" only if you deploy under a sub-path.
    base: "/",
    // Baked into the client and SSR bundles so the canonical origin can never
    // drift between the prerendered HTML and the running app.
    define: {
      __SITE_URL__: JSON.stringify(site.url),
      __SITE_URL_SOURCE__: JSON.stringify(site.source),
      __SITE_URL_IS_PRODUCTION__: JSON.stringify(site.isProduction),
    },
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
  };
});
