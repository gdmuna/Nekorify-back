'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.hasMany(models.User_message_status, {
        foreignKey: 'message_id',
        sourceKey: 'id'
      });
    }
  }
  Message.init({
    text: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages', // 设置表名
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        fields: ['name']
      }
    ]
  });
  return Message;
};