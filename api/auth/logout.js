const { clearAuthCookie } = require("../_lib/auth");

module.exports = async (req, res) => {
  clearAuthCookie(res);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true }));
};
