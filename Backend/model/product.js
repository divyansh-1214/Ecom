const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  originalPrice: {
    type: Number // Optional
  },
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  features: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    required: [true, 'Sizes are required']
  },
  colors: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
