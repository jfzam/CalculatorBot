'use strict'

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  request = require('request')

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

const token = "EAAMt85OjL0oBABZC69495kbvYByjsEeTPHITp81gXHJZAbg1XZBI4TRNV2i1kLfkWyvRhrQrlGs2dhniLTSWNT9FCWURqRqLB4ZB3BQAKUVT9eZAR013uZBIxhXtfHGhCV8jcxctWvkvGmXBFVXhWVajmlbIaOOEfjmd03kIa3iAZDZD";
app.post('/webhook/', function(req, res) {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            console.log(`sender #${i}. Message: ${text}`)
            sendTextMessage(sender, text + "!");
        }
    }
    res.sendStatus(200);
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
            console.log('Error Response: ', response.body.error)
        }
    })
}
