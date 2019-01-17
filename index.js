'use strict'

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json())

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

//Home
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/webhook', (req, res) => {
  if(req.query['hub.verify_token'] === 'jayzero_token') {
    res.send(req.query['hub.challenge'])
  }
  else {
    res.send('Wrong token!')
  }
})
