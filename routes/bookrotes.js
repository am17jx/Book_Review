const express = require('express');
const Bookcontrollers=require('./../controllers/Bookcontrollers');
const router = express.Router();
const auth=require('./../controllers/authController')



router.post('/books', auth.protect, Bookcontrollers.addbook);
router.get('/books', auth.protect, Bookcontrollers.getallbooks);
router.get('/books', auth.protect, Bookcontrollers.getallbooks);
router.patch('/books/:id', auth.protect, Bookcontrollers.updatebook);


router.delete('/books/:id', auth.protect,auth.ChechRole, Bookcontrollers.deletebook);


module.exports=router;
