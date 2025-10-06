const { requireAuth } = require("../_lib/auth");
const { getContentShaAndText, putContent } = require("../_lib/github");

async function readBody(req) {
  if (typeof req.body === "string") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (!requireAuth(req, res)) return;
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
    const { data, message } = parsed;
    const path = process.env.PRODUCTS_PATH || "public/content/products.json";
    if (!Array.isArray(data)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ ok: false, error: "invalid_payload" }));
    }
    const { sha } = await getContentShaAndText(path);
    await putContent(
      path,
      message || "chore(admin): update products.json",
      JSON.stringify(data, null, 2),
      sha
    );
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: "write_failed" }));
  }
};
