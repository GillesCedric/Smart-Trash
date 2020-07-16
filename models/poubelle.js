'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poubelle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Poubelle.hasMany(models.Notification);
      models.Poubelle.hasMany(models.Sms);
      models.Poubelle.belongsTo(models.Utilisateur, {
        foreignKey: {
          allowNull: false
        }
      });
      models.Poubelle.belongsTo(models.Videur, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  };
  Poubelle.init({
    marque: DataTypes.STRING,
    dimensions: DataTypes.STRING,
    adresseIp: DataTypes.STRING,
    etat: DataTypes.ENUM,
    niveau: DataTypes.INTEGER,
    isActivated: DataTypes.BOOLEAN,
    utilisateurNumCni: DataTypes.STRING,
    videurNumCni: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Poubelle',
  });
  return Poubelle;
};