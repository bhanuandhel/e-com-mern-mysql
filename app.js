const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const app = express();
require("dotenv").config();
const errorMiddleware = require("./middlewares/error");


const routes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handling Uncaught Exception
// console.log(youtube)
// ReferenceError: youtube is not defined

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})


// database connected
sequelize.sync({ force: false }).then(() => {
  console.log("yes re sync");
});

// routing call
app.use("/api", routes);

app.use(errorMiddleware);

// server start
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

// Unhandled Promise Rejection(like jub database name ya root name wrong add kr de)
process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    })
})
