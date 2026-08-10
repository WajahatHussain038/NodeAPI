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
});

userSchema.methods.genrateAuthToken = function () {
  const token = jwt.sign({ _id: this.id }, config.get("jwtPrivateKey"));
  return token;
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

module.exports = router;
