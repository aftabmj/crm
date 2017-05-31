

var express = require('express')
    excors = require('express-cors');

var router = express.Router();
router.use(excors({
    allowedOrigins: [ 'http://localhost:8082', 'http://frontend-mjcoder.c9users.io:8080','http://frontend-mjcoder.c9users.io'] 
    //, maxAge : 2*60
}));


var bankRequestHandler = require('./controllers/BankController.js'),
    party_controller = require('./controllers/PartyController.js'),
    matter_controller = require('./controllers/MatterController.js'),
    facility_controller = require('./controllers/FacilityController.js');

/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/

// Routes to Da MiddleWare code !!

router.get('/b/:bank_id/branches', bankRequestHandler.getBranchesForBank);

router.post('/a', party_controller.createApplicant);
router.get('/a/:party_id', party_controller.getApplicantById);

router.post('/id', party_controller.createIndependantDefendant);
router.post('/nd', party_controller.createNonIndependantDefendant);

router.get('/c', party_controller.getCandidatesForMatter);

router.post('/m', matter_controller.createMatter);
router.get('/m', matter_controller.getAllMattersSummary);
router.get('/m/:matter_id', matter_controller.getMatterById);

router.post('/f', facility_controller.createFacility);


module.exports = router;