var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (_req, _res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (_req, res) {
  res.send('Custom router')
})
// define the about route
router.get('/about', function (_req, res) {
  res.send('About custom router')
})

module.exports = router