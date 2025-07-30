'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 关联到用户消息状态表
      this.hasMany(models.User_message_status, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      });
      // 关联到文章表
      this.hasMany(models.Article, {
        foreignKey: 'author_id',
        sourceKey: 'id'
      });
      // 关联到任务用户表
      this.belongsToMany(models.Task, {
        through: 'TasksUsers',
        foreignKey: 'executor_id',
        otherKey: 'task_id',
      });
    }
  }
  User.init({
    stu_id: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sso_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    last_signin_time: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    is_frozen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '用于标记用户是否被冻结'
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt',// 设置软删除字段名
    indexes: [
      {
        unique: true,
        fields: ['stu_id']
      },
      {
        unique: true,
        fields: ['sso_id']
      }
    ]
  });
  return User;
};