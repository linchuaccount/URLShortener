const express = require('express')
const router = express.Router()
const URLShortener = require('../../models/URLshortener')
const getRandomCode = require('../../public/javascripts/getRandomCode')

//首頁連結
router.get('/', (req, res) => {
  res.render('index')
})

//產生短網址並將資料存進MonogoDB
router.post('/', (req, res) => {
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
router.get('/:randomCode', (req, res) => {
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

module.exports = router