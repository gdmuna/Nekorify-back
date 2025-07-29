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
      // define association here
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
      }
    ]
  });
  return Announcement;
};