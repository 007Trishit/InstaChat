const express = require('express')
const router = express.Router();
const controller = require('../controllers/chatsController');
const passport = require('passport');


router.get('/friend/:to',passport.checkAuthentication,controller.chatter);
router.post('/save',passport.checkAuthentication,controller.save);

module.exports=router;