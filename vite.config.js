import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars from .env files for both client and this config runtime
  const env = loadEnv(mode, process.cwd(), "");
  // Merge into process.env so our middleware can read them
  process.env = { ...process.env, ...env };

  const COOKIE_NAME = "admin_token";

  function parseCookies(req) {
    const cookie = req.headers["cookie"] || "";
    const out = {};
    cookie.split(";").forEach((p) => {
      const [k, ...rest] = p.trim().split("=");
      if (!k) return;
      out[k] = decodeURIComponent(rest.join("="));
    });
    return out;
  }

  function setCookie(res, name, val, opts = {}) {
    const parts = [
      `${name}=${encodeURIComponent(val)}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
    ];
    if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
    if (String(process.env.COOKIE_SECURE) !== "false") parts.push("Secure");
    res.setHeader("Set-Cookie", parts.join("; "));
  }

  async function readBody(req) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return Buffer.concat(chunks).toString("utf8");
  }

  function mockApiMiddleware() {
    return async (req, res, next) => {
      try {
        if (!req.url?.startsWith("/api/")) return next();
        if (process.env.MOCK_API !== "true") return next();

        const url = new URL(req.url, "http://localhost");
        const send = (code, obj) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(obj));
        };

        // Auth routes
        if (url.pathname === "/api/auth/me" && req.method === "GET") {
          const cookies = parseCookies(req);
          const token = cookies[COOKIE_NAME];
          if (!token || !process.env.JWT_SECRET)
            return send(200, { authenticated: false });
          try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            return send(200, { authenticated: true, user: { name: user.u } });
          } catch {
            return send(200, { authenticated: false });
          }
        }

        if (url.pathname === "/api/auth/login" && req.method === "POST") {
          const raw = await readBody(req);
          let body = {};
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {}
          if (
            !process.env.ADMIN_USERNAME ||
            !process.env.ADMIN_PASSWORD ||
            !process.env.JWT_SECRET
          ) {
            return send(500, { ok: false, error: "missing_env" });
          }
          if (
            body.username !== process.env.ADMIN_USERNAME ||
            body.password !== process.env.ADMIN_PASSWORD
          ) {
            return send(401, { ok: false, error: "invalid_credentials" });
          }
          const token = jwt.sign({ u: body.username }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 2,
          });
          setCookie(res, COOKIE_NAME, token, { maxAge: 60 * 60 * 2 });
          return send(200, { ok: true });
        }

        if (url.pathname === "/api/auth/logout") {
          setCookie(res, COOKIE_NAME, "", { maxAge: 0 });
          return send(200, { ok: true });
        }

        // Protected routes
        const cookies = parseCookies(req);
        let authed = false;
        if (cookies[COOKIE_NAME] && process.env.JWT_SECRET) {
          try {
            jwt.verify(cookies[COOKIE_NAME], process.env.JWT_SECRET);
            authed = true;
          } catch {}
        }
        if (
          url.pathname.startsWith("/api/services/") ||
          url.pathname.startsWith("/api/team/") ||
          url.pathname.startsWith("/api/products/") ||
          url.pathname.startsWith("/api/upload/")
        ) {
          if (!authed) return send(401, { ok: false, error: "unauthorized" });
        }

        if (url.pathname === "/api/services/list" && req.method === "GET") {
          const p = process.env.SERVICES_PATH || "public/content/services.json";
          const abs = path.resolve(process.cwd(), p);
          try {
            const content = fs.readFileSync(abs, "utf8");
            return send(200, {
              ok: true,
              sha: null,
              data: JSON.parse(content || "[]"),
            });
          } catch {
            return send(200, { ok: true, sha: null, data: [] });
          }
        }

        if (url.pathname === "/api/services/save" && req.method === "POST") {
          const raw = await readBody(req);
          let body = {};
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {}
          const data = Array.isArray(body.data) ? body.data : [];
          const p = process.env.SERVICES_PATH || "public/content/services.json";
          const abs = path.resolve(process.cwd(), p);
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          fs.writeFileSync(abs, JSON.stringify(data, null, 2), "utf8");
          return send(200, { ok: true });
        }

        // Team endpoints
        if (url.pathname === "/api/team/list" && req.method === "GET") {
          const p = process.env.TEAM_PATH || "public/content/team.json";
          const abs = path.resolve(process.cwd(), p);
          try {
            const content = fs.readFileSync(abs, "utf8");
            return send(200, { ok: true, data: JSON.parse(content || "[]") });
          } catch {
            return send(200, { ok: true, data: [] });
          }
        }
        if (url.pathname === "/api/team/save" && req.method === "POST") {
          const raw = await readBody(req);
          let body = {};
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {}
          const data = Array.isArray(body.data) ? body.data : [];
          const p = process.env.TEAM_PATH || "public/content/team.json";
          const abs = path.resolve(process.cwd(), p);
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          fs.writeFileSync(abs, JSON.stringify(data, null, 2), "utf8");
          return send(200, { ok: true });
        }

        // Products endpoints
        if (url.pathname === "/api/products/list" && req.method === "GET") {
          const p = process.env.PRODUCTS_PATH || "public/content/products.json";
          const abs = path.resolve(process.cwd(), p);
          try {
            const content = fs.readFileSync(abs, "utf8");
            return send(200, { ok: true, data: JSON.parse(content || "[]") });
          } catch {
            return send(200, { ok: true, data: [] });
          }
        }
        if (url.pathname === "/api/products/save" && req.method === "POST") {
          const raw = await readBody(req);
          let body = {};
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {}
          const data = Array.isArray(body.data) ? body.data : [];
          const p = process.env.PRODUCTS_PATH || "public/content/products.json";
          const abs = path.resolve(process.cwd(), p);
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          fs.writeFileSync(abs, JSON.stringify(data, null, 2), "utf8");
          return send(200, { ok: true });
        }

        // Upload endpoint (dev only): saves base64 images under public/uploads/team
        if (url.pathname === "/api/upload/team" && req.method === "POST") {
          try {
            const raw = await readBody(req);
            let body = {};
            try {
              body = raw ? JSON.parse(raw) : {};
            } catch {}
            const base64 = (body.data || "").toString();
            if (!base64) return send(400, { ok: false, error: "missing_data" });
            let name = (body.name || `upload-${Date.now()}`).toString();
            // sanitize filename
            name = name.replace(/[^a-zA-Z0-9._-]/g, "-");
            let ext = (path.extname(name) || "").toLowerCase();
            const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);
            if (!allowed.has(ext)) ext = ".png";
            const safeBase =
              path.basename(name, path.extname(name)).slice(0, 40) || "img";
            const finalName = `${safeBase}-${Date.now()}${ext}`;
            const outDir = path.resolve(process.cwd(), "public/uploads/team");
            fs.mkdirSync(outDir, { recursive: true });
            const outPath = path.join(outDir, finalName);
            // decode base64
            const buffer = Buffer.from(base64, "base64");
            fs.writeFileSync(outPath, buffer);
            const urlPath = `/uploads/team/${finalName}`;
            return send(200, { ok: true, url: urlPath, name: finalName });
          } catch (e) {
            return send(500, { ok: false, error: "upload_failed" });
          }
        }

        return next();
      } catch (e) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    };
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "dev-api-mock",
        configureServer(server) {
          server.middlewares.use(mockApiMiddleware());
        },
      },
    ],
    server: {
      proxy: {
        // Proxy API routes to a local serverless dev server (e.g., `vercel dev` on 3000)
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
