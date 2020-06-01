const bunyan = require('bunyan');
const PrettyStream = require('bunyan-pretty-colors');
const cfg = require('../../config');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const log = bunyan.createLogger({
  name: cfg.get('logger.name'),
  level: cfg.get('logger.level'),
  streams: [{
    level: 'debug',
    type: 'raw',
    stream: prettyStdOut,
  }],
});

module.exports = log;
