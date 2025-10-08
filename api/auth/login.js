const { signToken, setAuthCookie } = require("../_lib/auth");

async function readParsedBody(req) {
  try {
    // If a framework or dev server already parsed the body
    if (req.body != null) {
      if (typeof req.body === "string") {
        try {
          return JSON.parse(req.body);
        } catch {
          return {};
        }
      }
      if (typeof req.body === "object") {
        return req.body;
      }
    }
    // Fallback: read raw stream
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  } catch {
    return {};
  }
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
  }
  try {
    const parsed = await readParsedBody(req);
    // Dev-only diagnostics (prints to vercel dev console). Avoid secrets.
    try {
      console.log("[api/auth/login]", {
        method: req.method,
        ct: req.headers?.["content-type"],
        hasUser: !!parsed?.username,
        hasPass: !!parsed?.password,
        envUserLen: (process.env.ADMIN_USERNAME || "").trim().length,
        envPassLen: (process.env.ADMIN_PASSWORD || "").trim().length,
      });
    } catch {}
    const username = (parsed?.username || "").trim();
    const password = (parsed?.password || "").trim();
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ ok: false, error: "missing_env_admin_credentials" })
      );
    }
    if (!process.env.JWT_SECRET) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ ok: false, error: "missing_env_jwt_secret" })
      );
    }
    const envUser = (process.env.ADMIN_USERNAME || "").trim();
    const envPass = (process.env.ADMIN_PASSWORD || "").trim();
    const okUser = username === envUser;
    const okPass = password === envPass;
    if (!okUser || !okPass) {
      res.statusCode = 401;
      return res.end(
        JSON.stringify({ ok: false, error: "invalid_credentials" })
      );
    }
    const token = signToken({ u: username });
    setAuthCookie(res, token);
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: "server_error" }));
  }
};
