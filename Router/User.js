const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const config = require("config");
const express = require("express");
const _ = require("lodash");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userData");

const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  role:{type:String ,
    enum : ['admin','superuser','user'],
    defult:'user'
  }
});

userSchema.methods.genrateAuthToken = function () {
  const token = jwt.sign({ _id: this.id , role:this.role }, config.get("jwtPrivateKey"), {
    expiresIn: 3600,
  });
  return token;

};

// userSchema.methods.
tokenValidation = function (token) {
  // Verify a token
  jwt.verify(token, config.get("jwtPrivateKey"), (err, decodedToken) => {
    if (err) {
      return "Token verification failed";
    } else {
      return "decodedToken";
    }
  });
  console.log("1111 Token Validation Method");
};

const User = mongoose.model("User", userSchema);
router.post("/", (req, res) => {
  async function SaveUser() {
    const salt = await bcrypt.genSalt(10);
    const hasedPass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hasedPass,
      role:req.body.role,
    });
    const userResult = await user.save();
    if (userResult) {
      res.send(_.pick(userResult, ["_id", "username", "email"]));
    } else {
      res.send("Please Try Again Later");
    }
  }
  SaveUser();
});

router.get("/login", (req, res) => {
  async function getUser() {
    const user = await User.findOne({ username: req.body.username });
    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (validUser) {
      return res
        .header("x-auth-token", user.genrateAuthToken())
        .send(_.pick(user, ["username", "email"]));
    }
    return res.send("Wrong Username or Password");
  }
  getUser();
});

router.get("/validToken", (req, res) => {
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
    // next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }

  // console.log(token);
  // return res.send("Token Validation Method");
});

router.get("/alluser", (req, res) => {
  async function getAllUser() {
    try {
      const user = await User.find({}, { password: 0, __v: 0 }).lean();
      res.render("index", {
        title: "Hello from the Other Side",
        items: user,
      });
      // res.send(userData);
    } catch (error) {
      console.error(error);
    }
  }
  getAllUser();
});

router.delete("/:id", auth, (req, res) => {
  console.log("Delete Method");
});

module.exports = router;
