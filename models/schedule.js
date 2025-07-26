'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedule.init({
    year: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    month: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    day: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    department: {
      allowNull: false,
      type: DataTypes.STRING
    },
    plan: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Schedule',
    paranoid: true, // 启用软删除
    deletedAt: 'deletedAt', // 设置软删除字段名
    indexes: [
      {
        fields: ['year', 'month', 'day'],
      }
    ]
  });
  return Schedule;
};