const mongoose = require('mongoose')

// 如果在 Heroku 環境則使用 process.env.MONGODB_URI
// 否則為本地環境，使用 mongodb://localhost/URL-shortener
const MONOGODB_URI = process.env.MONOGODB_URI || 'mongodb://localhost/URL-shortener'
mongoose.connect(MONOGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db