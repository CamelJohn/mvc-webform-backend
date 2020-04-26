const router = require('express/index').Router();

const srContoller = require('../controllers/crud-service-request');

router.post('/create', srContoller.create)

router.post('/edit', srContoller.update);

router.post('/delete', srContoller.delete);

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */
 
  /**
  * @route /service-request/create
  * @method POST
  * @param { mainCategory, subCategory, title, fullName, id, emailAddress, phoneNumber, description, impact, klhModule }
  */

  /**
  * @route /service-request/edit
  * @method POST
  * @param { srId }
  */
  
  /**
  * @route /service-request/delete
  * @method POST
  * @param { srId }
  */
  
