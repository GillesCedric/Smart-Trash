'use strict';
const {
  Model
} = require('sequelize');
const Utilisateur = require('./utilisateur');
const Videur = require('./videur');
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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marque: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adresseIp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    etat: {
      type: DataTypes.ENUM,
      values: ['Pleine', 'Moitié Pleine', 'Vide'],
      defaultValue: 'Vide'
    },
    niveau: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    utilisateurNumCni: {
      type: DataTypes.STRING,
      references: {
        model: Utilisateur,
        key: 'numCni',
      }
    },
    videurNumCni: {
      type: DataTypes.STRING,
      references: {
        model: Videur,
        key: 'numCni',
      }
    }
  }, {
    sequelize,
    modelName: 'Poubelle',
  });
  return Poubelle;
};