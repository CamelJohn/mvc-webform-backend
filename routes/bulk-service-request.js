const router = require('express/index').Router();

const bulkSrController = require('../controllers/bulk-service-request');

router.get('/open', bulkSrController.allOpen);

router.get('/closed', bulkSrController.allClosed);

router.post('/by-email', bulkSrController.allUser);

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
  