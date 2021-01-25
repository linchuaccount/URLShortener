const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const URLShortener = require('./models/URLShortener')
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
  let shortURL = 'http://www.localhost:3000'

  const { inputURL } = req.body
  // console.log('1', inputURL)
  URLShortener.findOne({ inputURL })
    .lean()
    .then(URLdata => {
      // console.log('2', URLdata)
      if (URLdata) {
        shortURL += URLdata.randomCode
        return res.render('index', { shortURL })
      }
      else {
        let randomCode = getRandomCode()
        req.body.randomCode = randomCode
        shortURL += randomCode
        // console.log(shortURL)
        // console.log(req.body)
        URLShortener.create({ inputURL, randomCode })
          .then(() => res.render('index', { shortURL }))
          .catch(error => console.log(error))
      }
    })
})

// 導向短網址路由
app.get('/:randomCode', (req, res) => {
  let randomCode = '/' + req.params.randomCode
  // console.log(randomCode)
  return URLShortener.find({ "randomCode": `${randomCode}` })
    .lean()
    .then((URLdata) => {
      // console.log(URLdata)
      let inputURL = URLdata[0].inputURL
      res.redirect(inputURL)
    })
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})