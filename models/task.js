'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 关联到用户表
      Task.belongsTo(models.User, {
        foreignKey: 'executor_id',
        targetKey: 'id',
      });
    }
  }
  Task.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    publish_department: {
      allowNull: false,
      type: DataTypes.STRING
    },
    executor_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    start_time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    ddl: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks', // 设置表名
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        fields: ['executor_id'],
      }
    ],
  });
  return Task;
};