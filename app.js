const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const app = express();
require("dotenv").config();

const routes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database connected
sequelize.sync({ force: false }).then(() => {
  console.log("yes re sync");
});

// routing call
app.use("/api", routes);

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
