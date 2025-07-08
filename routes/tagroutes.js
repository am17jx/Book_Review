const express = require('express');
const tagcontrollers=require('./../controllers/tagController');
const auth=require('./../controllers/authController')
const router = express.Router();


router.get('/tag',auth.protect,tagcontrollers.getalltags);
router.post('/tag/:book_id',auth.protect,tagcontrollers.addtags);
router.post('/tag',auth.protect,tagcontrollers.addNewTag);
router.patch('/tag/:book_id/:tag_Id',auth.protect,tagcontrollers.updatetag);

router.delete('/tag/:bookId/:tagId',auth.protect,auth.ChechRole,tagcontrollers.deletetag);
router.delete('/tag/:id',auth.protect,auth.ChechRole,tagcontrollers.deletetypetag);
module.exports = router;
