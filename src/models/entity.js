const cfg = require('../../config');

module.exports = (sequelize, DataTypes) => {
  const paramsGenerator = () => {
    const result = {
      id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    };

    for (let i = 1; i <= cfg.get('paramNum'); i += 1) {
      result[`p${i}`] = {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: '0',
        validate: {
          max: cfg.get('maxValue'),
          min: cfg.get('minValue'),
        },
      };
    }
    return result;
  };

  const model = sequelize.define('entity', paramsGenerator(), {});

  return model;
};
