const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const categories = await Category.find({}).sort({ createdAt: 1 });
    res.render('categoriesOverview', {
      title: 'Categories',
      categories
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const [category, products] = await Promise.all([
      Category.findById(req.params.id).sort({ createdAt: 1 }),
      Product.find({ category: req.params.id }).sort({ createdAt: 1 })
    ]);
    res.render('categoryDetail', { title: category.name, category, products });
  })
);

module.exports = router;
