const sequelize = require('../../database');
const Sequelize = require('sequelize');
const TeacherModel = require('./teacher_models');
const LessonModel = require('./lesson_models');
const NoteModel = require('./note_models');
const StudentModel = require('./Student_models')
const StudentLessonModel = require('./studentLesson_models')
const StudentClassModel=require('./studentClass_model');
const ClassModel = require('./class_models');
const ManagerModel = require('./manager_models')

const Teacher = TeacherModel(sequelize, Sequelize.DataTypes);
const Lesson = LessonModel(sequelize, Sequelize.DataTypes);
const Note = NoteModel(sequelize, Sequelize.DataTypes)
const Student = StudentModel(sequelize, Sequelize.DataTypes)
const StudentLesson = StudentLessonModel(sequelize, Sequelize.DataTypes)
const StudentClass = StudentClassModel(sequelize, Sequelize.DataTypes)
const Class = ClassModel(sequelize, Sequelize.DataTypes)
const Manager=ManagerModel(sequelize,Sequelize.DataTypes)

Teacher.associate({ Lesson,Class });
Lesson.associate({ Teacher ,Student,StudentLesson,Note});
Student.associate({ Lesson,StudentClass,StudentLesson,Note});
StudentLesson.associate({Student,Lesson});
StudentClass.associate({Student,Class})
Class.associate({StudentClass,Teacher})

Note.associate({Student,Lesson})

const syncModels = async () => {
  await sequelize.sync({alter: true });
  console.log("Database & tables created!");
};

module.exports = {
  Teacher,
  Lesson,
  Student,
  StudentLesson,
  StudentClass,
  Class,
  Note,
  Manager,
  sequelize,
  syncModels
};
