const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const cfg = require('../../config');

const sequelize = new Sequelize(
  cfg.get('connections.db.database'),
  cfg.get('connections.db.username'),
  cfg.get('connections.db.password'),
  {
    host: cfg.get('connections.db.host'),
    dialect: cfg.get('connections.db.dialect'),
  },
);

const db = {};
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[`${model.name}Model`] = model;
  });

sequelize.sync();

db.connection = sequelize;
db.Seq = Sequelize;

module.exports = db;
