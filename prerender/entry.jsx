/**
 * Build-time prerenderer.
 *
 * Runs after `vite build` and:
 *   1. Renders the React app to static HTML and injects it into dist/index.html
 *      so all content and internal links are present in the initial response
 *      (the site is a SPA, but crawlers and no-JS visitors still get everything).
 *   2. Regenerates the <head> block — title, description, canonical, Open
 *      Graph, Twitter cards, JSON-LD and any verification tags — from
 *      src/lib/seo.js so metadata can't drift between environments.
 *   3. Writes dist/robots.txt and dist/sitemap.xml for the configured origin.
 *   4. Writes dist/404.html, a branded noindex error page.
 *
 * React re-renders the same tree on the client via createRoot, so no hydration
 * step is needed and no server/client markup mismatch can occur.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToString } from "react-dom/server";
import App from "../src/App.jsx";
import NotFound from "../src/pages/NotFound.jsx";
import {
  INDEXABLE_URLS,
  SITE,
  SITE_URL,
  SITE_URL_IS_PRODUCTION,
  SITE_URL_SOURCE,
  absolute,
  renderHead,
  renderRobots,
  renderSitemap,
} from "../src/lib/seo.js";

const DIST = join(process.cwd(), "dist");

const SEO_BLOCK = /<!--@seo-->[\s\S]*?<!--\/@seo-->/;

/** Swap the generated <head> block and root markup into an HTML document. */
function buildDocument(template, { head, body, rootId = "root" }) {
  return template
    .replace(SEO_BLOCK, head.trim())
    .replace(`<div id="${rootId}"></div>`, `<div id="${rootId}">${body}</div>`);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const warnings = [];

if (!SITE_URL_IS_PRODUCTION) {
  warnings.push(
    `Site origin is the local sentinel "${SITE_URL}". This build is fine for ` +
      "local testing but must never be deployed: on Vercel the real domain is " +
      "detected automatically via VERCEL_PROJECT_PRODUCTION_URL.",
  );
}

// ---------------------------------------------------------------- index.html
const template = readFileSync(join(DIST, "index.html"), "utf8");

const appHtml = renderToString(<App />);
const indexDoc = buildDocument(template, {
  head: renderHead({ canonical: SITE_URL }),
  body: appHtml,
});
writeFileSync(join(DIST, "index.html"), indexDoc, "utf8");

// ------------------------------------------------------------------ 404.html
const notFoundHtml = renderToString(<NotFound />);
writeFileSync(
  join(DIST, "404.html"),
  buildDocument(template, {
    head: renderHead({
      canonical: `${SITE_URL}/404.html`,
      title: `Page not found — ${SITE.name}`,
      description: `The page you were looking for isn't available. Return to the ${SITE.name} homepage or contact me directly.`,
      noindex: true,
    }),
    body: notFoundHtml,
  }),
  "utf8",
);

// ------------------------------------------------------------- robots + sitemap
writeFileSync(join(DIST, "robots.txt"), renderRobots(), "utf8");
writeFileSync(
  join(DIST, "sitemap.xml"),
  renderSitemap({ lastmod: today() }),
  "utf8",
);

// ---------------------------------------------------------------------- report
console.log("\n  Prerendered:");
console.log(`    canonical   ${SITE_URL}  (source: ${SITE_URL_SOURCE})`);
console.log(`    index.html  ${(appHtml.length / 1024).toFixed(1)} kB of markup`);
console.log(`    404.html    ${(notFoundHtml.length / 1024).toFixed(1)} kB (noindex, excluded from sitemap)`);
console.log(`    robots.txt  ${absolute("/robots.txt")}`);
console.log(`    sitemap.xml ${absolute("/sitemap.xml")}`);
console.log(`    indexable   ${INDEXABLE_URLS.length} page(s)`);

warnings.forEach((warning) => console.warn(`\n  warning: ${warning}`));
console.log("");