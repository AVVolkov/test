const convict = require('convict');
const configSchema = require('./config.schema.json');

const config = convict(configSchema);
config
  .loadFile(`${__dirname}/config.${config.get('env')}.json`)
  .validate();

module.exports = config;
