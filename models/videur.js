'use strict';
const {
  Model
} = require('sequelize');
const Utilisateur = require('./utilisateur');
module.exports = (sequelize, DataTypes) => {
  class Videur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Videur.hasMany(models.Poubelle);
      models.Videur.belongsTo(models.Utilisateur, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  };
  Videur.init({
    numCni: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tel: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
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
    }
  }, {
    sequelize,
    modelName: 'Videur',
  });
  return Videur;
};