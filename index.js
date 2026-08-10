const express = require("express");
const config = require("config");
const app = express();
const path = require("path");
const userRouter = require("./router/User");

app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));

if (!config.get("jwtPrivateKey")) {
  console.error("Fatal Error: jwtPrivateKey not define");
  process.exit(1);
}

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
);
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/users", userRouter);
app.listen(45006, () => {
  console.log(`Server Running on port 45006`);
});
