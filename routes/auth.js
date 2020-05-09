const router = require('express/index').Router();

const authContorller = require('../controllers/user-auth');

router.post('/login', authContorller.postLogin); 

router.post('/register', authContorller.postRegister);

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */

/** @route /auth/login 
 * @method POST 
 * @param { email, password }
 */

 /** @route /auth/register 
 * @method POST 
 * @param { password, email, name, phoneNumber }
 */