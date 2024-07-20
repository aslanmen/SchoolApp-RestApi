// classRoutes.js

const { Router } = require('express');
const classController = require('../controller/classController');
const authManager = require('../middleware/manager_check_auth')
const router = Router();

router.get('/classes',authManager, classController.getAllClasses);
router.post('/classes', authManager,classController.createClass);
router.post('/classes/:id/student',authManager,classController.addStudent)
router.delete('/classes/:id/student',authManager,classController.deleteStudent)
router.get('/classes/:id', authManager,classController.getClassById);
router.patch('/classes/:id', authManager,classController.updateClass);
router.delete('/classes/:id', authManager,classController.deleteClass);

module.exports = router;
