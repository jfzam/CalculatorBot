'use strict'

const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()),
    request = require('request'),
    path = require('path')


app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('/webhook/', (req, res) => {
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Wrong token!')
    }
})

const token = process.env.TOKEN
app.post('/webhook/', (req, res) => {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i]
        var sender = event.sender.id
        if (event.message && event.message.text) {
            var text = event.message.text;
            console.log(`sender #${i}. Message: ${text}`)
            sendTextMessage(sender, text + "!")
        }
    }
    res.sendStatus(200);
})

function sendTextMessage(sender, text) {
    let equation = text
    let res = ''
    let unsupportedOps = ''

    if (equation.replace(/[^^]/g, '').length > 0) {
        unsupportedOps += '^, '
    }
    if (equation.replace(/[^%]/g, '').length > 0) {
        unsupportedOps += '%, '
    }
    if (equation.replace(/[^x]/g, '').length > 0) {
        unsupportedOps += 'x, '
    }
    if (equation.replace(/[^X]/g, '').length > 0) {
        unsupportedOps += 'X, '
    }
    if (equation.replace(/[^=]/g, '').length > 0) {
        unsupportedOps += '=, '
    }
    if (unsupportedOps.length > 0) {
        res = `[ ${unsupportedOps.substr(0, unsupportedOps.length -2)} ] is not supported, use only [ (), *, /, +, - ]`
    } else {
        let eq = equation.replace(/[^0-9+-/*()]/g, '')
        try {
            res = eval(eq)
        } catch (err) {
            res = 'Syntax error'
        }
    }

    var messageData = {
        text: res
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
