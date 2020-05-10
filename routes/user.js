const router = require('express/index').Router();

const authContorller = require('../controllers/user-auth');
const userController = require('../controllers/user')
const passwordController = require('../controllers/password');

const isAuth = require('../middleware/is-auth');

router.post('/auth/login', authContorller.postLogin); 

router.post('/auth/register', authContorller.postRegister);

router.put('/password/update', isAuth, passwordController.update);

router.post('/password/key', isAuth, passwordController.generate);

router.post('/password/reset', isAuth, passwordController.reset);

router.get('/all', isAuth, userController.getAllUsers);

router.post('/delete', isAuth, userController.deleteUser);

router.put('/update', isAuth, userController.updateUser);

module.exports = router;