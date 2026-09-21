import { chromium } from "playwright-core";

const BASE = process.env.DEV_URL || "http://localhost:5199";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`); };

const items = [{ code: "EN 843 402", name: "Image Processing and Computer Vision", credits: "3(3-0-6)" }];
let saves = 0;
await page.route("**/api/content?type=courses*", (route) => {
  if (route.request().method() === "GET") return route.fulfill({ json: { items, simulated: false } });
  saves++;
  // First save: rebuild fails. Second: succeeds.
  const kb = saves === 1 ? { ok: false, error: "site_staff select 500" } : { ok: true, upserted: 119, deleted: 0 };
  return route.fulfill({ status: 200, json: { item: items[0], simulated: false, kb } });
});
let retries = 0;
await page.route("**/api/admin/rebuild-kb", (route) => { retries++; return route.fulfill({ json: { upserted: 119, deleted: 0 } }); });

for (let i = 0; i < 20; i++) { try { await page.goto(BASE + "/admin", { waitUntil: "networkidle" }); break; } catch { await page.waitForTimeout(500); } }
await page.getByPlaceholder("Email").fill("admin@dme.kku.ac.th");
await page.getByPlaceholder("Password").fill("demo1234");
await page.getByRole("button", { name: "Log in" }).click();
await page.waitForURL("**/admin/dashboard");

check("Rebuild banner is gone", (await page.getByRole("button", { name: "Rebuild chatbot knowledge" }).count()) === 0);

await page.getByRole("button", { name: "Courses" }).click();
await page.getByRole("button", { name: "Edit" }).first().click();
await page.getByRole("button", { name: "Save changes" }).click();
await page.getByText("Saved, but the chatbot could not update").waitFor();
check("failed rebuild shows amber warning with cause", await page.getByText("(site_staff select 500)").isVisible());
await page.getByRole("button", { name: "Retry" }).click();
await page.getByText("The chatbot is updated.").waitFor();
check("Retry calls rebuild-kb and confirms", retries === 1);

await page.getByRole("button", { name: "Edit" }).first().click();
await page.getByRole("button", { name: "Save changes" }).click();
await page.getByText("Saved. The chatbot is updated too.").waitFor();
check("successful save says chatbot updated", true);

await page.getByRole("button", { name: "Projects" }).click();
await page.waitForTimeout(300);
check("notice does not leak to other tabs", (await page.getByText("The chatbot is updated too.").count()) === 0);

await page.screenshot({ path: "/tmp/autokb.png" });
check("no page errors", errors.length === 0, errors.join(" | "));
console.log(`\nUI: ${pass} passed, ${fail} failed`);
await browser.close();
process.exitCode = fail ? 1 : 0;
