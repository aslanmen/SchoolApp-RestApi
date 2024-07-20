// studentRoutes.js

const { Router } = require('express');
const studentController = require('../controller/studentController');
const authstudent=require('../middleware/student_check_auth')
const authManager=require('../middleware/manager_check_auth')
const upload=require('../helpers/multer')
const router = Router();

router.get('/students',authManager,studentController.getAllStudents);
router.post('/students/signup',authManager,upload.single('profileImage'),studentController.signUp);
router.post('/students/signin', studentController.signIn);
router.get('/students/:id', authManager,studentController.getStudentById);
router.patch('/students/:id',authManager, studentController.updateStudent);
router.delete('/students/:id', authManager,studentController.deleteStudent);
router.get('/students/:id/notes',authstudent, studentController.getNote)
router.get('/students/:id/lessons',authstudent,studentController.getStudentLessons)
module.exports = router;




