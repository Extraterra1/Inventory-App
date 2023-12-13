const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel.js');

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

router.get(
  '/create',
  asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 });
    res.render('productCreate', { title: 'Create New Product', categories });
  })
);

module.exports = router;
