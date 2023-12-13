const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const ObjectId = require('mongoose').Types.ObjectId;
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
  '/create',
  asyncHandler((req, res, next) => {
    res.render('categoryCreate', { title: 'Create New Category' });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const [category, products] = await Promise.all([
      Category.findById(req.params.id).sort({ createdAt: 1 }),
      Product.find({ category: req.params.id }).sort({ createdAt: 1 })
    ]);

    // Check if category exists
    if (!category) return next(new Error('Category not found'));
    res.render('categoryDetail', { title: category.name, category, products });
  })
);

module.exports = router;
