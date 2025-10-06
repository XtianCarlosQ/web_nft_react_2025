const { signToken, setAuthCookie } = require("../_lib/auth");

async function readBody(req) {
  if (typeof req.body === "string") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
  }
  try {
    const raw = await readBody(req);
    let parsed = {};
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = {};
    }
    const { username, password } = parsed;
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
    const okUser = username === process.env.ADMIN_USERNAME;
    const okPass = password === process.env.ADMIN_PASSWORD;
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
