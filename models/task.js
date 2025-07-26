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
      // define association here
    }
  }
  Task.init({
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    publisher: DataTypes.STRING,
    executor: DataTypes.STRING,
    start_time: DataTypes.DATE,
    ddl: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};