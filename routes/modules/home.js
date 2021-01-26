const express = require('express')
const router = express.Router()
const URLShortener = require('../../models/URLshortener')
const getRandomCode = require('../../public/javascripts/getRandomCode')

//首頁連結
router.get('/', (req, res) => {
  // console.log('req:', req)
  // console.log(req.headers.host)
  res.render('index')
})

//產生短網址並將資料存進MonogoDB
router.post('/', (req, res) => {
  let shortURL = 'http://www.' + req.headers.host
  const { inputURL } = req.body
  // console.log('1', inputURL, typeof inputURL)
  URLShortener.findOne({ inputURL })
    .lean()
    .then(URLdata => {
      // console.log('2', URLdata, typeof inputURL)
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
      // console.log('3', inputURL, typeof inputURL)
      res.redirect(inputURL)
    })
    .catch(error => console.log(error))
})

module.exports = router