const {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  verifyTokenFromCookie,
} = require("./_lib/auth");

async function readParsedBody(req) {
  try {
    if (req.body != null) {
      if (typeof req.body === "string") {
        try {
          return JSON.parse(req.body);
        } catch {
          return {};
        }
      }
      if (typeof req.body === "object") return req.body;
    }
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

  // Normalizar path tal como llega en la petición original
  const fullUrl = req.url || "";
  // req.url may include query string
  const pathname = (() => {
    try {
      return new URL(fullUrl, "http://localhost").pathname;
    } catch {
      return String(fullUrl).split("?")[0];
    }
  })();

  // Decide action based on path and method
  try {
    // /api/auth/login -> POST
    if (pathname.endsWith("/api/auth/login") && req.method === "POST") {
      const parsed = await readParsedBody(req);
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
      return res.end(JSON.stringify({ ok: true }));
    }

    // /api/auth/me -> GET
    if (pathname.endsWith("/api/auth/me") && req.method === "GET") {
      const user = verifyTokenFromCookie(req);
      if (!user) return res.end(JSON.stringify({ authenticated: false }));
      return res.end(
        JSON.stringify({ authenticated: true, user: { name: user.u } })
      );
    }

    // /api/auth/logout -> POST or GET
    if (
      pathname.endsWith("/api/auth/logout") &&
      (req.method === "POST" || req.method === "GET")
    ) {
      clearAuthCookie(res);
      return res.end(JSON.stringify({ ok: true }));
    }

    // If reached here, method or path not allowed
    res.statusCode = 404;
    return res.end(JSON.stringify({ ok: false, error: "not_found" }));
  } catch (err) {
    console.error("[api/auth] error", err?.message || err);
    res.statusCode = 500;
    return res.end(JSON.stringify({ ok: false, error: "server_error" }));
  }
};
