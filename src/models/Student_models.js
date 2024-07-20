'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.hasMany(models.StudentClass, {
        foreignKey: 'studentId',
        as: 'studentClasses',
    });
       Student.hasMany(models.StudentLesson,{
        foreignKey: 'studentId',
        as: 'studentLessons',
       })
       Student.hasMany(models.Note, {
         foreignKey: 'studentId',
         as: 'notes',
       });
    }
  }

  Student.init({
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      tel:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [11, 11]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profileImage: { 
        type: DataTypes.STRING,
        allowNull: true
      }
     
  }, {
    sequelize,
    modelName: 'Student',
  });

  return Student;
};
