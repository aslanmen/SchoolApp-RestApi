// studentController.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const{generateAccessTokenStudent}=require('../helpers/token')

const { Student, Class, StudentClass,Note,Lesson ,StudentLesson} = require('../models'); 
const sendMail=require('../helpers/mailer')
const path = require('path');



exports.getAllStudents = (req, res) => {
    Student.findAll({
        include: [{
            model: StudentClass,
            as: 'studentClasses',
            attributes:['classId'],
            include:[{
                model:Class,
                as:'class',
                attributes:['name']
            }]
        }]
    })
        .then(students => {
            res.status(200).json({ students });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.signUp = (req, res) => {
    Student.findOne({ where: { email: req.body.email } })
        .then(existingStudent => {
            if (existingStudent) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                var mailPassword=req.body.password
                req.body.password = hash;

                // Check if a file was uploaded and add the file path to the request body
                if (req.file) {
                    req.body.profileImage = path.join('uploads', req.file.filename);
                }

                Student.create(req.body)
                    .then(newStudent => {
                        const token = generateAccessTokenStudent(newStudent.id);
                        newStudent.update({ accessToken: token })
                            .then(() => {
                                const subject = 'Kayıt Onayı';
                                const text = `Merhaba ${newStudent.name},\n\nKayıt işleminiz başarıyla tamamlandı!\n\nE-posta: ${newStudent.email}\n\nŞifre: ${mailPassword}\n\nTeşekkürler,\nOkul Yönetimi`;
                                sendMail(newStudent.email, subject, text);
                                res.status(201).json({ student: newStudent, token });
                            })
                            .catch(err => {
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
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};


exports.signIn = (req, res) => {
    const { email, password } = req.body;

    Student.findOne({ where: { email } })
        .then(student => {
            if (!student) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            return bcrypt.compare(password, student.password)
                .then(result => {
                    if (!result) {
                        return res.status(401).json({ message: 'Authentication failed' });
                    }

                    const token = generateAccessTokenStudent(student.id);

                    return Student.update(
                        { accessToken: token },
                        { where: { id: student.id } }
                    ).then(() => {
                        return Student.findOne({
                            where: { id: student.id },
                            attributes: { exclude: ['password'] }
                        });
                    }).then(updatedStudent => {
                        res.status(200).json({
                            message: 'Auth successful',
                            student: updatedStudent,
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

exports.getStudentById = (req, res) => {
    Student.findByPk(req.params.id, {
        include: [{
            model: StudentClass,
            as: 'studentClasses',
            attributes:['classId'],
            include:[{
                model:Class,
                as:'class',
                attributes:['name']
            }],
        }]
    })
        .then(student => {
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }
            res.status(200).json({ student });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateStudent = (req, res) => {
    const studentId = req.params.id;
    const updateData = { ...req.body };

    if (updateData.password) {
        bcrypt.hash(updateData.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            updateData.password = hash;
            updateStudentData();
        });
    } else {
        updateStudentData();
    }

    function updateStudentData() {
        Student.update(updateData, { where: { id: studentId } })
            .then(affectedRows => {
                if (affectedRows[0] === 0) {
                    return res.status(404).json({ error: 'Öğrenci bulunamadı' });
                }

                
                if (req.body.classId) {
                    Class.findByPk(req.body.classId).then(existingClass => {
                        if (!existingClass) {
                            return res.status(400).json({ error: 'Geçersiz sınıf ID' });
                        }

                        
                        StudentClass.update(
                            { classId: req.body.classId },
                            { where: { studentId } }
                        ).then(() => {
                            res.status(200).json({ message: 'Öğrenci ve sınıf güncellendi' });
                        }).catch(err => {
                            res.status(500).json({ error: err.message });
                        });
                    }).catch(err => {
                        res.status(500).json({ error: err.message });
                    });
                } else {
                    res.status(200).json({ message: 'Öğrenci güncellendi' });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    }
};


exports.deleteStudent = (req, res) => {
    const studentId = req.params.id;

    
    StudentClass.destroy({ where: { studentId } })
        .then(() => {
            
            return Student.destroy({ where: { id: studentId } });
        })
        .then(affectedRows => {
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }
            res.status(200).json({ message: 'Student and associated records deleted successfully' });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};



exports.getNote = (req, res) => {
    const  studentId  = req.params.id;

    
    Student.findByPk(studentId)
        .then(student => {
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }
           
            return Note.findAll({
                where: { studentId: studentId },
                include: {
                    model: Lesson, 
                    as: 'lesson'   
                }
            })
        .then(notes => {
            if (notes.length === 0) {
                return res.status(404).json({ message: 'No notes found for this student.' });
            }
            return res.status(200).json(notes);
        })
        .catch(error => {
            res.status(500).json({ error: 'An error occurred while fetching notes.' });
        });
    })

};
exports.getStudentLessons = (req, res) => {
    const studentId = req.params.id;

    
    Student.findByPk(studentId)
        .then(student => {
            if (!student) {
                return res.status(404).json({ message: 'Student not found.' });
            }

            
            return StudentLesson.findAll({
                where: { studentId: studentId },
                include: {
                    model: Lesson,
                    as: 'lesson'
                }
            })
        .then(studentLessons => {
            if (studentLessons.length === 0) {
                return res.status(404).json({ message: 'No lessons found for this student.' });
            }
            return res.status(200).json(studentLessons);
        })
        .catch(error => {
            res.status(500).json({ error: 'An error occurred while fetching lessons.' });
        });
    });
};
