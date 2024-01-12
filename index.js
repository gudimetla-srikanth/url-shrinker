const express = require('express')
const mongoose = require('mongoose')
const ShortLink = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/urlShortener').then(()=>{
  console.log("Database connected successfully")
}).catch(err=>console.log(err))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortLinks = await ShortLink.find()
  res.render('index', { shortLinks: shortLinks })
})

app.post('/shortLinks', async (req, res) => {
  await ShortLink.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortLink', async (req, res) => {
  const shortLink = await ShortLink.findOne({ short: req.params.shortLink })
  if (shortLink == null) return res.sendStatus(404)

  shortLink.clicks++
  shortLink.save()

  res.redirect(shortLink.full)
})

app.listen(process.env.PORT || 5000);