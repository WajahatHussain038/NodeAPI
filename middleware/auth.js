const jwt = require("jsonwebtoken");
const config = require("config");
function auth(req, res, next) {
  console.log("Auth Method");
  if (!req.header("x-auth-token"))
    return res.status(401).send("No Token Provided");

  try {
    const tokenStatus = jwt.verify(
      req.header("x-auth-token"),
      config.get("jwtPrivateKey"),
    );
    // if (!tokenStatus) {
    console.log("Going to Post Method");
    req.user = tokenStatus;
    next();
    // }
  } catch {
    return res.status(401).send("Invalid Token Provided");
  }
}

module.exports = auth;
