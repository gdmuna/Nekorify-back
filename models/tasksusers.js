'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TasksUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TasksUsers.init({
    task_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    executor_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'TasksUsers',
    tableName: 'tasks_users', // 设置表名
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
  });
  return TasksUsers;
};