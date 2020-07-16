'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Sms.belongsTo(models.Poubelle, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  };
  Sms.init({
    message: DataTypes.STRING,
    poubelleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sms',
  });
  return Sms;
};