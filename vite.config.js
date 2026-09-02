import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

// public/cdlc-sim/ is empty until the 3D build is dropped in (see
// docs/3d-integration-handoff.md). Without this, Vite's SPA history
// fallback serves index.html for the missing /cdlc-sim/index.html request,
// so the ThreeDWorld page's iframe recursively loads the whole site.
function cdlcSimNotFoundMiddleware() {
  return {
    name: "cdlc-sim-not-found",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith("/cdlc-sim/")) return next();
        const filePath = path.join(process.cwd(), "public", req.url.split("?")[0]);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return next();
        res.statusCode = 404;
        res.end("Not found");
      });
    },
  };
}

// Resolve a request path to a handler file the way Vercel does: an exact match
// first, then a single dynamic segment.
//
// Without the dynamic branch, api/content/[type].js would never be reached under
// `vite dev` — the exact lookup for api/content/projects.js fails, the middleware
// falls through, and the SPA history fallback answers /api/content/projects with
// index.html. That failure is silent and looks like a broken fetch.
function resolveApiHandler(segments) {
  const exact = path.join(process.cwd(), "api", ...segments) + ".js";
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) {
    return { filePath: exact, params: {} };
  }

  const dir = path.join(process.cwd(), "api", ...segments.slice(0, -1));
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  const dynamic = fs.readdirSync(dir).find((f) => /^\[.+\]\.js$/.test(f));
  if (!dynamic) return null;

  const paramName = dynamic.match(/^\[(.+)\]\.js$/)[1];
  return {
    filePath: path.join(dir, dynamic),
    params: { [paramName]: segments[segments.length - 1] },
  };
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

        const resolved = resolveApiHandler(segments);
        if (!resolved) return next();

        let handlerModule;
        try {
          handlerModule = await import(`${pathToFileURL(resolved.filePath).href}?t=${Date.now()}`);
        } catch {
          return next();
        }

        // Route params merge with the query string, matching Vercel, where
        // req.query carries both.
        req.query = { ...Object.fromEntries(new URLSearchParams(search || "")), ...resolved.params };

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
    plugins: [react(), vercelApiDevMiddleware(), cdlcSimNotFoundMiddleware()],
  };
});
