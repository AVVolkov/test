const { entityModel } = require('../models');
const GE = require('../libs/GE');

const EntityService = {
  async upsert(data) {
    await entityModel.upsert(data);
    const result = await entityModel.findByPk(data.id);

    GE.emit('socket', {
      event: 'upsert',
      data: result.get(''),
    });

    return 'Successfully upserted';
  },

  getList() {
    return entityModel.findAll();
  },

  async getById(id) {
    const res = await entityModel.findByPk(id);

    if (!res) {
      return {
        id,
        error: 'Invalid Id',
      };
    }

    return {
      id,
      data: res.get(''),
    };
  },
};

module.exports = EntityService;
