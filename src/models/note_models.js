'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.Student, { as: 'student', foreignKey: 'studentId' });
      Note.belongsTo(models.Lesson, { as: 'lesson', foreignKey: 'lessonId' });
    }
  }

  Note.init({
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
    modelName: 'Note',
  });

  return Note;
};
