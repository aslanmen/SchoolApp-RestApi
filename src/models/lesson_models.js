'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher',
      });
     Lesson.hasMany(models.StudentLesson,{
      foreignKey:'lessonId',
      as:'studentLessons',
     
     })
       Lesson.hasMany(models.Note, {
         foreignKey: 'lessonId',
         as: 'notes',
       });
    }
  }

  Lesson.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    teacherId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Teachers',
          key: 'id',
        },
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Lesson',
  });

  return Lesson;
};
