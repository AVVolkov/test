const log = require('./src/libs/logger');
const server = require('./src/www/server');

server.init();

process
  .on('unhandledRejection', (err) => {
    log.error('unhandledRejection', err);
  })
  .on('uncaughtException', (err) => {
    log.error('uncaughtException', err);
    if (err.message.indexOf('EMFILE') !== -1 || err.message.indexOf('EADDRINUSE') !== -1) {
      process.exit(1);
    }
  });
