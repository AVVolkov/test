const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const helmet = require('helmet');
const pathLib = require('path');
const socket = require('socket.io');
const mustacheExpress = require('mustache-express');

const cfg = require('../../config');
const log = require('../libs/logger');
const pages = require('../routes/pages');
const api = require('../routes/api');
const socketApi = require('../routes/socketApi');
const GE = require('../libs/GE');

const Server = {
  server: null,
  socket: null,
  routerR: null,
  routerS: null,

  init() {
    if (this.server) {
      return;
    }

    this.server = http.Server(this.restRouter());
    this.server.listen(cfg.get('port'), cfg.get('host'), (err) => {
      if (err) {
        throw err;
      }

      log.info(`Server created on ${cfg.get('host')}:${cfg.get('port')}`);
    });
    this.socketRouter();
  },

  restRouter() {
    this.routerR = express();
    this.routerR.use(bodyParser.json({ limit: '5mb' }));
    this.routerR.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 50000 }));
    this.routerR.use(helmet());

    this.routerR.engine('mustache', mustacheExpress());
    this.routerR.set('view engine', 'mustache');
    this.routerR.set('views', pathLib.resolve(__dirname, '../views'));

    this.routerR.use((req, res, next) => {
      res.answer = (data, status) => this.answer(req, res, data, status);
      res.error = (message, status) => this.error(req, res, message, status);

      const {
        method, path, body, query,
      } = req;
      req.methodPath = `${method}:${path}`;
      req.flds = (method === 'GET' ? query : body);

      log.info(req.methodPath, { body, query });

      next(null);
    });

    this.routerR.use('/static', express.static(pathLib.resolve(__dirname, '../public')));
    this.routerR.use('/', pages);
    this.routerR.use('/v1', api);

    return this.routerR;
  },

  socketRouter() {
    this.routerS = socket(this.server);

    this.routerS.on('connection', (s) => {
      log.debug('User connected');

      s.join('upsert');

      this.socket = s;

      Object.keys(socketApi).forEach((route) => {
        s.on(route, (data) => socketApi[route](s, data));
      });
    });

    GE.on('socket', (data) => {
      this.routerS.to('upsert').emit(data.event, data.data);
    });

    this.routerS.on('disconnect', (s) => {
      s.disconnect();
    });
  },

  answer(req, res, data, status = 200) {
    return res.status(status).send({ status, data });
  },

  error(req, res, err, status = 400) {
    const {
      body, query,
    } = req;

    if (typeof err !== 'string') {
      log.error(req.methodPath, { body, query, err });

      return this.answer(req, res, { message: 'Unknown error' }, 500);
    }

    log.warn(req.methodPath, { body, query, err });
    return this.answer(req, res, { message: err }, status);
  },
};

module.exports = Server;
