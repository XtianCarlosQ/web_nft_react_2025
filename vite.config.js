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
  // Sensible dev defaults so the local mock API works out of the box
  if (typeof process.env.MOCK_API === "undefined")
    process.env.MOCK_API = "true";
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "devsecret";
  // ADMIN creds are optional in dev; if not set, we'll auto-authenticate

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
    // Only set Secure when explicitly enabled; default off for local http
    if (String(process.env.COOKIE_SECURE) === "true") parts.push("Secure");
    res.setHeader("Set-Cookie", parts.join("; "));
  }

  async function readBody(req) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return Buffer.concat(chunks).toString("utf8");
  }

  // Read request body as a raw Buffer (no encoding), needed for multipart/form-data
  async function readBodyBuffer(req) {
    const chunks = [];
    for await (const c of req) {
      if (typeof c === "string") chunks.push(Buffer.from(c));
      else chunks.push(c);
    }
    return Buffer.concat(chunks);
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
          // Dev convenience: if admin creds are not configured, auto-authenticate
          const devNoCreds =
            !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD;
          if (devNoCreds && !token) {
            try {
              const t = jwt.sign({ u: "dev" }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 12,
              });
              setCookie(res, COOKIE_NAME, t, { maxAge: 60 * 60 * 12 });
              return send(200, { authenticated: true, user: { name: "dev" } });
            } catch {
              // fall-through
            }
          }
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
        // In pure-dev mode without explicit ADMIN creds, soft-auto-auth to avoid 401s
        const devNoCreds =
          !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD;
        if (!authed && devNoCreds) {
          try {
            const t = jwt.sign({ u: "dev" }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 12,
            });
            setCookie(res, COOKIE_NAME, t, { maxAge: 60 * 60 * 12 });
            authed = true;
          } catch {}
        }
        if (
          url.pathname.startsWith("/api/services/") ||
          url.pathname.startsWith("/api/team/") ||
          url.pathname.startsWith("/api/products/") ||
          url.pathname === "/api/upload" ||
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
          console.log("[DEV-API] services/save len=", data.length);
          const p = process.env.SERVICES_PATH || "public/content/services.json";
          const abs = path.resolve(process.cwd(), p);
          // Safety guard: prevent accidental wipe unless explicitly allowed
          const allowEmpty = url.searchParams.get("allowEmpty") === "true";
          if (data.length === 0 && !allowEmpty) {
            return send(422, {
              ok: false,
              error: "empty_not_allowed",
              hint: "Pass ?allowEmpty=true if you intend to clear all services",
            });
          }
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          // Backup current file if exists and content differs
          try {
            if (fs.existsSync(abs)) {
              const prev = fs.readFileSync(abs, "utf8");
              if (
                prev &&
                prev.trim() &&
                prev.trim() !== JSON.stringify(data, null, 2).trim()
              ) {
                const stamp = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")
                  .replace("T", "_")
                  .replace("Z", "");
                const bdir = path.resolve(
                  process.cwd(),
                  "public/content/_backups"
                );
                fs.mkdirSync(bdir, { recursive: true });
                const base = path.basename(abs, ".json");
                const bfile = path.join(bdir, `${base}-${stamp}.json`);
                fs.writeFileSync(bfile, prev, "utf8");
              }
            }
          } catch {}
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
          console.log("[DEV-API] team/save RAW body length:", raw?.length || 0);

          let body = {};
          try {
            body = raw ? JSON.parse(raw) : {};
            console.log(
              "[DEV-API] team/save PARSED body keys:",
              Object.keys(body)
            );
          } catch (e) {
            console.log("[DEV-API] team/save JSON PARSE ERROR:", e.message);
          }

          const data = Array.isArray(body.data) ? body.data : [];
          console.log("[DEV-API] team/save data.length=", data.length);
          console.log("[DEV-API] team/save body.data type:", typeof body.data);
          console.log(
            "[DEV-API] team/save body.data isArray:",
            Array.isArray(body.data)
          );
          if (data.length > 0) {
            console.log("[DEV-API] team/save first item:", data[0]?.id);
          }

          const p = process.env.TEAM_PATH || "public/content/team.json";
          const abs = path.resolve(process.cwd(), p);
          // Safety guard: prevent accidental wipe unless explicitly allowed
          const allowEmpty = url.searchParams.get("allowEmpty") === "true";
          if (data.length === 0 && !allowEmpty) {
            console.log("[DEV-API] team/save REJECTING empty array");
            return send(422, {
              ok: false,
              error: "empty_not_allowed",
              hint: "Pass ?allowEmpty=true if you intend to clear all team entries",
            });
          }
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          // Backup current file if exists and content differs
          try {
            if (fs.existsSync(abs)) {
              const prev = fs.readFileSync(abs, "utf8");
              if (
                prev &&
                prev.trim() &&
                prev.trim() !== JSON.stringify(data, null, 2).trim()
              ) {
                const stamp = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")
                  .replace("T", "_")
                  .replace("Z", "");
                const bdir = path.resolve(
                  process.cwd(),
                  "public/content/_backups"
                );
                fs.mkdirSync(bdir, { recursive: true });
                const base = path.basename(abs, ".json");
                const bfile = path.join(bdir, `${base}-${stamp}.json`);
                fs.writeFileSync(bfile, prev, "utf8");
              }
            }
          } catch {}
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
          console.log(
            "[DEV-API] products/save RAW body length:",
            raw?.length || 0
          );

          let body = {};
          try {
            body = raw ? JSON.parse(raw) : {};
            console.log(
              "[DEV-API] products/save PARSED body keys:",
              Object.keys(body)
            );
          } catch (e) {
            console.log("[DEV-API] products/save JSON PARSE ERROR:", e.message);
          }

          const data = Array.isArray(body.data) ? body.data : [];
          console.log("[DEV-API] products/save data.length=", data.length);
          console.log(
            "[DEV-API] products/save body.data type:",
            typeof body.data
          );
          console.log(
            "[DEV-API] products/save body.data isArray:",
            Array.isArray(body.data)
          );
          if (data.length > 0) {
            console.log("[DEV-API] products/save first item:", data[0]?.id);
          }

          const p = process.env.PRODUCTS_PATH || "public/content/products.json";
          const abs = path.resolve(process.cwd(), p);
          // Safety guard: prevent accidental wipe unless explicitly allowed
          const allowEmpty = url.searchParams.get("allowEmpty") === "true";
          if (data.length === 0 && !allowEmpty) {
            console.log("[DEV-API] products/save REJECTING empty array");
            return send(422, {
              ok: false,
              error: "empty_not_allowed",
              hint: "Pass ?allowEmpty=true if you intend to clear all products",
            });
          }
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          // Backup current file if exists and non-empty
          try {
            if (fs.existsSync(abs)) {
              const prev = fs.readFileSync(abs, "utf8");
              if (
                prev &&
                prev.trim() &&
                prev.trim() !== JSON.stringify(data, null, 2).trim()
              ) {
                const stamp = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")
                  .replace("T", "_")
                  .replace("Z", "");
                const bdir = path.resolve(
                  process.cwd(),
                  "public/content/_backups"
                );
                fs.mkdirSync(bdir, { recursive: true });
                const base = path.basename(abs, ".json");
                const bfile = path.join(bdir, `${base}-${stamp}.json`);
                fs.writeFileSync(bfile, prev, "utf8");
              }
            }
          } catch {}
          fs.writeFileSync(abs, JSON.stringify(data, null, 2), "utf8");
          return send(200, { ok: true });
        }

        // List product backups
        if (url.pathname === "/api/products/backups" && req.method === "GET") {
          const p = process.env.PRODUCTS_PATH || "public/content/products.json";
          const abs = path.resolve(process.cwd(), p);
          const bdir = path.resolve(process.cwd(), "public/content/_backups");
          try {
            const base = path.basename(abs, ".json");
            const files = fs
              .readdirSync(bdir)
              .filter((f) => f.startsWith(base + "-") && f.endsWith(".json"))
              .sort()
              .reverse();
            return send(200, { ok: true, files });
          } catch {
            return send(200, { ok: true, files: [] });
          }
        }
        // Restore product content from a backup file name
        if (url.pathname === "/api/products/restore" && req.method === "POST") {
          const file = url.searchParams.get("file") || "";
          if (!file) return send(400, { ok: false, error: "missing_file" });
          const bdir = path.resolve(process.cwd(), "public/content/_backups");
          const babs = path.resolve(bdir, file);
          if (!babs.startsWith(bdir))
            return send(400, { ok: false, error: "invalid_file" });
          try {
            const content = fs.readFileSync(babs, "utf8");
            const data = JSON.parse(content);
            const p =
              process.env.PRODUCTS_PATH || "public/content/products.json";
            const abs = path.resolve(process.cwd(), p);
            fs.mkdirSync(path.dirname(abs), { recursive: true });
            fs.writeFileSync(abs, JSON.stringify(data, null, 2), "utf8");
            return send(200, { ok: true, restored: file });
          } catch {
            return send(400, { ok: false, error: "restore_failed" });
          }
        }

        // Upload endpoint (dev only): generic handler similar to serverless api/upload.js
        if (url.pathname === "/api/upload" && req.method === "POST") {
          try {
            const ct = (req.headers["content-type"] || "").toLowerCase();
            // Defaults
            let targetPath = "public/uploads/";
            let filename = `file-${Date.now()}`;
            let fileBuffer = null;

            // JSON branch: { name?, data(base64)?, url?, path? }
            if (ct.startsWith("application/json")) {
              const raw = await readBody(req);
              let body = {};
              try {
                body = raw ? JSON.parse(raw) : {};
              } catch {}
              const name = (body?.name || filename).toString();
              let p = (body?.path || targetPath).toString();
              const base64 = (body?.data || "").toString();
              const remoteUrl = (body?.url || "").toString();
              p = p.trim().replace(/^\/+/, "");
              if (!p.startsWith("public/")) p = "public/" + p;
              targetPath = p;
              if (base64) {
                filename = name.replace(/[^a-zA-Z0-9._-]/g, "-");
                try {
                  fileBuffer = Buffer.from(base64, "base64");
                } catch {
                  return send(400, { ok: false, error: "invalid_base64" });
                }
              } else if (remoteUrl) {
                try {
                  const r = await fetch(remoteUrl);
                  if (!r.ok) {
                    return send(400, {
                      ok: false,
                      error: "fetch_failed",
                      status: r.status,
                    });
                  }
                  const buf = Buffer.from(await r.arrayBuffer());
                  fileBuffer = buf;
                  if (body?.name) {
                    filename = name.replace(/[^a-zA-Z0-9._-]/g, "-");
                  } else {
                    try {
                      const u = new URL(remoteUrl);
                      const base =
                        u.pathname.split("/").filter(Boolean).pop() || filename;
                      filename = base.replace(/[^a-zA-Z0-9._-]/g, "-");
                    } catch {
                      filename = name.replace(/[^a-zA-Z0-9._-]/g, "-");
                    }
                  }
                } catch {
                  return send(400, { ok: false, error: "fetch_error" });
                }
              } else {
                return send(400, { ok: false, error: "no_file" });
              }
            }

            // Multipart branch: path + file
            else if (ct.startsWith("multipart/form-data")) {
              // Robust multipart parsing using raw bytes and boundary scanning
              const m = ct.match(/boundary="?([^";]+)"?/);
              if (!m) return send(400, { ok: false, error: "no_boundary" });
              const boundary = "--" + m[1];
              const bodyBuf = await readBodyBuffer(req);
              const bodyStr = bodyBuf.toString("latin1"); // 1 byte per char mapping

              let pos = 0;
              while (true) {
                let partStart = bodyStr.indexOf(boundary, pos);
                if (partStart === -1) break;
                partStart += boundary.length;
                // Check for final boundary end marker
                if (bodyStr.substr(partStart, 2) === "--") break;
                // Skip CRLF after boundary
                if (bodyStr.substr(partStart, 2) === "\r\n") partStart += 2;

                const headerEnd = bodyStr.indexOf("\r\n\r\n", partStart);
                if (headerEnd === -1) break;
                const headersStr = bodyStr.substring(partStart, headerEnd);
                const contentStart = headerEnd + 4; // after CRLFCRLF
                const nextBoundaryIdx = bodyStr.indexOf(
                  "\r\n" + boundary,
                  contentStart
                );
                const contentEnd =
                  nextBoundaryIdx === -1 ? bodyStr.length : nextBoundaryIdx;

                // Map to byte offsets (latin1 => 1 char = 1 byte)
                const contentBuf = bodyBuf.slice(contentStart, contentEnd);

                // Parse headers
                const disp =
                  headersStr
                    .split("\r\n")
                    .find((h) => /^content-disposition/i.test(h)) || "";
                const nameMatch = disp.match(/name="([^"]+)"/i);
                const fileMatch = disp.match(/filename="([^"]*)"/i);
                const fieldName = nameMatch ? nameMatch[1] : "";

                if (fieldName === "path") {
                  const val = contentBuf.toString("utf8").trim();
                  if (val) {
                    let p = val.replace(/^\/+/, "");
                    if (!p.startsWith("public/")) p = "public/" + p;
                    targetPath = p;
                  }
                } else if (fieldName === "file") {
                  if (fileMatch && fileMatch[1]) {
                    filename = fileMatch[1];
                  }
                  // sanitize filename
                  filename = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
                  fileBuffer = contentBuf; // exact bytes
                }

                // Move position for next search
                pos = contentEnd + 2; // skip CRLF preceding boundary
              }

              if (!fileBuffer)
                return send(400, { ok: false, error: "no_file" });
            } else {
              return send(400, { ok: false, error: "invalid_content_type" });
            }

            // Write file under public/
            const fullPath = `${targetPath}${
              targetPath.endsWith("/") ? "" : "/"
            }${filename}`.replace(/^\/+/, "");
            const absDir = path.resolve(process.cwd(), path.dirname(fullPath));
            fs.mkdirSync(absDir, { recursive: true });
            fs.writeFileSync(path.join(process.cwd(), fullPath), fileBuffer);
            const urlPath = `/${fullPath.replace(/^public\//, "")}`;
            return send(200, { ok: true, path: fullPath, url: urlPath });
          } catch (e) {
            return send(500, { ok: false, error: "upload_failed" });
          }
        }

        // Upload endpoint (legacy dev helper): saves base64 images under public/uploads/team
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
      // With the mock API enabled by default, no proxy is required for local dev
      // If you later run an external API, you can re-enable this proxy.
      proxy: {},
    },
  };
});
