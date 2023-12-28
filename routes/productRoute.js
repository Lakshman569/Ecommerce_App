const express = require('express');
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct } = require('../controllers/productCtrl');
const router = express.Router();

const {isAdmin,authMiddleware} = require('../middlewares/authMidlleware');


router.post('/',authMiddleware,isAdmin,createProduct);
router.get('/:id',getaProduct);
router.put('/:id',authMiddleware,isAdmin,updateProduct);
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);

router.get('/',getAllProduct);



module.exports = router;