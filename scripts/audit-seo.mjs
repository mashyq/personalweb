/**
 * Crawl-style SEO audit over the built output in ./dist.
 *
 * Verifies the things that actually break indexing — metadata presence and
 * shape, heading hierarchy, broken internal anchors, duplicate ids, valid
 * JSON-LD, indexability of the 404 page, robots.txt and sitemap.xml syntax.
 *
 * Run with: npm run audit:seo   (runs automatically after `npm run build`)
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

/**
 * A local `npm run build` has no production origin yet, so it uses the
 * localhost sentinel from scripts/resolve-site-url.mjs. Origin-dependent rules
 * (HTTPS, host consistency, placeholder domains) are downgraded to warnings in
 * that case; a real build — the only kind Vercel ever produces — stays strict.
 */
const isLocalBuild = !canonical || /^https?:\/\/(localhost|127\.0\.0\.1)/.test(canonical);
const originFail = (msg) => (isLocalBuild ? warn(`[local build] ${msg}`) : fail(msg));

if (!canonical) fail("no canonical URL");
else if (!canonical.startsWith("https://")) originFail(`canonical is not HTTPS: ${canonical}`);
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
  else if (property === "og:url" && canonical && found !== canonical)
    fail(`og:url (${found}) does not match canonical (${canonical})`);
  else if (["og:url", "og:image"].includes(property) && !found.startsWith("https://"))
    originFail(`${property} is not an absolute HTTPS URL: ${found}`);
}
for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
  if (!new RegExp(`<meta\\s+name="${name}"\\s+content=`).test(indexHtml))
    fail(`missing ${name}`);
}
pass("Open Graph + Twitter card tags present");

// ------------------------------------------------------------- mobile / i18n
const viewport = indexHtml.match(/<meta\s+name="viewport"\s+content="([^"]*)"/)?.[1];
if (!viewport) fail("no viewport meta tag (site would not be mobile friendly)");
else if (!/width=device-width/.test(viewport))
  fail(`viewport is missing width=device-width: "${viewport}"`);
else pass(`mobile viewport declared (${viewport})`);

const lang = indexHtml.match(/<html[^>]*\slang="([^"]*)"/)?.[1];
if (!lang) fail("<html> has no lang attribute");
else pass(`html lang declared (${lang})`);

if (!/<link\s+rel="sitemap"/.test(indexHtml)) fail("no <link rel=\"sitemap\"> discovery tag");
else pass("<link rel=\"sitemap\"> present");

// ---------------------------------------------- Search Console verification tag
const googleVerification = indexHtml.match(
  /<meta\s+name="google-site-verification"\s+content="([^"]+)"/,
)?.[1];
if (!googleVerification)
  warn("no google-site-verification meta tag: Search Console HTML-tag verification will fail");
else if (!/^[A-Za-z0-9_-]{10,}$/.test(googleVerification))
  fail(`google-site-verification token looks malformed: "${googleVerification}"`);
else pass(`google-site-verification tag present (${googleVerification.length} chars)`);

// ------------------------- Search Console HTML-file verification (public/*.html)
// Google serves a file at the site root whose body is
// "google-site-verification: <filename>.html". It must be copied verbatim from
// public/ into the build output, or the verification method silently fails.
const publicDir = join(process.cwd(), "public");
const htmlVerificationFiles = existsSync(publicDir)
  ? readdirSync(publicDir).filter((file) => /^google.*\.html$/.test(file))
  : [];
if (htmlVerificationFiles.length) {
  for (const file of htmlVerificationFiles) {
    if (!existsSync(join(DIST, file))) {
      fail(
        `Search Console verification file public/${file} is missing from the build output ` +
          "— HTML-file verification will fail",
      );
    } else {
      const built = readFileSync(join(DIST, file), "utf8");
      if (!built.includes(file))
        warn(`dist/${file} does not reference its own filename, which Google expects`);
      else pass(`Search Console HTML-file verification served at /${file}`);
    }
  }
}

// --------------------------------------------------- https / origin consistency
const insecureAbsolutes = [
  ...new Set(
    [...indexHtml.matchAll(/(?:href|content)="(http:\/\/[^"]+)"/g)].map((m) => m[1]),
  ),
].filter((url) => !url.startsWith("http://localhost"));
if (insecureAbsolutes.length)
  fail(`insecure absolute URLs in HTML: ${insecureAbsolutes.join(", ")}`);
else pass("all absolute URLs use HTTPS");

const canonicalHost = canonical ? new URL(canonical).host : "";

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
  if (!/Sitemap:\s*https:\/\//.test(robots)) originFail("robots.txt has no absolute HTTPS Sitemap");
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
  if (insecure.length) originFail(`sitemap.xml has non-HTTPS URLs: ${insecure.join(", ")}`);
  const dupe = locs.filter((l, i) => locs.indexOf(l) !== i);
  if (dupe.length) fail(`sitemap.xml has duplicate URLs: ${dupe.join(", ")}`);
  if (canonicalHost) {
    const wrongHost = locs.filter((l) => new URL(l).host !== canonicalHost);
    if (wrongHost.length)
      originFail(`sitemap.xml URLs do not use the canonical host "${canonicalHost}": ${wrongHost.join(", ")}`);
    else pass(`all sitemap URLs use the canonical host (${canonicalHost})`);
  }
  if (/404\.html|\?/.test(locs.join(" ")))
    fail("sitemap.xml contains a 404 or parameterised URL, which must be excluded");
  else pass("sitemap.xml excludes noindex/404 and parameterised URLs");
  if (!locs.includes(canonical) && canonical)
    originFail(`sitemap.xml does not list the homepage canonical ${canonical}`);
  const lastmod = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (!lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod))
    fail(`sitemap.xml has an invalid lastmod: ${lastmod}`);
  pass(`sitemap.xml valid — ${locs.length} URL(s)`);
}

