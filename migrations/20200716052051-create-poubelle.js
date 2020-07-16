'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Poubelles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      marque: {
        allowNull: true,
        type: Sequelize.STRING(15)
      },
      dimensions: {
        allowNull: true,
        type: Sequelize.STRING(10)
      },
      adresseIp: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      etat: {
        allowNull: false,
        type: Sequelize.ENUM('Pleine', 'Moitié Pleine', 'Vide'),
        defaultValue: 'Vide'
      },
      niveau: {
        allowNull: false,
        type: Sequelize.INTEGER
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
      videurNumCni: {
        allowNull: true,
        type: Sequelize.STRING(30),
        references: {
          model: 'Videurs',
          key: 'numCni'
        }
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Poubelles');
  }
};