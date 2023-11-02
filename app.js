const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurants.json').results

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.kw
  const matchedRestaurants = keyword // keyword存在才進行餐廳篩選，否則等於所有餐廳
    ? restaurants.filter((store) => {
      const trimKeyword = keyword.replace(/\s/g, '').toLowerCase() // 去除所有空格和變小寫
      const name = store.name.toLowerCase().trim()
      const location = store.location.toLowerCase().trim()
      return name.includes(trimKeyword) || location.includes(trimKeyword)
    })
    : restaurants
  res.render('index', { restaurants: matchedRestaurants, keyword })
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((store) => store.id.toString() === id)
  const items = restaurant.menu
  res.render('order-page', { restaurant, items })
})

app.get('/map', (req, res) => {
  res.send('地圖模式(TBC)')
})

app.get('/user-login', (req, res) => {
  res.send('會員登入/註冊頁面(TBC)')
})

app.get('/restaurant/:id/cart', (req, res) => {
  const id = req.params.id
  res.send(`open cart in restaurant: ${id}`)
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
