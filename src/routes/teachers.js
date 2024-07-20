// teacherRoutes.js

const { Router } = require('express');
const teacherController = require('../controller/teacherController');
const authTeacher=require('../middleware/teacher_check_auth')
const authManager = require('../middleware/manager_check_auth')
const router = Router();

router.get('/teachers', authManager,teacherController.getAllTeachers);
router.post('/teachers/signup',authManager,teacherController.signUp);
router.post('/teachers/signin', teacherController.signIn);
router.post('/teachers/:id/notes',authTeacher, teacherController.giveNote)
router.get('/teachers/:id/notes', authTeacher,teacherController.getNotesByLesson)
router.patch('/teachers/:id/notes', authTeacher,teacherController.updateNote)
router.delete('/teachers/:id/notes', authTeacher,teacherController.deleteNote);
router.get('/teachers/:id', authManager,teacherController.getTeacherById);
router.patch('/teachers/:id', authManager,teacherController.updateTeacher);
router.delete('/teachers/:id',authManager, teacherController.deleteTeacher);

module.exports = router;



/*const { Router } = require('express');
const Teacher = require('../models/teacher_models'); 
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')



const router = Router();

const teacher = Teacher(sequelize, DataTypes); 
teacher.sync(); 


router.get('/teachers',(req, res) => {
    teacher.findAll()
        .then(teachers => {
            res.status(200).json({ teachers });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});


router.post('/teachers/signup', (req, res) => {
    teacher.findOne({ where: { email: req.body.email } }).then(existingTeacher => {
      if (existingTeacher) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        req.body.password = hash;
  
        teacher.create(req.body)
          .then(newTeacher => {
            res.status(201).json({ teacher: newTeacher });
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
  });
  router.post('/teachers/signin', (req, res) => {
    const { email, password } = req.body;
    teacher.findOne({ where: { email } }).then(teacher => {
        if (!teacher) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        bcrypt.compare(password, teacher.password, (err, result) => {
            if (err) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            if (result) {
                const token = jwt.sign({
                    email: teacher.email,
                    id: teacher.id,
                  
                }, process.env.JWT_KEY_TEACHER, {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            } else {
                return res.status(401).json({ message: 'Authentication failed' });
            }
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});


router.get('/teachers/:id',(req, res) => {
    teacher.findByPk(req.params.id)
        .then(teacher => {
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.status(200).json({ teacher });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});


router.patch('/teachers/:id', (req, res) => {
    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        req.body.password = hash;
  
        teacher.update(req.body, { where: { id: req.params.id } })
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
      teacher.update(req.body, { where: { id: req.params.id } })
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
  });


router.delete('/teachers/:id',(req, res) => {
    teacher.destroy({ where: { id: req.params.id } })
        .then(affectedRows => {
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.status(200).json({ message: 'Teacher deleted successfully' });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;*/
