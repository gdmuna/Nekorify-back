'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stu_id: {
        allowNull: false,
        type: Sequelize.STRING(16)
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sso_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      last_signin_time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      // 用于标记用户是否被冻结
      is_frozen: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
        comment: '用于标记用户是否被冻结'
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};