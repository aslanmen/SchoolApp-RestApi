// managerRoutes.js

const { Router } = require('express');
const managerController = require('../controller/managerController');
const authManager=require('../middleware/manager_check_auth')




const router = Router();

router.get('/managers',authManager,managerController.getAllManagers);
router.post('/managers/signup',managerController.signUp);
router.post('/managers/signin', managerController.signIn);
router.get('/managers/:id',authManager, managerController.getManagerById);
router.patch('/managers/:id', authManager,managerController.updateManager);
router.delete('/managers/:id',authManager, managerController.deleteManager);

module.exports = router;




