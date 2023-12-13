const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: 1 }).populate('category');
    res.render('productsOverview', {
      title: 'Products',
      products
    });
  })
);

module.exports = router;
