const router = require('express/index').Router();

const userController = require('../controllers/user');

router.get('/all', userController.getAll);

router.put('/update', userController.update);

router.post('/delete', userController.delete); 

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */

 /** @route /user/getAll
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