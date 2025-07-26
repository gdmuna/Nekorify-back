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
    title: DataTypes.STRING,
    department: DataTypes.STRING,
    video_url: DataTypes.TEXT,
    cover_url: DataTypes.STRING,
    views: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Replay',
  });
  return Replay;
};