const { verifyTokenFromCookie } = require("../_lib/auth");

module.exports = async (req, res) => {
  const user = verifyTokenFromCookie(req);
  res.setHeader("Content-Type", "application/json");
  if (!user) return res.end(JSON.stringify({ authenticated: false }));
  res.end(JSON.stringify({ authenticated: true, user: { name: user.u } }));
};
