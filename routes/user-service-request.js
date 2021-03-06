const router = require('express/index').Router();

const userSrContoller = require('../controllers/user-service-request');

router.post('/user-open', userSrContoller.openUser);

router.post('/user-closed', userSrContoller.closedUser);

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */

 /**
  * @route /service-request/user-open
  * @method POST
  * @param { email }
  */
 
  /**
  * @route /service-request/user-closed
  * @method POST
  * @param { email }
  */
 
  