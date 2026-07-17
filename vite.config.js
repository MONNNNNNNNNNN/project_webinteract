import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

        const filePath = path.join(process.cwd(), "api", ...segments) + ".js";

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

export default defineConfig({
  plugins: [react(), vercelApiDevMiddleware()],
});
