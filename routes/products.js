const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
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

router.post('/create', [
  body('name', 'Name must be between 3 and 20 chars long').trim().isLength({ min: 3, max: 20 }),
  body('price')
    .trim()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0')
    .notEmpty()
    .withMessage('Price cannot be empty'),
  body('quantity')
    .trim()
    .isInt()
    .withMessage('Quantity must be an integer')
    .isInt({ min: 1 })
    .withMessage('Quantity must be greater than 0')
    .notEmpty()
    .withMessage('Quantity cannot be empty'),
  body('category', 'Invalid Category').trim().isMongoId(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newProduct = new Product({ name: req.body.name, price: req.body.price, quantity: req.body.quantity, category: req.body.category });
    const categories = await Category.find().sort({ name: 1 });
    if (!errors.isEmpty()) return res.render('productCreate', { title: 'Create New Product', product: newProduct, errors: errors.array(), categories });

    await newProduct.save();

    res.redirect(newProduct.url);
  })
]);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const product = await Product.findById(req.params.id).populate('category');

    // Check if product exists
    if (!product) return next(new Error('Product not found'));
    res.render('productDetail', { title: product.name, product });
  })
);

router.get(
  '/:id/edit',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const [product, categories] = await Promise.all([Product.findById(req.params.id), Category.find().sort({ name: 1 })]);

    // Check if product exists
    if (!product) return next(new Error('Product not found'));
    res.render('productCreate', { title: 'Edit ' + product.name, product, categories });
  })
);

router.post('/:id/edit', [
  body('name', 'Name must be between 3 and 20 chars long').trim().isLength({ min: 3, max: 20 }),
  body('price')
    .trim()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0')
    .notEmpty()
    .withMessage('Price cannot be empty'),
  body('quantity')
    .trim()
    .isInt()
    .withMessage('Quantity must be an integer')
    .isInt({ min: 1 })
    .withMessage('Quantity must be greater than 0')
    .notEmpty()
    .withMessage('Quantity cannot be empty'),
  body('category', 'Invalid Category').trim().isMongoId(),
  asyncHandler(async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));
    const errors = validationResult(req);
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      _id: req.params.id
    });
    const categories = await Category.find().sort({ name: 1 });
    if (!errors.isEmpty()) {
      const product = await Product.findById(req.params.id);
      return res.render('productCreate', {
        title: 'Edit ' + product.name,
        product,
        errors: errors.array(),
        categories
      });
    }

    await Product.findByIdAndUpdate(req.params.id, newProduct);

    res.redirect(newProduct.url);
  })
]);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    // Check if valid object id
    if (!ObjectId.isValid(req.params.id)) return next(new Error('Invalid ID'));

    const product = await Product.findByIdAndDelete(req.params.id);

    // Check if product exists
    if (!product) return next(new Error('Product not found'));
    res.redirect('/products');
  })
);

module.exports = router;
