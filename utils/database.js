const { Sequelize } = require("sequelize");
require("dotenv").config();

const HOSTNAME =  'sql6.freemysqlhosting.net';
const DATABASE =  'sql6469426';
const USERNAME =  'sql6469426';
const PASSWORD =  'gErX8DuuBE'

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
