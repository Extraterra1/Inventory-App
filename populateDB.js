#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require('./models/productModel');
const Category = require('./models/categoryModel');

const descriptions = [
  'Elevate your tech game with the latest gadgets, from sleek smartphones to powerful laptops and cutting-edge cameras.',
  'Step into style with our curated collection of trendy clothing, shoes, and accessories that redefine fashion for every occasion.',
  'Transform your living space with our selection of functional and stylish home essentials, from modern furniture to innovative kitchenware and chic decor items.',
  'Embrace an active lifestyle with our range of quality sports equipment and outdoor gear, designed to fuel your passion for adventure and fitness.',
  'Unleash your natural beauty with our premium selection of cosmetics, skincare products, haircare essentials, and personal grooming items, tailored to enhance your radiance.'
];

const products = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createProducts();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name, desc: descriptions[index] });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function productCreate(index, category, name, price, quantity) {
  const productDetail = {
    category,
    name,
    price,
    quantity
  };

  const product = new Product(productDetail);
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}

async function createCategories() {
  console.log('Adding Categories');
  await Promise.all([
    categoryCreate(0, 'Electronics'),
    categoryCreate(1, 'Fashion'),
    categoryCreate(2, 'Home And Kitchen'),
    categoryCreate(3, 'Sports and Outdoors'),
    categoryCreate(4, 'Beauty')
  ]);
}

async function createProducts() {
  console.log('Adding authors');
  await Promise.all([
    productCreate(0, categories[0], 'Smartphone X', 799.99, 20),
    productCreate(1, categories[1], 'Fashionista Jacket', 129.99, 15),
    productCreate(2, categories[2], 'Smart Home Hub', 149.99, 10),
    productCreate(3, categories[3], 'Mountain Bike Pro', 899.99, 8),
    productCreate(4, categories[4], 'Luxury Skincare Set', 59.99, 25),
    productCreate(5, categories[0], 'UltraBook Pro', 1299.99, 12),
    productCreate(6, categories[1], 'Vintage Denim Jeans', 79.99, 30),
    productCreate(7, categories[2], 'Multifunction Blender', 79.99, 18),
    productCreate(8, categories[3], 'Soccer Ball', 19.99, 50),
    productCreate(9, categories[4], 'Natural Glow Serum', 34.99, 40),
    productCreate(10, categories[0], 'Gaming Console', 399.99, 15),
    productCreate(11, categories[1], 'Summer Beach Dress', 49.99, 22),
    productCreate(12, categories[2], 'Coffee Maker Deluxe', 129.99, 10),
    productCreate(13, categories[3], 'Camping Tent', 179.99, 5),
    productCreate(14, categories[4], 'Anti-Aging Night Cream', 44.99, 30)
  ]);
}
