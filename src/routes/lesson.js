const { Router } = require('express');
const lessonController = require('../controller/lessonController');
const authManager = require('../middleware/manager_check_auth');
const router = Router();

router.get('/lessons',authManager, lessonController.getAllLessons);
router.get('/lessons/:id',authManager, lessonController.getLessonById);
router.post('/lessons',authManager, lessonController.createLesson);
router.post('/lessons/:id/students',authManager,lessonController.addStudentsToLesson)
router.get('/lessons/:id/students',authManager,lessonController.getStudentsInLesson)
router.delete('/lessons/:id/students', authManager,lessonController.deleteStudentFromLesson);
router.patch('/lessons/:id',authManager, lessonController.updateLesson);
router.delete('/lessons/:id',authManager, lessonController.deleteLesson);

module.exports = router;
