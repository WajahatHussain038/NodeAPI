const jwt = require("jsonwebtoken");
const config = require("config");
function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Format typically looks like: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // 2. Verify the token using your secret key
    const verified = jwt.verify(token, config.get("jwtPrivateKey"));

    // 3. Attach the decoded payload (e.g., user id) to the request object
    // req.user = verified;
    console.log(verified);
    res.status(200).json({ message: verified });
    // 4. Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }

  // console.log(token);
  // return res.send("Token Validation Method");
}

module.exports = auth;
