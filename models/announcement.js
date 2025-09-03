'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 关联到用户表
      Announcement.belongsTo(models.User, {
        foreignKey: 'author_id',
        sourceKey: 'id'
      });
    }
  }
  Announcement.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    cover_url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    author_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    author: {
      allowNull: false,
      type: DataTypes.STRING
    },
    department: {
      allowNull: false,
      type: DataTypes.STRING
    },
    text_md_url: {
      allowNull: false,
      type: DataTypes.STRING
    },
    views: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      defaultValue: 'draft',
      type: DataTypes.ENUM('draft', 'published', 'archived','banned','deleted')
    },
    is_top: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Announcement',
    tableName: 'announcements', // 设置表名
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        unique: true,
        fields: ['title', 'author']
      },
      {
        fields: ['author_id']
      }
    ]
  });
  return Announcement;
};