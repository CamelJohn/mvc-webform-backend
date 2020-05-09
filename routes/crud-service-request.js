const router = require('express/index').Router();

const srContoller = require('../controllers/crud-service-request');
const isAuth = require('../middleware/is-auth');

router.post('/create', isAuth, srContoller.createSr)

router.post('/edit', isAuth, srContoller.editSr);

router.post('/delete',isAuth, srContoller.deleteSr);

module.exports = router;

/** @param { Documentation form the routes above }
 *  @author Jonathan Atia
 */
 
  /**
  * @route /service-request/create
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
  
