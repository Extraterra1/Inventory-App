const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.render('categoryOverview', {
      title: 'Categories',
      categories
    });
  })
);

module.exports = router;
