const router = require('express/index').Router();

const bulkSrController = require('../controllers/bulk-service-request');
const srContoller = require('../controllers/crud-service-request');
const userSrContoller = require('../controllers/user-service-request');

const isAuth = require('../middleware/is-auth');

router.get('/all/open', isAuth, bulkSrController.getAllOpen);

router.get('/all/closed', isAuth, bulkSrController.getAllClosed);

router.post('/all/by-email', isAuth, bulkSrController.getAllByUser);

router.post('/all/by-email/open', isAuth, userSrContoller.getOpenedByUser);

router.post('/all/by-email/closed', isAuth, userSrContoller.getClosedByUser);

router.post('/create', isAuth, srContoller.createSr)

router.post('/edit', isAuth, srContoller.editSr);

router.post('/delete',isAuth, srContoller.deleteSr);

module.exports = router;