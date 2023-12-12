const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const [categories, products] = await Promise.all([Category.find(), Product.find()]);
  res.render('index', {
    title: 'Welcome',
    categories: categories.slice(0, 5),
    products: products.slice(0, 5),
    numCategories: categories.length,
    numProducts: products.length
  });
});

module.exports = router;
