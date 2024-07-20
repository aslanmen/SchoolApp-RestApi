'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class StudentClass extends Model {
    static associate(models) {
      // StudentClass - Student: Belongs to
      StudentClass.belongsTo(models.Student, {  as: 'student', foreignKey: 'studentId'  });

      // StudentClass - Class: Belongs to
      StudentClass.belongsTo(models.Class, {as:'class', foreignKey: 'classId' });
    }
  }

  StudentClass.init({
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id',
      }
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id',
        onDelete: 'CASCADE'
      }
    }
  }, {
    sequelize,
    modelName: 'StudentClass',
  });

  return StudentClass;
};
