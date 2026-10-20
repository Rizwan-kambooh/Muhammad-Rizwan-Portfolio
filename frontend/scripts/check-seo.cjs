const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const origin = "https://muhammad-rizwan-portfolio-xi.vercel.app";
const build = path.resolve(__dirname, "../build");
const read = name => fs.readFileSync(path.join(build, name), "utf8");
const html = read("index.html");
const robots = read("robots.txt");
const sitemap = read("sitemap.xml");

assert(!/yourportfolio\.com|%PUBLIC_URL%/.test(html + robots + sitemap), "SEO output contains a placeholder URL.");
assert(html.includes(`rel="canonical" href="${origin}/"`), "Canonical URL must match the production homepage.");
assert(/<title>Muhammad Rizwan/.test(html), "Page title must identify the developer.");
assert(/name="description" content="[^"]{80,180}"/.test(html), "Provide a descriptive search snippet.");
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt must reference the production sitemap.");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(locations, [origin + "/"], "The one-page site must have one real URL, without fragment URLs.");
const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(json, "Structured data is missing.");
const graph = JSON.parse(json[1])["@graph"];
const person = graph.find(item => item["@type"] === "Person");
assert.equal(person.name, "Muhammad Rizwan");
assert.equal(person.url, origin + "/");
assert.equal(graph.find(item => item["@type"] === "ProfilePage").mainEntity["@id"], person["@id"]);
for (const asset of ["brand-mark.svg", "profile.jpeg", "Muhammad_Rizwan_CV.pdf"]) {
  assert(fs.existsSync(path.join(build, asset)), `Missing public asset: ${asset}`);
}
const hosting = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../vercel.json"), "utf8"));
assert(hosting.headers.some(rule => rule.source === "/admin-login" && rule.headers.some(header => header.key === "X-Robots-Tag" && header.value.includes("noindex"))), "The admin route must not be indexed.");
console.log("SEO checks passed: canonical, metadata, structured data, sitemap, robots, public assets, and admin noindex.");
