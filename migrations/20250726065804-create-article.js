'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cover_url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      cover_width: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      cover_height: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      author: {
        allowNull: false,
        type: Sequelize.STRING
      },
      department: {
        allowNull: false,
        type: Sequelize.STRING
      },
      text_md_url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      views: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        defaultValue: 'draft',
        type: Sequelize.ENUM('draft', 'published', 'archived', 'banned', 'deleted')
      },
      is_top: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('articles');
  }
};