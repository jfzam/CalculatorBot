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
