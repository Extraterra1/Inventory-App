const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for Product's URL
productSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/products/${this._id}`;
});

module.exports = mongoose.model('Product', productSchema);
