const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const ObjectId = require('mongoose').Types.ObjectId;
const { body, validationResult } = require('express-validator');
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

router.post('/create', [
  body('name', 'Name must be between 3 and 20 chars long').trim().isLength({ min: 3, max: 20 }),
  body('desc', 'Description must be at least 3 chars long').trim().isLength({ min: 3 }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newCategory = new Category({ name: req.body.name, desc: req.body.desc });
    if (!errors.isEmpty()) return res.render('categoryCreate', { title: 'Create New Category', category: newCategory, errors: errors.array() });

    await newCategory.save();

    res.redirect(newCategory.url);
  })
]);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const [category, products] = await Promise.all([Category.findById(req.params.id), Product.find({ category: req.params.id }).sort({ createdAt: 1 })]);

    // Check if category exists
    if (!category) return next(new Error('Category not found'));
    res.render('categoryDetail', { title: category.name, category, products });
  })
);

router.get(
  '/:id/edit',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const category = await Category.findById(req.params.id);

    // Check if category exists
    if (!category) return next(new Error('Category not found'));
    res.render('categoryCreate', { title: 'Edit ' + category.name, category });
  })
);

router.post('/:id/edit', [
  body('name', 'Name must be between 3 and 20 chars long').trim().isLength({ min: 3, max: 20 }),
  body('desc', 'Description must be at least 3 chars long').trim().isLength({ min: 3 }),
  asyncHandler(async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));
    const errors = validationResult(req);
    const newCategory = new Category({ name: req.body.name, desc: req.body.desc, _id: req.params.id });
    if (!errors.isEmpty()) return res.render('categoryCreate', { title: 'Edit ' + newCategory.name, category: newCategory, errors: errors.array() });

    await Category.findByIdAndUpdate(req.params.id, newCategory);

    res.redirect(newCategory.url);
  })
]);

router.get(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const [category, products] = await Promise.all([Category.findById(req.params.id), Product.find({ category: req.params.id }).sort({ createdAt: 1 })]);

    // Check if category exists
    if (!category) return next(new Error('Category not found'));
    res.render('categoryDelete', { title: 'Delete ' + category.name, category, products });
  })
);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const [category, products] = await Promise.all([Category.findById(req.params.id), Product.find({ category: req.params.id }).sort({ createdAt: 1 })]);
    if (products.length > 0) return res.render('categoryDelete', { title: 'Delete ' + category.name, category, products });

    // Check if category exists
    if (!category) return next(new Error('Category not found'));

    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
  })
);

module.exports = router;
