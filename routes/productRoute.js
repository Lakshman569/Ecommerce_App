const express = require('express');
const { createProduct } = require('../controllers/productCtrl');
const router = express.Router();


router.post('/',createProduct);



module.exports = router;