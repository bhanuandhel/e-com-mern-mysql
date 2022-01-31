const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize('sql6469426', 'sql6469426', 'gErX8DuuBE', {
  host: 'sql6.freemysqlhosting.net',
  dialect: "mysql",
  logging: true,
  pool: { max: 5, min: 0, idle: 10000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("Error " + err);
  });

module.exports = sequelize;
