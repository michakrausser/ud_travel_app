const path = require('path')
const express = require('express')

const app = express()

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

app.use(express.static('dist'))

let trips = {}

console.log(__dirname)

app.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'))
})

app.get('/test', function (req, res) {
  res.send('test OK!');
})

app.post( '/addTrip', requestData );

function requestData( req, res ) {

  console.log( req );

  trips = {
    location: req.body.location,
    country: req.body.country,
    date: req.body.date,
    daysLeft: req.body.daysLeft,
    temperature: req.body.temperature,
    weahterDescription: req.body.weatherDescription,
  }

}

app.listen(3333, function () {
  console.log('Example app listening on port 3333!')
})


module.exports = app;
