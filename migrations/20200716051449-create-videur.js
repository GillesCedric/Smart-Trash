'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Videurs', {
      numCni: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(30)
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
        unique: true,
        type: Sequelize.CHAR(9)
      },
      isActivated: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      utilisateurNumCni: {
        allowNull: true,
        type: Sequelize.STRING(30),
        references: {
          model: 'Utilisateurs',
          key: 'numCni'
        }
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
    await queryInterface.dropTable('Videurs');
  }
};