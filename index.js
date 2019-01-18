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

app.get('/webhook/', (req, res) => {
  if(req.query['hub.verify_token'] === 'jayzero_token') {
    res.send(req.query['hub.challenge'])
  }
  else {
    res.send('Wrong token!')
  }
})

const token = "<EAAMt85OjL0oBAHTGez3cQ1ZCUtnTZBsc3RkP7J1JcEr3xJUGLs4RXHwzapYGp0S5kHML6s0ZCIdb5lmC4kloOgyi4AO5spgZA9iOm0E4ROwZBxhntwVgxhB1qZACGLtyk7vBkJtl4QQZCRZCEvQf83hfgsvSYLBIZA6BBBUBxUvazZAQZDZD";
app.post('/webhook/', function(req, res) {
  console.log("requesting for post")
  console.log(req.body)
  console.log(req.body.entry[0].messaging)
    /*var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            sendTextMessage(sender, text + "!");
        }
    }
    res.sendStatus(200);*/
})

function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error:', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
