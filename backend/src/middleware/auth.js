const jwt = require("jsonwebtoken");

/**
 * Express middleware that verifies the JWT from the Authorization header.
 * Sets req.userId on success; responds with 401 on failure.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token is invalid or expired" });
  }
}

module.exports = requireAuth;
