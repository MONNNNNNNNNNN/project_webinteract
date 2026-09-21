import { chromium } from "playwright-core";

const BASE = process.env.DEV_URL || "http://localhost:5199";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 1600 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`); };

// The simulated chat_misses store starts empty, so serve the screenshot's data.
let misses = [
  { id: "c1", question: "Where is the canteen?", asked_at: "2026-09-10T05:37:07Z" },
  { id: "p1", question: "Do you have a swimming pool?", asked_at: "2026-09-03T07:22:48Z" },
  { id: "p2", question: "Do you have a swimming pool?", asked_at: "2026-09-03T07:20:10Z" },
  { id: "w1", question: "What is the weather in Bangkok?", asked_at: "2026-09-03T06:30:30Z" },
  { id: "x1", question: "copo", asked_at: "2026-09-03T06:01:51Z" },
  { id: "p3", question: "do you have a swimming pool", asked_at: "2026-08-29T09:53:25Z" },
  { id: "c2", question: "Where is the canteen?", asked_at: "2026-08-29T09:51:29Z" },
  { id: "p4", question: "Do you have a swimming pool?", asked_at: "2026-08-29T09:51:28Z" },
];
const deletes = [];
await page.route("**/api/content?type=chat_misses*", async (route) => {
  const req = route.request();
  if (req.method() === "GET") return route.fulfill({ json: { items: misses, simulated: false } });
  const ids = new URL(req.url()).searchParams.get("ids").split(",");
  deletes.push(ids);
  misses = misses.filter((m) => !ids.includes(m.id));
  return route.fulfill({ json: { ok: true, deleted: ids.length, simulated: false } });
});
const faqPosts = [];
await page.route("**/api/admin/faqs", async (route) => {
  if (route.request().method() === "POST") faqPosts.push(route.request().postDataJSON());
  return route.continue(); // real handler: simulated store + placeholder guard
});
await page.route("**/api/admin/draft-answer", (route) =>
  route.fulfill({ json: { draft: "The nearest canteen is [ADMIN: building and floor].", sources: ["Contact and admissions channels"], needsInput: true } })
);

for (let i = 0; i < 20; i++) { try { await page.goto(BASE + "/admin", { waitUntil: "networkidle" }); break; } catch { await page.waitForTimeout(500); } }
await page.getByPlaceholder("Email").fill("admin@dme.kku.ac.th");
await page.getByPlaceholder("Password").fill("demo1234");
await page.getByRole("button", { name: "Log in" }).click();
await page.waitForURL("**/admin/dashboard");
await page.getByRole("button", { name: "Unanswered" }).click();
await page.getByText("Do you have a swimming pool?").first().waitFor();

const cards = await page.locator("div.rounded-xl.border.p-4").evaluateAll((els) =>
  els.map((e) => e.innerText.replace(/\s+/g, " ").trim()).filter((t) => /Dismiss/.test(t))
);
check("4 duplicate pool questions grouped, listed first", /^Do you have a swimming pool\? asked 4×/.test(cards[0]), cards[0]);
check("4 distinct groups (pool, canteen, weather, copo)", cards.length === 4, `${cards.length}: ${cards.map((c) => c.slice(0, 30)).join(" | ")}`);
check("timestamps formatted, no raw ISO", !cards.some((c) => /T\d\d:\d\d/.test(c)) && /Sept? 2026/.test(cards[0]));
check("dismiss label counts the group", /Dismiss all 4/.test(cards[0]));

// Answer the canteen question via a Gemini draft.
const canteen = page.locator("div.rounded-xl.border.p-4", { hasText: "Where is the canteen?" });
await canteen.getByRole("button", { name: "Answer" }).click();
const publish = canteen.getByRole("button", { name: "Publish as FAQ" });
check("publish disabled with empty answer", await publish.isDisabled());
await canteen.getByRole("button", { name: "Draft with Gemini" }).click();
await canteen.getByText("Drafted only from").waitFor();
const answerBox = canteen.locator("textarea");
check("draft lands in the answer box", (await answerBox.inputValue()).includes("[ADMIN: building and floor]"));
check("publish disabled while placeholder remains", await publish.isDisabled());
check("placeholder warning shown", await canteen.getByText("Fill in or remove every [ADMIN").isVisible());
await answerBox.fill("The nearest canteen is on the ground floor of the Engineering canteen building.");
check("publish enabled once filled", await publish.isEnabled());
await publish.click();
await page.getByText("FAQ published.").waitFor();
check("FAQ posted with edited text", faqPosts.length === 1 && !faqPosts[0].answer.includes("[ADMIN"), JSON.stringify(faqPosts[0]));
check("both canteen copies cleared in one request", JSON.stringify(deletes[0]) === JSON.stringify(["c1", "c2"]), JSON.stringify(deletes[0]));
check("canteen gone from list", (await page.getByText("Where is the canteen?").count()) === 0);

// Dismiss all 4 pool copies at once.
await page.getByRole("button", { name: "Dismiss all 4" }).click();
await page.waitForTimeout(400);
check("dismiss all 4 sends all ids", deletes[1]?.length === 4 && ["p1", "p2", "p3", "p4"].every((id) => deletes[1].includes(id)), JSON.stringify(deletes[1]));

// Server-side guard: bypass the disabled button and post a placeholder straight to the API.
const direct = await page.evaluate(async () => {
  const r = await fetch("/api/admin/faqs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: "x?", answer: "[ADMIN: y]" }) });
  return r.status;
});
check("server refuses placeholder even when UI is bypassed", direct === 400);

await page.screenshot({ path: "/tmp/unanswered.png", fullPage: true });
check("no page errors", errors.length === 0, errors.join(" | "));
console.log(`\nUI: ${pass} passed, ${fail} failed`);
await browser.close();
process.exitCode = fail ? 1 : 0;
