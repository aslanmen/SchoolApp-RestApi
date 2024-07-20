// teacherController.js

//const Teacher = require('../models/teacher_models'); 
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Teacher ,Lesson,StudentLesson,Student,Note} = require('../models');
const {generateAccessTokenTeacher}=require('../helpers/token')
const sendMail=require('../helpers/mailer')

exports.getAllTeachers = (req, res) => {
    Teacher.findAll()
        .then(teachers => {
            res.status(200).json({ teachers });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.signUp = (req, res) => {
  
    Teacher.findOne({ where: { email: req.body.email } }).then(existingTeacher => {
        if (existingTeacher) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const mailPassword=req.body.password
            req.body.password = hash;

            Teacher.create(req.body)
                .then(newTeacher => {
                    const token = generateAccessTokenTeacher(newTeacher.id);
                    newTeacher.update({ accessToken: token }).then(() => {
                      const subject = 'Kayıt Onayı';
                      const text = `Merhaba ${newTeacher.name},\n\nKayıt işleminiz başarıyla tamamlandı!\n\nE-posta: ${newTeacher.email}\n\nŞifre: ${mailPassword}\n\nTeşekkürler,\nOkul Yönetimi`;
                      sendMail(newTeacher.email, subject, text);
                      res.status(201).json({ teacher: newTeacher, token });
                    }).catch(err => {
                        res.status(500).json({ error: err.message });
                    });
                })
                .catch(err => {
                    if (err.name === 'SequelizeValidationError') {
                        const errors = err.errors.map(error => error.message);
                        res.status(400).json({ error: errors });
                    } else {
                        res.status(500).json({ error: err.message });
                    }
                });
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
};

exports.signIn= (req, res) => {
    const { email, password } = req.body;

    Teacher.findOne({ where: { email } })
        .then(teacher => {
            if (!teacher) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            return bcrypt.compare(password, teacher.password)
                .then(result => {
                    if (!result) {
                        return res.status(401).json({ message: 'Authentication failed' });
                    }

                    const token = generateAccessTokenTeacher(teacher.id);

                    return Teacher.update(
                        { accessToken: token },
                        { where: { id: teacher.id } }
                    ).then(() => {
                        return Teacher.findOne({
                            where: { id: teacher.id },
                            attributes: { exclude: ['password'] }
                        });
                    }).then(updatedTeacher => {
                        res.status(200).json({
                            message: 'Auth successful',
                            teacher: updatedTeacher,
                            token: token
                        });
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
};

exports.getTeacherById = (req, res) => {
    Teacher.findByPk(req.params.id)
        .then(teacher => {
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.status(200).json({ teacher });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateTeacher = (req, res) => {
    
    if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            req.body.password = hash;

            Teacher.update(req.body, { where: { id: req.params.id } })
                .then(affectedRows => {
                    if (affectedRows[0] === 0) {
                        return res.status(404).json({ error: 'Teacher not found' });
                    }
                    res.status(200).json({ message: 'Teacher updated successfully' });
                })
                .catch(err => {
                    res.status(500).json({ error: err.message });
                });
        });
    } else {
        Teacher.update(req.body, { where: { id: req.params.id } })
            .then(affectedRows => {
                if (affectedRows[0] === 0) {
                    return res.status(404).json({ error: 'Teacher not found' });
                }
                res.status(200).json({ message: 'Teacher updated successfully' });
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    }
};

exports.deleteTeacher = (req, res) => {
    Teacher.destroy({ where: { id: req.params.id } })
        .then(affectedRows => {
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.status(200).json({ message: 'Teacher deleted successfully' });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};
exports.giveNote = (req, res) => {
    const { lessonId, studentId, note } = req.body;
    const teacherId = req.params.id;
  
    Lesson.findOne({
      where: { id: lessonId, teacherId },
      include: [{
        model: Teacher,
        as: 'teacher'
      }]
    })
    .then(lesson => {
      if (!lesson) {
        return res.status(404).json({ error: 'Teacher is not assigned to this lesson' });
      }
  
      return StudentLesson.findOne({
        where: {
          studentId,
          lessonId
        }
      })
   
    .then(studentLesson => {
      if (!studentLesson) {
        return res.status(404).json({ error: 'Student is not enrolled in this lesson' });
      }
      return Note.findOne({
        where: {
          studentId,
          lessonId
        }
      })
      .then(notes => {
        if(notes){
            return res.status(400).json({ error: 'Student has already given a note for this lesson' });
        }
    return Note.create({ note, studentId, lessonId })
    
    .then(note => {
      res.status(201).json(note);
     })
    .catch(error => {
      console.error('Error details:', error);
      res.status(500).json({ error: 'An error occurred while giving the note', details: error.message });
    });
      })
      
     })
     })
  };
  exports.getNotesByLesson = (req, res) => {
    const teacherId = req.params.id;
  
    Note.findAll({
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: Lesson,
          as: 'lesson',
          where: { teacherId }
        }
      ]
    })
    .then(notes => {
      if (notes.length === 0) {
        return res.status(404).json({ error: 'No notes found for this teacher' });
      }
      res.status(200).json(notes);
    })
    .catch(error => {
      console.error('Error details:', error);
      res.status(500).json({ error: 'An error occurred while fetching notes', details: error.message });
    });
  };
  exports.updateNote = (req, res) => {
    const { lessonId, studentId, note } = req.body;
    const teacherId = req.params.id;
  
    Lesson.findOne({
      where: { id: lessonId, teacherId }
    })
    .then(lesson => {
      if (!lesson) {
        return res.status(404).json({ error: 'Teacher is not assigned to this lesson' });
      }
  
      return Note.findOne({
        where: { studentId, lessonId }
      });
    })
    .then(existingNote => {
      if (!existingNote) {
        return res.status(404).json({ error: 'No note found for this student in this lesson' });
      }
  
      return existingNote.update({ note });
    })
    .then(updatedNote => {
      res.status(200).json(updatedNote);
    })
    .catch(error => {
      console.error('Error details:', error);
      res.status(500).json({ error: 'An error occurred while updating the note', details: error.message });
    });
  };
  exports.deleteNote = (req, res) => {
    const { lessonId, studentId } = req.body;
    const teacherId = req.params.id;

    Lesson.findOne({
      where: { id: lessonId, teacherId }
    })
    .then(lesson => {
      if (!lesson) {
        return res.status(404).json({ error: 'Teacher is not assigned to this lesson' });
      }

      return Note.findOne({
        where: { studentId, lessonId }
      })
    
    .then(existingNote => {
      if (!existingNote) {
        return res.status(404).json({ error: 'No note found for this student in this lesson' });
      }

      return existingNote.destroy()
    .then(() => {
      return res.status(200).json({message:'note deleted'}); // veya res.status(204).send();
    })
    .catch(error => {
      console.error('Error details:', error);
      res.status(500).json({ error: 'An error occurred while deleting the note', details: error.message });
    });
})

})
};
