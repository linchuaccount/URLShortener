const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortenerSchema = new Schema({
  randomURL: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Shortener', shortenerSchema)