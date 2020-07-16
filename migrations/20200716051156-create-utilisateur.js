'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Utilisateurs', {
      numCni: {
        type: Sequelize.STRING(30),
        allowNull: false,
        primaryKey: true,
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING(15)
      },
      prenom: {
        allowNull: false,
        type: Sequelize.STRING(15)
      },
      tel: {
        allowNull: false,
        type: Sequelize.CHAR(9),
        unique: true
      },
      login: {
        allowNull: false,
        type: Sequelize.STRING(10),
        unique: true
      },
      mail: {
        allowNull: false,
        type: Sequelize.STRING(45),
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isActivated: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Utilisateurs');
  }
};