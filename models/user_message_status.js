'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_message_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 关联到 Message 表
      User_message_status.belongsTo(models.Message, {
        foreignKey: 'message_id',
        targetKey: 'id'
      });
      // 关联到 User 表
      User_message_status.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id'
      });
    }
  }
  User_message_status.init({
    receiver_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    message_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    is_read: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User_message_status',
    tableName: 'user_message_statuses', // 设置表名
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['message_id']
      },
      {
        unique: true,
        fields: ['user_id', 'message_id']
      }
    ]
  });
  return User_message_status;
};