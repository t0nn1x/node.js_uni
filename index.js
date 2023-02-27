const express = require('express');
const app = express();
const hbs = require('hbs');
const request = require('request');
const fs = require('fs');

// Load city data from JSON file
const cities = JSON.parse(fs.readFileSync('cities.json'));

// Register hbs partials and set view engine
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Home page - display list of cities
app.get('/', (req, res) => {
  res.render('cities.hbs', { cities });
});

// Weather page - display weather data for selected city
app.get('/weather/:city', (req, res) => {
  // Find city by name in the cities array
  const city = cities.find((c) => c.name === req.params.city);
  if (!city) {
    return res.status(404).send('City not found');
  }

  // Make request to OpenWeatherMap API to get weather data
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=a274eca313d2d93c72566edf86fe97cb&units=metric`;
  request(url, (error, response, body) => {
    if (error) {
      return res.status(500).send('Error retrieving weather data');
    }
    const data = JSON.parse(body);
    const weather = {
      description: data.weather[0].description,
      temp: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
    };
    res.render('weather.hbs', { city, weather });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});