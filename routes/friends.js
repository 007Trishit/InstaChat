const express = require('express'); 
const friendController = require('../controllers/friend_controller');
const passport = require('passport');

const router = express.Router();

router.get('/add/:id',passport.checkAuthentication,friendController.add);

router.get('/remove/:id',passport.checkAuthentication,friendController.remove);

module.exports = router;