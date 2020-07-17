'use strict';
const {
  Model
} = require('sequelize');
const Poubelle = require('./poubelle');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Notification.belongsTo(models.Poubelle, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  };
  Notification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    poubelleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Poubelle,
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};