'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Replay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Replay.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    department: {
      allowNull: false,
      type: DataTypes.STRING
    },
    video_url: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    cover_url: {
      allowNull: false,
      type: DataTypes.STRING
    },
    views: {
      allowNull: false,
      type: DataTypes.STRING
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Replay',
    paranoid: true, // 启用软删除 
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        unique: true,
        fields: ['title', 'video_url', 'cover_url']
      }
    ]
  });
  return Replay;
};