const express = require('express')
var customRouter = require('./customRouter')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(function(_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next();

  });

var myLogger = function (_req, _res, next) {
    console.log('LOGGED: ')
    next()
}

app.use(myLogger)

app.use('/static', express.static('public')) // use prefix '/static' in the request

app.use('/customRouter', customRouter)

app.get('/', (_req, res) => res.send('Hello World!'))
app.get('/json', (_req, res) => res.json({ user: 'tobi1' }))
app.get('/jsonp', (_req, res) => res.json({ user: 'tobi2' }))
app.get('/downloadApple', (_req, res) => res.download('./public/small-red-apple-hi.png'))
app.post('/', (_req, res) => res.send('Got a POST request!'))
app.put('/user', (_req, res) => res.send('Got a PUT request at /user'))
app.delete('/user', (_req, res) => res.send('Got a DELETE request at /user'))

app.route('/book')
  .get(function (_req, res) {
    res.send('Get a random book')
  })
  .post(function (_req, res) {
    res.send('Add a book')
  })
  .put(function (_req, res) {
    res.send('Update the book')
  })


  app.get('/user1/:id', function (req, res, next) {
    // if the user ID is 0, skip to the next route
    if (req.params.id === '0') next('route')
    // otherwise pass the control to the next middleware function in this stack
    else next()
  }, function (req, res, next) {
    // send a regular response
    res.send('regular')
  })
  
  // handler for the /user/:id path, which sends a special response
  app.get('/user1/:id', function (req, res, next) {
    res.send('special')
  })

// define parameters
app.get('/users/:userId/books/:bookId', (req, res) => {
    console.log('"/users/:userId/books/:bookId" was called with params: ', req.params);
    res.send({data: 'success'});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

