const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database');
const { Lesson, Teacher ,StudentLesson,Student} = require('../models');
exports.getAllLessons = (req, res) => {
  Lesson.findAll({
    include:[{
      model:Teacher,
      as:'teacher',
      attributes:['id','name','surname','email','tel']
      }
    ]
    
  })
    .then(lessons => {
      res.status(200).json({ lessons });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

exports.getLessonById = (req, res) => {
  Lesson.findByPk(req.params.id, {
    include:[{
      model:Teacher,
      as:'teacher',
      attributes:['id','name','surname','email','tel']
      }
    ]
    
  })
    .then(lesson => {
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      res.status(200).json({ lesson });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

exports.createLesson = (req, res) => {
  const { name, description, teacherId } = req.body;

  Teacher.findByPk(teacherId)
    .then(teacher => {
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      return Lesson.create({ name, description, teacherId });
    })
    .then(lesson => {
      res.status(201).json(lesson);
    })
    .catch(error => {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
};



exports.addStudentsToLesson = (req, res) => {
  const lessonId = req.params.id; 
  const { studentIds } = req.body; 


  Student.findAll({
    where: {
      id: studentIds
    }
  })
    .then(students => {
      if (students.length !== studentIds.length) {
        return res.status(404).json({ error: 'One or more students not found' });
      }

 
      const studentLessonPromises = studentIds.map(studentId => {
        return StudentLesson.findOrCreate({
          where: {
            lessonId: lessonId,
            studentId: studentId
          }
        });
      });

      return Promise.all(studentLessonPromises)
        .then(results => {
          
          const newStudentsCount = results.filter(result => result[1]).length;
          res.status(201).json({ message: `${newStudentsCount} students added to lesson` });
        });
    })
    .catch(error => {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
};


exports.getStudentsInLesson = (req, res) => {
  const lessonId = req.params.id;

 
  StudentLesson.findAll({
    where: { lessonId },
    include: [{
      model: Student,
      as: 'student', 
      attributes: ['id', 'name', 'surname', 'email', 'tel']
    }]
  })
    .then(studentLessons => {
      if (studentLessons.length === 0) {
        return res.status(404).json({ error: 'No students found for this lesson' });
      }

      
      const students = studentLessons.map(studentLesson => studentLesson.student);
      res.status(200).json(students);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

// exports.deleteStudentFromLesson = (req, res) => {
//   const lessonId = req.params.lessonId;
//   const studentId = req.params.studentId;

//   StudentLesson.destroy({
//     where: { lessonId, studentId }
//   })
//     .then(deletedRows => {
//       if (deletedRows === 0) {
//         return res.status(404).json({ error: 'Student not found in this lesson' });
//       }

//       res.status(200).json({ message: 'Student removed from lesson' });
//     })
//     .catch(error => {
//       res.status(500).json({ error: error.message });
//     });
// };
exports.deleteStudentFromLesson = async (req, res) => {
  const lessonId = req.params.id;
  const { studentIds } = req.body; 

  try {
 
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'Geçersiz giriş: studentIds boş olmayan bir dizi olmalıdır' });
    }

   
    const studentLessons = await StudentLesson.findAll({
      where: {
        lessonId,
        studentId: studentIds
      }
    });

  
    const existingStudentIds = studentLessons.map(sl => sl.studentId);

    
    const studentsToDelete = studentIds.filter(id => existingStudentIds.includes(id));

  
    if (studentsToDelete.length === 0) {
      return res.status(404).json({ error: 'Belirtilen öğrenciler bu derste bulunamadı' });
    }

   
    await StudentLesson.destroy({
      where: {
        lessonId,
        studentId: studentsToDelete
      }
    });

    res.status(200).json({ message: 'Öğrenciler dersten başarıyla silindi', deletedStudentIds: studentsToDelete });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateLesson = (req, res) => {
  const {teacherId}=req.body
  Teacher.findByPk(teacherId)
  .then(teacher=>{
    if(!teacher){
      return res.status(404).json({ error: 'Teacher not found' });
    }
    Lesson.update(req.body, { where: { id: req.params.id } })
    .then(affectedRows => {
      if (affectedRows[0] === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      res.status(200).json({ message: 'Lesson updated successfully' });
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(error => error.message);
        res.status(400).json({ error: errors });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  })
  
};

exports.deleteLesson = (req, res) => {
  Lesson.destroy({ where: { id: req.params.id } })
    .then(affectedRows => {
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      res.status(200).json({ message: 'Lesson deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};
