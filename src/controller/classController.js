// classController.js


const sequelize = require('../../database');
const { Sequelize, DataTypes } = require('sequelize');
const {Class,StudentClass,Student,Teacher, Lesson,StudentLesson} = require('../models');

exports.getAllClasses = (req, res) => {
    Class.findAll({
        include: [{
            model: StudentClass,
            as: 'studentClasses',
            include: [{
                model:Student,
                as:'student',
                attributes: ['id','name', 'surname', 'email','tel'],
            }] 
        }, {
            model: Teacher,
            as: 'teacher', 
            attributes: ['id', 'name', 'surname'], 
        }
    
    ]
    })
        .then(classes => {
            res.status(200).json({ classes });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.createClass = (req, res) => {
    Teacher.findByPk(req.body.teacherId)
    .then(teacher => {
        if(!teacher){
            return res.status(404).json({ error: 'Teacher not found' });
        }
        Class.create(req.body)
        .then(clas => {
            res.status(201).json({ clas });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
    })

   
};
exports.addStudent= async(req, res) => {
    const  classId  = req.params.id;
  const { studentId } = req.body;

  try {
    
    const classInstance = await Class.findByPk(classId);
    const studentInstance = await Student.findByPk(studentId);
    console.log(classId)
    if (!classInstance) {
      return res.status(404).json({ error: 'Sınıf bulunamadı' });
    }
    if (!studentInstance) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }

    
    const studentLessons = await StudentLesson.findAll({ where: { studentId } });

   
    let isTeacherMatch = false;
    for (const studentLesson of studentLessons) {
      const lesson = await Lesson.findByPk(studentLesson.lessonId);
      if (lesson.teacherId === classInstance.teacherId) {
        isTeacherMatch = true;
        break;
      }
    }

    if (!isTeacherMatch) {
      return res.status(400).json({ error: 'Öğrencinin aldığı derslerin öğretmeni bu sınıfta değil' });
    }

    
    await StudentClass.create({ classId, studentId });

    res.status(201).json({ message: 'Öğrenci sınıfa başarıyla kaydedildi' });
  } catch (error) {
    res.status(500).json({ error: 'Bir hata oluştu', details: error.message });
  }
    
}
exports.deleteStudent = async (req, res) => {
  const classId = req.params.id;
  const { studentId } = req.body;

  try {

    const studentClassInstance = await StudentClass.findOne({ where: { classId, studentId } });

    if (!studentClassInstance) {
      return res.status(404).json({ error: 'Öğrenci bu sınıfta kayıtlı değil' });
    }

    
    await studentClassInstance.destroy();

    res.status(200).json({ message: 'Öğrenci sınıftan başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Bir hata oluştu', details: error.message });
  }
};

exports.getClassById = (req, res) => {
    Class.findByPk(req.params.id,{
        include: [{
            model: StudentClass,
            as: 'studentClasses',
            include: [{
                model:Student,
                as:'student',
                attributes: ['id','name', 'surname', 'email','tel'],
            }] 
        }, {
            model: Teacher,
            as: 'teacher', 
            attributes: ['id', 'name', 'surname'], 
        }
    
    ]
    })
        .then(clas => {
            if (!clas) {
                return res.status(404).json({ error: 'Class not found' });
            }
            res.status(200).json({ clas });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateClass = (req, res) => {
    Class.update(req.body, { where: { id: req.params.id } })
        .then(affectedRows => {
            if (affectedRows[0] === 0) {
                return res.status(404).json({ error: 'Class not found' });
            }
            res.status(200).json({ message: 'Class updated successfully' });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};
exports.deleteClass = async (req, res) => {
    const classId = req.params.id;
  
    if (!classId) {
      return res.status(400).json({ error: 'classId parametresi eksik' });
    }
  
    try {
      
      await StudentClass.destroy({ where: { classId } });
  
      
      const result = await Class.destroy({ where: { id: classId } });
  
      if (result) {
        res.status(200).json({ message: 'Sınıf başarıyla silindi' });
      } else {
        res.status(404).json({ error: 'Sınıf bulunamadı' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Bir hata oluştu', details: error.message });
    }
  };
  