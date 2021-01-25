//產生短網址並將資料存進MonogoDB
app.post('/', (req, res) => {
  let shortURL = 'http://www.localhost:3000'

  const { inputURL } = req.body
  URLShortener.find({ "inputURL": `${inputURL}` })
    .lean()
    .then(inputURL => {
      if (inputURL) {
        shortURL += inputURL.randomCode
        return res.render('/', { shortURL })
      }
    })

  return getRandomCode
    .then((randomCode) =>
      console.log(randomCode)
    )

  const randomCode = getRandomCode()
  const { randomCode } = req.body
  shortURL += randomCode
  console.log(shortURL)
  // console.log(req.body)
  URLShortener.create({ inputURL, randomCode })
    .then(() => res.render('index', { shortURL }))
    .catch(error => console.log(error))
})

// 導向短網址路由
app.get('/:randomCode', (req, res) => {
  const randomCode = '/' + req.params.randomCode
  console.log(randomCode)
  return URLShortener.find({ "randomCode": `${randomCode}` })
    .lean()
    .then((shortURL) => console.log(shortURL[0].inputURL))
  // .then((shortURL) => {
  //   let inputURL = shortURL[0].inputURL
  //   res.redirect(inputURL)
})
  .catch(error => console.log(error))
})