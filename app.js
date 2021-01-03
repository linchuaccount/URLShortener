const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Shortener = require('./models/URLshortener')
const getRandomCode = require('./public/javascripts/getRandomCode')

const app = express()
const PORT = 3000

mongoose.connect('mongodb://localhost/URL-shortener', { useNewUrlParser: true, useUnifiedTopology: true })

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//首頁連結
app.get('/', (req, res) => {
  res.render('index')
})

//產生短網址並將資料存進MonogoDB
app.post('/', (req, res) => {
  const randomCode = getRandomCode()
  req.body.randomCode = randomCode
  const shortURL = 'http://www.localhost:3000' + randomCode
  console.log(shortURL)
  // console.log(req.body)
  Shortener.create(req.body)
    .then(() => res.render('index', { shortURL }))
    .catch(error => console.log(error))
})

// 導向短網址路由
app.get('/:randomCode', (req, res) => {
  const randomCode = '/'+ req.params.randomCode
  console.log(randomCode)
  return Shortener.find({"randomCode": `${randomCode}`})
    .lean()
    // .then( (shortURL) => console.log(shortURL[0].inputURL) )
    .then( (shortURL) => {      
      let inputURL = shortURL[0].inputURL
      res.redirect(inputURL)
      })
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})