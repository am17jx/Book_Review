const express = require('express');
const router = express.Router();
const auth= require('./../controllers/authController');
const comment=require('./../controllers/commentController')


router.post('/comment',auth.protect,comment.CreateComment);
router.get('/comment', auth.protect,comment.getComments);
router.patch('/comment/:id',auth.protect,comment.updateComment);
router.delete('/comment/:id',auth.protect,auth.ChechRole,comment.DeleteComment);


module.exports=router;
