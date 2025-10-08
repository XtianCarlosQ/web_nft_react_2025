const fetch = require("node-fetch");
const { requireAuth } = require("./_lib/auth");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (!requireAuth(req, res)) return;
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ ok: false, error: "no_hook" }));
  }
  try {
    const r = await fetch(hook, { method: "POST" });
    const ok = r.ok;
    res.end(JSON.stringify({ ok }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: "deploy_failed" }));
  }
};
