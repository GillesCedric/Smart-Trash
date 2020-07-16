'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Utilisateur.hasMany(models.Poubelle);
      models.Utilisateur.hasMany(models.Videur);
    }
  };
  Utilisateur.init({
    numCni: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    tel: DataTypes.CHAR,
    login: DataTypes.STRING,
    mail: DataTypes.STRING,
    password: DataTypes.STRING,
    isActivated: DataTypes.BOOLEAN,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};