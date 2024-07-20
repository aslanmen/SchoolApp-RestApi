'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.hasMany(models.StudentClass, {
          foreignKey: 'classId',
          as: 'studentClasses',
      });
      Class.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher',
      });
  }
  }

  Class.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Class',
  });

  return Class;
};
