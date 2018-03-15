const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://demo:demo@ds125146.mlab.com:25146/savage', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/scoreboard', (req, res) => {
  db.collection('messages').save({}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
  })
})

app.put('/scoreboard', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({}, {
    $set: {
      playerScore:req.body.playerScore + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/scoreboard', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({}, {
    $set: {
      botScore:req.body.botScore + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/scoreboard', (req, res) => {
  db.collection('messages').findOneAndDelete({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
    // res.redirect('/')

  })
})
