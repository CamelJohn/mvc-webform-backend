const router = require('express/index').Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

router.get('/all', isAuth, userController.getAll);

router.put('/update', isAuth, userController.update);

router.post('/delete', isAuth, userController.delete); 

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */

 /** @route /user/all
 * @method GET
 */

 /** @route /user/update
 * @method PUT
 * @param { role, user: { id, role, email, fullName, isActive, phoneNumber } }
 */

 /** @route /user/delete 
 * @method POST
 * @param { userId , role }
*/