const log = require('../libs/logger');
const entityService = require('../services/entityService');

const SocketApi = {
  'get-list': async (socket, data) => {
    try {
      const result = await entityService.getList();
      socket.emit('set-list', result);
    } catch (err) {
      log.error('socket.get-list', data, err);
    }
  },

  'get-by-id': async (socket, data) => {
    try {
      const result = await entityService.getById(data.id);
      socket.emit('set-by-id', result);
    } catch (err) {
      log.error('socket.get-by-id', data, err);
    }
  },
};

module.exports = SocketApi;
