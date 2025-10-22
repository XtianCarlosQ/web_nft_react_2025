// Wrapper entry so production can route all /api/auth/* to this single function.
// Delegates implementation to the module in ./auth/auth.js (keeps code organized).
module.exports = require("./auth/auth.js");
