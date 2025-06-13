const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('webapp_db', 'root', 'b5fbe1eb-d8bd-40af-ba41-c694ebc67e76', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;