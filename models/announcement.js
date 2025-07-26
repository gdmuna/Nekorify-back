'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Announcement.init({
    title: DataTypes.STRING,
    cover_url: DataTypes.STRING,
    author: DataTypes.STRING,
    department: DataTypes.STRING,
    text_md_url: DataTypes.STRING,
    views: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Announcement',
  });
  return Announcement;
};