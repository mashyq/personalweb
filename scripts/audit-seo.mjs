/**
 * Crawl-style SEO audit over the built output in ./dist.
 *
 * Verifies the things that actually break indexing — metadata presence and
 * shape, heading hierarchy, broken internal anchors, duplicate ids, valid
 * JSON-LD, indexability of the 404 page, robots.txt and sitemap.xml syntax.
 *
 * Run with: npm run audit:seo   (runs automatically after `npm run build`)
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");

const failures = [];
const warnings = [];
const passes = [];

const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);
const pass = (msg) => passes.push(msg);

const read = (file) => {
  const path = join(DIST, file);
  if (!existsSync(path)) {
    fail(`missing file: ${file}`);
    return "";
  }
  return readFileSync(path, "utf8");
};

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`));
  return match ? match[1] : null;
};

const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || [];

const indexHtml = read("index.html");

// ------------------------------------------------------------------ presence
if (!indexHtml) {
  console.error("dist/index.html missing — run `npm run build` first.");
  process.exit(1);
}

// ------------------------------------------------------------------- metadata
const title = indexHtml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
if (!title) fail("no <title>");
else if (title.length > 65) warn(`title is ${title.length} chars (>65 may truncate in SERPs)`);
else pass(`title (${title.length} chars)`);

const description = indexHtml.match(
  /<meta\s+name="description"\s+content="([^"]*)"/,
)?.[1];
if (!description) fail("no meta description");
else if (description.length > 165)
  warn(`meta description is ${description.length} chars (>165 may truncate)`);
else pass(`meta description (${description.length} chars)`);

const canonical = indexHtml.match(
  /<link\s+rel="canonical"\s+href="([^"]*)"/,
)?.[1];
if (!canonical) fail("no canonical URL");
else if (!canonical.startsWith("https://")) fail(`canonical is not HTTPS: ${canonical}`);
else pass(`canonical (${canonical})`);

const robotsMeta = indexHtml.match(
  /<meta\s+name="robots"\s+content="([^"]*)"/,
)?.[1];
if (!robotsMeta) fail("no robots meta tag");
else if (/noindex/.test(robotsMeta)) fail("index page is marked noindex");
else pass(`robots meta (${robotsMeta})`);

for (const property of ["og:type", "og:title", "og:description", "og:url", "og:image"]) {
  const found = indexHtml.match(
    new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]*)"`),
  )?.[1];
  if (!found) fail(`missing ${property}`);
  else if (/^https?:\/\//.test(property === "og:type" ? "x" : "y") && !/^https:\/\//.test(found))
    fail(`${property} is not an absolute HTTPS URL: ${found}`);
}
for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
  if (!new RegExp(`<meta\\s+name="${name}"\\s+content=`).test(indexHtml))
    fail(`missing ${name}`);
}
pass("Open Graph + Twitter card tags present");

// ------------------------------------------------------------------- headings
const h1s = tags(indexHtml, "h1");
if (h1s.length === 0) fail("no <h1>");
else if (h1s.length > 1) fail(`${h1s.length} <h1> elements (expected exactly 1)`);
else pass("exactly one <h1>");

const levels = tags(indexHtml, "h[1-6]")
  .map((tag) => Number(tag.match(/<h([1-6])/)[1]))
  .filter((level) => !Number.isNaN(level));

let skips = 0;
for (let i = 1; i < levels.length; i += 1) {
  if (levels[i] - levels[i - 1] > 1) skips += 1;
}
if (skips) fail(`${skips} heading level jump(s) (e.g. h2 -> h4)`);
else pass(`heading hierarchy clean (${levels.length} headings, h1-h${Math.max(...levels)})`);

// ----------------------------------------------------- duplicate ids, anchors
const idMatches = indexHtml.match(/\sid="([^"]+)"/g) || [];
const ids = idMatches.map((raw) => raw.slice(5, -1));
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicates.length)
  fail(`duplicate id attribute(s): ${[...new Set(duplicates)].join(", ")}`);
else pass(`no duplicate ids (${ids.length} total)`);

const anchors = [...indexHtml.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
const broken = [...new Set(anchors)].filter((id) => !ids.includes(id));
if (broken.length) fail(`internal links pointing at missing ids: ${broken.join(", ")}`);
else pass(`all ${new Set(anchors).size} internal anchor targets resolve`);

// ------------------------------------------------------------------ JSON-LD
const ldBlocks = [
  ...indexHtml.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ),
].map((m) => m[1]);

if (!ldBlocks.length) fail("no JSON-LD structured data");
else {
  for (const block of ldBlocks) {
    try {
      const parsed = JSON.parse(block);
      const graph = parsed["@graph"] || [parsed];
      const types = graph.map((n) => n["@type"]).filter(Boolean);
      if (!types.includes("ProfessionalService") && !types.includes("LocalBusiness"))
        warn("no ProfessionalService/LocalBusiness node in JSON-LD");
      if (!types.includes("FAQPage")) warn("no FAQPage node in JSON-LD");
      if (!types.includes("WebSite")) warn("no WebSite node in JSON-LD");
      pass(`JSON-LD valid — ${types.join(", ")}`);
    } catch (error) {
      fail(`invalid JSON-LD: ${error.message}`);
    }
  }
}

// --------------------------------------------------------------- image alts
const imgTags = tags(indexHtml, "img");
const missingAlt = imgTags.filter((tag) => !/\salt="/.test(tag));
if (missingAlt.length)
  warn(`${missingAlt.length} <img> without alt (inline SVG icons should stay aria-hidden)`);
else pass(`${imgTags.length} <img> element(s), all with alt`);

// --------------------------------------------------------------- robots.txt
const robots = read("robots.txt");
if (robots) {
  if (!/^User-agent:\s*\*/m.test(robots)) fail("robots.txt missing 'User-agent: *'");
  if (/Disallow:\s*\/\s*$/m.test(robots) && !/Allow: \//.test(robots))
    fail("robots.txt blocks the whole site");
  if (!/Sitemap:\s*https:\/\//.test(robots)) fail("robots.txt has no absolute HTTPS Sitemap");
  if (/Disallow:\s*\/assets/i.test(robots)) fail("robots.txt blocks /assets");
  pass("robots.txt valid and references the sitemap");
}

const sitemap = read("sitemap.xml");
if (sitemap) {
  if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
    fail("sitemap.xml missing XML declaration");
  if (!/<urlset[^>]+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap))
    fail("sitemap.xml missing or wrong xmlns");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) fail("sitemap.xml has no <loc> entries");
  const insecure = locs.filter((l) => !l.startsWith("https://"));
  if (insecure.length) fail(`sitemap.xml has non-HTTPS URLs: ${insecure.join(", ")}`);
  const dupe = locs.filter((l, i) => locs.indexOf(l) !== i);
  if (dupe.length) fail(`sitemap.xml has duplicate URLs: ${dupe.join(", ")}`);
  pass(`sitemap.xml valid — ${locs.length} URL(s)`);
}

// ------------------------------------------------------------------- 404 page
const notFound = read("404.html");
if (notFound) {
  if (!/name="robots"[^>]*content="noindex/.test(notFound))
    fail("404.html is missing a noindex directive");
  const nfAnchors = [...notFound.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  if (nfAnchors.length)
    fail(`404.html links to non-existent anchors: ${nfAnchors.join(", ")}`);
  pass("404.html is noindex with no broken anchors");
}

// ----------------------------------------------------------------- leftovers
if (indexHtml.includes("<!--@seo-->")) fail("unreplaced <!--@seo--> marker in output");

// --------------------------------------------------------------------- report
const divider = "-".repeat(46);
console.log(`\n  SEO AUDIT\n  ${divider}`);
for (const item of passes) console.log(`  pass    ${item}`);
for (const item of warnings) console.log(`  warn    ${item}`);
for (const item of failures) console.log(`  FAIL    ${item}`);
console.log(
  `  ${divider}\n  ${passes.length} passed, ${warnings.length} warnings, ${failures.length} failed\n`,
);

if (failures.length) process.exit(1);