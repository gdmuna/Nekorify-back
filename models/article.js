'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsTo(models.User, {
        foreignKey: 'author_id',
        targetKey: 'id'
      });
    }
  }
  Article.init({
    author_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    cover_url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    cover_width: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    cover_height: {
      allowNull: true,
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
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'articles', // 设置表名
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        fields: ['author_id']
      },
      {
        fields: ['author_id', 'id']
      },
      {
        unique: true,
        fields: ['title', 'author']
      }
    ]
  });
  return Article;
};