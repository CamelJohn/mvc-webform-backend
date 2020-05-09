const router = require('express/index').Router();

const passwordController = require('../controllers/password');
const isAuth = require('../middleware/is-auth');

router.put('/update', isAuth, passwordController.update);

router.post('/key', isAuth, passwordController.generate);

router.post('/reset', isAuth, passwordController.reset);

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */

/** @route /password/update 
 * @method PUT 
 * @param { id, id2, password }
 */

 /** @route /password/key 
 * @method POST 
 * @param { email }
 */

 /** @route /password/reset
 * @method POST
 * @param { email }
 */
