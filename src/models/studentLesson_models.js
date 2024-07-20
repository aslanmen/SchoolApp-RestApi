'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class StudentLesson extends Model {
    static associate(models) {
      StudentLesson.belongsTo(models.Student, {as:'student', foreignKey: 'studentId' });
      StudentLesson.belongsTo(models.Lesson, {as:'lesson', foreignKey: 'lessonId' });
    }
  }

  StudentLesson.init({
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id',
      }
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lessons',
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'StudentLesson',
  });

  return StudentLesson;
};
