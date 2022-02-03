var express = require("express");
var router = express.Router();
const auth = require("./auth");

router.get("/", (req, res) => {
  res.json({ message: "ok" });
});

router.use("/users", auth);

module.exports = router;
