const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: Object, 
    required: true
  }
}, { timestamps: true })


module.exports = mongoose.model('Blog', blogSchema)