// ------------------------------------------------- cross-document consistency
const notFoundHtml = read("404.html");
const nfTitle = notFoundHtml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
const nfDescription = notFoundHtml.match(
  /<meta\s+name="description"\s+content="([^"]*)"/,
)?.[1];

if (nfTitle && nfTitle === title) fail("index.html and 404.html share the same <title>");
else if (nfTitle) pass(`every document has a unique <title> (404: "${nfTitle}")`);
if (nfDescription && nfDescription === description)
  fail("index.html and 404.html share the same meta description");
else if (nfDescription) pass("every document has a unique meta description");

const robotsSitemap = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
if (canonical && robotsSitemap !== `${canonical.replace(/\/$/, "")}/sitemap.xml`)
  fail(`robots.txt sitemap reference (${robotsSitemap}) does not match the canonical origin`);
else if (canonical) pass("robots.txt sitemap reference matches the canonical origin");

if (canonical && /404\.html/.test(robotsSitemap || "")) fail("robots.txt points at a 404 page");

// ------------------------------------------------------ placeholders / secrets
// Only a placeholder *hostname* in URL position counts. A form
// placeholder="you@example.com" is a legitimate email example, not a leak.
const placeholderUrlPatterns = [
  /https?:\/\/(?:www\.)?example\.(?:com|org)\b/i,
  /https?:\/\/your-domain\.com/i,
  /https?:\/\/your-project\.vercel\.app/i,
  /https?:\/\/localhost:5173/i,
  /\/\/mashyq\.github\.io/i,
];
const htmlSources = { "index.html": indexHtml, "404.html": notFoundHtml, "robots.txt": robots, "sitemap.xml": sitemap };
let placeholderLeak = null;
for (const [name, html] of Object.entries(htmlSources)) {
  if (!html) continue;
  const hit = placeholderUrlPatterns.find((pattern) => pattern.test(html));
  if (hit) placeholderLeak = `${name} contains ${hit}`;
}
if (placeholderLeak) originFail(`placeholder domain leaked into the build: ${placeholderLeak}`);
else pass("no placeholder domains in build output");

if (!canonical || canonical.startsWith("http://localhost"))
  warn(`canonical is the local sentinel (${canonical}). Set VITE_SITE_URL before deploying.`);

const secretPatterns = [
  /AIza[0-9A-Za-z_-]{35}/,
  /sk-[A-Za-z0-9]{20,}/,
  /ghp_[A-Za-z0-9]{36}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];
const scanned = [indexHtml, notFoundHtml].filter(Boolean).join("\n");
const leaked = secretPatterns.filter((pattern) => pattern.test(scanned));
if (leaked.length) fail(`possible secret material in the HTML (${leaked.length} pattern(s))`);
else pass("no API keys or secrets in the HTML output");

// ------------------------------------------------------ vercel deploy config
const vercelConfigPath = join(process.cwd(), "vercel.json");
if (existsSync(vercelConfigPath)) {
  let config = null;
  try {
    config = JSON.parse(readFileSync(vercelConfigPath, "utf8"));
    pass("vercel.json is valid JSON");
  } catch (error) {
    fail(`vercel.json is invalid JSON: ${error.message}`);
  }
  if (config) {
    const unknown = Object.keys(config).filter(
      (key) => key.startsWith("//") || key.startsWith("#"),
    );
    if (unknown.length)
      fail(`vercel.json has comment key(s) Vercel rejects: ${unknown.join(", ")}`);
    else pass("vercel.json has no comment keys");

    if (config.rewrites?.length)
      fail("vercel.json has a catch-all rewrite, which turns 404s into soft-200 responses");
    else pass("no catch-all rewrite, so unknown paths return a real 404");

    if (config.outputDirectory !== "dist")
      warn(`vercel.json outputDirectory is "${config.outputDirectory}" (expected "dist")`);
    if (!config.buildCommand) fail("vercel.json has no buildCommand");

    // cleanUrls 308-redirects /file.html -> /file, which breaks the exact
    // filename Google's HTML-file verification expects. The site uses hash
    // anchors and has no extensionless routes, so cleanUrls buys nothing.
    if (config.cleanUrls && htmlVerificationFiles.length)
      fail(
        "vercel.json enables cleanUrls, which 308-redirects the Search Console " +
          `verification file public/${htmlVerificationFiles[0]} and breaks that method`,
      );
    else pass("cleanUrls does not interfere with verification files");
  }
}

// ------------------------------------------- reachability of important content
const navTargets = [...new Set([...indexHtml.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))];
const unreachable = ids.filter(
  (id) => /^(home|about|services|process|work|testimonials|pricing|faq|contact)$/.test(id) &&
    !navTargets.includes(id),
);
if (unreachable.length)
  fail(`key section(s) exist but are not linked internally: ${unreachable.join(", ")}`);
else pass("all key sections are reachable through internal links");

// ------------------------------------------------------------------- 404 page
if (notFoundHtml) {
  if (!/name="robots"[^>]*content="noindex/.test(notFoundHtml))
    fail("404.html is missing a noindex directive");
  const nfAnchors = [...notFoundHtml.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  if (nfAnchors.length)
    fail(`404.html links to non-existent anchors: ${nfAnchors.join(", ")}`);
  if (sitemap.includes("404.html")) fail("404.html is listed in the sitemap");
  pass("404.html is noindex, has no broken anchors, and is excluded from the sitemap");
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