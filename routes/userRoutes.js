const express = require('express');
const router = express.Router();
const auth= require('./../controllers/authController');
const userCont = require('./../controllers/userController')


router.post('/user/signup',auth.signup);
router.post('/user/login',auth.login);
router.get('/user',auth.protect,userCont.GetprofileUser);


module.exports = router;
