import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

// Resolve a request path to a handler file: /api/admin/login -> api/admin/login.js.
//
// Exact files only, on purpose. Vercel did not route a dynamic segment
// (api/content/[type].js) in production even though it worked here, so the
// content endpoint moved to ?type= — see the note in api/content.js. Emulating
// dynamic routes in dev would only let the next one pass locally and fail live.
function resolveApiHandler(segments) {
  const filePath = path.join(process.cwd(), "api", ...segments) + ".js";
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : null;
}

// Dev-only middleware that runs api/*.js (Vercel serverless function
// convention) under `vite dev`, so the same handler files work unchanged
// after a real Vercel deploy without needing the Vercel CLI locally.
function vercelApiDevMiddleware() {
  return {
    name: "vercel-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith("/api/")) return next();

        const [pathname, search] = req.url.split("?");
        const segments = pathname.split("/").filter(Boolean).slice(1); // drop "api"
        if (segments.some((s) => !/^[a-zA-Z0-9_-]+$/.test(s))) return next();

        const filePath = resolveApiHandler(segments);
        if (!filePath) return next();

        let handlerModule;
        try {
          handlerModule = await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
        } catch {
          return next();
        }

        req.query = Object.fromEntries(new URLSearchParams(search || ""));

        if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const raw = Buffer.concat(chunks).toString("utf8");
          try {
            req.body = raw ? JSON.parse(raw) : {};
          } catch {
            req.body = {};
          }
        }

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          if (!res.getHeader("content-type")) {
            res.setHeader("content-type", "application/json");
          }
          res.end(JSON.stringify(data));
        };

        try {
          await handlerModule.default(req, res);
        } catch (err) {
          console.error(`[api dev] ${pathname} failed:`, err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal error" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // The api/ handlers read process.env directly, the way they will on Vercel.
  // Vite loads .env files but only exposes VITE_-prefixed vars, and never to
  // process.env — so without this, `npm run dev` runs with no Supabase config
  // and every developer has to remember to source .env.local by hand.
  // Real environment variables win over file values.
  const fileEnv = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(fileEnv)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react(), vercelApiDevMiddleware()],
  };
});
