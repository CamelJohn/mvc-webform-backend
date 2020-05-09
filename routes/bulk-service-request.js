const router = require('express/index').Router();

const bulkSrController = require('../controllers/bulk-service-request');
const isAuth = require('../middleware/is-auth');

router.get('/open', isAuth, bulkSrController.getAllOpen);

router.get('/closed', isAuth, bulkSrController.getAllClosed);

router.post('/by-email', isAuth, bulkSrController.getAllByUser);

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */

 /**
  * @route /bulk-service-request/open
  * @method GET
  */
 
  /**
  * @route /bulk-service-request/closed
  * @method GET
  */
  
  
  /**
  * @route /bulk-service-request/by-email
  * @method POST
  * @param { email }
  */
  