'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isActivated: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.BOOLEAN
      },
      poubelleId: {
        allowNull: true,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'Poubelles',
          key: 'id'
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
    await queryInterface.dropTable('Notifications');
  }
};