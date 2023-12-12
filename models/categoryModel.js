const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 20
  },
  desc: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for Category URL
categorySchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/categories/${this._id}`;
});

module.exports = mongoose.model('Category', categorySchema);
