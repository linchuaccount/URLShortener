const mongoose = require('mongoose')
const Schema = mongoose.Schema
const URLShortenerSchema = new Schema({
  inputURL: {
    type: String,
    required: true
  },
  randomCode: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('URLShortener', URLShortenerSchema)