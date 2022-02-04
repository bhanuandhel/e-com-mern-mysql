const { Sequelize } = require("sequelize");
require("dotenv").config();

const HOSTNAME = process.env.DB_HOST || 'sql6.freemysqlhosting.net';
const DATABASE = process.env.DB_DATABASE || 'sql6469426';
const USERNAME = process.env.DB_USER || 'sql6469426';
const PASSWORD = process.env.DB_USER=='root' ?'' : 'gErX8DuuBE'

console.log('--------------------------------------------------', PASSWORD, '--------------------')
const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOSTNAME,
  dialect: "mysql",
  logging: true,
  pool: { max: 5, min: 0, idle: 10000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  // .catch((err) => {
  //   console.log("Error " + err);
  // });

module.exports = sequelize;
