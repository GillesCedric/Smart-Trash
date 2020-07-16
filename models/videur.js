'use strict';
const {
  Model
} = require('sequelize');
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
    numCni: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    tel: DataTypes.CHAR,
    isActivated: DataTypes.BOOLEAN,
    utilisateurNumCni: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Videur',
  });
  return Videur;
};