const router = require('express/index').Router();

const passwordController = require('../controllers/password');

router.put('/update', passwordController.update);

router.post('/key', passwordController.generate);

router.post('/reset', passwordController.reset);

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
